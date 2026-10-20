/**
 * Svaraya Web Audio Processing Engine
 *
 * Professional client-side DSP pipeline & multi-format export suite:
 * - Real audio file decoding via Web Audio API
 * - Authentic peak extraction for genuine waveform visualization
 * - Native BPM / Tempo detection from decoded PCM energy autocorrelation
 * - Audio buffer trimming and slicing (Cutter / Trimmer utility), applied at the source
 * - Varispeed pitch shifting (440 Hz → 432 Hz is a 432/440 playback-rate change)
 * - Calibrated discrete Bass Boost low-shelf levels (Light +3.5dB, Moderate +7dB, Heavy +10.5dB, Extreme +15dB)
 * - Synthesised convolution reverbs with damping, pre-delay and equal-power dry/wet
 * - 3-Band Parametric Equalizer (Low-Shelf, Mid-Peaking, High-Shelf)
 * - Auto-Panner / 8D orbit with a real LFO, and static stereo balance
 * - Volume / Gain amplifier and attenuator (-18dB to +12dB)
 * - Peak normalisation and a true look-ahead sample-peak limiter (not LUFS)
 * - Multi-format exporters:
 *   - WAV (16-bit, 24-bit, 32-bit float PCM)
 *   - MP3 (128, 192, 256, 320 kbps via lamejs)
 *   - AIFF (16-bit, 24-bit big-endian PCM)
 * - Natural-language sound request matcher mapped directly to supported DSP presets
 */

import lamejs from "lamejs";
import MPEGMode from "lamejs/src/js/MPEGMode.js";
import Lame from "lamejs/src/js/Lame.js";
import BitStream from "lamejs/src/js/BitStream.js";

/**
 * lamejs 1.2.1 compiles its sources into files that reference `MPEGMode`,
 * `Lame` and `BitStream` as bare identifiers (leftovers from the originally
 * concatenated browser bundle). Under any modern module system those names are
 * undefined, so `new lamejs.Mp3Encoder(...)` would throw
 * "MPEGMode is not defined" — i.e. MP3 export was broken at runtime.
 * Re-exposing them on the global object is the canonical fix.
 */
if (typeof globalThis !== "undefined") {
  const g = globalThis as Record<string, unknown>;
  g.MPEGMode = g.MPEGMode ?? MPEGMode;
  g.Lame = g.Lame ?? Lame;
  g.BitStream = g.BitStream ?? BitStream;
}
import type { EffectValues } from "@/types/preset";
import { DEFAULT_EXPORT_CONFIG } from "@/types/export";
import type { ExportConfig } from "@/types/export";
import {
  MAX_OUTPUT_SECONDS,
  computeRenderSignature,
  resolveProcessing,
} from "@/lib/audio/dsp-plan";
import type { EchoSpec, FilterSpec, PanSpec, ReverbSpec } from "@/lib/audio/dsp-plan";
import {
  applyLookaheadLimiter,
  applyPeakNormalize,
  downmixChannels,
  float80Bytes,
  resampleChannels,
  sanitizeChannels,
} from "@/lib/audio/dsp-utils";

export interface DecodedAudio {
  buffer: AudioBuffer;
  peaks: number[];
  duration: number;
  sampleRate: number;
  numberOfChannels: number;
  detectedBpm?: number;
}

export interface ProcessedAudioResult {
  blob: Blob;
  url: string;
  duration: number;
  sampleRate: number;
  channels: number;
  format: string;
  bitDepthOrBitrate: string;
  sizeBytes: number;
  filename: string;
  isPeakProtected: boolean;
  isNormalized: boolean;
  /** Identifies the exact preset + settings + export config used for this render. */
  signature: string;
  /** Largest gain reduction from the look-ahead limiter, in dB (0 = untouched). */
  limiterReductionDb: number;
  /** Peak-normalisation make-up gain, in dB (0 = none applied). */
  normalizeDb: number;
}

let sharedAudioContext: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (typeof window === "undefined") {
    throw new Error("Web Audio API is only available in the browser.");
  }
  if (!sharedAudioContext || sharedAudioContext.state === "closed") {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    sharedAudioContext = new AudioContextClass();
  }
  return sharedAudioContext;
}

/**
 * Autocorrelation BPM detection algorithm from decoded PCM samples.
 */
export function detectAudioBpm(buffer: AudioBuffer): number {
  try {
    const channelData = buffer.getChannelData(0);
    const sampleRate = buffer.sampleRate;

    // Downsample to ~2205 Hz for fast tempo analysis
    const downsampleFactor = Math.max(1, Math.floor(sampleRate / 2205));
    const maxSamples = Math.min(channelData.length, Math.floor(sampleRate * 45)); // analyze up to first 45 sec
    const downsampledLength = Math.floor(maxSamples / downsampleFactor);
    const downsampled = new Float32Array(downsampledLength);

    for (let i = 0; i < downsampledLength; i++) {
      downsampled[i] = channelData[i * downsampleFactor];
    }

    // Energy envelope extraction
    const envelope = new Float32Array(downsampledLength);
    let env = 0;
    for (let i = 0; i < downsampledLength; i++) {
      const s = Math.abs(downsampled[i]);
      env = Math.max(s, env * 0.985);
      envelope[i] = env;
    }

    // Autocorrelation over lag corresponding to 65 to 185 BPM
    const effectiveSampleRate = sampleRate / downsampleFactor;
    const minLag = Math.floor((effectiveSampleRate * 60) / 185);
    const maxLag = Math.floor((effectiveSampleRate * 60) / 65);

    let bestLag = minLag;
    let maxCorr = -1;

    for (let lag = minLag; lag <= maxLag; lag += 2) {
      let sum = 0;
      const len = Math.min(downsampledLength - lag, 3500);
      for (let i = 0; i < len; i += 4) {
        sum += envelope[i] * envelope[i + lag];
      }
      if (sum > maxCorr) {
        maxCorr = sum;
        bestLag = lag;
      }
    }

    const detected = Math.round((effectiveSampleRate * 60) / bestLag);
    return Math.min(190, Math.max(65, detected));
  } catch (err) {
    console.warn("BPM detection fallback:", err);
    return 120;
  }
}

