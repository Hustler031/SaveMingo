# Roadmap

## Day 1 — Foundation
Repository/app foundation, AI handoff conventions, local diagnostics, CI, preview.

## Day 2 — Product UI
Downloader states, result cards, responsive polish, Instagram landing-page shell.

## Day 3 — Resolver foundation
URL normalization, platform detection, normalized contract, initial Reel/video support.

## Day 4 — Instagram coverage
Photos, carousels, mixed media, share links, failure cases.

## Day 5 — Reliability
Structured logs, rate limiting, timeouts, Sentry, resolver metrics.

## Day 6 — SEO & analytics
Landing pages, metadata/canonicals, sitemap/robots, analytics events, Search Console.

## Day 7 — Audit & launch
Mobile/desktop, performance, security, SEO, failures and production cutover.


## SM-010+ — Multi-platform expansion

### SM-010 — Platform isolation foundation + X
- normalized shared resolver route;
- isolated adapter registry;
- platform-scoped validation/errors/health/reliability;
- X public-media adapter;
- regression tests protecting Instagram;
- local X review before production.

### After X live verification
- create production X SEO page(s) only after real fixture reliability is proven;
- monitor X upstream breakage independently from Instagram;
- evaluate Facebook as the next platform;
- do not begin another platform until Instagram + X regression smoke is stable.

