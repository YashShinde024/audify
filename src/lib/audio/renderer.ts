/**
 * Audify Offline Audio Processing Renderer
 *
 * Implements deterministic offline graph compilation, impulse responses,
 * wave-shaper distortion curves, look-ahead peak limiting, and packaging.
 *
 * Signal processing flow:
 * source → varispeed → filters → saturation → output gain →
 * dry + reverb wet + echo wet → width → pan → destination.
 */

import type { EffectValues } from "@/types/preset";
import { DEFAULT_EXPORT_CONFIG } from "@/types/export";
import type { ExportConfig } from "@/types/export";
import {
  MAX_OUTPUT_SECONDS,
  computeRenderSignature,
  resolveProcessing,
} from "./dsp-plan";
import type {
  BitcrusherSpec,
  CenterExtractorSpec,
  ChorusSpec,
  CompressorSpec,
  EchoSpec,
  FilterSpec,
  HaasSpec,
  PanSpec,
  ReverbSpec,
} from "./dsp-plan";
import {
  applyBitcrush,
  applyLookaheadLimiter,
  applyPeakNormalize,
  downmixChannels,
  measurePeak,
  measureRms,
  removeDcOffset,
  resampleChannels,
  sanitizeChannels,
} from "./dsp-utils";
import { encodeAiff, encodeMp3, encodeWav } from "./encoders";

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
  /** Measured offline DSP and encoding time in milliseconds. */
  renderDurationMs: number;
  /** True peak level across all rendered channels in dBFS. */
  peakDbfs: number;
  /** RMS loudness level across all rendered channels in dBFS. */
  rmsDbfs: number;
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
 * Synthesises a stereo impulse response:
 * - exponential decay reaching −60 dB exactly at `durationSeconds`
 * - sparse early reflections in the first 70 ms
 * - decorrelated left/right noise for a wide but mono-compatible tail
 * - one-pole damping so the tail darkens over time instead of hissing
 * - 2 ms fades at both ends to avoid clicks
 * - total energy normalised to 1, so `convolver.normalize = false` keeps the
 *   wet level predictable across room sizes
 */
