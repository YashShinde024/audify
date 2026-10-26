export interface NavItem {
  href: string;
  label: string;
}

/** Center navigation — concise primary routes across all four core areas */
export const primaryNav: NavItem[] = [
  { href: "/studio", label: "Studio" },
  { href: "/tools", label: "Audio Tools" },
  { href: "/presets", label: "Presets" },
  { href: "/effects", label: "Effects" },
  { href: "/how-it-works", label: "Audio Guide" },
];

/** Secondary routes inside "More" dropdown */
export const secondaryNav: NavItem[] = [
  { href: "/about", label: "About" },
  { href: "/blog", label: "Blog" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
];

/** Product navigation in footer */
export const footerProductNav: NavItem[] = [
  { href: "/studio", label: "Studio" },
  { href: "/tools", label: "Audio Tools" },
  { href: "/presets", label: "Presets Directory" },
  { href: "/effects", label: "DSP Effects" },
  { href: "/how-it-works", label: "Audio Guide" },
];

/** Company and legal navigation in footer */
export const footerCompanyNav: NavItem[] = [
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

/** Learning content and discovery navigation in footer */
export const footerLearnNav: NavItem[] = [
  { href: "/faq", label: "FAQ" },
  { href: "/help/performance", label: "Performance Help" },
  { href: "/seo", label: "Audio Tool Index" },
  { href: "/aeo", label: "Answer Engine FAQ" },
  { href: "/geo", label: "Architecture Spec" },
];

/** Technical and search architecture discovery links */
export const discoveryNav: NavItem[] = [
  { href: "/seo", label: "Audio Tool Index" },
  { href: "/aeo", label: "Answer Engine Guide" },
  { href: "/geo", label: "Generative Engine Spec" },
];

/** Nyxen product suite links in footer */
export const footerNyxenNav: NavItem[] = [
  { href: "https://nyxen.in", label: "Nyxen Studio" },
  { href: "https://rankly.nyxen.in", label: "Rankly — SEO Intelligence" },
  { href: "https://nychat.nyxen.in", label: "NyChat — Private Chat" },
  { href: "https://venzai.tech", label: "Venz AI — Prompt Suite" },
];

/** Legal and policy links. */
export const legalNav: NavItem[] = [
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms of Service" },
];
