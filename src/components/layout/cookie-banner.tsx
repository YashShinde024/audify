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
import { SoundSettings } from "@/components/ui/sound-settings";
import {
  CONSENT_VERSION,
  useConsent,
  saveConsent as persistConsent,
  type ConsentRecord,
  type ConsentChoice,
} from "@/lib/consent";

/** Kept for backwards compatibility with any future consumers. */
export const COOKIE_CONSENT_KEY = "audify-cookie-consent";

export type { ConsentRecord as CookiePreferences };
export const DEFAULT_PREFERENCES = { necessary: true, analytics: false, functional: false };

// `advertising` is retained for record compatibility but is NOT toggleable in
// the UI and does not gate ad display under default configuration
// (see src/config/ads.ts → isAdsConsentRequired).
const UNSET_PREFS: ConsentRecord = {
  necessary: true,
  analytics: false,
  functional: false,
  advertising: false,
  timestamp: 0,
  version: CONSENT_VERSION,
  choice: "reject",
};

export function CookieBanner() {
  // Reactive consent snapshot (useSyncExternalStore). The banner never mirrors
  // the store into local state via an effect; persistence state flows one way
  // and this component renders from it directly.
  const consent = useConsent();
  const hasCurrentValidChoice =
    consent.timestamp > 0 && consent.version >= CONSENT_VERSION;

  const [isVisible, setIsVisible] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  // Local draft for the preferences panel checkboxes; seeded from the store
  // only when the panel is opened (an event handler, not an effect).
  const [editDraft, setEditDraft] = useState<ConsentRecord>(UNSET_PREFS);
  const bannerRef = useRef<HTMLElement>(null);

  // Show the banner once on mount only when no valid, current-version choice
  // exists (version bumps re-prompt consent) and the user has not dismissed it
  // for this browser session. Delayed so first paint and audio graph settle smoothly.
  useEffect(() => {
    if (hasCurrentValidChoice) {
      // Valid saved choice: keep the banner hidden for this session.
      return;
    }
    try {
      if (typeof window !== "undefined" && window.sessionStorage.getItem("audify-consent-dismissed") === "true") {
        return;
      }
    } catch {
      /* ignore storage access restrictions */
    }
    const timer = window.setTimeout(() => setIsVisible(true), 1200);
    return () => window.clearTimeout(timer);
  }, [hasCurrentValidChoice]);

  /** Soft-dismiss the banner for this session without forcing a local cache write */
  const handleDismiss = useCallback(() => {
    try {
      if (typeof window !== "undefined") {
        window.sessionStorage.setItem("audify-consent-dismissed", "true");
      }
    } catch {
      /* ignore */
    }
    setIsVisible(false);
    setShowPreferences(false);
  }, []);

  /** Opens the preferences panel, seeding the checkbox draft from the store. */
  const openPreferences = useCallback(() => {
    setEditDraft(hasCurrentValidChoice ? consent : UNSET_PREFS);
    setIsVisible(true);
    setShowPreferences(true);
  }, [hasCurrentValidChoice, consent]);

  // Footer / legal-page reopen control (dispatches a custom event).
  useEffect(() => {
    window.addEventListener("open-cookie-preferences", openPreferences);
    window.addEventListener("audify-open-cookie-preferences", openPreferences);

    return () => {
      window.removeEventListener("open-cookie-preferences", openPreferences);
      window.removeEventListener("audify-open-cookie-preferences", openPreferences);
    };
  }, [openPreferences]);

  // Advertising display is not a toggleable preference. The record keeps an
  // `advertising` value exclusively for the conservative consent-gating mode
  // (NEXT_PUBLIC_ADS_CONSENT_REQUIRED=true): only an explicit "Accept all"
  // click grants it there, and rejecting/custom preferences always save false.
  const saveConsent = useCallback((updated: ConsentRecord) => {
    persistConsent(updated);
    setEditDraft(updated);
    setIsVisible(false);
    setShowPreferences(false);
  }, []);

  const handleAcceptAll = () => {
    saveConsent({
      necessary: true,
      analytics: true,
      functional: true,
      // Explicit "Accept all" click: may grant the legacy advertising category
      // used only by the conservative consent-gating mode.
      advertising: true,
      timestamp: Date.now(),
      version: CONSENT_VERSION,
      choice: "all" as ConsentChoice,
    });
  };

  const handleRejectOptional = () => {
    saveConsent({
      necessary: true,
      analytics: false,
      functional: false,
      advertising: false,
      timestamp: Date.now(),
      version: CONSENT_VERSION,
      choice: "reject",
    });
  };

  const handleSaveCustom = () => {
    saveConsent({
      ...editDraft,
      necessary: true,
      timestamp: dateNow(),
      version: CONSENT_VERSION,
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
          <div className="relative flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between pr-8 lg:pr-10">
            {/* Top-Right Dismiss Icon */}
            <button
              type="button"
              onClick={handleDismiss}
              aria-label="Dismiss cookie notice for this session"
              className="absolute right-0 top-0 p-1.5 rounded-lg text-muted hover:text-fg hover:bg-canvas-subtle transition-colors cursor-pointer"
            >
              <X size={16} />
            </button>

            <div className="flex items-start gap-3.5 max-w-3xl min-w-0">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 border border-primary/20 text-primary">
                <Cookie size={20} weight="duotone" />
              </span>
              <div className="space-y-1">
                <h3 className="text-sm font-semibold text-fg tracking-tight">
                  Your privacy, your choice
                </h3>
                <p className="text-xs text-muted leading-relaxed">
                  Advertisements support Audify&apos;s free audio workstation — audio files are processed
                  100% locally in your browser and are never uploaded. Optional cookies (analytics, workstation cache)
                  are completely optional. Read our{" "}
                  <Link
                    href="/privacy"
                    className="text-primary underline underline-offset-2 hover:text-primary-hover font-medium"
                  >
                    Privacy Policy
                  </Link>{" "}
                  for details.
                </p>
              </div>
            </div>

            {/* Actions: Distinct, balanced, accessible */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 shrink-0 pt-1 lg:pt-0">
              <button
                type="button"
                onClick={handleDismiss}
                className="inline-flex items-center justify-center px-3 py-2 text-xs font-medium rounded-xl border border-line/60 text-muted hover:text-fg hover:bg-canvas-subtle transition-colors cursor-pointer"
                title="Dismiss without saving cookies to browser cache"
              >
                Dismiss
              </button>

              <button
                type="button"
                onClick={() => setShowPreferences(true)}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-xl border border-line text-muted hover:text-fg hover:bg-canvas-subtle transition-colors cursor-pointer"
              >
                <SlidersHorizontal size={14} />
                <span>Preferences</span>
              </button>

              <button
                type="button"
                onClick={handleRejectOptional}
                className="inline-flex items-center justify-center px-4 py-2 text-xs font-medium rounded-xl border border-line-strong text-fg hover:bg-canvas-subtle transition-colors cursor-pointer"
              >
                Reject optional
              </button>

              <Button
                size="sm"
                sweep="offset-b"
                onClick={handleAcceptAll}
                className="rounded-xl px-5 text-xs font-semibold cursor-pointer shadow-glow-wire"
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
                    Privacy &amp; Storage Preferences
                  </h3>
                  <p className="text-[11px] text-faint">
                    Configure which storage technologies and third-party scripts you authorize Audify
                    to use (consent policy v{CONSENT_VERSION}).
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowPreferences(false)}
                aria-label="Back to banner"
                className="p-1.5 rounded-lg text-muted hover:text-fg hover:bg-canvas-subtle transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* Categories */}
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
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
                  Required for core workstation UI, dark/light theme persistence (
                  <code>audify-theme</code>), and saving your consent choices.
                </p>
              </div>

              {/* Category 2: Analytics & Performance */}
              <div className="rounded-xl border border-line/80 bg-canvas-subtle p-3.5 space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <label htmlFor="pref-analytics" className="text-xs font-semibold text-fg cursor-pointer">
                    Analytics &amp; Diagnostics
                  </label>
                  <input
                    id="pref-analytics"
                    type="checkbox"
                    checked={editDraft.analytics}
                    onChange={(e) =>
                      setEditDraft((prev) => ({
                        ...prev,
                        analytics: e.target.checked,
                      }))
                    }
                    className="h-4 w-4 rounded border-line text-primary focus:ring-primary cursor-pointer accent-primary"
                  />
                </div>
                <p className="text-[11px] text-muted leading-relaxed">
                  Anonymous Web Audio compatibility statistics and render performance telemetry to
                  diagnose DSP crashes. Currently opt-in.
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
                    checked={editDraft.functional}
                    onChange={(e) =>
                      setEditDraft((prev) => ({
                        ...prev,
                        functional: e.target.checked,
                      }))
                    }
                    className="h-4 w-4 rounded border-line text-primary focus:ring-primary cursor-pointer accent-primary"
                  />
                </div>
                <p className="text-[11px] text-muted leading-relaxed">
                  Saves custom DSP presets, slider positions, and frequency curves between studio
                  sessions in your browser.
                </p>
              </div>

              {/* Audio Notification Setting */}
              <SoundSettings />

              {/* Category 3: Advertising display notice (non-toggleable) */}
              <div className="rounded-xl border border-line/80 bg-canvas-subtle p-3.5 space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-semibold text-fg flex items-center gap-1.5">
                    <Cookie size={14} className="text-primary" />
                    <span>Advertising</span>
                  </span>
                  <span className="inline-flex items-center gap-1 text-[10px] font-mono font-medium text-primary px-2 py-0.5 rounded-full bg-primary/10 border border-primary/20">
                    Part of service
                  </span>
                </div>
                <p className="text-[11px] text-muted leading-relaxed">
                  Third-party sponsor placements (Adsterra) support Audify&apos;s free tools and
                  display as part of the free service — not managed as an optional cookie.
                  Your audio files are never sent to the ad network.
                </p>
              </div>
            </div>

            {/* Note on Zero Server Audio Transmission */}
            <div className="rounded-xl border border-primary/20 bg-primary/5 p-3 flex items-start gap-2.5 text-[11px] text-muted leading-normal">
              <Info size={16} className="text-primary shrink-0 mt-0.5" />
              <span>
                <strong>Zero Audio Transmission:</strong> Regardless of your cookie choices, your
                audio files and rendered waveforms are processed locally in your client device
                memory and are never transmitted to any server, including to advertising networks.
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
                  onClick={handleDismiss}
                  className="px-3 py-1.5 text-xs rounded-xl border border-line/60 text-muted hover:text-fg hover:bg-canvas-subtle transition-colors cursor-pointer"
                  title="Dismiss without saving"
                >
                  Dismiss
                </button>
                <button
                  type="button"
                  onClick={handleRejectOptional}
                  className="px-3 py-1.5 text-xs rounded-xl border border-line text-muted hover:text-fg hover:bg-canvas-subtle transition-colors cursor-pointer"
                >
                  Reject optional
                </button>
                <button
                  type="button"
                  onClick={handleAcceptAll}
                  className="px-3 py-1.5 text-xs rounded-xl border border-line-strong text-fg hover:bg-canvas-subtle transition-colors cursor-pointer"
                >
                  Accept all
                </button>
                <Button
                  size="sm"
                  sweep="offset-b"
                  onClick={handleSaveCustom}
                  className="rounded-xl px-4 text-xs font-semibold cursor-pointer shadow-glow-wire"
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

function dateNow(): number {
  return typeof window !== "undefined" ? Date.now() : 0;
}
