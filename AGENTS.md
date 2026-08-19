# AGENTS.md

> Project-specific context for AI coding agents (OpenCode, Codex, Cursor, Aider, Devin, Gemini CLI, …).
> Auto-loaded at session start by all of them. Read first; do not skim.

This is the landing page and live demo for **Axiom X Co., Ltd.**, a Bangkok-based consultancy building decision systems for cities, governments, and operators. The site is a *product demonstration* — it is intentionally a rich dashboard, not a generic landing page.

---

## 1. Stack at a glance

| Layer | Choice | Why |
|---|---|---|
| Content | Static HTML, single file (`public/index.html`, ~1,825 lines) | One file = one source of truth, no framework drift |
| Behaviour | Vanilla JS (`public/app.js`, ~3,000 lines) | No build step. No `node_modules` shipped. |
| Style | Custom CSS — `rams.css` (system) + `hero.css` (hero specifics) | Rams + Vignelli/NYCTA heritage, mono-accent, hairline grids |
| Map | Leaflet 1.9.4, self-hosted at `public/vendor/leaflet/` | Live map with AUTO TOUR loop is the visual signature. Vendored on 2026-08-19: when unpkg.com was unreachable the whole hero interaction layer died silently. |
| Animation | Canvas 2D (`#heroCanvas`) | Data lines + grid behind the map |
| i18n | In-file JS dictionaries | EN / TH / ZH / KO / JA / VI / TS (7 locales) |
| Local dev | `server.mjs` (Node 22+, native `node:sqlite`) | One binary, no bundler. `npm run dev` → http://localhost:3000 |
| Deploy | GitHub Actions → Cloudflare Pages (`axiom` project) | On push to `main`. No pre-checks. |
| Analytics | Cloudflare Insights (skips localhost) | — |
| Local data | `data/axiom.sqlite` (gitignored) | Pageviews, contact form, admin actions |

**No** Tailwind, no shadcn, no React, no Next.js, no Vite, no bundler. Edit and commit.

---

## 2. Run it locally (clone-and-use in 3 commands)

```bash
git clone https://github.com/Nonarkara/Axiom.git
cd Axiom
npm install        # only needed for the Playwright QA scripts
npm run dev        # http://localhost:3000
```

Without `npm install` the site still runs (`server.mjs` only needs Node 22+); you lose `npm run qa:visual` and `npm run qa:links`.

**Stop the server:** `Ctrl+C`. The SQLite database lives at `data/axiom.sqlite` and is gitignored.

---

## 3. File map (only the files you will actually touch)

```
public/
├── index.html         — single source of truth for the site (DO NOT split)
├── app.js             — i18n dictionaries (en/th/zh/ts) + all section content
├── i18n-regional.js   — i18n for ko / ja / vi locales
├── rams.css           — Rams-grade design system (variables, components, sections)
├── hero.css           — hero-specific styles (Leaflet map, satellite HUD, intel overlays)
├── theme-masterpiece.css  — kept on disk for reference; NOT currently linked
├── admin/             — internal admin UI (auth required)
├── vendor/leaflet/    — Leaflet 1.9.4 (byte-identical to the npm dist). DO NOT re-point at a CDN.
├── assets/            — logos, brand kit, OG image
├── images/            — press, event, team photography
├── photos/            — pro bono + supplementary photography
├── screenshots/       — system showcase panels
├── showcase/          — per-system detail content
└── axiom-*.{pdf,zip}  — legal + brand artifacts

server.mjs             — Node 22+ HTTP server, native SQLite, /api/* routes
scripts/               — build-time helpers (i18n generation, evidence export)
.qa/                   — Playwright visual QA + link audit
data/                  — runtime SQLite (gitignored)
.github/workflows/     — Cloudflare Pages deploy (NO pre-checks)
```

---

## 4. The Eight Things You Must Not Do (anti-regression)

Inherited from `/Users/nonarkara/Projects/CLAUDE.md` §11. The original Codex Incident (2026-04-22) destroyed the live map, satellite HUD, canvas animation, and `[EVENT_ID]` sections in one commit. These rules are permanent.

