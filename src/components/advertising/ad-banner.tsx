"use client";

import { isAdsEnabled, ADSTERRA_DESKTOP, ADSTERRA_MOBILE } from "@/config/ads";
import { AdsterraSlot, useMediaMatch, DESKTOP_AD_QUERY } from "./adsterra-slot";

interface AdBannerProps {
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
 * crossing the breakpoint remounts the correct format and the other one.
 *
 * When ads are disabled (development, missing env var), falls back to a
 * neutral placeholder that reserves the same vertical space.
 */
export function AdBanner({ note, className }: AdBannerProps) {
  const enabled = isAdsEnabled();
  const isDesktop = useMediaMatch(DESKTOP_AD_QUERY);

  if (!enabled) {
    // Render a minimal reserved-space placeholder in non-production.
    // This preserves layout during development without loading third-party scripts.
    // Placeholder width follows the actual viewport so the reserved area
    // mirrors what production would show.
    const w = isDesktop ? 728 : 320;
    const h = isDesktop ? 90 : 50;
    return (
      <aside
        aria-label="Advertising slot (disabled)"
        className={className}
      >
        <div className="flex flex-col items-center justify-center">
          <span className="mb-1.5 font-mono text-[10px] uppercase tracking-wider text-faint">
            Advertisement
          </span>
          <div
            className="flex items-center justify-center rounded-lg border border-dashed border-line/50 bg-surface/30"
            style={{ width: w, maxWidth: "100%", height: h }}
          >
            <span className="font-mono text-[10px] text-faint">Ad Slot · {w}×{h} · Disabled</span>
          </div>
          {note && (
            <p className="mt-2 text-center font-mono text-[11px] text-faint">{note}</p>
          )}
        </div>
      </aside>
    );
  }

  return (
    <aside aria-label="Sponsor advertisement" className={className}>
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
