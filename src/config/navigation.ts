export interface NavItem {
  href: string;
  label: string;
}

/** Center navigation — the product's primary, high-impact surfaces only. */
export const primaryNav: NavItem[] = [
  { href: "/studio", label: "Studio" },
  { href: "/presets", label: "Presets" },
  { href: "/how-it-works", label: "How It Works" },
  { href: "/about", label: "About" },
];

/** Secondary routes for dropdowns and deeper exploration */
export const secondaryNav: NavItem[] = [
  { href: "/effects", label: "DSP Effects" },
  { href: "/blog", label: "Audio Guides" },
  { href: "/contact", label: "Contact Dispatch" },
  { href: "/faq", label: "FAQ" },
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
  { href: "/contact", label: "Contact" },
  { href: "/faq", label: "FAQ" },
];

/** Legal and policy links. */
export const legalNav: NavItem[] = [
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms of Service" },
];
