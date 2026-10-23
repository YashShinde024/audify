/**
 * Audify Client Rate Limiter & DSP Concurrency Safeguard.
 *
 * Protects browser memory and CPU thread pools from runaway execution
 * caused by rapid repeated DSP rendering or contact form spamming.
 */

interface RateLimitConfig {
  /** Maximum operations allowed in the sliding window */
  maxRequests: number;
  /** Window duration in milliseconds */
  windowMs: number;
  /** Minimum cooldown between consecutive operations in milliseconds */
  minIntervalMs?: number;
}

class SlidingWindowLimiter {
  private timestamps: number[] = [];
  private lastExecuted = 0;
  private config: RateLimitConfig;

  constructor(config: RateLimitConfig) {
    this.config = config;
  }

  /**
   * Evaluates if an operation is permitted.
   * Returns { allowed: true } or { allowed: false, retryAfterMs, reason }.
   */
  check(): { allowed: boolean; retryAfterMs: number; reason?: string } {
    const now = Date.now();

    // 1. Check minimum interval between operations
    if (this.config.minIntervalMs && now - this.lastExecuted < this.config.minIntervalMs) {
      const waitMs = this.config.minIntervalMs - (now - this.lastExecuted);
      return {
        allowed: false,
        retryAfterMs: waitMs,
        reason: `Please wait ${Math.ceil(waitMs / 1000)}s between actions to allow hardware CPU cooling.`,
      };
    }

    // 2. Prune timestamps outside current window
    const windowStart = now - this.config.windowMs;
    this.timestamps = this.timestamps.filter((t) => t > windowStart);

    // 3. Check window capacity
    if (this.timestamps.length >= this.config.maxRequests) {
      const oldestInWindow = this.timestamps[0];
      const waitMs = oldestInWindow + this.config.windowMs - now;
      return {
        allowed: false,
        retryAfterMs: Math.max(500, waitMs),
        reason: `Rate limit reached (${this.config.maxRequests} renders/min). Please wait ${Math.ceil(
          waitMs / 1000
        )}s to safeguard browser memory.`,
      };
    }

    // Record this execution
    this.timestamps.push(now);
    this.lastExecuted = now;
    return { allowed: true, retryAfterMs: 0 };
  }

  /**
   * Reset limiter state (useful for test resets).
   */
  reset(): void {
    this.timestamps = [];
    this.lastExecuted = 0;
  }
}

/**
 * Global Studio DSP Rate Limiter:
 * Allows max 8 renders per 60 seconds with minimum 1.5s interval between clicks.
 */
export const studioDspLimiter = new SlidingWindowLimiter({
  maxRequests: 8,
  windowMs: 60_000,
  minIntervalMs: 1500,
});

/**
 * Global Contact Form Rate Limiter:
 * Allows max 3 dispatches per 3 minutes with minimum 10s interval.
 */
export const contactFormLimiter = new SlidingWindowLimiter({
  maxRequests: 3,
  windowMs: 180_000,
  minIntervalMs: 10_000,
});
