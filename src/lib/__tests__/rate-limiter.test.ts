import { describe, it, expect, beforeEach } from "vitest";
import { studioDspLimiter, contactFormLimiter } from "../rate-limiter";

describe("Rate Limiter", () => {
  beforeEach(() => {
    studioDspLimiter.reset();
    contactFormLimiter.reset();
  });

  it("permits initial DSP render requests", () => {
    const check1 = studioDspLimiter.check();
    expect(check1.allowed).toBe(true);
    expect(check1.retryAfterMs).toBe(0);
  });

  it("enforces cooldown when requests are fired immediately without spacing", () => {
    const check1 = studioDspLimiter.check();
    expect(check1.allowed).toBe(true);

    // Immediate second call should be caught by minIntervalMs
    const check2 = studioDspLimiter.check();
    expect(check2.allowed).toBe(false);
    expect(check2.retryAfterMs).toBeGreaterThan(0);
    expect(check2.reason).toContain("Please wait");
  });

  it("permits initial contact form dispatch and blocks rapid succession", () => {
    const check1 = contactFormLimiter.check();
    expect(check1.allowed).toBe(true);

    const check2 = contactFormLimiter.check();
    expect(check2.allowed).toBe(false);
    expect(check2.reason).toBeDefined();
  });
});
