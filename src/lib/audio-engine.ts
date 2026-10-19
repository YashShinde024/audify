/**
 * Svaraya Web Audio Processing Engine
 *
 * Professional client-side DSP pipeline & multi-format export suite:
 * - Real audio file decoding via Web Audio API
 * - Authentic peak extraction for genuine waveform visualization
 * - Native BPM / Tempo detection from decoded PCM energy autocorrelation
 * - Audio buffer trimming and slicing (Cutter / Trimmer utility)
 * - Exact 440 Hz to 432 Hz pitch conversion (432/440 tuning ratio)
 * - Calibrated discrete Bass Boost levels (Light +3dB, Moderate +7dB, Heavy +10dB, Extreme +15dB)
 * - Architectural acoustic reverbs (Bathroom, Small, Medium, Large, Church, Cathedral, Vocal)
 * - 3-Band Parametric Equalizer (Low-Shelf, Mid-Peaking, High-Shelf)
 * - Auto-Panner with variable modulation rate and depth
 * - Volume / Gain amplifier and attenuator (-18dB to +12dB)
 * - Multi-format exporters:
 *   - WAV (16-bit, 24-bit, 32-bit float PCM)
 *   - MP3 (128, 192, 256, 320 kbps via lamejs)
 *   - AIFF (16-bit, 24-bit big-endian PCM)
 * - Natural-language sound request matcher mapped directly to supported DSP presets
 */

import lamejs from "lamejs";
import type { EffectValues } from "@/types/preset";
import type { ExportConfig } from "@/types/export";

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

/**
 * Creates an algorithmic impulse response for realistic room reverbs.
 */
function createImpulseResponse(
  ctx: BaseAudioContext,
  durationSeconds: number,
  decay: number,
  brightness = 1.0
): AudioBuffer {
  const sampleRate = ctx.sampleRate;
  const length = Math.max(sampleRate * 0.3, Math.floor(sampleRate * durationSeconds));
  const impulse = ctx.createBuffer(2, length, sampleRate);
  const left = impulse.getChannelData(0);
  const right = impulse.getChannelData(1);

  for (let i = 0; i < length; i++) {
    const n = i / length;
    const envelope = Math.pow(1 - n, decay);
    const noiseL = (Math.random() * 2 - 1) * envelope;
    const noiseR = (Math.random() * 2 - 1) * envelope;

    // Apply brightness scaling
    left[i] = noiseL * brightness;
    right[i] = noiseR * brightness;
  }

  return impulse;
}

/**
 * Creates an analog-style saturation curve for warm tape saturation.
 */
function makeDistortionCurve(amount: number): Float32Array {
  const k = typeof amount === "number" ? Math.max(0, Math.min(100, amount)) : 30;
  const n_samples = 44100;
  const curve = new Float32Array(n_samples);
  const xDrive = (k / 100) * 12;

  for (let i = 0; i < n_samples; ++i) {
    const x = (i * 2) / n_samples - 1;
    if (k === 0) {
      curve[i] = x;
    } else {
      curve[i] = Math.tanh(x * (1 + xDrive));
    }
  }
  return curve;
}

/**
 * Applies peak protection (transparent soft limiter) to Float32 sample data.
 */
function applyPeakLimiter(buffer: AudioBuffer, ceiling = 0.98): void {
  const numChannels = buffer.numberOfChannels;
  for (let c = 0; c < numChannels; c++) {
    const data = buffer.getChannelData(c);
    for (let i = 0; i < data.length; i++) {
      const s = data[i];
      if (Math.abs(s) > ceiling) {
        const sign = s > 0 ? 1 : -1;
        const over = Math.abs(s) - ceiling;
        data[i] = sign * (ceiling + Math.tanh(over) * (1 - ceiling));
      }
    }
  }
}

/**
 * Applies loudness normalization (peak make-up gain) up to target -0.5 dBFS.
 */
