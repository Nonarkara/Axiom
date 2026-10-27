> **Read [MSH.md](MSH.md) before any design or frontend work.** This is Dr Non's standing design law: spatial hallucination is when an interface invents a reason for things to occupy space. When you find it, massacre. The law carries the symptom table, the eight laws, the repair procedure, and the evidence required before anyone may declare a pass.
>
> **Read [ANTI-SLOP.md](ANTI-SLOP.md) before any design or frontend work.** These are Dr Non's hard rules against AI design slop: empty space is a decision, subtract before you add, and the map comes first. Check pages with `slop-lint` (tools/slop-lint.mjs in Nonarkara/palette).

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
scripts/spatial/       — the vendored spatial-law instrument (probe + gate + falsifier)
design/                — spatial-baseline.json: the measured decisions and their reasons
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
| `npm run qa:thumbs` | Catalogue thumbnail band check (`.qa/catalogue-thumbs.mjs`) — needs a server on port 5312 |
| `npm run qa:journeys` | Reading-room human journeys (`.qa/axiomx-journeys.mjs`) — needs a server on port 5311 |
| `npm run qa:plates` | Reading-room plate discipline (`.qa/axiomx-plates.mjs`) — reads the built book, no server needed |
| `npm run qa:spatial` | Spatial gate (`scripts/spatial/spatial-check.mjs`) — measures holes, orphans, scattered pairs, wrapping and dead space against the baseline |
| `npm run qa:spatial:falsify` | Proves the spatial gate bites — injects known defects and asserts each one is caught |
| `npm run qa:sweep` | Chunked spatial sweep (`.qa/spatial-sweep.mjs`) — for route sets too large for one browser run |
| `npm run qa:counts` | Count gate (`.qa/count-check.mjs`) — every figure on the page must equal what the page can be counted for. Run against the live URL to prove it there. |
| `npm run qa:i18n` | Language gate (`.qa/i18n-check.mjs`) — every locale's keys, the switcher's function, phone reachability, persistence, `?lang=` and the `lang` attribute. A string a language keeps in English **on purpose** is written down in `design/i18n-allowlist.json` with its reason; a stale decision fails the gate. |
| `node .qa/msh-evidence.mjs` | **The evidence MSH.md requires** — measures chrome cost, task visibility, geometry, hierarchy and preservation at 390/1024/1440 and writes the screenshots to `docs/design/evidence/` |
| `npm run security:headers` | Regenerate `public/_headers` from `lib/security.mjs` — **run after any change to an inline script** |
| `npm test` | Unit tests (`node --test tests/*.test.mjs`) — footprint, catalogue, circuit, security. Run before pushing a change to `public/` or `axiomx/`. |
| `npm run export:evidence` | Snapshot the live site for evidence of authorship |

---

## 7. When in doubt

- **The law is [MSH.md](MSH.md).** Spatial hallucination is when an interface
  invents a reason for things to occupy space instead of arranging them around
  how people read, choose and act. When you find it, massacre. MSH carries the
  symptom table, the eight laws, the repair procedure, and the evidence it
  requires before anyone may declare a pass — **source scans and successful
  builds cannot prove a visual pass.** If rendering was unavailable, say
  **unverified**.
- The evidence for a visual change is `node .qa/msh-evidence.mjs` (screenshots
  and measurements at 390, 1024 and 1440) plus the spatial gate. The last
  audit is `docs/design/msh-audit-2026-10-22.md`.
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

**Resolved 2026-10-24: the record exists.** `axiomx.nonarkara.org` resolves and serves this project, and the full journey suite passes against the canonical host (191 PASS, 0 FAIL). The account of why an agent could not create it is kept below because the next missing record will fail the same way.

**`axiomx.nonarkara.org` needs a DNS record that an agent cannot create.** The domain is attached to the project on the Cloudflare side, but wrangler's OAuth token is **Pages-scoped only** — `GET /zones/{id}/dns_records` returns **403** — and `wrangler login --scopes-list` offers only `zone:read`, with no DNS-write scope grantable at any scope level. Cloudflare auto-creates the CNAME only when a domain is attached *with zone authority*, so attaching via API leaves it stuck at `pending` / `CNAME record not set` indefinitely. Dr Non adds this record by hand in the dashboard:

```
Type: CNAME     Name: axiomx     Target: axiomx-1d4.pages.dev     Proxy: Proxied
```

