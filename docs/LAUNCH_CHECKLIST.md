# SaveMingo Launch Checklist

## Repository / build

- [ ] Consolidation PR is the only path from SM-014 into `main`
- [ ] `npm run typecheck`
- [ ] `npm run lint`
- [ ] `npm run test`
- [ ] `npm run build`
- [ ] `npm run build:vinext`
- [ ] Reddit mux Cloudflare Worker dry-run
- [ ] Reddit mux Docker image build + health smoke
- [ ] Fresh-main verification repeats all of the above after merge
- [ ] No secrets or credentials committed

## Production UI / SEO

- [x] V2 homepage promoted to `/`
- [x] V2 Instagram routes promoted
- [x] X/Twitter production intent routes created
- [x] Pinterest/Reddit/TikTok production routes created but remain `noindex`
  until their runtime gates pass
- [x] Canonicals use `https://savemingo.com`
- [x] Indexable routes are the only platform routes emitted in sitemap
- [x] Legacy `/v2-preview/*` remains noindex and is blocked in robots
- [x] Internal platform/sibling links use production URLs
- [x] Homepage WebSite/WebApplication structured data added
- [x] Legal/company links remain available in production footer
- [ ] Production mobile + desktop visual smoke
- [ ] Production dropdown keyboard/click smoke
- [ ] Production light + dark theme smoke
- [ ] Broken-link crawl passes

## Platform isolation / regression

- [ ] Instagram Reel real resolve + download
- [ ] Instagram carousel real resolve + multi-item download
- [ ] Instagram photo real resolve + download
- [ ] X/Twitter real video resolve + download
- [ ] X/Twitter real image/multi-image resolve + download
- [ ] Pinterest real verified fixture before removing noindex
- [ ] Reddit real video/image/GIF fixtures before removing noindex
- [ ] TikTok real video + photo/slideshow + short-link fixtures before removing noindex
- [ ] Stop/fail one platform path and prove unrelated adapters still resolve
- [ ] All per-platform health endpoints return independently

## Reddit video with sound — Cloudflare Container

- [x] FFmpeg remains outside the shared Worker
- [x] `services/reddit-mux/Dockerfile` added
- [x] isolated `savemingo-reddit-mux` Worker/Container config added
- [x] main Worker uses private `REDDIT_MUX` Service Binding
- [x] mux Worker is configured with no public `workers.dev` route
- [x] `v.redd.it` input/redirect allow-list preserved
- [x] temporary files are deleted and container disk is ephemeral
- [x] 150 MiB per-input limit, 25 s fetch timeout, 60 s FFmpeg timeout
- [x] Reddit video-only fallback remains separate
- [ ] Workers Paid / Containers enabled on the Cloudflare account
- [ ] Deploy `savemingo-reddit-mux` before main Worker
- [ ] `/api/health/reddit-mux` reports healthy + FFmpeg
- [ ] Production-style real Reddit separate-audio fixture reaches mux
- [ ] Merged MP4 contains a non-silent audio stream
- [ ] Deliberate mux outage leaves Reddit video-only usable
- [ ] Deliberate mux outage does not affect Instagram/X/Pinterest/TikTok/site
- [ ] Review Container memory/CPU/disk/network usage after launch

## Analytics / discovery

- [x] GA4 Measurement ID `G-ZXK1PRVH6X` wired
- [x] funnel events implemented
- [x] resolve/download analytics include platform dimension
- [x] Search Console domain property documented as verified/readable
- [ ] Verify GA4 realtime `page_view`
- [ ] Verify `paste_clicked`, `resolve_started`, `resolve_success`,
  `resolve_failed`, `download_clicked`
- [ ] Custom domain serves final production Worker
- [ ] `www` redirects/canonicalizes to apex
- [ ] HTTPS active
- [ ] robots and sitemap reachable on custom domain
- [ ] Submit `https://savemingo.com/sitemap.xml`
- [ ] Request indexing only for verified/indexable primary routes
- [ ] Confirm Search Console can fetch homepage + primary platform routes

## Rollback

- [x] Existing Vercel project retained as website rollback
- [x] Mux failure is a feature degradation, not a site-wide dependency
- [ ] Record final pre-launch main SHA
- [ ] Record final deployed mux Worker version/image
- [ ] Verify Cloudflare rollback path for both Workers
- [ ] Keep Vercel rollback available during early production
