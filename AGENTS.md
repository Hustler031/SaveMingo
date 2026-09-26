# SaveMingo Agent Rules

This repository is the persistent source of truth for SaveMingo. Chats are not.

## Read before changing code
1. `docs/PROJECT_BOOTSTRAP.md`
2. `docs/CURRENT_STATE.md`
3. `docs/ARCHITECTURE.md`
4. `docs/CLOUDFLARE.md`
5. `docs/HANDOFF.md`
6. The relevant GitHub issue / PR

## Working rules
- Never commit secrets, cookies, access tokens, passwords, Cloudflare API tokens, or production credentials.
- Do not implement private-account bypasses or credential collection.
- Do not work directly on `main` except repository bootstrap or an explicitly approved emergency.
- Use task branches: `chatgpt/SM-xxx-name`, `codex/SM-xxx-name`, or `fix/SM-xxx-name`.
- Keep platform-specific extraction logic outside UI components.
- Keep public API responses normalized and platform-agnostic where practical.
- Preserve request IDs and standardized error codes.
- Prefer small, reversible changes with tests.
- Before handoff, update `docs/HANDOFF.md` and `docs/CURRENT_STATE.md`.
- Before merge, run `npm run check`.
- Never claim a downloader capability is working until tested with real supported public URLs.
- Production changes must go through a preview deployment first.
- Cloudflare Workers is the primary hosting target under evaluation.
- Keep the existing Vercel project available as rollback until Cloudflare production is explicitly proven and approved.
- Do not attach `savemingo.com` to a new deployment before resolver + media delivery verification.

## Product rules
Brand:
- 🦩 SaveMingo
- **Save anything you find online.**
- **Save it. Keep it.**

V1:
- Public Instagram Reels, videos, photos, carousels.
- No login, private-account bypass, bulk profile scraping, or user accounts.

## Debugging contract
Every user-visible operational failure should eventually expose:
- a stable SaveMingo error code,
- a request ID,
- a safe human-readable message.

Logs must not contain secrets, full authentication material, or signed media URLs.


## Platform isolation contract

This is a hard engineering rule for every current and future downloader platform.

- Every supported platform must be implemented as an isolated adapter behind the normalized SaveMingo resolver contract.
- A platform-specific resolver, parser, dependency, timeout, upstream change, or failure must not break or alter unrelated platform adapters.
- Platform adapters must not import another platform's resolver or parser.
- Platform-specific validation belongs with that platform; shared detection may only route to the correct validator/adapter.
- Each platform must have its own stable error namespace, health status, timeout/reliability policy, and regression tests.
- Shared media delivery may be reused, but CDN allow-lists must remain explicitly scoped by platform and redirects must not cross platform allow-lists.
- New platforms must preserve the public `POST /api/v1/resolve` normalized contract unless a versioned API change is intentionally approved.
- Do not modify an existing working adapter merely to make a new platform work, except for backward-compatible shared-contract changes covered by regression tests.
- Before merging a new platform, run its tests plus regression coverage for every existing live platform.
- A new platform must remain removable/disableable without requiring a rewrite of the UI or another platform adapter.
