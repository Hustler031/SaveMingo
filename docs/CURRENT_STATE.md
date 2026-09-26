# Current State

Updated: 2026-09-26

## Product
SaveMingo — **Save anything you find online.**  
Supporting line: **Save it. Keep it.**

## Milestones
- **SM-001 — Foundation: COMPLETE**
- **SM-002 — Product UI / downloader states: COMPLETE**
- **SM-003 — Instagram resolver foundation: LIVE VERIFIED**
- **SM-004 — Photo + carousel + download delivery: COMPLETE**
- **SM-005 — Reliability / monitoring hardening: COMPLETE**
- **SM-005C — Cloudflare migration: COMPLETE**
- **SM-006 — SEO + analytics foundation: COMPLETE**
- **SM-007 — Launch readiness: COMPLETE**
- **SM-008 — GA4 wiring: IN PROGRESS**

## Version
`0.4.0`

## Infrastructure
- GitHub: `Hustler031/SaveMingo`
- Active development branch: `chatgpt/SM-008-ga4-wiring`
- Primary runtime: Cloudflare Workers
- Worker URL: `https://savemingo.ashabup0.workers.dev`
- Vercel retained as rollback
- Custom domain `savemingo.com`: waiting for Hostinger nameserver cooldown
- Database: not required

## Launch verification
Production Worker has passed:
- all SEO routes
- canonical/title/description checks
- robots.txt
- sitemap.xml
- manifest
- custom 404
- health endpoints
- public Reel resolve
- public carousel resolve
- partial media streaming

## Search Console
- Domain property: `sc-domain:savemingo.com`
- Verified/readable: yes
- Current clicks/impressions: 0 (pre-launch expected)
- Sitemap submitted: no — intentionally waiting for custom-domain cutover
- GSC Wizard connected

## Google Analytics 4
- GA4 account: SaveMingo
- GA4 property: SaveMingo
- Property ID: `properties/556072162`
- Web stream: SaveMingo Web
- Measurement ID: `G-ZXK1PRVH6X`
- Funnel events implemented:
  - `page_view`
  - `paste_clicked`
  - `resolve_started`
  - `resolve_success`
  - `resolve_failed`
  - `download_clicked`
- GA4 ↔ GSC Wizard site association: pending UI link

## Known audit item
Single-photo normalization remains unit-verified; a stable independent live single-photo fixture remains pending.

## Next
1. Complete SM-008 build/runtime verification and merge.
2. Link the SaveMingo GA4 property to `sc-domain:savemingo.com` in GSC Wizard.
3. After Hostinger cooldown, switch nameservers to Cloudflare.
4. Attach `savemingo.com` as Worker Custom Domain.
5. Run full launch smoke on custom domain.
6. Submit sitemap and inspect/index primary URLs in Search Console.


## UI V2 preview workstream — SM-009

Status: **DESIGN PREVIEW IMPLEMENTED / HOSTED PREVIEW BLOCKED**

Branch:
`chatgpt/SM-009-ui-v2-preview`

Draft PR:
`#15 — SM-009: UI V2 preview`

Implemented:
- dedicated noindex `/v2-preview` route;
- Grabivo-inspired action-first layout without copying branding/content;
- mobile-first responsive composition;
- only one upper-right utility control: light/dark theme toggle;
- preview-first Reel/photo/video result workspace;
- carousel arrows, counter, thumbnails, selected-item metadata;
- individual media downloads;
- preview-only sequential Download All interaction for UX testing;
- restricted inline media preview through the existing `/api/v1/media` transport;
- production homepage and SEO routes left untouched.

Verification on latest source head:
- typecheck: pass;
- lint: pass;
- tests: pass;
- Next.js build: pass;
- Cloudflare/vinext build: pass.

Hosted preview blockers observed on 2026-09-26:
- Vercel status on commit `915467bc`: deployment rate limited for 24 hours after exceeding the free daily deployment limit;
- Cloudflare Workers PR preview build for the same commit failed in the hosted preview environment even though local/CI `build:vinext` passes;
- do not merge UI V2 before owner visual review and hosted runtime verification.


