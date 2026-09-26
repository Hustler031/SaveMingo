# Deployment

## Environments
1. Local
2. Vercel deployment / preview
3. Custom-domain production

## Current deployment
- Project: `savemingo`
- Verified URL: `https://save-mingo.vercel.app/`
- Framework: Next.js
- Git repository: `Hustler031/SaveMingo`
- Production branch in Vercel: `main`
- Custom domain `savemingo.com`: **not attached to this project yet**

## Standard workflow

```text
task branch
→ CI
→ Pull Request
→ Vercel deployment/preview
→ smoke test
→ merge
→ custom-domain production when release is approved
```

## Bootstrap exception
SM-001 required creating the Vercel project after the initial source foundation existed on `main`. This did not constitute the public SaveMingo launch because `savemingo.com` remained untouched.

All normal feature work after SM-001 must use branch/preview validation before custom-domain release.

## Secrets
Configure secrets as deployment environment variables. Never commit them.

## Agent access
The SaveMingo Vercel project currently exists in the authenticated browser session, but the ChatGPT Vercel connector does not yet have authorization to read it. Extend connector authorization before relying on connector-based Vercel logs/configuration for debugging.
