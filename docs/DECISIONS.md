# Architecture Decision Log

## ADR-001 — GitHub is project memory
Accepted. Code, docs, issues, PRs and commits are the source of truth.

## ADR-002 — Next.js frontend on Vercel
Accepted. Use Next.js + TypeScript + Tailwind for a simple SEO-friendly web layer.

## ADR-003 — Resolver isolated from UI
Accepted. Instagram-specific logic must be replaceable without rewriting page components.

## ADR-004 — Public content only for V1
Accepted. No private-account bypass, Instagram credential collection or bulk profile scraping.

## ADR-005 — No database in foundation
Accepted. Add persistence only when a concrete feature requires it.

## ADR-006 — Preview before production
Accepted. Validate feature work locally/preview before production cutover.
