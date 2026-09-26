# Handoff

## Completed milestone
**SM-003 — Instagram resolver foundation**

## Branch / PR
- branch: `chatgpt/SM-003-instagram-resolver`
- PR: `#4`

## Proven working
A real public Instagram Reel resolved successfully through the deployed Vercel API.

Test URL:
`https://www.instagram.com/reel/DH56yy7p3lZ/`

Backend proof:
```text
requestId: sm_D52CC37321
status: 200
provider: graphql
strategy: graphql-video-versions
contentType: reel
mediaCount: 1
durationMs: 1135
```

UI proof:
- Video 1 rendered
- 720×1280
- Open media link rendered and pointed at direct Instagram CDN MP4

## Resolver provider order
1. `public-page`
2. `graphql`

Public HTML is retained as a cheap first strategy even though the live test required GraphQL fallback.

## Important files
- `app/api/v1/resolve/route.ts`
- `resolver/instagram/index.ts`
- `resolver/instagram/public-page-provider.ts`
- `resolver/instagram/graphql-provider.ts`
- `resolver/instagram/parse.ts`
- `lib/downloader/validation.ts`
- `components/downloader/Downloader.tsx`
- `components/downloader/ResultCard.tsx`

## Maintenance
The current anonymous GraphQL query document ID has a default in code. If Instagram rotates it, prefer setting:
`INSTAGRAM_GRAPHQL_DOC_ID`
in Vercel rather than redesigning the resolver.

## Next milestone
**SM-004 — Photo + carousel + download delivery**

Goals:
1. Normalize public photo posts.
2. Normalize carousel children, including mixed image/video.
3. Keep item order.
4. Upgrade the result card for multiple media items.
5. Add a safe same-origin media delivery/download route instead of relying only on a cross-origin CDN link.
6. Test several real public post types before claiming support.

## Production rule
Do not move `savemingo.com` to SaveMingo until the full V1 Instagram scope is working and audited.
