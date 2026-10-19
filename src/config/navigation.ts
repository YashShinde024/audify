export interface NavItem {
  href: string;
  label: string;
}

/** Center navigation — the product's primary surfaces. */
export const primaryNav: NavItem[] = [
  { href: "/studio", label: "Studio" },
  { href: "/presets", label: "Presets" },
  { href: "/effects", label: "Effects" },
  { href: "/blog", label: "Guides" },
  { href: "/how-it-works", label: "How It Works" },
  { href: "/about", label: "About" },
];

/** Compact secondary menu in the header for documentation pages. */
export const secondaryNav: NavItem[] = [
  { href: "/about", label: "About" },
  { href: "/blog", label: "Guides" },
  { href: "/faq", label: "FAQ" },
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
];

export const footerNav: NavItem[] = [
  { href: "/studio", label: "Studio" },
  { href: "/presets", label: "Presets" },
  { href: "/effects", label: "Effects" },
  { href: "/blog", label: "Audio Guides" },
  { href: "/how-it-works", label: "How It Works" },
  { href: "/about", label: "About Us" },
  { href: "/faq", label: "FAQ" },
];

/** Legal and policy links. */
export const legalNav: NavItem[] = [
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms of Service" },
];
