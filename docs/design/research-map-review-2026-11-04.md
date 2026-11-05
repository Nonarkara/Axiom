---
updated: 2026-11-04
drafted_by: codex/gpt-5
reviewed: false
---

# Independent Research Map Review

**Superseded by owner rejection, 5 November 2026.** The PASS below is a historical
record, not current design approval. The owner demonstrated sparse full-width
publication towers and excessive repeated chrome that this review failed to
reject. See `research-compact-review-2026-11-05.md` for the replacement review.

**Final verdict: PASS for the Research UI only, on the reviewed local candidate.**

All three original BLOCK/REVISE findings and the subsequently isolated main
large-text reflow failure are resolved. No confirmed in-scope B-fail remains.
This is not certification of a commit archive, production deployment, external
data accuracy, every offscreen node, or an unavailable scanner.
The parent's focused legacy spatial-driver run FAILED with 16 findings; this
review does not convert that result to PASS or accept a global spatial baseline.

Candidate: stable, uncommitted working tree based on
`61374ed2dadf0e16a58735873bbfbc574d78848f`, served on ports 5481/5482.
Final retest began `2026-11-04T15:45:57.538Z` after the builder's stable handoff.
Rams/circuit asset versions: `20261104map2`. Served SHA-256 prefixes:

| Served asset | SHA-256 prefix |
| --- | --- |
| main research-ui.js | `5bbe048ab0d97c67` |
| book research-ui.js | `556a9ad70ff2441d` |
| shared research.css | `1e00a7987bafd4ae` |
| book reader.js | `d2680a811df5710b` |
| book research.js | `c466ac4b3abbef34` |
| main rams.css | `7ca67cbfc4a59dab` |
| main circuit.css | `a2438030d1e19b2b` |

Full served-asset hashes and measured results are in `final-repair-retest.json`.
`node scripts/research/build.mjs --check` independently passed: five preprints,
artifacts current. The book controller matches the generated main controller
with its expected generated-file banner.

### Semantic Follow-Up

PASS retained after the parent's generated `role="region"` addition and geography
CRS/coordinate-order metadata update. Fresh 390px accessibility snapshots on both
sites expose exactly one `region "Research geography"` containing named
`button "Zoom in"` / `button "Zoom out"`, region tooltips and attribution links.
Both maps are ready. Generated-artifact parity passes again. Evidence:
`accessibility-region-final.json`.

Updated served candidate hashes are in `semantic-candidate-hashes.json`:
main HTML `e9b1433dccaf81e4`, book HTML `26aee2c7e9a26278`, shared research.js
`489ee6c2d25c2ca9`, shared geography data `b8b934ed27a2fec1` (SHA-256 prefixes).
Main/book controller hashes and shared research CSS hash are identical to the
fully exercised candidate above. The earlier research.js hash identifies the
pre-semantic full pixel/interaction run, not these regenerated HTML/data bytes.
This follow-up verifies the English accessibility tree, not another full visual
matrix or a claim that a real assistive-technology user completed the task.

Auditor: Codex, independent of builder Ptolemy. No UI files edited.
URLs: main `http://127.0.0.1:5482/#research`; book
`http://127.0.0.1:5481/#research`. Parent owns both servers.

## Findings And Resolutions

1. **RESOLVED: B1/B4/B14 book phone map initialized without usable geometry.**
   Three independent fresh Chromium pages at 390x844 reproduce a map claiming
   `data-map-state=ready`, but drawing `M0 0` paths, stacking labels at its upper
   left, disabling zoom-in and raising `Invalid LatLng object: (NaN, NaN)`.
   Desktop/tablet render correctly. Initializing while the phone plate is hidden
   is consistent with the evidence; this causal explanation is an inference.
   Defer fitting until the map has a nonzero size and the plate is visible, then
   invalidate and fit once without overriding subsequent manual navigation.
   Falsifier: three fresh direct phone deep links must have real path coordinates,
   visible land/context and working zoom, without page errors. Also test arriving
   through the book index and returning after Back.
   Evidence: `book-phone-repeat.json`, `book-phone-repeat-0.png` through `-2.png`.
   Final independent repair retest: three fresh 390x844 pages each render 43
   finite SVG paths, including four valid study-region paths; zoom-in is enabled
   and changes the frame geometry. Each can filter to `gauge-to-shelter`, return
   through Back/index, and remount a ready map with zero page errors. Evidence:
   `phone-fixed-retest.json`, `book-phone-fixed-0.png` through `-2.png`.

