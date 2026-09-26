# Local Testing — Windows

## Standard Next.js mode

Double-click:

`START_SAVEMINGO.cmd`

Then open:

`http://localhost:3000`

## Cloudflare/vinext mode

Double-click:

`START_SAVEMINGO_CLOUDFLARE.cmd`

Then open:

`http://localhost:3001`

This mode runs the application through vinext, the path used for Cloudflare Workers.

## Standard health check

Double-click:

`CHECK_SAVEMINGO.cmd`

## Cloudflare build check

Double-click:

`CHECK_SAVEMINGO_CLOUDFLARE.cmd`

It runs the core quality checks plus the Cloudflare/vinext production build.

## Debug bundle

Double-click:

`MAKE_DEBUG_REPORT.cmd`

The bundle deliberately excludes environment files, Cloudflare credentials and other secrets.
