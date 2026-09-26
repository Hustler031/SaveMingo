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