2. **RESOLVED: B13 main research zoom actions were 30x30px.**
   At 390, 1024 and 1440 the actual main +/- anchor boxes are 30x30, whereas the
   book renders 44x44. These are standalone map actions, not dense text chips.
   Main loads `research.css` before Leaflet CSS; its later touch-control rule can
   win at equal specificity. Repair stylesheet ordering or scope the override
   more specifically. Verify actual painted/hit geometry, not the declared rule.
   Evidence: `geometry.json`, `main-390.png`, `main-1440.png`.
   Final independent measurements are 44x44px for both +/- actions on both
   sites at 390/1024/1440, ordinary and all-node computed 200% text. Evidence:
   `final-repair-retest.json`, `final-main-*-normal.png`.

3. **RESOLVED: B12 no-JavaScript fallback promised unavailable filters.**
   Both sites display "The publication list and filters remain available" while
   their filters are hidden. The five rows and their PDF links remain usable.
   Distinguish no-JavaScript copy from the map-only failure message; do not expose
   inert selects. Evidence: `fallbacks.json`, `main-noscript.png`, `book-noscript.png`.
   Final independent no-JavaScript tests on both sites now say: "The map and
   filters require JavaScript. All papers and PDF links are available below."
   Both render five publications, five row PDF links and no inert visible selects.
   Evidence: `final-main-noscript.png`, `final-book-noscript.png` and final JSON.

4. **RESOLVED: B13 main phone document did not fully reflow at 200% text.**
   Same-candidate baseline at 390px is `scrollWidth=390`; doubled computed font
   sizes produce `scrollWidth=447`. The header spans x0-390 and no header child
   extends outside the viewport. The research section spans x17-373. The actual
   unclipped contributors are `.cx-head__lbl` ("Working system"), x229.11-447.31,
   width 218.20, and the footer Research link, x260-404.73, width 144.73.
   Browser-only diagnostic clipping of `.cx-head__stats` reduces document width
   to 405; clipping `.foot__row .nav` as well reduces it to 390 without reordering
   links. This is causal isolation, not an acceptable repair: text must reflow.
   `public/circuit.css:105` keeps labels nowrap inside the phone's two-column
   stats; the footer uses three minmax columns with fit-content links in
   `public/rams.css:1529`. Let labels/links wrap within their actual tracks,
   preserving the normal 58px header. Do not mask this with global overflow hidden.
   Separately, `#evidenceDeploy` ("just now") extends to x470.80 but is clipped by
   `.evidence-strip` at x374; it is a large-text legibility problem, not the source
   of the 57px document overflow. No historical baseline was tested, so none of
   these is claimed to predate the current work.
   Evidence: `overflow-trace.json`, `overflow-isolation.json`,
   `overflow-counterfactual.json`, `main-390-overflow-trace.png`.
   Parent's surgical wrap repair independently verified on fresh pages with
   `20261104map2` rams/circuit styles: document width equals viewport width at
   390/1024/1440 at both ordinary size and all-node computed 200% text. The label,
   footer link and `just now` value have no clipping ancestors intersecting their
   rendered rectangles. At 390 enlarged text, label and footer finish at x374,
   while `just now` finishes at x306.14. The ordinary header stays 58px at all
   three widths; phone stats retain the two-column layout. Screenshots confirm
   genuine wrapping rather than hidden overflow. Evidence: `wrapfix-recheck.json`,
   `main-*-wrapfix-normal.png`, `main-*-wrapfix-text200.png`,
   `evidence-wrapfix-text200.png`, `circuit-wrapfix-text200.png`.

