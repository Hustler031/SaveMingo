# Current State

Updated: 2026-09-26

## Product
SaveMingo — **Save anything you find online.**  
Supporting line: **Save it. Keep it.**

## Milestones
- **SM-001 — Foundation: COMPLETE**
- **SM-002 — Product UI / downloader states: COMPLETE**
- **SM-003 — Instagram resolver foundation: LIVE VERIFIED**
- **SM-004 — Photo + carousel + download delivery: READY TO MERGE**

## Version
`0.3.0`

## Infrastructure
- GitHub: `Hustler031/SaveMingo`
- Active PR: `#5`
- Active branch: `chatgpt/SM-004-photo-carousel-download`
- Vercel project: `save-mingo`
- Vercel project ID: `prj_e7MsyDZdG6Jp29NfRLpz6gYbMcrb`
- Custom domain `savemingo.com`: **not cut over yet**
- Database: not required
- Instagram credentials: not required

## SM-004 delivered
- single-photo normalization path
- ordered carousel normalization
- mixed image/video carousel handling
- all-or-nothing carousel safety
- restricted Meta CDN allow-list
- same-origin `/api/v1/media` streaming delivery
- byte-range forwarding
- safe filename/content-type handling
- real Download buttons
- structured media-delivery diagnostics

## Live verification
Verified in Vercel preview:
- public Reel: resolves successfully
- public carousel: resolves successfully
- media delivery: multiple real `200 video/mp4` streams through `/api/v1/media`
- source CDN host allow-list and redirect revalidation active

Observed transport behavior:
- some signed Instagram CDN URLs intermittently return 403
- fresh signed URLs subsequently stream successfully through the same route
- transport failures now log only sanitized host/status/content-type/timing fields

## Automated verification
- dependency install: PASS
- TypeScript: PASS
- ESLint: PASS
- Vitest: PASS
- 25 tests: PASS
- Next.js production build: PASS
- photo normalization tests: PASS
- mixed carousel tests: PASS
- media URL allow-list tests: PASS
- filename traversal hardening: PASS

## Single-photo live-fixture note
The single-photo normalization path is covered by automated tests. During this audit, two externally sourced sample photo shortcodes returned Instagram GraphQL execution errors, so a stable independent live single-photo fixture was not available. This is recorded as a verification limitation rather than silently claimed as live-proven.

## Next milestone
**SM-005 — Reliability / monitoring hardening**

Planned:
- resolver/media success-rate telemetry
- rate limiting
- timeout policy review
- Sentry integration
- health/status expansion
- operational dashboard groundwork
