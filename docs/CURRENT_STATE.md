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
- **SM-005C — Cloudflare migration trial: LIVE VERIFIED**

## Version
`0.4.0`

## Infrastructure
- GitHub: `Hustler031/SaveMingo`
- Migration branch: `chatgpt/SM-005C-cloudflare`
- Primary hosting target: Cloudflare Workers
- Cloudflare Worker: `savemingo`
- Verified Worker URL: `https://savemingo.ashabup0.workers.dev`
- Vercel project: `save-mingo` retained as rollback
- Vercel project ID: `prj_e7MsyDZdG6Jp29NfRLpz6gYbMcrb`
- Custom domain `savemingo.com`: **not cut over**
- Database: not required
- Instagram credentials: not required

## Cloudflare migration proof
- official vinext initializer: PASS
- vinext compatibility scan: acceptable
- locked dependency install: PASS
- TypeScript: PASS
- ESLint: PASS
- unit tests: PASS
- Next.js fallback build: PASS
- Cloudflare/vinext build: PASS
- Cloudflare deployment: PASS
- GitHub-to-Cloudflare integration: PASS

## Cloudflare runtime smoke proof
Executed from GitHub Actions against the public Worker URL:
- homepage: `200`
- `/api/health`: healthy, version `0.4.0`
- `/api/health/resolver`: healthy
- invalid URL: `SM-URL-001`
- public Reel: resolved as `reel`, 1 video item
- public carousel: resolved as `carousel`, 2 media items
- media delivery: `206 Partial Content`, `video/mp4`
- SaveMingo request IDs present throughout

The reusable smoke workflow is:
`.github/workflows/cloudflare-runtime-smoke.yml`

## Reliability
- structured operational events
- request IDs
- best-effort per-instance rate limiting
- resolver/media timeouts
- media CDN allow-list
- signed-CDN retry diagnostics
- request-size protection
- health endpoints

## Known audit item
Single-photo normalization remains unit-verified; a stable independent live single-photo fixture remains pending.

## Next actions
1. Merge PR #7 after final checks are green.
2. Change Cloudflare production branch from `chatgpt/SM-005C-cloudflare` back to `main`.
3. Verify the resulting main-branch Worker deployment with the runtime smoke.
4. Keep Vercel available as rollback.
5. Start **SM-006 — SEO + analytics**.
6. Do not move `savemingo.com` until launch review is complete.
