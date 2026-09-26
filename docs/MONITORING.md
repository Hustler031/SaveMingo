# Monitoring & Reliability

## Operational source of truth

Use:
1. Cloudflare Worker deployment/build status;
2. Cloudflare Worker logs/observability;
3. Container status for `savemingo-reddit-mux`;
4. SaveMingo request IDs;
5. `/api/health`;
6. `/api/health/resolver`;
7. per-platform health endpoints;
8. `/api/health/reddit-mux`;
9. GA4 + Search Console for product/search behavior;
10. Vercel only as rollback evidence during early launch.

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

Reddit mux:
- `mux.unconfigured` (fallback/non-Cloudflare environments)
- `mux.network_failed`
- `mux.failed`
- `mux.success`

Every operational request carries a SaveMingo request ID.

## Privacy

Do not log:
- raw visitor IP addresses;
- credentials or cookies;
- auth headers;
- full signed media URLs;
- Reddit mux bearer tokens used in local fallback;
- temporary file contents.

Log platform, sanitized host, status, error code, timing and request ID only.

## Rate limiting

Launch defaults:
- resolve API: 20 requests/minute/network;
- media + mux API: 80 requests/minute/network.

The in-process limiter is best-effort per warm Worker isolate. Use Cloudflare
rate limiting/WAF if abuse or real traffic requires globally coordinated
enforcement.

## Time and size limits

- Instagram fetch: 10 seconds;
- X fetch: 10 seconds;
- Pinterest fetch: 10 seconds;
- Reddit fetch: 10 seconds;
- TikTok fetch: 12 seconds;
- media delivery fetch: 20 seconds;
- mux video/audio input: 150 MiB each in the Cloudflare Container profile;
- mux upstream fetch: 25 seconds;
- FFmpeg mux: 60 seconds;
- container idle sleep: 30 seconds.

## Mux monitoring and fallback

Alert/investigate when:
- `/api/health/reddit-mux` is not healthy;
- `SM-RD-106` or `SM-RD-107` rises materially;
- Container cold starts or mux latency become user-visible;
- CPU/memory/disk/network usage approaches included plan allocations.

A mux incident must not be treated as a full-site incident unless unrelated
health endpoints also fail. Video-only Reddit is the fallback.

## Analytics

The public GA4 Measurement ID is `G-ZXK1PRVH6X`.

Funnel events:
- `page_view`
- `paste_clicked`
- `resolve_started`
- `resolve_success`
- `resolve_failed`
- `download_clicked`

Resolve/download events include the platform dimension. Never send pasted URLs,
signed CDN URLs, request IDs or secrets to analytics.
