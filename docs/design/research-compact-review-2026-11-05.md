---
updated: 2026-11-05
drafted_by: codex/gpt-5
reviewed: false
---

# Research Compact Review

Independent visual auditor: Codex, not the repair builder.

**Final overall compact-replacement verdict: PASS for both local six-paper research sections. Deployment: UNVERIFIED. Scientific manuscript assessment: outside this visual/preservation review.**
**Rejected baseline `beb7dd2`: BLOCK.** Its previous functional PASS does not establish spatial quality and is not carried forward.

## Contract

Read the latest `AGENTS.md`, `STYLE.md`, and the canonical `_reference/MSH.md`, `GLANCE-PATH-FOR-AI.md`, and `KINETIC-GRIDS-FOR-AI.md` before reviewing. Obsidian context lookup was attempted but the transport was closed; no recalled guidance overrides these files.

Named grid: **column**. Desktop: a compact map rail beside a publication reading index, with paper actions adjacent to titles rather than below repeated vertical towers. Mobile: map, compact heading/qualifications and filters, then papers. Preserve all five PDFs, map, author/version/date/coverage metadata, study details, provenance and filters. Preserve the main/book identities. No UI edits by this auditor.

Review hosts: book `http://127.0.0.1:5501/#research`; main `http://127.0.0.1:5502/#research`.

Required viewports: 390, 1024, 1440, 1920 and 3440 CSS pixels; also **1152 CSS pixels at deviceScaleFactor 3**, producing a 3456-device-pixel-wide image. Device pixels must not be mistaken for layout width. Enlarged text must retain complete titles, metadata, action labels and working filters.

## Rejected Baseline Evidence

Captured from `beb7dd2` before the parent repair. Height is the complete closed-details research section, not the document or navigation. Title-to-PDF is the vertical difference between their top edges.

| Surface | CSS width / DPR | Research height | Map width x height | Closed paper heights | Title-to-PDF |
|---|---:|---:|---:|---:|---:|
| Book | 390 / 1 | 2142px | 346 x 240px | 271-318px | 154-201px |
| Book | 1024 / 1 | 1815px | 652 x 300px | 224-271px | 107-154px |
| Book | 1440 / 1 | 1764px | 920 x 300px | 224-244px | 107-127px |
| Book | 1920 / 1 | 1764px | 920 x 300px | 224-244px | 107-127px |
| Book | 3440 / 1 | 1764px | 920 x 300px | 224-244px | 107-127px |
| Book | 1152 / 3 | 1788px | 739 x 300px | 224-244px | 107-127px |
| Main | 390 / 1 | 1874px | 356 x 240px | 225-245px | 108-128px |
| Main | 1024 / 1 | 1695px | 990 x 300px | 206-225px | 89-108px |
| Main | 1440 / 1 | 1695px | 1198 x 300px | 206-225px | 89-108px |
| Main | 1920 / 1 | 1695px | 1198 x 300px | 206-225px | 89-108px |
| Main | 3440 / 1 | 1695px | 1198 x 300px | 206-225px | 89-108px |
| Main | 1152 / 3 | 1695px | 1118 x 300px | 206-225px | 89-108px |

Confirmed baseline failures:

- **B3/B4/B5: vertical towers and dead right-hand row area.** Desktop rows allocate a full-width band to a narrow text measure, then place metadata, coverage, actions and disclosure on separate tracks. This repeats the same wasted space five times. At 1440 the main row is 1198px wide but its title measure is about half that width.
- **B8: the PDF action is separated from its title.** A 12px coverage-to-action gap check passes while the actual title/action relationship remains 89-154px apart on desktop. That nearby-success metric cannot clear the owner's defect.
- **B1/B2: duplicate shortcut band consumes reading space.** Every baseline viewport contains the extra "First matching paper" strip, repeating an action already belonging to the first paper and preceding the real filters/index.
- **Column contract fails.** The desktop map spans the publication width and pushes the entire index below it instead of occupying a compact adjacent rail. Calling a one-column stack a column grid does not make it the requested desktop composition.

Inspected screenshots: [book 1152 CSS / DPR 3](/tmp/axiom-research-independent-review/old-book-1152-dpr3.png), [main 1440](/tmp/axiom-research-independent-review/old-main-1440-dpr1.png). Additional baseline screenshots and unrounded measurements are in `/tmp/axiom-research-independent-review/old-measurements.json` and sibling PNGs. These are local evidence, not deployed artifacts.

## Replacement Gates