The initial transient unavailable-map report is withdrawn: subsequent fresh
loads initialize the main map and desktop book map. It is not an open finding.
The separate blocked-geography option-label bug reported by the parent is fixed:
both sites retain Thailand (2), Chiang Mai province (1), Nakhon Si Thammarat (1)
and Middle East / Gulf (1) with the geography script aborted. Chiang Mai filtering
still returns `gauge-to-shelter`. Evidence: `map-data-failure.json`.

## Design Judgment

- Named grid: **column**. Intended attention order is geography, publication
  context, first download, filters, then detailed bibliography. Main and desktop
  book achieve this without headline leapfrogging.
- **Compact-map exception is valid.** This is a research bibliography, not an
  operational command map. A 240px phone / 300px desktop geographic index earns
  its space and protects access to publications. The operational 60% first-screen
  map rule must not inflate this map. This exception does not extend to the main
  site's operational hero.
- At normal text size the first matching PDF action is visible on all three
  widths. Main 390: y493-537; book 390: y512-556. Main 1440: y537-581; book 1440:
  y552-596. Header heights are main 58px and book 44px.
- The early first-paper strip is useful with the current one-paper-per-system
  catalogue: it avoids requiring a scroll through a long title before downloading.
  Its link's accessible name includes the full paper title. System/version alone
  is a future visible-identity ambiguity if a system gains multiple publications;
  not a present blocking defect. Add an honest concise title when that occurs.
- City references are explicitly not field sites or provincial boundaries. The
  coarse national frame and published ADS-B analysis box are distinguished in
  provenance. No fieldwork, official adoption or outcome is inferred from a dot.
- Enlarged-text captures use a fresh page per case and double every element's
  computed font size; this is a text-only stress simulation, not native browser
  zoom certification. At 390, full captions and publication context push the first
  PDF below the viewport (main y918; book y958); this is real text, not empty chrome.
  Initial main captures had 57px document overflow; finding 4 records the exact
  contributors and their verified repair. Fresh `map2` captures at ordinary and
  all-node computed 200% text now have zero document overflow at all three widths.
  The targeted evidence value, circuit label and footer link reflow without
  clipping. Attribution and map labels stay legible. This is not an exhaustive
  inspection of every offscreen text node or native browser-zoom certification.

## Exercised Behaviors

- All four regions and reset produce the expected 2/1/1/1/5 paper sets on both
  sites. First-PDF destinations follow the first visible paper.
- Incompatible region/system selections clear the conflicting prior control.
  Native keyboard selection (`f`, Tab) selects FloodDash without chapter changes.
- Clicking the Chiang Mai reference dot on both sites selects its region, shows
  only `gauge-to-shelter` and updates the early PDF action to that paper.
- Focused map ArrowRight pans 80px on both sites at 1024; it does not change
  `#research`. Focus is visible. Enter opens study details; the question, evidence
  and limitation remain together and cite printed pages.
- Aborting the geography script leaves both selects, five papers and downloads
  usable. The known region labels remain correct after the builder's repair.
- With JavaScript disabled, both sites show five papers and five row PDF links;
  the reader shell does not obstruct the static fallback.
- Main hero preservation spot-check: initialized Leaflet map, 1440px-wide canvas,
  18 project-location options, and a tour button switching from Pause to Resume.
  No working-tree changes to `public/app.js`, `public/hero.css` or `public/rams.css`
  were present during this check. This is a focused preservation check, not a full
  hero interaction regression suite.

## Evidence And Limits

Evidence directory: `/tmp/axiom-nov4-review/research-map/`.
Normal and text200 screenshots exist for main/book at 390x844, 1024x900 and
1440x900. JSON files record geometry, interactions, failure fallbacks, repeated
phone initialization and hero preservation. Screenshots were opened and visually
inspected, not accepted solely from DOM measurements.