## SM-009 V2 revision — download-first multi-page preview

Updated from owner feedback on 2026-09-26.

Design direction now:
- restore the original SaveMingo message: **Save anything you find online.** / **Save it. Keep it.**
- compact hero; tagline must not consume the screen;
- homepage is a broad multi-tool hub, inspired by Grabivo's information architecture but not copied;
- dedicated Instagram-specific pages live under the V2 preview route;
- top navigation row added below the brand row;
- the only upper-right utility button is the light/dark theme toggle;
- primary Download action is centered;
- successful results are **download-first**;
- Preview is optional and collapsed by default;
- carousel primary action is centered **Download all**; item preview/navigation appears only after the user opens Preview;
- mobile layout remains first-class and uses horizontally scrollable top navigation rather than a second utility button/menu.

V2 preview routes:
- `/v2-preview`
- `/v2-preview/instagram-downloader`
- `/v2-preview/instagram-reels-downloader`
- `/v2-preview/instagram-photo-downloader`
- `/v2-preview/instagram-carousel-downloader`

Local Windows helper:
- `START_SAVEMINGO_V2.cmd`
- launches the Next.js dev server and opens `http://localhost:3000/v2-preview`.

Production remains untouched. Draft PR #15 remains the review gate.


## SM-009 final navigation and polish pass

Owner-reviewed direction applied on 2026-09-26:

- homepage hero keeps **Save anything you** in primary text and **find online.** in the SaveMingo accent;
- hero spacing tightened so the downloader stays high in the first viewport;
- top navigation is simplified to **Home** and **Instagram**;
- Home is emphasized and receives an active underline only on the homepage;
- Instagram text links to the universal Instagram downloader;
- the adjacent Instagram chevron opens a dropdown containing SEO-specific pages for Reels, Videos, Photos, and Carousels;
- individual Instagram content types are no longer separate top-nav items;
- homepage cards are platform-level rather than content-type-level;
- Instagram is the only **Available** platform; future platform cards are visually muted and labelled **Coming soon** or **Planned**;
- technical/developer-facing copy was replaced with user-facing product copy;
- successful results remain download-first;
- result card width was tightened and Preview is now a bordered secondary action with an eye icon;
- Preview remains collapsed by default;
- Instagram main page auto-detects the supported post type from the pasted link;
- V2 preview now includes a dedicated Instagram Video SEO preview route.

V2 preview routes:
- `/v2-preview`
- `/v2-preview/instagram-downloader`
- `/v2-preview/instagram-reels-downloader`
- `/v2-preview/instagram-video-downloader`
- `/v2-preview/instagram-photo-downloader`
- `/v2-preview/instagram-carousel-downloader`

Local review remains isolated from production. Use `START_SAVEMINGO_V2.cmd`.


## SM-010 — platform isolation + X downloader

Status: **IMPLEMENTED / CI VERIFIED / LIVE X FIXTURE REVIEW PENDING**

Branch:
`chatgpt/SM-010-platform-isolation-x`

Base:
`chatgpt/SM-009-ui-v2-preview`

Implemented:
- `POST /api/v1/resolve` now detects the platform and dispatches through a server adapter registry;
- Instagram remains behind its own adapter and existing resolver;
- X/Twitter has a separate validation module, adapter, resolver, errors, timeout policy, health state, and tests;
- supported X URL forms include public `x.com/.../status/...` and legacy `twitter.com/.../status/...` links;
- X resolver uses the public X syndication response server-side and normalizes downloadable video, animated-GIF-as-video, photo, and multi-media results;
- highest-bitrate MP4 is selected when explicit X MP4 bitrate variants are available;
- X media delivery is restricted to `pbs.twimg.com` and `video.twimg.com`;
- Instagram media delivery remains restricted to Meta/Instagram CDN roots;
- redirects cannot cross from one platform's CDN allow-list into another platform's allow-list;
- aggregate resolver health reports each platform independently;
- per-platform health endpoints:
  - `/api/health/platforms/instagram`
  - `/api/health/platforms/x`
