/**
 * Pure DSP helpers used by the render engine.
 *
 * These functions operate on plain Float32Array channel data (no Web Audio),
 * which makes the maths testable in Node and keeps the graph builder honest:
 * whatever the UI claims about limiting, normalisation or sample-rate
 * conversion is implemented here and covered by unit tests.
 */

/** Replaces NaN / ±Infinity with 0 and returns how many samples were repaired. */
export function sanitizeChannels(channels: Float32Array[]): number {
  let repaired = 0;
  for (const channel of channels) {
    for (let i = 0; i < channel.length; i++) {
      const value = channel[i];
      if (!Number.isFinite(value)) {
        channel[i] = 0;
        repaired++;
      }
    }
  }
  return repaired;
}

/** Peak absolute sample across every channel. */
export function measurePeak(channels: Float32Array[]): number {
  let peak = 0;
  for (const channel of channels) {
    for (let i = 0; i < channel.length; i++) {
      const value = Math.abs(channel[i]);
      if (value > peak) peak = value;
    }
  }
  return peak;
}

/**
 * Peak normalisation: a single linear make-up gain so the loudest sample sits
 * at `targetLinear`. This is *not* LUFS loudness normalisation.
 *
 * Silence (and near-silence) is left untouched instead of amplifying noise.
 * Returns the applied gain in dB (0 when nothing changed).
 */
export function applyPeakNormalize(channels: Float32Array[], targetLinear = 0.944): number {
  const peak = measurePeak(channels);
  if (peak <= 0.001 || peak >= targetLinear) return 0;

  const gain = targetLinear / peak;
  for (const channel of channels) {
    for (let i = 0; i < channel.length; i++) {
      channel[i] *= gain;
    }
  }
  return 20 * Math.log10(gain);
}

export interface LimiterResult {
  /** True when at least one sample needed gain reduction. */
  limited: boolean;
  /** Largest gain reduction applied, in dB (0 when unlimited). */
  maxReductionDb: number;
}

/**
 * True look-ahead peak limiter (channel-linked).
 *
 * A monotonic deque keeps the minimum target gain over a sliding window that
 * extends `lookaheadMs` into the future, so gain reduction starts *before* a
 * transient reaches the output. Release is a one-pole ramp towards unity.
 *
 * Because the applied gain never exceeds the window minimum, no output sample
 * ends up above the ceiling (sample peak, not true peak).
 */
export function applyLookaheadLimiter(
  channels: Float32Array[],
  sampleRate: number,
  ceilingDb = -0.3,
  lookaheadMs = 5,
  releaseMs = 80
): LimiterResult {
  const frameCount = channels[0]?.length ?? 0;
  if (frameCount === 0 || channels.length === 0) {
    return { limited: false, maxReductionDb: 0 };
  }

  const ceiling = Math.pow(10, ceilingDb / 20);
  const lookahead = Math.max(1, Math.round((sampleRate * lookaheadMs) / 1000));
  const releaseCoef = 1 - Math.exp(-1 / Math.max(1, (sampleRate * releaseMs) / 1000));

  const targetGain = (index: number): number => {
    let peak = 0;
    for (const channel of channels) {
      const abs = Math.abs(channel[index]);
      if (abs > peak) peak = abs;
    }
    return peak > ceiling ? ceiling / peak : 1;
  };

  // Deque of (index, value) holding the window minimum, values non-decreasing.
  const indices: number[] = [];
  const values: number[] = [];
  let head = 0;

  const push = (index: number) => {
    const value = targetGain(index);
    while (values.length > head && values[values.length - 1] >= value) {
      values.pop();
      indices.pop();
    }
    values.push(value);
    indices.push(index);
  };

  for (let i = 0; i <= Math.min(lookahead, frameCount - 1); i++) push(i);

  let gain = 1;
  let limited = false;
  let maxReductionDb = 0;

  for (let i = 0; i < frameCount; i++) {
    const windowMin = values[head];
    if (windowMin < gain) {
      // Attack is instantaneous; the window already looked ahead.
      gain = windowMin;
    } else {
      gain = gain + (1 - gain) * releaseCoef;
    }

    if (gain < 0.99995) {
      limited = true;
      const reductionDb = 20 * Math.log10(Math.max(gain, 1e-6));
      if (reductionDb < maxReductionDb) maxReductionDb = reductionDb;
    }

    for (const channel of channels) {
      const scaled = channel[i] * gain;
      // Belt and braces: floating point rounding should never exceed the ceiling.
      channel[i] = scaled > ceiling ? ceiling : scaled < -ceiling ? -ceiling : scaled;
    }

    if (indices[head] === i) head++;
    const next = i + lookahead + 1;
    if (next < frameCount) push(next);

    if (head > 4096) {
      indices.splice(0, head);
      values.splice(0, head);
      head = 0;
    }
  }

  return { limited, maxReductionDb };
}

