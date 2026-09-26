# Deployment

## Environments
1. Local
2. Vercel Preview
3. Production

Do not use `savemingo.com` as the first test target.

```text
task branch
→ CI
→ Pull Request
→ Vercel Preview
→ smoke test
→ merge
→ production
```

Production cutover is intentionally outside SM-001 until preview is verified.

Configure secrets as deployment environment variables. Never commit them.
