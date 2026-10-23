import { describe, expect, it } from "vitest";
import { detectAudioBpm } from "../analysis";
import {
  encodeWav,
  encodeAiff,
  encodeMp3,
  estimateExportFileSize,
} from "../encoders";
import { interpretSoundPrompt } from "../prompt-matcher";
import * as audioEngine from "@/lib/audio-engine";

function createSyntheticAudioBuffer(
  channels = 2,
  sampleRate = 44100,
  seconds = 1
): AudioBuffer {
  const length = Math.floor(sampleRate * seconds);
  const channelData: Float32Array[] = [];

  for (let c = 0; c < channels; c++) {
    const data = new Float32Array(length);
    // 440 Hz sine wave
    for (let i = 0; i < length; i++) {
      data[i] = Math.sin((2 * Math.PI * 440 * i) / sampleRate) * 0.5;
    }
    channelData.push(data);
  }

  return {
    numberOfChannels: channels,
    length,
    sampleRate,
    duration: seconds,
    getChannelData(c: number) {
      return channelData[c];
    },
    copyFromChannel() {},
    copyToChannel() {},
  } as unknown as AudioBuffer;
}

describe("Modular Audio Architecture & Subsystem Boundaries", () => {
  describe("Analysis module (@/lib/audio/analysis)", () => {
    it("detectAudioBpm detects periodic tempo from rhythmic pulse energy", () => {
      const sampleRate = 44100;
      const durationSeconds = 5;
      const length = sampleRate * durationSeconds;
      const data = new Float32Array(length);

      // Create a 120 BPM pulse train (2 beats per second = every 22050 samples)
      const beatInterval = Math.round((sampleRate * 60) / 120);
      for (let i = 0; i < length; i += beatInterval) {
        // burst of high amplitude
        for (let j = 0; j < 500 && i + j < length; j++) {
          data[i + j] = (1 - j / 500) * 0.9;
        }
      }

      const buffer = {
        numberOfChannels: 1,
        length,
        sampleRate,
        duration: durationSeconds,
        getChannelData: () => data,
      } as unknown as AudioBuffer;

      const bpm = detectAudioBpm(buffer);
      expect(bpm).toBeGreaterThanOrEqual(115);
      expect(bpm).toBeLessThanOrEqual(125);
    });

    it("falls back gracefully to 120 on silent or malformed buffers", () => {
      const buffer = {
        numberOfChannels: 1,
        length: 100,
        sampleRate: 44100,
        duration: 0.002,
        getChannelData: () => new Float32Array(100),
      } as unknown as AudioBuffer;

      const bpm = detectAudioBpm(buffer);
      expect(bpm).toBeGreaterThanOrEqual(65);
      expect(bpm).toBeLessThanOrEqual(190);
    });
  });

  describe("Encoders module (@/lib/audio/encoders)", () => {
    it("encodes valid 16-bit, 24-bit, and 32-bit float WAV with valid RIFF headers", async () => {
      const buffer = createSyntheticAudioBuffer(2, 44100, 0.5);

      const wav16 = encodeWav(buffer, 16);
      expect(wav16.type).toBe("audio/wav");
      const ab16 = await wav16.arrayBuffer();
      const view16 = new DataView(ab16);
      // RIFF header
      expect(String.fromCharCode(view16.getUint8(0), view16.getUint8(1), view16.getUint8(2), view16.getUint8(3))).toBe("RIFF");
      expect(view16.getUint16(20, true)).toBe(1); // PCM
      expect(view16.getUint16(34, true)).toBe(16); // 16-bit

      const wav32 = encodeWav(buffer, 32);
      const ab32 = await wav32.arrayBuffer();
      const view32 = new DataView(ab32);
      expect(view32.getUint16(20, true)).toBe(3); // IEEE float
      expect(view32.getUint16(34, true)).toBe(32); // 32-bit
    });

    it("encodes valid AIFF with FORM AIFF COMM SSND chunks", async () => {
      const buffer = createSyntheticAudioBuffer(2, 44100, 0.5);
      const aiff = encodeAiff(buffer, 24);
      expect(aiff.type).toBe("audio/aiff");

      const ab = await aiff.arrayBuffer();
      const view = new DataView(ab);
      expect(String.fromCharCode(view.getUint8(0), view.getUint8(1), view.getUint8(2), view.getUint8(3))).toBe("FORM");
      expect(String.fromCharCode(view.getUint8(8), view.getUint8(9), view.getUint8(10), view.getUint8(11))).toBe("AIFF");
      expect(view.getInt16(26, false)).toBe(24); // 24-bit
    });

    it("encodes valid MP3 frames", async () => {
      const buffer = createSyntheticAudioBuffer(2, 44100, 0.5);
      const mp3 = encodeMp3(buffer, 320);
      expect(mp3.type).toBe("audio/mp3");
      expect(mp3.size).toBeGreaterThan(1000);
    });

    it("estimateExportFileSize accurately computes bytes for diverse codecs and channels", () => {
      expect(estimateExportFileSize(0, "wav", 16, 320, 44100, "stereo")).toBe("—");
      expect(estimateExportFileSize(60, "mp3", 16, 320, 44100, "stereo")).toBe("~2.3 MB");
      expect(estimateExportFileSize(60, "wav", 16, 320, 44100, "stereo")).toBe("~10.1 MB");
      expect(estimateExportFileSize(1, "wav", 16, 320, 44100, "mono")).toMatch(/KB/);
    });
  });

  describe("Prompt matcher module (@/lib/audio/prompt-matcher)", () => {
    it("interprets natural-language requests into canonical presets", () => {
      expect(interpretSoundPrompt("make this sound like the room next door")).toEqual({
        presetId: "muffled-room",
        matchedLabel: "Room Next Door (Muffled)",
      });
      expect(interpretSoundPrompt("add tape warmth and analog harmonics")).toEqual({
        presetId: "tape-warmth",
        matchedLabel: "Warm Analog Tape",
      });
      expect(interpretSoundPrompt("clean sub rumble 30hz")).toEqual({
        presetId: "sub-rumble-cut",
        matchedLabel: "30 Hz Infrasonic Rumble Cut",
      });
      expect(interpretSoundPrompt("give me bright vocal air")).toEqual({
        presetId: "vocal-air",
        matchedLabel: "Vocal Air & Presence",
      });
    });

    it("returns null for unrecognized or empty requests", () => {
      expect(interpretSoundPrompt("")).toBeNull();
      expect(interpretSoundPrompt("random unrelated phrase")).toBeNull();
    });
  });

  describe("Canonical Facade (@/lib/audio-engine) integrity", () => {
    it("re-exports all expected public APIs seamlessly", () => {
      expect(typeof audioEngine.getAudioContext).toBe("function");
      expect(typeof audioEngine.decodeAudioFile).toBe("function");
      expect(typeof audioEngine.detectAudioBpm).toBe("function");
      expect(typeof audioEngine.renderProcessedAudio).toBe("function");
      expect(typeof audioEngine.createImpulseResponse).toBe("function");
      expect(typeof audioEngine.makeDistortionCurve).toBe("function");
      expect(typeof audioEngine.encodeWav).toBe("function");
      expect(typeof audioEngine.encodeAiff).toBe("function");
      expect(typeof audioEngine.encodeMp3).toBe("function");
      expect(typeof audioEngine.estimateExportFileSize).toBe("function");
      expect(typeof audioEngine.interpretSoundPrompt).toBe("function");
      expect(audioEngine.ProcessingCancelledError).toBeDefined();
    });
  });
});
