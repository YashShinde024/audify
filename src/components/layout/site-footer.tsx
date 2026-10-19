import Link from "next/link";
import { primaryNav, secondaryNav } from "@/config/navigation";
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
            <Link href="/" className="inline-flex items-center gap-2.5" aria-label="Svaraya homepage">
              <Logo />
              <span className="text-base font-semibold tracking-tight text-fg">Svaraya</span>
            </Link>
            <p className="mt-2 text-xs font-medium text-violet tracking-wide">
              {siteConfig.tagline}
            </p>
            <p className="mt-3 max-w-md text-xs leading-relaxed text-muted">
              Svaraya is a free audio-processing studio by{" "}
              <strong className="text-fg font-semibold">{siteConfig.by}</strong>. Made for people
              who love shaping sound.
            </p>

            {/* Creator YouTube Channel Link */}
            <div className="mt-4 flex items-center gap-2">
              <a
                href={siteConfig.youtubeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border border-line bg-surface px-3 py-1.5 text-xs font-medium text-muted hover:text-red-500 hover:border-red-500/40 transition-colors"
                aria-label="Xpert Melody on YouTube (opens in new tab)"
              >
                <YouTubeIcon size={16} className="text-red-500" />
                <span>Xpert Melody</span>
                <span className="text-[10px] text-faint">YouTube</span>
              </a>
            </div>
          </div>

          {/* Navigation Column */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-fg">
              Studio & Directory
            </h3>
            <ul className="mt-3 space-y-2">
              {primaryNav.map((item) => (
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
          </div>

          {/* Documentation & Legal */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-fg">
              Legal & Privacy
            </h3>
            <ul className="mt-3 space-y-2">
              {secondaryNav.map((item) => (
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
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 border-t border-line pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-faint">
          <p>© {currentYear} Svaraya. All rights reserved.</p>
          <p className="flex items-center gap-2">
            <span>Free browser audio processing</span>
            <span aria-hidden="true">·</span>
            <span className="font-medium text-fg">{siteConfig.by}</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
