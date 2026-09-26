# Handoff

## Last completed task
**SM-001 — SaveMingo Foundation**

## Verified build
- Main commit: `1ab3b08271338adc2851fadfc8b55c3fe9d26c7c`
- Vercel URL: `https://save-mingo.vercel.app/`
- CI: green
- Health endpoint: healthy
- Live UI smoke test: passed

## Current product behavior
The website is a functioning foundation UI:
- SaveMingo branding is visible.
- Invalid non-Instagram URLs show a clear validation error.
- Valid Instagram URLs are recognized.
- The UI explicitly states that the resolver is the next milestone.
- No fake download success is shown.

## Important production state
`savemingo.com` has NOT been switched to this project yet.

## Next task
**SM-002 — Product UI / downloader state system**

Suggested branch:
`chatgpt/SM-002-product-ui` or `codex/SM-002-product-ui`

Work:
1. Build reusable downloader state components.
2. Add dedicated Instagram downloader page shell.
3. Define normalized frontend result types.
4. Add loading, success-result, empty, and operational-error views.
5. Keep resolver calls mocked/not connected until the resolver milestone.
6. Run CI and live preview smoke tests.

## Infrastructure blocker for full agent observability
The ChatGPT Vercel connector currently cannot read the new SaveMingo Vercel project. The project exists and is publicly reachable, but the connector authorization must be extended to include it before agents can directly inspect its Vercel project settings/logs through that connector.

## Rule
Do not attach `savemingo.com` until the actual downloader is ready for launch.
