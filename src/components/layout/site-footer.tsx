import Link from "next/link";
import { footerCompanyNav, footerProductNav, legalNav } from "@/config/navigation";
import { siteConfig } from "@/config/site";
import { Logo } from "./logo";
import { FooterAttribution } from "./footer-attribution";
import { CookiePreferencesButton } from "./cookie-preferences-button";

const currentYear = new Date().getFullYear();

export function SiteFooter() {
  return (
    <footer className="mt-12 sm:mt-20 border-t border-line bg-canvas">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4 lg:gap-12">
          {/* Brand Column */}
          <div className="sm:col-span-2 space-y-3">
            <Link href="/" className="inline-flex items-center select-none" aria-label="Audify homepage">
              <Logo height={34} variant="adaptive" />
            </Link>
            <p className="text-xs font-medium text-accent tracking-wide">
              {siteConfig.tagline}
            </p>
            <p className="max-w-md text-xs leading-relaxed text-muted">
              Audify is a premium browser-based audio-effects platform developed by{" "}
              <a
                href="https://nyxen.in"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-fg hover:text-accent underline underline-offset-2 transition-colors"
              >
                Nyxen
              </a>{" "}
              in partnership with music partner{" "}
              <a
                href={siteConfig.youtubeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-fg hover:text-accent underline underline-offset-2 transition-colors"
              >
                Xpert Melody
              </a>
              . Built for musicians, producers, sound designers, and content creators. 100% in-browser processing with zero audio uploads.
            </p>

            {/* Quick Action Badges */}
            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
              <Link
                href="/about"
                className="inline-flex items-center gap-1.5 rounded-full border border-line bg-surface px-3 py-1.5 text-[11px] font-medium text-muted hover:text-accent hover:border-accent/40 transition-colors"
              >
                <span>About Nyxen &amp; Audify</span>
              </Link>
              <a
                href="mailto:hello@nyxen.in"
                className="inline-flex items-center gap-1.5 rounded-full border border-line bg-surface px-3 py-1.5 text-[11px] font-mono text-muted hover:text-fg hover:border-fg/30 transition-colors"
              >
                <span>hello@nyxen.in</span>
              </a>
            </div>
          </div>

          {/* Navigation Columns: 2-column grid on mobile, unpacked on tablet/desktop */}
          <div className="grid grid-cols-2 gap-6 sm:contents">
            {/* Product Column */}
            <nav aria-label="Footer product navigation">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-fg">
                Studio &amp; Directory
              </h3>
              <ul className="mt-3 space-y-1 sm:space-y-2">
                {footerProductNav.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="inline-flex items-center py-1 sm:py-0 text-xs text-muted transition-colors hover:text-fg active:text-fg min-h-[34px] sm:min-h-0"
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
                Learn &amp; Legal
              </h3>
              <ul className="mt-3 space-y-1 sm:space-y-2">
                {footerCompanyNav.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="inline-flex items-center py-1 sm:py-0 text-xs text-muted transition-colors hover:text-fg active:text-fg min-h-[34px] sm:min-h-0"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
                {legalNav.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="inline-flex items-center py-1 sm:py-0 text-xs text-muted transition-colors hover:text-fg active:text-fg min-h-[34px] sm:min-h-0"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
                <li className="pt-1">
                  <CookiePreferencesButton />
                </li>
              </ul>
            </nav>
          </div>
        </div>

        {/* Bottom bar with animated interchangeable attribution */}
        <div className="mt-8 sm:mt-10 border-t border-line pt-6 flex flex-col-reverse sm:flex-row items-center justify-between gap-4 text-xs text-faint text-center sm:text-left">
          <p>© {currentYear} Audify. All rights reserved.</p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <span className="hidden md:inline-block">Free browser audio workstation ·</span>
            <FooterAttribution />
          </div>
        </div>
      </div>
    </footer>
  );
}
