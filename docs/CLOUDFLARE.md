# Cloudflare Workers

## Status

Cloudflare migration trial started on 2026-09-26.

Branch:
`chatgpt/SM-005C-cloudflare`

The official `vinext init --platform=cloudflare` migration completed successfully and `npm run build:vinext` passed.

## Why vinext

Cloudflare currently recommends vinext for existing Next.js 16 applications on Workers.

The migration is intentionally non-destructive:
- normal Next.js development remains available,
- Vercel remains available as rollback,
- Cloudflare-specific configuration lives beside the existing Next.js application.

## Current Worker configuration

Worker name:
`savemingo`

Generated files:
- `vite.config.ts`
- `wrangler.jsonc`

Current V1 choices:
- data cache: none
- CDN cache: none
- Cloudflare Images optimizer: none
- prerender-all-routes: disabled
- `nodejs_compat`: enabled

We deliberately avoid KV, D1, R2, Images and other bindings until a real product requirement exists.

## Compatibility audit

Pre-migration vinext report:
- Next imports: supported
- App Router: supported
- route handlers: supported
- Tailwind CSS: compatible
- one partial item: `reactStrictMode` behavior for App Router
- one issue: missing ESM package mode

The initializer automatically fixed the ESM issue by adding `"type": "module"`.

Cloudflare production build then passed.

## Local development

Original Next.js:

```text
START_SAVEMINGO.cmd
http://localhost:3000
```

Cloudflare/vinext:

```text
START_SAVEMINGO_CLOUDFLARE.cmd
http://localhost:3001
```

Cloudflare-specific diagnostic build:

```text
CHECK_SAVEMINGO_CLOUDFLARE.cmd
```

## Deployment prerequisites

Do not place Cloudflare credentials in GitHub source.

Deployment needs one of:
1. Cloudflare GitHub integration, preferred for branch previews; or
2. CI credentials using `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID`.

For the first trial, prefer Cloudflare's GitHub integration so branch previews are created and updated automatically.

## Deployment gate

Before connecting `savemingo.com`, verify on a `workers.dev` / Worker Preview URL:

1. `/`
2. `/api/health`
3. `/api/health/resolver`
4. public Reel resolution
5. public carousel resolution
6. media download streaming
7. Range request behavior
8. invalid URL and upstream failure states
9. runtime logs contain request IDs and no secrets

## Rollback

Do not delete the Vercel project during the Cloudflare trial.

If Cloudflare egress causes Instagram/Meta failures that do not occur on Vercel, keep the frontend on Cloudflare only if useful and move the resolver/media transport to a separate backend. Do not force the resolver onto Cloudflare merely to preserve a hosting decision.

## Domain

`savemingo.com` must remain unchanged until the Cloudflare preview passes all launch-critical tests.


## Live Workers verification — 2026-09-26

Worker:
`https://savemingo.ashabup0.workers.dev`

A reusable GitHub Actions runtime smoke test directly hit the deployed Worker and passed:

```text
PASS homepage 200
PASS health 0.4.0 SM-005-reliability
PASS resolver health 0.4.0
PASS invalid-url contract SM-URL-001
PASS reel resolve reel 1
PASS carousel resolve carousel 2
PASS media delivery 206 video/mp4
ALL CLOUDFLARE RUNTIME SMOKE TESTS PASSED
```

This proves:
- Workers can reach the current Instagram resolver upstreams.
- the normalized resolver API works on Cloudflare.
- signed Meta CDN media can be streamed through the Worker.
- Range requests propagate successfully.
- request IDs survive the Cloudflare runtime path.

The Vercel project remains available as rollback until post-launch stability is established.

## SM-014 — Cloudflare Containers for Reddit sound mux

Cloudflare Containers are the preferred production runtime for
`services/reddit-mux/`. Render is not part of the launch architecture.

Current Cloudflare requirements verified against the September 2026 official
documentation:

- Containers require the Workers Paid plan.
- A Container application is declared with a container definition, Durable
  Object binding, and `new_sqlite_classes` migration.
- Container disk is ephemeral, which matches SaveMingo's temporary-media
  requirement.
- A Worker can call another private Worker through a Service Binding without a
  public URL.
- Service Binding targets must be deployed before the calling Worker.
- Stateless Container routing currently uses a fixed instance count; built-in
  autoscaling is not assumed.

SaveMingo therefore deploys in this order:

1. `savemingo-reddit-mux` Worker + Container;
2. `savemingo` Worker with private `REDDIT_MUX` Service Binding;
3. verify `/api/health/reddit-mux`;
4. run the production Reddit audible-mux smoke;
5. verify video-only fallback and all non-mux platform health.

Configuration:

- `services/reddit-mux/Dockerfile`
- `services/reddit-mux/worker.mjs`
- `services/reddit-mux/wrangler.jsonc`
- root `worker/index.ts`
- root `wrangler.jsonc`

### Cost posture

The launch profile uses two possible `basic` instances and sleeps idle
instances after 30 seconds. FFmpeg uses stream copy, so CPU demand should be
materially lower than transcoding. The Workers Paid plan includes a monthly
allocation of Container memory, CPU, and disk before overage billing. Container
usage and network egress must be watched after launch; do not raise instance
count or file limits until real traffic justifies it.

Official references:
- https://developers.cloudflare.com/containers/
- https://developers.cloudflare.com/containers/pricing/
- https://developers.cloudflare.com/containers/configuration/wrangler/
- https://developers.cloudflare.com/workers/runtime-apis/bindings/service-bindings/

