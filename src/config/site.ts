/**
 * Central site configuration for AudioMorph (formerly Svaraya)
 * Product: AudioMorph
 * Tagline: Sound, reimagined.
 * Brand Attribution: Developed by Nyxen · Music Expertise by Xpert Melody
 * YouTube: https://www.youtube.com/@xpertmelody
 * Nyxen Ecosystem: https://nyxen.in
 */
export const siteConfig = {
  name: "AudioMorph",
  tagline: "Sound, reimagined.",
  attribution: "Developed by Nyxen",
  by: "Nyxen",
  creators: {
    nyxen: {
      name: "Nyxen",
      role: "Lead Software Architect & DSP Engineer",
      website: "https://nyxen.in",
      email: "contact@nyxen.in",
      supportEmail: "support@nyxen.in",
      directEmail: "yash@nyxen.in",
      ecosystem: [
        { name: "Nychat", desc: "Next-gen AI conversational platform", url: "https://nyxen.in/nychat" },
        { name: "Rankly", desc: "Autonomous AI SEO and search ranking engine", url: "https://nyxen.in/rankly" },
        { name: "Venz", desc: "High-performance cloud developer toolkit", url: "https://nyxen.in/venz" },
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
  emails: {
    general: "contact@nyxen.in",
    support: "support@nyxen.in",
    direct: "yash@nyxen.in",
  },
  description:
    "AudioMorph is a free, privacy-first, browser-native audio DSP studio developed by Nyxen. 32-bit float Web Audio processing, zero server uploads.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://audiomorph.vercel.app",
  maxFileSizeBytes: 10 * 1024 * 1024, // 10 MB
} as const;

export type SiteConfig = typeof siteConfig;
