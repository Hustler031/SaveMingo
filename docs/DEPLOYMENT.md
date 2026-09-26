# Deployment

## Production topology

Primary runtime:

- `savemingo` — Cloudflare Worker running the Next.js/vinext website, API,
  platform adapters, media proxy, SEO and analytics.
- `savemingo-reddit-mux` — private Cloudflare Worker that owns the isolated
  Reddit FFmpeg Container.
- `REDDIT_MUX` — private Service Binding from `savemingo` to
  `savemingo-reddit-mux`.
- Vercel `save-mingo` remains a rollback for the website during early launch.
  It is not the production Reddit mux runtime.

## Deployment order

Service bindings require the downstream Worker to exist first.

1. Run repository verification: `npm run check`.
2. Validate/build the Reddit Container in CI.
3. Ensure the Cloudflare account has Workers Paid / Containers enabled.
4. Deploy the mux service first:

```text
npx wrangler deploy --config services/reddit-mux/wrangler.jsonc
```

5. Verify the mux Worker/Container deployment in Cloudflare.
6. Deploy the main Worker:

```text
npm run deploy:vinext
```

7. Verify:
   - `/api/health`
   - `/api/health/resolver`
   - every per-platform health endpoint
   - `/api/health/reddit-mux`
8. Run `services/reddit-mux/production-smoke.mjs` against the deployed main
   Worker. It verifies a real separate-audio Reddit fixture, downloads the
   merged MP4, and uses FFmpeg `volumedetect` to prove the output has a
   non-silent audio stream.
9. Stop/disable the mux service deliberately and verify Reddit video-only
   fallback plus a non-Reddit resolve.
10. Only after runtime smoke passes, attach/cut over `savemingo.com`.
11. Verify apex HTTPS, `www` redirect, canonical, robots, sitemap and GA4.
12. Submit the production sitemap and primary verified URLs to Search Console.

## Secrets

Never commit Cloudflare tokens, cookies, account credentials, or media signing
material.

Cloudflare production uses a private Service Binding for Reddit mux and does
not require a mux bearer secret. The `REDDIT_MUX_SERVICE_URL` /
`REDDIT_MUX_SERVICE_TOKEN` path is retained only for local/non-Cloudflare
fallback testing.

CI deployment credentials, if used, belong only in repository secrets:
- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`

## Rollback

Website rollback:
- keep the existing Vercel project intact;
- revert the main Worker to the last verified main SHA if a Cloudflare release
  fails.

Mux rollback:
- roll back or disable `savemingo-reddit-mux`;
- do not roll back the entire site merely because mux is unhealthy;
- `SM-RD-107` must degrade only Reddit merged-with-sound;
- Reddit video-only and every other platform must remain usable.

## Domain

The canonical origin is `https://savemingo.com`. Do not submit the sitemap
or request indexing until the custom domain serves the verified production
Worker and canonical/HTTPS checks pass.
