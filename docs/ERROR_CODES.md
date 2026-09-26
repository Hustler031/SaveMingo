# Error Codes

| Code | Meaning |
|---|---|
| SM-URL-001 | Invalid URL |
| SM-URL-002 | Unsupported URL/platform |
| SM-IG-101 | Instagram content not found |
| SM-IG-102 | Instagram content is private/inaccessible |
| SM-IG-103 | Media unavailable |
| SM-IG-104 | Resolver failed |
| SM-IG-105 | Upstream response changed |
| SM-API-201 | API timeout |
| SM-API-202 | Rate limited |
| SM-SRV-301 | Backend unavailable |
| SM-UI-401 | Frontend exception |

Operational errors should eventually include a code and request ID:

```text
SM-IG-104
Request: sm_7C9A23D102
```

Never expose internal stack traces to users.
