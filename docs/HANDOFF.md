# Handoff

## Current milestone
**SM-004 — Photo + carousel + download delivery**

## Branch / PR
- branch: `chatgpt/SM-004-photo-carousel-download`
- PR: `#5`

## Implemented
- photo normalization
- ordered mixed carousel normalization
- restricted Meta CDN allow-list
- same-origin media streaming
- byte-range forwarding
- safe filenames/content types
- Download buttons
- structured transport logs

## Live proof
Vercel preview logs confirmed:
- Reel resolver success
- Carousel resolver success
- repeated `GET /api/v1/media 200` responses
- `video/mp4` streamed through SaveMingo
- example successful media request IDs include `sm_CA333937B8`, `sm_D593FCB4B2`, `sm_50CBF5D502`

## Important transport finding
Instagram signed CDN URLs can intermittently return 403. The media route now:
1. validates the source hostname against `cdninstagram.com` / `fbcdn.net`
2. retries 401/403 once without the Instagram Referer
3. validates every redirect
4. emits sanitized diagnostics only
5. never stores media permanently

## Verification limitation
A stable live single-photo fixture could not be independently confirmed during this audit; sample shortcodes sourced from third-party documentation returned `SM-IG-105`. Photo normalization itself has passing unit coverage.

## Next milestone
**SM-005 — Reliability / monitoring hardening**

Start from `main` after PR #5 is merged.
