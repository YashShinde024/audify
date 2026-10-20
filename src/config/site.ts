/**
 * Central site configuration for Svaraya
 * Product: Svaraya
 * Tagline: Sound, reimagined.
 * Creator attribution: By Nyxen × Xpert Melody
 * YouTube: https://www.youtube.com/@xpertmelody
 */
export const siteConfig = {
  name: "Svaraya",
  tagline: "Sound, reimagined.",
  creators: "Nyxen × Xpert Melody",
  by: "Nyxen × Xpert Melody",
  youtubeUrl: "https://www.youtube.com/@xpertmelody",
  youtubeHandle: "@xpertmelody",
  description:
    "A free, browser-based audio-effects studio by Nyxen × Xpert Melody. Choose presets, sculpt DSP parameters, and preview before exporting — all without leaving your tab.",
  // Production origin used for canonical URLs, OG tags, and the sitemap.
  // Set NEXT_PUBLIC_SITE_URL when deploying; this default is the current
  // Vercel deployment domain — swap it once a custom domain is purchased.
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://svaraya.vercel.app",
  maxFileSizeBytes: 10 * 1024 * 1024, // 10 MB
} as const;

export type SiteConfig = typeof siteConfig;
