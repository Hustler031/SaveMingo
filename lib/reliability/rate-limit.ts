import {
  policyForScope,
  type RateLimitScope,
} from "@/lib/reliability/policy";

type Bucket = {
  count: number;
  resetAt: number;
};

export type RateLimitDecision = {
  allowed: boolean;
  limit: number;
  remaining: number;
  resetAt: number;
  retryAfterSeconds: number;
};

export class FixedWindowRateLimiter {
  private readonly buckets = new Map<string, Bucket>();

  check(
    key: string,
    limit: number,
    windowMs: number,
    now = Date.now(),
  ): RateLimitDecision {
    if (this.buckets.size > 5_000) {
      for (const [bucketKey, bucket] of this.buckets) {
        if (bucket.resetAt <= now) {
          this.buckets.delete(bucketKey);
        }
      }
    }

    const existing = this.buckets.get(key);
    const bucket =
      !existing || existing.resetAt <= now
        ? { count: 0, resetAt: now + windowMs }
        : existing;

    bucket.count += 1;
    this.buckets.set(key, bucket);

    const allowed = bucket.count <= limit;
    const remaining = Math.max(0, limit - bucket.count);

    return {
      allowed,
      limit,
      remaining,
      resetAt: bucket.resetAt,
      retryAfterSeconds: allowed
        ? 0
        : Math.max(1, Math.ceil((bucket.resetAt - now) / 1_000)),
    };
  }

  clear() {
    this.buckets.clear();
  }
}

const rateLimitGlobal = globalThis as typeof globalThis & {
  __savemingoRateLimiter?: FixedWindowRateLimiter;
};

function sharedLimiter() {
  rateLimitGlobal.__savemingoRateLimiter ??= new FixedWindowRateLimiter();
  return rateLimitGlobal.__savemingoRateLimiter;
}

function clientIdentity(request: Request) {
  const forwarded = request.headers
    .get("x-forwarded-for")
    ?.split(",", 1)[0]
    ?.trim();

  return (
    forwarded ||
    request.headers.get("x-real-ip")?.trim() ||
    request.headers.get("cf-connecting-ip")?.trim() ||
    "unknown"
  );
}

export function checkRequestRateLimit(
  scope: RateLimitScope,
  request: Request,
): RateLimitDecision {
  const policy = policyForScope(scope);
  const key = scope + ":" + clientIdentity(request);

  return sharedLimiter().check(
    key,
    policy.rateLimit,
    policy.windowMs,
  );
}

export function rateLimitHeaders(decision: RateLimitDecision) {
  const headers: Record<string, string> = {
    "X-RateLimit-Limit": String(decision.limit),
    "X-RateLimit-Remaining": String(decision.remaining),
    "X-RateLimit-Reset": String(Math.ceil(decision.resetAt / 1_000)),
  };

  if (!decision.allowed) {
    headers["Retry-After"] = String(decision.retryAfterSeconds);
  }

  return headers;
}
