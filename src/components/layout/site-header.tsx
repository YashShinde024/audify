"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  X,
  List,
  Faders,
  Sparkle,
  Cpu,
  BookOpenText,
  SlidersHorizontal,
  Compass,
  ArrowRight,
  Waveform,
  Play,
  Circle,
} from "@phosphor-icons/react";
import { primaryNav, secondaryNav } from "@/config/navigation";
import { Logo } from "./logo";
import { ThemeToggle } from "./theme-toggle";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const NAV_ICON_MAP: Record<string, React.ComponentType<{ size?: number; className?: string; weight?: any }>> = {
  "/studio": Waveform,
  "/presets": Sparkle,
  "/effects": Cpu,
  "/blog": BookOpenText,
  "/how-it-works": SlidersHorizontal,
  "/about": Compass,
};

function isActive(pathname: string, href: string) {
  if (href === "/studio") return pathname === "/studio";
  if (href === "/") return pathname === "/";
  return pathname.startsWith(href);
}

export function SiteHeader() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const isStudio = pathname === "/studio";

  return (
    <div className="sticky top-0 z-50 w-full px-3 py-2.5 sm:px-6 sm:py-3 transition-colors">
      {/* Unique Floating Acoustic Soundrail Bar */}
      <header
        className={cn(
          "relative mx-auto max-w-7xl rounded-2xl sm:rounded-full transition-all duration-300",
          "border border-line-strong/60 bg-surface/85 backdrop-blur-2xl",
          "shadow-[0_8px_32px_rgba(37,35,43,0.06)] dark:shadow-[0_12px_40px_rgba(0,0,0,0.55)]",
          isStudio && "studio-theme bg-surface/90 border-line-strong",
        )}
      >
        {/* Animated Sonic Resonance Rail (Subtle top light gradient) */}
        <div
          aria-hidden="true"
          className="absolute inset-x-8 -top-px h-px bg-gradient-to-r from-transparent via-violet/50 to-transparent"
        />

        <div className="flex h-14 items-center justify-between px-3 sm:px-5">
          {/* 1. Left: Brand typography logo + live DSP status */}
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="group flex items-center select-none py-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet rounded-lg transition-transform active:scale-[0.98]"
              aria-label="Svaraya homepage"
              onClick={() => setMobileOpen(false)}
            >
              <Logo
                height={28}
                variant="by-nyxen"
                className="transition-opacity group-hover:opacity-90"
              />
              <span className="sr-only">Svaraya — Sound, reimagined. By Nyxen</span>
            </Link>

            {/* Micro Live Hardware Status Indicator (Desktop only) */}
            <div className="hidden xl:flex items-center gap-1.5 rounded-full border border-line bg-raised/70 px-2.5 py-0.5 text-[10px] font-mono text-muted select-none">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              <span>32-Bit Float · Local DSP</span>
            </div>
          </div>

          {/* 2. Center: Unique Floating Audio Capsule Nav */}
          <nav
            aria-label="Main navigation"
            className="hidden items-center rounded-full border border-line/60 bg-raised/60 p-1 backdrop-blur-md lg:flex"
          >
            {primaryNav.map((item) => {
              const active = isActive(pathname, item.href);
              const Icon = NAV_ICON_MAP[item.href] || Sparkle;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "relative flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-all select-none",
                    active
                      ? "text-fg font-semibold shadow-xs"
                      : "text-muted hover:text-fg hover:bg-white/[0.04]",
                  )}
                >
                  {/* Motion Active Pill with soft ambient violet glow */}
                  {active && (
                    <motion.span
                      layoutId="acoustic-nav-active-pill"
                      className="absolute inset-0 rounded-full bg-surface border border-line-strong shadow-[0_2px_10px_rgba(118,87,214,0.12)]"
                      transition={{ type: "spring", stiffness: 420, damping: 32 }}
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-1.5">
                    <Icon
                      size={14}
                      weight={active ? "duotone" : "regular"}
                      className={cn(active ? "text-violet" : "text-muted transition-colors group-hover:text-fg")}
                    />
                    <span>{item.label}</span>
                  </span>
                </Link>
              );
            })}
          </nav>

          {/* 3. Right: Theme Switcher & Master Transport Studio Button */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Theme Toggle (Sun / Moon) */}
            <ThemeToggle />

            {/* Launch Studio Action Button */}
            <Button
              asChild
              size="sm"
              className={cn(
                "relative group overflow-hidden rounded-full px-3.5 sm:px-4 text-xs font-semibold select-none",
                "bg-gradient-to-r from-violet to-purple text-white shadow-sm hover:shadow-violet/30",
                "transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]",
              )}
            >
              <Link href="/studio" className="flex items-center gap-1.5">
                <Play size={12} weight="fill" className="text-white/90 transition-transform group-hover:scale-110" />
                <span className="hidden sm:inline">Launch Studio</span>
                <span className="sm:hidden">Studio</span>
                <ArrowRight size={12} weight="bold" className="transition-transform group-hover:translate-x-0.5" />
              </Link>
            </Button>

            {/* Mobile menu hamburger toggle */}
            <button
              type="button"
              onClick={() => setMobileOpen((open) => !open)}
              aria-expanded={mobileOpen}
              aria-controls="mobile-nav"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-line bg-surface text-fg hover:bg-raised transition-colors lg:hidden cursor-pointer"
            >
              {mobileOpen ? <X size={18} /> : <List size={18} />}
            </button>
          </div>
        </div>

        {/* Mobile Acoustic Console Menu Panel */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.nav
              id="mobile-nav"
              aria-label="Mobile navigation"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.22, ease: "easeInOut" }}
              className="overflow-hidden border-t border-line/70 px-4 py-4 lg:hidden"
            >
              <div className="grid grid-cols-2 gap-2">
                {primaryNav.map((item) => {
                  const active = isActive(pathname, item.href);
                  const Icon = NAV_ICON_MAP[item.href] || Sparkle;

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "flex items-center gap-2 rounded-xl p-2.5 text-xs font-medium transition-colors border",
                        active
                          ? "border-violet/40 bg-surface text-violet font-semibold shadow-xs"
                          : "border-line bg-surface/60 text-muted hover:text-fg hover:bg-raised",
                      )}
                    >
                      <Icon size={16} weight={active ? "duotone" : "regular"} className={active ? "text-violet" : "text-muted"} />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </div>

              {/* Quick Preset Shortcuts in Mobile Navigation */}
              <div className="mt-4 pt-3 border-t border-line">
                <p className="px-1 text-[10px] font-mono uppercase tracking-wider text-faint mb-2">
                  Popular Presets
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { label: "Slowed + Reverb", href: "/blog/slowed-reverb" },
                    { label: "8D Audio", href: "/blog/8d-audio" },
                    { label: "432 Hz Sacred", href: "/blog/432hz-tuning" },
                    { label: "Nightcore", href: "/blog/nightcore-daycore" },
                  ].map((p) => (
                    <Link
                      key={p.href}
                      href={p.href}
                      onClick={() => setMobileOpen(false)}
                      className="rounded-lg border border-line bg-raised/50 px-2.5 py-1 text-[11px] text-muted hover:text-violet hover:border-violet/30 transition-colors"
                    >
                      {p.label}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Secondary Documentation Links */}
              <div className="mt-4 pt-3 border-t border-line flex flex-wrap items-center gap-3 text-xs text-muted">
                {secondaryNav.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className="hover:text-fg transition-colors"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </header>
    </div>
  );
}
