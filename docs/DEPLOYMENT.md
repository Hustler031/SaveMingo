# Deployment

## Hosting strategy

### Primary target under trial
Cloudflare Workers using vinext.

### Rollback
Existing Vercel project remains intact until Cloudflare is proven with real Instagram resolver/media traffic.

## Environments

1. Local Next.js — port 3000
2. Local Cloudflare/vinext — port 3001
3. Cloudflare Worker Preview — branch testing
4. Cloudflare production Worker — main
5. Custom domain `savemingo.com` — only at approved launch

## Cloudflare project

Planned Worker name:
`savemingo`

Source repository:
`Hustler031/SaveMingo`

Production branch:
`main`

Cloudflare configuration:
- `vite.config.ts`
- `wrangler.jsonc`

## Preferred workflow

```text
task branch
→ GitHub CI
→ Next.js build
→ Cloudflare/vinext build
→ Cloudflare Worker Preview
→ health check
→ resolver/media smoke test
→ runtime-log audit
→ PR merge
→ main Worker deployment
→ custom-domain cutover only at approved launch
```

## Cloudflare Git integration

Use Cloudflare Workers Git integration for branch previews.

Preview builds must be enabled for non-main branches. Subsequent pushes should update the same branch Preview rather than creating unrelated manual environments.

## Secrets

Never commit:
- Cloudflare API tokens
- account credentials
- resolver credentials
- cookies
- auth headers

If CI deployment is needed later, use GitHub repository secrets for:
- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`

## Vercel rollback

Existing project:
- Project: `save-mingo`
- Project ID: `prj_e7MsyDZdG6Jp29NfRLpz6gYbMcrb`

Do not delete it during V1 migration.

## Domain

`savemingo.com` is not to be moved until the Cloudflare Worker Preview passes resolver, media delivery, mobile UI and failure-state audits.
