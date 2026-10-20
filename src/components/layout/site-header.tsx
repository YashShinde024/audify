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
 * The Prism Dock.
 *
 * Third-generation navigation, distinct from the pill bar and the rack:
 * a centered floating glass island that hovers over the page with a
 * breathing hairline sweep running along the very top edge of the
 * viewport. Links are set in tight uppercase mono; the active route is a
 * lifted "key" carrying a three-bar pulse equalizer — the only kinetic
 * element, and only while active. Mobile folds into a right-hand drawer
 * with the full keyboard/ARIA contract preserved.
 */

export function SiteHeader() {
  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);
  const [cometRect, setCometRect] = useState({ left: 0, width: 0 });
  const navListRef = useRef<HTMLUListElement>(null);
  const linkRefs = useRef<Array<HTMLLIElement | null>>([]);

  // Measure the hovered link (relative to the list) and place the comet under it.
  useEffect(() => {
    if (hoverIdx === null) return;
    const li = linkRefs.current[hoverIdx];
    const ul = navListRef.current;
    if (!li || !ul) return;
    setCometRect({ left: li.offsetLeft, width: li.offsetWidth });
  }, [hoverIdx]);

  // Keep the comet aligned if the viewport reflows while hovering.
  useEffect(() => {
    const onResize = () => {
      if (hoverIdx === null) return;
      const li = linkRefs.current[hoverIdx];
      const ul = navListRef.current;
      if (!li || !ul) return;
      setCometRect({ left: li.offsetLeft, width: li.offsetWidth });
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [hoverIdx]);

  const menuButtonRef = useRef<HTMLButtonElement>(null);
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

  return (
    <>
      {/* Breathing hairline: a 1px rail with a slow light sweep, viewport-wide */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed top-0 z-[60] h-px w-full overflow-hidden bg-line/60"
      >
        <span className="site-hairline-sweep absolute inset-y-0 w-1/4 bg-gradient-to-r from-transparent via-accent/80 to-transparent" />
      </div>

      <header className="sticky top-3 z-50 px-3 sm:px-6">
        {/* The dock itself */}
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-2 rounded-2xl border border-line-strong/50 bg-canvas/70 px-2.5 py-2 pl-3 shadow-[0_8px_30px_rgb(0_0_0/0.07)] backdrop-blur-xl supports-[backdrop-filter]:bg-canvas/55 sm:px-3">
          {/* Wordmark */}
          <Link
            href="/"
            aria-label="Svaraya — home"
            className="rounded-lg px-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-violet"
          >
            <Logo />
          </Link>

          {/* Desktop routes */}
          <nav aria-label="Primary" className="hidden min-w-0 md:block">
            <ul
              ref={navListRef}
              className="relative flex items-center gap-0.5"
              onMouseLeave={() => setHoverIdx(null)}
            >
              {/* Hover comet: sliding glow measured against the hovered link */}
              <span
                aria-hidden="true"
                className="dock-comet"
                data-visible={hoverIdx !== null}
                style={{ left: cometRect.left, width: cometRect.width }}
              />
              {primaryNav.map((item, idx) => {
                const active = isActive(item.href);
                return (
                  <li
                    key={item.href}
                    ref={(node) => {
                      linkRefs.current[idx] = node;
                    }}
                    className="dock-rise"
                    style={{ animationDelay: `${idx * 55}ms` }}
                    onMouseEnter={() => setHoverIdx(idx)}
                  >
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "group relative inline-flex h-9 items-center gap-2 rounded-xl px-3.5 text-[13px] font-medium transition-all duration-200",
                        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet",
                        active
                          ? "bg-deep/70 text-fg shadow-[inset_0_0_0_1px_var(--color-line)]"
                          : "text-muted hover:text-fg",
                      )}
                    >
                      {item.label}
                      {/* Active-route pulse equalizer (three bars, CSS only) */}
                      {active && (
                        <span
                          aria-hidden="true"
                          className="dock-eq flex h-3 items-end gap-[2px]"
                        >
                          <span />
                          <span />
                          <span />
                        </span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Right controls */}
          <div className="flex items-center gap-1.5">
            <ThemeToggle />

            <Link
              href="/studio"
              className={cn(
                "hidden sm:inline-flex items-center gap-1.5 rounded-xl bg-accent px-4 py-2 text-sm font-medium text-white",
                "transition-colors duration-150 hover:bg-accent-hover",
                "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet",
              )}
            >
              Studio
              <ArrowRight aria-hidden="true" className="h-3.5 w-3.5" />
            </Link>

            <button
              ref={menuButtonRef}
              type="button"
              onClick={() => setDrawerOpen((open) => !open)}
              aria-expanded={drawerOpen}
              aria-controls="prism-dock-drawer"
              className={cn(
                "inline-flex h-9 w-9 items-center justify-center rounded-xl border border-line md:hidden",
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
      </header>

      {/* Mobile drawer */}
      <div
        id="prism-dock-drawer"
        className={drawerOpen ? "" : "hidden"}
      >
        <button
          aria-hidden="true"
          tabIndex={-1}
          className="fixed inset-0 z-40 cursor-default bg-deep/40 backdrop-blur-[2px]"
          onClick={() => setDrawerOpen(false)}
        />
        <div className="fixed right-0 top-0 z-50 flex h-[100dvh] w-72 flex-col border-l border-line bg-canvas shadow-2xl">
          <div className="flex h-14 items-center justify-between border-b border-line px-4">
            <Logo />
            <button
              type="button"
              onClick={() => setDrawerOpen(false)}
              className={cn(
                "inline-flex h-9 w-9 items-center justify-center rounded-xl border border-line",
                "text-fg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet",
              )}
            >
              <X aria-hidden="true" className="h-4 w-4" />
              <span className="sr-only">Close menu</span>
            </button>
          </div>
          <nav aria-label="Mobile primary" className="flex-1 overflow-y-auto">
            <ul className="px-2 pt-2">
              {primaryNav.map((item) => {
                const active = isActive(item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "flex items-center justify-between rounded-xl px-3 py-2.5 text-sm",
                        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet",
                        active ? "bg-deep/70 text-fg" : "text-muted hover:text-fg",
                      )}
                    >
                      <span className={active ? "font-medium" : undefined}>
                        {item.label}
                      </span>
                      {active && (
                        <span
                          aria-hidden="true"
                          className="dock-eq flex h-3 items-end gap-[2px]"
                        >
                          <span />
                          <span />
                          <span />
                        </span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
            <div className="border-t border-line p-4">
              <Link
                href="/studio"
                className={cn(
                  "flex items-center justify-center gap-2 rounded-xl bg-accent px-4 py-3 text-sm font-medium text-white",
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
    </>
  );
}