function applyLoudnessNormalization(buffer: AudioBuffer, targetLinear = 0.944): void {
  const numChannels = buffer.numberOfChannels;
  let maxSample = 0;

  for (let c = 0; c < numChannels; c++) {
    const data = buffer.getChannelData(c);
    for (let i = 0; i < data.length; i++) {
      const abs = Math.abs(data[i]);
      if (abs > maxSample) maxSample = abs;
    }
  }

  if (maxSample > 0.001 && maxSample < targetLinear) {
    const gain = targetLinear / maxSample;
    for (let c = 0; c < numChannels; c++) {
      const data = buffer.getChannelData(c);
      for (let i = 0; i < data.length; i++) {
        data[i] *= gain;
      }
    }
  }
}

/**
 * Downmixes an AudioBuffer to mono.
 */
function downmixToMono(ctx: BaseAudioContext, buffer: AudioBuffer): AudioBuffer {
  if (buffer.numberOfChannels === 1) return buffer;
  const monoBuffer = ctx.createBuffer(1, buffer.length, buffer.sampleRate);
  const monoData = monoBuffer.getChannelData(0);
  const left = buffer.getChannelData(0);
  const right = buffer.getChannelData(1);

  for (let i = 0; i < buffer.length; i++) {
    monoData[i] = (left[i] + right[i]) * 0.5;
  }
  return monoBuffer;
}

/**
 * Slices an AudioBuffer between start and end seconds.
 */
function sliceAudioBuffer(ctx: BaseAudioContext, buffer: AudioBuffer, startSec: number, endSec: number): AudioBuffer {
  const startSample = Math.max(0, Math.floor(startSec * buffer.sampleRate));
  const endSample = Math.min(buffer.length, Math.floor(endSec * buffer.sampleRate));
  const slicedLength = Math.max(1, endSample - startSample);

  const slicedBuffer = ctx.createBuffer(buffer.numberOfChannels, slicedLength, buffer.sampleRate);
  for (let c = 0; c < buffer.numberOfChannels; c++) {
    const src = buffer.getChannelData(c);
    const dst = slicedBuffer.getChannelData(c);
    for (let i = 0; i < slicedLength; i++) {
      dst[i] = src[startSample + i];
    }
  }
  return slicedBuffer;
}

/**
 * Renders an AudioBuffer through the full DSP signal chain into an exported audio result.
 */
