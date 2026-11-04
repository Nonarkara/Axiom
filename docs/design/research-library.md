# Shared Preprint Library

Owner brief, 4 November 2026: the research surface is a publication index,
not an artwork-bearing argument. This bibliography deliberately uses unframed
column rows rather than adding decorative artwork to satisfy an unrelated
plate rule. Existing argument plates, photographs and main-site imagery stay
untouched. If publication previews are added later, use verified PDF pages,
not invented artwork or catalogue plates.

Grid: column. The research map is the visual entry; its exit carries the library
heading, filters and publications. Each publication keeps title, author/version,
study coverage and PDF/source actions together; expandable study details carry
the question, evidence and limits. This is a bibliography with a geographic
index, not an operational map console: a compact overview leaves the first PDF
action reachable without requiring a full-screen map. The main site's existing
map-first operational hero remains untouched.
Publication titles and author spellings are not translated.
The seven main-site locales translate interface labels and the not-peer-reviewed
qualification. Counts in the system filter derive from the shared papers.

Source: `data/research.json`. Generate with `node scripts/research/build.mjs`.
Use `--check` for artifact parity and `--verify` to probe external PDF bytes.
Own-host PDF destinations map to files in `public/`; generation always verifies
their PDF signature and provided SHA-256. Never trust HTTP 200 alone.
The generator also owns each site's `research.js`, `research-geography.js` and
`research.css`, the book's no-JavaScript bibliography, and the book controller
copy. Edit shared styles in `scripts/research/library.css` and controller behavior
in `public/research-ui.js`, then regenerate. Do not hand-edit their book copies.

Verification: `node --test tests/research.test.mjs` and
`node .qa/research.mjs`. The browser check accepts `AXIOM_URL` and `AXIOMX_URL`
and defaults to the integration servers on 5462 and 5461. It captures both
surfaces at 390/1024/1440 into `.qa/research-{main,book}-{width}.png`.
Budgets: no horizontal overflow; title above metadata/coverage above actions;
compact gaps within each publication; the first PDF action remains visible at
the library entry on ordinary phone/tablet/desktop viewports. Expanded details
may grow to show real evidence, not padding. An injected action gap must fail
the geometry measurement. Enlarged text reflows without clipping; it is allowed
to scroll for meaningful content. Read actual measurements from the current QA
run rather than treating earlier four-paper row heights as permanent policy.

Geography comes from `scripts/research/geography.mjs`, with provenance and a
small bundled Natural Earth context map. National and regional frames are not
exact coverage boundaries; administrative-seat points only reference provincial
studies. Neither implies fieldwork, installation or official adoption. Unknown
geography remains unpinned and the paper remains available. Source coordinates
are not geolocation-accuracy promises. See the generated provenance manifest and
the source links next to the map.

English editorial summaries cite the printed pages of each linked version.
The PDFs are unchanged. [Publication workflow](../research/README.md) and
[author-facing review](../research/preprint-review-2026-11-04.md) explain how to
strengthen and revise future versions without silently replacing released bytes.

CO/VR links moved out of the primary headers, not removed from the products:
main footer and book colophon retain both links in every locale. Research stays
in the main footer and book index. Current rendered main masthead is 58px
at all three widths; book header is 44px. Screenshots and automated checks are
implementation evidence; the parent owns independent visual review and release.

## Verification Scope, 4 November 2026

The research-specific browser suite passed 177 checks; the full book journeys
passed 199 checks. Unit tests passed 141 checks with one unrelated optional
VR/CO browser test skipped. The independent research-map review passed after
repairing hidden-pane initialization, actual zoom hit dimensions, no-JavaScript
copy and enlarged-text circuit/footer overflow. Six normal-size viewport captures
are committed under `docs/design/evidence/research-{main,book}-{width}.png`.
Original paper hashes are unchanged. This verifies the library, not the papers'
scientific findings or public-safety effectiveness.

The separate legacy spatial driver **failed** its focused main-page run at
390/1024/1440. Raw measurements are committed as
`docs/design/evidence/research-spatial-main-2026-11-04.json`. It reports missing
390px receipts, changed catalogue-head measurements, first-action/HUD differences
against old receipts, and clipping inside the new Leaflet viewport. These results
do not constitute a whole-site spatial pass. The independent browser review
separately confirmed the hero's map, canvas and tour controls. The historical
baseline was not refreshed from this partial run: the driver's `--update` replaces
the route set, which would discard unmeasured routes. Reconciliation requires a
controlled baseline comparison and preservation of the other routes, not an
unqualified acceptance of these numbers. The new publication index has its own
content-specific geometry checks and defect falsifiers in `.qa/research.mjs`.

The specified Palette `tools/slop-lint.mjs` is absent from the local Palette
checkout. No scanner-clean or exhaustive all-breakpoint claim is made.