Proxied matches every other subdomain in the zone. There is **no wildcard** on `nonarkara.org`, so a missing record fails closed — the host simply does not resolve. When it flips to `active`, Pages issues the certificate itself; no manual TLS step.

### What it is

A **book**, not a landing page. A two-pane reader: an index pane of clustered entries on the left, and a "plate" pane on the right that renders one long-form argument at a time. 119 entries across 18 groups (Index, Method, Practice, Catalogue, the system clusters, Pro bono, Stages, Field notes, Founders, Press, Brand, Record, Brief, Colophon).

Its opening argument is the **opposite** of the main site's. The main site pitches *one screen, live, click it*. axiomx opens with:

> The flood arrives at 2 a.m. The dashboard arrives next fiscal year.

It is the long-form case for the work — the argument you make to a governor, not the one-liner you make to a browser. Keep it that way. Do not collapse axiomx into a marketing page, and do not copy the main site's density into it.

### Files

| File | Role |
|---|---|
| `axiomx/index.html` | Shell — index pane + plate pane. Static. |
| `axiomx/catalog.js` | `window.AXIOM_SYSTEMS` — 73 systems, 13 fields each. One line, generated, and kept grouped by `cluster` — the index prints a group header whenever the cluster changes, so an entry appended out of its cluster repeats the header (City Dashboards printed four times before this was caught). |
| `axiomx/reader.js` | All the prose (`book[]`) and all rendering. The content lives here, not in HTML. |
| `axiomx/plates.js` + `axiomx/art/` | `window.AXIOM_PLATES` — one artwork per system (artist, title, year, collection, source, licence, why). Rendered in place of the screenshot, after DIE WELT's 2011 Ellsworth Kelly edition. Pro bono entries keep their photos. Credits list: `#plates`. |
| `axiomx/style.css` | Navy `#00247d` + red `#a51931` on paper `#faf9f7`. **Not** the main site's Lyons blue + ocher. Light and dark. |

### Rules that are not obvious

- **The nine `page-*` plates are famous artworks chosen by concept, not by shelf.** Each one has to *depict* the story of the page it sits under — Danby's flood for "the flood arrives at 2 a.m.", Altdorfer's bird's-eye battle for "nobody sees the whole", Christus's goldsmith for "no hand-off". A representative pick is wrong even if it is a better painting. Check `axiomx/plates.js` before reusing any work: a plate already used by a system cannot be reused here. Their metadata is **never typed** — artist, year, collection, licence and dimensions come back from the Wikimedia Commons and Wikidata APIs, verified with `node .qa/commons-verify.mjs <candidates.json>` (Commons `imageinfo` for the file, Wikidata `P195`/`P571`/`P170`/`P186` for the holding museum). The nine carry a real `source` link to the Commons file page and a licence of `Public domain` or `CC0`; the journey suite fails on anything else.
- **Every plate in the book passes the same three questions, and `node .qa/axiomx-plates.mjs` enforces it.** Does the picture explain the system's *mechanics* (how it works), its *concept* (what it is), or its *ideology* (what it asserts)? A binding that only carries the mood, the place, the period, the palette or a name-pun fails. "The Starry Night" is a fine picture and a bad flood watch. The check also holds the palace together: one picture per system, one picture per entry screen, no picture used twice, no artist over three plates, and the `source` link must point at the exact Commons file whose bytes are on the page — a link to a *different* file of the same painting makes the licence line a lie.
- **A plate's label is never wider than its plate.** The image is height-capped by the page, so a portrait work renders narrower than the block and a fixed label measure leaves the caption hanging in space beside the painting. `addPlate` measures the rendered image and caps the label to it. Do not set a fixed `max-width` on `figcaption` and assume it holds.
- **A group cover must index its own children.** `#probono` and `#stages` were stubs: a heading, a line of prose, and five unreachable entries. A cover that does not link what it contains is an orphan, not a cover.
- **An entry screen with no image is an empty screen, not a page.** Every one of the book's own entries carries a plate. Pro bono and stage entries keep their photographs — that work belongs to the institutions it was done for.

