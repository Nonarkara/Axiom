# Quickstart — clone, run, ship

You can have the Axiom landing page running locally in under 60 seconds. The site is intentionally a static build with no bundler. There is no `npm run build` to wait for.

## Prereqs

- **Node 22+** (uses `node:sqlite`, native ESM, top-level `await`)
- A terminal you are not afraid of
- That's it. No Docker, no Postgres, no Redis, no API keys.

## The 30-second path

```bash
git clone https://github.com/Nonarkara/Axiom.git
cd Axiom
npm run dev
```

Open http://localhost:3000. You should see:

- The hero with the **live Leaflet map** in AUTO TOUR mode (Bangkok → Phuket → Middle East → SE Asia on a 12-second cycle)
- The **Canvas 2D data lines** painting behind the map
- The **rotating headline** (`Innovation / as a Service / that disappears / that works / for cities / for decisions / as water`) cycling every 3.5 seconds
- The **satellite HUD** with live coordinates, zoom level, and tile source
- The 22 systems below in the showcase grid
- A 7-locale switch (EN / TH / ZH / KO / JA / VI / TS) in the top-right of the masthead

If any of those are missing, you have regressed something — see `AGENTS.md` §4.

## The 2-minute path (with QA tooling)

```bash
git clone https://github.com/Nonarkara/Axiom.git
cd Axiom
npm install        # adds Playwright (~150MB) for the visual QA scripts
npm run dev        # http://localhost:3000
```

Now you also have:

- `npm run qa:links` — link audit on all internal anchors
- `npm run qa:visual` — Playwright screenshot comparison against `.qa/`
- `npm run check` — local syntax check (server.mjs + public/app.js + scripts)

## What runs where

| Where | What serves the site |
|---|---|
| `npm run dev` (local) | `server.mjs` — Node 22 HTTP server, native SQLite, /api/* routes |
| `git push origin main` | GitHub Actions → Cloudflare Pages → `https://axiom.nonarkara.org` |
| `axiom.pages.dev` | Cloudflare's auto-generated alias for the same deploy |

The local server and Cloudflare serve the same `public/` directory. There is no "build" step between them.

## File-where-what

| You want to change… | Edit this file |
|---|---|
| Hero copy / CTA text | `public/index.html` (the section near the top) |
| Hero colors / map styling | `public/hero.css` |
| System showcase grid | `public/index.html` (the `systems` section) |
| Page-level design system (typography, spacing, buttons) | `public/rams.css` |
| i18n strings (EN, TH, ZH, TS) | `public/app.js` (the `uiCopy` object at the top) |
| i18n strings (KO, JA, VI) | `public/i18n-regional.js` |
| Dev server / API routes | `server.mjs` |
| Deploy workflow | `.github/workflows/cloudflare-pages.yml` |
| Cache-buster versions on `<link>` / `<script>` tags | `public/index.html` head section |

**Always bump the `?v=YYYYMMDDxx` on every linked CSS/JS file when you change it.** Cloudflare's default cache is 4 hours; without the buster, half the world will see stale content.

## When you change a string

The site has **7 locales**: `en`, `th`, `zh`, `ts` live in `public/app.js`; `ko`, `ja`, `vi` live in `public/i18n-regional.js`. When you change a string in one locale, you must change it in all 7 or the layout will break in the un-updated ones.

The Thai first-person pronoun is strictly **"ผม"**. The Thai typography is non-looped (`IBM Plex Sans Thai`). Never `Sarabun`.

## When you change the design

Read `AGENTS.md` §4 first. The eight anti-regression rules will save you from re-introducing the bug that destroyed the site in April 2026.

When in doubt, the safe move is to ask before doing. The wrong move is to "clean it up" or "modernize it" without a specific reason.
