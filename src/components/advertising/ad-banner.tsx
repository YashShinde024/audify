"use client";

import { isAdsEnabled, ADSTERRA_DESKTOP, ADSTERRA_MOBILE } from "@/config/ads";
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
 * When ads are disabled (development, missing env var, consent withheld, or slot disabled),
 * falls back to a neutral placeholder that reserves the exact same vertical space to prevent CLS.
 */
export function AdBanner({ id, disabled = false, note, className }: AdBannerProps) {
  const consent = useConsent();
  // Triple gate: slot-level toggle, site-wide env rollout switch, and user cookie consent.
  // All three must be true. The consent read is reactive (useSyncExternalStore),
  // so granting, changing, or withdrawing the "Advertising" category mounts/unmounts
  // the third-party slot in the same render cycle.
  const enabled = !disabled && isAdsEnabled() && consent.advertising;
  const isDesktop = useMediaMatch(DESKTOP_AD_QUERY);

  if (!enabled) {
    const w = isDesktop ? 728 : 320;
    const h = isDesktop ? 90 : 50;
    const reason = disabled ? "slot-disabled" : isAdsEnabled() ? "consent" : "disabled";
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
