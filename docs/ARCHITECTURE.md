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


## Multi-platform isolation architecture

SaveMingo uses one public resolver contract with isolated platform adapters:

```text
Browser / shared UI
        ↓
POST /api/v1/resolve
        ↓
platform detection + validation
        ↓
server adapter registry
   ┌────┴───────────────┐
   ↓                    ↓
Instagram adapter       X adapter
   ↓                    ↓
Instagram resolver      X resolver
   ↓                    ↓
platform-specific       platform-specific
errors/timeouts         errors/timeouts
   └────────┬───────────┘
            ↓
normalized ResolveSuccess
            ↓
shared result/download UI
```

### Isolation boundaries

- `lib/platforms/detect.ts` only identifies a supported platform from a URL.
- `lib/platforms/<platform>/validation.ts` validates that platform's public URL forms.
- `lib/platforms/<platform>/adapter.ts` is the only bridge from the registry into that platform's resolver.
- `resolver/<platform>/` owns upstream-specific extraction and parsing.
- `lib/platforms/server-registry.ts` selects an adapter; it does not contain extraction logic.
- `/api/v1/resolve` owns the shared API envelope, rate limiting, request IDs, logs, and normalized response.
- `/api/v1/media` is shared transport, but media CDN roots are allow-listed per platform.

### Failure isolation

If X fails, an X request should return an `SM-X-xxx` or shared API error while Instagram continues to resolve normally. The reverse must also be true.

Platform health is independently observable at:

- `/api/health/platforms/instagram`
- `/api/health/platforms/x`

The aggregate resolver health endpoint is:

- `/api/health/resolver`

### Merge invariant

Adding or repairing one platform must not require platform-specific changes inside another adapter. Any shared-contract change must remain backward-compatible or use a new API version, and regression tests for already-live platforms must pass before merge.


## Reddit audio/video mux service

Reddit native video can expose video and audio as separate DASH tracks.

SaveMingo handles this without putting FFmpeg inside the Cloudflare Worker:

```text
Reddit resolver
   ↓
normalized MediaAsset
   ├─ video URL
   ├─ audioStatus = separate
   └─ merge.manifestUrl
          ↓
V2 result card
          ↓
POST /api/v1/reddit/mux
          ↓
authenticated proxy
          ↓
isolated reddit-mux service
   ├─ fetch DASH manifest
   ├─ select best audio representation
   ├─ download v.redd.it video + audio
   ├─ ffmpeg -c copy mux
   ├─ stream final MP4
   └─ delete temporary files
```

### Failure behavior

If the mux service is unavailable or FFmpeg fails:
- the resolved Reddit result remains valid;
- the user can still use **Download video only**;
- the UI reports a safe merge failure;
- Instagram, X, Pinterest, TikTok, and Reddit non-mux flows remain unaffected.

### Runtime split

Cloudflare Worker:
- resolver;
- validation;
- request IDs/rate limits;
- mux proxy;
- final response streaming.

Separate Node service:
- DASH audio selection;
- temporary input download;
- FFmpeg mux;
- temporary file cleanup.

This boundary is mandatory because Cloudflare Workers do not provide a normal spawned-process FFmpeg runtime.

