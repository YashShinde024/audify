"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Cookie, ShieldCheck, X } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";

const COOKIE_CONSENT_KEY = "audify-cookie-consent";
const LEGACY_COOKIE_KEY = "audiomorph-cookie-consent";

export function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    try {
      const consent = localStorage.getItem(COOKIE_CONSENT_KEY) || localStorage.getItem(LEGACY_COOKIE_KEY);
      if (!consent) {
        // Small delay so it animates in gracefully after initial page load
        const timer = setTimeout(() => setIsVisible(true), 1200);
        return () => clearTimeout(timer);
      }
    } catch {
      // ignore
    }
  }, []);

  const handleConsent = (choice: "all" | "essential") => {
    try {
      localStorage.setItem(COOKIE_CONSENT_KEY, choice);
    } catch {
      // ignore
    }
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <aside
      role="region"
      aria-label="Privacy & Cookie Preferences"
      className="fixed bottom-4 right-4 left-4 sm:left-auto sm:max-w-md z-50 animate-in fade-in slide-in-from-bottom-5 duration-300"
    >
      <div className="surface-card glass-panel p-5 rounded-2xl border border-line/70 shadow-2xl backdrop-blur-2xl space-y-3.5 relative">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 border border-primary/25 text-primary">
              <Cookie size={20} weight="duotone" />
            </span>
            <div>
              <h3 className="text-xs font-semibold text-fg">Privacy & Cookie Choices</h3>
              <p className="text-[11px] text-faint font-mono">Audify Client DSP</p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => handleConsent("essential")}
            aria-label="Dismiss cookie notice"
            className="text-muted hover:text-fg p-1 rounded-lg transition-colors cursor-pointer"
          >
            <X size={14} weight="bold" />
          </button>
        </div>

        <p className="text-xs text-muted leading-relaxed">
          Audify processes 100% of your audio locally inside your browser memory. We use essential local storage
          to save your theme and sidebar preferences. No personal audio is ever uploaded or tracked.
        </p>

        <div className="flex items-center justify-between gap-2 pt-1 border-t border-line/50">
          <Link
            href="/privacy"
            className="text-[11px] text-primary hover:underline font-medium inline-flex items-center gap-1"
          >
            <ShieldCheck size={13} weight="duotone" />
            <span>Privacy Policy</span>
          </Link>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleConsent("essential")}
              className="px-2.5 py-1 text-xs rounded-lg border border-line/70 text-muted hover:text-fg hover:bg-surface/60 transition-colors"
            >
              Essential Only
            </button>
            <Button
              size="sm"
              onClick={() => handleConsent("all")}
              className="rounded-lg text-xs font-semibold bg-primary hover:bg-primary-hover text-white shadow-xs"
            >
              Accept All
            </Button>
          </div>
        </div>
      </div>
    </aside>
  );
}
