---
updated: 2026-11-03
drafted_by: Codex/GPT-5
reviewed: false
---

# Release Audit: Main And Branch

Verdict: **BLOCK. Not production-ready.** This is an audit, not a repaired release.

## Scope And Identity

- Reviewed deployed/local/remote main: `1c24b7473d29073493ec094fb45645ec307ccad5`.
- Compared `audit/clone-and-use-plus-finance` (`937a26d`), the only local branch not merged into main. It has three documentation/merge-only commits; main has ten commits absent from that branch. Its merge-base-to-tip diff is empty. It supplies no runtime repair.
- Catalogue, diagram, landscape-plate and other local feature branches are already ancestors of main. No merge, reset, stash, application edit or deploy was performed in this audit.
- Existing dirty work was preserved. Its generator, category/plate data, screenshots, security validation and CSS differ from committed main. A workspace result must not be attributed to the release commit.
- Independent reviewer: Meitner, read-only subagent `01a1a22b-0159-7ae3-9d3b-0e2d107958b0`. Reviewed clean archive tests, catalogue integration, ancestry and release/security configuration. Parent reviewed live browser behavior and VR startup.

## Confirmed Findings

### P1: Published League Scene Cannot Start

`public/vr/index.html:86` loads Three.js's ES module as a classic script. Its sibling script expects a global `THREE`. At `https://axiom.nonarkara.org/vr/`, Chromium at 390 and 1440 reports `Unexpected token 'export'` and `THREE is not defined`. There is no canvas and no populated table.

A second independent startup defect remains after correcting only the import in an in-memory diagnostic: `#vrCanvas` is a `div` (`index.html:36`) passed as WebGLRenderer's canvas (`vr.js:45`). The browser throws `canvas.getContext is not a function`. Correcting both only in the browser produces one canvas and 20 table rows. These diagnostics did not edit or fix production. See `report.json`, `vr-diagnostics.json`, and `vr-commit-1440.png`.

### P1: Release Verification Used A Different Application

`https://vr.nonarkara.org/` returns 200, but serves the existing `VR · nonarkara` WebXR hub using `hub.js`, with Dashboard/Arena/TDV/Life/Games/League rooms. The new commit's page is published at `https://axiom.nonarkara.org/vr/`. The deployment workflow deploys `public/` to the `axiom` Pages project; it does not establish a separate VR project or change DNS. The two documents have different titles, scripts and products. A 200 from the existing VR hub proves nothing about the new league page. Do not repoint its DNS and overwrite an existing product.

### P1: Main Hero Ships Incompatible HTML And CSS

Commit `2eff495` introduces `.hero-stage` at `public/index.html:215`, but its corresponding stylesheet remains uncommitted. Committed `hero.css` has no `.hero-stage` rule and still places the layout grid on `#hero`.

On the live phone page, the stage is **568px wide in a 390px viewport**. The subtitle extends to x=556; Phuket and Southeast Asia extend to x=584; the last console tab ends at x=595. The hero clips these controls rather than producing document overflow, so a zero document-overflow check does not establish readability or reachability. At 1440 the masthead is 102px tall after the new links. See `axiom-live-390.png`, `report.json`, and `header-hit-tests.json`.

### P1: Go Catalogue Release Is Incomplete

The main card shipped in `2eff495`; its source entry shipped in `1c24b74` (`data/catalogue/systems.json:7856`). Category `c64`, the plate, both thumbnails and the reading-room renderings are absent from that committed bundle. Main lists 81 shared systems, while the committed book lists 80. Production returns **404** for both `/screenshots/hikaru-non-go.png` and `.webp`, and for the book's `/art/hikaru-non-go.webp`.

In a clean main archive, catalogue generation reports four failing artefacts, including `Cannot read properties of undefined (reading 'en')`. Dirty-worktree generation passes because the missing source data and renderings are present locally. Those are different software states. See `main-catalogue-check.txt`.

### P2: Source Schema And Generator Disagree About Counts

`1c24b74` removes `clusterCounts` without committing the replacement generator/test logic. Committed `scripts/catalogue/build.mjs:87` falls back to an empty count table and produces zero cluster counts; the committed test calls `Object.values` on the removed table. Restoring category `c64` alone does not fix this. The source, generator and tests need one atomic change.

### P2: Reading-Room Navigation Obscures Controls

