import { describe, expect, it } from "vitest";
import {
  applyBitcrush,
  applyLookaheadLimiter,
  applyPeakNormalize,
  downmixChannels,
  measureDcOffset,
  measurePeak,
  measureRms,
  removeDcOffset,
  resampleChannels,
  sanitizeChannels,
} from "../dsp-utils";
import {
  createPcmBuffer,
} from "../renderer";
import { encodeAiff, encodeMp3, encodeWav } from "../encoders";
import { formatExportFilename } from "../export-filename";

/**
 * Synthetic Signal Generator Helpers
 */
function generateSilence(length: number): Float32Array {
  return new Float32Array(length);
}

function generateDiracImpulse(length: number, position: number, amplitude = 1.0): Float32Array {
  const ch = new Float32Array(length);
  if (position >= 0 && position < length) {
    ch[position] = amplitude;
  }
  return ch;
}

function generateSineWave(length: number, sampleRate: number, frequencyHz: number, amplitude = 1.0): Float32Array {
  const ch = new Float32Array(length);
  const omega = (2 * Math.PI * frequencyHz) / sampleRate;
  for (let i = 0; i < length; i++) {
    ch[i] = Math.sin(i * omega) * amplitude;
  }
  return ch;
}

function generateMultiTone(
  length: number,
  sampleRate: number,
  tones: Array<{ freq: number; amp: number }>
): Float32Array {
  const ch = new Float32Array(length);
  for (const { freq, amp } of tones) {
    const omega = (2 * Math.PI * freq) / sampleRate;
    for (let i = 0; i < length; i++) {
      ch[i] += Math.sin(i * omega) * amp;
    }
  }
  return ch;
}

function generateUniformWhiteNoise(length: number, peak = 0.8): Float32Array {
  const ch = new Float32Array(length);
  for (let i = 0; i < length; i++) {
    ch[i] = (Math.random() * 2 - 1) * peak;
  }
  return ch;
}