/**
 * Decodes an uploaded Audio file into an AudioBuffer and computes genuine amplitude peaks & BPM.
 */
export async function decodeAudioFile(file: File, peakBuckets = 72): Promise<DecodedAudio> {
  const audioCtx = getAudioContext();
  if (audioCtx.state === "suspended") {
    await audioCtx.resume();
  }

  const arrayBuffer = await file.arrayBuffer();
  const decodedBuffer = await audioCtx.decodeAudioData(arrayBuffer.slice(0));

  // Compute real normalized peaks from channel 0
  const channelData = decodedBuffer.getChannelData(0);
  const totalSamples = channelData.length;
  const bucketSize = Math.max(1, Math.floor(totalSamples / peakBuckets));
  const peaks: number[] = new Array(peakBuckets).fill(0);

  for (let i = 0; i < peakBuckets; i++) {
    const start = i * bucketSize;
    const end = Math.min(start + bucketSize, totalSamples);
    let max = 0;
    for (let j = start; j < end; j++) {
      const abs = Math.abs(channelData[j]);
      if (abs > max) max = abs;
    }
    peaks[i] = max;
  }

  const maxPeak = Math.max(...peaks, 0.001);
  const normalizedPeaks = peaks.map((p) => Math.max(0.08, Math.min(1, p / maxPeak)));

  // Calculate BPM
  const bpm = detectAudioBpm(decodedBuffer);

  return {
    buffer: decodedBuffer,
    peaks: normalizedPeaks,
    duration: decodedBuffer.duration,
    sampleRate: decodedBuffer.sampleRate,
    numberOfChannels: decodedBuffer.numberOfChannels,
    detectedBpm: bpm,
  };
}

/** Thrown when the caller asks to discard an in-flight render. */
export class ProcessingCancelledError extends Error {
  constructor() {
    super("Processing was cancelled.");
    this.name = "ProcessingCancelledError";
  }
}

export interface RenderOptions {
  /** Real pipeline stages only — no timers, no estimates. */
  onProgress?: (progress: number, status: string) => void;
  /** Polled between stages. `startRendering()` itself cannot be aborted. */
  isCancelled?: () => boolean;
}

