import { describe, expect, it } from "vitest";
import {
  FixedWindowRateLimiter,
  rateLimitHeaders,
} from "@/lib/reliability/rate-limit";

describe("fixed-window rate limiter", () => {
  it("allows requests within the limit and blocks the next request", () => {
    const limiter = new FixedWindowRateLimiter();

    const first = limiter.check("resolve:test", 2, 60_000, 1_000);
    const second = limiter.check("resolve:test", 2, 60_000, 2_000);
    const third = limiter.check("resolve:test", 2, 60_000, 3_000);

    expect(first.allowed).toBe(true);
    expect(first.remaining).toBe(1);
    expect(second.allowed).toBe(true);
    expect(second.remaining).toBe(0);
    expect(third.allowed).toBe(false);
    expect(third.retryAfterSeconds).toBe(58);
  });

  it("starts a fresh bucket after the window expires", () => {
    const limiter = new FixedWindowRateLimiter();

    limiter.check("media:test", 1, 1_000, 1_000);
    expect(limiter.check("media:test", 1, 1_000, 1_500).allowed).toBe(false);

    const reset = limiter.check("media:test", 1, 1_000, 2_001);
    expect(reset.allowed).toBe(true);
    expect(reset.remaining).toBe(0);
  });

  it("adds Retry-After only when a request is blocked", () => {
    const allowed = rateLimitHeaders({
      allowed: true,
      limit: 20,
      remaining: 19,
      resetAt: 61_000,
      retryAfterSeconds: 0,
    });

    const blocked = rateLimitHeaders({
      allowed: false,
      limit: 20,
      remaining: 0,
      resetAt: 61_000,
      retryAfterSeconds: 17,
    });

    expect(allowed["Retry-After"]).toBeUndefined();
    expect(blocked["Retry-After"]).toBe("17");
    expect(blocked["X-RateLimit-Limit"]).toBe("20");
  });
});
