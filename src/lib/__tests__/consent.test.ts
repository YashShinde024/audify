import { describe, it, expect, beforeEach, afterEach } from "vitest";
import {
  CONSENT_VERSION,
  CONSENT_STORAGE_KEY,
  readConsent,
  saveConsent,
  subscribeConsent,
  DEFAULT_CONSENT,
  type ConsentRecord,
} from "@/lib/consent";

/**
 * Minimal window/localStorage stand-in. The repo's vitest setup intentionally
 * runs everything in the "node" environment (no jsdom/happy-dom dependency),
 * so the DOM-dependent consent module is exercised against a faithful small
 * fake: a Map-backed localStorage plus add/removeEventListener plumbing.
 */
let storage = new Map<string, string>();
const eventListeners = new Set<EventListenerOrEventListenerObject>();
const fakeWindow = {
  localStorage: {
    getItem: (key: string) => (storage.has(key) ? storage.get(key)! : null),
    setItem: (key: string, value: string) => void storage.set(key, value),
    removeItem: (key: string) => void storage.delete(key),
    clear: () => void storage.clear(),
  },
  addEventListener: (type: string, listener: EventListenerOrEventListenerObject) => {
    if (type === "storage") eventListeners.add(listener);
  },
  removeEventListener: (type: string, listener: EventListenerOrEventListenerObject) => {
    if (type === "storage") eventListeners.delete(listener);
  },
};

function stored(record: Record<string, unknown>) {
  storage.set(CONSENT_STORAGE_KEY, JSON.stringify(record));
}

function fullConsent(overrides: Partial<ConsentRecord> = {}): ConsentRecord {
  return {
    ...DEFAULT_CONSENT,
    advertising: true,
    analytics: true,
    functional: true,
    timestamp: Date.now(),
    choice: "all",
    ...overrides,
  };
}

