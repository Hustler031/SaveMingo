# Platform SEO Clusters

Updated: 2026-09-26

This document records the search-intent structure used for SaveMingo's next platform expansion.

## Important rollout rule

The current routes under `/v2-preview/*` are deliberately `noindex` while functionality and UX are under review.

SEO titles, descriptions, headings, FAQ coverage, internal links, and route structure are prepared in preview first. They should become indexable only when the corresponding production route is promoted and live runtime smoke has passed.

Do not submit or index a platform-specific page that advertises a capability which has not been verified.

## X / Twitter

Observed search language still strongly uses both **Twitter** and **X**.

Cluster:
- generic intent: `/x-downloader`
- video intent: `/twitter-video-downloader`
- GIF intent: `/twitter-gif-downloader`
- image intent: `/twitter-image-downloader`

Content principles:
- use both "Twitter" and "X" naturally;
- mention `x.com` and legacy `twitter.com` links;
- video page can explain MP4 selection;
- GIF page must explain that X frequently serves GIF-style animation as looping video;
- avoid fake 4K/original-quality claims unless the actual source verifies them.

## Pinterest

Cluster:
- generic intent: `/pinterest-downloader`
- video intent: `/pinterest-video-downloader`
- image intent: `/pinterest-image-downloader`
- animated/GIF intent: `/pinterest-gif-downloader`

Important search/user concerns:
- `pin.it` short links;
- video download / MP4;
- image download;
- animated pins/GIF terminology;
- mobile use;
- no login;
- public pins only.

Do not claim all Idea Pin pages or all carousel slides until live fixtures prove the resolver can consistently enumerate them.

## Reddit

Cluster:
- generic intent: `/reddit-downloader`
- video intent: `/reddit-video-downloader`
- image/gallery intent: `/reddit-image-downloader`
- GIF intent: `/reddit-gif-downloader`

A major Reddit search intent is **Reddit video downloader with sound**.

Current SaveMingo strategy:
- target the exact intent with the qualified phrase **Reddit Video Downloader with Sound Check**;
- Reddit often separates video and audio;
- read Reddit's public audio flag and show Sound detected / No sound detected / Unknown before download;
- when Reddit reports separate audio, warn that the current downloaded video track may still be silent;
- automatic audio/video merging must be implemented and live-verified before SaveMingo claims that every downloaded MP4 includes sound.

This lets the page match real user intent without making a false capability claim.

## Internal linking

Each platform main page links to its own subpages.
Each subpage links back to the platform main page and sibling intent pages.
The homepage links only at platform level.
Top navigation uses one main platform label plus a dropdown for subpages.

This keeps navigation clean while preserving crawlable intent clusters after production promotion.

## Isolation rule

SEO routes are presentation surfaces only. They must call the platform-specific adapter through the shared normalized resolver contract. Adding an SEO page must never introduce extraction logic into the UI layer.