Read: current AGENTS.md context, STYLE.md, canonical MSH/Glance/Kinetic documents,
the manifest, publication README, shared map controller/CSS, generator and geometry
provenance. Geometry sources and their declared precision were inspected; this is
not an independent re-survey or independent certification of paper findings.

Scanner unavailable: the parent confirmed that the expected local
`palette/tools/slop-lint.mjs` does not exist (the palette directory contains
documentation but not that tool). No scanner-clean claim is made.

Completed final keyboard regression retest: focused book `button.item` retains
ArrowDown navigation from `#axiom` to `#problem` and ArrowUp back to `#axiom`.
Native select typing chooses FloodDash while retaining `#research`; focused-map
ArrowRight changes its pane transform by -80px without leaving `#research`.
The broad-button guard no longer blocks earned index-item navigation.

Final captures: `final-{main,book}-{390,1024,1440}-{normal,text200}.png`.
All 12 measured renders have ready maps with 43 SVG paths and zero document
horizontal overflow. Ordinary main headers remain 58px. The fresh book phone
normal and enlarged captures were visually inspected and contain actual geography,
not a ready flag over an empty SVG.

For deterministic main-page captures, the external Leaflet 1.9.4 requests were
fulfilled with the project's identical vendored Leaflet bytes, and remote font
stylesheet requests were blocked. Latin text uses the protected local Helvetica
stack. This avoids external-network stalls; it does not certify remote-CDN or
translated-webfont availability. Separate earlier natural-load checks exercised
the ordinary page without these substitutions.

## Legacy Spatial-Driver Clip Classification

The parent supplied `/tmp/axiom-research-spatial.json` from a focused legacy run
that failed with 16 findings, including main research-map clip metrics of
35/99/120px. Independently reproduced measurements identify those exact three
metrics as **cartographic viewport with Leaflet renderer padding**, not hidden
publication content, controls or label ink:

| Viewport | Map client width | SVG relative x/right | SVG width | Reported clip |
| --- | --- | --- | --- | --- |
| 390 | 356 | -36 / 391 | 427 | 35 |
| 1024 | 990 | -99 / 1089 | 1188 | 99 |
| 1440 | 1198 | -120 / 1318 | 1438 | 120 |

Leaflet's SVG renderer extends approximately 10% beyond each viewport edge.
The map deliberately clips its padded renderer and off-viewport country context;
panning reveals that geography. Its native `scrollWidth-clientWidth` therefore
measures renderer overscan, not a lost row of text. The immutable probe's 5c rule
exempts bitmap/video/canvas crop frames but does not similarly classify an SVG
map, so it correctly reports the raw metric without judging this map's intent.
No probe or baseline was edited or blindly regenerated.

Fresh main checks at all three widths, ordinary and computed 200% text, find no
tooltip, zoom control or attribution box extending outside the map, and zero
document overflow. Both book desktop/tablet maps also contain those protected
elements. At book 390/200%, the Thailand tooltip's transparent padding extends
2.14px beyond the map; its text-advance box exceeds the edge by 0.14px, but actual
glyph ink ends at x366.52 inside the map's x368 edge. A rendered crop confirms
the complete label is visible. This is not a clipped label/control failure.
Evidence: `clip-viewport-classification.json`, `clip-viewport-{main,book}-*.png`,
`book-tooltip-ink.json`, `book-tooltip-text200.png`.

This is a named, evidence-backed explanation of the Research map findings only.
The remaining legacy findings, hero/HUD/first-action comparisons, stale receipt
questions and absent 390 baseline coverage are not independently resolved here.
Their failed/inconclusive gate status remains with the parent's separate record.
Research-only visual PASS must not be cited as a global baseline or spatial-gate
PASS.

Not run: heavyweight sweeps, full seven-locale matrix, repository-wide slop scan,
full hero suite or canonical production verification. The parent reports five
unchanged PDF hashes; this map audit does not replace that PDF-content review.
This dirty working-tree result does not certify a commit archive or deployed bytes.