- **The field video player is a poster until the reader asks for the film.** The `youtube-nocookie` iframe is created on click, not on load: a third-party frame that loads on its own is a request to a third party the reader never made, and it was the reason the entry took seconds to settle. Two consequences that are easy to get wrong — **the poster click and the playlist click are the same request**, so choosing a briefing from the list plays it without a second click (asking twice for one intent is the scattered-action failure); and **the thumbnail stills come from YouTube's image CDN**, because a thumbnail's licence does not travel with the file and self-hosting them would be a licensing problem. The journey suite asserts zero requests to the player host before the click, and an iframe with `autoplay=1` after it.
- **Bump `ART_V` in `axiomx/reader.js` when plate art ships.** Cloudflare serves static assets with a four-hour `max-age`; a plate file changed under the same name keeps serving the old bytes for hours.
- **Numbers must derive, never be typed.** `systems.length`, `liveCount`, and the cluster breakdown are computed at runtime. A hardcoded count *will* drift — the previous version listed four different system totals on one page.
- **`const MEDIA = 'https://axiom.nonarkara.org/'`** — the field clip (on `#iaas`) and pro bono / stage photos are hot-linked from the main site; system pages show local plates from `art/` instead of screenshots. Any new system needs a plate, or the journey suite fails. axiomx is coupled to it by design; do not localise those paths casually.
- **Every count claim must be checkable against the page.** The main site's evidence strip derives `Systems` from `.sys-cell[data-arch]` and `Live` from the Live badges. Keep axiomx in step.
- **`.inset` is declared *after* the type rules on purpose.** The `.lede/.prose/.note` rules use a `margin` shorthand that resets left/right to `0` if `.inset` comes first — the lede silently jumps to x=0 while everything else sits at x=22.
- **Index rows are `min-height: 44px`.** They were 27px across 111 entries. A `::after` hit area does **not** work here: the rows are stacked with zero gap, so grown hit areas overlap and steal each other's clicks. The row itself has to grow.
- **`rule-list` is 920px for spec rows (`.fig/.def/.row/.layer`) but `rule-list--prose` is 66ch for numbered prose.** One width for both means the hairline rules run ~330px past the paragraph they annotate — the exact box-does-not-fit-its-text defect.
- **Escape clears the search first**, wherever focus is. Clicking a result leaves the box populated but unfocused.
- **The book is English-only. The main site's seven locales do not translate it; the colophon carries the Thai statement.** Do not start translating it without being asked.
- **The locale control in the index bar grades itself with the book's own vocabulary.** `EN` is active; `TH ZH KO JA VI` are marked `data-soon`, drawn back from full ink with a dotted rule, and they are **not** `aria-disabled` — each one routes to the `#catalogue` entry ("How to read this"), which is where Live / Preview / Soon is defined. A Soon code that did nothing would be the only dead control in a book whose lede says *"It is live, or it says it is not."* If you translate an edition, the button stops being `data-soon` and gains the real switch.

### Testing it

`.qa/axiomx-journeys.mjs` runs the human journeys. It defaults to a local server on port 5311 — `node .qa/serve.mjs 5311` then `node .qa/axiomx-journeys.mjs`.

**Use `.qa/serve.mjs`, not `python3 -m http.server`.** That server is single-threaded and speaks HTTP/1.0, so it answers one request at a time and closes every connection. The reading room loads a 200KB locale bundle, and a browser opening several requests at once stalls behind one slow response — the run then times out or reports `ERR_SOCKET_NOT_CONNECTED` against a page that is perfectly fine. Two failures were reported on a deployment that was clean. `.qa/serve.mjs` is concurrent and keeps connections alive, so a local run measures the site instead of the transport.

`AXIOMX_URL` overrides the base, so the **same journeys** run against a deployment:
`AXIOMX_URL=https://axiomx.nonarkara.org/ node .qa/axiomx-journeys.mjs`. Always run them against the canonical host, not the `pages.dev` alias — the alias cannot catch a broken domain or a stale zone.

Covers: land and read the pitch, open a system, deep links, `/` search, Escape-clears, arrow-key navigation, history back/forward, dark mode + persistence, phone at 390px, every system has a credited PD/CC0 plate, FloodDash carries the field video studio and Innovation-as-a-Service carries its own, the index hover affordance in both themes with its AA contrast read off the painted pixel, no latched hover state on touch, keyboard focus kept distinct from hover, the stack plate does not scroll sideways, 44px tap targets, the video studio layout across five widths, that all 119 entries render without error, and that **every plate label fits inside the plate it names** — the label is fitted in JS because a portrait plate is height-capped and CSS cannot measure it, so the check waits for the caption to settle before judging it. Run it before claiming axiomx works. Expected: **191 PASS, 0 FAIL**.

The pass count moves as checks are added, so read the number off the output rather than trusting this line — and update it in the same commit that changes the count. It said 51 while the suite ran 115, which is exactly the kind of drift this suite exists to catch, in the one file that tells the next agent what to expect.

