import { describe, expect, it } from "vitest";
import {
  checkRateLimit,
  rateLimitHeaders,
} from "@/lib/rate-limit";

function request(ip: string) {
  return new Request("https://savemingo.test/api", {
    headers: {
      "x-forwarded-for": ip,
    },
  });
}

describe("rate-limit safety fuse", () => {
  it("allows requests until the limit and then blocks", () => {
    const now = 1_000_000;
    const options = {
      limit: 2,
      windowMs: 60_000,
      namespace: "test-a",
    };

    const first = checkRateLimit(request("203.0.113.1"), options, now);
    const second = checkRateLimit(request("203.0.113.1"), options, now + 1);
    const third = checkRateLimit(request("203.0.113.1"), options, now + 2);

    expect(first.allowed).toBe(true);
    expect(second.allowed).toBe(true);
    expect(third.allowed).toBe(false);
    expect(third.remaining).toBe(0);
    expect(third.retryAfterSeconds).toBeGreaterThan(0);
  });

  it("separates clients and resets after the window", () => {
    const now = 2_000_000;
    const options = {
      limit: 1,
      windowMs: 1_000,
      namespace: "test-b",
    };

    expect(checkRateLimit(request("203.0.113.2"), options, now).allowed).toBe(
      true,
    );
    expect(checkRateLimit(request("203.0.113.2"), options, now + 1).allowed).toBe(
      false,
    );
    expect(checkRateLimit(request("203.0.113.3"), options, now + 1).allowed).toBe(
      true,
    );
    expect(
      checkRateLimit(request("203.0.113.2"), options, now + 1_001).allowed,
    ).toBe(true);
  });

  it("emits standard rate headers", () => {
    const result = checkRateLimit(
      request("203.0.113.4"),
      {
        limit: 1,
        windowMs: 60_000,
        namespace: "test-c",
      },
      3_000_000,
    );

    expect(rateLimitHeaders(result)).toMatchObject({
      "X-RateLimit-Limit": "1",
      "X-RateLimit-Remaining": "0",
    });
  });
});
