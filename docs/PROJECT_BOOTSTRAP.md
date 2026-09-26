# Project Bootstrap

Use this file when a new ChatGPT/Codex session joins SaveMingo.

## Read order
1. `AGENTS.md`
2. `docs/CURRENT_STATE.md`
3. `docs/ARCHITECTURE.md`
4. `docs/ROADMAP.md`
5. `docs/HANDOFF.md`
6. Relevant GitHub issue / pull request

## Then
1. Confirm current branch and latest commit.
2. Run `npm install` if dependencies are absent.
3. Run `npm run typecheck`.
4. Run `npm run lint`.
5. Run `npm run build`.
6. Continue the current task; do not redesign completed architecture without a documented reason.

GitHub code + docs + issues + PRs outrank chat memory.
