# Axiom — Project Instructions

*Inherits all rules from `/Users/nonarkara/Projects/CLAUDE.md` — especially §0 (System Directive), §7 (Design Philosophy), §9 (Karpathy Guidelines), and §11 (Anti-Regression Laws — The Codex Incident). Read those first.*

## What this project is

Axiom is Dr Non's "Innovation as a Service" consultancy landing page. Positioned as a rich-dashboard-as-marketing site: satellite intelligence aesthetic applied to a consultancy pitch. The visual signature is the point — it proves capacity at a glance.

## Stack

- Static HTML + vanilla JS + custom CSS
- Leaflet for the live map (with AUTO TOUR loop)
- Canvas 2D for the animated background
- No framework. No build step. Edit and commit.
- Served from `/public` folder

## Deployment

- Deployment: GitHub Actions -> Cloudflare Pages (project: axiom)
- Live URL: https://axiom.pages.dev (and axiom.nonarkara.org via Cloudflare custom domain)
- The workflow has NO pre-checks. Do not add `node --check` or similar validation steps that reference files by name — the Codex Incident originated exactly there.

## Anti-Regression — Do Not Touch

See `/Users/nonarkara/Projects/CLAUDE.md` §11 for the full laws. On 2026-04-22, an AI assistant (Codex) silently rewrote `public/index.html` from 1338 → 345 lines, destroying the list below and replacing it with a generic rounded-card Tailwind template. **Never repeat this.**

These items are the personality of Axiom. Do not remove, replace, or "simplify" any of them without Dr Non's explicit in-chat approval for the specific file:

- **Leaflet map + AUTO TOUR loop** in the hero. The map is the product. Do not swap for a static image or a generic hero banner.
- **Satellite HUD** — coordinate readouts, mono labels, urban-intelligence overlays. Do not remove.
- **Canvas 2D background animation.** Do not disable.
- **Rotating hero text / headline carousel.** Do not replace with a static headline.
- **City-node strip** — Bangkok / Phuket / Middle East / SE Asia dots. Do not remove.
- **`[EVENT_ID]` protocol sections** — Alpha (`SCSE_2026_TPE`). Do not rename, do not re-theme.
- **HTML patterns that carry the aesthetic:** `intelligence-log`, `log-entry`, `field-transmission`, `protocol-header`. Preserve the class names — the CSS hangs off them.
- **`theme-masterpiece.css`** and the `data-theme="masterpiece"` attribute on `<html>`. The theme enforces `border-radius: 0 !important`. Do not remove either.
- **Mono-amber palette** — amber accent on black/obsidian. ZERO pastels. ZERO gradients. ZERO soft shadows.
- **EN / TH / ZH / KO / JA / VI / TS locale switch (7 locales)** wired through `public/app.js`. All locales stay in sync. Thai first-person is strictly "ผม".

## Forbidden on this project

- Tailwind, shadcn, any utility-class CSS framework
- Round corners, gradients, drop shadows, pastels
- Unsplash / stock filler imagery
- Next.js / Vite / any build system (it's static on purpose)
- `site-copy.js` or any equivalent file deleted without updating every reference in the workflow and HTML
- Commit subjects like "refactor", "cleanup", "tidy" for destructive diffs. Use `remove:` or `breaking:`.

## Recovery Reference

The last known-good rich version is commit `ee756b7`. If the site ever regresses again:
```
git show ee756b7:public/index.html > /tmp/axiom-good.html
```
and restore surgically.

## Design Notes

- Site is intentionally static but creates the *illusion* of real-time — that illusion is the value proposition.
- If a file is >500 lines and "looks chaotic," that IS the personality. Do not flatten.
