---
updated: 2026-11-05
drafted_by: codex/gpt-5
reviewed: false
---

# Hero Compact Operating Table

Local candidate only. No commit, push, deployment or cache-buster edit.
Ownership: `public/hero.css`, `.qa/hero-compact.mjs`, this report only.
Parent owns research, generated HTML, cache busting and release review.

## Diagnosis And Choice

The first expansion was structural: the existing `.hero-stage` wrapper occupied
an implicit cell in the outer named-area grid. Its children could not occupy
the outer areas. The sibling console fell into a lower row, while the absolute
map stretched behind the entire expanded composition. Headline, locations,
stats and console covered it. The editorial stylesheet is already inside a
fallback layer; its historical 900px rule was not the active height cause.

Named grid: **column**. Attention: map and sourced scope pins, then its right
exit's payload/action, location controls, stats, four-tab console. This is an
unframed live instrument, not a marketing panel over a darkened map.

The appended CSS override flattens only the stage's layout participation, not
its DOM or behaviour. Desktop allocates 68% width to the full-height map and
32% to the compact operating rail. The hero fits below the masthead, leaving
the existing small next-section hint. The 540px desktop minimum is for unusually
short windows, not a second-screen target.

Phone uses a 62.5svh map, then content-sized instruments. The hero remains
viewport bounded and scrolls internally to the locations, stats and console.
At enlarged text the map/tour control remain first-screen; prose/actions remain
reachable by scrolling, rather than being compressed or removed. Normal-size
proof action is fully visible initially. This deliberate nested scrolling is
the tradeoff required by preserving all content within the owner's scene cap.

The console's active panel scrolls internally: 120px normal desktop, 80px at
desktop heights <=800px, 240px phone. Tabs and reference footer remain outside
that scroll. Short-desktop stats remain whole; their gap to the console is
12px, not a floating lower-right void. The right rail can scroll at exceptional
content lengths rather than bleeding into the next section.

The invisible map-space element remains a real measurement of the map region:
existing tour code reads its bounds to place the geographic target. Hiding it
sent the phone anchor above the visible map during the first trial. No geography,
coordinates, map sources, JS, HTML, strings or data have been changed.

Preserved: Leaflet, canvas, project pins, HUD, AUTO TOUR, rotating headline,
selector's 18 locations, four chips, all stats, all four console panels and
their complete text/links. Existing paper, blue, ocher and state colours remain.

## Measured Evidence

Evidence directory: `/tmp/axiom-hero-20261105/` (not additional repo edits).
`before.json` and `after.json` record the measured geometry. Before captures
use the same document with the appended repair removed through a Playwright
response override. This reproduces the real original CSS without editing HTML.

| CSS Viewport | Scale | Before Hero | After Hero | Map / Viewport Area |
|---|---|---|---|---|
| 390 x 844 | 1 | 1290.6px | 778px | 62.5% |
| 1024 x 900 | 1 | 1090.6px | 834px | 62.9% |
| 1152 x 760 | 3 | 1078.0px | 694px | 62.0% |
| 1440 x 900 | 1 | 1098.0px | 834px | 62.9% |
| 390 x 844, enlarged text | 1 | 2329.7px | 778px | 62.5% |

Screenshots: `before-{390,1024,1152-3x,1440,390-large}.png` and the matching
`after-*.png`; each also has a `-hero.png` capture. Every viewport has separate
`after-<viewport>-panel{Systems,Impact,Trends,Dossier}.png` console captures.
The 1152 capture is 3456 x 2280 physical pixels. Motion evidence is
`after-1152-3x-motion.png`. Builder inspected rendered phone, enlarged phone,
tablet, desktop, exact 3x scene and Active Brief captures during revision.

Run with an isolated public server:

```sh
node .qa/serve.mjs 5613 public
node .qa/hero-compact.mjs --before
node .qa/hero-compact.mjs
```

Override `HERO_URL` and `HERO_EVIDENCE` to target another local candidate or
evidence directory. The test asserts >=60% viewport map area, no instrument/map
intersection, no map filter, loaded tiles, visible project pins, no document
overflow, first useful tour action and normal-size proof action visible,
viewport-bounded hero, joined stats/console, working selector and tabs, and
scroll-to-end reachability of every panel. It injects a 2400px minimum height,
180px gaps and undersized map and requires the geometry gate to reject them.
An additional ordinary-motion session verifies tour start/pause, rotating
headline, nontransparent canvas pixels and all four chips through real clicks.

## Status And Limits

- Hero-specific browser suite: 103 assertions, zero failures.
- QA script syntax check: passed.
- `npm test`: 146 passed, 1 failed, 1 skipped (148 total). Failure is parent-owned
  research generation opening missing `public/research-reader.js`, from
  `scripts/research/build.mjs:189`; no attempt made to edit that work.
- General MSH/spatial evidence commands not run: they write outside this task's
  three-file ownership and assess the concurrently changing research surface.
- Independent reviewer: **pending parent/human review**. Builder inspection and
  targeted geometry are not an independent MSH sign-off or whole-site clearance.
- Seven-locale content was not edited; this is not a complete locale sweep.
- Preview server: exec session `58602`, port `5613`; stopped after verification.
- Parent must bump the `hero.css` cache query when integrating. Nothing published.
