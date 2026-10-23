"use client";

import { useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Faders,
  X,
  Sparkle,
  Cpu,
  YoutubeLogo,
  EnvelopeSimple,
  BookOpen,
  Waveform,
  ArrowsLeftRight,
  SpeakerHigh,
  ClockCountdown,
  Question,
  Info,
  House,
  PushPin,
  PushPinSlash,
  DotsSixVertical,
  ArrowUpRight,
} from "@phosphor-icons/react";
import { Logo } from "./logo";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import {
  useSidebar,
  DEFAULT_SIDEBAR_WIDTH,
  MIN_SIDEBAR_WIDTH,
  MAX_SIDEBAR_WIDTH,
} from "./sidebar-context";

export function StudioSidebar() {
  const pathname = usePathname();
  const {
    isOpen,
    isDocked,
    width,
    setWidth,
    isResizing,
    setIsResizing,
    closeSidebar,
    toggleDock,
  } = useSidebar();

  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const isDraggingRef = useRef(false);

  // Resize drag handler
  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      isDraggingRef.current = true;
      setIsResizing(true);

      const onMouseMove = (moveEvent: MouseEvent) => {
        if (!isDraggingRef.current) return;
        const newWidth = Math.max(
          MIN_SIDEBAR_WIDTH,
          Math.min(MAX_SIDEBAR_WIDTH, moveEvent.clientX)
        );
        setWidth(newWidth);
      };

      const onMouseUp = () => {
        isDraggingRef.current = false;
        setIsResizing(false);
        window.removeEventListener("mousemove", onMouseMove);
        window.removeEventListener("mouseup", onMouseUp);
      };

      window.addEventListener("mousemove", onMouseMove);
      window.addEventListener("mouseup", onMouseUp);
    },
    [setIsResizing, setWidth]
  );

  // Double click resets width
  const handleDoubleClick = useCallback(() => {
    setWidth(DEFAULT_SIDEBAR_WIDTH);
  }, [setWidth]);

  // Close on Escape key when open as an overlay
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeSidebar();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, closeSidebar]);

  // Lock scroll only when mobile overlay is active
  useEffect(() => {
    if (isOpen && !isDocked) {
      const original = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = original;
      };
    }
  }, [isOpen, isDocked]);

  // Auto-close overlay on navigation
  useEffect(() => {
    closeSidebar();
  }, [pathname, closeSidebar]);

  const isActive = (href: string) => pathname === href;

  return (
    <>
      {/* Mobile/Floating Overlay Backdrop (only when not docked) */}
      {isOpen && (
        <div
          aria-hidden="true"
          onClick={closeSidebar}
          className={cn(
            "fixed inset-0 z-[100] bg-canvas/70 backdrop-blur-md transition-opacity duration-300",
            isDocked ? "lg:hidden" : ""
          )}
        />
      )}

      {/* Studio Rack Chassis */}
      <aside
        aria-label="Studio Console Navigation Sidebar"
        style={{
          width: isDocked && typeof window !== "undefined" && window.innerWidth >= 1024 ? `${width}px` : undefined,
        }}
        className={cn(
          "fixed left-0 top-0 bottom-0 z-[105] flex h-[100dvh] flex-col select-none",
          "border-r border-line/70 bg-surface/90 dark:bg-canvas/90 backdrop-blur-2xl shadow-xl",
          isResizing ? "transition-none select-none" : "transition-transform duration-300 ease-out",
          // Visibility handling:
          isDocked
            ? "translate-x-0 lg:z-30 w-72 max-w-[85vw]"
            : isOpen
              ? "translate-x-0 w-72 max-w-[85vw]"
              : "-translate-x-full w-72 max-w-[85vw]"
        )}
      >
        {/* Top Header of the Studio Rack */}
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-line/60 px-4">
          <div className="flex items-center gap-2">
            <Link href="/" onClick={closeSidebar} className="flex items-center">
              <Logo height={26} variant="by-nyxen" showSubtitle={false} />
            </Link>
            <span className="rounded-full bg-primary/10 border border-primary/25 px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider text-primary font-semibold">
              Rack
            </span>
          </div>

          <div className="flex items-center gap-1">
            {/* Dock/Pin Toggle button for desktop */}
            <button
              type="button"
              onClick={toggleDock}
              aria-label={isDocked ? "Collapse sidebar" : "Pin sidebar to layout"}
              title={isDocked ? "Collapse sidebar to navbar (⌘K)" : "Pin sidebar docked to layout (⌘K)"}
              className="hidden lg:inline-flex h-8 w-8 items-center justify-center rounded-lg border border-line/60 bg-surface/70 text-muted hover:text-fg hover:bg-raised transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
            >
              {isDocked ? (
                <PushPinSlash size={15} weight="duotone" />
              ) : (
                <PushPin size={15} weight="duotone" />
              )}
            </button>

            {/* Close button for overlay mode */}
            <button
              ref={closeBtnRef}
              type="button"
              onClick={closeSidebar}
              aria-label="Close studio sidebar"
              className={cn(
                "inline-flex h-8 w-8 items-center justify-center rounded-lg border border-line/60 bg-surface/70 text-fg hover:bg-raised transition-colors",
                isDocked ? "lg:hidden" : ""
              )}
            >
              <X size={15} weight="bold" />
            </button>
          </div>
        </div>

        {/* Scrollable Navigation Body */}
        <div className="flex-1 overflow-y-auto px-3.5 py-4 space-y-5">
          {/* Section 1: Main Workspaces */}
          <div>
            <p className="px-2 text-[10px] font-mono uppercase tracking-widest text-faint mb-2">
              Workspaces & Core
            </p>
            <ul className="space-y-1">
              <li>
                <Link
                  href="/"
                  className={cn(
                    "flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium transition-colors",
                    isActive("/")
                      ? "bg-primary/10 text-primary font-semibold border border-primary/25"
                      : "text-muted hover:text-fg hover:bg-surface/70"
                  )}
                >
                  <House size={16} weight={isActive("/") ? "fill" : "regular"} />
                  <span>Home</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/studio"
                  className={cn(
                    "flex items-center justify-between rounded-xl px-3 py-2 text-xs font-medium transition-colors",
                    isActive("/studio")
                      ? "bg-primary text-white font-semibold shadow-xs"
                      : "text-fg bg-raised/70 hover:bg-raised border border-line/60"
                  )}
                >
                  <span className="flex items-center gap-2.5">
                    <Faders size={16} weight="bold" className={isActive("/studio") ? "text-white" : "text-primary"} />
                    <span>Studio Workspace</span>
                  </span>
                  <span className="rounded bg-black/10 dark:bg-white/10 px-1.5 py-0.5 text-[9px] font-mono">
                    Live DSP
                  </span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Section 2: Quick Jump to Popular Presets */}
          <div>
            <div className="flex items-center justify-between px-2 mb-2">
              <p className="text-[10px] font-mono uppercase tracking-widest text-faint">
                Direct DSP Presets
              </p>
              <Link href="/presets" className="text-[10px] text-primary hover:underline">
                View all 36+
              </Link>
            </div>
            <ul className="space-y-1">
              {[
                { id: "slowed-reverb", label: "Slowed + Reverb", icon: ClockCountdown },
                { id: "nightcore", label: "Nightcore", icon: Sparkle },
                { id: "8d-audio", label: "8D Audio Orbit", icon: ArrowsLeftRight },
                { id: "underwater", label: "Underwater Muffle", icon: Waveform },
                { id: "bass-boost-mod", label: "Bass Booster (+7dB)", icon: SpeakerHigh },
              ].map((item) => (
                <li key={item.id}>
                  <Link
                    href={`/studio?preset=${item.id}`}
                    className="flex items-center justify-between rounded-xl px-3 py-1.5 text-xs text-muted hover:text-fg hover:bg-surface/70 border border-transparent hover:border-line/60 transition-all group"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <item.icon size={14} className="text-primary shrink-0" weight="duotone" />
                      <span className="truncate group-hover:text-fg">{item.label}</span>
                    </div>
                    <span className="text-[10px] font-mono text-faint group-hover:text-primary shrink-0">
                      Load
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Section 3: Platform & Architecture */}
          <div>
            <p className="px-2 text-[10px] font-mono uppercase tracking-widest text-faint mb-2">
              Platform & Guides
            </p>
            <ul className="space-y-1">
              {[
                { href: "/presets", label: "Presets & Tools Matrix", icon: Sparkle },
                { href: "/effects", label: "DSP Effects Directory", icon: Faders },
                { href: "/how-it-works", label: "Zero-Server Architecture", icon: Cpu },
                { href: "/blog", label: "Audio Production Guides", icon: BookOpen },
                { href: "/faq", label: "FAQ & Sound Engine", icon: Question },
                { href: "/about", label: "About Nyxen & Xpert Melody", icon: Info },
              ].map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium transition-colors",
                      isActive(item.href)
                        ? "bg-primary/10 text-primary font-semibold border border-primary/25"
                        : "text-muted hover:text-fg hover:bg-surface/70"
                    )}
                  >
                    <item.icon size={15} className="text-muted shrink-0" weight={isActive(item.href) ? "bold" : "regular"} />
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Section 4: Creators & Contact */}
          <div>
            <p className="px-2 text-[10px] font-mono uppercase tracking-widest text-faint mb-2">
              Creators & Dispatch
            </p>
            <ul className="space-y-1">
              <li>
                <Link
                  href="/contact"
                  className={cn(
                    "flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium transition-colors",
                    isActive("/contact")
                      ? "bg-primary/10 text-primary font-semibold border border-primary/25"
                      : "text-muted hover:text-fg hover:bg-surface/70"
                  )}
                >
                  <EnvelopeSimple size={15} className="text-primary shrink-0" weight="duotone" />
                  <span>Contact & Dispatch</span>
                </Link>
              </li>
              <li>
                <a
                  href={siteConfig.youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between rounded-xl px-3 py-2 text-xs text-muted hover:text-red-500 hover:bg-surface/70 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <YoutubeLogo size={15} weight="fill" className="text-red-500 shrink-0" />
                    <span>Xpert Melody YouTube</span>
                  </span>
                  <span className="inline-flex items-center gap-0.5 text-[10px] text-faint">
                    <span>Channel</span>
                    <ArrowUpRight size={11} />
                  </span>
                </a>
              </li>
              <li>
                <a
                  href="https://nyxen.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between rounded-xl px-3 py-2 text-xs text-muted hover:text-primary hover:bg-surface/70 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <Cpu size={15} weight="duotone" className="text-primary shrink-0" />
                    <span>Nyxen.in Ecosystem</span>
                  </span>
                  <span className="inline-flex items-center gap-0.5 text-[10px] text-faint">
                    <span>Portal</span>
                    <ArrowUpRight size={11} />
                  </span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Console Chassis Status Bar */}
        <div className="border-t border-line/60 bg-surface/50 dark:bg-canvas/50 p-3.5">
          <div className="flex items-center justify-between text-[11px] font-mono mb-1.5">
            <span className="flex items-center gap-1.5 text-fg font-medium">
              <span className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgb(16_185_129_/_0.6)]" />
              Web Audio DSP
            </span>
            <span className="text-emerald-500 font-semibold text-[10px]">Online · 0ms</span>
          </div>

          <div className="flex items-center justify-between text-[10px] text-faint pt-1.5 border-t border-line/50">
            <span>Nyxen × Xpert Melody</span>
            <span>Zero Uploads</span>
          </div>
        </div>

        {/* Desktop Resizable Drag Handle */}
        {isDocked && (
          <div
            onMouseDown={handleMouseDown}
            onDoubleClick={handleDoubleClick}
            role="separator"
            aria-orientation="vertical"
            aria-label="Resize sidebar width"
            title="Drag to resize sidebar · Double-click to reset"
            className={cn(
              "hidden lg:flex absolute right-0 top-0 bottom-0 w-2.5 cursor-col-resize items-center justify-center",
              "group hover:bg-primary/20 transition-colors z-20",
              isResizing ? "bg-primary/30" : ""
            )}
          >
            <div className="h-10 w-1 rounded-full bg-line/60 group-hover:bg-primary transition-colors flex items-center justify-center">
              <DotsSixVertical size={10} className="text-faint group-hover:text-primary transition-colors" />
            </div>
          </div>
        )}
      </aside>
    </>
  );
}
