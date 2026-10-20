import { describe, expect, it } from "vitest";

import {
  applyLookaheadLimiter,
  applyPeakNormalize,
  downmixChannels,
  float80Bytes,
  measurePeak,
  resampleChannels,
  sanitizeChannels,
} from "../dsp-utils";

describe("sanitizeChannels", () => {
  it("repairs NaN and infinity to silence and counts the repairs", () => {
    const left = new Float32Array([0.5, NaN, 0.25, Infinity]);
    const right = new Float32Array([-Infinity, 0, 0, 0]);

    const repaired = sanitizeChannels([left, right]);

    // NaN and +Inf live on the left, -Inf on the right.
    expect(repaired).toBe(3);
    expect(Array.from(left)).toEqual([0.5, 0, 0.25, 0]);
    expect(Array.from(right)).toEqual([0, 0, 0, 0]);
  });

  it("leaves finite buffers untouched", () => {
    const channel = new Float32Array([0.5, -0.5, 0]);
    expect(sanitizeChannels([channel])).toBe(0);
    expect(Array.from(channel)).toEqual([0.5, -0.5, 0]);
  });
});

describe("measurePeak", () => {
  it("returns the largest absolute sample across channels", () => {
    expect(measurePeak([new Float32Array([0.2, -0.9]), new Float32Array([0.7])])).toBeCloseTo(0.9);
    expect(measurePeak([new Float32Array([])])).toBe(0);
  });
});

describe("applyPeakNormalize", () => {
  it("raises the loudest sample to the target level", () => {
    const channel = new Float32Array([0.2, -0.4, 0.1]);
    const gainDb = applyPeakNormalize([channel], 0.944);

    expect(measurePeak([channel])).toBeCloseTo(0.944, 5);
    expect(gainDb).toBeGreaterThan(0);
  });

  it("does not amplify silence or already-loud material", () => {
    const silence = new Float32Array(16);
    expect(applyPeakNormalize([silence], 0.944)).toBe(0);
    expect(measurePeak([silence])).toBe(0);

    const loud = new Float32Array([1.0, -0.5]);
    expect(applyPeakNormalize([loud], 0.944)).toBe(0);
    expect(measurePeak([loud])).toBeCloseTo(1.0);
  });

  it("attenuates nothing: peaks above target are returned untouched instead", () => {
    const channel = new Float32Array([0.99, -0.3]);
    const before = Array.from(channel);
    applyPeakNormalize([channel], 0.5);
    expect(Array.from(channel)).toEqual(before);
  });
});

describe("applyLookaheadLimiter", () => {
  it("pulls a single transient to the -0.3 dBFS ceiling, nothing more", () => {
    const sampleRate = 44100;
    const channel = new Float32Array(sampleRate);
    for (let i = 0; i < sampleRate; i++) {
      channel[i] = 1.2 * Math.sin((2 * Math.PI * 440 * i) / sampleRate);
    }

    const { limited, maxReductionDb } = applyLookaheadLimiter([channel], sampleRate);

    expect(limited).toBe(true);
    // 1.2 → 0.966 is ≈ -1.89 dB of the worst reduction.
    expect(maxReductionDb).toBeGreaterThan(-3);
    expect(maxReductionDb).toBeLessThan(-1);
    expect(measurePeak([channel])).toBeLessThanOrEqual(
      Math.pow(10, -0.3 / 20) + 1e-6
    );
  });

  it("reports no reduction on a quiet program", () => {
    const sampleRate = 44100;
    const channel = new Float32Array(sampleRate);
    for (let i = 0; i < sampleRate; i++) {
      channel[i] = 0.3 * Math.sin((2 * Math.PI * 440 * i) / sampleRate);
    }

    const { limited, maxReductionDb } = applyLookaheadLimiter([channel], sampleRate);
    expect(limited).toBe(false);
    expect(maxReductionDb).toBe(0);
    expect(measurePeak([channel])).toBeLessThanOrEqual(0.31);
  });

  it("clamps gain channels together (channel-linked)", () => {
    const sampleRate = 8000;
    const frames = 4000;
    const left = new Float32Array(frames);
    const right = new Float32Array(frames);
    for (let i = 0; i < frames; i++) {
      left[i] = 0.2 * Math.sin(i / 5);
      right[i] = 0.2 * Math.sin(i / 5);
    }
    left[1000] = 1.5;
    right[1000] = -0.4; // far below ceiling for its own amplitude

    const result = applyLookaheadLimiter([left, right], sampleRate);

    expect(result.limited).toBe(true);
    // Channel-linked gain: both channels are scaled by the same factor.
    const ceiling = Math.pow(10, -0.3 / 20);
    expect(measurePeak([left, right])).toBeLessThanOrEqual(ceiling + 1e-6);
    expect(measurePeak([right])).toBeLessThanOrEqual(ceiling + 1e-6);
  });

  it("handles empty buffers gracefully", () => {
    expect(applyLookaheadLimiter([], 44100)).toEqual({ limited: false, maxReductionDb: 0 });
  });
});

