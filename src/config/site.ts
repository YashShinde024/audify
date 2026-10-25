/**
 * Central site configuration for Audify
 * Product: Audify
 * Tagline: Sound, reimagined.
 * Music partner: Xpert Melody
 * Brand attribution: Audify by Nyxen × Xpert Melody
 * YouTube: https://www.youtube.com/@xpertmelody
 * Nyxen Ecosystem: https://nyxen.in
 */
export const siteConfig = {
  name: "Audify",
  tagline: "Sound, reimagined.",
  attribution: "Audify by Nyxen × Xpert Melody",
  by: "Nyxen",
  musicPartner: "Xpert Melody",
  fullAttribution: "Audify by Nyxen × Xpert Melody",
  creators: {
    nyxen: {
      name: "Nyxen",
      role: "Lead Software Architect & DSP Engineer",
      website: "https://nyxen.in",
      email: "hello@nyxen.in",
      supportEmail: "support@nyxen.in",
      buildEmail: "build@nyxen.in",
      ecosystem: [
        { name: "Rankly", desc: "Web Intelligence — SEO, GEO and AEO tracking", url: "https://rankly.nyxen.in" },
        { name: "NyChat", desc: "Private & Ephemeral Communication Workspace", url: "https://nychat.nyxen.in" },
        { name: "Venz AI", desc: "AI Prompt Workspace & Productivity Tools", url: "https://venz.nyxen.in" },
      ],
    },
    xpertmelody: {
      name: "Xpert Melody",
      role: "Music Producer, Sound Designer & Acoustic Curator",
      youtubeUrl: "https://www.youtube.com/@xpertmelody",
      youtubeHandle: "@xpertmelody",
      desc: "Curator of signature acoustic curves, slowed+reverb audio edits, and 8D spatial soundscapes.",
    },
  },
  youtubeUrl: "https://www.youtube.com/@xpertmelody",
  youtubeHandle: "@xpertmelody",
  githubUrl: "https://github.com/YashShinde024/audify",
  emails: {
    general: "hello@nyxen.in",
    support: "support@nyxen.in",
    build: "build@nyxen.in",
  },
  description:
    "Audify is a premium browser-based audio-effects platform developed by Nyxen in partnership with Xpert Melody. 32-bit float Web Audio processing, zero server uploads.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://audify.nyxen.in",
  ogImage: "/images/audify-og.png",
  maxFileSizeBytes: 10 * 1024 * 1024, // 10 MB
} as const;

/** Homepage metadata kept here so tests can assert SEO invariants without importing route components. */
export const homeMetadata = {
  title: "Audify — Sound, reimagined · In-Browser Audio Toolkit",
  description:
    "In-browser audio presets and tools by Nyxen × Xpert Melody — slowed + reverb, 8D audio, nightcore, compression and trimming. Files are edited locally.",
  alternates: {
    canonical: siteConfig.url,
  },
  openGraph: {
    title: "Audify — Sound, reimagined · In-Browser Audio Toolkit",
    description:
      "In-browser audio presets and tools by Nyxen × Xpert Melody — slowed + reverb, 8D audio, nightcore, compression and trimming. Files are edited locally.",
    url: siteConfig.url,
    siteName: siteConfig.name,
    type: "website",
    images: [
      {
        url: `${siteConfig.url}${siteConfig.ogImage}`,
        width: 1200,
        height: 630,
        alt: "Audify — Sound, reimagined by Nyxen × Xpert Melody",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Audify — Sound, reimagined · In-Browser Audio Toolkit",
    description:
      "In-browser audio presets and tools by Nyxen × Xpert Melody — slowed + reverb, 8D audio, nightcore, compression and trimming. Files are edited locally.",
    creator: "@buildnyxen",
    images: [`${siteConfig.url}${siteConfig.ogImage}`],
  },
};


export type SiteConfig = typeof siteConfig;
