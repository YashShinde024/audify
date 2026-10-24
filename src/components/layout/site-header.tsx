"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  X,
  List,
  Waveform,
  ArrowRight,
  Sparkle,
  Compass,
  Sliders,
  Article,
  Question,
  EnvelopeSimple,
  Info,
  CaretDown,
} from "@phosphor-icons/react";
import { motion, AnimatePresence } from "motion/react";
import { primaryNav, secondaryNav } from "@/config/navigation";
import { Logo } from "./logo";
import { ThemeToggle } from "./theme-toggle";
import { cn } from "@/lib/utils";

const NAV_ICONS: Record<string, typeof Waveform> = {
  "/studio": Waveform,
  "/presets": Sparkle,
  "/effects": Sliders,
  "/how-it-works": Compass,
  "/about": Info,
  "/blog": Article,
  "/faq": Question,
  "/contact": EnvelopeSimple,
};

export function SiteHeader() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const drawerRef = useRef<HTMLDivElement>(null);
  const lastPathRef = useRef(pathname);

  const isActive = useCallback(
    (href: string) => pathname === href || (href !== "/" && pathname.startsWith(`${href}/`)),
    [pathname],
  );

  const [moreOpen, setMoreOpen] = useState(false);
  const moreRef = useRef<HTMLDivElement>(null);

  // Close more dropdown on outside click or Escape
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) {
        setMoreOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMoreOpen(false);
      }
    };
    if (moreOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [moreOpen]);

  // Track scroll position for subtle blur and shadow elevation
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 15;
      setScrolled((prev) => (prev !== isScrolled ? isScrolled : prev));
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close drawer on route change
  useEffect(() => {
    if (lastPathRef.current !== pathname) {
      lastPathRef.current = pathname;
      setDrawerOpen(false);
    }
  }, [pathname]);

  // Lock scroll and handle Escape key when mobile drawer is open
  useEffect(() => {
    if (!drawerOpen) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setDrawerOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [drawerOpen]);

  return (
    <>
      <header
        role="banner"
        className={cn(
          "sticky top-0 z-50 w-full transition-all duration-300",
          scrolled
            ? "border-b border-line/80 bg-canvas/90 backdrop-blur-md shadow-xs"
            : "border-b border-transparent bg-canvas/60 backdrop-blur-xs"
        )}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-3 sm:px-6 lg:px-8">
          {/* Left: Brand Emblem + Wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/"
              aria-label="Audify homepage"
              className="group relative inline-flex items-center rounded-lg py-1 px-1.5 hover:opacity-90 transition-opacity"
            >
              <Logo height={30} variant="adaptive" priority />
            </Link>
          </div>

          {/* Center: Dynamic Island Navigation Capsule (Desktop & Tablets 768px+) */}
          <nav
            aria-label="Main navigation"
            className="hidden md:flex items-center gap-1 rounded-full border border-line bg-surface/85 dark:bg-surface/90 px-1.5 py-1 backdrop-blur-md shadow-xs"
          >
            {primaryNav.map((item) => {
              const active = isActive(item.href);
              const Icon = NAV_ICONS[item.href] || Sparkle;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "relative px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-200",
                    active
                      ? "text-white font-semibold"
                      : "text-muted hover:text-fg hover:bg-black/5 dark:hover:bg-white/5"
                  )}
                >
                  {active && (
                    <motion.span
                      layoutId="island-active-pill"
                      className="absolute inset-0 rounded-full bg-wire-gradient shadow-xs z-0"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-1.5">
                    {item.label === "Studio" && (
                      <Icon size={13} className={active ? "text-white" : "text-primary"} weight="bold" />
                    )}
                    {item.label}
                  </span>
                </Link>
              );
            })}

            {/* "More" Dropdown Menu */}
            <div className="relative" ref={moreRef}>
              <button
                type="button"
                onClick={() => setMoreOpen((prev) => !prev)}
                aria-expanded={moreOpen}
                aria-haspopup="true"
                className={cn(
                  "relative px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 flex items-center gap-1 cursor-pointer",
                  secondaryNav.some((s) => isActive(s.href))
                    ? "text-primary font-semibold"
                    : "text-muted hover:text-fg hover:bg-black/5 dark:hover:bg-white/5"
                )}
              >
                <span>More</span>
                <CaretDown
                  size={11}
                  weight="bold"
                  className={cn("transition-transform duration-200", moreOpen && "rotate-180")}
                />
              </button>

              <AnimatePresence>
                {moreOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full mt-2 left-1/2 -translate-x-1/2 w-48 rounded-2xl border border-line-strong bg-surface/95 dark:bg-surface/95 p-1.5 shadow-2xl backdrop-blur-xl z-50 space-y-0.5"
                  >
                    {secondaryNav.map((sub) => {
                      const active = isActive(sub.href);
                      const SubIcon = NAV_ICONS[sub.href] || Sparkle;
                      return (
                        <Link
                          key={sub.href}
                          href={sub.href}
                          onClick={() => setMoreOpen(false)}
                          className={cn(
                            "flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium transition-colors",
                            active
                              ? "bg-primary text-white font-semibold"
                              : "text-muted hover:text-fg hover:bg-black/5 dark:hover:bg-white/10"
                          )}
                        >
                          <SubIcon size={14} className={active ? "text-white" : "text-primary"} weight="duotone" />
                          <span>{sub.label}</span>
                        </Link>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </nav>

          {/* Right: Controls & Fast Launch Studio CTA */}
          <div className="flex items-center gap-2">
            {/* Theme Toggle (Adapts Light & Dark Mode according to user choice) */}
            <ThemeToggle />

            {/* Tactile Studio Action CTA */}
            <Link
              href="/studio"
              className={cn(
                "group relative inline-flex items-center gap-1.5 rounded-full px-3.5 sm:px-4 py-1.5 sm:py-2 text-xs font-semibold text-white",
                "btn-gradient-rainbow shadow-[0_1px_3px_rgba(0,0,0,0.12),0_1px_2px_rgba(230,0,38,0.2)]",
                "cursor-pointer select-none"
              )}
            >
              <span className="hidden xs:inline">Open Studio</span>
              <span className="xs:hidden">Studio</span>
              <ArrowRight
                size={13}
                weight="bold"
                className="transition-transform group-hover:translate-x-1 duration-200"
              />
            </Link>

            {/* Mobile Menu Toggle Button */}
            <button
              type="button"
              onClick={() => setDrawerOpen((prev) => !prev)}
              aria-expanded={drawerOpen}
              aria-label={drawerOpen ? "Close menu" : "Open navigation menu"}
              className="flex md:hidden h-9 w-9 items-center justify-center rounded-full border border-line bg-surface text-muted hover:text-fg hover:border-primary/40 transition-colors cursor-pointer"
            >
              {drawerOpen ? <X size={18} weight="bold" /> : <List size={18} weight="bold" />}
            </button>
          </div>
        </div>
      </header>

      {/* Full-Screen Mobile Drawer with Backdrop Blur Overlay */}
      <AnimatePresence>
        {drawerOpen && (
          <div className="fixed inset-0 top-16 z-40 md:hidden">
            {/* Backdrop Dimmer */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setDrawerOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
            />

            {/* Drawer Content Card */}
            <motion.div
              ref={drawerRef}
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              role="dialog"
              aria-modal="true"
              aria-label="Mobile Navigation Menu"
              className="relative border-b border-line bg-surface/95 dark:bg-surface/95 px-5 py-6 shadow-xl backdrop-blur-md"
            >


              {/* Primary Nav List */}
              <div className="grid grid-cols-2 gap-2">
                {primaryNav.map((item) => {
                  const active = isActive(item.href);
                  const Icon = NAV_ICONS[item.href] || Sparkle;

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setDrawerOpen(false)}
                      className={cn(
                        "flex items-center gap-2.5 rounded-xl px-3.5 py-3 text-xs font-semibold transition-all",
                        active
                          ? "bg-primary text-white shadow-xs"
                          : "bg-surface hover:bg-raised text-fg border border-line hover:border-primary/40"
                      )}
                    >
                      <Icon size={15} weight={active ? "bold" : "regular"} className={active ? "text-white" : "text-primary"} />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </div>

              {/* Secondary Navigation Hubs */}
              <div className="mt-4 pt-3 border-t border-line">
                <p className="text-[10px] font-mono uppercase tracking-wider text-muted mb-2">
                  Explore More
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {secondaryNav.map((item) => {
                    const active = isActive(item.href);
                    const Icon = NAV_ICONS[item.href] || Sparkle;

                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setDrawerOpen(false)}
                        className={cn(
                          "flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium transition-all",
                          active
                            ? "bg-accent/15 text-accent font-semibold"
                            : "bg-surface/70 hover:bg-raised text-muted hover:text-fg border border-line"
                        )}
                      >
                        <Icon size={13} className="text-primary shrink-0" weight="duotone" />
                        <span className="truncate">{item.label}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>

              {/* Quick Presets shortcut row on mobile */}
              <div className="mt-5 pt-4 border-t border-line">
                <p className="text-[10px] font-mono uppercase tracking-wider text-muted mb-2.5">
                  Popular Standard Presets
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { slug: "slowed-reverb", label: "Slowed + Reverb" },
                    { slug: "nightcore", label: "Nightcore" },
                    { slug: "daycore", label: "Daycore" },
                    { slug: "8d-audio", label: "8D Audio" },
                    { slug: "bass-boost-heavy", label: "Bass Boost" },
                    { slug: "pitch-432hz", label: "432 Hz" },
                    { slug: "lofi-tape", label: "Lo-Fi Tape" },
                  ].map((preset) => (
                    <Link
                      key={preset.slug}
                      href={`/studio?preset=${preset.slug}`}
                      onClick={() => setDrawerOpen(false)}
                      className="rounded-full border border-line bg-canvas px-3 py-1 text-[11px] font-medium text-muted hover:text-fg hover:border-primary/40 transition-colors"
                    >
                      {preset.label}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Mobile Drawer Footer */}
              <div className="mt-5 pt-3.5 border-t border-line flex items-center justify-between text-[11px] text-muted">
                <span>Audify by Nyxen × Xpert Melody</span>
                <span className="font-mono text-primary font-medium">100% Client-Side DSP</span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
