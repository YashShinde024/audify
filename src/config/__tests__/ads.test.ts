import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  ADSTERRA_DESKTOP,
  ADSTERRA_MOBILE,
  isAdsEnabled,
  DESKTOP_AD_BREAKPOINT,
  __resetAdsDiagnosticForTest,
} from "@/config/ads";
import { DESKTOP_AD_QUERY } from "@/components/advertising/adsterra-slot";

/**
 * Ads delivery gating regression tests (node environment).
 *
 * These cover the first three links of the ad-delivery chain: build-time
 * feature flag, environment (dev/test gating), and SSR safety. Rendering,
 * consent, and vendor script execution are covered by consent.test.ts,
 * the cookie banner UI, and manual production verification respectively —
 * mocked vendor tests cannot prove the real network served an ad.
 */

describe("isAdsEnabled gating", () => {
  beforeEach(() => {
    // Simulate a client window (config/slot code is client-only; SSR always
    // disables ads and is asserted explicitly below).
    (globalThis as Record<string, unknown>).window = {};
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
    delete (globalThis as Record<string, unknown>).window;
  });

  it("is disabled when the flag is absent in a production build", () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("NEXT_PUBLIC_ADS_ENABLED", "");
    expect(isAdsEnabled()).toBe(false);
  });

  it("is disabled when the flag is explicitly false in a production build", () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("NEXT_PUBLIC_ADS_ENABLED", "false");
    expect(isAdsEnabled()).toBe(false);
  });

  it("is enabled on a production build with the flag explicitly true", () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("NEXT_PUBLIC_ADS_ENABLED", "true");
    expect(isAdsEnabled()).toBe(true);
  });

  it("is disabled in development even when the flag is true", () => {
    vi.stubEnv("NODE_ENV", "development");
    vi.stubEnv("NEXT_PUBLIC_ADS_ENABLED", "true");
    expect(isAdsEnabled()).toBe(false);
  });

  it("is disabled in test environments even when the flag is true", () => {
    vi.stubEnv("NODE_ENV", "test");
    vi.stubEnv("NEXT_PUBLIC_ADS_ENABLED", "true");
    expect(isAdsEnabled()).toBe(false);
  });

  it("never enables during SSR (no window)", () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("NEXT_PUBLIC_ADS_ENABLED", "true");
    delete (globalThis as Record<string, unknown>).window;
    expect(isAdsEnabled()).toBe(false);
  });

  it("warns exactly once in production when the flag is missing", () => {
    __resetAdsDiagnosticForTest();
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("NEXT_PUBLIC_ADS_ENABLED", "");
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});

    expect(isAdsEnabled()).toBe(false);
    expect(isAdsEnabled()).toBe(false); // repeated renders must not re-warn
    expect(warn).toHaveBeenCalledTimes(1);
    expect(String(warn.mock.calls[0]?.[0])).toMatch(/NEXT_PUBLIC_ADS_ENABLED/);
  });

  it("does not warn when the flag is enabled", () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("NEXT_PUBLIC_ADS_ENABLED", "true");
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    expect(isAdsEnabled()).toBe(true);
    expect(warn).not.toHaveBeenCalled();
  });
});

describe("Adsterra slot configuration", () => {
  it("uses distinct keys for the desktop and mobile formats", () => {
    expect(ADSTERRA_DESKTOP.key).not.toBe(ADSTERRA_MOBILE.key);
  });

  it("binds each loader script URL to its own publisher key", () => {
    expect(ADSTERRA_DESKTOP.scriptSrc).toContain(ADSTERRA_DESKTOP.key);
    expect(ADSTERRA_MOBILE.scriptSrc).toContain(ADSTERRA_MOBILE.key);
  });

  it("declares the correct iframe format and dimensions", () => {
    expect(ADSTERRA_DESKTOP.format).toBe("iframe");
    expect(ADSTERRA_DESKTOP.width).toBe(728);
    expect(ADSTERRA_DESKTOP.height).toBe(90);
    expect(ADSTERRA_MOBILE.width).toBe(320);
    expect(ADSTERRA_MOBILE.height).toBe(50);
  });

  it("uses the documented desktop breakpoint of 768px", () => {
    expect(DESKTOP_AD_QUERY).toBe(`(min-width: ${DESKTOP_AD_BREAKPOINT}px)`);
    expect(DESKTOP_AD_BREAKPOINT).toBe(768);
  });
});
