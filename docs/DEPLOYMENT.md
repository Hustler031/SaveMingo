# Deployment

## Environments
1. Local
2. Vercel Preview
3. Custom-domain production

## Vercel project
- Project: `save-mingo`
- Project ID: `prj_e7MsyDZdG6Jp29NfRLpz6gYbMcrb`
- Git repository: `Hustler031/SaveMingo`
- Framework: Next.js
- Production branch: `main`
- Custom domain `savemingo.com`: **not attached to SaveMingo yet**

## Verified SM-002 preview
- Branch: `chatgpt/SM-002-product-ui`
- Deployment ID: `dpl_FGnFSsnVnbRRwAnXhFWMRuw4gVoj`
- Branch alias: `https://save-mingo-git-chatgpt-sm-002-product-ui-hustler031s-projects.vercel.app`
- State: `READY`
- CI: `PASS`

## Standard workflow

```text
task branch
→ GitHub CI
→ Vercel Preview
→ code/static audit
→ interaction smoke test when required
→ runtime error scan
→ PR merge
→ main deployment
→ custom-domain production only at approved launch
```

Vercel Git integration automatically creates branch previews. Canceled intermediate deployments during rapid sequential commits are expected; verification must target the final branch-head deployment.

## Secrets
Configure secrets as deployment environment variables. Never commit them.

## Agent access
ChatGPT Vercel connector authorization now includes the SaveMingo project, so project/deployment/runtime logs can be inspected directly without browser automation.
