# Handoff

## Active task
**SM-002 — Product UI / downloader state system**

## Active branch
`chatgpt/SM-002-product-ui`

## Goal
Finish a polished resolver-ready UI before connecting real Instagram extraction.

## Implemented
- `components/downloader/Downloader.tsx`
  - idle
  - validating
  - validated
  - error
- `components/downloader/ResultCard.tsx`
  - future normalized media result renderer
- `lib/downloader/types.ts`
  - shared resolver/UI contract types
- `lib/downloader/validation.ts`
  - centralized Instagram URL validation
- `/instagram-downloader`
  - dedicated tool landing page
- shared header/footer
- homepage rebuilt around the reusable downloader

## Current safety/product behavior
- Public Instagram links only
- No Instagram login
- No private-content bypass
- No fake media result
- A recognized link is labeled as resolver-ready, not downloaded

## Next actions
1. Run CI.
2. Inspect Vercel preview generated from this branch.
3. Test homepage and `/instagram-downloader` on desktop and mobile.
4. Test invalid URL and valid Reel/post URL states.
5. Inspect preview runtime/build logs if anything fails.
6. Fix issues.
7. Merge PR after green verification.
8. Update `CURRENT_STATE.md` and this handoff with final preview/deployment details.

## Following milestone
SM-003 connects the real resolver to the state machine through the normalized API contract.
