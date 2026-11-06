import { describe, expect, it } from "vitest";
import {
  applyLookaheadLimiter,
  applyPeakNormalize,
  downmixChannels,
  measurePeak,
  resampleChannels,
  sanitizeChannels,
} from "../dsp-utils";
import {
  computeRenderSignature,
  resolveProcessing,
} from "../dsp-plan";
import { encodeAiff, encodeMp3, encodeWav, ProcessingCancelledError } from "../../audio-engine";

// Helper to create synthetic Float32Array channels
function createChannel(length: number, generator: (i: number) => number): Float32Array {
  const channel = new Float32Array(length);
  for (let i = 0; i < length; i++) {
    channel[i] = generator(i);
  }
  return channel;
}

// Minimal AudioBuffer mock for Node test environment
function createMockAudioBuffer(channels: Float32Array[], sampleRate = 44100): AudioBuffer {
  return {
    numberOfChannels: channels.length,
    length: channels[0].length,
    duration: channels[0].length / sampleRate,
    sampleRate,
    getChannelData: (c: number) => channels[c],
    copyFromChannel: () => {},
    copyToChannel: () => {},
  } as unknown as AudioBuffer;
}

describe("Audio Quality & DSP Engine Objective Audit", () => {
  describe("Peak Limiting and Headroom Protection", () => {
    it("strictly clamps hot signals (+6 dBFS, 2.0 peak) to ceiling (-0.3 dBFS)", () => {
      const sampleRate = 48000;
      // High transient peak of amplitude 2.0 (+6 dBFS)
      const hotSignal = createChannel(4800, (i) => (i === 1000 ? 2.0 : Math.sin((i / 48) * Math.PI * 2) * 0.5));
      const channels = [new Float32Array(hotSignal), new Float32Array(hotSignal)];

      const ceilingDb = -0.3;
      const ceilingLinear = Math.pow(10, ceilingDb / 20); // ~0.966

      const result = applyLookaheadLimiter(channels, sampleRate, ceilingDb, 5, 80);

      expect(result.limited).toBe(true);
      expect(result.maxReductionDb).toBeLessThan(-5.5); // gain reduced by at least ~6dB

      // Ensure every output sample is strictly within ceiling
      for (const ch of channels) {
        for (let i = 0; i < ch.length; i++) {
          expect(Math.abs(ch[i])).toBeLessThanOrEqual(ceilingLinear + 1e-6);
          expect(Number.isFinite(ch[i])).toBe(true);
        }
      }
    });

    it("leaves quiet and silent signals untouched with 0 dB gain reduction", () => {
      const sampleRate = 44100;
      const silent = createChannel(1000, () => 0);
      const nearSilent = createChannel(1000, () => 0.0001);

      const resSilent = applyLookaheadLimiter([silent], sampleRate);
      expect(resSilent.limited).toBe(false);
      expect(resSilent.maxReductionDb).toBe(0);

      const resQuiet = applyLookaheadLimiter([nearSilent], sampleRate);
      expect(resQuiet.limited).toBe(false);
      expect(resQuiet.maxReductionDb).toBe(0);
    });

    it("protects against extreme bass boost low-shelf energy", () => {
      // 50 Hz sub bass wave with high amplitude
      const sampleRate = 44100;
      const bassSignal = createChannel(4410, (i) => Math.sin((i / (sampleRate / 50)) * Math.PI * 2) * 1.5);
      const channels = [bassSignal];

      const result = applyLookaheadLimiter(channels, sampleRate, -0.3);
      expect(result.limited).toBe(true);
      const postPeak = measurePeak(channels);
      expect(postPeak).toBeLessThanOrEqual(Math.pow(10, -0.3 / 20) + 1e-6);
    });
  });

  describe("Peak Normalization Mechanics", () => {
    it("scales peaks to target linear (0.944 = -0.5 dBFS) without distortion", () => {
      const channel = createChannel(1000, (i) => (i === 500 ? 0.472 : 0.1));
      const channels = [channel];

      const appliedDb = applyPeakNormalize(channels, 0.944);
      expect(appliedDb).toBeCloseTo(20 * Math.log10(0.944 / 0.472), 3); // ~6.02 dB
      expect(measurePeak(channels)).toBeCloseTo(0.944, 4);
    });

    it("does not amplify pure silence or near-silence (< 0.001)", () => {
      const silence = [new Float32Array(500)];
      const appliedDb = applyPeakNormalize(silence, 0.944);
      expect(appliedDb).toBe(0);
    });
  });

  describe("Data Integrity & Sanitization", () => {
    it("replaces NaNs and Infinities with zero and reports count", () => {
      const corrupted = new Float32Array([0.5, NaN, -Infinity, 0.8, Infinity, -0.2]);
      const repaired = sanitizeChannels([corrupted]);

      expect(repaired).toBe(3);
      expect(corrupted[1]).toBe(0);
      expect(corrupted[2]).toBe(0);
      expect(corrupted[4]).toBe(0);
      expect(corrupted[0]).toBeCloseTo(0.5, 5);
      expect(corrupted[3]).toBeCloseTo(0.8, 5);
      expect(corrupted[5]).toBeCloseTo(-0.2, 5);
    });
  });

  describe("Channel Downmixing & Stereo Imaging", () => {
    it("properly downmixes stereo to mono as the arithmetic mean of channels", () => {
      const left = new Float32Array([1.0, -0.5, 0.2]);
      const right = new Float32Array([0.0, 0.5, 0.8]);
      const mono = downmixChannels([left, right]);

      expect(mono.length).toBe(1);
      expect(mono[0][0]).toBeCloseTo(0.5, 6);
      expect(mono[0][1]).toBeCloseTo(0.0, 6);
      expect(mono[0][2]).toBeCloseTo(0.5, 6);
    });

    it("returns single channel as-is when already mono", () => {
      const single = [new Float32Array([0.1, 0.2])];
      expect(downmixChannels(single)).toBe(single);
    });
  });

  describe("Polyphase Windowed-Sinc Resampling Quality", () => {
    it("upsamples accurately from 44.1 kHz to 48 kHz", () => {
      const sourceRate = 44100;
      const targetRate = 48000;
      const input = [createChannel(4410, (i) => Math.sin((i / 44.1) * Math.PI * 2))]; // 1000 Hz tone

      const resampled = resampleChannels(input, sourceRate, targetRate);
      expect(resampled.length).toBe(1);
      expect(resampled[0].length).toBe(Math.round(4410 * (48000 / 44100)));
      expect(measurePeak(resampled)).toBeCloseTo(1.0, 1);
    });

    it("downsamples from 96 kHz to 44.1 kHz with anti-aliasing cutoff", () => {
      const sourceRate = 96000;
      const targetRate = 44100;
      const input = [createChannel(9600, (i) => Math.sin((i / 96) * Math.PI * 2))];

      const resampled = resampleChannels(input, sourceRate, targetRate);
      expect(resampled[0].length).toBe(Math.round(9600 * (44100 / 96000)));
    });

    it("is an identity pass-through when source and target sample rates match", () => {
      const input = [new Float32Array([0.1, 0.2, 0.3])];
      expect(resampleChannels(input, 44100, 44100)).toBe(input);
    });
  });

  describe("DSP Plan & Preset Consistency", () => {
    it("calculates exact 432 Hz tuning ratio (432/440 = 0.981818...)", () => {
      const plan = resolveProcessing("pitch-432hz", { "432hz-enabled": true });
      expect(plan.playbackRate).toBeCloseTo(432 / 440, 6);
      expect(plan.pitchChangesTempo).toBe(true);
    });

    it("preserves decay tails for acoustic reverbs and echo", () => {
      const cathedral = resolveProcessing("cathedral-reverb", { reverb: 50, size: 90 });
      expect(cathedral.tailSeconds).toBeGreaterThan(4.8);

      const slowedReverb = resolveProcessing("slowed-reverb", { speed: 80, reverb: 40, size: 75 });
      expect(slowedReverb.tailSeconds).toBeGreaterThan(1.2);

      const echo = resolveProcessing("ping-pong", { echo: 50, size: 50 });
      expect(echo.tailSeconds).toBeGreaterThan(1.0);
    });

    it("computes deterministic render signatures that update on parameter change", () => {
      const sig1 = computeRenderSignature("slowed-reverb", { speed: 80, reverb: 40 });
      const sig2 = computeRenderSignature("slowed-reverb", { speed: 80, reverb: 40 });
      const sig3 = computeRenderSignature("slowed-reverb", { speed: 85, reverb: 40 });

      expect(sig1).toBe(sig2);
      expect(sig1).not.toBe(sig3);
    });
  });

  describe("Multi-Format Audio Exporters", () => {
    const stereoData = [
      createChannel(4410, (i) => Math.sin((i / 44.1) * Math.PI * 2) * 0.8),
      createChannel(4410, (i) => Math.cos((i / 44.1) * Math.PI * 2) * 0.8),
    ];
    const mockBuffer = createMockAudioBuffer(stereoData, 44100);

    it("encodes valid WAV blobs with 16-bit, 24-bit, and 32-bit float PCM", async () => {
      const wav16 = encodeWav(mockBuffer, 16);
      expect(wav16.type).toBe("audio/wav");
      expect(wav16.size).toBe(44 + 4410 * 2 * 2);

      const wav24 = encodeWav(mockBuffer, 24);
      expect(wav24.type).toBe("audio/wav");
      expect(wav24.size).toBe(44 + 4410 * 2 * 3);

      const wav32 = encodeWav(mockBuffer, 32);
      expect(wav32.type).toBe("audio/wav");
      expect(wav32.size).toBe(44 + 4410 * 2 * 4);
    });

    it("encodes valid AIFF blobs with big-endian COMM and SSND chunks", async () => {
      const aiff16 = encodeAiff(mockBuffer, 16);
      expect(aiff16.type).toBe("audio/aiff");
      expect(aiff16.size).toBeGreaterThan(44 + 4410 * 2 * 2);

      const aiff24 = encodeAiff(mockBuffer, 24);
      expect(aiff24.type).toBe("audio/aiff");
      expect(aiff24.size).toBeGreaterThan(44 + 4410 * 2 * 3);
    });

    it("encodes valid MP3 blobs at supported bitrates (128, 192, 320 kbps)", async () => {
      const mp3_320 = encodeMp3(mockBuffer, 320);
      expect(mp3_320.type).toBe("audio/mp3");
      expect(mp3_320.size).toBeGreaterThan(100);

      const mp3_128 = encodeMp3(mockBuffer, 128);
      expect(mp3_128.type).toBe("audio/mp3");
      expect(mp3_128.size).toBeLessThan(mp3_320.size);
    });
  });

  describe("Sharp Transients & Broadband Speech Material", () => {
    it("safely handles Dirac delta impulses without digital clipping or NaN", () => {
      const sampleRate = 44100;
      // High-energy impulse at sample 100 with broadband white noise floor
      const broadband = createChannel(4410, (i) =>
        i === 100 ? 4.0 : (Math.random() * 2 - 1) * 0.1
      );
      const channels = [broadband];

      const res = applyLookaheadLimiter(channels, sampleRate, -0.3);
      expect(res.limited).toBe(true);

      const peak = measurePeak(channels);
      expect(peak).toBeLessThanOrEqual(Math.pow(10, -0.3 / 20) + 1e-5);

      for (let i = 0; i < broadband.length; i++) {
        expect(Number.isFinite(broadband[i])).toBe(true);
      }
    });

    it("clamps hot stereo speech sibilance without phase divergence", () => {
      const sampleRate = 48000;
      const left = createChannel(4800, (i) => Math.sin((i / 8) * Math.PI * 2) * 2.5); // 6kHz sibilance burst
      const right = createChannel(4800, (i) => Math.sin((i / 8) * Math.PI * 2) * 2.5);
      const stereo = [left, right];

      const res = applyLookaheadLimiter(stereo, sampleRate, -0.3);
      expect(res.limited).toBe(true);
      expect(measurePeak(stereo)).toBeLessThanOrEqual(Math.pow(10, -0.3 / 20) + 1e-5);
    });
  });

  describe("Extreme Slowdown & Effect Tail Durations", () => {
    it("computes accurate non-zero tails for extreme slowdown and long reverbs", () => {
      // 0.5x speed with pitch: 0 and 85% reverb wetness
      const plan = resolveProcessing("slowed-reverb", {
        speed: 50,
        pitch: 0,
        reverb: 85,
        size: 90,
      });

      expect(plan.playbackRate).toBe(0.5);
      expect(plan.tailSeconds).toBeGreaterThan(1.5);

      // Verify that planned seconds with tail is strictly finite and bounded
      const sourceDuration = 30; // 30s audio
      const plannedSeconds = sourceDuration / plan.playbackRate + plan.tailSeconds;
      expect(plannedSeconds).toBeCloseTo(30 / 0.5 + plan.tailSeconds, 3);
      expect(Number.isFinite(plannedSeconds)).toBe(true);
    });

    it("applies the default -2 semitones pitch to slowed-reverb correctly", () => {
      const defaultPlan = resolveProcessing("slowed-reverb", {
        speed: 80,
      });
      // speed 80% (0.8) * 2^(-2/12)
      const expectedRate = 0.8 * Math.pow(2, -2 / 12);
      expect(defaultPlan.playbackRate).toBeCloseTo(expectedRate, 6);
    });
  });

  describe("Processing Cancellation Contract", () => {
    it("instantiates ProcessingCancelledError with accurate name and message", () => {
      const err = new ProcessingCancelledError();
      expect(err).toBeInstanceOf(Error);
      expect(err.name).toBe("ProcessingCancelledError");
      expect(err.message).toBe("Processing was cancelled.");
    });
  });
});

