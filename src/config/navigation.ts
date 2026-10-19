export interface NavItem {
  href: string;
  label: string;
}

/** Center navigation — the product's primary surfaces. */
export const primaryNav: NavItem[] = [
  { href: "/studio", label: "Studio" },
  { href: "/presets", label: "Presets" },
  { href: "/effects", label: "Effects" },
  { href: "/how-it-works", label: "How It Works" },
];

/** Compact secondary menu in the header for documentation pages. */
export const secondaryNav: NavItem[] = [
  { href: "/faq", label: "FAQ" },
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
];

export const footerNav: NavItem[] = [
  { href: "/studio", label: "Studio" },
  { href: "/presets", label: "Presets" },
  { href: "/effects", label: "Effects" },
  { href: "/how-it-works", label: "How It Works" },
  { href: "/faq", label: "FAQ" },
];

/** Legal pages exist but carry explicit draft/placeholder disclosures. */
export const legalNav: NavItem[] = [
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
];