function clampNumber(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function formatDuration(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return "unknown";
  const minutes = Math.floor(seconds / 60);
  const rest = Math.round(seconds % 60);
  return minutes > 0 ? `${minutes} min ${rest} s` : `${rest} s`;
}

/** OfflineAudioContext only accepts sane, finite rates. */
function sampleRateForRender(rate: number): number {
  if (!Number.isFinite(rate) || rate < 8000 || rate > 96000) return 48000;
  return Math.round(rate);
}

/** Small deterministic PRNG so an impulse response is identical every render. */
function mulberry32(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Synthesises a stereo impulse response.
 *
 * - exponential decay reaching −60 dB exactly at `durationSeconds`
 * - sparse early reflections in the first 70 ms
 * - decorrelated left/right noise for a wide but mono-compatible tail
 * - one-pole damping so the tail darkens over time instead of hissing
 * - 2 ms fades at both ends to avoid clicks
 * - total energy normalised to 1, so `convolver.normalize = false` keeps the
 *   wet level predictable across room sizes
 */
function createImpulseResponse(
  ctx: BaseAudioContext,
  durationSeconds: number,
  damping = 0.35
): AudioBuffer {
  const sampleRate = ctx.sampleRate;
  const seconds = clampNumber(durationSeconds, 0.2, 12);
  const length = Math.max(1, Math.floor(sampleRate * seconds));
  const impulse = ctx.createBuffer(2, length, sampleRate);
  const decayRate = Math.log(1000) / seconds;

  const reflectionTimes = [0.011, 0.019, 0.031, 0.047, 0.068];
  const reflectionGains = [0.55, -0.42, 0.33, -0.26, 0.19];
  const smoothing = clampNumber(1 - 0.92 * clampNumber(damping, 0, 1), 0.05, 1);

  for (let channel = 0; channel < 2; channel++) {
    const data = impulse.getChannelData(channel);
    const random = mulberry32(0x5f3a + channel * 7919);
    let lowPassed = 0;

    for (let i = 0; i < length; i++) {
      const envelope = Math.exp((-decayRate * i) / sampleRate);
      const noise = random() * 2 - 1;
      lowPassed += (noise - lowPassed) * smoothing;
      data[i] = lowPassed * envelope;
    }

    for (let r = 0; r < reflectionTimes.length; r++) {
      const index = Math.floor((reflectionTimes[r] + channel * 0.003) * sampleRate);
      if (index < length) {
        data[index] += reflectionGains[r] * (channel === 0 ? 1 : 0.85);
      }
    }

    const fade = Math.min(Math.floor(sampleRate * 0.002), Math.floor(length / 2));
    for (let i = 0; i < fade; i++) {
      const gain = i / fade;
      data[i] *= gain;
      data[length - 1 - i] *= gain;
    }
  }

  let energy = 0;
  for (let channel = 0; channel < 2; channel++) {
    const data = impulse.getChannelData(channel);
    for (let i = 0; i < length; i++) energy += data[i] * data[i];
  }
  if (energy > 1e-9) {
    const scale = 1 / Math.sqrt(energy);
    for (let channel = 0; channel < 2; channel++) {
      const data = impulse.getChannelData(channel);
      for (let i = 0; i < length; i++) data[i] *= scale;
    }
  }

  return impulse;
}

/**
 * Saturation transfer curve: normalised tanh.
 *
 * `drive` grows with the amount control, and dividing by `tanh(drive)` maps
 * ±1 input to ±1 output, so the shaper can never add hard clipping on its own.
 */
function makeDistortionCurve(amount: number): Float32Array<ArrayBuffer> {
  const drive = 1 + clampNumber(amount, 0, 100) * 0.09;
  const samples = 4096;
  const curve = new Float32Array(new ArrayBuffer(samples * 4));
  const norm = Math.tanh(drive);

  for (let i = 0; i < samples; i++) {
    const x = (i * 2) / (samples - 1) - 1;
    curve[i] = Math.tanh(x * drive) / norm;
  }
  return curve;
}

/**
 * Builds an AudioBuffer from plain channel data. Avoids depending on a live
 * AudioContext and works in browsers where `new AudioBuffer()` is unsupported.
 */
function createPcmBuffer(channels: Float32Array[], sampleRate: number): AudioBuffer {
  const length = channels[0]?.length ?? 0;
  let buffer: AudioBuffer | null = null;

  if (typeof AudioBuffer !== "undefined") {
    try {
      buffer = new AudioBuffer({
        length,
        numberOfChannels: channels.length,
        sampleRate,
      });
    } catch {
      buffer = null;
    }
  }
  if (!buffer) {
    const context = new OfflineAudioContext(channels.length, 1, sampleRate);
    buffer = context.createBuffer(channels.length, length, sampleRate);
  }

  for (let channel = 0; channel < channels.length; channel++) {
    buffer.getChannelData(channel).set(channels[channel]);
  }
  return buffer;
}

/**
 * Copies the trimmed region in reverse at the source's own rate.
 *
 * Reversing at source rate keeps the copy sample-exact; the AudioBufferSourceNode
 * then resamples it to the render rate with its own high-quality resampler.
 */
function createReversedSegment(
  ctx: BaseAudioContext,
  input: AudioBuffer,
  startSeconds: number,
  seconds: number
): AudioBuffer {
  const sourceRate = input.sampleRate;
  const startFrame = clampNumber(Math.round(startSeconds * sourceRate), 0, input.length - 1);
  const frames = Math.max(1, Math.min(Math.floor(seconds * sourceRate), input.length - startFrame));
  const buffer = ctx.createBuffer(input.numberOfChannels, frames, sourceRate);

  for (let channel = 0; channel < input.numberOfChannels; channel++) {
    const source = input.getChannelData(channel);
    const target = buffer.getChannelData(channel);
    for (let i = 0; i < frames; i++) {
      target[i] = source[startFrame + frames - 1 - i];
    }
  }
  return buffer;
}

/** Chains biquad filters in the order declared by the preset plan. */
function connectFilters(
  ctx: BaseAudioContext,
  input: AudioNode,
  specs: FilterSpec[]
): AudioNode {
  let node = input;
  for (const spec of specs) {
    const filter = ctx.createBiquadFilter();
    filter.type = spec.type;
    filter.frequency.value = clampNumber(spec.frequency, 20, 20000);
    if (spec.q != null) filter.Q.value = clampNumber(spec.q, 0.0001, 40);
    if (spec.gain != null) filter.gain.value = clampNumber(spec.gain, -40, 40);
    node.connect(filter);
    node = filter;
  }
  return node;
}

/**
 * Reverb send: optional pre-delay → convolution with a normalised IR →
 * high-pass (removes low-frequency mud from the tail) → damping low-pass.
 */
function buildReverbBranch(
  ctx: BaseAudioContext,
  input: AudioNode,
  spec: ReverbSpec
): AudioNode {
  let node = input;

  if (spec.preDelaySeconds > 0.001) {
    const preDelay = ctx.createDelay(0.5);
    preDelay.delayTime.value = clampNumber(spec.preDelaySeconds, 0, 0.45);
    node.connect(preDelay);
    node = preDelay;
  }

  const convolver = ctx.createConvolver();
  convolver.normalize = false;
  convolver.buffer = createImpulseResponse(ctx, spec.decaySeconds, spec.damping);
  node.connect(convolver);

  const highPass = ctx.createBiquadFilter();
  highPass.type = "highpass";
  highPass.frequency.value = 120;
  highPass.Q.value = 0.707;
  convolver.connect(highPass);

  const damping = ctx.createBiquadFilter();
  damping.type = "lowpass";
  damping.frequency.value = clampNumber(16000 - spec.damping * 12000, 2500, 18000);
  damping.Q.value = 0.707;
  highPass.connect(damping);

  return damping;
}

/**
 * Ping-pong delay. The send is forced to mono, the first repeat lands on the
 * left, then each repeat alternates sides while a < 1 feedback gain decays it.
 */
function buildEchoBranch(
  ctx: BaseAudioContext,
  input: AudioNode,
  spec: EchoSpec,
  destination: AudioNode
): void {
  const send = ctx.createGain();
  send.gain.value = clampNumber(spec.wet, 0, 1) * 0.9;

  const sendFilter = ctx.createBiquadFilter();
  sendFilter.type = "highpass";
  sendFilter.frequency.value = 180;
  sendFilter.Q.value = 0.707;
  input.connect(sendFilter);
  sendFilter.connect(send);

  const makeDelay = () => {
    const delay = ctx.createDelay(5);
    delay.delayTime.value = clampNumber(spec.timeSeconds, 0.02, 4);
    delay.channelCount = 1;
    delay.channelCountMode = "explicit";
    delay.channelInterpretation = "speakers";
    return delay;
  };

  const leftDelay = makeDelay();
  const rightDelay = makeDelay();

  const leftPan = ctx.createStereoPanner();
  leftPan.pan.value = -0.85;
  const rightPan = ctx.createStereoPanner();
  rightPan.pan.value = 0.85;

  const feedback = ctx.createGain();
  feedback.gain.value = clampNumber(spec.feedback, 0, 0.85);

  const returnGain = ctx.createGain();
  returnGain.gain.value = 0.8;

  // Send → L, L → R, R → feedback → L. Each feedback cycle is 2 × delay time.
  send.connect(leftDelay);
  leftDelay.connect(leftPan);
  rightDelay.connect(rightPan);
  leftDelay.connect(rightDelay);
  rightDelay.connect(feedback);
  feedback.connect(leftDelay);

  leftPan.connect(returnGain);
  rightPan.connect(returnGain);
  returnGain.connect(destination);
}

/** Mid/side width control. k = 1 is identity, k < 1 narrows, k > 1 widens. */
function buildWidthBranch(ctx: BaseAudioContext, input: AudioNode, width: number): AudioNode {
  const splitter = ctx.createChannelSplitter(2);
  const merger = ctx.createChannelMerger(2);
  input.connect(splitter);

  const mid = ctx.createGain();
  mid.gain.value = 0.5;
  splitter.connect(mid, 0);
  splitter.connect(mid, 1);
  mid.connect(merger, 0, 0);
  mid.connect(merger, 0, 1);

  const side = ctx.createGain();
  const sideLeft = ctx.createGain();
  sideLeft.gain.value = 0.5;
  const sideRight = ctx.createGain();
  sideRight.gain.value = -0.5;
  splitter.connect(sideLeft, 0);
  splitter.connect(sideRight, 1);
  sideLeft.connect(side);
  sideRight.connect(side);

  const toLeft = ctx.createGain();
  toLeft.gain.value = width;
  const toRight = ctx.createGain();
  toRight.gain.value = -width;
  side.connect(toLeft);
  side.connect(toRight);
  toLeft.connect(merger, 0, 0);
  toRight.connect(merger, 0, 1);

  return merger;
}

/** Static balance or an LFO-driven orbit/auto pan. */
function buildPanBranch(ctx: BaseAudioContext, input: AudioNode, spec: PanSpec): AudioNode {
  const panner = ctx.createStereoPanner();
  input.connect(panner);

  if (spec.mode === "static") {
    panner.pan.value = clampNumber(spec.value, -1, 1);
    return panner;
  }

  panner.pan.value = 0;
  const oscillator = ctx.createOscillator();
  oscillator.type = "sine";
  oscillator.frequency.value = 1 / clampNumber(spec.cycleSeconds, 0.5, 30);

  const depth = ctx.createGain();
  depth.gain.value = spec.mode === "orbit" ? 0.92 : 0.8;

  oscillator.connect(depth);
  depth.connect(panner.pan);
  oscillator.start(0);

  return panner;
}

/**
 * Renders an AudioBuffer through the resolved DSP plan and encodes it using the
 * requested export configuration.
 *
 * Signal order (documented so the UI copy can match reality):
 * source → varispeed → filters → saturation → output gain →
 * dry + reverb wet + echo wet → width → pan → destination.
 */
export async function renderProcessedAudio(
  inputBuffer: AudioBuffer,
  presetId: string | null,
  effectValues: EffectValues,
  originalFileName: string,
  exportConfig?: Partial<ExportConfig>,
  options?: RenderOptions
): Promise<ProcessedAudioResult> {
  const report = (progress: number, status: string) => options?.onProgress?.(progress, status);
  const assertActive = () => {
    if (options?.isCancelled?.()) throw new ProcessingCancelledError();
  };

  if (typeof window === "undefined") {
    throw new Error("Audio processing requires a browser environment.");
  }
  if (!inputBuffer || inputBuffer.length === 0 || inputBuffer.numberOfChannels === 0) {
    throw new Error("The decoded audio is empty. Try a different file.");
  }

  const config: ExportConfig = { ...DEFAULT_EXPORT_CONFIG, ...exportConfig };
  if (config.format === "opus") {
    throw new Error("Opus export is not available yet. Choose WAV, AIFF, or MP3.");
  }

  report(0.02, "Reading source audio…");
  assertActive();

  const plan = resolveProcessing(presetId, effectValues);
  const sourceDuration = inputBuffer.duration;
  const renderRate = sampleRateForRender(inputBuffer.sampleRate);

  const trimStart = clampNumber(plan.trim?.start ?? 0, 0, Math.max(0, sourceDuration - 0.01));
  const trimEnd = clampNumber(plan.trim?.end ?? sourceDuration, trimStart, sourceDuration);
  const trimmedSeconds = trimEnd - trimStart;
  if (trimmedSeconds < 0.02) {
    throw new Error("The trim range is too short to render. Move the trim handles further apart.");
  }

  const plannedSeconds = trimmedSeconds / plan.playbackRate + plan.tailSeconds;
  if (plannedSeconds > MAX_OUTPUT_SECONDS) {
    throw new Error(
      `This render would be ${formatDuration(plannedSeconds)} long, above the ${formatDuration(
        MAX_OUTPUT_SECONDS
      )} limit. Shorten the clip or use a less extreme slowdown.`
    );
  }

  const targetRate = config.sampleRate === 0 ? renderRate : config.sampleRate;
  const graphChannels = plan.mono
    ? 1
    : inputBuffer.numberOfChannels > 1 || plan.needsStereo
      ? 2
      : 1;
  const finalChannels = plan.mono || config.channels === "mono" ? 1 : graphChannels;

  const maxFrames = 48_000 * MAX_OUTPUT_SECONDS;
  const renderFrames = Math.ceil(plannedSeconds * renderRate);
  const outputFrames = Math.ceil(plannedSeconds * targetRate);
  if (renderFrames > maxFrames || outputFrames > maxFrames) {
    throw new Error(
      `Rendering this clip at ${(targetRate / 1000).toFixed(1)} kHz would exceed the memory limit. ` +
        "Choose a lower sample rate or a shorter selection."
    );
  }

  report(0.08, "Building the effect chain…");
  assertActive();

  const offline = new OfflineAudioContext(
    graphChannels,
    Math.max(1, renderFrames),
    renderRate
  );

  const source = offline.createBufferSource();
  source.buffer = plan.reverse
    ? createReversedSegment(offline, inputBuffer, trimStart, trimmedSeconds)
    : inputBuffer;
  source.playbackRate.value = plan.playbackRate;

  let node: AudioNode = source;
  node = connectFilters(offline, node, plan.filters);

  if (plan.saturation > 0) {
    const shaper = offline.createWaveShaper();
    shaper.curve = makeDistortionCurve(plan.saturation);
    shaper.oversample = "4x";
    node.connect(shaper);
    node = shaper;
  }

  if (Math.abs(plan.outputGainDb) > 0.001) {
    const gain = offline.createGain();
    gain.gain.value = Math.pow(10, plan.outputGainDb / 20);
    node.connect(gain);
    node = gain;
  }

  const bus = offline.createGain();
  if (plan.reverb) {
    const dry = offline.createGain();
    dry.gain.value = Math.cos((plan.reverb.wet * Math.PI) / 2);
    const wet = offline.createGain();
    wet.gain.value = Math.sin((plan.reverb.wet * Math.PI) / 2);

    node.connect(dry);
    dry.connect(bus);
    const tail = buildReverbBranch(offline, node, plan.reverb);
    tail.connect(wet);
    wet.connect(bus);
  } else {
    node.connect(bus);
  }

  if (plan.echo) {
    buildEchoBranch(offline, node, plan.echo, bus);
  }

  let finalNode: AudioNode = bus;
  // Widening a mono source is a documented pass-through: there is no side signal.
  if (plan.width != null && graphChannels === 2 && inputBuffer.numberOfChannels > 1) {
    finalNode = buildWidthBranch(offline, finalNode, plan.width);
  }
  if (plan.pan) {
    finalNode = buildPanBranch(offline, finalNode, plan.pan);
  }
  finalNode.connect(offline.destination);

  report(0.18, "Rendering offline…");
  assertActive();
  source.start(0, plan.reverse ? 0 : trimStart, trimmedSeconds);
  const rendered = await offline.startRendering();
  assertActive();

  const channelData: Float32Array[] = [];
  for (let channel = 0; channel < rendered.numberOfChannels; channel++) {
    channelData.push(rendered.getChannelData(channel));
  }

  report(0.62, "Checking for invalid samples…");
  sanitizeChannels(channelData);

  const downmixed =
    plan.mono || config.channels === "mono" ? downmixChannels(channelData) : channelData;

  report(0.7, `Resampling to ${(targetRate / 1000).toFixed(1)} kHz…`);
  assertActive();
  const resampled =
    targetRate === renderRate
      ? downmixed
      : resampleChannels(downmixed, renderRate, targetRate);
  assertActive();

  let normalizeDb = 0;
  if (config.peakNormalize) {
    report(0.8, "Applying peak normalisation…");
    normalizeDb = applyPeakNormalize(resampled, 0.944);
  }

  let limiterReductionDb = 0;
  if (config.peakProtection) {
    report(0.86, "Applying look-ahead peak limiting…");
    limiterReductionDb = applyLookaheadLimiter(resampled, targetRate).maxReductionDb;
    assertActive();
  }

  if (resampled.length !== finalChannels) {
    throw new Error("Internal channel mismatch while preparing the export.");
  }

  report(0.92, "Packaging audio…");
  const outputBuffer = createPcmBuffer(resampled, targetRate);

  let blob: Blob;
  let bitDepthOrBitrate: string;
  let extension: "wav" | "mp3" | "aiff";

  if (config.format === "mp3") {
    if (targetRate !== 32000 && targetRate !== 44100 && targetRate !== 48000) {
      throw new Error(
        `MP3 encoding supports 32 kHz, 44.1 kHz and 48 kHz only (this render is ${(targetRate / 1000).toFixed(
          1
        )} kHz). Choose WAV or AIFF, or pick a supported sample rate.`
      );
    }
    report(0.94, `Encoding MP3 at ${config.mp3Bitrate} kbps…`);
    blob = encodeMp3(outputBuffer, config.mp3Bitrate);
    bitDepthOrBitrate = `${config.mp3Bitrate} kbps`;
    extension = "mp3";
  } else if (config.format === "aiff") {
    report(0.94, `Encoding AIFF at ${config.aiffBitDepth}-bit…`);
    blob = encodeAiff(outputBuffer, config.aiffBitDepth);
    bitDepthOrBitrate = `${config.aiffBitDepth}-bit`;
    extension = "aiff";
  } else {
    report(
      0.94,
      config.wavBitDepth === 32
        ? "Encoding WAV (32-bit float)…"
        : `Encoding WAV at ${config.wavBitDepth}-bit…`
    );
    blob = encodeWav(outputBuffer, config.wavBitDepth);
    bitDepthOrBitrate = config.wavBitDepth === 32 ? "32-bit float" : `${config.wavBitDepth}-bit`;
    extension = "wav";
  }

  assertActive();

  const baseName =
    originalFileName
      .replace(/\.[^./\\]+$/, "")
      .trim()
      .replace(/[^\w\-. ]+/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "") || "audio";

  const requestedName = config.outputFilename.trim().replace(/[\\/:*?"<>|]+/g, "-");
  const filename = requestedName
    ? `${requestedName.replace(/\.(wav|mp3|aiff|aif|opus)$/i, "")}.${extension}`
    : `svaraya-${presetId ?? "custom"}-${baseName}.${extension}`;

  const url = URL.createObjectURL(blob);
  report(1, "Complete");

  return {
    blob,
    url,
    duration: resampled[0].length / targetRate,
    sampleRate: targetRate,
    channels: resampled.length,
    format: extension,
    bitDepthOrBitrate,
    sizeBytes: blob.size,
    filename,
    isPeakProtected: config.peakProtection,
    isNormalized: Math.abs(normalizeDb) > 0.01,
    signature: computeRenderSignature(presetId, effectValues, config),
    limiterReductionDb,
    normalizeDb,
  };
}

/**
 * Encodes an AudioBuffer into a WAV Blob with 16-bit, 24-bit integer, or 32-bit float PCM.
 */
export function encodeWav(buffer: AudioBuffer, bitDepth: 16 | 24 | 32 = 16): Blob {
  const numChannels = buffer.numberOfChannels;
  const sampleRate = buffer.sampleRate;
  const numSamples = buffer.length;
  const bytesPerSample = bitDepth / 8;
  const isFloat = bitDepth === 32;
  const formatTag = isFloat ? 3 : 1;

  const dataSize = numSamples * numChannels * bytesPerSample;
  const headerSize = 44;
  const totalSize = headerSize + dataSize;

  const arrayBuffer = new ArrayBuffer(totalSize);
  const view = new DataView(arrayBuffer);

  function writeString(offset: number, str: string) {
    for (let i = 0; i < str.length; i++) {
      view.setUint8(offset + i, str.charCodeAt(i));
    }
  }

  writeString(0, "RIFF");
  view.setUint32(4, 36 + dataSize, true);
  writeString(8, "WAVE");

  writeString(12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, formatTag, true);
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * numChannels * bytesPerSample, true);
  view.setUint16(32, numChannels * bytesPerSample, true);
  view.setUint16(34, bitDepth, true);

  writeString(36, "data");
  view.setUint32(40, dataSize, true);

  let offset = 44;
  const channels: Float32Array[] = [];
  for (let c = 0; c < numChannels; c++) {
    channels.push(buffer.getChannelData(c));
  }

  if (bitDepth === 16) {
    for (let i = 0; i < numSamples; i++) {
      for (let c = 0; c < numChannels; c++) {
        const s = Math.max(-1, Math.min(1, channels[c][i]));
        const intSample = s < 0 ? s * 0x8000 : s * 0x7fff;
        view.setInt16(offset, intSample, true);
        offset += 2;
      }
    }
  } else if (bitDepth === 24) {
    for (let i = 0; i < numSamples; i++) {
      for (let c = 0; c < numChannels; c++) {
        const s = Math.max(-1, Math.min(1, channels[c][i]));
        const intSample = s < 0 ? s * 0x800000 : s * 0x7fffff;
        const intVal = Math.floor(intSample);
        view.setUint8(offset, intVal & 0xff);
        view.setUint8(offset + 1, (intVal >> 8) & 0xff);
        view.setUint8(offset + 2, (intVal >> 16) & 0xff);
        offset += 3;
      }
    }
  } else {
    for (let i = 0; i < numSamples; i++) {
      for (let c = 0; c < numChannels; c++) {
        view.setFloat32(offset, channels[c][i], true);
        offset += 4;
      }
    }
  }

  return new Blob([arrayBuffer], { type: "audio/wav" });
}

/**
 * Encodes an AudioBuffer into an AIFF Blob (Apple Big-Endian PCM).
 */
export function encodeAiff(buffer: AudioBuffer, bitDepth: 16 | 24 = 16): Blob {
  const numChannels = buffer.numberOfChannels;
  const sampleRate = buffer.sampleRate;
  const numSamples = buffer.length;
  const bytesPerSample = bitDepth / 8;

  const ssndDataSize = numSamples * numChannels * bytesPerSample;
  const commChunkSize = 18;
  // SSND carries an 8-byte offset/blockSize header and pads to an even length.
  const ssndChunkSize = 8 + ssndDataSize + (ssndDataSize % 2);
  const formSize = 4 + (8 + commChunkSize) + (8 + ssndChunkSize);

  const arrayBuffer = new ArrayBuffer(8 + formSize);
  const view = new DataView(arrayBuffer);

  function writeString(offset: number, str: string) {
    for (let i = 0; i < str.length; i++) {
      view.setUint8(offset + i, str.charCodeAt(i));
    }
  }

  writeString(0, "FORM");
  view.setUint32(4, formSize, false);
  writeString(8, "AIFF");

  let offset = 12;
  writeString(offset, "COMM");
  view.setUint32(offset + 4, commChunkSize, false);
  view.setInt16(offset + 8, numChannels, false);
  view.setUint32(offset + 10, numSamples, false);
  view.setInt16(offset + 14, bitDepth, false);

  // 80-bit IEEE 754 extended float sample rate (handles 96 kHz correctly).
  const rateBytes = float80Bytes(sampleRate);
  for (let i = 0; i < rateBytes.length; i++) {
    view.setUint8(offset + 16 + i, rateBytes[i]);
  }

  offset += 8 + commChunkSize;

  writeString(offset, "SSND");
  view.setUint32(offset + 4, ssndChunkSize, false);
  view.setUint32(offset + 8, 0, false);
  view.setUint32(offset + 12, 0, false);

  offset += 16;

  const channels: Float32Array[] = [];
  for (let c = 0; c < numChannels; c++) {
    channels.push(buffer.getChannelData(c));
  }

  if (bitDepth === 16) {
    for (let i = 0; i < numSamples; i++) {
      for (let c = 0; c < numChannels; c++) {
        const s = Math.max(-1, Math.min(1, channels[c][i]));
        const intSample = s < 0 ? s * 0x8000 : s * 0x7fff;
        view.setInt16(offset, intSample, false);
        offset += 2;
      }
    }
  } else {
    for (let i = 0; i < numSamples; i++) {
      for (let c = 0; c < numChannels; c++) {
        const s = Math.max(-1, Math.min(1, channels[c][i]));
        const intSample = s < 0 ? s * 0x800000 : s * 0x7fffff;
        const intVal = Math.floor(intSample);
        view.setUint8(offset, (intVal >> 16) & 0xff);
        view.setUint8(offset + 1, (intVal >> 8) & 0xff);
        view.setUint8(offset + 2, intVal & 0xff);
        offset += 3;
      }
    }
  }

  return new Blob([arrayBuffer], { type: "audio/aiff" });
}

/**
 * Encodes an AudioBuffer into an MP3 Blob using lamejs.
 */
export function encodeMp3(buffer: AudioBuffer, kbps: 128 | 192 | 256 | 320 = 320): Blob {
  const numChannels = buffer.numberOfChannels;
  const sampleRate = buffer.sampleRate;

  if (sampleRate !== 32000 && sampleRate !== 44100 && sampleRate !== 48000) {
    throw new Error(
      `MP3 supports 32 kHz, 44.1 kHz and 48 kHz only (${Math.round(sampleRate / 1000)} kHz requested). Choose WAV or AIFF instead.`
    );
  }

  const mp3encoder = new lamejs.Mp3Encoder(numChannels, sampleRate, kbps);

  const leftChannel = buffer.getChannelData(0);
  const rightChannel = numChannels > 1 ? buffer.getChannelData(1) : leftChannel;
  const numSamples = leftChannel.length;

  const leftInt16 = new Int16Array(numSamples);
  const rightInt16 = new Int16Array(numSamples);

  for (let i = 0; i < numSamples; i++) {
    const sl = Math.max(-1, Math.min(1, leftChannel[i]));
    leftInt16[i] = sl < 0 ? sl * 0x8000 : sl * 0x7fff;

    const sr = Math.max(-1, Math.min(1, rightChannel[i]));
    rightInt16[i] = sr < 0 ? sr * 0x8000 : sr * 0x7fff;
  }

  const mp3Data: Uint8Array[] = [];
  const chunkSize = 1152;

  for (let i = 0; i < numSamples; i += chunkSize) {
    const leftChunk = leftInt16.subarray(i, i + chunkSize);
    const rightChunk = rightInt16.subarray(i, i + chunkSize);

    let mp3buf: Int8Array;
    if (numChannels === 1) {
      mp3buf = mp3encoder.encodeBuffer(leftChunk);
    } else {
      mp3buf = mp3encoder.encodeBuffer(leftChunk, rightChunk);
    }

    if (mp3buf.length > 0) {
      mp3Data.push(new Uint8Array(mp3buf));
    }
  }

  const endBuf = mp3encoder.flush();
  if (endBuf.length > 0) {
    mp3Data.push(new Uint8Array(endBuf));
  }

  return new Blob(mp3Data as BlobPart[], { type: "audio/mp3" });
}

/**
 * Calculates estimated file size based on audio duration and export settings.
 */
export function estimateExportFileSize(
  durationSeconds: number,
  format: string,
  bitDepth: number,
  mp3Bitrate: number,
  sampleRate: number,
  channels: "stereo" | "mono"
): string {
  if (!durationSeconds || durationSeconds <= 0) return "—";

  const numChannels = channels === "mono" ? 1 : 2;
  const sr = sampleRate > 0 ? sampleRate : 44100;

  let bytes = 0;
  if (format === "mp3") {
    bytes = ((mp3Bitrate * 1000) / 8) * durationSeconds;
  } else if (format === "opus") {
    bytes = ((128 * 1000) / 8) * durationSeconds;
  } else if (format === "aiff") {
    // Callers must pass the AIFF bit depth here (16 or 24), not the WAV depth.
    bytes = sr * numChannels * (bitDepth / 8) * durationSeconds + 54;
  } else {
    bytes = sr * numChannels * (bitDepth / 8) * durationSeconds + 44;
  }

  if (bytes < 1024 * 1024) {
    return `~${(bytes / 1024).toFixed(1)} KB`;
  }
  return `~${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/**
 * Natural language sound request matcher:
 * Maps freeform user phrases into supported presets and DSP values.
 */
export function interpretSoundPrompt(prompt: string): { presetId: string; matchedLabel: string } | null {
  const p = prompt.toLowerCase().trim();
  if (!p) return null;

  // 432 Hz
  if (p.includes("432") || p.includes("432hz")) {
    return { presetId: "pitch-432hz", matchedLabel: "432 Hz Tuning Conversion" };
  }

  // Bass Boost levels
  if (p.includes("extreme bass") || p.includes("earrape") || p.includes("bass boosted heavy")) {
    return { presetId: "bass-boost-extreme", matchedLabel: "Extreme Bass Booster (+15dB)" };
  }
  if (p.includes("heavy bass") || p.includes("hard bass")) {
    return { presetId: "bass-boost-heavy", matchedLabel: "Heavy Bass Booster (+10dB)" };
  }
  if (p.includes("bass") || p.includes("boost") || p.includes("808")) {
    return { presetId: "bass-boost-mod", matchedLabel: "Moderate Bass Booster (+7dB)" };
  }

  // Reverbs
  if (p.includes("bathroom") || p.includes("shower") || p.includes("tile")) {
    return { presetId: "bathroom-reverb", matchedLabel: "Bathroom Reverb" };
  }
  if (p.includes("church") || p.includes("sanctuary")) {
    return { presetId: "church-hall-reverb", matchedLabel: "Church Hall Reverb" };
  }
  if (p.includes("cathedral") || p.includes("massive reverb")) {
    return { presetId: "cathedral-reverb", matchedLabel: "Cathedral Reverb" };
  }
  if (p.includes("vocal reverb") || p.includes("voice reverb")) {
    return { presetId: "vocal-reverb", matchedLabel: "Vocal Reverb" };
  }

  // Stereo & Panning
  if (p.includes("auto pan") || p.includes("panner") || p.includes("left to right")) {
    return { presetId: "auto-panner", matchedLabel: "Auto Panner" };
  }
  if (p.includes("8d") || p.includes("rotate") || p.includes("spinning") || p.includes("3d")) {
    return { presetId: "8d-audio", matchedLabel: "8D Audio" };
  }

  // Utilities
  if (p.includes("volume") || p.includes("louder") || p.includes("quieter") || p.includes("gain")) {
    return { presetId: "volume-changer", matchedLabel: "Volume & Gain Changer" };
  }
  if (p.includes("equalizer") || p.includes("eq")) {
    return { presetId: "equalizer", matchedLabel: "3-Band Equalizer" };
  }
  if (p.includes("trim") || p.includes("cut") || p.includes("crop")) {
    return { presetId: "trimmer-cutter", matchedLabel: "Audio Trimmer & Cutter" };
  }
  if (p.includes("mono") || p.includes("downmix")) {
    return { presetId: "downmixer", matchedLabel: "Stereo to Mono Downmixer" };
  }
  if (p.includes("bpm") || p.includes("tempo detect")) {
    return { presetId: "bpm-detector", matchedLabel: "BPM & Tempo Detector" };
  }

  // Speed & Viral
  if (p.includes("slow") && (p.includes("reverb") || p.includes("space") || p.includes("chill"))) {
    return { presetId: "slowed-reverb", matchedLabel: "Slowed + Reverb" };
  }
  if (p.includes("super slow") || p.includes("ultra slow")) {
    return { presetId: "super-slowed", matchedLabel: "Super Slowed" };
  }
  if (p.includes("slow") || p.includes("relax") || p.includes("downtempo")) {
    return { presetId: "slowed", matchedLabel: "Slowed" };
  }
  if (p.includes("nightcore") || p.includes("speed up") || p.includes("sped up")) {
    return { presetId: "nightcore", matchedLabel: "Nightcore" };
  }
  if (p.includes("daycore") || p.includes("deep voice")) {
    return { presetId: "daycore", matchedLabel: "Daycore" };
  }
  if (p.includes("reverse") || p.includes("backwards")) {
    return { presetId: "reverse", matchedLabel: "Reverse Audio" };
  }
  if (p.includes("underwater") || p.includes("submerged")) {
    return { presetId: "underwater", matchedLabel: "Underwater Submersion" };
  }

  return null;
}
