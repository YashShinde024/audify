import { describe, it, expect } from "vitest";
import {
  TOOLS_REGISTRY,
  getToolBySlug,
  getAllToolSlugs,
} from "@/config/tools-registry";
import {
  createAudioBuffer,
  sliceAudioBuffer,
  splitAudioBuffer,
  mergeAudioBuffers,
  inspectAudioMetadata,
  formatDurationMs,
  formatBytes,
} from "../tools-engine";

describe("Audify Tools Registry", () => {
  it("contains exactly 15 tools with unique slugs", () => {
    expect(TOOLS_REGISTRY.length).toBe(15);
    const slugs = getAllToolSlugs();
    const uniqueSlugs = new Set(slugs);
    expect(uniqueSlugs.size).toBe(15);
  });

  it("resolves every registered tool by its slug", () => {
    for (const tool of TOOLS_REGISTRY) {
      const resolved = getToolBySlug(tool.slug);
      expect(resolved).toBeDefined();
      expect(resolved?.name).toBe(tool.name);
      expect(resolved?.category).toBeDefined();
      expect(resolved?.supportedInputs.length).toBeGreaterThan(0);
      expect(resolved?.supportedOutputs.length).toBeGreaterThan(0);
      expect(resolved?.seo.title).toContain("Audify");
    }
  });

  it("covers all four required tool categories", () => {
    const categories = new Set(TOOLS_REGISTRY.map((t) => t.category));
    expect(categories.has("convert-export")).toBe(true);
    expect(categories.has("edit-audio")).toBe(true);
    expect(categories.has("enhance-audio")).toBe(true);
    expect(categories.has("audio-info")).toBe(true);
  });
});

describe("Tools Engine - Buffer Operations", () => {
  function createSyntheticBuffer(
    channels: number,
    durationSec: number,
    sampleRate = 44100,
    amplitude = 0.5
  ): AudioBuffer {
    const length = Math.round(durationSec * sampleRate);
    const buf = createAudioBuffer(channels, length, sampleRate);
    for (let c = 0; c < channels; c++) {
      const data = buf.getChannelData(c);
      for (let i = 0; i < length; i++) {
        data[i] = Math.sin((2 * Math.PI * 440 * i) / sampleRate) * amplitude;
      }
    }
    return buf;
  }

  it("creates and slices an AudioBuffer accurately", () => {
    const sr = 44100;
    const original = createSyntheticBuffer(2, 4.0, sr);
    expect(original.duration).toBeCloseTo(4.0, 2);
    expect(original.numberOfChannels).toBe(2);

    // Slice 1.0s to 3.0s (2.0s duration)
    const sliced = sliceAudioBuffer(original, 1.0, 3.0);
    expect(sliced.duration).toBeCloseTo(2.0, 2);
    expect(sliced.numberOfChannels).toBe(2);
    expect(sliced.length).toBe(Math.round(2.0 * sr));
  });

  it("splits AudioBuffer into equal parts", () => {
    const original = createSyntheticBuffer(2, 6.0, 44100);
    const parts = splitAudioBuffer(original, "parts", 3);

    expect(parts.length).toBe(3);
    for (const part of parts) {
      expect(part.buffer.duration).toBeCloseTo(2.0, 2);
      expect(part.buffer.numberOfChannels).toBe(2);
    }
    expect(parts[0].startSec).toBeCloseTo(0, 2);
    expect(parts[0].endSec).toBeCloseTo(2.0, 2);
    expect(parts[1].startSec).toBeCloseTo(2.0, 2);
    expect(parts[1].endSec).toBeCloseTo(4.0, 2);
    expect(parts[2].startSec).toBeCloseTo(4.0, 2);
    expect(parts[2].endSec).toBeCloseTo(6.0, 2);
  });

  it("splits AudioBuffer by duration intervals", () => {
    const original = createSyntheticBuffer(2, 5.5, 44100);
    const segments = splitAudioBuffer(original, "duration", 2.0);

    // 5.5s split into 2.0s intervals = 3 segments (2.0s, 2.0s, 1.5s)
    expect(segments.length).toBe(3);
    expect(segments[0].buffer.duration).toBeCloseTo(2.0, 2);
    expect(segments[1].buffer.duration).toBeCloseTo(2.0, 2);
    expect(segments[2].buffer.duration).toBeCloseTo(1.5, 2);
  });

  it("merges multiple AudioBuffers with silence gaps", () => {
    const sr = 44100;
    const buf1 = createSyntheticBuffer(1, 1.0, sr);
    const buf2 = createSyntheticBuffer(2, 1.5, sr);
    const gapSec = 0.5;

    const merged = mergeAudioBuffers([buf1, buf2], gapSec);

    // Output channel count should be 2 because buf2 is stereo
    expect(merged.numberOfChannels).toBe(2);

    // Expected duration: 1.0 + 0.5 + 1.5 = 3.0s
    expect(merged.duration).toBeCloseTo(3.0, 2);
    expect(merged.length).toBe(Math.round(3.0 * sr));
  });

  it("measures audio technical metadata correctly", () => {
    const sr = 48000;
    const buf = createSyntheticBuffer(2, 2.5, sr, 0.8);
    const mockFile = new File([new Uint8Array(240000)], "test-track.wav", {
      type: "audio/wav",
    });

    const report = inspectAudioMetadata(mockFile, buf);

    expect(report.fileName).toBe("test-track.wav");
    expect(report.durationSeconds).toBeCloseTo(2.5, 2);
    expect(report.sampleRate).toBe(48000);
    expect(report.numberOfChannels).toBe(2);
    expect(report.peakLinear).toBeGreaterThan(0.79);
    expect(report.peakDbfs).toBeCloseTo(-1.94, 1);
    expect(report.rmsLinear).toBeGreaterThan(0.5);
    expect(report.containerFormat).toBe("WAV");
  });

  it("formats duration and bytes gracefully", () => {
    expect(formatDurationMs(65.4)).toBe("1:05.4");
    expect(formatDurationMs(9.2)).toBe("0:09.2");
    expect(formatBytes(512)).toBe("512 B");
    expect(formatBytes(1024 * 50)).toBe("50.0 KB");
    expect(formatBytes(1024 * 1024 * 4.2)).toBe("4.20 MB");
  });
});