1. **Never collapse `public/index.html` by more than 30%** in one edit. If the diff is larger, stop and ask.
2. **Never delete a live interactive element** — Leaflet map, Canvas 2D, satellite HUD, intel overlays, rotating headline, city node strip, AUTO TOUR loop, `[EVENT_ID]` protocol sections, `data-theme` attributes. These *are* the product.
3. **No `border-radius > 0`. No gradients. No drop shadows. No pastels.** The house style is geometric, mono-accent, hairline borders only. The current accent is **Thailand flag blue `#00247d`** on warm paper `#faf9f7`. Negative data uses flag red `#a51931`.
4. **Never replace earned content with stock filler.** No Unsplash placeholders. No Lorem. No "Feature 1 / Feature 2 / Feature 3" cards.
5. **Never delete a referenced file without updating every reference** (CI workflows, `<script>` / `<link>` tags, package.json).
6. **Never commit a destructive rewrite under a mild message.** Destructive commits must start with `remove:` or `breaking:`. "refactor", "cleanup", "tidy" are forbidden subjects for destructive diffs.
7. **Never re-theme the project to match a template.** No Vercel-template lookalikes. No shadcn defaults. No Tailwind UI card grids. If you think "this would be cleaner as…" — stop. That thought is the regression.
8. **Never add a CI pre-check that names a specific file.** The CI workflow (`.github/workflows/cloudflare-pages.yml`) has **NO** pre-checks by design. Adding `node --check public/index.html` or similar is the exact pattern that produced the original Codex Incident.

### Last known-good rich version

If the site ever regresses again:
```bash
git show 8bdf126:public/index.html   # current HEAD — pre-recovery, post-recovery of hero
git show ee756b7:public/index.html   # pre-Codex-Incident (1338 lines)
```

If a future agent has re-broken it, the recovery is `git show 8bdf126:public/index.html > public/index.html` and then re-apply any post-recovery commits surgically. See `CLAUDE.md` §11.4.

---

## 5. The Six Things You SHOULD Do

1. **Read `CLAUDE.md` first, every session, every project.** It overrides any generic "clean up" instinct.
2. **Before any edit to a design surface, state what you intend to preserve.** One sentence in your plan.
3. **i18n must stay in sync across all 7 locales.** When you change a string, change it everywhere. The legacy strings (`hero.*`, `teamSect.*`, etc.) and the new strings (`heroCurrent.*`, `navCurrent.*`, etc.) coexist on purpose; do not "consolidate" them.
4. **Thai first-person is strictly "ผม"** — never ฉัน, เรา, ข้าพเจ้า. Thai typography is non-looped (`IBM Plex Sans Thai`). Never `Sarabun`, never `IBM Plex Sans Thai Looped`.
5. **Cache-bust aggressively.** Any change to `public/rams.css` / `public/app.js` / `public/hero.css` / `public/i18n-regional.js` must bump `?v=YYYYMMDDxx`. Cloudflare caches for 4 hours by default; without the buster, your changes will be invisible to half the world.
6. **CDPT is automatic.** After any change to `public/`, commit → push → confirm Cloudflare deploy → verify on `https://axiom.nonarkara.org`. Do not stop at a local preview. Do not ask permission to push obvious fixes.

---

## 6. Commands you will use

| Command | What it does |
|---|---|
| `npm run dev` | Start dev server on port 3000 |
| `npm run start` | Start dev server on `process.env.PORT` (default 3000) |
| `npm run check` | **Local** syntax check (`node --check`) on `server.mjs` + `public/app.js` + scripts. **Never put this in CI** — see §4.8. |
| `npm run qa:links` | Link audit (`.qa/release-audit.mjs`) |
| `npm run qa:visual` | Playwright visual regression (`.qa/visual-qa.mjs`) |
| `npm run export:evidence` | Snapshot the live site for evidence of authorship |

---

## 7. When in doubt

- The project is on `main` branch. Push to `main` triggers deploy.
- The remote is `git@github.com:nonarkara/Axiom.git` (note lowercase `n`) — GitHub redirects to the new canonical `Nonarkara/Axiom.git` on push.
- The deploy hook is flaky. If you push and don't see a Cloudflare deploy in 10 min, ask Dr Non — don't wait.
- `data-theme="masterpiece"` is mentioned in the README's anti-regression note as historical law, but is **not** currently on `<html>`. The current theme is Thailand-flag / paper. The masterpiece theme CSS file is kept on disk for reference. Do not re-impose it without an explicit chat message from Dr Non.
