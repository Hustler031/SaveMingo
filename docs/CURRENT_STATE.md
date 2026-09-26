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
