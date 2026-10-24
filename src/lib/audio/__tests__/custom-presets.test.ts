import { describe, expect, it } from "vitest";
import {
  validateCustomPreset,
  exportPresetsToJson,
  importPresetsFromJson,
} from "../custom-presets";
import type { SavedCustomPreset } from "@/types/preset";

describe("custom-presets validation and serialization", () => {
  it("validates and accepts a compliant custom preset", () => {
    const raw = {
      id: "preset-custom-123",
      name: "Late Night Slowed",
      basePresetId: "slowed-reverb",
      effectValues: {
        speed: 0.82,
        reverbMix: 0.45,
        bass: 4.5,
      },
      createdAt: 1700000000000,
      updatedAt: 1700000000000,
    };

    const valid = validateCustomPreset(raw);
    expect(valid).not.toBeNull();
    expect(valid?.id).toBe("preset-custom-123");
    expect(valid?.name).toBe("Late Night Slowed");
    expect(valid?.effectValues.speed).toBe(0.82);
    expect(valid?.effectValues.reverbMix).toBe(0.45);
  });

  it("strips prototype pollution attempts and invalid numbers", () => {
    const malicious = {
      id: "preset-hack",
      name: "Exploit Test",
      effectValues: {
        __proto__: { admin: true },
        constructor: { evil: true },
        speed: NaN,
        pitch: Infinity,
        treble: 3.5,
      },
    };

    const valid = validateCustomPreset(malicious);
    expect(valid).not.toBeNull();
    expect(valid?.effectValues).not.toHaveProperty("__proto__");
    expect(valid?.effectValues).not.toHaveProperty("constructor");
    expect(valid?.effectValues.speed).toBeUndefined();
    expect(valid?.effectValues.pitch).toBeUndefined();
    expect(valid?.effectValues.treble).toBe(3.5);
  });

  it("rejects non-objects or presets missing required fields", () => {
    expect(validateCustomPreset(null)).toBeNull();
    expect(validateCustomPreset("not-an-object")).toBeNull();
    expect(validateCustomPreset({ id: "", name: "Test" })).toBeNull();
    expect(validateCustomPreset({ id: "valid-id", name: "" })).toBeNull();
    expect(validateCustomPreset({ id: "valid-id", name: "Valid", effectValues: "not-an-object" })).toBeNull();
  });

  it("exports presets list to structured JSON", () => {
    const samplePresets: SavedCustomPreset[] = [
      {
        id: "preset-1",
        name: "Vintage Warmth",
        basePresetId: "lofi-tape",
        effectValues: { saturation: 3, bass: 2 },
        createdAt: 1000,
        updatedAt: 2000,
      },
    ];

    const json = exportPresetsToJson(samplePresets);
    const parsed = JSON.parse(json);

    expect(parsed.version).toBe(1);
    expect(parsed.source).toContain("Audify");
    expect(parsed.presets).toHaveLength(1);
    expect(parsed.presets[0].name).toBe("Vintage Warmth");
  });

  it("safely imports presets from JSON and ignores corrupted entries", () => {
    const validJson = JSON.stringify({
      version: 1,
      presets: [
        {
          id: "imported-1",
          name: "Sub Bass Extreme",
          effectValues: { bass: 12 },
          createdAt: 5000,
          updatedAt: 6000,
        },
        {
          id: "", // Invalid: empty ID
          name: "Invalid",
        },
      ],
    });

    const result = importPresetsFromJson(validJson);
    expect(result.importedCount).toBe(1);
    expect(result.validPresets).toHaveLength(1);
    expect(result.validPresets[0].name).toBe("Sub Bass Extreme");
  });

  it("returns an error on malformed JSON payload", () => {
    const malformed = "{ this is not valid json }";
    const result = importPresetsFromJson(malformed);
    expect(result.importedCount).toBe(0);
    expect(result.error).toBeDefined();
  });
});
