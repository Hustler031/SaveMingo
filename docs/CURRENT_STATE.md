# Current State

Updated: 2026-09-26

## Product
SaveMingo — **Save anything you find online.**  
Supporting line: **Save it. Keep it.**

## Milestones
- **SM-001 — Foundation: COMPLETE**
- **SM-002 — Product UI / downloader states: COMPLETE**
- **SM-003 — Instagram resolver foundation: LIVE VERIFIED**

## Version
`0.2.0`

## Infrastructure
- GitHub: `Hustler031/SaveMingo`
- Active PR: `#4`
- Active branch: `chatgpt/SM-003-instagram-resolver`
- Vercel project: `save-mingo`
- Vercel project ID: `prj_e7MsyDZdG6Jp29NfRLpz6gYbMcrb`
- Custom domain `savemingo.com`: **not cut over yet**
- Database: not required
- Instagram credentials: not required

## Resolver architecture
```text
Browser
  → POST /api/v1/resolve
  → URL validation
  → Instagram public-page provider
  → if needed: anonymous Instagram GraphQL provider
  → normalized SaveMingo media/error response
  → UI result card
```

## Live verification
Public Reel tested:
`https://www.instagram.com/reel/DH56yy7p3lZ/`

Verified result:
- HTTP: 200
- provider: `graphql`
- strategy: `graphql-video-versions`
- content type: `reel`
- media count: 1
- resolution returned: 720×1280
- request ID: `sm_D52CC37321`
- resolver duration: 1135 ms
- direct Instagram CDN media URL returned
- UI displayed active **Open media** action

## Automated verification
- dependency install: PASS
- TypeScript: PASS
- ESLint: PASS
- Vitest: PASS
- Next.js production build: PASS
- URL validation tests: PASS
- HTML/Relay parser tests: PASS
- GraphQL normalization tests: PASS

## Reliability notes
- Instagram's ordinary anonymous Reel HTML currently contains the shortcode but may omit all usable media fields.
- SaveMingo therefore keeps that cheap route as strategy A and falls back to anonymous GraphQL as strategy B.
- Current GraphQL document ID has a built-in default and can be overridden through `INSTAGRAM_GRAPHQL_DOC_ID` if Instagram rotates it.
- Every resolver failure/success is traceable by request ID in Vercel logs.
- No media is permanently stored.

## Current supported scope
- Public Instagram Reel/video: **working**
- Public photo: next
- Public carousel/mixed carousel: next
- Private content: intentionally unsupported
- Guaranteed file-download proxy: not yet implemented; current success returns an **Open media** URL.

## Next milestone
**SM-004 — Photo + carousel + download delivery**
