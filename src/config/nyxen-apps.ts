/**
 * Nyxen product suite registry.
 * Powers the About mega-menu in the site header and the About page.
 * Logos live in /public/images/nyxen/.
 */
export interface NyxenApp {
  name: string;
  /** Public URL of the product */
  href: string;
  /** Short category label shown as a badge */
  category: string;
  /** One-line tagline shown on the card */
  tagline: string;
  /** Longer description shown on the card */
  description: string;
  /** Logo asset path */
  logo: string;
  status: "Live" | "Beta" | "Coming Soon";
  features: string[];
}

export const nyxenApps: NyxenApp[] = [
  {
    name: "Rankly",
    href: "https://rankly.nyxen.in",
    category: "Web Intelligence",
    tagline: "SEO · GEO · AEO visibility engine.",
    description:
      "Understands how your website appears across classic search engines, generative engines and AI answer surfaces — turning modern search visibility into clear, actionable insight.",
    logo: "/images/nyxen/rankly-logo.png",
    status: "Live",
    features: ["SEO health audits", "GEO & AEO tracking", "AI-powered fixes"],
  },
  {
    name: "NyChat",
    href: "https://nychat.nyxen.in",
    category: "Ephemeral Comms",
    tagline: "Login-free encrypted conversations.",
    description:
      "Anonymous chat rooms with client-side AES-256-GCM encryption, WebRTC voice & video, and ephemeral rooms that clear when the conversation ends.",
    logo: "/images/nyxen/nychat-logo.png",
    status: "Live",
    features: ["AES-256-GCM", "WebRTC calls", "Ephemeral rooms"],
  },
  {
    name: "Venz AI",
    href: "https://venzai.tech",
    category: "AI Suite",
    tagline: "Prompt optimization & workflows.",
    description:
      "An AI ecosystem focused on productivity, prompt optimization, intelligent workflows, and accessible AI tooling for every creator.",
    logo: "/images/nyxen/venz-logo.png",
    status: "Live",
    features: ["Prompt optimization", "Intelligent workflows", "Accessible AI"],
  },
];

export const nyxenStudio = {
  name: "Nyxen Studio",
  href: "https://nyxen.in",
  logo: "/images/nyxen/nyxen-logo.png",
  motto: "Thoughtful Technology.",
  description:
    "An independent product studio building lightweight, privacy-first software — every product solves tangible friction without the bloat of traditional SaaS.",
} as const;
