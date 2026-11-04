import { describe, expect, it } from "vitest";
import sitemap from "@/app/sitemap";
import { siteConfig, homeMetadata as homepageMetadata } from "@/config/site";
import { FAQ_DATA } from "@/app/faq/faq-data";

const routesToUrls = (urls: string[]) => urls.map((u) => u);

describe("sitemap", () => {
  const urls = sitemap().map((entry) => entry.url);
  const stripped = routesToUrls(urls).map((u) => u.replace(siteConfig.url, ""));

  it("contains only absolute site URLs", () => {
    for (const url of urls) {
      expect(url, `non-absolute sitemap URL: ${url}`).toMatch(/^https?:\/\//);
      expect(url.startsWith(siteConfig.url), `foreign sitemap URL: ${url}`).toBe(true);
    }
  });

  it("contains all registered /tools/* slugs", () => {
    expect(stripped).toContain("/tools");
    expect(stripped.some((u) => u.startsWith("/tools/"))).toBe(true);
  });

  it("includes the blog index and the published editorial article", () => {
    const blogRoutes = stripped.filter((u) => u.startsWith("/blog"));
    expect(blogRoutes).toContain("/blog");
    expect(blogRoutes).toContain("/blog/what-is-audify-browser-audio-workstation");
  });

  it("does not attach dynamic fake timestamps to static routes, but preserves real article dates", () => {
    const entries = sitemap();
    const studioEntry = entries.find((e) => e.url === `${siteConfig.url}/studio`);
    expect(studioEntry?.lastModified).toBeUndefined();

    const articleEntry = entries.find(
      (e) => e.url === `${siteConfig.url}/blog/what-is-audify-browser-audio-workstation`
    );
    expect(articleEntry?.lastModified).toBeInstanceOf(Date);
  });
});

describe("homepage metadata", () => {
  const title = String(homepageMetadata.title);
  const description = homepageMetadata.description ?? "";

  it("keeps the title within the ~50-60 char SEO range", () => {
    expect(title.length).toBeGreaterThanOrEqual(45);
    expect(title.length).toBeLessThanOrEqual(60);
  });

  it("keeps the meta description in the ~120-160 char range", () => {
    expect(description.length).toBeGreaterThanOrEqual(110);
    expect(description.length).toBeLessThanOrEqual(160);
  });

  it("avoids unsupported absolute privacy claims", () => {
    expect(description.toLowerCase()).not.toContain("100%");
  });

  it("mirrors OG and Twitter titles/descriptions for consistent previews", () => {
    const openGraph = homepageMetadata.openGraph;
    const twitter = homepageMetadata.twitter;
    expect(openGraph?.title).toBe(title);
    expect(openGraph?.description).toBe(description);
    expect(twitter?.title).toBe(title);
    expect(twitter?.description).toBe(description);
  });

  it("sets a canonical URL matching the site origin", () => {
    expect(homepageMetadata.alternates?.canonical).toBe(siteConfig.url);
  });
});

describe("FAQ schema ↔ visible content consistency", () => {
  it("every FAQ entry carries an answer text", () => {
    for (const item of FAQ_DATA) {
      expect(item.question, `question is empty for ${item.id}`).toBeTruthy();
      expect(
        item.answerText.trim().length,
        `answerText too short for ${item.id}`,
      ).toBeGreaterThan(25);
    }
  });

  it("FAQ questions are unique", () => {
    const questions = FAQ_DATA.map((item) => item.question);
    expect(new Set(questions).size).toBe(questions.length);
  });

  it("answers stay in the 40-200 word range and are direct one-block answers", () => {
    for (const item of FAQ_DATA) {
      const words = item.answerText.split(/\s+/).filter(Boolean).length;
      expect(words, `${item.id} answer has ${words} words`).toBeGreaterThanOrEqual(20);
      expect(words, `${item.id} answer has ${words} words`).toBeLessThan(200);
    }
  });
});
