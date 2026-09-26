# SaveMingo SEO Intent Map

Updated: 2026-09-26

This file records search-intent structure, not keyword-volume claims. Recheck current SERPs before promoting new pages to production.

## Core rules

1. The homepage is the broad multi-platform hub.
2. Each platform gets one broad downloader page.
3. Add a subpage only when the search intent and user experience are materially distinct.
4. Do not create near-duplicate brand-spelling pages such as both `x-video-downloader` and `twitter-video-downloader`; use one canonical page whose title/copy covers both terms naturally.
5. Preview/experimental pages stay `noindex` until the matching resolver capability is live-verified.
6. Every indexable page needs unique title, description, H1, helpful copy, internal links, and a working downloader.
7. Do not publish doorway pages, scaled low-value pages, or pages whose only difference is swapped keywords.
8. Search language can guide titles/H1s, but copy must remain readable and user-first.

## X / Twitter

Observed strong intent clusters:
- Twitter downloader / X downloader
- Twitter video downloader / X video downloader
- Twitter GIF downloader
- Twitter image downloader / Twitter photo downloader

Preview routes:
- `/v2-preview/x-downloader`
- `/v2-preview/twitter-video-downloader`
- `/v2-preview/twitter-gif-downloader`
- `/v2-preview/twitter-image-downloader`

Do not create duplicate X-brand variants of those subpages.

## Pinterest

Observed distinct intent clusters:
- Pinterest downloader
- Pinterest video downloader
- Pinterest image downloader
- Pinterest GIF downloader

Preview routes:
- `/v2-preview/pinterest-downloader`
- `/v2-preview/pinterest-video-downloader`
- `/v2-preview/pinterest-image-downloader`
- `/v2-preview/pinterest-gif-downloader`

Pinterest stays noindex/API-setup until approved API access and live media delivery are verified.

## Reddit

Observed distinct intent clusters:
- Reddit downloader
- Reddit video downloader
- Reddit video downloader with sound
- Reddit GIF downloader
- Reddit image downloader / Reddit gallery downloader

Preview routes:
- `/v2-preview/reddit-downloader`
- `/v2-preview/reddit-video-downloader`
- `/v2-preview/reddit-gif-downloader`
- `/v2-preview/reddit-image-downloader`

Images and galleries are intentionally combined to avoid thin duplicate pages.

Do not target “Reddit video downloader with sound” as a product promise until SaveMingo has a verified audio+video mux path. Reddit commonly exposes separate streams; search demand does not justify a false capability claim.

## Promotion checklist

Before moving a preview SEO page to its production route:
- resolver capability live-verified;
- actual download verified;
- mobile and desktop verified;
- unique page content;
- canonical set to the intended production URL;
- index/follow enabled;
- page included in internal navigation where appropriate;
- page added to sitemap only after it is launch-ready;
- existing platform regression suite remains green;
- Search Console inspection performed after production deployment.
