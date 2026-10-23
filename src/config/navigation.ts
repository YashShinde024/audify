export interface NavItem {
  href: string;
  label: string;
}

/** Center navigation — concise primary routes */
export const primaryNav: NavItem[] = [
  { href: "/studio", label: "Studio" },
  { href: "/presets", label: "Presets" },
  { href: "/how-it-works", label: "Audio Guide" },
  { href: "/about", label: "About" },
];

/** Secondary routes inside "More" dropdown */
export const secondaryNav: NavItem[] = [
  { href: "/effects", label: "Effects" },
  { href: "/blog", label: "Blog" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
];

/** Product navigation in footer */
export const footerProductNav: NavItem[] = [
  { href: "/studio", label: "Studio" },
  { href: "/presets", label: "Presets Directory" },
  { href: "/effects", label: "DSP Effects" },
  { href: "/how-it-works", label: "Audio Guide" },
  { href: "/blog", label: "Blog & Articles" },
];

/** Company and support navigation */
export const footerCompanyNav: NavItem[] = [
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/faq", label: "FAQ" },
];

/** Legal and policy links. */
export const legalNav: NavItem[] = [
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms of Service" },
];
