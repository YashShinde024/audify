/**
 * Adsterra Advertising Configuration
 * Central control for all ad placements across Audify.
 *
 * ## Enabling/Disabling
 * - Set `NEXT_PUBLIC_ADS_ENABLED=true` in your `.env` / `.env.production` to enable.
 * - Ads are disabled by default in development (`next dev`) and test environments.
 * - Set `NEXT_PUBLIC_ADS_ENABLED=false` (or omit) to disable everywhere.
 *
 * ## Supplied Adsterra Snippets
 * Two iframe-format slots are used, differentiated by viewport breakpoint:
 *   - Desktop leaderboard: 728×90 (key: 3efbea48694b2953dacbfc9353168b60)
 *   - Mobile banner:       320×50 (key: ed64605f8aa6fe56c820171921b8211b)
 *
 * A third snippet (async banner script with container ID) was also supplied, but
 * it uses a different integration mechanism (direct DOM container injection via
 * `data-cfasync` script). Since Adsterra's atOptions iframe and async-banner
 * snippets both claim the same viewport slot (728×90) and use different global
 * side effects, combining them would risk double-serving the same ad impression
 * or conflicting container IDs. We use only the iframe-format snippets, which
 * provide deterministic dimensions and isolated loading per slot.
 *
 * ## Snippet Coexistence Note
 * The two iframe snippets (728×90 and 320×50) use separate keys and script URLs,
 * making them safe to coexist as long as only ONE renders per viewport at a time.
 * We enforce this via CSS breakpoints — never rendering both simultaneously.
 */

/**
 * Whether ads are enabled globally.
 *
 * NEXT_PUBLIC_* variables are inlined into the client bundle at BUILD TIME, so
 * this flag can only change with a fresh production build, never at runtime.
 * A missing flag in production elicits a one-time diagnostic warning so an
 * operator checking the console can distinguish "disabled by configuration"
 * from "consent withheld" or "vendor failure" (see AdsterraSlot).
 */
let warnedDisabledInProduction = false;

/** Test hook: clears the once-per-session diagnostic flag (namespaced, no-op in app code). */
export function __resetAdsDiagnosticForTest(): void {
  warnedDisabledInProduction = false;
}

export function isAdsEnabled(): boolean {
  // Never in SSR (safety net — components are 'use client' anyway)
  if (typeof window === "undefined") return false;

  // Disabled in development and test environments
  if (process.env.NODE_ENV !== "production") return false;

  const enabled = process.env.NEXT_PUBLIC_ADS_ENABLED === "true";
  if (!enabled && !warnedDisabledInProduction) {
    warnedDisabledInProduction = true;
    console.warn(
      "[ads] Advertising is DISABLED in this production build: " +
        "NEXT_PUBLIC_ADS_ENABLED is not set to \"true\" (or was absent at build time). " +
        "Set it on the deployment platform and rebuild to enable Adsterra placements.",
    );
  }
  return enabled;
}

/**
 * Whether the "Advertising" consent category is honored before serving ads.
 *
 * Audify treats advertising display as part of the free service: ads render by
 * default in eligible production builds and the cookie banner exposes no
 * advertising toggle. Some vendors or jurisdictions, however, require explicit
 * consent before advertising technology runs (e.g., personalized ads in the
 * EEA/UK). Until the actual Adsterra integration is verified with the vendor,
 * this conservative switch keeps the consent gate available:
 *
 *   - Omitted or "false" (default): ad display is not consent-gated.
 *   - "true": the stored "advertising" consent must be granted before any
 *     Adsterra script loads (previous behavior).
 *
 * It is a build-time flag like NEXT_PUBLIC_ADS_ENABLED and must be set to
 * "true" by the operator when a legal/vendor gate is confirmed — not invented
 * or assumed absent.
 */
export function isAdsConsentRequired(): boolean {
  return process.env.NEXT_PUBLIC_ADS_CONSENT_REQUIRED === "true";
}

/**
 * Adsterra slot configuration.
 * Each slot uses the iframe format with its own unique key and script URL.
 * `atOptions` is set per-slot inside an isolated <script> to avoid global conflicts.
 */
export interface AdsterraSlotConfig {
  /** Unique Adsterra publisher key for this slot. */
  key: string;
  /** iframe format (always "iframe" for our integration). */
  format: "iframe";
  /** Rendered ad width in pixels. */
  width: number;
  /** Rendered ad height in pixels. */
  height: number;
  /** Adsterra script URL that reads `atOptions` and injects the iframe. */
  scriptSrc: string;
}

/** Desktop leaderboard: 728×90 */
/** Breakpoint (px) at which the 728×90 leaderboard is used instead of the 320×50 banner. */
export const DESKTOP_AD_BREAKPOINT = 768;

export const ADSTERRA_DESKTOP: AdsterraSlotConfig = {
  key: "3efbea48694b2953dacbfc9353168b60",
  format: "iframe",
  width: 728,
  height: 90,
  scriptSrc: "https://bauval.org/22/3efbea48694b2953dacbfc9353168b60",
};

/** Mobile banner: 320×50 */
export const ADSTERRA_MOBILE: AdsterraSlotConfig = {
  key: "ed64605f8aa6fe56c820171921b8211b",
  format: "iframe",
  width: 320,
  height: 50,
  scriptSrc: "https://bauval.org/22/ed64605f8aa6fe56c820171921b8211b",
};
