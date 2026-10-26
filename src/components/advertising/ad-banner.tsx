"use client";

import { isAdsEnabled, isAdsConsentRequired, ADSTERRA_DESKTOP, ADSTERRA_MOBILE } from "@/config/ads";
import { useConsent } from "@/lib/consent";
import { AdsterraSlot, useMediaMatch, DESKTOP_AD_QUERY } from "./adsterra-slot";

interface AdBannerProps {
  /**
   * Stable placement identifier for attribution and performance audit
   * (e.g., "home-below-hero", "tools-bottom", "about-partnership").
   */
  id?: string;
  /**
   * Placement-level disable toggle. When true, this slot is disabled
   * independently of global settings.
   */
  disabled?: boolean;
  /**
   * Optional note displayed below the ad (e.g., "Audify is free thanks to sponsors").
   * Only shown when ads are enabled and rendering.
   */
  note?: string;
  /** Additional CSS class on the outer wrapper */
  className?: string;
}

/**
 * Responsive Adsterra banner that shows:
 *   - 728×90 desktop leaderboard on viewports ≥ 768px
 *   - 320×50 mobile banner on viewports < 768px
 *
 * Breakpoint selection is gated in JS via `matchMedia`, not CSS `display`.
 * A CSS-hidden Adsterra container still loads its script and consumes an
 * impression, so only the slot matching the current viewport is ever mounted;
 * crossing the breakpoint remounts the correct format and tears down the other one.
 *
 * When ads are disabled (development, missing env var, a conservative
 * consent gate where NEXT_PUBLIC_ADS_CONSENT_REQUIRED=true, or slot disabled),
 * falls back to a neutral placeholder that reserves the exact same vertical
 * space to prevent CLS.
 */
export function AdBanner({ id, disabled = false, note, className }: AdBannerProps) {
  const consent = useConsent();
  // Advertising display is part of the free service: it renders by default in
  // eligible production builds and is controlled by the site-level
  // NEXT_PUBLIC_ADS_ENABLED kill switch, not by the cookie banner. Optional
  // tracking consent (analytics/functional) remains user-controlled elsewhere.
  // Legacy gate: when a confirmed vendor/jurisdiction requirement makes consent
  // necessary (NEXT_PUBLIC_ADS_CONSENT_REQUIRED=true), the stored "advertising"
  // choice is honored again; the gate is reactive, so a consent change in that
  // mode mounts/unmounts the third-party slot in the same render cycle.
  const consentGate = isAdsConsentRequired() ? consent.advertising : true;
  const enabled = !disabled && isAdsEnabled() && consentGate;
  const isDesktop = useMediaMatch(DESKTOP_AD_QUERY);

  if (!enabled) {
    const w = isDesktop ? 728 : 320;
    const h = isDesktop ? 90 : 50;
    const reason = disabled
      ? "slot-disabled"
      : isAdsEnabled()
        ? isAdsConsentRequired()
          ? "consent"
          : "disabled"
        : "disabled";
    return (
      <aside
        aria-label="Advertising slot (disabled)"
        className={className}
        data-placement-id={id}
      >
        <div className="flex flex-col items-center justify-center">
          <span className="mb-1.5 font-mono text-[10px] uppercase tracking-wider text-faint">
            Advertisement
          </span>
          <div
            className="flex items-center justify-center rounded-lg border border-dashed border-line/50 bg-surface/30"
            style={{ width: w, maxWidth: "100%", height: h }}
          >
            <span className="font-mono text-[10px] text-faint">
              Ad Slot · {w}×{h} · {reason === "consent" ? "Awaiting consent" : "Disabled"}
            </span>
          </div>
          {note && (
            <p className="mt-2 text-center font-mono text-[11px] text-faint">{note}</p>
          )}
        </div>
      </aside>
    );
  }

  return (
    <aside
      aria-label="Sponsor advertisement"
      className={className}
      data-placement-id={id}
    >
      <div className="flex flex-col items-center justify-center">
        <span className="mb-1.5 font-mono text-[10px] uppercase tracking-wider text-faint">
          Advertisement
        </span>
        {isDesktop ? (
          <AdsterraSlot config={ADSTERRA_DESKTOP} />
        ) : (
          <AdsterraSlot config={ADSTERRA_MOBILE} />
        )}
        {note && (
          <p className="mt-2 text-center font-mono text-[11px] text-faint">{note}</p>
        )}
      </div>
    </aside>
  );
}