### One catalogue, two renderings

**Reading-room-only publications (27 October 2026).** The owner explicitly added
Mean, Ninja Innovation, and Slowdown to axiomx only. `axiomx/ebooks.js` exports
`AXIOM_EBOOKS`, which the reader appends to the shared catalogue under E-books.
Do not copy these into `public/` or weaken shared-catalogue parity to accommodate
them. Their numbers follow the shared catalogue automatically. Plate checks and
journeys include both collections; `tests/ebooks.test.mjs` guards their scope,
destinations, numbering, and artwork. `npm run qa:ebooks` exercises the three
entries at 390/1024/1440; `AXIOMX_URL` runs it against the canonical deployment.

`axiom.nonarkara.org` and `axiomx.nonarkara.org` are two sites presenting **one catalogue**. `axiomx/catalog.js` holds it as data; `public/index.html` renders it as cards. They are the same 73 systems, and they must agree on every one of them.

They did not, for a long time, and every test on either site was green the whole time:

- `simcity` and `tdv` sat in Lab on axiom and in City Dashboards on axiomx, so the two sites stated different cluster sizes for the same systems.
- `formhypes` and `colors` both claimed the number 59.
- Both of those cards then asked for the copy key `panels.p66`. In a JavaScript object literal the second definition wins, so the **FormHypes card rendered the Palette's description** — 348 colour combinations on an architectural-intelligence card, live on the public site. Nothing threw. Nothing was missing from the DOM.

`tests/catalogue.test.mjs` is the guard that would have caught all of it: same ids, same cluster per id, same number per id, no shared URL, no shared copy key, and no duplicate key inside a locale's copy block. `npm test` runs it.

Two rules that came out of it:

- **A duplicate key in an object literal overwrites by position, not by intent.** Guard for duplicate keys directly; a check that looks for missing content will never see this.
- **When two catalogue entries turn out to be the same system, let the live system name it.** The live FormHypes titles itself *"FormHypes — Architectural intelligence"* and brands *"FormHypes, inspired by SHDT"* — SHDT is the MIT classmate, not the product. So the surviving card is "FormHypes · SHDT", and the count is 70.

### The thumbnails are one band, and the crop window moves

Every catalogue card carries a product screenshot in a **21:8 band**. Two CSS facts keep that band intact, and both have already broken on the live site:

- **`.sys-cell__shot` needs `height: auto`.** An `<img>` carries a `height` attribute, which the browser treats as a presentational hint for the `height` *property*. Author CSS set `width` but not `height`, so the hint won and the `aspect-ratio: 21/8` was ignored — a 16:10 screenshot rendered at its own 800px, a portrait column that blew the card to 930px against 297px neighbours. `height: auto` hands the box back to the ratio. **Do not remove it.**
- **`object-fit: contain` is banned here.** It letterboxes the image inside the band against the card's own background, so the thumbnail reads as a small stray picture floating in an empty strip. The band is fixed, so the **crop window moves** instead: `--lower` (`50% 20%`) holds a figure and what it holds; `--middle` (`50% 45%`) holds a model that sits on a field.

`.qa/catalogue-thumbs.mjs` is the guard. It defaults to a local server on port 5312 — `node .qa/serve.mjs 5312 public` then `node .qa/catalogue-thumbs.mjs`. `AXIOM_URL` overrides the base, so the **same checks** run against a deployment: `AXIOM_URL=https://axiom.nonarkara.org/ node .qa/catalogue-thumbs.mjs`.

Eight checks, and two of them are the ones that catch the real defects: every thumbnail **fills** its band (`object-fit` must be `cover` — a correct-shaped box can still letterbox), and the band is **one height across the catalogue** (a card taller than its row-mates leaves holes under the text). It also fails on any JS or console error, and scopes to `.sys-cell[data-arch]` so the eight brand-sheet cards are out of scope. Expected: **8 PASS, 0 FAIL**.

---

## 9. The spatial gate — measure the layout, do not eyeball it

**The law is [MSH.md](MSH.md).** This section is how the project measures it. The gate cannot judge taste and cannot tell whether whitespace supports reading — that stays human. What the gate does is make you *look*: it names every hole, orphan, stranded item, scattered pair and accidental wrap, and refuses to let one through unnamed.

