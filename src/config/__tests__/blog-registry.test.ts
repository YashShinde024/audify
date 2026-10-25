import { describe, expect, it } from "vitest";
import { presets, presetIds } from "@/config/presets";
import { articleForPreset, presetArticleRegistry, registrySlugs } from "@/config/blog-registry";
import { getMissingPresetIconIds } from "@/components/icons/preset-icons";
import { getAllToolSlugs } from "@/config/tools-registry";

describe("blog is intentionally empty", () => {
  it("the registry holds no articles", () => {
    expect(presetArticleRegistry).toEqual([]);
    expect(registrySlugs).toEqual([]);
  });

  it("no preset claims an article", () => {
    for (const id of presetIds) {
      expect(articleForPreset(id as never)).toBeUndefined();
    }
  });
});

describe("preset catalog consistency", () => {
  it("every preset has search-friendly content", () => {
    for (const preset of presets) {
      expect(preset.name.length).toBeGreaterThan(2);
      expect(preset.description.length).toBeGreaterThan(20);
      expect(preset.tags.length).toBeGreaterThan(0);
      expect(preset.supportedOps.length).toBeGreaterThan(0);
    }
  });

  it("preset ids are unique", () => {
    expect(new Set(presetIds).size).toBe(presetIds.length);
  });
});

describe("icon coverage", () => {
  it("every preset id resolves an icon", () => {
    expect(getMissingPresetIconIds()).toEqual([]);
  });
});

describe("tool slugs stay unique", () => {
  it("duplicate-free, URL-safe slugs", () => {
    const slugs = getAllToolSlugs();
    expect(new Set(slugs).size).toBe(slugs.length);
    for (const slug of slugs) {
      expect(slug).toMatch(/^[a-z0-9-]+$/);
    }
  });
});
