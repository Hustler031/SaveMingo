type Bucket = {
  count: number;
  resetAt: number;
};

type RateLimitOptions = {
  limit: number;
  windowMs: number;
  namespace: string;
};

type RateLimitResult = {
  allowed: boolean;
  limit: number;
  remaining: number;
  resetAt: number;
  retryAfterSeconds: number;
};

const buckets = new Map<string, Bucket>();
let lastSweepAt = 0;

function clientKey(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for");
  const firstForwarded = forwarded?.split(",", 1)[0]?.trim();

  return (
    firstForwarded ||
    request.headers.get("x-real-ip")?.trim() ||
    "anonymous"
  );
}

function sweepExpired(now: number) {
  if (now - lastSweepAt < 60_000) {
    return;
  }

  lastSweepAt = now;

  for (const [key, bucket] of buckets) {
    if (bucket.resetAt <= now) {
      buckets.delete(key);
    }
  }
}

export function checkRateLimit(
  request: Request,
  options: RateLimitOptions,
  now = Date.now(),
): RateLimitResult {
  sweepExpired(now);

  const key = options.namespace + ":" + clientKey(request);
  const existing = buckets.get(key);

  const bucket =
    !existing || existing.resetAt <= now
      ? {
          count: 0,
          resetAt: now + options.windowMs,
        }
      : existing;

  bucket.count += 1;
  buckets.set(key, bucket);

  const remaining = Math.max(0, options.limit - bucket.count);
  const retryAfterSeconds = Math.max(
    1,
    Math.ceil((bucket.resetAt - now) / 1000),
  );

  return {
    allowed: bucket.count <= options.limit,
    limit: options.limit,
    remaining,
    resetAt: bucket.resetAt,
    retryAfterSeconds,
  };
}

export function rateLimitHeaders(result: RateLimitResult) {
  return {
    "X-RateLimit-Limit": String(result.limit),
    "X-RateLimit-Remaining": String(result.remaining),
    "X-RateLimit-Reset": String(Math.ceil(result.resetAt / 1000)),
    ...(result.allowed
      ? {}
      : { "Retry-After": String(result.retryAfterSeconds) }),
  };
}