**Spatial hallucination** is when an interface invents a reason for things to occupy space, instead of arranging them around how people read, choose and act. Six modes, and the recurring test is *"Why is this here, why this size, and why this far from that?"* — if the answer is *"the grid put it there,"* the layout has failed.

The gate is mechanical, because an eye cannot see a 158px void beside an 18px label at 1280px. `scripts/spatial/` holds a vendored instrument:

| File | Role |
|---|---|
| `spatial-probe.js` | **The measuring instrument. Do not edit — not one byte.** It is what makes the numbers comparable across runs and across agents. |
| `spatial-check.mjs` | The Node-side driver. **Project-owned policy: fix it when it is wrong.** |
| `spatial-falsify.mjs` | Injects known defects and asserts each one is caught. |
| `design/spatial-baseline.json` | 79 routes, the decisions already made, and **the reason for each one**. |

**Keep `scripts/spatial/` byte-identical to the `spatial-law` package** (`~/.minimax/skills/spatial-law/bin/`). A local edit to the instrument makes a number mean something different from every other project that uses it, and the next agent cannot tell which numbers are comparable. When the package changes, copy it in, re-measure the baseline, and read the diff — the measurement code changed, so the numbers did too.

### The sweep reads the project's own breakpoints

The gate does not sweep six widths. It sweeps the project's committed widths **plus every breakpoint the CSS declares and the pixel on either side of it** — media queries and container queries alike. On this project that is **58 widths**, not 6, and it is the reason the sweep finds things:

- `span#consoleFootScope` was cut by seven pixels of its own text at **601px** — a width no six-width sweep would ever visit. The cause was `flex: 1` on the label: a zero flex-basis hands the item whatever is left over, which was less than the label needed, and `overflow: hidden` did the rest.
- The footer's eleven links stranded one in a corner in **two** separate bands — a row of ten at 788–868px, and five-and-five-and-one at 424–476px. Both were invisible to a six-width sweep.
- The nine-chip stack shelf stranded the ninth chip below **765px**.

A breakpoint is a cliff, and a layout is a different layout on either side of it. **Do not narrow the sweep** — `--widths` is for a quick look, and a narrowed sweep is a partial sweep: it cannot judge whether a reason has gone stale, and the gate says so in a note rather than guessing. `.qa/spatial-sweep.mjs` therefore passes `--widths` only when you ask it to.

### The rules the driver enforces

- **Every hole must be named and every name must be a reason.** A mechanism ("the grid put it there") is not a reason. Never write the same sentence into three different reasons.
- **Never re-baseline without reading the diff.** The point of the baseline is the review, not the recording.
- **A gate that has never failed proves nothing.** Wire in the falsifier. `node scripts/spatial/spatial-falsify.mjs public` must report that every rule has bitten at least once — currently 13 rules, 6 injected defects, all caught.

### Running it

```bash
# the main catalogue and the admin
node scripts/spatial/spatial-check.mjs --base http://127.0.0.1:5312/ --routes "/,/admin/"

# the reading room — 73 routes, too many for one browser run
node .qa/spatial-sweep.mjs --base http://127.0.0.1:5311/ \
  --routes "$(cat /tmp/rr-routes.txt)" --chunk 4 --baseline design/spatial-baseline.json
```

**Sweep in chunks of 1–4 routes.** The reading room re-downloads and re-parses 300KB of catalogue, plate and locale data on every entry, and a single run over a hundred routes exhausts Chrome's virtual-time budget before the last measurement lands. The sweep merges the chunks into one baseline and re-runs the gate against it, so every route is still measured and every measurement is still judged against the same baseline. `--update` **replaces** the route set — merge the other surface's routes back afterwards, or use `--baseline` to write elsewhere and diff.