describe("consent storage", () => {
  beforeEach(() => {
    (globalThis as Record<string, unknown>).window = fakeWindow;
    storage = new Map();
  });

  afterEach(() => {
    delete (globalThis as Record<string, unknown>).window;
  });

  it("fails closed with all optional categories false when nothing is stored", () => {
    const consent = readConsent();
    expect(consent.advertising).toBe(false);
    expect(consent.analytics).toBe(false);
    expect(consent.functional).toBe(false);
    expect(consent.necessary).toBe(true);
  });

  it("rejects pre-version consent records instead of inheriting old permissions", () => {
    // Simulates a stored v1 record that predates the advertising category.
    stored({ necessary: true, analytics: true, functional: true, timestamp: 123, version: 1, choice: "all" });
    const consent = readConsent();
    expect(consent.advertising).toBe(false);
    expect(consent.analytics).toBe(false);
  });

  it("honors a current-version record", () => {
    stored(fullConsent() as unknown as Record<string, unknown>);
    const consent = readConsent();
    expect(consent.advertising).toBe(true);
    // readConsent returns the parsed record whose version equals the record's
    // own; saveConsent is what stamps CONSENT_VERSION.
    expect(consent.version).toBe(CONSENT_VERSION);
  });

  it("treats corrupt JSON as no consent", () => {
    storage.set(CONSENT_STORAGE_KEY, "{not-json");
    expect(readConsent().advertising).toBe(false);
  });

  it("notifies subscribers on save with a normalized record", () => {
    let notifications = 0;
    const unsubscribe = subscribeConsent(() => {
      notifications += 1;
    });
    saveConsent(fullConsent());
    expect(notifications).toBe(1);
    const saved = readConsent();
    expect(saved.advertising).toBe(true);
    expect(saved.version).toBe(CONSENT_VERSION);
    unsubscribe();
  });

  it("withdrawal persists advertising=false in the stored record", () => {
    saveConsent(fullConsent());
    saveConsent(fullConsent({ advertising: false, choice: "reject" }));
    expect(readConsent().advertising).toBe(false);
    // Display gating no longer reads this value by default (ads are part of
    // the free service); it is only honored under the conservative
    // NEXT_PUBLIC_ADS_CONSENT_REQUIRED=true mode (see src/config/ads.ts).
  });

  it("rejects v2 records so the v3 policy re-prompts (mandatory-display migration)", () => {
    // Users who previously declined (or were never granted) optional
    // advertising consent must not inherit that stale choice as an ad
    // blocker — display no longer reads it, and the version bump re-prompts.
    stored({ necessary: true, analytics: true, functional: true, advertising: false, timestamp: 123, version: 2, choice: "reject" });
    const consent = readConsent();
    // Re-prompt trigger is the zeroed timestamp (UNSET), not a version field.
    expect(consent.timestamp).toBe(0);
    expect(consent.choice).toBe("reject");
  });

  it("saveConsent never lets callers unset necessary or stamp a wrong version", () => {
    saveConsent({
      necessary: false as unknown as true,
      analytics: true,
      functional: true,
      advertising: true,
      timestamp: 1,
      version: 99,
      choice: "all",
    });
    const saved = readConsent();
    expect(saved.necessary).toBe(true);
    expect(saved.version).toBe(CONSENT_VERSION);
  });

  it("is inert without a window (SSR / node) — reads fail closed, writes no-op", () => {
    delete (globalThis as Record<string, unknown>).window;
    expect(readConsent().advertising).toBe(false);
    expect(() => saveConsent(fullConsent())).not.toThrow();
  });

  it("persists the saved choice across simulated reloads and later sessions", () => {
    // Route navigation, refreshes, and browser restarts all arrive as a fresh
    // process with the same underlying storage — verify the record survives.
    saveConsent(fullConsent({ choice: "custom", advertising: false }));
    const first = readConsent();
    expect(first.choice).toBe("custom");
    expect(first.advertising).toBe(false);

    // Simulate an entirely new page load (nothing in memory, same storage).
    expect(readConsent().choice).toBe("custom");
    expect(readConsent().timestamp).toBe(first.timestamp);
  });

  it("storage exceptions do not crash reads or writes", () => {
    const throwingStorage = {
      getItem: () => {
        throw new Error("quota");
      },
      setItem: () => {
        throw new Error("quota");
      },
      removeItem: () => {
        throw new Error("quota");
      },
      clear: () => {
        throw new Error("quota");
      },
    };
    (globalThis as Record<string, unknown>).window = {
      localStorage: throwingStorage,
      addEventListener: () => {},
      removeEventListener: () => {},
    };
    expect(() => saveConsent(fullConsent())).not.toThrow();
    expect(readConsent().choice).toBe("reject"); // UNSET fallback
    expect(readConsent().analytics).toBe(false);
  });

  it("non-object and wrong-field records are treated as unset", () => {
    storage.set(CONSENT_STORAGE_KEY, JSON.stringify("just-a-string"));
    expect(readConsent().choice).toBe("reject");
    storage.set(CONSENT_STORAGE_KEY, "[1,2,3]");
    expect(readConsent().choice).toBe("reject");
    storage.set(CONSENT_STORAGE_KEY, "{}");
    // Malformed record lacks a version: parseRecord falls back to version 1,
    // below CONSENT_VERSION, so the policy re-prompts (fail closed).
    expect(readConsent().timestamp).toBe(0);
    expect(readConsent().choice).toBe("reject");
  });

  it("a storage event for another key does not disturb consent notifications", () => {
    let notified = 0;
    const unsubscribe = subscribeConsent(() => {
      notified += 1;
    });
    // Simulate a background-tab write of an unrelated key (e.g. theme).
    const handler = eventListeners.values().next().value as
      ((evt: unknown) => void) | undefined;
    handler?.({
      type: "storage",
      key: "audify-theme",
      newValue: "dark",
      oldValue: null,
    } as unknown as StorageEvent);
    expect(notified).toBe(0);
    // Events for the consent key (or a clear(), key === null) DO notify.
    handler?.({
      type: "storage",
      key: CONSENT_STORAGE_KEY,
      newValue: JSON.stringify(fullConsent()),
      oldValue: null,
    } as unknown as StorageEvent);
    expect(notified).toBe(1);
    unsubscribe();
  });

  it("future-version records (advanced readers) are still honored, not wiped", () => {
    stored({ ...fullConsent(), version: CONSENT_VERSION + 1 });
    const consent = readConsent();
    expect(consent.advertising).toBe(true);
    expect(consent.choice).toBe("all");
  });
});
