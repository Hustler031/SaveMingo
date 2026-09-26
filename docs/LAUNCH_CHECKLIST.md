# SaveMingo Launch Checklist

## Code / runtime

- [x] Cloudflare Workers runtime verified
- [x] Public Reel resolver verified
- [x] Carousel resolver verified
- [x] Partial media streaming verified
- [x] Request IDs and error codes verified
- [x] SEO landing pages implemented
- [x] Sitemap and robots implemented
- [x] Canonical URLs implemented
- [x] About / Privacy / Terms / Copyright implemented
- [x] GA4 event plumbing implemented
- [x] Search Console verification hook implemented
- [x] Web manifest and icon implemented
- [x] Custom 404 implemented
- [ ] SM-007 launch-runtime smoke passes on production

## Accounts

- [ ] Google Analytics 4 property created/connected
- [ ] `NEXT_PUBLIC_GA_ID` configured in Cloudflare
- [ ] Google Search Console property for `savemingo.com`
- [ ] Domain ownership verified
- [ ] Sitemap submitted in Search Console

## Domain

- [ ] Attach `savemingo.com` to the verified Cloudflare Worker
- [ ] Attach/redirect `www.savemingo.com`
- [ ] HTTPS active
- [ ] Apex canonical is `https://savemingo.com`
- [ ] `robots.txt` reachable on custom domain
- [ ] `sitemap.xml` reachable on custom domain
- [ ] Full launch-runtime smoke passes on custom domain

## After launch

- [ ] Submit homepage and primary downloader URLs for indexing
- [ ] Verify GA4 realtime page view
- [ ] Verify `resolve_started`, `resolve_success`, `resolve_failed`, `download_clicked`
- [ ] Monitor Cloudflare error rate and Worker CPU
- [ ] Keep Vercel rollback available during early production
- [ ] Review Search Console indexing and queries after data appears