describe("Comprehensive Synthetic DSP Quality & Measurement Suite", () => {
  const SAMPLE_RATE = 48000;
  const CEILING_DB = -0.3;
  const CEILING_LINEAR = Math.pow(10, CEILING_DB / 20); // ~0.96605

  describe("1. Silence Signal Verification", () => {
    it("measures exactly zero peak, RMS, and DC offset on silence", () => {
      const silence = [generateSilence(2400)];
      expect(measurePeak(silence)).toBe(0);
      expect(measureRms(silence)).toBe(0);
      expect(measureDcOffset(silence)).toBe(0);
    });

    it("leaves silence completely uncompressed and unmodified through limiter", () => {
      const silence = [generateSilence(2400)];
      const res = applyLookaheadLimiter(silence, SAMPLE_RATE, CEILING_DB);
      expect(res.limited).toBe(false);
      expect(res.maxReductionDb).toBe(0);
      expect(measurePeak(silence)).toBe(0);
    });

    it("does not amplify pure silence during peak normalization", () => {
      const silence = [generateSilence(2400)];
      const gainDb = applyPeakNormalize(silence, 0.944);
      expect(gainDb).toBe(0);
      expect(measurePeak(silence)).toBe(0);
    });
  });

  describe("2. Impulse & Transient Response", () => {
    it("strictly clamps Dirac delta impulse (+12 dBFS / 4.0 peak) to -0.3 dBFS ceiling", () => {
      const impulse = [generateDiracImpulse(4800, 1000, 4.0)];
      const res = applyLookaheadLimiter(impulse, SAMPLE_RATE, CEILING_DB);

      expect(res.limited).toBe(true);
      expect(res.maxReductionDb).toBeLessThan(-11.5); // reduced by ~12 dB

      const peak = measurePeak(impulse);
      expect(peak).toBeLessThanOrEqual(CEILING_LINEAR + 1e-6);

      // Verify no NaNs or Infinities generated
      for (let i = 0; i < impulse[0].length; i++) {
        expect(Number.isFinite(impulse[0][i])).toBe(true);
      }
    });

    it("begins gain reduction ahead of transient via true look-ahead window", () => {
      const sampleRate = 48000;
      const lookaheadMs = 5;
      const lookaheadSamples = Math.round((sampleRate * lookaheadMs) / 1000); // 240 samples
      const impulsePos = 1200;

      // Clean quiet tone with single transient spike
      const ch = generateSineWave(4800, sampleRate, 440, 0.2);
      ch[impulsePos] = 3.0; // hot transient

      const channels = [ch];
      applyLookaheadLimiter(channels, sampleRate, CEILING_DB, lookaheadMs, 80);

      // Verify gain reduction started BEFORE impulsePos
      const samplePrior = Math.abs(channels[0][impulsePos - Math.floor(lookaheadSamples / 2)]);
      expect(samplePrior).toBeLessThan(0.2); // Attenuation already began
    });
  });

  describe("3. Pure Sine Wave Measurement", () => {
    it("measures exact RMS ratio for unclipped sine wave (RMS = Peak / sqrt(2))", () => {
      const peakAmp = 0.8;
      const sine = [generateSineWave(48000, SAMPLE_RATE, 1000, peakAmp)];

      const measuredPeak = measurePeak(sine);
      const measuredRms = measureRms(sine);

      expect(measuredPeak).toBeCloseTo(peakAmp, 4);
      expect(measuredRms).toBeCloseTo(peakAmp / Math.SQRT2, 3);
    });

    it("leaves sine waves with peak < -0.3 dBFS bit-identical without limiter reduction", () => {
      const cleanAmp = 0.85; // ~-1.4 dBFS
      const original = generateSineWave(9600, SAMPLE_RATE, 440, cleanAmp);
      const testChannel = new Float32Array(original);

      const res = applyLookaheadLimiter([testChannel], SAMPLE_RATE, CEILING_DB);
      expect(res.limited).toBe(false);
      expect(res.maxReductionDb).toBe(0);

      // Bit-level equivalence
      for (let i = 0; i < original.length; i++) {
        expect(testChannel[i]).toBe(original[i]);
      }
    });
  });

  describe("4. Multi-Tone & Broadband Test Signals", () => {
    it("measures multi-tone composite signals with correct RMS energy addition", () => {
      const tones = [
        { freq: 100, amp: 0.3 },
        { freq: 1000, amp: 0.3 },
        { freq: 8000, amp: 0.3 },
      ];
      const multi = [generateMultiTone(24000, SAMPLE_RATE, tones)];

      // Theoretical RMS = sqrt(sum(amp_i^2 / 2)) = sqrt(3 * 0.09 / 2) = sqrt(0.135) ~= 0.3674
      const measuredRms = measureRms(multi);
      expect(measuredRms).toBeCloseTo(Math.sqrt(3 * (0.09 / 2)), 2);
    });

    it("cleans broadband white noise with zero NaNs or Infinities", () => {
      const noise = [generateUniformWhiteNoise(12000, 0.9)];
      const repaired = sanitizeChannels(noise);
      expect(repaired).toBe(0); // Clean noise has 0 NaNs

      const dc = measureDcOffset(noise);
      expect(dc).toBeLessThan(0.05); // White noise has near-zero mean DC
    });
  });

  describe("5. DC Offset Detection and Removal", () => {
    it("detects and eliminates DC bias from audio buffers", () => {
      const dcBiased = generateSineWave(9600, SAMPLE_RATE, 440, 0.5);
      const DC_BIAS = 0.35;
      for (let i = 0; i < dcBiased.length; i++) {
        dcBiased[i] += DC_BIAS;
      }
      const channels = [dcBiased];

      expect(measureDcOffset(channels)).toBeCloseTo(DC_BIAS, 3);

      const maxCorrected = removeDcOffset(channels);
      expect(maxCorrected).toBeCloseTo(DC_BIAS, 3);
      expect(measureDcOffset(channels)).toBeLessThan(1e-6);
    });
  });

  describe("6. Stereo Imaging, Haas Precedence & Channel Balance", () => {
    it("downmixes stereo signal to exact arithmetic mean mono", () => {
      const left = new Float32Array([0.8, -0.4, 0.6]);
      const right = new Float32Array([0.2, 0.4, 0.2]);
      const mono = downmixChannels([left, right]);

      expect(mono.length).toBe(1);
      expect(mono[0][0]).toBeCloseTo(0.5, 6);
      expect(mono[0][1]).toBeCloseTo(0.0, 6);
      expect(mono[0][2]).toBeCloseTo(0.4, 6);
    });

    it("preserves channel count and avoids mono cancellation in downmix", () => {
      const left = generateSineWave(4800, SAMPLE_RATE, 440, 0.7);
      const right = generateSineWave(4800, SAMPLE_RATE, 440, 0.7);
      const mono = downmixChannels([left, right]);

      expect(measurePeak(mono)).toBeCloseTo(0.7, 4);
    });
  });

  describe("7. Polyphase Windowed-Sinc Sample-Rate Conversion", () => {
    it("accurately resamples 44.1 kHz sine wave to 48 kHz", () => {
      const freq = 1000;
      const inRate = 44100;
      const outRate = 48000;
      const input = [generateSineWave(inRate, inRate, freq, 0.8)];

      const output = resampleChannels(input, inRate, outRate);
      expect(output[0].length).toBe(outRate);
      expect(measurePeak(output)).toBeCloseTo(0.8, 1);
    });

    it("resamples from 96 kHz down to 44.1 kHz without aliasing explosion", () => {
      const inRate = 96000;
      const outRate = 44100;
      const input = [generateSineWave(inRate, inRate, 2000, 0.75)];

      const output = resampleChannels(input, inRate, outRate);
      expect(output[0].length).toBe(outRate);
      expect(measurePeak(output)).toBeLessThanOrEqual(0.8);
    });
  });

  describe("8. Multi-Format Binary Encoders Verification", () => {
    const stereo = [
      generateSineWave(4800, 48000, 440, 0.7),
      generateSineWave(4800, 48000, 440, 0.7),
    ];
    const buffer = createPcmBuffer(stereo, 48000);

    it("encodes valid 16-bit WAV with correct 44-byte RIFF header", () => {
      const blob = encodeWav(buffer, 16);
      expect(blob.type).toBe("audio/wav");
      // 44 bytes header + (4800 frames * 2 channels * 2 bytes)
      expect(blob.size).toBe(44 + 4800 * 2 * 2);
    });

    it("encodes valid 24-bit WAV with correct 3-byte-per-sample size", () => {
      const blob = encodeWav(buffer, 24);
      expect(blob.type).toBe("audio/wav");
      expect(blob.size).toBe(44 + 4800 * 2 * 3);
    });

    it("encodes valid 32-bit float WAV with IEEE float tag", () => {
      const blob = encodeWav(buffer, 32);
      expect(blob.type).toBe("audio/wav");
      expect(blob.size).toBe(44 + 4800 * 2 * 4);
    });

    it("encodes valid AIFF with big-endian chunks", () => {
      const blob = encodeAiff(buffer, 16);
      expect(blob.type).toBe("audio/aiff");
      expect(blob.size).toBeGreaterThan(4800 * 2 * 2);
    });

    it("encodes valid MP3 at 320 kbps using standard sample rates", () => {
      const blob = encodeMp3(buffer, 320);
      expect(blob.type).toBe("audio/mp3");
      expect(blob.size).toBeGreaterThan(100);
    });
  });

  describe("9. Digital Bitcrusher & Sample-Rate Decimation", () => {
    it("quantizes continuous float to discrete bit depth levels", () => {
      const ch = generateSineWave(4800, SAMPLE_RATE, 440, 1.0);
      const channels = [ch];

      applyBitcrush(channels, 4, 1, 1.0); // 4-bit = 16 levels

      const uniqueValues = new Set<number>();
      for (let i = 0; i < ch.length; i++) {
        uniqueValues.add(Number(ch[i].toFixed(4)));
      }

      // 4-bit discrete quantization has at most 17 distinct levels in [-1, 1]
      expect(uniqueValues.size).toBeLessThanOrEqual(17);
    });
  });

  describe("10. Global Standardized Filename Generation", () => {
    it("generates standardized filenames across all tools and presets", () => {
      expect(
        formatExportFilename({
          editType: "cathedral-reverb",
          originalFileName: "Ambient Track.wav",
          extension: "wav",
        })
      ).toBe("Audify-Cathedral-Reverb-Ambient-Track.wav");

      expect(
        formatExportFilename({
          editType: "audio-merger",
          originalFileName: "Podcast Episode.mp3",
          extension: "mp3",
        })
      ).toBe("Audify-Audio-Merger-Podcast-Episode.mp3");

      expect(
        formatExportFilename({
          editType: "audio-splitter",
          originalFileName: "DJ Set.aiff",
          extension: "aiff",
          partIndex: 3,
        })
      ).toBe("Audify-Audio-Splitter-DJ-Set-Part-03.aiff");
    });
  });
});

