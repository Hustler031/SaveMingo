# Handoff

## Current milestone
**SM-002 — Product UI / downloader state system**

## Status
Verified and ready to merge through PR #3.

## Active branch
`chatgpt/SM-002-product-ui`

## Verified deployment
- Deployment: `dpl_FGnFSsnVnbRRwAnXhFWMRuw4gVoj`
- Branch alias: `https://save-mingo-git-chatgpt-sm-002-product-ui-hustler031s-projects.vercel.app`
- CI: green
- Runtime error/warning scan: clean

## Delivered
- `components/downloader/Downloader.tsx`
  - idle
  - validating
  - validated
  - error
- `components/downloader/ResultCard.tsx`
  - normalized future media result renderer
- `lib/downloader/types.ts`
  - resolver/UI contract types
- `lib/downloader/validation.ts`
  - centralized Instagram URL validation
- `/instagram-downloader`
  - dedicated tool landing page
- shared header/footer
- homepage rebuilt around reusable downloader

## Smoke tests passed
- homepage branding/navigation
- non-Instagram link -> custom error
- error code + request ID visible
- Reel link -> validating -> recognized link
- explicit no-resolver-yet state
- Instagram downloader content sections
- FAQ/footer
- no broken navigation
- no obvious overflow/overlap in tested viewport
- no false download-success claim

## Mobile note
The automation runner could not switch to a device-emulation viewport. The implementation uses mobile-first single-column defaults with `sm`/`lg` expansion and was code-reviewed for narrow layouts. A real mobile device check remains useful before the custom-domain launch, but it is not a blocker for this internal milestone.

## Next task
**SM-003 — Resolver foundation**

Suggested branch:
`chatgpt/SM-003-instagram-resolver` or `codex/SM-003-instagram-resolver`

SM-003 should:
1. Implement the normalized `POST /api/v1/resolve` boundary.
2. Keep platform-specific logic isolated.
3. Start with public Reel/video support.
4. Return standardized SaveMingo errors/request IDs.
5. Connect success/error output into the existing Downloader state machine.
6. Add integration tests before claiming real download support.

## Production rule
Do not attach `savemingo.com` until real media resolution is working and audited.
