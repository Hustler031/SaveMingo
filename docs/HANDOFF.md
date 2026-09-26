# Handoff

## Current milestone
**SM-005C — Cloudflare migration trial**

## Branch
`chatgpt/SM-005C-cloudflare`

## Completed
- branched from latest SM-005 reliability work
- ran official `vinext init --platform=cloudflare`
- selected no data cache, no CDN cache, no Images binding, no global prerender
- generated `vite.config.ts` and `wrangler.jsonc`
- generated package lock
- Cloudflare/vinext production build passed
- normal Next.js path remains present
- CI now validates both Next.js and vinext/Cloudflare builds
- local Cloudflare Windows helper scripts added

## Current blocker / owner action
Cloudflare account authorization and repository connection are required before the first real Worker Preview can be deployed.

Preferred setup:
- Cloudflare Workers & Pages
- import GitHub repository `Hustler031/SaveMingo`
- production branch: `main`
- enable preview builds for non-main branches
- do not connect `savemingo.com` yet

## After account connection
1. Deploy `chatgpt/SM-005C-cloudflare` preview.
2. Verify health endpoints.
3. Resolve a known public Reel.
4. Resolve a public carousel.
5. Verify same-origin media streaming/download.
6. Inspect Worker runtime logs for request IDs/errors.
7. Fix any Worker-runtime differences.
8. Merge Cloudflare + SM-005 reliability work only after the above passes.

## Rollback
Keep Vercel untouched during the trial.

## Next after successful Cloudflare trial
SM-006 — SEO + analytics.
