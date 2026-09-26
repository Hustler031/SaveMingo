# Current State

Updated: 2026-09-26

## Product
SaveMingo — **Save anything you find online.**  
Supporting line: **Save it. Keep it.**

## Milestones
- **SM-001 — Foundation: COMPLETE**
- **SM-002 — Product UI / downloader states: IN PROGRESS**

## Version
`0.1.0`

## Environment
- GitHub repository: `Hustler031/SaveMingo`
- Active branch: `chatgpt/SM-002-product-ui`
- Vercel project ID: `prj_e7MsyDZdG6Jp29NfRLpz6gYbMcrb`
- Vercel connector access: **WORKING**
- Custom production domain: `savemingo.com`
- SaveMingo custom-domain cutover: **NOT YET DONE**
- Instagram resolver: **not configured**
- Database: **not required**
- Authentication: **not required**

## SM-002 implemented
- Reusable downloader state machine
- Idle / validating / validated / error UI states
- Standard UI-layer error codes + request IDs
- Central Instagram URL validation module
- Resolver-ready response/media TypeScript types
- Reusable future media result card
- Shared site header/footer
- Rebuilt homepage using the reusable downloader
- Dedicated `/instagram-downloader` page
- Page-specific metadata/canonical handling
- Clear public-links-only product messaging

## Important behavior
Valid Instagram links are recognized but media is NOT resolved yet. The interface explicitly states this in the Day 2 preview so no fake download success is shown.

## Remaining before SM-002 closes
- CI validation
- Vercel preview deployment
- Desktop/mobile visual smoke test
- Interaction smoke test
- Fix any discovered issues
- Merge verified PR

## Next milestone after SM-002
**SM-003 — Resolver foundation**
- normalized `POST /api/v1/resolve` contract
- platform routing
- initial real public Instagram Reel/video resolution
