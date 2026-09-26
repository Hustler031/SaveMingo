# SaveMingo Project Bootstrap

> **READ THIS FIRST in every new ChatGPT / Codex / coding-agent session.**
>
> This document is the durable project context for SaveMingo. It explains **what we are building, why the architecture looks the way it does, how agents should work, what the product boundaries are, and how future work should continue**.
>
> Chats are temporary. The repository is the persistent source of truth.

---

## 1. Startup order for every future session

Read these in this order:

1. `AGENTS.md`
2. `docs/PROJECT_BOOTSTRAP.md` ← this file
3. `docs/CURRENT_STATE.md`
4. `docs/ARCHITECTURE.md`
5. `docs/CLOUDFLARE.md`
6. `docs/ROADMAP.md`
7. `docs/HANDOFF.md`
8. `docs/LAUNCH_CHECKLIST.md`
9. Relevant GitHub issue / PR

Then:

1. confirm the current branch and latest `main` commit;
2. inspect open PRs;
3. inspect GitHub Actions;
4. inspect Cloudflare deployment state;
5. verify live Worker health before assuming docs are perfectly current;
6. continue from the latest handoff instead of asking the owner to repeat context.

GitHub code + docs + issues + PRs outrank chat memory.

---

## 2. Product identity

**Product:** SaveMingo  
**Domain:** `savemingo.com`  
**Primary tagline:** **Save anything you find online.**  
**Supporting line:** **Save it. Keep it.**  
**Brand motif:** flamingo / 🦩

The visual identity should feel:

- clean;
- modern;
- fast;
- trustworthy;
- simple;
- professional rather than childish.

SaveMingo starts as a **public social-media media-downloader** and should gradually become a broader online media-saving utility.

The first production platform is **Instagram**.

Potential long-term expansion order:

1. Instagram
2. X / Twitter
3. Reddit
4. Pinterest
5. TikTok
6. other useful media-saving tools where technically and legally reasonable

Do not dilute the product early with unrelated calculators, random PDF tools, generic converters, etc. Prove the downloader product first.

---

## 3. Business objective

The owner wants SaveMingo to become a **low-intervention, scalable side-income product**.

Core commercial goals:

- acquire organic search traffic;
- deliver a cleaner experience than spammy downloader competitors;
- keep operating costs low when traffic is low;
- scale only when real traffic justifies it;
- avoid unnecessary paid infrastructure;
- eventually monetize through ads and/or premium utility features;
- retain an architecture that makes additional platforms easy to add.

The product should win on:

- clean UX;
- speed;
- clear download flow;
- minimal clutter;
- reliable resolver behavior;
- useful SEO pages;
- easy future expansion.

### Monetization philosophy

Do not optimize for ads first.

Priorities:

1. reliable product;
2. good UX;
3. indexing / traffic;
4. analytics;
5. monetization.

Avoid:

- fake download buttons;
- aggressive popups;
- misleading ads;
- redirect mazes;
- spammy page layouts.

---

## 4. Owner / agent collaboration model

The owner is **not deeply technical** and should not be expected to debug frameworks, deployment internals, or terminal commands.

### Agent responsibility

ChatGPT / Codex should handle as much work end-to-end as possible:

- inspect repository state;
- create branches;
- implement code;
- run tests;
- diagnose failures;
- open and merge PRs when appropriate;
- verify deployments;
- update documentation;
- preserve rollback paths;
- continue until genuine owner intervention is required.

### Ask for owner intervention only when needed for:

- Google / Cloudflare / Hostinger account confirmation;
- OAuth / permission approval;
- DNS / nameserver changes;
- payments;
- account ownership actions;
- subjective design approval;
- anything an agent cannot safely do with available tools.

When owner intervention is required, give **simple exact UI steps**.

### "resume" convention

The owner often writes:

`resume`

Interpret it as:

> Read the repository context and continue from the latest safe handoff. Do not ask the owner to restate the project. Keep working until another genuine intervention is required.

---

## 5. Core engineering philosophy

SaveMingo should be designed so future agents can debug it from:

- a screenshot;
- an error code;
- a request ID;
- a failing URL;
- a GitHub status;
- a Cloudflare build/deploy status.

### Keep architecture boring and inspectable

Prefer:

- explicit modules;
- stable API contracts;
- request IDs;
- human-readable error codes;
- health endpoints;
- structured logs;
- reproducible smoke tests;
- simple platform adapters.

Avoid:

- unnecessary microservices;
- Kubernetes;
- hidden state;
- premature queues;
- complex auth;
- unnecessary databases;
- infrastructure that only one developer understands.

### Debuggability is a product feature

Whenever a failure is difficult to trace, improve diagnostics rather than accepting mystery behavior.

---

## 6. Current stack

### Repository

