# Error Codes

SaveMingo exposes stable public error codes together with a request ID. Platform
namespaces are isolated so an upstream change in one downloader does not get
reported as another platform's failure.

| Code | Meaning |
|---|---|
| SM-URL-001 | Invalid URL |
| SM-URL-002 | Unsupported URL/platform |
| SM-IG-101 | Instagram content not found |
| SM-IG-102 | Instagram content is private/inaccessible |
| SM-IG-103 | Instagram media unavailable |
| SM-IG-104 | Instagram resolver failed |
| SM-IG-105 | Instagram upstream response changed |
| SM-X-101 | X/Twitter content not found |
| SM-X-102 | X/Twitter content is protected/inaccessible |
| SM-X-103 | X/Twitter media unavailable |
| SM-X-104 | X/Twitter resolver failed |
| SM-X-105 | X/Twitter upstream response changed |
| SM-PIN-101 | Pinterest content not found |
| SM-PIN-102 | Pinterest content is private/inaccessible |
| SM-PIN-103 | Pinterest media unavailable |
| SM-PIN-104 | Pinterest resolver failed |
| SM-PIN-105 | Pinterest upstream response changed |
| SM-RD-101 | Reddit content not found |
| SM-RD-102 | Reddit content/community is private or access-restricted |
| SM-RD-103 | Reddit-hosted media unavailable |
| SM-RD-104 | Reddit resolver/public anonymous lookup failed |
| SM-RD-105 | Reddit upstream response changed |
| SM-RD-106 | Reddit video/audio mux failed |
| SM-RD-107 | Reddit mux service/container unavailable |
| SM-TT-101 | TikTok content not found |
| SM-TT-102 | TikTok content is private/inaccessible |
| SM-TT-103 | TikTok media unavailable |
| SM-TT-104 | TikTok resolver failed |
| SM-TT-105 | TikTok upstream response changed |
| SM-API-201 | API/upstream timeout |
| SM-API-202 | Rate limited |
| SM-API-203 | Request payload too large |
| SM-SRV-301 | Backend unavailable |
| SM-UI-401 | Frontend exception |

Operational errors should include a code and request ID:

```text
SM-RD-107
Request: sm_7C9A23D102
```

Never expose internal stack traces, authentication material, signed media URLs,
or container internals to visitors.
