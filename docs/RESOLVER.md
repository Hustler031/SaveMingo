# Resolver Contract

Status: **implemented and live-verified for public Reel/video media**

## API
```http
POST /api/v1/resolve
Content-Type: application/json
```

Request:
```json
{
  "url": "https://www.instagram.com/reel/SHORTCODE/"
}
```

Successful response:
```json
{
  "success": true,
  "requestId": "sm_...",
  "platform": "instagram",
  "contentType": "reel",
  "sourceUrl": "https://www.instagram.com/reel/SHORTCODE/",
  "media": [
    {
      "id": "media-1",
      "type": "video",
      "url": "https://...instagram-cdn...mp4",
      "thumbnailUrl": "https://...",
      "quality": "Source",
      "width": 720,
      "height": 1280
    }
  ]
}
```

Failure:
```json
{
  "success": false,
  "requestId": "sm_...",
  "error": {
    "code": "SM-IG-105",
    "message": "..."
  }
}
```

## Provider chain
### 1. Public page
- no login
- validates redirects remain on Instagram
- bounded response size and timeout
- understands Open Graph, embedded video fields, and shortcode-scoped `video_versions` when exposed

### 2. Anonymous GraphQL
- bootstraps an anonymous CSRF session
- uses Instagram's public web GraphQL post metadata query
- normalizes `video_versions`
- document ID is overrideable with `INSTAGRAM_GRAPHQL_DOC_ID`

## Observability
Every request receives a SaveMingo request ID and structured Vercel log event:
- `resolve.success`
- `resolve.failed`
- `resolve.rejected`
- `resolve.exception`

Logs contain provider/strategy, content type, media count or sanitized diagnostic flags, and duration. They do not log full media URLs.

## Current limitations
- photo/carousel normalization: SM-004
- same-origin guaranteed file delivery: SM-004
- private-account bypass: intentionally not supported
