"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { X, List } from "@phosphor-icons/react";
import { primaryNav, secondaryNav } from "@/config/navigation";
import { Logo } from "./logo";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function isActive(pathname: string, href: string) {
  if (href === "/studio") return pathname === "/studio";
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

export function SiteHeader() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const isStudio = pathname === "/studio";

  return (
    <header
      className={cn(
        "sticky top-0 z-40 border-b border-line bg-canvas/95 backdrop-blur-sm transition-colors",
        isStudio && "studio-theme bg-canvas/95",
      )}
    >
      <div className="mx-auto flex h-15 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left: Brand mark & Wordmark */}
        <Link
          href="/"
          className="flex items-center gap-2.5 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet"
          aria-label="Svaraya homepage"
          onClick={() => setMobileOpen(false)}
        >
          <Logo />
          <span className="text-base font-semibold tracking-tight text-fg">
            Svaraya
          </span>
          <span className="sr-only">Sound, reimagined. By Nyxen</span>
        </Link>

        {/* Center: Studio, Presets, Effects, How It Works */}
        <nav aria-label="Main navigation" className="hidden items-center gap-1 md:flex">
          {primaryNav.map((item) => {
            const active = isActive(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "rounded-md px-3.5 py-1.5 text-xs font-medium tracking-wide transition-colors",
                  active
                    ? "bg-surface text-fg font-semibold shadow-xs"
                    : "text-muted hover:text-fg hover:bg-raised/70",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Right: Single prominent Open Studio action */}
        <div className="hidden items-center md:flex">
          <Button asChild size="sm">
            <Link href="/studio">Open Studio</Link>
          </Button>
        </div>

        {/* Mobile menu toggle */}
        <div className="flex items-center gap-2 md:hidden">
          <Button asChild size="sm" className="h-8 px-3 text-xs">
            <Link href="/studio">Open Studio</Link>
          </Button>
          <button
            type="button"
            onClick={() => setMobileOpen((open) => !open)}
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            className="inline-flex h-8 w-8 items-center justify-center rounded-md text-fg hover:bg-raised"
          >
            {mobileOpen ? <X size={18} /> : <List size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile nav panel */}
      {mobileOpen && (
        <nav
          id="mobile-nav"
          aria-label="Mobile navigation"
          className={cn(
            "border-t border-line bg-canvas px-4 py-4 md:hidden",
            isStudio && "studio-theme",
          )}
        >
          <div className="space-y-1">
            {primaryNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                aria-current={isActive(pathname, item.href) ? "page" : undefined}
                className={cn(
                  "block rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  isActive(pathname, item.href)
                    ? "bg-surface text-fg font-semibold"
                    : "text-muted hover:text-fg hover:bg-raised",
                )}
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="my-3 border-t border-line pt-3">
            <p className="px-3 text-[11px] font-semibold uppercase tracking-wider text-faint">
              Information
            </p>
            <div className="mt-1 space-y-1">
              {secondaryNav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="block rounded-md px-3 py-1.5 text-xs text-muted hover:text-fg hover:bg-raised"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </nav>
      )}
    </header>
  );
}