/** Averages every channel into a single mono channel. */
export function downmixChannels(channels: Float32Array[]): Float32Array[] {
  if (channels.length <= 1) return channels;
  const frameCount = channels[0].length;
  const mono = new Float32Array(frameCount);
  for (const channel of channels) {
    for (let i = 0; i < frameCount; i++) {
      mono[i] += channel[i];
    }
  }
  const scale = 1 / channels.length;
  for (let i = 0; i < frameCount; i++) mono[i] *= scale;
  return [mono];
}

const PHASE_COUNT = 256;

interface KernelTable {
  taps: number;
  coefficients: Float32Array;
  norms: Float32Array;
}

const kernelCache = new Map<string, KernelTable>();

function buildKernelTable(taps: number, cutoff: number): KernelTable {
  const key = `${taps}:${cutoff.toFixed(5)}`;
  const cached = kernelCache.get(key);
  if (cached) return cached;

  const width = taps * 2;
  const coefficients = new Float32Array(PHASE_COUNT * width);
  const norms = new Float32Array(PHASE_COUNT);

  for (let phase = 0; phase < PHASE_COUNT; phase++) {
    const fraction = phase / PHASE_COUNT;
    let sum = 0;
    for (let tap = 0; tap < width; tap++) {
      // Tap positions cover -(taps - 1) .. +taps relative to the sample floor.
      const distance = tap - taps + 1 - fraction;
      const sinc =
        distance === 0
          ? 1
          : Math.sin(Math.PI * cutoff * distance) / (Math.PI * cutoff * distance);
      const window = 0.5 + 0.5 * Math.cos((Math.PI * distance) / taps);
      const coefficient = cutoff * sinc * window;
      coefficients[phase * width + tap] = coefficient;
      sum += coefficient;
    }
    norms[phase] = sum;
  }

  const table = { taps, coefficients, norms };
  kernelCache.set(key, table);
  return table;
}

/**
 * Windowed-sinc sample-rate conversion.
 *
 * Matches the source with a 16-tap kernel when upsampling and 24–32 taps when
 * downsampling (where the anti-alias filter needs a longer transition band).
 * Edges are renormalised so the file does not fade in or out.
 */
export function resampleChannels(
  channels: Float32Array[],
  sourceRate: number,
  targetRate: number
): Float32Array[] {
  if (
    channels.length === 0 ||
    sourceRate === targetRate ||
    !Number.isFinite(sourceRate) ||
    !Number.isFinite(targetRate) ||
    sourceRate <= 0 ||
    targetRate <= 0
  ) {
    return channels;
  }

  const ratio = targetRate / sourceRate;
  const inputLength = channels[0].length;
  const outputLength = Math.max(1, Math.round(inputLength * ratio));
  const taps = ratio < 0.75 ? 32 : ratio < 0.95 ? 24 : 16;
  const cutoff = Math.min(1, ratio) * 0.92;
  const table = buildKernelTable(taps, cutoff);
  const width = taps * 2;
  const step = sourceRate / targetRate;

  const output = channels.map(() => new Float32Array(outputLength));

  for (let i = 0; i < outputLength; i++) {
    const position = i * step;
    const base = Math.floor(position);
    const fraction = position - base;
    const phase = Math.min(
      PHASE_COUNT - 1,
      Math.max(0, Math.round(fraction * PHASE_COUNT))
    );
    const offset = phase * width;

    const edge = base < taps || base >= inputLength - taps;

    for (let channelIndex = 0; channelIndex < channels.length; channelIndex++) {
      const input = channels[channelIndex];
      let sum = 0;
      let norm = 0;

      for (let tap = 0; tap < width; tap++) {
        const sourceIndex = base + tap - taps + 1;
        if (sourceIndex < 0 || sourceIndex >= inputLength) continue;
        const coefficient = table.coefficients[offset + tap];
        sum += input[sourceIndex] * coefficient;
        norm += coefficient;
      }

      output[channelIndex][i] = edge
        ? Math.abs(norm) > 1e-9
          ? sum / norm
          : 0
        : sum / table.norms[phase];
    }
  }

  return output;
}

/**
 * IEC 61966-2-1 style 80-bit IEEE 754 extended float, big-endian, used by AIFF's
 * COMM chunk. Handles sample rates ≥ 65536 Hz correctly.
 */
