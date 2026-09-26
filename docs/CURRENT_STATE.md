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
- **SM-005C — Cloudflare migration: WORKER LIVE; main-branch build handoff still being stabilized**
- **SM-006 — SEO + analytics: IN PROGRESS**

## Version
`0.4.0`

## Infrastructure
- GitHub: `Hustler031/SaveMingo`
- Active development branch: `chatgpt/SM-006-seo-analytics`
- Primary runtime: Cloudflare Workers
- Worker URL: `https://savemingo.ashabup0.workers.dev`
- Vercel retained as rollback
- Custom domain `savemingo.com`: not cut over
- Database: not required

## SM-006 scope
- distinct Instagram search-intent landing pages
- how-to guide content
- sitemap + robots
- canonical metadata
- about/privacy/terms/copyright
- 404 experience
- internal links
- optional GA4 loader
- Search Console verification hook
- downloader funnel events

## Funnel events
- `paste_clicked`
- `resolve_started`
- `resolve_success`
- `resolve_failed`
- `download_clicked`

No pasted Instagram URL is intentionally attached to analytics events.

## External setup still pending
- Google Analytics property / Measurement ID
- Google Search Console property / verification
- custom-domain launch

The code must build and work without those IDs.