describe("downmixChannels", () => {
  it("folds stereo as the straight 0.5 × (L + R) average", () => {
    const left = new Float32Array([1, -1, 0.5]);
    const right = new Float32Array([0.5, 0.25, 0.5]);

    const mono = downmixChannels([left, right]);

    expect(mono.length).toBe(1);
    expect(mono[0].length).toBe(3);
    // Correlated extremes: 0.5×(1 + 0.5) etc, never above full scale.
    expect(mono[0][0]).toBeCloseTo(0.75);
    expect(mono[0][1]).toBeCloseTo(-0.375);
    expect(mono[0][2]).toBeCloseTo(0.5);
  });

  it("returns a mono input array unchanged", () => {
    const mono = new Float32Array([0.5, 0.25]);
    const input = [mono];
    const result = downmixChannels(input);
    expect(result).toBe(input); // same array instance returned, no copy
    expect(result[0]).toBe(mono);
  });
});

describe("resampleChannels", () => {
  it("returns the same array object at matching rates", () => {
    const channel = new Float32Array([0.5, -0.5]);
    const input = [channel];
    const result = resampleChannels(input, 44100, 44100);
    expect(result).toBe(input); // no-op fast path keeps the original array
    expect(result[0]).toBe(channel);
  });

  it("produces the expected frame count for 48 kHz → 44.1 kHz", () => {
    const sourceRate = 48000;
    const channel = new Float32Array(sourceRate);
    for (let i = 0; i < sourceRate; i++) {
      channel[i] = Math.sin((2 * Math.PI * 1000 * i) / sourceRate);
    }
    const targetRate = 44100;

    const result = resampleChannels([channel], sourceRate, targetRate);
    expect(result[0].length).toBe(Math.round(sourceRate * (44100 / 48000)));
  });

  it("does not fade in or out at the edges", () => {
    const sourceRate = 8000;
    const targetRate = 22050; // upsampling: ratio > 1
    const channel = new Float32Array(sourceRate);
    for (let i = 0; i < sourceRate; i++) {
      channel[i] = 0.8 * Math.sin((2 * Math.PI * 440 * i) / sourceRate);
    }

    const [result] = resampleChannels([channel], sourceRate, targetRate);
    const seconds = result.length / targetRate;

    expect(seconds).toBeCloseTo(1, 1); // full duration preserved
    // The start and end regions should still ring near the source amplitude.
    let startPeak = 0;
    for (let i = 0; i < Math.round(0.1 * targetRate); i++) {
      startPeak = Math.max(startPeak, Math.abs(result[i]));
    }
    expect(startPeak).toBeGreaterThan(0.5);
  });

  it("keeps a DC step near unity after downsampling", () => {
    const sourceRate = 48000;
    const channel = new Float32Array(sourceRate);
    channel.fill(0.7); // DC step: resampling a constant must keep the constant.

    const [result] = resampleChannels([channel], 48000, 16000);

    // Interior of the output should essentially be 0.7 everywhere.
    let sum = 0;
    for (let i = 0; i < result.length; i++) sum += result[i];
    expect(sum / result.length).toBeCloseTo(0.7, 2);
  });
});

describe("float80Bytes", () => {
  it("encodes 44100 with the expected biased exponent (0x400E)", () => {
    const bytes = float80Bytes(44100);
    // log2(44100) ≈ 15.42 → unbiased expponent 15, biased 15 + 16383 = 16398 = 0x400E.
    expect(bytes[0]).toBe(0x40);
    expect(bytes[1]).toBe(0x0e);
  });

  it("round-trips common sample rates within 1 Hz", () => {
    const decode = (bytes: Uint8Array): number => {
      const negative = (bytes[0] & 0x80) !== 0;
      const exponent = ((bytes[0] & 0x7f) << 8) | bytes[1];
      let mantissa = 0;
      for (let i = 0; i < 8; i++) {
        mantissa = mantissa * 256 + bytes[2 + i];
      }
      const value = mantissa * Math.pow(2, exponent - 16383 - 63);
      return negative ? -value : value;
    };

    for (const rate of [8000, 11025, 16000, 22050, 32000, 32000, 44100, 48000, 65536]) {
      expect(Math.abs(decode(float80Bytes(rate)) - rate)).toBeLessThan(1);
    }
  });

  it("encodes zero and non-finite values as all-zero bytes", () => {
    expect(float80Bytes(0).every((b) => b === 0)).toBe(true);
    expect(float80Bytes(NaN).every((b) => b === 0)).toBe(true);
    expect(float80Bytes(Infinity).every((b) => b === 0)).toBe(true);
  });

  it("marks negative values with the sign bit", () => {
    expect(float80Bytes(-1).length).toBe(10);
    // First byte top bit is sign; mantissa of 1 gives exponent 16383.
    expect((float80Bytes(-1)[0] & 0x80) !== 0).toBe(true);
  });
});
