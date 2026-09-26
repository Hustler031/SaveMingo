# Handoff

## Current milestone
**SM-005C — Cloudflare migration trial: LIVE VERIFIED**

## Branch
`chatgpt/SM-005C-cloudflare`

## Worker
`https://savemingo.ashabup0.workers.dev`

## Completed
- SM-005 reliability hardening included
- official vinext Cloudflare migration
- `vite.config.ts` and `wrangler.jsonc`
- locked package tree
- Cloudflare-compatible Windows local helpers
- CI validates Next.js + Cloudflare builds
- Cloudflare GitHub integration connected
- Worker deployed successfully
- reusable live runtime smoke workflow added

## Live runtime verification
GitHub Actions verified:
- homepage `200`
- health API healthy
- resolver health healthy
- invalid URL contract `SM-URL-001`
- public Reel → 1 video
- public carousel → 2 items
- media delivery → `206 video/mp4`

Cloudflare egress therefore works for the current Instagram resolver and media-delivery architecture.

## Immediate next step
Merge PR #7 once final branch-head checks are green.

After merge, the Cloudflare dashboard production branch must be changed from:
`chatgpt/SM-005C-cloudflare`

to:
`main`

Then verify the main deployment with the same runtime smoke.

## Domain
Do not attach/move `savemingo.com` yet.

## Rollback
Keep Vercel project `save-mingo` intact during early Cloudflare production.

## Known audit item
Independent live single-photo fixture remains pending; photo normalization is unit-verified.

## Next milestone
**SM-006 — SEO + analytics**