The CO and VR links at `axiomx/index.html:46` and `:47` expand the fixed-height index header past its pane. At 1440 the pane ends at x=420, but its Dark button ends at x=631. At 1024 the pane ends at x=328, but the button ends at x=579. Hit-testing the TH/ZH/KO/JA/VI centers returns the plate pane's Index control rather than the language button. This is a functional overlap, not merely an aesthetic misalignment. See `header-hit-tests.json` and `axiomx-live-1440.png`.

### P2: CO Basemap Is Blocked By Its Served CSP

`public/co/co.js:194` requests CARTO tiles; the deployed `img-src` from `lib/security.mjs:22` does not permit CARTO. A browser at `https://axiom.nonarkara.org/co/` observes **24 tile requests blocked by CSP and zero loaded tiles**. Prefer the already permitted, proven map provider or add narrowly scoped policy support after verification; do not disable CSP. See `co-csp.json` and `co-live-1440.png`.

### P2: League Data Has No Honest Provenance

`public/vr/vr.js:10` calls its hardcoded table "representative" only in a source comment. The visible page presents Premier League 2026-27 data, credits openfootball/football.json, and claims a fetch date of 2026-10-08 (`index.html:42`, `:82`). There is no data fetch or bundled provenance record: each club is assigned `played: 50`, and W/D/L are dashes. Twenty clubs playing fifty matches each imply 500 matches, not the page's 50. Either use verified results with a source/as-of contract or label the complete view as a fictional demonstration. Do not present invented values as sourced evidence.

## Verification Results

Independent reviewer ran tests from separate `git archive` snapshots, not the dirty checkout:

| State | Unit Tests | Catalogue Check |
| --- | --- | --- |
| `560ea31`, before CO/VR | 66 passed, 0 failed | 6 passed |
| `2eff495`, CO | 61 passed, 5 failed | 3 artefacts failed |
| `1c24b74`, current main | 59 passed, 7 failed | 4 artefacts failed |
| Current dirty workspace | 116 passed, 1 failed | 6 passed |

The parent repeated the clean-main tests and catalogue check; the complete outputs are `main-tests.txt` and `main-catalogue-check.txt`. The workspace's remaining failure is the missing `/hikaru-non-go` spatial receipt. Its higher test count includes uncommitted tests and cannot certify main. The Go failures are introduced after the clean baseline, not an unrelated pre-existing exception.

Live browser capture covers main, the book, the claimed VR host and the actual published league route at 390 and 1440; reading-room header hit tests also cover 1024. Both Pages workflows succeeded according to the independent review, despite these functional failures. Deployment success and HTTP 200 are insufficient release criteria.

Security positives: existing local authentication, bounded-body/input validation, path containment, cross-site guards, private/public data boundaries and security-header tests pass. The live unknown admin API returns an honest 404. The static `/admin/` shell remains public (200), with no-store/noindex headers; Cloudflare Access remains the documented owner task. This audit is not a penetration test or security certification.

## MSH Verdict

**BLOCK**, not PASS: first-screen readability, overlapping controls, a blank primary scene and a prohibited basemap fail the checklist. No full fresh November 3 spatial sweep or clean Non-Slop verdict is claimed. Prior October 30 screenshots and receipts do not certify the subsequent mixed release.

## Repair Order

1. Reconcile the dirty work with main without discarding anyone's changes. Commit the Go source/category/plate/assets/generated outputs and generator/schema tests together.
2. Complete the paired hero HTML/CSS change and repair both navigation headers. Assert child clipping and hit ownership, not only document overflow.
3. Resolve product identity for the league view without replacing the existing VR hub. Correct both startup defects, then test rendering, camera framing, pointer/touch/keyboard selection, close behavior and reduced motion. The new code has no WebXR session entry, so headset VR is not established by a rendered 3D canvas either.
4. Fix the CO provider/policy mismatch without weakening browser protections. Make league provenance honest.
5. Run local checks against an isolated archive of the exact candidate commit, then deploy and exercise the canonical product URLs with screenshots, canvas-pixel checks and real actions. Preserve the project rule against CI file-specific pre-checks.

Skipped: merges, application changes, pushes and deploys, because the latest request is an audit and the release has confirmed blockers. Unverified: real headset/device behavior, every external catalogue application's internals, full spatial/Non-Slop compliance of a repaired release, and Cloudflare administrative configuration beyond the served responses.
