# Handoff

## Current milestone
**SM-008 — GA4 wiring**

## Branch
`chatgpt/SM-008-ga4-wiring`

## Production state
The Cloudflare Worker is live and launch-runtime verified at:
`https://savemingo.ashabup0.workers.dev`

SM-007 launch-readiness checks passed on production.

## GA4
- Property: SaveMingo
- Property ID: `properties/556072162`
- Stream: SaveMingo Web
- Measurement ID: `G-ZXK1PRVH6X`
- Analytics component loads the public Measurement ID by default.
- `NEXT_PUBLIC_GA_ID` remains available as an override.
- Funnel events are already instrumented.

## Search Console
`sc-domain:savemingo.com` is verified/readable in GSC Wizard.
No sitemap has been submitted yet by design.

## Domain blocker
Hostinger is temporarily preventing nameserver changes until approximately 2026-09-27 18:36 IST.

Target Cloudflare nameservers:
- `novalee.ns.cloudflare.com`
- `bob.ns.cloudflare.com`

Do not delete existing Hostinger/Vercel DNS records before the Cloudflare zone becomes active.

## After nameserver unlock
1. Save the two Cloudflare nameservers at Hostinger.
2. Wait for Cloudflare zone status = Active.
3. Attach `savemingo.com` to Worker `savemingo` as Custom Domain.
4. Configure `www.savemingo.com` redirect/canonical handling.
5. Run full launch-runtime smoke against the custom domain.
6. Submit `https://savemingo.com/sitemap.xml` in Search Console.
7. Inspect primary launch URLs and monitor indexing.
