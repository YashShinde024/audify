"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { List, X, ArrowRight } from "@phosphor-icons/react";
import { primaryNav } from "@/config/navigation";
import { Logo } from "./logo";
import { ThemeToggle } from "./theme-toggle";
import { cn } from "@/lib/utils";

/**
 * The Sonic Ribbon.
 *
 * A single architectural rail: wordmark left, a compact central route,
 * theme + one Studio action right. The signature detail is the crimson
 * route indicator — a short ember segment that slides under the active
 * link as a real measured element, and a hover underline that stays put.
 *
 * Scrolling compacts the ribbon (lower profile, more opaque) via a
 * transitioned `data-state`; the header is sticky so nothing below jumps.
 */

const SCROLL_COMPACT_PX = 24;

export function SiteHeader() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const navRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const menuPanelRef = useRef<HTMLDivElement>(null);
  const lastPathRef = useRef(pathname);

  // Sliding crimson indicator geometry, measured from the active link.
  const [marker, setMarker] = useState<{ left: number; width: number } | null>(
    null,
  );

  // Route changes close the mobile sheet.
  useEffect(() => {
    if (lastPathRef.current === pathname) return;
    lastPathRef.current = pathname;
    setMobileOpen(false);
  }, [pathname]);

  // Escape closes the sheet and returns focus to the trigger.
  useEffect(() => {
    if (!mobileOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobileOpen(false);
        menuButtonRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [mobileOpen]);

  // Lock page scroll behind the mobile sheet.
  useEffect(() => {
    if (!mobileOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [mobileOpen]);

  // Compact the ribbon once the page has scrolled.
  useEffect(() => {
    const update = () => setScrolled(window.scrollY > SCROLL_COMPACT_PX);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  // Measure the active link so the crimson segment can slide to it.
  const measureMarker = useCallback(() => {
    const nav = navRef.current;
    if (!nav) return;
    const active = nav.querySelector<HTMLElement>('[data-active="true"]');
    if (!active) {
      setMarker(null);
      return;
    }
    setMarker({
      left: active.offsetLeft,
      width: active.offsetWidth,
    });
  }, []);

  useLayoutEffect(() => {
    measureMarker();
  }, [pathname, measureMarker]);

  useEffect(() => {
    measureMarker();
    const onResize = () => measureMarker();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [measureMarker]);

  // Re-measure once fonts settle in (title font shifts link widths).
  useEffect(() => {
    const fonts = (document as Document & { fonts?: FontFaceSet }).fonts;
    fonts?.ready.then(() => measureMarker()).catch(() => undefined);
  }, [measureMarker]);

  return (
    <header className="sticky top-0 z-50">
      {/* Ribbon body */}
      <div
        data-state={scrolled || mobileOpen ? "scrolled" : "top"}
        className={cn(
          "pointer-events-auto border-b border-line",
          "transition-[background-color,box-shadow] duration-300",
          "data-[state=top]:bg-canvas/80 data-[state=scrolled]:bg-canvas/95",
          "data-[state=scrolled]:shadow-[0_1px_0_transparent,0_8px_30px_-18px_rgb(0_0_0/0.35)]",
        )}
      >
        <div
          className={cn(
            "mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8",
            "transition-[height] duration-300 ease-out",
            "h-16 data-[state=scrolled]:h-14",
          )}
          data-state={scrolled ? "scrolled" : "top"}
        >
          {/* Wordmark */}
          <Link
            href="/"
            className="shrink-0 rounded-sm px-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-violet"
            aria-label="Svaraya — home"
          >
            <Logo />
          </Link>

          {/* Central route + sliding crimson indicator (desktop) */}
          <nav
            ref={navRef}
            aria-label="Primary"
            className="relative hidden md:block"
          >
            <ul className="flex items-center gap-1">
              {primaryNav.map((item) => {
                const active =
                  pathname === item.href || pathname.startsWith(`${item.href}/`);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      data-active={active}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "relative block rounded-sm px-3 py-1.5 text-sm transition-colors duration-150",
                        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet",
                        active
                          ? "font-medium text-fg"
                          : "text-muted hover:text-fg",
                      )}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
            {/* The moving crimson segment. Rendered after the first paint so
                it never animates from 0 on hydration itself. */}
            {marker && (
              <span
                aria-hidden="true"
                className="pointer-events-none absolute -bottom-px h-px bg-accent shadow-[0_0_6px_var(--color-accent)]"
                style={{
                  width: `${Math.max(marker.width, 0)}px`,
                  transform: `translateX(${marker.left}px)`,
                  transition:
                    "width 220ms cubic-bezier(0.32,0.72,0,1), transform 220ms cubic-bezier(0.32,0.72,0,1)",
                }}
              />
            )}
          </nav>

          {/* Right cluster */}
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link
              href="/studio"
              className={cn(
                "hidden sm:inline-flex items-center gap-1.5 rounded-sm px-3.5 py-2 text-sm",
                "text-white bg-accent transition-colors duration-150 hover:bg-accent-hover",
                // Fine gradient detail confined to the primary action's top edge.
                "shadow-[inset_0_1px_0_rgb(255_255_255/0.18)]",
                "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet",
              )}
            >
              Open Studio
              <ArrowRight aria-hidden="true" className="h-3.5 w-3.5" />
            </Link>

            <button
              ref={menuButtonRef}
              type="button"
              onClick={() => setMobileOpen((open) => !open)}
              aria-expanded={mobileOpen}
              aria-controls="sonic-ribbon-sheet"
              className={cn(
                "inline-flex h-9 w-9 items-center justify-center rounded-sm border border-line text-fg md:hidden",
                "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet",
              )}
            >
              {mobileOpen ? (
                <X aria-hidden="true" className="h-4 w-4" />
              ) : (
                <List aria-hidden="true" className="h-4 w-4" />
              )}
              <span className="sr-only">
                {mobileOpen ? "Close menu" : "Open menu"}
              </span>
            </button>
          </div>
        </div>

        {/* Polished mobile navigation sheet */}
        <div
          id="sonic-ribbon-sheet"
          ref={menuPanelRef}
          className={cn(
            "md:hidden",
            mobileOpen
              ? "block border-t border-line"
              : "hidden pointer-events-none",
          )}
        >
          {mobileOpen && (
            <nav
              aria-label="Mobile primary"
              className="mx-auto max-w-7xl px-4 py-4 sm:px-6"
            >
              <ul className="flex flex-col divide-y divide-line">
                {primaryNav.map((item) => {
                  const active =
                    pathname === item.href ||
                    pathname.startsWith(`${item.href}/`);
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        aria-current={active ? "page" : undefined}
                        onClick={() => setMobileOpen(false)}
                        className={cn(
                          "flex items-center justify-between py-3 text-base",
                          "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet",
                          active ? "font-medium text-fg" : "text-muted",
                        )}
                      >
                        {item.label}
                        <span
                          aria-hidden="true"
                          className={cn(
                            "h-1.5 w-1.5 rounded-full",
                            active ? "bg-accent" : "bg-transparent",
                          )}
                        />
                      </Link>
                    </li>
                  );
                })}
              </ul>
              <Link
                href="/studio"
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "mt-4 flex items-center justify-center gap-2 rounded-sm px-4 py-3 text-sm text-white bg-accent",
                  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet",
                )}
              >
                Open Studio
                <ArrowRight aria-hidden="true" className="h-3.5 w-3.5" />
              </Link>
            </nav>
          )}
        </div>
      </div>
    </header>
  );
}
