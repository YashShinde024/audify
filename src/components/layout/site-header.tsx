"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  X,
  List,
  Sparkle,
  Cpu,
  BookOpenText,
  SlidersHorizontal,
  ArrowRight,
  Waveform,
  Play,
  CaretDown,
  ArrowSquareOut,
  Circle,
  Compass,
} from "@phosphor-icons/react";
import { primaryNav, secondaryNav } from "@/config/navigation";
import { nyxenApps, nyxenStudio } from "@/config/nyxen-apps";
import { Logo } from "./logo";
import { ThemeToggle } from "./theme-toggle";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { IconProps } from "@phosphor-icons/react";

type NavIcon = React.ComponentType<{ size?: number; className?: string; weight?: IconProps["weight"] }>;

const NAV_ICON_MAP: Record<string, NavIcon> = {
  "/studio": Waveform,
  "/presets": Sparkle,
  "/effects": Cpu,
  "/blog": BookOpenText,
  "/how-it-works": SlidersHorizontal,
};

/** Animated spectrum meter shown above the active link. */
function EqualizerMeter({ active }: { active: boolean }) {
  return (
    <span aria-hidden="true" className="pointer-events-none absolute -top-[7px] left-1/2 flex h-2.5 -translate-x-1/2 items-end gap-[2px]">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className={cn(
            "w-[2px] rounded-full bg-gradient-to-t from-ember via-violet to-purple nx-eq-bar",
            active ? "opacity-100" : "opacity-0 transition-opacity duration-200",
          )}
          style={{ height: `${8 + i * 2}px`, animationDelay: `${i * 0.15}s` }}
        />
      ))}
    </span>
  );
}

function isActive(pathname: string, href: string) {
  if (href === "/studio") return pathname === "/studio";
  if (href === "/") return pathname === "/";
  return pathname.startsWith(href);
}

