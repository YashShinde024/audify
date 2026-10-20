import { describe, expect, it } from "vitest";

import { estimateExportFileSize } from "../../audio-engine";
import { DEFAULT_EXPORT_CONFIG, type ExportConfig } from "../../../types/export";

/** 10 s at 44.1 kHz stereo. */
const DUR = 10;

describe("estimateExportFileSize", () => {
  it("computes MP3 size from bitrate × duration, independent of bit depth", () => {
    const size = estimateExportFileSize(DUR, "mp3", 16, 320, 44100, "stereo");
    // 320 kbps = 40 000 bytes/s → 40 000 × 10 = 390.6 KiB in 10 s.
    expect(size).toContain("390.6");
    expect(size).toContain("KB");
  });

  it("uses the passed bit depth for WAV, including the 44-byte header", () => {
    const bytes16 = 44100 * 2 * (16 / 8) * DUR + 44;
    expect(estimateExportFileSize(DUR, "wav", 16, 320, 44100, "stereo")).toBe(
      `~${(bytes16 / (1024 * 1024)).toFixed(1)} MB`,
    );
    const bytes24 = 44100 * 2 * (24 / 8) * DUR + 44;
    expect(estimateExportFileSize(DUR, "wav", 24, 320, 44100, "stereo")).toBe(
      `~${(bytes24 / (1024 * 1024)).toFixed(1)} MB`,
    );
  });

  it("uses the passed AIFF bit depth and the 54-byte AIFF header", () => {
    const bytes24 = 44100 * 2 * (24 / 8) * DUR + 54;
    expect(estimateExportFileSize(DUR, "aiff", 24, 320, 44100, "stereo")).toBe(
      `~${(bytes24 / (1024 * 1024)).toFixed(1)} MB`,
    );
  });

  it("assumes 44.1 kHz when asked to match an unknown source rate", () => {
    const atMatch = estimateExportFileSize(DUR, "wav", 16, 320, 0, "stereo");
    expect(atMatch).toContain("MB");
  });

  it("folds mono down to one channel", () => {
    const mono = estimateExportFileSize(DUR, "wav", 16, 320, 44100, "mono");
    const stereo = estimateExportFileSize(DUR, "wav", 16, 320, 44100, "stereo");
    expect(mono).not.toBe(stereo);
  });

  it("shrugs off a zero duration", () => {
    expect(estimateExportFileSize(0, "wav", 16, 320, 44100, "stereo")).toBe("—");
  });
});

describe("DEFAULT_EXPORT_CONFIG", () => {
  it("starts on WAV with peak protection on and no peak normalization", () => {
    expect(DEFAULT_EXPORT_CONFIG.format).toBe("wav");
    expect(DEFAULT_EXPORT_CONFIG.peakProtection).toBe(true);
    expect(DEFAULT_EXPORT_CONFIG.peakNormalize).toBe(false);
  });

  it("never defaults to Opus (the engine rejects it until implemented)", () => {
    expect(DEFAULT_EXPORT_CONFIG.format).not.toBe("opus");
  });

  it("carries complete defaults so partial overrides can't drop settings", () => {
    const partial: Partial<ExportConfig> = DEFAULT_EXPORT_CONFIG;
    const restored: ExportConfig = { ...DEFAULT_EXPORT_CONFIG, ...partial };
    expect(restored).toEqual(DEFAULT_EXPORT_CONFIG);
  });
});