These checks must reject the baseline above, not merely detect an artificially injected 200px gap:

1. Desktop map rail and reading index actually sit beside each other within the available reading pane; no full-publication-width map followed by the old tall index.
2. No duplicated first-matching-paper strip. Each paper owns its PDF/source action group beside its title where the pane permits; narrow layouts may wrap without deleting information or shrinking text.
3. Measure closed paper height, whole research height, title/action separation, map dimensions and first useful action at every required viewport. A better overflow result alone cannot pass.
4. Phone reading order is map, compact complete qualification/filter group, then papers. First useful paper action must be reachable without empty chrome. Keyboard follows the visual order.
5. All five papers, titles, author spellings, dates/versions, geographic qualifications, PDF destinations/hashes, source links, detail fields and working region/system filters remain. The map must paint actual geometry and respond to selection, not become a static placeholder.
6. Enlarged text reflows with complete content and reachable controls. Review both surfaces and the high-DPR case; do not extrapolate from a single wide screenshot.

## Final Review

The parent signalled initial-render readiness and requested immediate REVISE findings. The following is an independent rendered review of that initial repair, not a release clearance.

### Confirmed Revision

**[P2] Do not crush the disclosure into a one-word fragment column at enlarged phone text (B3/B8/B13).** At 390px, with research body/actions/disclosures enlarged to 28px and titles to 36px, the closed `.research-commands` grid gives the PDF/Source group 293px of the book's 346px reading width, then leaves only 37px for "Study details". The summary becomes **294px tall**, breaking "Study" and "details" inside words. Main repeats it at 39px wide. Overflow remains zero, so overflow-only tests miss the defect. The source rule is `scripts/research/library.css`, `.research-commands { grid-template-columns: max-content minmax(0, 1fr) }`.

Repair: allow whole command groups to wrap when their intrinsic widths do not fit. Retain normal-size single-line commands and full-width open details; do not shrink or hide labels. An enlarged summary must have room for its longest unbroken word plus marker, or move intact to the next line. [Actual phone viewport, enlarged book command](/tmp/axiom-research-independent-review/enlarged-book-390-command.png).

**[P2] Keep a user-selected map result visible after collapsing scrolled content (B1/B8).** On main at 1440x900: open AirDash study details, scroll to NST (last paper), then click the Chiang Mai city dot on the sticky map. The filter correctly selects `gauge-to-shelter`, but collapse moves its title to **y=-230px** and PDF to **y=-159px**; the screen now shows contact/footer content rather than the requested paper. At 1440x600 the selected title also ends up above the viewport. Book automatically clamps its scroller and recovers correctly in both heights. A trivial closed-list run at 900px does not reproduce this because all five compact main rows already fit: the expanded-detail precondition is essential. Repair with a user-triggered nearest scroll after selection/reflow only when the selected title/action is obscured. No timer, autoplay or later control takeover. [Failure viewport](/tmp/axiom-research-independent-review/sticky-expanded-main-1440x900.png).

**Longest native select:** after removing the 24ch cap, `GlobalWatch / GlobalMonitor (1)` fits at normal size in all tested widths. Enlarged controls remain viewport-bounded, but at 390px the book's selected text measures 401px before arrow/padding while the control is capped at 346px; its visible value truncates. Main similarly truncates at its 356px limit. The complete native option and corresponding paper metadata still exist; this is not missing model data. Under the owner's explicit no-dropped-label criterion, show the selected full value in a wrapping representation when the native control cannot display it. [Enlarged book select](/tmp/axiom-research-independent-review/longest-book-390-enlarged.png).

### Measured Improvement

These initial captures precede the parent's subsequent book sticky-offset/select-width refinements and must be refreshed for final clearance. Heights are rounded; first PDF is the actual first paper's action, not a duplicated shortcut. Capture height: 900 CSS pixels.

| Surface | CSS width / DPR | Old -> new total height | Reduction | First actual PDF top | Map width x height |
|---|---:|---:|---:|---:|---:|
| Book | 390 / 1 | 2142 -> 1571px | 27% | 726px | 346 x 220px |
| Book | 1024 / 1 | 1815 -> 1187px | 35% | 599px | 652 x 220px |
| Book | 1440 / 1 | 1764 -> 866px | 51% | 298px | 280 x 280px |
| Book | 1920 / 1 | 1764 -> 826px | 53% | 278px | 320 x 280px |
| Book | 3440 / 1 | 1764 -> 826px | 53% | 278px | 320 x 280px |
| Book | 1152 / 3 | 1788 -> 1147px | 36% | 579px | 739 x 220px |
| Main | 390 / 1 | 1874 -> 1507px | 20% | 694px | 356 x 220px |
| Main | 1024 / 1 | 1695 -> 836px | 51% | 253px | 280 x 280px |
| Main | 1440 / 1 | 1695 -> 799px | 53% | 253px | 320 x 280px |
| Main | 1920 / 1 | 1695 -> 799px | 53% | 253px | 320 x 280px |
| Main | 3440 / 1 | 1695 -> 799px | 53% | 253px | 320 x 280px |
| Main | 1152 / 3 | 1695 -> 836px | 51% | 253px | 320 x 280px |

