# Handoff

## Current milestone
**SM-009 — UI V2 design preview**

## Source branch
`chatgpt/SM-009-ui-v2-preview`

## Draft PR
`#15 — SM-009: UI V2 preview`

Do not merge before owner design approval.

## What is implemented
- noindex `/v2-preview` route;
- mobile-first SaveMingo V2 visual system;
- Grabivo-inspired centered downloader flow, compact surfaces and disciplined accent usage;
- SaveMingo pink/flamingo identity retained;
- header simplified to brand left + one dark-mode button upper-right;
- real media preview support through existing restricted media endpoint;
- Reel/video/photo result workspace;
- carousel viewer with arrows, counter and thumbnails;
- individual download CTA;
- preview-only Download All UX for multi-item testing;
- production homepage and SEO pages remain unchanged.

## Source verification
Latest source head `915467bc` passes:
- typecheck;
- lint;
- tests;
- Next.js fallback build;
- Cloudflare/vinext build.

## Hosted preview state
### Vercel
Blocked by account deployment quota:
`Deployment rate limited — retry in 24 hours.`

This is not a source/build failure.

### Cloudflare
PR #15 triggered a Workers preview build for commit `915467bc`, but the hosted Preview build failed. The exact same source passes the repository Cloudflare/vinext CI build, so the remaining issue is in hosted Preview configuration/runtime rather than the V2 TypeScript/build pipeline.

## Next safe step
1. Owner visually reviews the standalone preview / screenshots.
2. Apply design feedback on the same SM-009 branch.
3. Re-run a hosted Preview after Vercel quota resets or after Cloudflare Preview configuration is corrected.
4. Test real Reel + carousel URLs on desktop and narrow/mobile viewport.
5. Only then integrate approved V2 components into production routes.


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


## SM-010 handoff — X as isolated second downloader

Current branch:
`chatgpt/SM-010-platform-isolation-x`

This branch is stacked on:
`chatgpt/SM-009-ui-v2-preview`

Current status:
**source implementation complete; CI green; real public X runtime smoke still required before production approval.**

Architecture:
```text
/api/v1/resolve
   ↓
platform validation/detection
   ↓
server adapter registry
   ├─ instagram adapter → existing Instagram resolver
   └─ x adapter         → X syndication resolver
   ↓
normalized media response
   ↓
shared result UI / media delivery
```

Isolation guarantees now encoded in code/docs/tests:
- platform adapters do not depend on each other's resolvers;
- X uses `SM-X-xxx` errors while Instagram keeps `SM-IG-xxx`;
- X has its own timeout/response-size policy;
- health is available independently per platform;
- media CDN roots are scoped per platform and cross-platform redirects are blocked;
- shared API/result UI consumes the normalized contract.

X preview:
`http://localhost:3000/v2-preview/x-downloader`

Local helper:
`START_SAVEMINGO_X.cmd`

Before production:
1. run the branch locally;
2. verify one real public X video post;
3. verify one real public X photo or multi-photo post;
4. click actual download, not only resolve;
5. verify optional Preview;
6. recheck an Instagram Reel and carousel on the same branch;
7. only then mark X live-verified and proceed toward production integration.



## SM-011 handoff — Pinterest, Reddit, and SEO clusters

Current branch:
`chatgpt/SM-011-x-pinterest-reddit-seo`

Base:
`chatgpt/SM-010-platform-isolation-x`

### Source state
The four-platform normalized architecture now contains:
- Instagram adapter;
- X/Twitter adapter;
- Pinterest adapter;
- Reddit adapter.

A failure in one platform remains isolated behind the shared adapter registry.

### UX / SEO preview
The homepage accepts supported links across all four platform modules.
Platform-level navigation keeps subpages inside dropdowns.
X, Pinterest and Reddit now have search-intent subpage clusters.

All `/v2-preview/*` routes remain `noindex` until owner review and real fixture smoke.

### Local review order
1. X regression: real public X video + image.
2. Pinterest: real public video pin.
3. Pinterest: real public image pin.
4. Pinterest: one `pin.it` short link.
5. Reddit: public Reddit-hosted video post.
6. Reddit: public image/gallery post.
7. Reddit: GIF/animated post if a stable fixture is available.
8. Instagram regression: Reel + carousel.

### Known Reddit limitation
Do not claim video-with-sound yet. Reddit may separate video and audio. Automatic merge is not implemented in SM-011.

### Promotion gate
Only after real fixture testing:
- change Pinterest/Reddit homepage badge from Testing to Available;
- create/promote indexable production URLs and canonicals from the preview SEO cluster;
- add production sitemap entries;
- submit/index only verified pages.



### SM-011 follow-up review notes

Dropdown bug:
- root cause was menu content living inside the horizontally scrollable nav container, which could clip the absolutely positioned menu;
- fixed by rendering the active platform menu as a header-level overlay outside that overflow container.

Reddit sound UX:
- prefer warning **before** download rather than making the user discover a silent MP4 afterward;
- also show an after-click notice for silent/separate/unknown audio states;
- exact SEO intent is retained through **Reddit Video Downloader with Sound Check**;
- do not change this to an unconditional "downloads with sound" promise until audio/video muxing is implemented and verified.
