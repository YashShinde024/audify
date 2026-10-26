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

  it("withdrawal persists advertising=false for subsequent gating", () => {
    saveConsent(fullConsent());
    saveConsent(fullConsent({ advertising: false, choice: "reject" }));
    expect(readConsent().advertising).toBe(false);
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
});
