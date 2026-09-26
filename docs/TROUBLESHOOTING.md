# Troubleshooting

## Website does not start locally
Run `CHECK_SAVEMINGO.cmd`, then `MAKE_DEBUG_REPORT.cmd` and share the generated ZIP.

## Homepage works but API seems broken
Open `http://localhost:3000/api/health`.

Expected in SM-001:
- overall: healthy
- web: healthy
- api: healthy
- instagramResolver: not_configured

## Build fails
Collect command output, branch, latest commit and Node/npm versions. The diagnostics script gathers these where possible.

## Security
Never send `.env`, API keys, cookies, passwords or auth headers in screenshots/debug bundles.
