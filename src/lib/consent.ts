import { useSyncExternalStore } from "react";

/**
 * Consent storage and reactivity for Audify's cookie/consent banner.
 *
 * Responsibilities:
 *   - Parse and validate the consent record in localStorage (`audify-cookie-consent`).
 *   - Enforce a consent version so a material policy change re-prompts consent.
 *   - Expose a reactive hook (`useConsent`) so advertising scripts, analytics
 *     front-ends, etc. can opt-in/opt-out live without page reloads.
 *
 * Design notes:
 *   - First-party localStorage only. No cookies are needed to remember the
 *     choice itself (localStorage is not sent to any server automatically).
 *   - The banner component owns the write surface via `saveConsent()`; this
 *     module is the read/reactive layer shared with ad gating code.
 */

/** Bump when a material change makes prior consent invalid (re-prompts banner). */
export const CONSENT_VERSION = 2;

export const CONSENT_STORAGE_KEY = "audify-cookie-consent";
const LEGACY_STORAGE_KEYS = ["audiomorph-cookie-consent"];

export type ConsentChoice = "all" | "reject" | "custom";

export interface ConsentRecord {
  necessary: true;
  analytics: boolean;
  functional: boolean;
  advertising: boolean;
  timestamp: number;
  version: number;
  choice: ConsentChoice;
}

export const DEFAULT_CONSENT: ConsentRecord = {
  necessary: true,
  analytics: false,
  functional: false,
  advertising: false,
  timestamp: 0,
  version: CONSENT_VERSION,
  choice: "reject",
};

/**
 * The record returned when no valid choice exists OR when the stored record is
 * from an older policy version. Advertising defaults to `false` everywhere —
 * optional categories are never preselected and are never treated as granted
 * implicitly.
 */
export const UNSET_CONSENT: ConsentRecord = {
  ...DEFAULT_CONSENT,
  timestamp: 0,
};

function parseRecord(raw: unknown): ConsentRecord | null {
  if (typeof raw !== "object" || raw === null) return null;
  const r = raw as Record<string, unknown>;
  return {
    necessary: true,
    analytics: Boolean(r.analytics),
    functional: Boolean(r.functional),
    advertising: Boolean(r.advertising),
    timestamp: Number(r.timestamp) || Date.now(),
    version: Number(r.version) || 1,
    choice:
      r.choice === "all" || r.choice === "reject" || r.choice === "custom"
        ? r.choice
        : "custom",
  };
}

/**
 * Reads the stored consent. Returns `UNSET_CONSENT` (advertising and all
 * optional categories false) when nothing is stored, storage is unreadable,
 * or the stored record predates the current `CONSENT_VERSION` — version bumps
 * deliberately re-trigger the banner instead of silently inheriting old opts.
 */
export function readConsent(): ConsentRecord {
  if (typeof window === "undefined") return UNSET_CONSENT;
  try {
    for (const legacy of LEGACY_STORAGE_KEYS) {
      try {
        if (window.localStorage.getItem(legacy) !== null) {
          window.localStorage.removeItem(legacy);
        }
      } catch {
        /* ignore */
      }
    }
    const raw = window.localStorage.getItem(CONSENT_STORAGE_KEY);
    if (raw === null) return UNSET_CONSENT;
    const record = parseRecord(JSON.parse(raw));
    if (record && record.version >= CONSENT_VERSION) return record;
    // Pre-v2 records lack the `advertising` category. Rather than assume it is
    // granted, fall through: the new category requires explicit consent.
    return UNSET_CONSENT;
  } catch {
    /* storage may be sandboxed or corrupted — fail closed, all optional off */
    return UNSET_CONSENT;
  }
}

/** Writes the consent record and notifies every subscriber. */
export function saveConsent(record: ConsentRecord): void {
  if (typeof window === "undefined") return;
  const normalized: ConsentRecord = { ...record, version: CONSENT_VERSION, necessary: true };
  try {
    window.localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(normalized));
  } catch {
    /* storage disabled — the in-memory state still gates this page view */
  }
  notifyConsentListeners(normalized);
}

type ConsentListener = () => void;
const listeners = new Set<ConsentListener>();
let cachedSnapshot: ConsentRecord | null = null;

function notifyConsentListeners(record: ConsentRecord) {
  cachedSnapshot = record;
  for (const listener of listeners) {
    try {
      listener();
    } catch {
      /* a broken subscriber must not block others */
    }
  }
}

function subscribe(listener: ConsentListener): () => void {
  listeners.add(listener);
  // Keep the snapshot coherent across tabs as well.
  const onStorage = (event: StorageEvent) => {
    if (event.key && event.key !== CONSENT_STORAGE_KEY) return;
    const next = readConsent();
    cachedSnapshot = next;
    listener();
    for (const other of listeners) {
      if (other !== listener) {
        try {
          other();
        } catch {
          /* ignore */
        }
      }
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

function getSnapshot(): ConsentRecord {
  if (cachedSnapshot === null) {
    cachedSnapshot = readConsent();
  }
  // Defense against direct localStorage writes bypassing saveConsent().
  const fresh = readConsent();
  if (
    fresh.choice !== cachedSnapshot.choice ||
    fresh.advertising !== cachedSnapshot.advertising ||
    fresh.analytics !== cachedSnapshot.analytics ||
    fresh.functional !== cachedSnapshot.functional ||
    fresh.timestamp !== cachedSnapshot.timestamp
  ) {
    cachedSnapshot = fresh;
  }
  return cachedSnapshot;
}

function getServerSnapshot(): ConsentRecord {
  // SSR and hydration render with all optional consent categories OFF; scripts
  // only appear after hydration confirms an explicit grant. This guarantees no
  // third-party tag ever executes during server rendering or on mismatch.
  return UNSET_CONSENT;
}

/** Opens the consent banner/preferences UI (listened for by CookieBanner). */
export function openCookiePreferences(): void {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("open-cookie-preferences"));
  }
}

/** Reactive consent snapshot for gating optional third-party scripts. */
export function useConsent(): ConsentRecord {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

/** Subscribe to consent changes (used by tests and non-React consumers). */
export function subscribeConsent(listener: () => void): () => void {
  return subscribe(listener);
}