export async function renderProcessedAudio(
  inputBuffer: AudioBuffer,
  presetId: string | null,
  effectValues: EffectValues,
  originalFileName: string,
  exportConfig?: Partial<ExportConfig>
): Promise<ProcessedAudioResult> {
  const speedParam = typeof effectValues["speed"] === "number" ? (effectValues["speed"] as number) : 100;
  const pitchParam = typeof effectValues["pitch"] === "number" ? (effectValues["pitch"] as number) : 0;
  const bassParam = typeof effectValues["bass"] === "number" ? (effectValues["bass"] as number) : 0;
  const trebleParam = typeof effectValues["treble"] === "number" ? (effectValues["treble"] as number) : 0;
  const presenceParam = typeof effectValues["presence"] === "number" ? (effectValues["presence"] as number) : 0;
  const reverbParam = typeof effectValues["reverb"] === "number" ? (effectValues["reverb"] as number) : 0;
  const roomSizeParam = typeof effectValues["size"] === "number" ? (effectValues["size"] as number) : 50;
  const saturationParam = typeof effectValues["saturation"] === "number" ? (effectValues["saturation"] as number) : 0;
  const warmthParam = typeof effectValues["warmth"] === "number" ? (effectValues["warmth"] as number) : 0;
  const echoParam = typeof effectValues["echo"] === "number" ? (effectValues["echo"] as number) : 0;
  const volumeDbParam = typeof effectValues["volume-db"] === "number" ? (effectValues["volume-db"] as number) : 0;

  // Trimming parameters
  const trimStart = typeof effectValues["trim-start"] === "number" ? (effectValues["trim-start"] as number) : 0;
  const trimEnd = typeof effectValues["trim-end"] === "number" ? (effectValues["trim-end"] as number) : inputBuffer.duration;

  // 432 Hz exact tuning conversion ratio (432 / 440 = 0.98181818)
  const is432Hz = presetId === "pitch-432hz" || Boolean(effectValues["432hz-enabled"]);
  const tuningRatio = is432Hz ? 432 / 440 : 1.0;

  const isMudCut = Boolean(effectValues["mud-cut"]);
  const isReverse = Boolean(effectValues["reverse-enabled"]) || presetId === "reverse";

  // Calculate speed & pitch transposition
  const semitoneMultiplier = Math.pow(2, pitchParam / 12);
  const finalPlaybackRate = Math.max(
    0.25,
    Math.min(2.5, (speedParam / 100) * semitoneMultiplier * tuningRatio)
  );

  // Apply trimming to source buffer if specified
  let workingBuffer = inputBuffer;
  if ((trimStart > 0 || trimEnd < inputBuffer.duration) && trimEnd > trimStart) {
    const tempCtx = new OfflineAudioContext(inputBuffer.numberOfChannels, 1, inputBuffer.sampleRate);
    workingBuffer = sliceAudioBuffer(tempCtx, inputBuffer, trimStart, trimEnd);
  }

  // Determine output duration
  let outputDuration = workingBuffer.duration / finalPlaybackRate;
  const hasReverb =
    reverbParam > 0 ||
    presetId?.includes("reverb") ||
    presetId === "hall-reverb" ||
    presetId === "cathedral-reverb" ||
    presetId === "church-hall-reverb" ||
    presetId === "ethereal-space" ||
    presetId === "bathroom-reverb" ||
    presetId === "vocal-reverb";

  if (hasReverb) {
    outputDuration += Math.min(6.5, (roomSizeParam / 100) * 5.5);
  }

  // Handle Target Sample Rate & Channels
  const targetSampleRate =
    exportConfig?.sampleRate && exportConfig.sampleRate > 0
      ? exportConfig.sampleRate
      : workingBuffer.sampleRate;
  const targetChannels =
    exportConfig?.channels === "mono" || presetId === "downmixer"
      ? 1
      : Math.max(2, workingBuffer.numberOfChannels);
  const totalRenderFrames = Math.ceil(outputDuration * targetSampleRate);

  // Initialize OfflineAudioContext
  const offlineCtx = new OfflineAudioContext(targetChannels, totalRenderFrames, targetSampleRate);

  // Prepare input buffer (applying reverse if enabled)
  let processBuffer = workingBuffer;
  if (isReverse) {
    processBuffer = offlineCtx.createBuffer(
      workingBuffer.numberOfChannels,
      workingBuffer.length,
      workingBuffer.sampleRate
    );
    for (let c = 0; c < workingBuffer.numberOfChannels; c++) {
      const src = workingBuffer.getChannelData(c);
      const dst = processBuffer.getChannelData(c);
      for (let i = 0; i < src.length; i++) {
        dst[i] = src[src.length - 1 - i];
      }
    }
  }

  const sourceNode = offlineCtx.createBufferSource();
  sourceNode.buffer = processBuffer;
  sourceNode.playbackRate.value = finalPlaybackRate;

  let currentNode: AudioNode = sourceNode;

  // 1. High-Pass Mud Cut / Rumble Reducer
  if (isMudCut || presetId === "vocal-clarity" || presetId === "sub-rumble-cut" || presetId === "noise-reducer") {
    const hpCut = offlineCtx.createBiquadFilter();
    hpCut.type = "highpass";
    hpCut.frequency.value = presetId === "sub-rumble-cut" ? 80 : 120;
    hpCut.Q.value = 0.707;
    currentNode.connect(hpCut);
    currentNode = hpCut;
  }

  // 2. Steep Low-Pass Filter (Underwater or Telephone effect)
  if (presetId === "underwater") {
    const lpUnderwater = offlineCtx.createBiquadFilter();
    lpUnderwater.type = "lowpass";
    lpUnderwater.frequency.value = 480;
    lpUnderwater.Q.value = 1.8;
    currentNode.connect(lpUnderwater);
    currentNode = lpUnderwater;
  } else if (presetId === "vintage-radio" || presetId === "telephone-voice") {
    const bpRadio = offlineCtx.createBiquadFilter();
    bpRadio.type = "bandpass";
    bpRadio.frequency.value = 1600;
    bpRadio.Q.value = 1.4;
    currentNode.connect(bpRadio);
    currentNode = bpRadio;
  }

  // 3. Calibrated Bass Booster Levels
  let effectiveBass = bassParam;
  let bassFreq = 85;
  if (presetId === "bass-boost-light") {
    effectiveBass = 3.5;
    bassFreq = 95;
  } else if (presetId === "bass-boost-mod") {
    effectiveBass = 7.0;
    bassFreq = 85;
  } else if (presetId === "bass-boost-heavy") {
    effectiveBass = 10.5;
    bassFreq = 75;
  } else if (presetId === "bass-boost-extreme") {
    effectiveBass = 15.0;
    bassFreq = 65;
  } else if (presetId === "deep-bass") {
    effectiveBass = 6.0;
    bassFreq = 55;
  } else if (presetId === "cinematic-trailer") {
    effectiveBass = 6.5;
    bassFreq = 65;
  }

  if (effectiveBass !== 0) {
    const bassFilter = offlineCtx.createBiquadFilter();
    bassFilter.type = "lowshelf";
    bassFilter.frequency.value = bassFreq;
    bassFilter.gain.value = effectiveBass;
    currentNode.connect(bassFilter);
    currentNode = bassFilter;
  }

  // 4. Peaking Mid-Presence (Vocals, Equalizer Mid, Punch)
  const eqMidParam = typeof effectValues["eq-mid"] === "number" ? (effectValues["eq-mid"] as number) : 0;
  const effectivePresence = presenceParam || eqMidParam || (presetId === "vocal-clarity" ? 3.5 : presetId === "punchy-mids" ? 4 : 0);
  if (effectivePresence !== 0) {
    const presenceFilter = offlineCtx.createBiquadFilter();
    presenceFilter.type = "peaking";
    presenceFilter.frequency.value = 2400;
    presenceFilter.Q.value = 1.2;
    presenceFilter.gain.value = effectivePresence;
    currentNode.connect(presenceFilter);
    currentNode = presenceFilter;
  }

  // 5. High-Shelf Treble / Air / De-Harsh
  const eqHighParam = typeof effectValues["eq-high"] === "number" ? (effectValues["eq-high"] as number) : 0;
  const effectiveTreble = trebleParam || eqHighParam || (presetId === "nightcore" ? 4 : presetId === "treble-air" ? 5 : presetId === "de-harsh" ? -3.5 : 0);
  if (effectiveTreble !== 0) {
    const trebleFilter = offlineCtx.createBiquadFilter();
    trebleFilter.type = "highshelf";
    trebleFilter.frequency.value = 9000;
    trebleFilter.gain.value = effectiveTreble;
    currentNode.connect(trebleFilter);
    currentNode = trebleFilter;
  }

  // 6. Analog Tape / Tube Saturation
  const effectiveSaturation =
    saturationParam ||
    (warmthParam > 0 ? warmthParam * 0.6 : presetId === "lofi-tape" ? 50 : presetId === "warm-tube" ? 45 : 0);
  if (effectiveSaturation > 0) {
    const waveshaper = offlineCtx.createWaveShaper();
    waveshaper.curve = makeDistortionCurve(effectiveSaturation) as Float32Array<ArrayBuffer>;
    waveshaper.oversample = "4x";
    currentNode.connect(waveshaper);
    currentNode = waveshaper;
  }

  // 7. Volume Changer / Gain Adjustment (dB)
  if (volumeDbParam !== 0 || presetId === "volume-changer") {
    const volumeGain = offlineCtx.createGain();
    const gainFactor = Math.pow(10, volumeDbParam / 20);
    volumeGain.gain.value = gainFactor;
    currentNode.connect(volumeGain);
    currentNode = volumeGain;
  }

  // Main mixing buses
  const dryGain = offlineCtx.createGain();
  const wetGain = offlineCtx.createGain();
  const masterBus = offlineCtx.createGain();

  currentNode.connect(dryGain);
  dryGain.connect(masterBus);

  // 8. Architectural Room Reverbs
  let roomDecay = (roomSizeParam / 100) * 4.2;
  let reverbWet = reverbParam / 100;
  let brightness = 1.0;

  if (presetId === "bathroom-reverb") {
    roomDecay = 0.6;
    reverbWet = reverbWet || 0.35;
    brightness = 1.6; // bright tiled flutter
  } else if (presetId === "small-room-reverb") {
    roomDecay = 1.2;
    reverbWet = reverbWet || 0.25;
    brightness = 1.1;
  } else if (presetId === "medium-room-reverb") {
    roomDecay = 2.2;
    reverbWet = reverbWet || 0.35;
  } else if (presetId === "large-room-reverb") {
    roomDecay = 3.4;
    reverbWet = reverbWet || 0.45;
  } else if (presetId === "church-hall-reverb") {
    roomDecay = 4.8;
    reverbWet = reverbWet || 0.55;
    brightness = 0.9;
  } else if (presetId === "cathedral-reverb") {
    roomDecay = 6.2;
    reverbWet = reverbWet || 0.65;
    brightness = 0.85;
  } else if (presetId === "vocal-reverb") {
    roomDecay = 1.8;
    reverbWet = reverbWet || 0.28;
    brightness = 1.2;
  } else if (presetId === "slowed-reverb") {
    reverbWet = reverbWet || 0.42;
  }

  if (reverbWet > 0) {
    const convolver = offlineCtx.createConvolver();
    convolver.buffer = createImpulseResponse(offlineCtx, Math.max(0.4, roomDecay), 2.1, brightness);
    currentNode.connect(convolver);

    wetGain.gain.value = Math.min(1.0, reverbWet * 1.35);
    dryGain.gain.value = Math.max(0.4, 1.0 - reverbWet * 0.35);

    convolver.connect(wetGain);
    wetGain.connect(masterBus);
  }

  // 9. Stereo Feedback Delay / Echo
  const echoWet = echoParam / 100 || (presetId === "ping-pong" ? 0.4 : 0);
  if (echoWet > 0) {
    const delay = offlineCtx.createDelay(1.2);
    delay.delayTime.value = 0.32;
    const feedback = offlineCtx.createGain();
    feedback.gain.value = Math.min(0.68, echoWet * 0.7);

    const echoBus = offlineCtx.createGain();
    echoBus.gain.value = echoWet * 0.8;

    currentNode.connect(delay);
    delay.connect(feedback);
    feedback.connect(delay);
    delay.connect(echoBus);
    echoBus.connect(masterBus);
  }

  // 10. Auto-Panner & 360° 8D Orbital Panning
  const isAutoPanner = presetId === "auto-panner" || typeof effectValues["pan-speed"] === "number";
  const is8D = presetId === "8d-audio" || presetId === "8d-slowed" || typeof effectValues["rotation"] === "number";

  if ((is8D || isAutoPanner) && targetChannels >= 2 && offlineCtx.createStereoPanner) {
    const panner = offlineCtx.createStereoPanner();
    const rotSpeed =
      typeof effectValues["rotation"] === "number"
        ? (effectValues["rotation"] as number)
        : typeof effectValues["pan-speed"] === "number"
        ? (effectValues["pan-speed"] as number)
        : 50;

    const cycleTimeSeconds = isAutoPanner
      ? Math.max(1.0, 6.0 - (rotSpeed / 100) * 4.5) // Auto panner cycles faster (1-6s)
      : Math.max(3.0, 14.0 - (rotSpeed / 100) * 10.0); // 8D orbits (3-14s)

    const panParam = panner.pan;
    panParam.setValueAtTime(0, 0);
    const steps = Math.floor(outputDuration * 12);
    for (let s = 0; s <= steps; s++) {
      const t = s / 12;
      const angle = (t / cycleTimeSeconds) * Math.PI * 2;
      panParam.setValueAtTime(Math.sin(angle), t);
    }

    masterBus.connect(panner);
    panner.connect(offlineCtx.destination);
  } else {
    masterBus.connect(offlineCtx.destination);
  }

  sourceNode.start(0);

  // Render in OfflineAudioContext
  let renderedBuffer = await offlineCtx.startRendering();

  // If Mono downmix was selected
  if ((exportConfig?.channels === "mono" || presetId === "downmixer") && renderedBuffer.numberOfChannels > 1) {
    renderedBuffer = downmixToMono(offlineCtx, renderedBuffer);
  }

  // Peak Protection Limiter (always active for extreme bass boost or user toggle)
  const isExtremeBass = presetId === "bass-boost-heavy" || presetId === "bass-boost-extreme";
  const peakProtection = exportConfig?.peakProtection ?? (isExtremeBass ? true : true);
  if (peakProtection) {
    applyPeakLimiter(renderedBuffer, 0.98);
  }

  // Loudness Normalization
  const loudnessNormalize = exportConfig?.loudnessNormalize ?? false;
  if (loudnessNormalize) {
    applyLoudnessNormalization(renderedBuffer, 0.944);
  }

  // Generate output file based on requested format
  const format = exportConfig?.format || "wav";
  const baseName = originalFileName.replace(/\.[^/.]+$/, "");
  const presetSlug = presetId || "custom";

  let outBlob: Blob;
  let ext = "wav";
  let bitDepthOrBitrate = "16-bit PCM";

  if (format === "mp3") {
    const kbps = exportConfig?.mp3Bitrate || 320;
    outBlob = encodeMp3(renderedBuffer, kbps);
    ext = "mp3";
    bitDepthOrBitrate = `${kbps} kbps MP3`;
  } else if (format === "aiff") {
    const depth = exportConfig?.aiffBitDepth || 16;
    outBlob = encodeAiff(renderedBuffer, depth);
    ext = "aiff";
    bitDepthOrBitrate = `${depth}-bit AIFF`;
  } else {
    // Standard WAV PCM
    const depth = exportConfig?.wavBitDepth || 16;
    outBlob = encodeWav(renderedBuffer, depth);
    ext = "wav";
    bitDepthOrBitrate = depth === 32 ? "32-bit Float WAV" : `${depth}-bit PCM WAV`;
  }

  const customName = exportConfig?.outputFilename?.trim();
  const finalFilename = customName
    ? customName.endsWith(`.${ext}`)
      ? customName
      : `${customName}.${ext}`
    : `svaraya-${presetSlug}-${baseName}.${ext}`;

  return {
    blob: outBlob,
    url: URL.createObjectURL(outBlob),
    duration: renderedBuffer.duration,
    sampleRate: renderedBuffer.sampleRate,
    channels: renderedBuffer.numberOfChannels,
    format: ext.toUpperCase(),
    bitDepthOrBitrate,
    sizeBytes: outBlob.size,
    filename: finalFilename,
    isPeakProtected: peakProtection,
    isNormalized: loudnessNormalize,
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
  const ssndChunkSize = 8 + ssndDataSize;
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

  const exp = 16383 + 15;
  view.setUint16(offset + 16, exp, false);
  view.setUint32(offset + 18, (sampleRate << 16) >>> 0, false);
  view.setUint32(offset + 22, 0, false);

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
  wavBitDepth: number,
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
    bytes = sr * numChannels * (wavBitDepth / 8) * durationSeconds + 54;
  } else {
    bytes = sr * numChannels * (wavBitDepth / 8) * durationSeconds + 44;
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
