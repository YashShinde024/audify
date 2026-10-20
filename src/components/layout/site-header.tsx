"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { X, ArrowRight } from "@phosphor-icons/react";
import { primaryNav } from "@/config/navigation";
import { Logo } from "./logo";
import { ThemeToggle } from "./theme-toggle";
import { cn } from "@/lib/utils";

/**
 * The Console Rack.
 *
 * A rack-equipment take on site navigation, distinct from a floating pill
 * or a sliding-underline ribbon:
 *
 * - a full-width architectural bar with hairline top accent and rail dividers;
 * - index-numbered monospaced labels ("01 Studio");
 * - the active route is an inset patch chip (filled pocket + ember dot),
 *   not an underline;
 * - the far right carries a segmented LEVEL meter driven by real scroll
 *   progress — an honest indicator of position down the page, not decoration;
 * - mobile folds into a right-hand rack drawer with full keyboard/ARIA support.
 */

const METER_SEGMENTS = 12;

export function SiteHeader() {
  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [level, setLevel] = useState(0);

  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);
  const lastPathRef = useRef(pathname);

  const isActive = useCallback(
    (href: string) => pathname === href || pathname.startsWith(`${href}/`),
    [pathname],
  );

  // Route changes close the drawer.
  useEffect(() => {
    if (lastPathRef.current === pathname) return;
    lastPathRef.current = pathname;
    setDrawerOpen(false);
  }, [pathname]);

  // Escape closes the drawer and returns focus to the trigger.
  useEffect(() => {
    if (!drawerOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setDrawerOpen(false);
        menuButtonRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [drawerOpen]);

  // Lock page scroll behind the drawer.
  useEffect(() => {
    if (!drawerOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [drawerOpen]);

  // Real scroll progress → the level meter segments.
  useEffect(() => {
    const update = () => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      setLevel(max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  const litSegments = Math.round(level * METER_SEGMENTS);

  return (
    <header className="sticky top-0 z-50">
      {/* Hairline accent rail across the very top of the page chrome */}
      <div
        aria-hidden="true"
        className="h-px w-full bg-gradient-to-r from-accent via-transparent to-transparent"
      />

      {/* Rack bar */}
      <div className="border-b border-line bg-canvas/90 backdrop-blur supports-[backdrop-filter]:bg-canvas/75">
        <div className="mx-auto flex h-16 max-w-7xl items-stretch justify-between px-4 sm:px-6 lg:px-8">
          {/* Wordmark cell */}
          <div className="flex items-center border-r border-line pr-4 sm:pr-6">
            <Link
              href="/"
              aria-label="Svaraya — home"
              className="rounded-sm px-1 py-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-violet"
            >
              <Logo />
            </Link>
          </div>

          {/* Index-numbered route labels (desktop) */}
          <nav
            aria-label="Primary"
            className="hidden md:flex md:items-center md:gap-1 md:border-r md:border-line md:pr-4"
          >
            <ul className="flex items-center gap-1">
              {primaryNav.map((item, index) => {
                const active = isActive(item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "group inline-flex items-center gap-2 rounded-sm px-2.5 py-1.5 transition-colors duration-150",
                        "font-mono text-[11px] uppercase tracking-[0.14em]",
                        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet",
                        active
                          ? "bg-raised text-fg shadow-[inset_0_0_0_1px_var(--color-line-strong)]"
                          : "text-muted hover:text-fg",
                      )}
                    >
                      {/* Index number */}
                      <span
                        aria-hidden="true"
                        className={cn(
                          "tnum transition-colors",
                          active
                            ? "text-accent"
                            : "text-faint group-hover:text-faint",
                        )}
                      >
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      {item.label}
                      {/* Ember patch dot when active */}
                      {active && (
                        <span
                          aria-hidden="true"
                          className="ml-0.5 h-1.5 w-1.5 rounded-full bg-accent"
                        />
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Right cell: level meter, theme, studio action, drawer toggle */}
          <div className="flex items-center gap-3 pl-4">
            {/* Segmented LEVEL meter (decorative label is honest: it shows real page position) */}
            <div
              aria-hidden="true"
              className="hidden lg:flex items-end gap-[3px] pb-0 pt-[1px]"
            >
              {Array.from({ length: METER_SEGMENTS }, (_, i) => (
                <span
                  key={i}
                  className={cn(
                    "w-[3px] rounded-[1px] transition-colors duration-150",
                    i < litSegments ? "bg-accent" : "bg-line-strong",
                  )}
                  style={{ height: `${6 + i * 1.2}px` }}
                />
              ))}
              <span className="ml-1.5 font-mono text-[9px] uppercase tracking-widest text-faint">
                lvl
              </span>
            </div>

            <ThemeToggle />

            <Link
              href="/studio"
              className={cn(
                "hidden sm:inline-flex items-center gap-1.5 rounded-sm px-3.5 py-2 text-sm",
                "bg-accent font-medium text-white",
                "transition-colors duration-150 hover:bg-accent-hover",
                "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet",
              )}
            >
              Open Studio
              <ArrowRight aria-hidden="true" className="h-3.5 w-3.5" />
            </Link>

            <button
              ref={menuButtonRef}
              type="button"
              onClick={() => setDrawerOpen((open) => !open)}
              aria-expanded={drawerOpen}
              aria-controls="console-rack-drawer"
              className={cn(
                "inline-flex h-9 w-9 items-center justify-center rounded-sm border border-line md:hidden",
                "text-fg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet",
              )}
            >
              {drawerOpen ? (
                <X aria-hidden="true" className="h-4 w-4" />
              ) : (
                <span
                  aria-hidden="true"
                  className="flex h-3.5 w-4 flex-col justify-between"
                >
                  <span className="h-px w-full bg-current" />
                  <span className="h-px w-full bg-current" />
                  <span className="h-px w-full bg-current" />
                </span>
              )}
              <span className="sr-only">
                {drawerOpen ? "Close menu" : "Open menu"}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile rack drawer */}
      <div
        id="console-rack-drawer"
        ref={drawerRef}
        className={drawerOpen ? "" : "hidden"}
      >
        {/* Overlay */}
        <button
          aria-hidden="true"
          tabIndex={-1}
          className="fixed inset-0 top-16 z-40 cursor-default bg-canvas/60 backdrop-blur-[2px]"
          onClick={() => setDrawerOpen(false)}
        />
        {/* Panel: right-hand rack drawer */}
        <div className="fixed right-0 top-16 z-50 flex h-[calc(100dvh-4rem)] w-72 flex-col border-l border-line bg-surface shadow-2xl">
          <nav aria-label="Mobile primary" className="flex-1 overflow-y-auto">
            <p className="px-4 pb-1 pt-4 font-mono text-[10px] uppercase tracking-[0.18em] text-faint">
              Routes
            </p>
            <ul className="px-2">
              {primaryNav.map((item, index) => {
                const active = isActive(item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      onClick={() => setDrawerOpen(false)}
                      className={cn(
                        "flex items-center justify-between rounded-sm px-2.5 py-2.5 text-sm",
                        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet",
                        active ? "text-fg" : "text-muted hover:text-fg",
                      )}
                    >
                      <span className="flex items-center gap-2.5">
                        <span
                          aria-hidden="true"
                          className={cn(
                            "tnum font-mono text-[10px]",
                            active ? "text-accent" : "text-faint",
                          )}
                        >
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <span className={active ? "font-medium" : undefined}>
                          {item.label}
                        </span>
                      </span>
                      {active && (
                        <span
                          aria-hidden="true"
                          className="h-1.5 w-1.5 rounded-full bg-accent"
                        />
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
            <div className="mt-2 border-t border-line px-4 pt-4">
              <Link
                href="/studio"
                onClick={() => setDrawerOpen(false)}
                className={cn(
                  "flex items-center justify-center gap-2 rounded-sm bg-accent px-4 py-3 text-sm font-medium text-white",
                  "transition-colors duration-150 hover:bg-accent-hover",
                  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet",
                )}
              >
                Open Studio
                <ArrowRight aria-hidden="true" className="h-3.5 w-3.5" />
              </Link>
            </div>
          </nav>
          <p className="border-t border-line px-4 py-3 font-mono text-[10px] uppercase tracking-widest text-faint">
            100% in-browser · no uploads
          </p>
        </div>
      </div>
    </header>
  );
}