Normal-size commands share one 44px line. Paper rows are 132-153px at desktop widths rather than 206-271px. The duplicate shortcut is absent in all 12 cases. At 1440 and above both surfaces have the compact independent map rail. At 1024 and 1152/3 the book has only 652/739px available after its navigation pane, so it intentionally uses the 220px map-first stack under the parent's explicit **850px available-container** breakpoint. The main surface has sufficient room and remains two-column. Outer margins at ultrawide sizes are not the old internal row void: the publication measure is deliberately bounded rather than stretched across 3440px.

### Old-UI Falsifier

Applied the same task-specific checks to saved actual DOM rectangles, without injecting an unrelated 200px fault:

- No `[data-research-selection]` duplicate.
- Closed rows at CSS widths >=1024 must be <=180px with this five-paper dataset and normal text.
- Where available research width is >=850px, map width <=340px and height <=280px, and complete closed-details research height <=950px.
- At 390px, the **actual first row PDF** must end at or before y=844px.

**Old baseline: all 12 viewport/surface cases fail. Initial repair: all 12 pass these normal-size gates.** This does not clear the separately confirmed enlarged-text failure.

### Preservation And Interaction

Independent Chromium checks on both surfaces confirmed every paper's full title, each author's exact spelling, date, version, geographic label, PDF URL and source URL. Opened every study disclosure and compared question/evidence/limitation against `data/research.json`; open disclosures use the row width, with the prose's normal reading measure preserved. System filtering, region filtering and incompatible-filter reset work. PDF -> Source -> Study details is the keyboard order; focus is visible in keyboard modality and Enter opens the disclosure. No page exceptions occurred in these flows.

Fetched all five PDFs from the parent's main server. Each begins `%PDF-` and its SHA-256 equals the manifest:

| Paper ID | PDF bytes | Hash |
|---|---:|---|
| rain-to-phone | 511985 | Exact manifest match |
| nobody-owns-the-haze | 469158 | Exact manifest match |
| gauge-to-shelter | 471741 | Exact manifest match |
| seeing-a-war | 2679470 | Exact manifest match |
| nst-last-mile | 442571 | Exact manifest match |

Enlarged-text checks ran across all 12 required viewport/surface combinations. No horizontal root overflow or visible element escape was found; the phone's command-column crushing demonstrates why those passing measurements alone are insufficient. Full-root screenshots inside the book's independently scrolling pane can contain offscreen blank areas; the reported defect is verified in a real viewport capture after scrolling the command into view, not inferred from that screenshot artifact.

Unverified: deployed bytes, isolated candidate commit, broader non-research routes and final parent revisions. This auditor changed only this Markdown report. A final PASS requires reinspection after the enlarged-command repair and the parent's final-ready signal.

Additional requested flows: opened map provenance and study details across all six required layouts on both surfaces. Provenance retains all five sources/geometry qualifications, including the city-reference/not-field-site distinction and Gulf analysis-frame page reference. No field deletion or horizontal overflow was found. At 1440x600 and 1440x900, book sticky-map selection remained visible after an expanded row was removed by filtering; main fails that same stronger workflow as recorded above.

## Final Recheck Of Parent Fixes

The parent regenerated both renderings after replacing the command grid with wrapping flex groups, adding the metadata separator, removing the select cap, correcting the book sticky offset and adding nearest/instant scrolling only to the user-triggered `selectRegion` path. Earlier failures above are retained as an audit trail, not asserted against repaired bytes.

**Resolved: enlarged command fragmentation.** Rechecked both surfaces at all six requested CSS/DPR layouts, normal and enlarged (24 combinations). Every normal command group remains one 44px line. At enlarged 390px, PDF/Source and the intact disclosure wrap into 103px total, with "Study details" occupying approximately 193-198px by 59px rather than a 37px by 294px fragment column. No horizontal root overflow. [Repaired enlarged phone command](/tmp/axiom-research-independent-review/final-book-390-enlarged-command.png).

