import Link from "next/link";
import { footerCompanyNav, footerProductNav, legalNav } from "@/config/navigation";
import { siteConfig } from "@/config/site";
import { Logo } from "./logo";
import { YouTubeIcon } from "@/components/icons/preset-icons";

const currentYear = new Date().getFullYear();

export function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-line bg-canvas">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4 lg:gap-12">
          {/* Brand Column */}
          <div className="sm:col-span-2">
            <Link href="/" className="inline-flex items-center select-none" aria-label="AudioMorph homepage">
              <Logo height={34} variant="by-nyxen" />
            </Link>
            <p className="mt-2 text-xs font-medium text-accent tracking-wide">
              {siteConfig.tagline}
            </p>
            <p className="mt-3 max-w-md text-xs leading-relaxed text-muted">
              AudioMorph is an ultra-fast, client-side Web Audio DSP workstation developed by{" "}
              <a
                href="https://nyxen.in"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-fg hover:text-accent underline underline-offset-2 transition-colors"
              >
                Nyxen
              </a>
              . Built for musicians, producers, sound designers, and content creators. 100% in-browser processing with zero audio uploads.
            </p>

            <div className="mt-4 flex items-center gap-3 text-xs">
              <Link
                href="/about"
                className="inline-flex items-center gap-1.5 rounded-full border border-line bg-surface px-3 py-1 text-xs font-medium text-muted hover:text-accent hover:border-accent/40 transition-colors"
              >
                <span>About the Creators & Acoustics</span>
              </Link>
            </div>
          </div>

          {/* Product Column */}
          <nav aria-label="Footer product navigation">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-fg">
              Studio & Directory
            </h3>
            <ul className="mt-3 space-y-2">
              {footerProductNav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-xs text-muted transition-colors hover:text-fg"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Company & Legal Column */}
          <nav aria-label="Footer company and legal navigation">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-fg">
              Learn & Legal
            </h3>
            <ul className="mt-3 space-y-2">
              {footerCompanyNav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-xs text-muted transition-colors hover:text-fg"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
              {legalNav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-xs text-muted transition-colors hover:text-fg"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-[11px] leading-relaxed text-faint">
              100% in-browser processing. Zero server-side uploads or telemetry storage.
            </p>
          </nav>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 border-t border-line pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-faint">
          <p>© {currentYear} AudioMorph. All rights reserved.</p>
          <p className="flex items-center gap-2">
            <span>Free browser audio workstation</span>
            <span aria-hidden="true">·</span>
            <span className="font-medium text-fg">{siteConfig.attribution}</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
