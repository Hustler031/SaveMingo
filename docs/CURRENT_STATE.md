# Current State

Updated: 2026-09-26

## Product
SaveMingo — **Save anything you find online.**  
Supporting line: **Save it. Keep it.**

## Milestones
- **SM-001 — Foundation: COMPLETE**
- **SM-002 — Product UI / downloader states: COMPLETE**
- **SM-003 — Instagram resolver foundation: LIVE VERIFIED**
- **SM-004 — Photo + carousel + download delivery: MERGED**
- **SM-005 — Reliability / monitoring hardening: IN PROGRESS**

## Version
`0.4.0`

## Infrastructure
- GitHub: `Hustler031/SaveMingo`
- Active branch: `chatgpt/SM-005-reliability`
- Vercel project: `save-mingo`
- Vercel project ID: `prj_e7MsyDZdG6Jp29NfRLpz6gYbMcrb`
- Custom domain `savemingo.com`: **not cut over yet**
- Database: not required
- Instagram credentials: not required

## SM-004 live proof retained
- public Reel resolver success
- public carousel resolver success
- repeated real `GET /api/v1/media 200`
- `video/mp4` streamed through SaveMingo
- signed CDN 403 behavior documented and diagnosed

## SM-005 scope
- structured operational event helper
- request-rate protection
- explicit request-body ceiling
- centralized reliability policy
- standardized version/rate-limit headers
- health/status expansion
- Sentry readiness/documentation
- reliability tests

## Rate-limit design
V1 uses best-effort per-instance fixed-window limits. This deliberately avoids introducing a database only for throttling. It is not claimed as globally distributed protection.

## Single-photo verification note
Single-photo normalization remains unit-verified. Stable independent live-photo fixture verification remains a known audit item; the resolver does not falsely advertise it as live-verified.

## External monitoring
Sentry credentials are not configured yet. Vercel logs + request IDs remain the active observability path until Sentry is connected.