**Resolved: main result stranded after filter collapse.** In the expanded-AirDash/mid-list workflow, final main at 1440x900 places the selected CNX title at y=77 and actual PDF at y=148, below its 58px sticky header. Main also passes at 1440x600, 1024, 1920, 3440 and 1152 CSS/DPR 3. Phone selection yields the actual PDF ending at y=838 within the 844px viewport. Book passes the required six-width matrix at 844/900px heights. The PDF href is the CNX paper, not merely an arbitrary visible link. No additional scroll occurred during a subsequent 400ms idle interval. [Main after correction](/tmp/axiom-research-independent-review/final-fixed-sticky-main-1440.png).

**Remaining [P2]: map click is lost when short book pane scrolls between pointer-down and pointer-up (B13/B14).** Additional desktop-height stress check: book at 1440x600, open AirDash study details, scroll NST into view, then click the sticky Chiang Mai dot. Reproduced **4/4 times**, including after a 300ms settle. Before clicking, `elementFromPoint` at the dot centre is the Chiang Mai path. Captured event sequence:

```text
pointerdown -> path[data-research-map-region="chiang-mai"] at 680,243
mousedown   -> same path at 680,242
pointerup   -> DIV at the same coordinates
mouseup     -> DIV
click       -> DIV
region remains ""; count remains "5 / 5 papers"
```

The selected-result scroll repair is not reached because the intended map click never fires. Apparent mechanism: focusing the Leaflet container scrolls the book's internal pane, moving the sticky map away before pointer-up. That cause is an inference; the changed hit target and absent filter action are direct browser evidence. Correct focus without scrolling the pane, retaining keyboard map interaction; do not disable the map or use forced/synthetic clicks to turn the test green. [Failure viewport](/tmp/axiom-research-independent-review/sticky-book600-clickfailure.png).

The native selected-value limitation at enlarged 390px remains disclosed above: the option and paper metadata retain the full string, but the closed native control visually truncates it. No scientific data, PDFs, fields or labels were deleted to achieve the measured height reduction.

Latest screenshots/geometry are `/tmp/axiom-research-independent-review/final-*.png` and `final-measurements.json`. These are local working-tree evidence, not isolated-commit or live-deployment clearance. All UI ownership remained with the parent; this auditor edited only this report.

## Pointer-Focus And Full-Label Follow-Up

**Resolved: short-book lost click.** After the parent's capture-phase `mousedown` focus with `preventScroll: true`, repeated the actual unforced 1440x600 book flow four times. All **4/4** runs select `chiang-mai` / `gauge-to-shelter`; pointer-down, pointer-up and click all remain on the same path. The selected title is at y=182px and its PDF at y=274-318px. [Corrected viewport](/tmp/axiom-research-independent-review/focus-fixed-book1440x600.png).

**Remaining [P2]: selected-label measurement uses an empty computed font on main.** At enlarged 390px, the new full-label span works on book and contains the entire `GlobalWatch / GlobalMonitor (1)` string without overflow. On main, however, `getComputedStyle(systemSelect).font` returns an empty string while `fontSize` is 28px. Assigning that empty shorthand to canvas leaves the canvas default font, substantially underestimating the selected text. The span remains `hidden=true` while the actual native control still visibly truncates the value. Construct the measurement font from explicit computed properties when the shorthand is unavailable. [Main failure](/tmp/axiom-research-independent-review/value-fixed-main-390-enlarged.png).

Also confirmed a false-positive on book: at normal 1440px, selected text measures 229px, the control's client width is 257px, and its full-label span nevertheless appears. It remains visible after widening from enlarged phone to desktop. The fixed 44px deduction exceeds this native control's real text/arrow budget and produces redundant output when the selected value fits. Test both directions: narrow/enlarged must reveal the complete value; a genuinely fitting control must remove the extra span.

The sixth Foresight paper was still pending when these checks ran. Five-paper provenance/hash results above remain evidence for those five files only, not clearance of a six-paper release.

### Explicit-Font Retest

The parent now constructs the canvas font from computed `fontStyle`, `fontWeight`, `fontSize` and `fontFamily`. That resolves main's empty-shorthand undermeasurement. Enlarged phone labels are preserved rather than silently truncated, and the output hides when the filter is cleared.

