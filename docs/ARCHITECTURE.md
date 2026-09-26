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

## SM-014 production architecture

The production application remains one vinext/Next.js Worker with isolated platform
adapters. Reddit muxing is the only feature that crosses into a Container.

```text
Browser
  ↓
savemingo Worker
  ├─ pages / SEO / analytics
  ├─ POST /api/v1/resolve
  │    ├─ Instagram adapter → Instagram resolver
  │    ├─ X adapter         → X resolver
  │    ├─ Pinterest adapter → Pinterest resolver
  │    ├─ Reddit adapter    → Reddit resolver
  │    └─ TikTok adapter    → TikTok resolver
  ├─ GET /api/v1/media
  └─ POST /api/v1/reddit/mux
            ↓ private Cloudflare Service Binding
      savemingo-reddit-mux Worker
            ↓
      RedditMuxContainer
        ├─ v.redd.it allow-list only
        ├─ temporary video/audio files
        ├─ FFmpeg stream-copy mux
        ├─ MP4 response
        └─ temporary-file cleanup
```

### Mux isolation invariants

- The main Worker does not start or import FFmpeg.
- Only `/api/v1/reddit/mux` and `/api/health/reddit-mux` use the
  `REDDIT_MUX` Service Binding.
- The mux Worker is not published on `workers.dev`; it is intended to be
  reachable only by Service Binding.
- The container accepts only HTTPS `v.redd.it` video/manifest/audio URLs and
  independently revalidates redirects.
- Cloudflare production does not require a shared mux bearer secret because the
  downstream Worker is private to the account. The existing bearer-token HTTP
  mode remains only for local/non-Cloudflare fallback testing.
- A mux outage returns `SM-RD-107` and leaves Reddit video-only download
  available.
- Instagram, X, Pinterest, TikTok, normal Reddit resolve/media delivery, and
  site rendering do not call the mux service and must stay healthy if it is
  stopped.

### Container launch profile

Initial launch profile:

- instance type: `basic` (1 GiB memory, 1/4 vCPU, 4 GB ephemeral disk);
- fixed pool: 2 stateless instances;
- idle sleep: 30 seconds;
- per-input cap: 150 MiB;
- manifest cap: 1 MiB;
- upstream fetch timeout: 25 seconds;
- FFmpeg timeout: 60 seconds;
- FFmpeg mode: stream copy (`-c copy`), not transcoding.

The 4 GB ephemeral disk is deliberately much larger than the bounded temporary
video + audio + merged output footprint. No media is intentionally persisted.

