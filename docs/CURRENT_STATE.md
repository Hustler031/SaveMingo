# Current State

Updated: 2026-09-26

## Product
SaveMingo — **Save anything you find online.**  
Supporting line: **Save it. Keep it.**

## Milestones
- **SM-001 — Foundation: COMPLETE**
- **SM-002 — Product UI / downloader states: COMPLETE**
- **SM-003 — Instagram resolver foundation: LIVE VERIFIED**
- **SM-004 — Photo + carousel + download delivery: MERGED**
- **SM-005 — Reliability / monitoring hardening: CODE + CI VERIFIED, awaiting new-host runtime verification**
- **SM-005C — Cloudflare migration trial: CONFIGURED + BUILD VERIFIED, account connection pending**

## Version
`0.4.0`

## Infrastructure
- GitHub: `Hustler031/SaveMingo`
- Active branch: `chatgpt/SM-005C-cloudflare`
- Primary hosting target under trial: Cloudflare Workers
- Cloudflare Worker name: `savemingo`
- Vercel project: `save-mingo` retained as rollback
- Vercel project ID: `prj_e7MsyDZdG6Jp29NfRLpz6gYbMcrb`
- Custom domain `savemingo.com`: **not cut over**
- Database: not required
- Instagram credentials: not required

## Cloudflare migration status
- official vinext initializer: PASS
- vinext compatibility scan: acceptable
- `vite.config.ts`: generated
- `wrangler.jsonc`: generated
- locked npm dependency tree: generated
- Cloudflare/vinext production build: PASS
- GitHub dual-build CI: enabled
- Cloudflare account/Git integration: pending owner authorization
- Workers runtime Instagram tests: pending deployment

## Reliability retained
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

## Hosting decision rule
Cloudflare becomes primary only if real resolver and media-stream tests pass from the Workers network. Vercel remains rollback until then.
