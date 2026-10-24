"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import {
  Cookie,
  ShieldCheck,
  X,
  SlidersHorizontal,
  LockKey,
  Info,
} from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";

export const COOKIE_CONSENT_KEY = "audify-cookie-consent";
const LEGACY_COOKIE_KEY = "audiomorph-cookie-consent";

export interface CookiePreferences {
  necessary: boolean; // Always true
  analytics: boolean;
  functional: boolean;
  timestamp: number;
  choice: "all" | "reject" | "custom";
}

const DEFAULT_PREFERENCES: CookiePreferences = {
  necessary: true,
  analytics: false,
  functional: false,
  timestamp: 0,
  choice: "reject",
};

export function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>(() => {
    if (typeof window === "undefined") return DEFAULT_PREFERENCES;
    try {
      const stored = localStorage.getItem(COOKIE_CONSENT_KEY) || localStorage.getItem(LEGACY_COOKIE_KEY);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (typeof parsed === "object" && parsed !== null) {
            return {
              necessary: true,
              analytics: Boolean(parsed.analytics),
              functional: Boolean(parsed.functional),
              timestamp: Number(parsed.timestamp) || Date.now(),
              choice: parsed.choice || "custom",
            };
          }
        } catch {
          const isAll = stored === "all";
          return {
            necessary: true,
            analytics: isAll,
            functional: isAll,
            timestamp: Date.now(),
            choice: isAll ? "all" : "reject",
          };
        }
      }
    } catch {
      // LocalStorage unavailable in strict sandbox
    }
    return DEFAULT_PREFERENCES;
  });
  const bannerRef = useRef<HTMLElement>(null);

  // Initialize and check for stored consent
  useEffect(() => {
    try {
      const stored = localStorage.getItem(COOKIE_CONSENT_KEY) || localStorage.getItem(LEGACY_COOKIE_KEY);
      if (!stored) {
        // First visit: Delay entry slightly so first paint & audio graph settle smoothly
        const timer = setTimeout(() => setIsVisible(true), 1200);
        return () => clearTimeout(timer);
      }
    } catch {
      // LocalStorage unavailable in strict sandbox
    }
  }, []);

  // Listen for global custom events to reopen preferences from the footer or legal pages
  useEffect(() => {
    const handleOpen = () => {
      setIsVisible(true);
      setShowPreferences(true);
    };

    window.addEventListener("open-cookie-preferences", handleOpen);
    window.addEventListener("audify-open-cookie-preferences", handleOpen);

    return () => {
      window.removeEventListener("open-cookie-preferences", handleOpen);
      window.removeEventListener("audify-open-cookie-preferences", handleOpen);
    };
  }, []);

  const saveConsent = useCallback((updated: CookiePreferences) => {
    try {
      localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(updated));
    } catch {
      // ignore
    }
    setPreferences(updated);
    setIsVisible(false);
    setShowPreferences(false);
  }, []);

  const handleAcceptAll = () => {
    saveConsent({
      necessary: true,
      analytics: true,
      functional: true,
      timestamp: Date.now(),
      choice: "all",
    });
  };

  const handleRejectOptional = () => {
    saveConsent({
      necessary: true,
      analytics: false,
      functional: false,
      timestamp: Date.now(),
      choice: "reject",
    });
  };

  const handleSaveCustom = () => {
    saveConsent({
      ...preferences,
      necessary: true,
      timestamp: Date.now(),
      choice: "custom",
    });
  };

  if (!isVisible) return null;

  return (
    <aside
      ref={bannerRef}
      role="region"
      aria-label="Privacy and Cookie Preferences"
      className="fixed bottom-0 inset-x-0 w-full z-50 border-t border-line/80 bg-surface/95 dark:bg-[#111016]/95 backdrop-blur-xl shadow-2xl transition-all pb-[max(0.75rem,env(safe-area-inset-bottom))]"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4 sm:py-5">
        {!showPreferences ? (
          /* ── Main Compact Horizontal Bar ────────────────────────────── */
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-start gap-3.5 max-w-3xl min-w-0">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 border border-primary/20 text-primary">
                <Cookie size={20} weight="duotone" />
              </span>
              <div className="space-y-1">
                <h3 className="text-sm font-semibold text-fg tracking-tight">
                  Your privacy, your choice
                </h3>
                <p className="text-xs text-muted leading-relaxed">
                  We use essential storage to keep Audify working. If optional analytics or other non-essential
                  technologies are enabled, you can choose whether to allow them. Read our{" "}
                  <Link
                    href="/privacy"
                    className="text-primary underline underline-offset-2 hover:text-primary-hover font-medium"
                  >
                    Privacy Policy
                  </Link>{" "}
                  to learn more.
                </p>
              </div>
            </div>

            {/* Actions: Distinct, balanced, accessible */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 shrink-0 pt-1 lg:pt-0">
              <button
                type="button"
                onClick={() => setShowPreferences(true)}
                className="btn-secondary inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-xl border border-line text-muted hover:text-fg hover:bg-canvas-subtle cursor-pointer"
              >
                <SlidersHorizontal size={14} />
                <span>Preferences</span>
              </button>

              <button
                type="button"
                onClick={handleRejectOptional}
                className="btn-outline inline-flex items-center justify-center px-4 py-2 text-xs font-medium rounded-xl border border-line-strong text-fg hover:bg-canvas-subtle cursor-pointer"
              >
                Reject optional
              </button>

              <Button
                size="sm"
                onClick={handleAcceptAll}
                className="rounded-xl px-5 text-xs font-semibold cursor-pointer"
              >
                Accept all
              </Button>
            </div>
          </div>
        ) : (
          /* ── Granular Preferences Panel ─────────────────────────────── */
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="cookie-preferences-title"
            className="space-y-4 max-h-[80vh] overflow-y-auto pr-1"
          >
            <div className="flex items-center justify-between border-b border-line pb-3">
              <div className="flex items-center gap-2.5">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <SlidersHorizontal size={18} weight="duotone" />
                </span>
                <div>
                  <h3 id="cookie-preferences-title" className="text-sm font-semibold text-fg">
                    Privacy & Storage Preferences
                  </h3>
                  <p className="text-[11px] text-faint">
                    Configure which local browser storage technologies you authorize Audify to use.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowPreferences(false)}
                aria-label="Back to banner"
                className="btn-icon p-1.5 rounded-lg text-muted hover:text-fg hover:bg-canvas-subtle cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* Categories */}
            <div className="grid gap-3 sm:grid-cols-3">
              {/* Category 1: Strictly Necessary */}
              <div className="rounded-xl border border-line/80 bg-canvas-subtle p-3.5 space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-semibold text-fg flex items-center gap-1.5">
                    <LockKey size={14} className="text-primary" />
                    <span>Strictly Necessary</span>
                  </span>
                  <span className="inline-flex items-center gap-1 text-[10px] font-mono font-medium text-primary px-2 py-0.5 rounded-full bg-primary/10 border border-primary/20">
                    Always active
                  </span>
                </div>
                <p className="text-[11px] text-muted leading-relaxed">
                  Required for core workstation UI, dark/light theme persistence (<code>audify-theme</code>), and saving
                  your consent choices.
                </p>
              </div>

              {/* Category 2: Analytics & Performance */}
              <div className="rounded-xl border border-line/80 bg-canvas-subtle p-3.5 space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <label htmlFor="pref-analytics" className="text-xs font-semibold text-fg cursor-pointer">
                    Analytics & Diagnostics
                  </label>
                  <input
                    id="pref-analytics"
                    type="checkbox"
                    checked={preferences.analytics}
                    onChange={(e) =>
                      setPreferences((prev) => ({
                        ...prev,
                        analytics: e.target.checked,
                      }))
                    }
                    className="h-4 w-4 rounded border-line text-primary focus:ring-primary cursor-pointer accent-primary"
                  />
                </div>
                <p className="text-[11px] text-muted leading-relaxed">
                  Anonymous Web Audio compatibility statistics and render performance telemetry to diagnose DSP crashes.
                  Currently opt-in.
                </p>
              </div>

              {/* Category 3: Workstation Enhancements */}
              <div className="rounded-xl border border-line/80 bg-canvas-subtle p-3.5 space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <label htmlFor="pref-functional" className="text-xs font-semibold text-fg cursor-pointer">
                    Workstation Cache
                  </label>
                  <input
                    id="pref-functional"
                    type="checkbox"
                    checked={preferences.functional}
                    onChange={(e) =>
                      setPreferences((prev) => ({
                        ...prev,
                        functional: e.target.checked,
                      }))
                    }
                    className="h-4 w-4 rounded border-line text-primary focus:ring-primary cursor-pointer accent-primary"
                  />
                </div>
                <p className="text-[11px] text-muted leading-relaxed">
                  Saves custom DSP presets, slider positions, and frequency curves between studio sessions in your browser.
                </p>
              </div>
            </div>

            {/* Note on Zero Server Audio Transmission */}
            <div className="rounded-xl border border-primary/20 bg-primary/5 p-3 flex items-start gap-2.5 text-[11px] text-muted leading-normal">
              <Info size={16} className="text-primary shrink-0 mt-0.5" />
              <span>
                <strong>Zero Audio Transmission:</strong> Regardless of your cookie choices, your audio files and rendered
                waveforms are processed 100% locally in your client device memory and are never transmitted to any server.
              </span>
            </div>

            {/* Preference Actions */}
            <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-3 pt-2 border-t border-line">
              <Link
                href="/privacy#cookies-storage"
                className="text-xs text-primary hover:underline inline-flex items-center gap-1 font-medium"
              >
                <ShieldCheck size={14} />
                <span>View full storage disclosures in Privacy Policy</span>
              </Link>

              <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end">
                <button
                  type="button"
                  onClick={handleRejectOptional}
                  className="btn-secondary px-3 py-1.5 text-xs rounded-xl border border-line text-muted hover:text-fg hover:bg-canvas-subtle cursor-pointer"
                >
                  Reject optional
                </button>
                <button
                  type="button"
                  onClick={handleAcceptAll}
                  className="btn-outline px-3 py-1.5 text-xs rounded-xl border border-line-strong text-fg hover:bg-canvas-subtle cursor-pointer"
                >
                  Accept all
                </button>
                <Button
                  size="sm"
                  onClick={handleSaveCustom}
                  className="rounded-xl px-4 text-xs font-semibold cursor-pointer"
                >
                  Save preferences
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