`Hustler031/SaveMingo`

### App

- Next.js
- TypeScript
- Tailwind CSS
- App Router
- lightweight custom UI components

Avoid heavy UI libraries unless they materially improve the product.

### Primary hosting

**Cloudflare Workers**

Live Worker URL:

`https://savemingo.ashabup0.workers.dev`

Cloudflare is the primary hosting target.

### Rollback

The Vercel project remains available as rollback during early production.

Do not delete rollback infrastructure prematurely.

### Database

No database is required for V1.

Do not add Supabase/Postgres merely because it is available.

### Media storage

No intentional permanent media storage in V1.

SaveMingo should primarily resolve and stream/deliver media.

---

## 7. Resolver architecture

The frontend must **not depend on Instagram extraction internals**.

The stable product contract is a normalized resolver API.

Primary resolver endpoint:

`POST /api/v1/resolve`

Conceptual request:

```json
{
  "url": "https://www.instagram.com/reel/..."
}
```

Conceptual normalized success:

```json
{
  "success": true,
  "platform": "instagram",
  "contentType": "reel",
  "sourceUrl": "...",
  "thumbnail": "...",
  "media": [
    {
      "type": "video",
      "quality": "1080p",
      "width": 1080,
      "height": 1920,
      "url": "...",
      "expiresAt": "..."
    }
  ]
}
```

Conceptual architecture:

```text
URL input
   ↓
validation
   ↓
platform detection
   ↓
platform adapter
   ↓
normalized result
   ↓
frontend result UI
```

Future platforms should plug into this adapter model rather than forcing a frontend rewrite.

---

## 8. V1 product scope

### Supported / intended

- public Instagram Reels;
- public Instagram video posts;
- public Instagram photo posts;
- public carousels;
- media result cards;
- mobile + desktop;
- media streaming/download through SaveMingo;
- quality information or selection only when technically real.

### Not part of V1

- Instagram login;
- SaveMingo user accounts;
- private-account bypass;
- credential collection;
- cookie farms;
- mass profile scraping;
- bulk account scraping;
- download history;
- permanent media library;
- mobile app;
- admin CMS.

---

## 9. Safety / legal product boundary

Do not silently weaken this boundary.

SaveMingo should **not** be designed to:

- bypass private-account controls;
- obtain Instagram credentials;
- collect session cookies;
- defeat login/authentication barriers;
- circumvent access controls;
- mass scrape private/profile data;
- permanently mirror media by default.

The product should operate on publicly accessible URLs.

Legal/usage messaging should make clear:

- SaveMingo does not own third-party media;
- creators/rightsholders retain their rights;
- public availability does not automatically grant republication rights;
- users are responsible for lawful use;
- SaveMingo is not affiliated with Instagram/Meta.

---

## 10. Error model and observability

Every important operational failure should expose:

- safe human-readable message;
- stable SaveMingo error code;
- request ID.

The request ID is important because the owner can send a screenshot and a future agent can trace the failure.

Useful failure categories include:

- invalid URL;
- unsupported URL;
- private content;
- content unavailable;
- content not found;
- rate limited;
- resolver failed;
- upstream timeout;
- media delivery failed.

Maintain health endpoints such as:

- `/api/health`
- resolver health endpoint

Key product metrics:

- successful resolves / valid resolve attempts;
- resolver latency;
- p50 / p95 response time;
- 4xx / 5xx rate;
- rate-limit events;
- failures by error code;
- media-delivery failures.

---

## 11. SEO strategy

SEO is a major acquisition channel.

Primary pages include:

- `/`
- `/instagram-downloader`
- `/instagram-reels-downloader`
- `/instagram-video-downloader`
- `/instagram-photo-downloader`
- `/instagram-carousel-downloader`
- `/how-to-download-instagram-reels`
- `/about`
- `/privacy`
- `/terms`
- `/copyright`

Each SEO page should be genuinely useful and distinct.

Avoid mass-produced keyword filler.

Technical SEO expectations:

- unique title;
- useful description;
- canonical URL;
- internal linking;
- sitemap;
- robots.txt;
- fast mobile experience;
- minimal unnecessary JS.

Potential later localization:

- Hindi
- Indonesian
- Filipino
- Portuguese
- Spanish
- Bengali

Do not mass-localize before the English product is stable and indexing.

---

## 12. Analytics

GA4 is wired into the application.

Measurement ID:

`G-ZXK1PRVH6X`

This is a public identifier, not a secret.

Important funnel events:

- `page_view`
- `paste_clicked`
- `resolve_started`
- `resolve_success`
- `resolve_failed`
- `download_clicked`

Do **not** intentionally send:

- pasted Instagram URLs;
- signed CDN URLs;
- request IDs;
- credentials;
- sensitive values.

Primary funnel:

```text
Google impression
→ search click
→ landing page
→ paste
→ resolve
→ download
```

---

## 13. Search Console

Search Console domain property:

`sc-domain:savemingo.com`

The property is verified/readable.

GSC Wizard is connected and can be used for:

- query performance;
- page performance;
- ranking changes;
- Search Console analysis;
- GA4 + Search Console reporting.

Do not submit the production sitemap until the custom domain is actually serving the Cloudflare production application.

Expected sitemap:

`https://savemingo.com/sitemap.xml`

---

## 14. Domain / DNS plan

Registrar:

**Hostinger**

Target Cloudflare authoritative nameservers:

- `novalee.ns.cloudflare.com`
- `bob.ns.cloudflare.com`

At the time this document was expanded, Hostinger had a temporary registrar-side cooldown preventing nameserver changes.

### Custom-domain cutover sequence

1. save the two Cloudflare nameservers at Hostinger;
2. wait until Cloudflare shows zone status **Active**;
3. do not casually delete imported DNS records during activation;
4. attach `savemingo.com` to Worker `savemingo` as a Cloudflare Custom Domain;
5. configure `www.savemingo.com` redirect/canonical handling;
6. verify HTTPS;
7. run the full production smoke test against the custom domain;
8. submit sitemap/indexing only after the domain works correctly.

DNS migrations must preserve rollback safety.

---

## 15. CI and deployment discipline

Use task branches and PRs for substantive changes.

Preferred pattern:

```text
main
  ↓
feature/fix branch
  ↓
implementation
  ↓
typecheck
  ↓
lint
  ↓
tests
  ↓
Next.js build
  ↓
Cloudflare/vinext build
  ↓
runtime smoke
  ↓
PR
  ↓
merge
  ↓
production verification
```

Do not trust one status source blindly.

Cloudflare and GitHub have occasionally shown stale/intermediate statuses during rapid deployments.

When status sources disagree:

1. identify the exact commit SHA;
2. inspect GitHub Actions;
3. inspect Cloudflare build state;
4. verify the live Worker;
5. prefer concrete runtime evidence over stale UI indicators.

### Production smoke should cover

- homepage;
- primary SEO pages;
- title / description / canonical;
- robots.txt;
- sitemap.xml;
- manifest;
- custom 404;
- health;
- resolver health;
- invalid URL;
- live Reel fixture;
- live carousel fixture;
- media Range request;
- GA4 bundle presence.

Use retries only for known transient upstream behavior. Do not hide real application bugs.

---

## 16. Local / Codex workflow

Future Codex sessions should be able to work locally without secret tribal knowledge.

The project should support:

- locked dependency install;
- typecheck;
- lint;
- tests;
- Next.js build;
- Cloudflare/vinext build;
- local Cloudflare-compatible runtime where needed.

Avoid environment-specific workflows that only work on one machine.

Whenever local setup changes, update docs.

---

## 17. UI/UX V2 — next major product workstream

The current UI works, but the owner **does not consider it finished**.

The next major design initiative is **SaveMingo UI V2**.

The owner specifically wants improvement in:

- overall layout and placement;
- visual hierarchy;
- premium product feel;
- quality-selection UX;
- carousel presentation;
- **Download All** for carousel where technically feasible;
- dark theme;
- mobile responsiveness;
- desktop polish;
- loading states;
- success states;
- error states;
- preview cards;
- download controls;
- button hierarchy;
- branding consistency;
- perceived speed.

### Important

Do **not** randomly patch the current UI.

For UI V2:

1. audit the current live product;
2. study useful competitor patterns;
3. define a redesign blueprint;
4. define desktop + mobile behavior;
5. define light + dark theme;
6. define result-card system;
7. define carousel behavior;
8. define quality-selection behavior;
9. then implement systematically.

The UI should feel like a real recognizable SaveMingo product—not a generic template and not a spammy downloader.

---

## 18. Quality-selection rule

Do not fake quality choices.

If only one real source exists, do not invent:

- 1080p
- 720p
- 480p

Only show quality options when technically distinct media sources actually exist.

If there is one available source, show its real dimensions/characteristics clearly.

Trust is more important than decorative options.

---

## 19. Carousel Download All direction

The owner wants a **Download All** action for carousels.

Before implementation, evaluate:

- browser download limitations;
- mobile behavior;
- ZIP generation;
- sequential downloads;
- Cloudflare Worker CPU/memory limits;
- signed media URL expiry;
- no permanent storage.

Keep individual item download buttons as fallback.

Do not ship a fragile Download All implementation without mobile testing.

---

## 20. Performance goals

Targets:

- LCP around or below ~2 seconds where realistic;
- negligible CLS;
- minimal unnecessary client JS;
- strong mobile Lighthouse performance;
- responsive input/result interactions.

