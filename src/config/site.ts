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
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://svaraya.example.com",
  maxFileSizeBytes: 10 * 1024 * 1024, // 10 MB
} as const;

export type SiteConfig = typeof siteConfig;
