# Handoff

## Current milestone
**SM-006 — SEO + analytics**

## Branch
`chatgpt/SM-006-seo-analytics`

## Starting point
Cloudflare Worker is live and has passed runtime smoke tests for:
- homepage
- health
- public Reel
- public carousel
- partial media streaming

The custom domain is not attached yet.

## SM-006 work
- Instagram SEO landing-page cluster
- unique metadata and canonicals
- sitemap.xml and robots.txt
- how-to content page
- About / Privacy / Terms / Copyright
- 404 page
- internal linking
- GA4-ready optional analytics loader
- Search Console verification env hook
- product funnel event instrumentation

## External account dependency
GA4 and Search Console remain unconfigured until the user connects those services. The site must remain fully functional without analytics IDs.

## Important privacy rule
Do not send the pasted Instagram URL, signed CDN URL, request ID, or other potentially sensitive values as analytics event parameters.

## Next after SM-006
- verify generated SEO routes in Cloudflare preview
- connect GA4
- connect Search Console
- custom-domain launch audit
