"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { List, X, ArrowRight } from "@phosphor-icons/react";
import { primaryNav } from "@/config/navigation";
import { Logo } from "./logo";
import { ThemeToggle } from "./theme-toggle";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const menuPanelRef = useRef<HTMLDivElement>(null);
  const lastPathRef = useRef(pathname);

  // Close the mobile menu whenever the route changes.
  useEffect(() => {
    if (lastPathRef.current === pathname) return;
    lastPathRef.current = pathname;
    setMobileOpen(false);
  }, [pathname]);

  // Escape closes the menu and returns focus to the trigger.
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

  // Move focus into the panel when it opens.
  useEffect(() => {
    if (mobileOpen) {
      menuPanelRef.current?.querySelector<HTMLElement>("a")?.focus();
    }
  }, [mobileOpen]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-canvas/85 backdrop-blur-md supports-[backdrop-filter]:bg-canvas/70">
      <nav aria-label="Primary" className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <Link href="/" className="flex shrink-0 items-center select-none" aria-label="Svaraya homepage">
          <Logo height={30} />
        </Link>

        {/* Center — curated primary surfaces */}
        <ul className="hidden items-center gap-1 md:flex">
          {primaryNav.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={isActive(item.href) ? "page" : undefined}
                className={cn(
                  "relative rounded-lg px-3.5 py-2 text-sm font-medium transition-colors",
                  isActive(item.href)
                    ? "text-fg"
                    : "text-muted hover:text-fg"
                )}
              >
                {item.label}
                {isActive(item.href) && (
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-3.5 -bottom-[13px] h-[2px] rounded-full bg-accent"
                  />
                )}
              </Link>
            </li>
          ))}
        </ul>

        {/* Right — theme toggle + primary action */}
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link
            href="/studio"
            className="hidden items-center gap-1.5 rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-accent-hover sm:inline-flex"
          >
            Open Studio
            <ArrowRight size={14} weight="bold" aria-hidden="true" />
          </Link>

          {/* Mobile menu trigger */}
          <button
            ref={menuButtonRef}
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-line text-fg md:hidden"
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            onClick={() => setMobileOpen((open) => !open)}
          >
            {mobileOpen ? <X size={18} weight="bold" /> : <List size={18} weight="bold" />}
          </button>
        </div>
      </nav>

      {/* Mobile panel */}
      {mobileOpen && (
        <div
          id="mobile-nav"
          ref={menuPanelRef}
          className="border-t border-line bg-canvas px-4 pb-4 pt-2 md:hidden"
        >
          <ul className="space-y-1">
            {primaryNav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  className={cn(
                    "block rounded-lg px-3 py-2.5 text-sm font-medium",
                    isActive(item.href) ? "bg-accent-soft text-fg" : "text-muted hover:bg-raised hover:text-fg"
                  )}
                  onClick={() => setMobileOpen(false)}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <Link
            href="/studio"
            className="mt-3 flex items-center justify-center gap-1.5 rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-white"
            onClick={() => setMobileOpen(false)}
          >
            Open Studio
            <ArrowRight size={14} weight="bold" aria-hidden="true" />
          </Link>
        </div>
      )}
    </header>
  );
}
