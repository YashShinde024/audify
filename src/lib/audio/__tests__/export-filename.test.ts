import { describe, expect, it } from "vitest";
import {
  formatExportFilename,
  formatSequencePart,
  normalizeEditType,
  sanitizeSongStem,
} from "../export-filename";

describe("Export Filename Standardization (Audify-{edit-type}-{song-name}.{extension})", () => {
  describe("Canonical Examples from Specification", () => {
    it("formats Slowed + Reverb export to WAV", () => {
      const filename = formatExportFilename({
        editType: "slowed-reverb",
        originalFileName: "Star Girl.mp3",
        extension: "wav",
      });
      expect(filename).toBe("Audify-Slowed-Reverb-Star-Girl.wav");
    });

    it("formats Nightcore export to MP3", () => {
      const filename = formatExportFilename({
        editType: "nightcore",
        originalFileName: "Star-Girl.wav",
        extension: "mp3",
      });
      expect(filename).toBe("Audify-Nightcore-Star-Girl.mp3");
    });

    it("formats Bass Boost export to MP3", () => {
      const filename = formatExportFilename({
        editType: "bass-boost-mod",
        originalFileName: "Mahiya.flac",
        extension: "mp3",
      });
      expect(filename).toBe("Audify-Bass-Boost-Mahiya.mp3");
    });

    it("formats 8D Audio export to AIFF", () => {
      const filename = formatExportFilename({
        editType: "8d-audio",
        originalFileName: "Night Drive.wav",
        extension: "aiff",
      });
      expect(filename).toBe("Audify-8D-Audio-Night-Drive.aiff");
    });

    it("formats Audio Normalizer utility export to WAV", () => {
      const filename = formatExportFilename({
        editType: "audio-normalizer",
        originalFileName: "My Recording.wav",
        extension: "wav",
      });
      expect(filename).toBe("Audify-Audio-Normalizer-My-Recording.wav");
    });
  });

  describe("Brand Prefix & Anti-Duplication Rules", () => {
    it("always begins with Audify- prefix", () => {
      const filename = formatExportFilename({
        editType: "daycore",
        originalFileName: "demo.wav",
        extension: "wav",
      });
      expect(filename.startsWith("Audify-")).toBe(true);
    });

    it("never produces duplicated Audify-Audify- prefixes", () => {
      const filename = formatExportFilename({
        editType: "nightcore",
        originalFileName: "Audify-Nightcore-OriginalTrack.wav",
        extension: "mp3",
      });
      expect(filename).not.toContain("Audify-Audify-");
      expect(filename.startsWith("Audify-Nightcore-")).toBe(true);
    });

    it("handles source files named with lowercase audify- prefix cleanly", () => {
      const filename = formatExportFilename({
        editType: "slowed-reverb",
        originalFileName: "audify-custom-mix.wav",
        extension: "wav",
      });
      expect(filename).toBe("Audify-Slowed-Reverb-custom-mix.wav");
    });
  });

  describe("Edit Type Normalization", () => {
    it("normalizes kebab-case preset IDs to Title-Case with hyphens", () => {
      expect(normalizeEditType("cathedral-reverb")).toBe("Cathedral-Reverb");
      expect(normalizeEditType("lofi-tape")).toBe("Lo-Fi-Tape");
      expect(normalizeEditType("pitch-432hz")).toBe("Pitch-432Hz");
      expect(normalizeEditType("vocal-remover")).toBe("Vocal-Remover");
    });

    it("defaults to Custom-Edit when editType is null, empty, or custom", () => {
      expect(normalizeEditType(null)).toBe("Custom-Edit");
      expect(normalizeEditType("")).toBe("Custom-Edit");
      expect(normalizeEditType("custom")).toBe("Custom-Edit");
      expect(normalizeEditType("custom-dsp")).toBe("Custom-Edit");
    });

    it("handles standalone tool slugs accurately", () => {
      expect(normalizeEditType("audio-splitter")).toBe("Audio-Splitter");
      expect(normalizeEditType("audio-merger")).toBe("Audio-Merger");
      expect(normalizeEditType("sample-rate-converter")).toBe("Sample-Rate-Converter");
    });

    it("supports custom edit labels", () => {
      expect(normalizeEditType("custom", "Acoustic Warmth")).toBe("Acoustic-Warmth");
    });
  });

  describe("Song Name Sanitization & Special Characters", () => {
    it("strips common audio extensions (.wav, .mp3, .flac, .aiff, etc.)", () => {
      expect(sanitizeSongStem("Song.mp3")).toBe("Song");
      expect(sanitizeSongStem("Track.flac")).toBe("Track");
      expect(sanitizeSongStem("Recording.aiff")).toBe("Recording");
      expect(sanitizeSongStem("Audio.wav")).toBe("Audio");
    });

    it("replaces invalid filesystem characters (< > : \" / \\ | ? *) with hyphens", () => {
      const sanitized = sanitizeSongStem("Track: Part <1> \"Special\" / Mix?.mp3");
      expect(sanitized).toBe("Track-Part-1-Special-Mix");
    });

    it("converts spaces and underscores into clean single hyphens", () => {
      expect(sanitizeSongStem("my_cool   song_title.wav")).toBe("my-cool-song-title");
    });

    it("falls back to Audio when filename stem is empty", () => {
      expect(sanitizeSongStem("")).toBe("Audio");
      expect(sanitizeSongStem(".wav")).toBe("Audio");
      expect(sanitizeSongStem("???")).toBe("Audio");
    });

    it("limits song stem length to 64 characters without trailing hyphens", () => {
      const longName = "A".repeat(100) + ".wav";
      const sanitized = sanitizeSongStem(longName);
      expect(sanitized.length).toBeLessThanOrEqual(64);
    });
  });

  describe("Extension & Format Alignment", () => {
    it("formats WAV extension correctly", () => {
      const fn = formatExportFilename({ editType: "nightcore", originalFileName: "test", extension: "wav" });
      expect(fn.endsWith(".wav")).toBe(true);
    });

    it("formats MP3 extension correctly", () => {
      const fn = formatExportFilename({ editType: "nightcore", originalFileName: "test", extension: "mp3" });
      expect(fn.endsWith(".mp3")).toBe(true);
    });

    it("formats AIFF extension correctly", () => {
      const fn = formatExportFilename({ editType: "nightcore", originalFileName: "test", extension: "aiff" });
      expect(fn.endsWith(".aiff")).toBe(true);
    });

    it("normalizes .aif to .aiff", () => {
      const fn = formatExportFilename({ editType: "nightcore", originalFileName: "test", extension: "aif" });
      expect(fn.endsWith(".aiff")).toBe(true);
    });
  });

  describe("Batch & Audio Splitter Sequences", () => {
    it("formats sequence number into Part-01, Part-02, etc.", () => {
      expect(formatSequencePart(1)).toBe("Part-01");
      expect(formatSequencePart(9)).toBe("Part-09");
      expect(formatSequencePart(12)).toBe("Part-12");
    });

    it("produces standardized splitter filenames with sequence identifiers", () => {
      const filename = formatExportFilename({
        editType: "audio-splitter",
        originalFileName: "My Song.wav",
        extension: "wav",
        partIndex: 1,
      });
      expect(filename).toBe("Audify-Audio-Splitter-My-Song-Part-01.wav");
    });
  });

  describe("Custom Filename Overrides", () => {
    it("ensures custom user filename begins with Audify-", () => {
      const filename = formatExportFilename({
        editType: "slowed-reverb",
        originalFileName: "original.wav",
        extension: "wav",
        customFilename: "My-Special-Master",
      });
      expect(filename).toBe("Audify-My-Special-Master.wav");
    });

    it("sanitizes user input and handles already-prefixed custom names", () => {
      const filename = formatExportFilename({
        editType: "slowed-reverb",
        originalFileName: "original.wav",
        extension: "mp3",
        customFilename: "Audify-VIP-Edit.mp3",
      });
      expect(filename).toBe("Audify-VIP-Edit.mp3");
    });
  });
});