export function createImpulseResponse(
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
export function makeDistortionCurve(amount: number): Float32Array<ArrayBuffer> {
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
 * Builds an AudioBuffer from plain channel data. Works in environments
 * where `new AudioBuffer()` is supported or falls back to OfflineAudioContext.
 */
export function createPcmBuffer(channels: Float32Array[], sampleRate: number): AudioBuffer {
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
 */
export function createReversedSegment(
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
export function connectFilters(
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
export function buildReverbBranch(
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
export function buildEchoBranch(
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
export function buildWidthBranch(ctx: BaseAudioContext, input: AudioNode, width: number): AudioNode {
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
export function buildPanBranch(ctx: BaseAudioContext, input: AudioNode, spec: PanSpec): AudioNode {
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
 * Haas effect precedence micro-delay (10–40 ms) on the right channel for
 * psychoacoustic stereo width without mono phase cancellation.
 */
export function buildHaasBranch(
  ctx: BaseAudioContext,
  input: AudioNode,
  spec: HaasSpec
): AudioNode {
  const splitter = ctx.createChannelSplitter(2);
  const merger = ctx.createChannelMerger(2);
  input.connect(splitter);

  // Left channel passes direct
  splitter.connect(merger, 0, 0);

  // Right channel passes through delay
  const delay = ctx.createDelay(0.1);
  delay.delayTime.value = clampNumber(spec.delayMs / 1000, 0.005, 0.05);

  const delayGain = ctx.createGain();
  delayGain.gain.value = clampNumber(spec.mix, 0, 1);
  const dryGain = ctx.createGain();
  dryGain.gain.value = 1 - clampNumber(spec.mix, 0, 1) * 0.5;

  splitter.connect(dryGain, 1);
  dryGain.connect(merger, 0, 1);

  splitter.connect(delay, 1);
  delay.connect(delayGain);
  delayGain.connect(merger, 0, 1);

  return merger;
}

/**
 * Dynamics Compressor: threshold, knee, ratio, attack, release + makeup gain + dry/wet mix.
 */
export function buildCompressorBranch(
  ctx: BaseAudioContext,
  input: AudioNode,
  spec: CompressorSpec
): AudioNode {
  const compressor = ctx.createDynamicsCompressor();
  compressor.threshold.value = clampNumber(spec.thresholdDb, -100, 0);
  compressor.knee.value = clampNumber(spec.kneeDb, 0, 40);
  compressor.ratio.value = clampNumber(spec.ratio, 1, 20);
  compressor.attack.value = clampNumber(spec.attackSeconds, 0.001, 1);
  compressor.release.value = clampNumber(spec.releaseSeconds, 0.01, 1);

  const makeup = ctx.createGain();
  makeup.gain.value = Math.pow(10, clampNumber(spec.makeupGainDb, 0, 24) / 20);
  compressor.connect(makeup);

  const mix = clampNumber(spec.mix, 0, 1);
  if (mix >= 0.999) {
    input.connect(compressor);
    return makeup;
  }

  // Parallel compression: dry/wet crossfade
  const dryGain = ctx.createGain();
  dryGain.gain.value = 1 - mix;
  const wetGain = ctx.createGain();
  wetGain.gain.value = mix;

  const output = ctx.createGain();
  input.connect(dryGain);
  dryGain.connect(output);

  input.connect(compressor);
  makeup.connect(wetGain);
  wetGain.connect(output);

  return output;
}

/**
 * Center Channel Extractor / Vocal Remover using Mid/Side matrix subtraction
 * with a sub-bass retention crossover filter to keep kick and sub-bass intact.
 */
export function buildCenterExtractorBranch(
  ctx: BaseAudioContext,
  input: AudioNode,
  spec: CenterExtractorSpec
): AudioNode {
  const splitter = ctx.createChannelSplitter(2);
  const merger = ctx.createChannelMerger(2);
  input.connect(splitter);

  if (spec.mode === "remove-center") {
    // Vocal Remover (Karaoke): Side = (L - R) * 0.7071
    // Filter low frequencies to retain mono bass and kick foundation
    const crossoverFreq = clampNumber(spec.bassPreserveHz, 40, 300);
    const reduction = clampNumber(spec.reductionAmount, 0, 1);

    const leftLowPass = ctx.createBiquadFilter();
    leftLowPass.type = "lowpass";
    leftLowPass.frequency.value = crossoverFreq;
    leftLowPass.Q.value = 0.707;

    const rightLowPass = ctx.createBiquadFilter();
    rightLowPass.type = "lowpass";
    rightLowPass.frequency.value = crossoverFreq;
    rightLowPass.Q.value = 0.707;

    splitter.connect(leftLowPass, 0);
    splitter.connect(rightLowPass, 1);

    // Side channel extraction: L * 0.7071 - R * 0.7071
    const sideGainL = ctx.createGain();
    sideGainL.gain.value = 0.7071 * reduction;
    const sideGainR = ctx.createGain();
    sideGainR.gain.value = -0.7071 * reduction;

    splitter.connect(sideGainL, 0);
    splitter.connect(sideGainR, 1);

    const sideBus = ctx.createGain();
    sideGainL.connect(sideBus);
    sideGainR.connect(sideBus);

    // Invert side for right channel to preserve stereo separation:
    // Left = Side + LeftLowPass
    // Right = -Side + RightLowPass
    const sideToLeft = ctx.createGain();
    sideToLeft.gain.value = 1.0;
    const sideToRight = ctx.createGain();
    sideToRight.gain.value = -1.0;

    sideBus.connect(sideToLeft);
    sideBus.connect(sideToRight);

    sideToLeft.connect(merger, 0, 0);
    leftLowPass.connect(merger, 0, 0);

    sideToRight.connect(merger, 0, 1);
    rightLowPass.connect(merger, 0, 1);

    return merger;
  } else {
    // Center Isolation (Lead / Acapella Focus): Mid = (L + R) * 0.5
    const midL = ctx.createGain();
    midL.gain.value = 0.5;
    const midR = ctx.createGain();
    midR.gain.value = 0.5;

    splitter.connect(midL, 0);
    splitter.connect(midR, 1);

    const midBus = ctx.createGain();
    midL.connect(midBus);
    midR.connect(midBus);

    midBus.connect(merger, 0, 0);
    midBus.connect(merger, 0, 1);

    return merger;
  }
}

/**
 * Modulated Delay Line (Chorus / Flanger) with variable LFO depth and feedback.
 */
export function buildChorusBranch(
  ctx: BaseAudioContext,
  input: AudioNode,
  spec: ChorusSpec
): AudioNode {
  const delay = ctx.createDelay(0.05);
  const baseDelay = clampNumber(spec.depthMs / 1000, 0.002, 0.025);
  delay.delayTime.value = baseDelay;

  // LFO modulation
  const lfo = ctx.createOscillator();
  lfo.type = "sine";
  lfo.frequency.value = clampNumber(spec.rateHz, 0.1, 8.0);

  const lfoDepth = ctx.createGain();
  lfoDepth.gain.value = baseDelay * 0.45;
  lfo.connect(lfoDepth);
  lfoDepth.connect(delay.delayTime);
  lfo.start(0);

  // Feedback loop
  if (spec.feedback > 0.001) {
    const fbGain = ctx.createGain();
    fbGain.gain.value = clampNumber(spec.feedback, 0, 0.75);
    delay.connect(fbGain);
    fbGain.connect(delay);
  }

  // Dry/wet blend
  const mix = clampNumber(spec.mix, 0, 1);
  const dryGain = ctx.createGain();
  dryGain.gain.value = 1 - mix * 0.5;
  const wetGain = ctx.createGain();
  wetGain.gain.value = mix;

  const output = ctx.createGain();
  input.connect(dryGain);
  dryGain.connect(output);

  input.connect(delay);
  delay.connect(wetGain);
  wetGain.connect(output);

  return output;
}

/**
 * Renders an AudioBuffer through the resolved DSP plan and encodes it using the
 * requested export configuration.
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

  const startTime = typeof performance !== "undefined" ? performance.now() : Date.now();
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

  if (plan.compressor) {
    node = buildCompressorBranch(offline, node, plan.compressor);
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
  if (plan.chorus) {
    finalNode = buildChorusBranch(offline, finalNode, plan.chorus);
  }
  if (plan.centerExtractor && graphChannels === 2 && inputBuffer.numberOfChannels > 1) {
    finalNode = buildCenterExtractorBranch(offline, finalNode, plan.centerExtractor);
  }
  // Widening a mono source is a pass-through: there is no side signal.
  if (plan.width != null && graphChannels === 2 && inputBuffer.numberOfChannels > 1) {
    finalNode = buildWidthBranch(offline, finalNode, plan.width);
  }
  if (plan.haas && graphChannels === 2) {
    finalNode = buildHaasBranch(offline, finalNode, plan.haas);
  }
  if (plan.pan) {
    finalNode = buildPanBranch(offline, finalNode, plan.pan);
  }
  if (plan.fade) {
    const fadeGain = offline.createGain();
    const duration = plannedSeconds;
    const { fadeInSeconds, fadeOutSeconds } = plan.fade;
    if (fadeInSeconds > 0) {
      fadeGain.gain.setValueAtTime(0, 0);
      fadeGain.gain.linearRampToValueAtTime(1, Math.min(fadeInSeconds, duration / 2));
    }
    if (fadeOutSeconds > 0) {
      const fadeStart = Math.max(0, duration - fadeOutSeconds);
      fadeGain.gain.setValueAtTime(1, fadeStart);
      fadeGain.gain.linearRampToValueAtTime(0, duration);
    }
    finalNode.connect(fadeGain);
    finalNode = fadeGain;
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

  if (plan.removeDc) {
    report(0.64, "Removing DC offset…");
    removeDcOffset(channelData);
    assertActive();
  }

  if (plan.bitcrusher) {
    report(0.66, "Applying digital bitcrush & decimation…");
    applyBitcrush(
      channelData,
      plan.bitcrusher.bitDepth,
      plan.bitcrusher.downsampleFactor,
      plan.bitcrusher.mix
    );
    assertActive();
  }

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
    : `audify-${presetId ?? "custom"}-${baseName}.${extension}`;

  const url = URL.createObjectURL(blob);
  const endTime = typeof performance !== "undefined" ? performance.now() : Date.now();
  const renderDurationMs = Math.round(endTime - startTime);

  const finalPeakLinear = measurePeak(resampled);
  const finalRmsLinear = measureRms(resampled);
  const peakDbfs = finalPeakLinear > 0 ? 20 * Math.log10(finalPeakLinear) : -100;
  const rmsDbfs = finalRmsLinear > 0 ? 20 * Math.log10(finalRmsLinear) : -100;

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
    renderDurationMs,
    peakDbfs: Number(peakDbfs.toFixed(1)),
    rmsDbfs: Number(rmsDbfs.toFixed(1)),
  };
}
