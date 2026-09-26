# Monitoring & Reliability

## Operational source of truth

For V1, use:
1. Vercel deployment health
2. Vercel runtime logs
3. SaveMingo request IDs
4. `/api/health`
5. `/api/health/resolver`
6. Sentry once connected

## Structured event families

Resolver:
- `resolve.success`
- `resolve.failed`
- `resolve.rejected`
- `resolve.rate_limited`
- `resolve.exception`

Media delivery:
- `media.success`
- `media.failed`
- `media.rejected`
- `media.rate_limited`
- `media.retry_without_referer`
- `media.invalid_content_type`
- `media.too_large`

Every operational request carries a SaveMingo request ID.

## Privacy rule

Do not log:
- raw visitor IP addresses
- Instagram credentials
- cookies
- auth headers
- complete signed CDN URLs

Media transport logs may contain only sanitized CDN hostnames plus status/content-type/timing metadata.

## Rate limiting

V1 includes best-effort fixed-window protection:
- resolve API: 20 requests/minute/network
- media delivery: 80 requests/minute/network

This is stored only in warm server memory and is intentionally documented as **best-effort per Vercel instance**, not globally distributed enforcement.

Before high traffic, move global abuse protection to a distributed store or platform firewall.

## Timeout policy

- Instagram resolver fetch: 10 seconds
- media CDN fetch: 20 seconds

All external fetches should use explicit timeouts.

## CDN behavior

Instagram/Meta media URLs are signed and may expire. A valid resolved URL can later return 403. SaveMingo retries a 401/403 fetch once without the Instagram Referer and emits sanitized diagnostics.

## Sentry

Sentry is optional until a project/DSN is connected.

When configured:
- add `SENTRY_DSN` in Vercel
- never commit DSN/auth material to source
- use a Sentry auth token only for release/source-map operations if later enabled

Sentry should complement, not replace, request IDs and structured Vercel logs.
