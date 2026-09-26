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
