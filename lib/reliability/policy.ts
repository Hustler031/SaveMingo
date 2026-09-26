export const RELIABILITY_POLICY = {
  resolve: {
    rateLimit: 20,
    windowMs: 60_000,
    maxBodyBytes: 4_096,
  },
  media: {
    rateLimit: 80,
    windowMs: 60_000,
    maxDeclaredBytes: 250 * 1024 * 1024,
    fetchTimeoutMs: 20_000,
    maxRedirects: 3,
  },
  instagram: {
    fetchTimeoutMs: 10_000,
    maxRedirects: 3,
    maxHtmlBytes: 5_000_000,
  },
  x: {
    fetchTimeoutMs: 10_000,
    maxJsonBytes: 2_000_000,
  },
  pinterest: {
    fetchTimeoutMs: 10_000,
    maxHtmlBytes: 5_000_000,
    maxRedirects: 4,
  },
  reddit: {
    fetchTimeoutMs: 10_000,
    maxJsonBytes: 3_000_000,
    maxRedirects: 4,
  },
  redditMux: {
    proxyTimeoutMs: 75_000,
    maxBodyBytes: 8_192,
  },
  tiktok: {
    fetchTimeoutMs: 12_000,
    maxHtmlBytes: 6_000_000,
    maxRedirects: 4,
  },
} as const;

export type RateLimitScope = "resolve" | "media";

export function policyForScope(scope: RateLimitScope) {
  return RELIABILITY_POLICY[scope];
}