export function SiteHeader() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const aboutRef = useRef<HTMLLIElement>(null);
  const isStudio = pathname === "/studio";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    // Defer initial sync off the synchronous effect pass to satisfy lint.
    const raf = requestAnimationFrame(onScroll);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  // Close the About suite on outside click / Escape / route change
  useEffect(() => {
    if (!aboutOpen) return;
    const onPointerDown = (e: PointerEvent) => {
      if (aboutRef.current && !aboutRef.current.contains(e.target as Node)) {
        setAboutOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setAboutOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [aboutOpen]);

  const handleSheen = (e: React.MouseEvent) => {
    const el = e.currentTarget as HTMLElement;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--sheen-x", `${e.clientX - rect.left}px`);
  };

  return (
    <div className="sticky top-0 z-50 w-full px-3 py-2.5 sm:px-6 sm:py-3">
      {/* Ember Console Bar */}
      <header
        className={cn(
          "nx-corner-brackets relative mx-auto max-w-7xl rounded-2xl transition-all duration-500",
          "border border-line-strong/70 bg-surface/90 backdrop-blur-2xl",
          "shadow-[0_10px_40px_rgba(37,35,43,0.07)] dark:shadow-[0_18px_60px_rgba(0,0,0,0.7)]",
          scrolled && "bg-surface/95 shadow-[0_14px_50px_rgba(37,35,43,0.1)] dark:shadow-[0_20px_70px_rgba(0,0,0,0.8)]",
          isStudio && "studio-theme bg-surface/95 border-line-strong",
        )}
      >
        {/* Crimson hairline — breathes in dark mode */}
        <div
          aria-hidden="true"
          className={cn(
            "nx-ember-line absolute inset-x-10 -top-px h-px",
            !isStudio && "dark:opacity-100 opacity-40",
          )}
        />
        {/* Ambient red ember bloom behind the bar (dark mode only) */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -inset-x-6 -bottom-6 h-14 rounded-b-[3rem] opacity-0 dark:opacity-100 bg-[radial-gradient(60%_100%_at_50%_0%,rgb(255_77_61/0.07),transparent_70%)] blur-md transition-opacity duration-700"
        />

        <div className="flex h-14 items-center justify-between px-3 sm:px-5">
          {/* 1 · Brand + live DSP chip */}
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="group flex select-none items-center py-1 transition-transform focus-visible:outline-none active:scale-[0.98]"
              aria-label="Svaraya homepage"
            >
              <Logo
                height={28}
                variant="by-nyxen"
                className="transition-all duration-300 group-hover:opacity-90 group-hover:drop-shadow-[0_0_14px_rgb(255_77_61/0.25)]"
              />
              <span className="sr-only">Svaraya — Sound, reimagined. By Nyxen</span>
            </Link>

            <div className="hidden select-none items-center gap-1.5 rounded-full border border-line bg-raised/70 px-2.5 py-0.5 font-mono text-[10px] text-muted xl:flex">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-ember opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-ember" />
              </span>
              <span>32-Bit Float · Local DSP</span>
            </div>
          </div>

          {/* 2 · Spectrum console nav (desktop) */}
          <nav aria-label="Main navigation" className="hidden items-center lg:flex">
            <ul className="flex items-center">
              {primaryNav.map((item) => {
                if (item.href === "/about") {
                  return (
                    <li key={item.href} ref={aboutRef} className="relative">
                      <button
                        type="button"
                        onClick={() => setAboutOpen((v) => !v)}
                        onMouseMove={handleSheen}
                        aria-expanded={aboutOpen}
                        aria-haspopup="true"
                        className={cn(
                          "nx-nav-sheen relative flex cursor-pointer select-none items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-medium transition-colors",
                          aboutOpen || pathname.startsWith("/about")
                            ? "text-fg font-semibold"
                            : "text-muted hover:text-fg",
                        )}
                      >
                        <Compass
                          size={14}
                          weight={aboutOpen || pathname.startsWith("/about") ? "duotone" : "regular"}
                          className={aboutOpen || pathname.startsWith("/about") ? "text-ember" : "text-muted"}
                        />
                        <span>About</span>
                        <CaretDown
                          size={10}
                          weight="bold"
                          className={cn(
                            "transition-transform duration-300",
                            aboutOpen && "rotate-180",
                          )}
                        />
                        <EqualizerMeter active={aboutOpen || pathname.startsWith("/about")} />
                      </button>
                    </li>
                  );
                }

                const active = isActive(pathname, item.href);
                const Icon = NAV_ICON_MAP[item.href] || Sparkle;

                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      onMouseMove={handleSheen}
                      className={cn(
                        "nx-nav-sheen relative flex select-none items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-medium transition-colors",
                        active ? "text-fg font-semibold" : "text-muted hover:text-fg",
                      )}
                    >
                      <Icon
                        size={14}
                        weight={active ? "duotone" : "regular"}
                        className={active ? "text-violet" : "text-muted transition-colors"}
                      />
                      <span>{item.label}</span>
                      <EqualizerMeter active={active} />
                      {/* Active ember underline */}
                      {active && (
                        <motion.span
                          layoutId="nx-console-underline"
                          className="absolute inset-x-2.5 -bottom-[5px] h-[2px] rounded-full bg-gradient-to-r from-ember via-violet to-purple"
                          transition={{ type: "spring", stiffness: 420, damping: 32 }}
                        />
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* 3 · Theme transport + Studio CTA + mobile hamburger */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            <ThemeToggle />

            <Button
              asChild
              size="sm"
              className={cn(
                "group relative select-none overflow-hidden rounded-full px-3.5 text-xs font-semibold sm:px-4",
                "bg-gradient-to-r from-violet via-purple to-ember text-white",
                "transition-all duration-200 hover:scale-[1.02] hover:shadow-[0_6px_24px_rgb(255_77_61/0.35)] active:scale-[0.98]",
              )}
            >
              <Link href="/studio" className="flex items-center gap-1.5">
                <Play size={12} weight="fill" className="text-white/90 transition-transform group-hover:scale-110" />
                <span className="hidden sm:inline">Launch Studio</span>
                <span className="sm:hidden">Studio</span>
                <ArrowRight size={12} weight="bold" className="transition-transform group-hover:translate-x-0.5" />
              </Link>
            </Button>

            <button
              type="button"
              onClick={() => setMobileOpen((open) => !open)}
              aria-expanded={mobileOpen}
              aria-controls="mobile-nav"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              className="inline-flex h-9 w-9 cursor-pointer select-none items-center justify-center rounded-full border border-line bg-surface text-fg transition-colors hover:bg-raised lg:hidden"
            >
              {mobileOpen ? <X size={18} /> : <List size={18} />}
            </button>
          </div>
        </div>

        {/* ── Nyxen Suite mega-panel (About) ───────────────────────────── */}
        <AnimatePresence>
          {aboutOpen && (
            <motion.div
              id="nyxen-suite-panel"
              role="region"
              aria-label="Nyxen product suite"
              initial={{ opacity: 0, y: -8, scale: 0.985 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.99 }}
              transition={{ duration: 0.22, ease: [0.2, 0.8, 0.2, 1] }}
              className="absolute left-1/2 top-full z-10 mt-3 w-[min(46rem,calc(100vw-2rem))] origin-top -translate-x-1/2"
            >
              <div className="overflow-hidden rounded-2xl border border-line-strong/70 bg-surface shadow-[0_30px_80px_rgba(37,35,43,0.16)] dark:bg-surface/95 dark:shadow-[0_36px_100px_rgba(0,0,0,0.8)] backdrop-blur-2xl">
                {/* Panel header — by-nyxen wordmark */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line bg-raised/40 px-5 py-4">
                  <a
                    href={nyxenStudio.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-3"
                  >
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-line bg-surface shadow-xs transition-transform duration-300 group-hover:scale-105 group-hover:rotate-3">
                      <Image
                        src={nyxenStudio.logo}
                        alt="Nyxen Studio"
                        width={30}
                        height={30}
                        className="h-auto max-w-full object-contain"
                      />
                    </span>
                    <span>
                      <Logo height={13} variant="by-nyxen" className="opacity-90" />
                      <span className="mt-0.5 block font-mono text-[10px] uppercase tracking-wider text-muted">
                        {nyxenStudio.motto}
                      </span>
                    </span>
                  </a>

                  <div className="flex items-center gap-2">
                    <Link
                      href="/about"
                      className="inline-flex items-center gap-1.5 rounded-full border border-line bg-surface px-3 py-1.5 text-[11px] font-medium text-muted transition-colors hover:border-violet/40 hover:text-fg"
                    >
                      <Compass size={12} />
                      About Svaraya
                    </Link>
                    <a
                      href={nyxenStudio.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-full bg-fg px-3 py-1.5 text-[11px] font-semibold text-surface transition-opacity hover:opacity-85"
                    >
                      nyxen.in
                      <ArrowSquareOut size={12} weight="bold" />
                    </a>
                  </div>
                </div>

                {/* App cards */}
                <div className="grid gap-2.5 p-4 sm:grid-cols-3">
                  {nyxenApps.map((app, i) => (
                    <motion.a
                      key={app.name}
                      href={app.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.06 + i * 0.07, duration: 0.3, ease: "easeOut" }}
                      className="group relative flex flex-col rounded-xl border border-line bg-raised/30 p-4 transition-all duration-300 hover:-translate-y-1 hover:border-ember/35 hover:bg-surface hover:shadow-[0_14px_34px_rgba(37,35,43,0.12),0_0_0_1px_rgb(255_77_61/0.12)] dark:hover:shadow-[0_18px_44px_rgba(0,0,0,0.6),0_0_22px_rgb(255_77_61/0.08)]"
                    >
                      <div className="mb-3 flex items-start justify-between">
                        <span className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-lg border border-line bg-surface p-1.5 transition-transform duration-300 group-hover:scale-110 group-hover:drop-shadow-[0_0_10px_rgb(255_77_61/0.3)]">
                          <Image
                            src={app.logo}
                            alt={`${app.name} logo`}
                            width={40}
                            height={40}
                            className="h-auto max-w-full object-contain"
                          />
                        </span>
                        <span className="inline-flex items-center gap-1 rounded-full border border-line px-2 py-0.5 text-[10px] font-medium text-muted">
                          <Circle
                            size={5}
                            weight="fill"
                            className={app.status === "Live" ? "text-ember" : "text-muted"}
                          />
                          {app.status}
                        </span>
                      </div>

                      <span className="font-mono text-[9px] uppercase tracking-widest text-faint">
                        {app.category}
                      </span>
                      <span className="mt-0.5 text-sm font-semibold text-fg">{app.name}</span>
                      <span className="mt-0.5 text-[11px] font-medium text-ember/90 dark:text-ember">
                        {app.tagline}
                      </span>
                      <p className="mt-2 text-[11px] leading-relaxed text-muted">
                        {app.description}
                      </p>

                      <div className="mt-3 flex flex-wrap gap-1 border-t border-line pt-2.5">
                        {app.features.map((f) => (
                          <span
                            key={f}
                            className="rounded-md bg-deep/60 px-1.5 py-0.5 text-[10px] text-muted transition-colors group-hover:text-fg/80"
                          >
                            {f}
                          </span>
                        ))}
                      </div>

                      <span className="mt-3 inline-flex items-center gap-1 text-[11px] font-semibold text-violet opacity-0 transition-all duration-200 group-hover:opacity-100">
                        Visit platform
                        <ArrowSquareOut size={11} weight="bold" className="transition-transform group-hover:translate-x-0.5" />
                      </span>
                    </motion.a>
                  ))}
                </div>

                <div className="border-t border-line bg-raised/40 px-5 py-2.5 text-center text-[11px] text-muted">
                  <p>
                    <span className="font-medium text-fg/80">Svaraya</span> joins{" "}
                    {nyxenApps.map((a, i) => (
                      <span key={a.name}>
                        <a
                          href={a.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-medium text-violet underline-offset-2 hover:underline"
                        >
                          {a.name}
                        </a>
                        {i < nyxenApps.length - 1 ? " · " : ""}
                      </span>
                    ))}{" "}
                    in the studio family — built lightweight, privacy-first.
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Mobile console menu ──────────────────────────────────────── */}
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
                {primaryNav.map((item, i) => {
                  const active = isActive(pathname, item.href) || (item.href === "/about" && pathname === "/about");
                  const Icon = item.href === "/about" ? Compass : (NAV_ICON_MAP[item.href] || Sparkle);

                  return (
                    <motion.div
                      key={item.href}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.04, duration: 0.25 }}
                    >
                      <Link
                        href={item.href}
                        aria-current={active ? "page" : undefined}
                        className={cn(
                          "flex items-center gap-2 rounded-xl border p-2.5 text-xs font-medium transition-colors",
                          active
                            ? "border-ember/40 bg-surface text-fg font-semibold shadow-xs"
                            : "border-line bg-surface/60 text-muted hover:text-fg hover:bg-raised",
                        )}
                      >
                        <Icon size={16} weight={active ? "duotone" : "regular"} className={active ? "text-ember" : "text-muted"} />
                        <span>{item.label}</span>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>

              {/* Nyxen suite strip in mobile menu */}
              <div className="mt-4 border-t border-line pt-3">
                <p className="mb-2 px-1 font-mono text-[10px] uppercase tracking-wider text-faint">
                  Nyxen Suite
                </p>
                <div className="space-y-1.5">
                  {nyxenApps.map((app) => (
                    <a
                      key={app.name}
                      href={app.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2.5 rounded-xl border border-line bg-raised/30 p-2 transition-colors hover:border-ember/30"
                    >
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-line bg-surface p-1">
                        <Image src={app.logo} alt={`${app.name} logo`} width={32} height={32} className="h-auto max-w-full object-contain" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-[11px] font-semibold text-fg">{app.name}</span>
                        <span className="block truncate text-[10px] text-muted">{app.tagline}</span>
                      </span>
                      <ArrowSquareOut size={13} className="shrink-0 text-muted" />
                    </a>
                  ))}
                </div>
              </div>

              {/* Quick preset shortcuts */}
              <div className="mt-4 border-t border-line pt-3">
                <p className="mb-2 px-1 font-mono text-[10px] uppercase tracking-wider text-faint">
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
                      className="rounded-lg border border-line bg-raised/50 px-2.5 py-1 text-[11px] text-muted transition-colors hover:border-violet/30 hover:text-violet"
                    >
                      {p.label}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Secondary documentation links */}
              <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-line pt-3 text-xs text-muted">
                {secondaryNav.map((item) => (
                  <Link key={item.href} href={item.href} className="transition-colors hover:text-fg">
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

/** Internal helpers removed — apps are external, linked directly. */
