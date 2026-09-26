# Handoff

## Current milestone
**SM-005 — Reliability / monitoring hardening**

## Branch
`chatgpt/SM-005-reliability`

## Starting point
SM-004 is merged to main with:
- Reel/video resolver
- photo normalization path
- mixed carousel normalization
- same-origin media delivery
- CDN allow-list + redirect validation
- structured media transport diagnostics

## SM-005 work
- central reliability policy
- best-effort per-instance rate limiting
- request body size limit
- structured operational logging helper
- richer health endpoints
- version + rate-limit response headers
- rate-limit tests
- monitoring runbook

## Important
Do not claim the per-instance limiter is globally distributed.

## Pending external dependency
Sentry remains optional/unconfigured until a Sentry project and DSN are connected.

## Next after SM-005
SM-006 — SEO + analytics.
