import { describe, expect, it } from "vitest";
import { presets, presetIds } from "@/config/presets";
import {
  articleForPreset,
  presetArticleRegistry,
  registrySlugs,
} from "@/config/blog-registry";
import { articleBodies } from "@/config/preset-article-bodies";
import { getMissingPresetIconIds } from "@/components/icons/preset-icons";

/** Presets documented by a pre-existing hand-written static page. */
const legacyCoveredPresetIds = new Set(
  presetArticleRegistry.filter((a) => a.legacyStatic && a.presetId !== null).map((a) => a.presetId),
);

describe("blog registry ↔ preset completeness", () => {
  it("contains exactly one article per preset", () => {
    expect(presetArticleRegistry.filter((a) => a.presetId !== null).length).toBe(presetIds.length);

    const ids = presetArticleRegistry
      .map((a) => a.presetId)
      .filter((id): id is string => id !== null);
    expect(new Set(ids).size).toBe(ids.length);

    for (const id of presetIds) {
      expect(articleForPreset(id as never), `missing article for preset "${id}"`).toBeDefined();
    }
  });

  it("every preset ids in the catalog are known", () => {
    for (const entry of presetArticleRegistry) {
      if (!entry.presetId) continue;
      expect(
        presetIds.includes(entry.presetId),
        `registry entry "${entry.slug}" references unknown preset "${entry.presetId}"`,
      ).toBe(true);
    }
  });

  it("slugs and titles are unique", () => {
    const slugs = presetArticleRegistry.map((a) => a.slug);
    const titles = presetArticleRegistry.map((a) => a.title);
    const dupeSlugs = slugs.filter((s, i) => slugs.indexOf(s) !== i);
    const dupeTitles = titles.filter((t, i) => titles.indexOf(t) !== i);
    expect(dupeSlugs).toEqual([]);
    expect(dupeTitles).toEqual([]);
  });

  it("slugs are URL-safe and stable", () => {
    for (const slug of registrySlugs) {
      expect(slug).toMatch(/^[a-z0-9-]+$/);
      expect(slug.startsWith("-") || slug.endsWith("-")).toBe(false);
    }
  });

  it("SEO descriptions stay short enough for search snippets", () => {
    for (const entry of presetArticleRegistry) {
      expect(
        entry.description.length,
        `description for "${entry.slug}" exceeds 200 chars`,
      ).toBeLessThanOrEqual(200);
      expect(entry.description.length).toBeGreaterThanOrEqual(50);
    }
  });

  it("the six legacy static slugs are preserved exactly", () => {
    for (const slug of [
      "slowed-reverb",
      "8d-audio",
      "nightcore-daycore",
      "432hz-tuning",
      "bass-boost",
      "lofi-tape",
    ]) {
      expect(registrySlugs).toContain(slug);
    }
  });
});

describe("article bodies", () => {
  it("every non-legacy preset article has a structured body", () => {
    const dynamic = presetArticleRegistry.filter((a) => !a.legacyStatic && a.presetId);
    for (const entry of dynamic) {
      const body = articleBodies[entry.presetId as string];
      expect(body, `missing structured body for "${entry.slug}"`).toBeDefined();
      expect(body.slug).toBe(entry.slug);
      expect(body.presetId).toBe(entry.presetId);
    }
  });

  it("every article carries a detail paragraph", () => {
    for (const body of Object.values(articleBodies)) {
      expect(body.detail, `"${body.slug}" has no detail paragraph`).toBeDefined();
      expect(body.detail!.length).toBeGreaterThan(180);
    }
  });

  it("bodies carry real content and valid related links", () => {
    for (const body of Object.values(articleBodies)) {
      expect(body.what.length, `"${body.slug}" what is too thin`).toBeGreaterThan(200);
      expect(body.sound.length).toBeGreaterThan(95);
      expect(body.dsp.length).toBeGreaterThanOrEqual(3);
      expect(body.tips.length).toBeGreaterThanOrEqual(3);
      expect(body.useCases.length).toBeGreaterThanOrEqual(3);
      for (const related of body.related) {
        expect(
          registrySlugs.includes(related),
          `"${body.slug}" links to unknown guide "${related}"`,
        ).toBe(true);
      }
    }
  });

  it("article word count clears the completeness bar (~400+ words rendered)", () => {
    for (const body of Object.values(articleBodies)) {
      const text = [
        body.what,
        body.detail ?? "",
        body.sound,
        ...body.dsp,
        ...body.tips,
        ...body.useCases,
      ].join(" ");
      const words = text.split(/\s+/).filter(Boolean).length;
      expect(words, `"${body.slug}" only ${words} words`).toBeGreaterThan(220);
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

describe("legacy articles stay covered", () => {
  it("legacy-covered presets skip dynamic rendering", () => {
    for (const id of legacyCoveredPresetIds) {
      const entry = articleForPreset(id as never);
      expect(entry?.legacyStatic).toBe(true);
    }
  });
});
