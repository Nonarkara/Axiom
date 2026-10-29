## What this changes

<!-- Which site: main pitch (public/), axiomx reading room (axiomx/), server.mjs, or tooling? -->

## Why

<!-- The problem being solved, not a restatement of the diff. -->

## Checks run

- [ ] `npm test` passes
- [ ] `node .qa/axiomx-journeys.mjs` → **29 PASS, 0 FAIL** *(required if you touched `axiomx/`)**
- [ ] Cache-bust `?v=` strings bumped on changed CSS/JS in `public/index.html` *(if you touched `public/`)*
- [ ] Copy changed in **all seven locales** — `public/app.js` + `public/i18n-regional.js` *(if you changed copy)*
- [ ] `npm run security:headers` re-run if inline scripts changed

## House rules

- [ ] I have read [`AGENTS.md`](../blob/main/AGENTS.md) and this does not violate the anti-regression list
- [ ] No interactive element was removed: Leaflet map, AUTO TOUR, canvas, `#satHud`, rotating headline, city-node strip, `[EVENT_ID]` sections
- [ ] No round corners, gradients, drop shadows, or pastels introduced
- [ ] No hardcoded counts in axiomx — every number derives from `systems.length` / `liveCount` / the cluster breakdown
- [ ] No secrets, API keys, or invented credentials
- [ ] **No CI pre-checks that name a specific file** — the deploy workflows have none on purpose