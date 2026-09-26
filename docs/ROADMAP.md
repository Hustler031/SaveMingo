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



## SM-011 — X search-intent pages + Pinterest official-access module

Status: **SOURCE COMPLETE / CI GREEN / PINTEREST ACCESS PENDING**

Owner reported the SM-010 X downloader working locally.

X search-intent preview pages:
- `/v2-preview/x-downloader`
- `/v2-preview/twitter-video-downloader`
- `/v2-preview/twitter-gif-downloader`
- `/v2-preview/twitter-image-downloader`

The pages target distinct current intents rather than brand-spelling duplicates. They remain noindex while the V2 preview is under review.

Pinterest:
- isolated Pinterest platform detector, validation, adapter, resolver, errors, reliability policy and health endpoint;
- resolver uses the official Pinterest API only;
- no Pinterest page scraping fallback;
- `PINTEREST_ACCESS_TOKEN` is optional and never committed;
- Pinterest stays `disabled` / **API setup** until approved API access is configured and live media is verified;
- Pinterest preview pages:
  - `/v2-preview/pinterest-downloader`
  - `/v2-preview/pinterest-video-downloader`
  - `/v2-preview/pinterest-image-downloader`
  - `/v2-preview/pinterest-gif-downloader`

SEO rule:
- create only materially distinct media-intent pages;
- do not create separate near-identical X/Twitter brand-spelling pages;
- preview pages remain noindex until the matching capability is verified;
- titles/H1/internal links use actual search-language while copy remains user-first.

Verification:
- typecheck: pass;
- lint: pass;
- tests: pass;
- Next.js build: pass;
- Cloudflare/vinext build: pass.



## SM-012 — Reddit official-access module + SEO intent expansion

Status: **SOURCE COMPLETE / CI GREEN ON CORE IMPLEMENTATION / REDDIT ACCESS APPROVAL PENDING**

Reddit:
- isolated Reddit detector, validator, adapter, OAuth resolver, errors, reliability policy and health endpoint;
- supports standard Reddit post URLs and `redd.it/<id>` short post URLs;
- app-only OAuth uses configured `REDDIT_CLIENT_ID`, `REDDIT_CLIENT_SECRET`, and `REDDIT_USER_AGENT`;
- resolver reads post metadata through Reddit's authorized API path;
- only Reddit-hosted media is normalized/delivered;
- media allow-list is scoped to Reddit media hosts;
- images and galleries are supported by the normalizer;
- Reddit video source is supported when exposed;
- audio+video muxing is **not implemented**, so SaveMingo does not claim “with sound” yet;
- no unauthorized Reddit page-scraping fallback.

Reddit preview pages:
- `/v2-preview/reddit-downloader`
- `/v2-preview/reddit-video-downloader`
- `/v2-preview/reddit-gif-downloader`
- `/v2-preview/reddit-image-downloader`

Access/monetization gate:
- Reddit stays **API approval** / disabled unless authorized API credentials are configured;
- production or monetized use must comply with Reddit's current Developer/Data API terms and any required commercial agreement;
- real credentials must live only in local/hosting secrets, never in Git.

SEO:
- `docs/SEO_INTENT_MAP.md` records current intent clusters and page-quality rules;
- X now has distinct video/GIF/image intent pages;
- Pinterest has main/video/image/GIF noindex preview pages;
- Reddit has main/video/GIF/image+gallery noindex preview pages;
- no duplicate pages solely for X/Twitter spelling variants;
- no “Reddit video with sound” product page until sound is actually delivered;
- preview/API-gated pages remain noindex until live capability verification.

Local launchers:
- `START_SAVEMINGO_V2.cmd`
- `START_SAVEMINGO_X.cmd`
- `START_SAVEMINGO_PINTEREST.cmd`
- `START_SAVEMINGO_REDDIT.cmd`

Production remains untouched. The review stack is SM-009 → SM-010 → SM-011 → SM-012.

