# Architecture

## V1 target

```text
Browser
  ↓
Next.js UI
  ↓
SaveMingo API (/api/v1/resolve - planned)
  ↓
Platform router
  ↓
Instagram resolver
  ↓
Normalized media response
  ↓
Browser
```

## SM-001

```text
Browser
  ├─ Homepage/UI
  └─ /api/health
       └─ request ID + component status
```

The resolver is intentionally not implemented in SM-001.

## Boundaries

### UI
Owns presentation, URL entry, loading/result/error states and accessibility.
Must not own Instagram parsing, secrets or proxy credentials.

### API
Will own validation, request IDs, rate limiting, timeouts, normalized responses and safe public errors.

### Resolver
Will own platform-specific public-link resolution, content detection, normalization and upstream-specific errors.

### Observability
Will own structured failures, success rate, latency, health checks and deployment traceability.

New platforms should become adapters behind the same contract, not separate apps.