Re-audit performance after UI V2.

---

## 21. Future platform expansion

After Instagram is stable and search traffic begins:

Potential next order:

1. X / Twitter
2. Reddit
3. Pinterest
4. TikTok

The homepage can eventually auto-detect the platform from a pasted URL and route to the correct adapter.

Do not build all platforms at once.

For each platform:

- add adapter;
- preserve normalized media result model;
- add real tests;
- add useful SEO pages;
- reuse the same core UI.

---

## 22. Cost discipline

The owner is willing to invest when justified, but the project should not accumulate infrastructure for hypothetical scale.

Preferred early-stage posture:

- use Cloudflare free/low-cost capacity where sufficient;
- no database without a real persistence requirement;
- no paid proxy farm by default;
- no heavy monitoring suite until traffic justifies it;
- no unnecessary AI;
- no complex admin platform.

Scale based on actual metrics.

---

## 23. Decision priorities for future agents

When unsure, prioritize in this order:

1. does the downloader remain reliable?
2. can future agents debug it easily?
3. does the UX remain clean?
4. does it help SEO without creating low-quality pages?
5. does it keep costs proportional to traffic?
6. does it preserve safety/legal boundaries?
7. can it be extended later without a rewrite?

Do not optimize for architectural sophistication.

Optimize for a dependable product.

---

## 24. What future agents should not do

Do not:

- rebuild the stack without a compelling reason;
- move back to Vercel merely because it is familiar;
- delete rollback infrastructure prematurely;
- add a database "just in case";
- add private-account bypass;
- collect Instagram credentials;
- mass scrape profiles;
- permanently mirror media by default;
- invent fake quality options;
- fill the site with ads before product reliability;
- generate dozens of thin SEO pages;
- make DNS changes without checking current state;
- interpret one failed status as proof production is broken without runtime verification;
- ask the owner to repeat context already documented here.

---

## 25. Current strategic state when this file was expanded

As of **2026-09-26**:

- core Instagram downloader works;
- Cloudflare Worker production works;
- public Reel resolve has been live-verified;
- carousel resolve has been live-verified;
- media Range streaming has been live-verified;
- SEO page cluster exists;
- sitemap / robots / manifest / custom 404 exist;
- GA4 Measurement ID is deployed and live-bundle verified;
- GA4 property is linked in GSC Wizard to `sc-domain:savemingo.com`;
- Search Console domain property is verified;
- Vercel remains available as rollback;
- custom domain cutover is waiting for Hostinger nameserver cooldown;
- UI V2 is the next major product-design workstream.

Always confirm the latest operational truth in:

- `docs/CURRENT_STATE.md`
- `docs/HANDOFF.md`

because a session may end mid-deployment.

---

## 26. Final operating principle

The owner should be able to say:

> **resume**

and a capable future agent should be able to:

1. understand what SaveMingo is;
2. understand why the architecture looks the way it does;
3. know where the project stopped;
4. inspect current deployment state;
5. continue safely;
6. fix problems with minimal owner intervention.

That is the standard this project should maintain.


### Permanent platform-isolation rule

New downloader platforms are added one at a time as independent adapters.

The invariant is:

> A breakage in one platform must not break another platform.

Therefore every new platform must have:

- its own validation module;
- its own adapter;
- its own resolver/parser;
- its own error namespace;
- its own reliability policy and health status;
- platform-specific tests;
- regression tests proving existing live platforms still work.

The shared frontend should consume normalized media results rather than platform extraction internals. The shared `/api/v1/resolve` endpoint detects the platform and routes to the matching adapter.

A new platform must not import or mutate another platform's resolver in order to work. Shared infrastructure changes must be backward-compatible and covered by regression tests.

## SM-014 launch-state override

The historical sections above describe the product's staged evolution. The
launch architecture now includes isolated adapters for Instagram, X/Twitter,
Pinterest, Reddit and TikTok behind the same normalized resolver contract.

Production SEO promotion remains capability-gated:
- Instagram production cluster: indexable after fresh launch regression;
- X/Twitter production cluster: indexable after fresh launch regression;
- Pinterest, Reddit and TikTok production routes: present but noindex until
  their current hosted real-fixture gates pass;
- legacy `/v2-preview/*`: redirected to production equivalents and not part of the sitemap.

The approved production UX is the V2 visual system: multi-platform homepage,
platform dropdown navigation, download-first result cards, optional preview,
mobile/desktop support and light/dark mode.

Reddit merged-with-sound production processing is Cloudflare-native:
`savemingo` Worker → private Service Binding → `savemingo-reddit-mux`
Worker → isolated Node/FFmpeg Container. The container is optional from the
perspective of the core product: when it is unavailable, Reddit video-only and
all other platforms remain available.