- V2 homepage auto-detects Instagram or X links;
- Instagram V2 pages remain Instagram-only;
- X has a dedicated preview page at `/v2-preview/x-downloader`;
- X is the second Available platform card after Instagram;
- shared result UI now uses the detected platform for labels and filenames;
- `START_SAVEMINGO_X.cmd` opens the X preview directly.

Verification:
- platform detection/validation tests: implemented;
- adapter registry isolation tests: implemented;
- X resolver video/photo/no-media tests: implemented;
- per-platform media allow-list tests: implemented;
- existing Instagram tests remain part of the same CI suite;
- typecheck, lint, unit tests, Next.js build, and Cloudflare/vinext build pass on the implementation commits.

Live-verification gate:
- do not label X as production/live-verified until at least one real public X video post and one real public X photo/multi-media post are resolved and downloaded through the local or hosted SaveMingo runtime;
- X syndication is an upstream public embed interface and is not a stable contractual API, so future X upstream changes must remain contained inside the X adapter.

Production remains untouched while SM-009/SM-010 are under review.



## SM-011 — X SEO cluster + Pinterest + Reddit

Status: **IMPLEMENTED / CI VERIFIED / PINTEREST + REDDIT LIVE FIXTURE TESTING PENDING**

Branch:
`chatgpt/SM-011-x-pinterest-reddit-seo`

Stacked on:
`chatgpt/SM-010-platform-isolation-x`

### X / Twitter SEO cluster
Preview routes:
- `/v2-preview/x-downloader`
- `/v2-preview/twitter-video-downloader`
- `/v2-preview/twitter-gif-downloader`
- `/v2-preview/twitter-image-downloader`

The generic X page remains broad; subpages target video, GIF, and image intent without duplicating extraction logic.

### Pinterest
Implemented isolated Pinterest adapter/resolver:
- public `pinterest.com/pin/...` validation;
- `pin.it` short-link handling;
- public-page metadata resolver;
- Pinterest-specific error namespace `SM-PIN-xxx`;
- Pinterest timeout/size policy;
- media delivery restricted to `pinimg.com`;
- independent health endpoint;
- unit coverage for video/image metadata resolution.

Preview routes:
- `/v2-preview/pinterest-downloader`
- `/v2-preview/pinterest-video-downloader`
- `/v2-preview/pinterest-image-downloader`
- `/v2-preview/pinterest-gif-downloader`

Pinterest is labelled **Testing** until real public video/image fixtures pass locally.

### Reddit
Implemented isolated Reddit adapter/resolver:
- public Reddit post validation;
- `redd.it` short-link normalization;
- public Reddit JSON post metadata;
- Reddit-hosted video track support;
- single-image support;
- gallery support;
- GIF/animated preview support;
- Reddit-specific error namespace `SM-RD-xxx`;
- Reddit timeout/size policy;
- media delivery restricted to Reddit CDN roots;
- independent health endpoint;
- unit coverage for video and gallery normalization.

Preview routes:
- `/v2-preview/reddit-downloader`
- `/v2-preview/reddit-video-downloader`
- `/v2-preview/reddit-image-downloader`
- `/v2-preview/reddit-gif-downloader`

Important limitation:
- Reddit often stores native video and audio separately.
- Current SaveMingo Reddit resolver exposes the available Reddit-hosted video track.
- Automatic audio/video merging is **not yet implemented**.
- Do not advertise "Reddit video downloader with sound" as a product promise until merging is implemented and live-verified.

### SEO research implementation
Search-intent route strategy is documented in:
`docs/SEO_PLATFORM_CLUSTERS.md`

Preview routes remain `noindex`. Promote them to indexable production routes only after platform functionality is live-verified.

### Navigation
Top row now uses platform-level navigation:
- Home
- Instagram ▾
- X / Twitter ▾
- Pinterest ▾
- Reddit ▾

Each platform label opens the generic page; its chevron opens intent-specific subpages.

### Local launchers
- `START_SAVEMINGO_V2.cmd`
- `START_SAVEMINGO_X.cmd`
- `START_SAVEMINGO_PINTEREST.cmd`
- `START_SAVEMINGO_REDDIT.cmd`

Production/main remains untouched.

