# Resolver Contract — Draft

Status: planned. No resolver exists in SM-001.

## Planned endpoint
```http
POST /api/v1/resolve
Content-Type: application/json
```

Request:
```json
{ "url": "https://www.instagram.com/reel/..." }
```

Success:
```json
{
  "success": true,
  "requestId": "sm_...",
  "platform": "instagram",
  "contentType": "reel",
  "media": []
}
```

Failure:
```json
{
  "success": false,
  "requestId": "sm_...",
  "error": {
    "code": "SM-IG-104",
    "message": "We couldn't process this public Instagram link."
  }
}
```

The public contract should stay stable even if internal Instagram strategy changes.
