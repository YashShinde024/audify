import Link from "next/link";
import { footerCompanyNav, footerProductNav, legalNav } from "@/config/navigation";
import { siteConfig } from "@/config/site";
import { Logo } from "./logo";
import { FooterAttribution } from "./footer-attribution";

const currentYear = new Date().getFullYear();

export function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-line bg-canvas">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4 lg:gap-12">
          {/* Brand Column */}
          <div className="sm:col-span-2">
            <Link href="/" className="inline-flex items-center select-none" aria-label="Audify homepage">
              <Logo height={34} variant="adaptive" />
            </Link>
            <p className="mt-2 text-xs font-medium text-accent tracking-wide">
              {siteConfig.tagline}
            </p>
            <p className="mt-3 max-w-md text-xs leading-relaxed text-muted">
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

        {/* Bottom bar with animated interchangeable attribution */}
        <div className="mt-10 border-t border-line pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-faint">
          <p>© {currentYear} Audify. All rights reserved.</p>
          <div className="flex items-center gap-3">
            <span className="hidden md:inline-block">Free browser audio workstation ·</span>
            <FooterAttribution />
          </div>
        </div>
      </div>
    </footer>
  );
}
