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
| Map | Leaflet 1.9.4 from `unpkg.com` | Live map with AUTO TOUR loop is the visual signature |
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

- Before a design revision, read `DESIGN-TENETS.md` and use the linked canonical
  `bauhaus-human-design` method. Quality evidence supplements the mechanical gate;
  it never authorizes theme replacement or removal of earned interactions.

- The project is on `main` branch. Push to `main` triggers deploy.
- The remote is `git@github.com:nonarkara/Axiom.git` (note lowercase `n`) — GitHub redirects to the new canonical `Nonarkara/Axiom.git` on push.
- The deploy hook is flaky. If you push and don't see a Cloudflare deploy in 10 min, ask Dr Non — don't wait.
- `data-theme="masterpiece"` is mentioned in the README's anti-regression note as historical law, but is **not** currently on `<html>`. The current theme is Thailand-flag / paper. The masterpiece theme CSS file is kept on disk for reference. Do not re-impose it without an explicit chat message from Dr Non.

---

## 8. axiomx — the reading room (a different site)

**This brief was lost once and cost a session. It is written down here so it is not lost again.**

`axiomx/` is a **second, separate website** — `https://axiomx.nonarkara.org`. It is **not** a variant of `public/`. It has its own workflow, `cloudflare-pages-axiomx.yml`, which deploys `axiomx/` to the **`axiomx`** Pages project — `cloudflare-pages.yml` ships `public/` to the `axiom` project and knows nothing about it. Same `CLOUDFLARE_API_TOKEN` / `CLOUDFLARE_ACCOUNT_ID` secrets, no pre-checks, scoped to `paths: axiomx/**`.

### Deploying it

```
wrangler pages deploy axiomx --project-name=axiomx --branch=main
```

The Pages project is **`axiomx`**, whose `*.pages.dev` host is **`axiomx-1d4.pages.dev`**. Verify with the Pages API (`subdomain` field) before ever typing a host.

**`axiomx.pages.dev` is a decoy, not a typo you can shrug off.** It resolves and returns **HTTP 200** — it is a real, older, unrelated **Next.js** project ("Axiom: The Universal Calculator"). Every axiomx asset 404s there: `reader.js`, `catalog.js`, and `style.css` all serve the same 13,596-byte Next.js 404 page. Pointing the CNAME at it would leave the canonical host resolving, with a working TLS cert, serving the wrong site with no broken assets to notice — the reading room would simply never load. Always `axiomx-1d4.pages.dev`.

**`axiomx.nonarkara.org` needs a DNS record that an agent cannot create.** The domain is attached to the project on the Cloudflare side, but wrangler's OAuth token is **Pages-scoped only** — `GET /zones/{id}/dns_records` returns **403** — and `wrangler login --scopes-list` offers only `zone:read`, with no DNS-write scope grantable at any scope level. Cloudflare auto-creates the CNAME only when a domain is attached *with zone authority*, so attaching via API leaves it stuck at `pending` / `CNAME record not set` indefinitely. Dr Non adds this record by hand in the dashboard:

```
Type: CNAME     Name: axiomx     Target: axiomx-1d4.pages.dev     Proxy: Proxied
```

Proxied matches every other subdomain in the zone. There is **no wildcard** on `nonarkara.org`, so a missing record fails closed — the host simply does not resolve. When it flips to `active`, Pages issues the certificate itself; no manual TLS step.

### What it is

A **book**, not a landing page. A two-pane reader: an index pane of clustered entries on the left, and a "plate" pane on the right that renders one long-form argument at a time. 111 entries across 17 groups (Index, Method, Catalogue, the system clusters, Pro bono, Stages, Field notes, Founders, Press, Brand, Record, Brief, Colophon).

Its opening argument is the **opposite** of the main site's. The main site pitches *one screen, live, click it*. axiomx opens with:

> The flood arrives at 2 a.m. The dashboard arrives next fiscal year.

It is the long-form case for the work — the argument you make to a governor, not the one-liner you make to a browser. Keep it that way. Do not collapse axiomx into a marketing page, and do not copy the main site's density into it.

### Files

| File | Role |
|---|---|
| `axiomx/index.html` | Shell — index pane + plate pane. Static. |
| `axiomx/catalog.js` | `window.AXIOM_SYSTEMS` — 67 systems, 20 fields each. One line, generated. |
| `axiomx/reader.js` | All the prose (`book[]`) and all rendering. The content lives here, not in HTML. |
| `axiomx/style.css` | Navy `#00247d` + red `#a51931` on paper `#faf9f7`. **Not** the main site's Lyons blue + ocher. Light and dark. |

### Rules that are not obvious

- **Numbers must derive, never be typed.** `systems.length`, `liveCount`, and the cluster breakdown are computed at runtime. A hardcoded count *will* drift — the previous version listed four different system totals on one page.
- **`const MEDIA = 'https://axiom.nonarkara.org/'`** — system screenshots are hot-linked from the main site. axiomx is coupled to it by design; do not localise those paths casually.
- **Every count claim must be checkable against the page.** The main site's evidence strip derives `Systems` from `.sys-cell[data-arch]` and `Live` from the Live badges. Keep axiomx in step.
- **`.inset` is declared *after* the type rules on purpose.** The `.lede/.prose/.note` rules use a `margin` shorthand that resets left/right to `0` if `.inset` comes first — the lede silently jumps to x=0 while everything else sits at x=22.
- **Index rows are `min-height: 44px`.** They were 27px across 111 entries. A `::after` hit area does **not** work here: the rows are stacked with zero gap, so grown hit areas overlap and steal each other's clicks. The row itself has to grow.
- **`rule-list` is 920px for spec rows (`.fig/.def/.row/.layer`) but `rule-list--prose` is 66ch for numbered prose.** One width for both means the hairline rules run ~330px past the paragraph they annotate — the exact box-does-not-fit-its-text defect.
- **Escape clears the search first**, wherever focus is. Clicking a result leaves the box populated but unfocused.
- **The book is English-only. The main site's seven locales do not translate it; the colophon carries the Thai statement.** Do not start translating it without being asked.
- **The locale control in the index bar grades itself with the book's own vocabulary.** `EN` is active; `TH ZH KO JA VI` are marked `data-soon`, drawn back from full ink with a dotted rule, and they are **not** `aria-disabled` — each one routes to the `#catalogue` entry ("How to read this"), which is where Live / Preview / Soon is defined. A Soon code that did nothing would be the only dead control in a book whose lede says *"It is live, or it says it is not."* If you translate an edition, the button stops being `data-soon` and gains the real switch.

### Testing it

`.qa/axiomx-journeys.mjs` runs 29 human journeys. It defaults to a local server on port 5311 — `cd axiomx && python3 -m http.server 5311` then `node .qa/axiomx-journeys.mjs`.

`AXIOMX_URL` overrides the base, so the **same 29 journeys** run against a deployment:
`AXIOMX_URL=https://axiomx.nonarkara.org/ node .qa/axiomx-journeys.mjs`. Always run them against the canonical host, not the `pages.dev` alias — the alias cannot catch a broken domain or a stale zone.

Covers: land and read the pitch, open a system, deep links, `/` search, Escape-clears, arrow-key navigation, history back/forward, dark mode + persistence, phone at 390px, and that all 111 entries render without error. Run it before claiming axiomx works. Expected: **29 PASS, 0 FAIL**.
