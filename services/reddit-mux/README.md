# SaveMingo Reddit Mux Service

This service is intentionally isolated from the main Cloudflare Worker.

## Responsibility

- Accept a Reddit video-only MP4 URL plus its DASH manifest URL.
- Resolve the best available Reddit audio representation from the DASH manifest.
- Download only allow-listed `v.redd.it` inputs.
- Mux video + audio with FFmpeg using stream copy (`-c copy`).
- Return a final MP4.
- Delete temporary files after the response finishes.

It does **not** resolve Reddit post URLs and does not know about Instagram, X, Pinterest, or TikTok.

## Environment

- `PORT` — defaults to `8788`
- `MUX_SERVICE_TOKEN` — required bearer token
- `MUX_MAX_INPUT_BYTES` — default 250 MB per input
- `MUX_FETCH_TIMEOUT_MS` — default 25 seconds
- `MUX_FFMPEG_TIMEOUT_MS` — default 60 seconds

## Local

From this directory:

```
npm install
set MUX_SERVICE_TOKEN=savemingo-local-reddit-mux
npm start
```

Health:

```
http://localhost:8788/health
```

## Production

Run this as a separate Node service with FFmpeg available through `ffmpeg-static`.
The main SaveMingo app should call it through `REDDIT_MUX_SERVICE_URL` and authenticate with `REDDIT_MUX_SERVICE_TOKEN`.

Do not expose a production mux service without a strong token and network/rate-limit controls.