**Remaining [P3]: a fitting native value still causes redundant output.** The revised allowance subtracts measured left/right padding plus a fixed 24px arrow. At book normal 1440px, the select's client width is 257px, selected text is 229.34px and the computed allowance is only 225px. The control sizes to the selected value, yet the output appears. Enlarged phone -> desktop resizing likewise leaves the output visible after the native value fits. This is a conservative threshold false positive, not missing content or the previous wrong-font defect. Calibrate against the native control's intrinsic fit or use a justified subpixel/native-arrow tolerance; retain the enlarged phone's complete output. Do not claim the "only when clipped" condition passes until both reveal and hide directions work.

No sixth-paper layout/content/PDF certification is included in this retest.

Completed the explicit-font retest across **24 combinations** (both surfaces, all six required width/DPR cases, normal/enlarged). Full enlarged-phone value is now visible at the same 28px size on both surfaces, without overflow; clearing the filter hides it correctly. Both ordinary 1440px surfaces still show a redundant full-value line below a native select which already displays the complete value. The resize reveal/hide check therefore remains REVISE for the threshold alone. [Main enlarged value preserved](/tmp/axiom-research-independent-review/explicit-font-main-390-enlarged.png); [book normal-size unnecessary duplication](/tmp/axiom-research-independent-review/explicit-font-book-1440-normal.png). Results: `/tmp/axiom-research-independent-review/explicit-font-results.json`.

## Intrinsic-Measurement Final Check

**Resolved: conditional full-label output.** The parent's final controller measures a same-parent native select clone with the same selected value and styling, unconstrained width, then removes it. It compares intrinsic width with actual rendered width plus 1px; no canvas font or arrow-width guess remains.

Repeated both surfaces across 390, 1024, 1440, 1920 and 3440 CSS pixels plus 1152 CSS/DPR 3, normal and enlarged: **24/24 combinations pass**. No normal-size case shows unnecessary output. Both enlarged 390px cases show the full selected string at 28px without overflow. On the same page, **phone reveal -> desktop hide -> phone reveal -> filter-clear hide** passes for both surfaces. Each settled DOM contains exactly one real `[data-research-filter]` select; the measurement clone is removed. No script exceptions occurred. [Book desktop, no duplicate](/tmp/axiom-research-independent-review/intrinsic-book-1440-normal.png); [main enlarged phone, complete label](/tmp/axiom-research-independent-review/intrinsic-main-390-enlarged.png). Machine-readable observations: `/tmp/axiom-research-independent-review/intrinsic-results.json`.

All confirmed repair findings in this report are now resolved for the **five-paper local UI**. The rejected `beb7dd2` layout still fails the new task-specific review; that rejection is not superseded by the repaired UI's scoped pass. The pending Foresight manuscript is not yet in `data/research.json` (confirmed five entries at this check), and neither its content nor a six-paper layout, PDF hash, isolated candidate commit or deployment has been cleared. Only this Markdown report was edited by the auditor.

## Final Six-Paper Verdict

**PASS: independent compact replacement, both local surfaces.** This final section supersedes earlier pending-content statuses. Earlier REVISE findings remain as the chronological evidence of defects found and repaired, not outstanding findings against the final rendering. `beb7dd2` remains **BLOCK** under the new review; its old functional PASS is not defended or reinstated.

Reviewed after the parent added `foresight-inspectable-decisions` as the sixth/last paper. The source manifest stayed byte-identical throughout the final review: SHA-256 `6f813ab9e320f04de26d03ad647cc17ee1557fd5ec37b39e5f3db716c338811a`.

### Final Geometry Matrix

Normal-text measurements at 844px viewport height, all six disclosures closed. "Section / sixth" is the total section height followed by the sixth row height. PDF bottom is the actual first row download's bottom edge, not a duplicate shortcut. All values are CSS pixels, rounded.

| CSS width / DPR | Book section / sixth | Main section / sixth | Book first PDF bottom | Main first PDF bottom |
|---|---:|---:|---:|---:|
| 390 / 1 | 1790 / 239 | 1692 / 210 | 749 | 694 |
| 1024 / 1 | 1320 / 153 | 986 / 150 | 623 | 298 |
| 1440 / 1 | 1018 / 153 | 949 / 150 | 322 | 297 |
| 1920 / 1 | 979 / 153 | 949 / 150 | 322 | 297 |
| 3440 / 1 | 979 / 153 | 949 / 150 | 322 | 297 |
| 1152 / 3 | 1300 / 153 | 986 / 150 | 623 | 297 |

