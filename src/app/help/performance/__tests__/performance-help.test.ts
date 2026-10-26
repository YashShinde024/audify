import { describe, expect, it } from "vitest";
import { HELP_TOPICS } from "../topic-data";

describe("HELP_TOPICS", () => {
  it("covers the eight required troubleshooting sections", () => {
    const ids = HELP_TOPICS.map((t) => t.id);
    expect(ids).toEqual([
      "slow-processing",
      "freezes-crashes",
      "upload-fails",
      "playback-issues",
      "export-fails",
      "mobile-slow-hot",
      "slow-loading-ads",
      "privacy-local",
    ]);
  });

  it("each topic has a unique id, title, blurb and at least one step", () => {
    for (const topic of HELP_TOPICS) {
      expect(topic.id).toMatch(/^[a-z-]+$/);
      expect(topic.title.length).toBeGreaterThan(0);
      expect(topic.blurb.length).toBeGreaterThan(0);
      expect(topic.steps.length).toBeGreaterThan(0);
      for (const step of topic.steps) {
        expect(step.trim().length).toBeGreaterThan(0);
      }
    }
    const ids = HELP_TOPICS.map((t) => t.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("claims real upload limits only (10 MB studio, 50 MB tools)", () => {
    const combined = HELP_TOPICS.map((t) => [t.title, t.blurb, ...t.steps, ...(t.notes ?? [])].join(" "));
    const mbClaims = combined.join(" ").match(/(\d+)\s*MB/g) ?? [];
    const numericClaims = mbClaims.map((c) => parseInt(c, 10));
    // 10 (studio limit) and 50 (tools limit) are the only size limits claimed.
    const allowed = new Set([10, 50]);
    for (const n of numericClaims) {
      expect(allowed.has(n), `unexpected MB claim: ${n}`).toBe(true);
    }
  });

  it("does not advertise features that don't exist", () => {
    const text = HELP_TOPICS.map((t) => [t.title, t.blurb, ...t.steps, ...(t.notes ?? [])].join(" ")).join(" ");
    const banned = [
      /vocal\s*\/\s*instrumental/i,
      /\bteam\b.*\bplan\b/i,
      /premium subscription/i,
      /support@|hello@/i, // never leak raw email into the page content
      /api key/i,
      /vocal remover/i,
      /\bAI mastering\b/i,
    ];
    for (const pattern of banned) {
      expect(pattern.test(text), `banned phrase found: ${pattern}`).toBe(false);
    }
  });

  it("does not promise that every device processes every file quickly", () => {
    const slowTopic = HELP_TOPICS[0];
    const text = [slowTopic.title, ...slowTopic.notes ?? ""].join(" ");
    expect(text).toMatch(/can|normal|not a fault/i);
    expect(text.toLowerCase()).toContain("we can't promise");
  });

  it("never suggests disabling device security features", () => {
    const text = HELP_TOPICS.map((t) => [t.title, ...t.steps, ...(t.notes ?? [])].join(" ")).join(" ");
    const dangerous = [
      /disable.*(antivirus|security|firewall|smart ?screen)/i,
      /turn off.*(antivirus|security|firewall|smart ?screen)/i,
    ];
    for (const pattern of dangerous) {
      expect(pattern.test(text), `dangerous advice found: ${pattern}`).toBe(false);
    }
  });
});

describe("sitemap registration", () => {
  it("registers /help/performance", async () => {
    const sitemap = (await import("@/app/sitemap")).default;
    const stripped = sitemap().map((e) =>
      e.url.startsWith("https://") ? e.url.replace(/^https?:\/\/[^/]+/, "") : e.url
    );
    expect(stripped).toContain("/help/performance");
  });
});
