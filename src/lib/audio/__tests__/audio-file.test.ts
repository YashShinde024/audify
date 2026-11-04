import { describe, expect, it } from "vitest";

import {
  fileSizeError,
  isSupportedAudioFile,
  supportedExtensions,
  validateAudioFile,
} from "../../audio-file";

const MB = 1024 * 1024;

function makeFile(partial: { name: string; size?: number; type?: string }): File {
  const size = partial.size ?? 1024;
  const bytes = new Uint8Array(size);
  return new File([bytes], partial.name, { type: partial.type });
}

describe("isSupportedAudioFile", () => {
  it("accepts every advertised extension case-insensitively with an audio/ MIME type", () => {
    for (const ext of supportedExtensions) {
      expect(
        isSupportedAudioFile(makeFile({ name: `song.${ext}`, type: "audio/mpeg" })),
        ext,
      ).toBe(true);
      expect(
        isSupportedAudioFile(makeFile({ name: `song.${ext.toUpperCase()}`, type: "audio/wav" })),
        ext.toUpperCase(),
      ).toBe(true);
    }
  });

  it("accepts supported extensions when OS leaves MIME type empty or generic octet-stream", () => {
    expect(isSupportedAudioFile(makeFile({ name: "track.mp3", type: "" }))).toBe(true);
    expect(isSupportedAudioFile(makeFile({ name: "track.wav", type: "" }))).toBe(true);
    expect(isSupportedAudioFile(makeFile({ name: "track.flac", type: "application/octet-stream" }))).toBe(true);
  });

  it("rejects text-like MIME types even with a supported extension", () => {
    expect(
      isSupportedAudioFile(makeFile({ name: "song.mp3", type: "text/plain" })),
    ).toBe(false);
  });

  it("rejects unsupported extensions even with an audio/ MIME type", () => {
    expect(
      isSupportedAudioFile(makeFile({ name: "song.webm", type: "audio/webm" })),
    ).toBe(false);
    expect(
      isSupportedAudioFile(makeFile({ name: "noext", type: "audio/mpeg" })),
    ).toBe(false);
  });
});

describe("validateAudioFile", () => {
  it("passes a well-formed supported file through untouched", () => {
    const file = makeFile({ name: "song.wav", type: "audio/wav", size: MB });
    const result = validateAudioFile(file);
    expect(result.ok).toBe(true);
  });

  it("rejects empty files before anything else", () => {
    const result = validateAudioFile(makeFile({ name: "song.wav", type: "audio/wav", size: 0 }));
    expect(result).toEqual({ ok: false, reason: "empty" });
  });

  it("rejects files above the site's 10 MB cap", () => {
    const result = validateAudioFile(
      makeFile({ name: "song.wav", type: "audio/wav", size: 10 * MB + 1 }),
    );
    expect(result).toEqual({ ok: false, reason: "too-large" });
  });

  it("rejects unsupported extensions with a distinct reason", () => {
    const result = validateAudioFile(makeFile({ name: "song.exe", type: "application/octet-stream" }));
    expect(result).toEqual({ ok: false, reason: "unsupported" });
  });
});

describe("fileSizeError", () => {
  it("matches the actual configured limit in its copy", () => {
    const message = fileSizeError("too-large");
    expect(message).toContain("10 MB");
  });

  it("lists every supported format as promised in the message", () => {
    const message = fileSizeError("unsupported");
    for (const ext of supportedExtensions) {
      expect(message.toUpperCase()).toContain(ext.toUpperCase());
    }
  });

  it("explains the empty-file case", () => {
    expect(fileSizeError("empty")).toMatch(/empty/i);
  });
});