The map remains independently 280px high in the desktop rail, never stretched to the six-row index. It is 220px high in the narrow map-first path. The book's 1024/1152px viewports have less than 850px available after navigation and intentionally use the narrow path; main remains side-by-side there. A sixth complete paper earns another 150-153px desktop row, not another oversized shelf or map. The desktop row budget stays **180px**. For the complete six-paper task, the prior five-paper 950px ceiling gains only that same 180px additional-record allowance: **1130px** where an adjacent map rail fits. Both surfaces pass. This content-count adjustment does not excuse the old layout: its 206-271px rows, full-width desktop map and duplicate strip still fail independently.

All normal command groups remain exactly one **44px line**. No duplicate first-matching-paper strip. Phone order is map -> compact complete heading/qualification/filters -> papers, with the real first PDF inside 844px. At ultrawide widths the bounded publication measure is intentional outer whitespace, not text stranded inside full-width empty rows. The sixth paper is visible on scroll with complete title, authors, date/version, scope and its own command line. Its additional scroll presents new content, not empty chrome.

### Preservation And Access

Final automated/browser matrix: **24/24** combinations across both sites, all six width/DPR cases, normal/enlarged. Every case compares all six full titles, exact author spellings, dates, versions and coverage labels with the manifest; all six PDF/source hrefs remain correct. Opened every paper's disclosure and verified all question/evidence/limitation text. Opened map provenance and retained all five geographic sources and qualifications. System filtering selects only The Anchor Console; the national filter now correctly returns three papers; clearing returns six. No script exceptions or horizontal overflow.

Also ran a stricter **12/12 true 200% text** matrix, doubling each element's actual computed size rather than assuming a fixed enlarged size. That includes 56px section headings; book body 28px and native/actions/disclosures 32px; main body/actions/native controls 26px. Open study and provenance states remain unclipped. Phone command groups wrap intact and the full selected system is exposed; larger controls hide the redundant output. Enlarged reading legitimately needs more scrolling; no first-fold claim is made at 200%.

Fresh six-paper sticky-map stress test: both book/main at 1440x600 and 1440x900, open AirDash details, scroll to the **sixth** paper, click the actual Chiang Mai dot without force or synthetic dispatch. All four runs select CNX and leave its title and coupled PDF visible. Keyboard PDF -> Source -> Study details order and Enter disclosure activation also pass. Earlier native keyboard map-pan checks remain valid; no map/controller behavior was removed.

### Six PDF Checks

Fetched all six from the parent's main server, checked `%PDF-` signatures and exact SHA-256 manifest matches. The first five retain their previously recorded byte counts/hashes. Foresight is **126739 bytes, seven A4 pages**, with PDF metadata naming Poon Thiengburanathum and Non Arkaraprasertkul, and SHA-256:

```text
65c5c70c865f76aaf535a7a9ad5a9778abdf7e1c1dbda23899d86d36565fe192
```

The sixth paper's draft/methods limitations are preserved in its disclosure; it is not presented as a peer-reviewed forecast or impact evaluation. This verifies rendered qualifications and artifact integrity, not the scientific merits of the manuscript. A later manuscript correction must update and recheck the affected hash; this record identifies only the bytes above. Rechecked the manifest and all six PDF files at the end: no byte drift during review.

### Evidence And Limits

Final measurements and all six hashes: `/tmp/axiom-research-independent-review/six-final-results.json`. Strict 200% measurements: `six-strict200-results.json` in the same directory. Captured both surfaces at every required width; images use `six-<surface>-<width>-dpr<scale>.png`, with additional sixth-row and 200% captures.

Inspected examples: [book 1440](/tmp/axiom-research-independent-review/six-book-1440-dpr1.png), [book 1024](/tmp/axiom-research-independent-review/six-book-1024-dpr1.png), [main 390](/tmp/axiom-research-independent-review/six-main-390-dpr1.png), [sixth paper on main phone](/tmp/axiom-research-independent-review/six-last-main-390-dpr1.png), [book sixth paper at 1152 CSS / DPR 3](/tmp/axiom-research-independent-review/six-last-book-1152-dpr3.png), [main 3440](/tmp/axiom-research-independent-review/six-main-3440-dpr1.png), [book intact command at true 200%](/tmp/axiom-research-independent-review/six-strict200-command-book-390.png).

**Deployment remains UNVERIFIED.** This is independent local working-tree UI/preservation evidence, not an isolated-commit certificate, canonical-host verification, scientific approval or broader whole-site clearance. The auditor edited only `docs/design/research-compact-review-2026-11-05.md`; no UI, CSS, PDF, test source, shared content, commit or deployment was changed by this review.