export function float80Bytes(value: number): Uint8Array {
  const bytes = new Uint8Array(10);
  if (!Number.isFinite(value) || value === 0) return bytes;

  const negative = value < 0;
  const magnitude = Math.abs(value);
  const exponent = Math.floor(Math.log2(magnitude));
  const mantissa = magnitude / Math.pow(2, exponent); // [1, 2)

  let hi = Math.floor(mantissa * 2147483648); // mantissa * 2^31
  let lo = Math.round((mantissa * 2147483648 - hi) * 4294967296);
  let unbiased = exponent;

  if (lo >= 4294967296) {
    lo = 0;
    hi += 1;
  }
  if (hi >= 4294967296) {
    hi = 2147483648;
    unbiased += 1;
  }

  const biased = unbiased + 16383;
  bytes[0] = ((negative ? 0x80 : 0) | ((biased >> 8) & 0x7f)) & 0xff;
  bytes[1] = biased & 0xff;
  bytes[2] = (hi >>> 24) & 0xff;
  bytes[3] = (hi >>> 16) & 0xff;
  bytes[4] = (hi >>> 8) & 0xff;
  bytes[5] = hi & 0xff;
  bytes[6] = (lo >>> 24) & 0xff;
  bytes[7] = (lo >>> 16) & 0xff;
  bytes[8] = (lo >>> 8) & 0xff;
  bytes[9] = lo & 0xff;
  return bytes;
}

/**
 * Calculates root-mean-square (RMS) energy across all channels.
 * Returns linear amplitude (0.0 to 1.0+).
 */
export function measureRms(channels: Float32Array[]): number {
  if (channels.length === 0 || channels[0].length === 0) return 0;
  let sumSq = 0;
  let totalSamples = 0;
  for (const channel of channels) {
    const len = channel.length;
    totalSamples += len;
    for (let i = 0; i < len; i++) {
      const v = channel[i];
      sumSq += v * v;
    }
  }
  return totalSamples > 0 ? Math.sqrt(sumSq / totalSamples) : 0;
}

/**
 * Measures the maximum absolute DC bias (mean sample value) across all channels.
 */
export function measureDcOffset(channels: Float32Array[]): number {
  if (channels.length === 0 || channels[0].length === 0) return 0;
  let maxOffset = 0;
  for (const channel of channels) {
    let sum = 0;
    const len = channel.length;
    for (let i = 0; i < len; i++) {
      sum += channel[i];
    }
    const offset = Math.abs(sum / len);
    if (offset > maxOffset) maxOffset = offset;
  }
  return maxOffset;
}

/**
 * Removes DC offset by subtracting the mean sample value from each channel.
 * Returns the largest absolute offset that was corrected.
 */
export function removeDcOffset(channels: Float32Array[]): number {
  if (channels.length === 0 || channels[0].length === 0) return 0;
  let maxCorrected = 0;
  for (const channel of channels) {
    let sum = 0;
    const len = channel.length;
    for (let i = 0; i < len; i++) {
      sum += channel[i];
    }
    const mean = sum / len;
    const absMean = Math.abs(mean);
    if (absMean > maxCorrected) maxCorrected = absMean;

    if (absMean > 1e-7) {
      for (let i = 0; i < len; i++) {
        channel[i] -= mean;
      }
    }
  }
  return maxCorrected;
}

/**
 * Pure Float32Array bitcrusher and sample-rate decimation.
 * - bitDepth: discrete word length (2 to 16 bits).
 * - downsampleFactor: sample-and-hold interval (1 to 64).
 * - mix: linear wet/dry balance (0 to 1).
 */
export function applyBitcrush(
  channels: Float32Array[],
  bitDepth = 8,
  downsampleFactor = 1,
  mix = 1.0
): void {
  if (channels.length === 0 || channels[0].length === 0) return;
  const clampedDepth = Math.max(2, Math.min(16, Math.round(bitDepth)));
  const clampedDownsample = Math.max(1, Math.min(64, Math.round(downsampleFactor)));
  const clampedMix = Math.max(0, Math.min(1, mix));

  if (clampedDepth >= 16 && clampedDownsample === 1) return;
  if (clampedMix <= 0) return;

  const levels = Math.pow(2, clampedDepth - 1);
  const invLevels = 1 / levels;

  for (const channel of channels) {
    const len = channel.length;
    let heldSample = 0;

    for (let i = 0; i < len; i++) {
      if (i % clampedDownsample === 0) {
        const orig = channel[i];
        // Quantize
        heldSample = Math.round(orig * levels) * invLevels;
        // Clamp to [-1, 1]
        if (heldSample > 1) heldSample = 1;
        else if (heldSample < -1) heldSample = -1;
      }

      if (clampedMix >= 0.999) {
        channel[i] = heldSample;
      } else {
        channel[i] = channel[i] * (1 - clampedMix) + heldSample * clampedMix;
      }
    }
  }
}
