# Resolver Contract

Status: **implemented for Reel/video, photo, and carousel normalization; live-verified for Reel + carousel and same-origin media delivery**

## Resolve API
```http
POST /api/v1/resolve
Content-Type: application/json
```

Request:
```json
{ "url": "https://www.instagram.com/p/SHORTCODE/" }
```

Success:
```json
{
  "success": true,
  "requestId": "sm_...",
  "platform": "instagram",
  "contentType": "reel | video | photo | carousel",
  "sourceUrl": "https://www.instagram.com/...",
  "media": [
    {
      "id": "media-1",
      "type": "video | image",
      "url": "https://...instagram-cdn...",
      "thumbnailUrl": "https://...",
      "quality": "Source | Image",
      "width": 1080,
      "height": 1350
    }
  ]
}
```

## Provider chain
1. public page
2. anonymous Instagram GraphQL fallback

GraphQL normalizes:
- `video_versions`
- `image_versions2.candidates`
- `carousel_media`

Carousel normalization is all-or-nothing to avoid silently dropping children.

## Download delivery
```http
GET /api/v1/media?src=<signed-meta-cdn-url>&name=<safe-name>
```

Security:
- HTTPS only
- `cdninstagram.com` / `fbcdn.net` only, including subdomains
- redirect target revalidation
- userinfo and non-standard ports rejected
- declared size cap
- video/image content-type validation
- filename sanitization
- no permanent storage

## Observability
Resolver events:
- `resolve.success`
- `resolve.failed`
- `resolve.rejected`
- `resolve.exception`

Media events:
- `media.success`
- `media.failed`
- `media.retry_without_referer`
- `media.invalid_content_type`
- `media.too_large`

Signed media URLs are not written to logs.

## Verification notes
- Reel: live verified
- Carousel: live verified
- Same-origin video delivery: live verified with repeated HTTP 200 streams
- Single-photo normalization: automated tests pass; independent live fixture remained inconclusive during the audit
- Private-account bypass: intentionally unsupported
