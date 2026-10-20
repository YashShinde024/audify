export interface NavItem {
  href: string;
  label: string;
}

/** Center navigation — the product's primary surfaces only. */
export const primaryNav: NavItem[] = [
  { href: "/studio", label: "Studio" },
  { href: "/presets", label: "Presets" },
  { href: "/effects", label: "Effects" },
  { href: "/blog", label: "Guides" },
];

/**
 * Documentation / company pages live in the footer, not the header.
 * (Formerly a compact header menu — now grouped in footerNav.)
 */
export const footerProductNav: NavItem[] = [
  { href: "/studio", label: "Studio" },
  { href: "/presets", label: "Presets" },
  { href: "/effects", label: "Effects" },
  { href: "/blog", label: "Audio Guides" },
];

export const footerCompanyNav: NavItem[] = [
  { href: "/how-it-works", label: "How It Works" },
  { href: "/about", label: "About" },
  { href: "/faq", label: "FAQ" },
];

/** Legal and policy links. */
export const legalNav: NavItem[] = [
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms of Service" },
];