**The gate must settle before it measures.** A page that is still laying out gives wrong numbers, so the driver waits for the DOM fingerprint to be stable across two polls. A JS-fitted label (the reading room's plate captions) is measured *after* it settles.

**Reading-room routes are path routes** — `/flood-ami`, `/iaas` — not `#hash` fragments. `.qa/serve.mjs` serves the shell and sets `location.hash` from the path, so the sweep's `--routes` list is the real URL space. The 73 ids come from `window.AXIOM_SYSTEMS` in `axiomx/catalog.js`.

### The seven languages are six more routes

The catalogue is translated, and a translation is a **different layout** — longer labels, wider words, a taller stack. The footer's eleven links are one row only while one row holds all eleven, and a row's width is the sum of its labels, so the band where the row holds differs per language. Measuring only the English route measures only the English layout: Vietnamese needs 1011px of links where English needs 840px, and the source view's identifiers need 992px.

So the main site carries **six language routes** — `/?lang=th`, `/?lang=zh`, `/?lang=ko`, `/?lang=ja`, `/?lang=vi`, `/?lang=ts` — and the sweep visits all of them. The `?lang=` parameter is the page's own: it sets the language for that visit **without** overwriting the reader's stored preference, which is what lets a link carry a language and still lets the switcher's choice stick.

**A language that keeps a string in English on purpose writes the reason down.** `design/i18n-allowlist.json` holds those decisions — a loanword, a product's own name, a registered address — each with its reason, and `npm run qa:i18n` fails when a decision no longer applies. An allowlist that only grows is a place to hide, so a stale decision is a failure too.

### What the gate caught that an eye did not

- The **hairline grid painted its frame in `--line`**, so a short last row showed through as a dead beige block — 300px of nothing in the catalogue that read as a card that failed to load. **The rule belongs to the cell, not to the frame.** `.grid` is now `gap: 1px; background: transparent` with `.grid > * { outline: 1px solid var(--line); outline-offset: 0 }`. The table's edge follows its content, and a short last row is simply the end of the table.
- **`auto-fill` is not a column decision.** The pro bono shelf showed three columns at 360px, one at 768px and two at 1440px — the same five cards in three different shelves. A decided progression now runs 1 → 2 → 3 → 5 across 520px / 760px / 1200px.
- **A `max-content` track handed a 162px nowrap name a 64px track**, and the name spilled out of the card and off the page.
- **A viewport-relative cap on a reading band is a clip wearing a scrollbar's clothes.** The scroll container makes the cut look intentional.
- **The admin's overview panel is one band** — the copy, then four figures across. The record rail is sticky because it is a selector, not a column of content.
- **A count that does not divide is a wrapping row that will strand somebody.** The footer's eleven links cannot split into two rows without leaving one alone; the nine-chip shelf cannot split into rows without leaving one alone. Both are now decided grids: four columns (and three on a phone) for the links, three by three for the shelf, because four and three both divide what they hold.
- **`flex: 1` is not "give it the room it needs".** A zero flex-basis hands an item whatever is left over. The HUD scope label needed 151px and was given 144, and `overflow: hidden` turned the shortfall into a cut. The label now keeps its own width (`flex: 1 1 auto`) and wraps rather than being cut if a panel ever gets narrower than the label.

---

## 10. Security headers, and what is the owner's to do

Both surfaces carry a Content-Security-Policy, a frame policy, HSTS, a permissions policy and `nosniff`. `public/_headers` is **generated** — `npm run security:headers` rewrites it from `lib/security.mjs`, which derives the CSP script hashes from the inline scripts in `public/index.html`. **Regenerate it after any change to an inline script**, or the page breaks under its own policy. `npm test` fails when the committed file and the generated one disagree.

`axiomx/_headers` is hand-written, because the reading room's policy names origins (Google Fonts, `youtube-nocookie`, `img.youtube.com`) that the main site's does not.

**Verify a policy in a real browser, not by reading it.** `.qa/probe-csp.mjs <url> "<csp>" [clickSelector]` attaches the policy to every same-origin response and reports what the browser refuses. It separates *refusals* (a console error — CSP always logs one), *failures* (a resource that did not arrive) and *cancellations* (`net::ERR_ABORTED` — the browser closing mid-flight, which the YouTube player causes on every run and which is not a violation). It has a falsifier: `--self-test` asks the page for a resource the policy forbids and fails unless the probe sees it. A probe that has never failed proves nothing.

**Left to the owner, not to an agent:** Cloudflare Access on `/admin/`. The admin page is reachable on the static build. The data it exposes is public narrative and its writes are inert, so this is low severity — but the protection is a Cloudflare dashboard change, and it is Dr Non's to make.

---

## 11. A 404 is an answer, not an accident

Every unknown path on both hosts used to return the **213KB homepage with a 200** — including `/api/admin/bootstrap`. A soft 404 hides broken links from every crawler and every monitoring tool, and it tells the reader they got what they asked for when they did not.

`public/404.html` and `axiomx/404.html` are honest pages now. Cloudflare Pages serves them for unknown paths and answers **404**. If a path returns the homepage again, the `_headers`/Pages configuration has regressed.

**The rule:** a URL that does not exist must answer 404 and say so. No path may answer 200 with a page that is not what was asked for.

