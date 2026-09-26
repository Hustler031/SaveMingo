# Handoff

## Current milestone
**SM-007 — Launch readiness**

## Branch
`chatgpt/SM-007-launch-readiness`

## Completed before this milestone
- Cloudflare Worker migration
- reliability hardening
- live Reel resolver
- live carousel resolver
- live media streaming
- SEO landing-page cluster
- sitemap / robots / canonicals
- GA4-ready event instrumentation
- Search Console verification hook
- legal and informational pages

## SM-007 scope
- production SEO runtime assertions
- sitemap/robots runtime assertions
- custom 404 runtime assertion
- web manifest
- favicon/icon
- final launch checklist

## External steps after merge
- custom-domain Cloudflare route
- GA4 property / Measurement ID
- Search Console domain property / verification
- sitemap submission

## GSC Wizard
GSC Wizard is installed for post-domain Search Console/GA4 reporting. Use it once the `savemingo.com` property exists and Google has access to the launched domain.

## Domain rule
Do not move `savemingo.com` until the SM-007 Worker runtime audit passes.
