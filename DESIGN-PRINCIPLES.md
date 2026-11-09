# Design Principles: No MSH, No Slop, Real Balance

Owner: Non Arkaraprasertkul. Version: 9 Nov 2026 (Asia/Bangkok). Supersedes, for day-to-day use, THE-BOOK.md (5 Nov), MSH.md, and the overlapping prose in the `anti-slop-design`, `msh-auditor` and `anti-spatial-hallucination` skills. Those remain the long-form lineage; where this file is stricter, this file wins.

## Philosophy

A screen is a working drawing, not a mood board. Every pixel either carries the user's task or deliberately frames it. Two failures kill that: MSH (Massacre Spatial Hallucination), where space is invented through fat boxes, dead voids, stretch-to-fill and forever-scroll; and AI slop, where defaults nobody chose stand in for decisions (gradients, glass cards, purple palettes, emoji bullets, hero plus three cards, fake numbers). The cure is not cramming. Empty space is allowed when it has a job you can name, scale contrast is required, and density follows the type of page. Compact first, something must win, align to the grid like a MoMA wall label, and never invent anything: not space, not data, not a location.

How to use this file: Part 1 is binary and never broken. Part 2 is judgment with a decision rule. Part 3 sets surface-specific numbers. Part 4 is the audit an agent runs on screenshots. Part 5 is the brief to paste into a coding agent. A repo's `STYLE.md` may protect a named stylistic choice (a font, a radius, a dark theme) with a written reason; it can never waive Part 1 laws L1, L9, L10, L12, L13 or L14.

---

## Part 1. Hard laws (never break)

Each law is a yes/no test. Any "no" is a FAIL.

**Geometry (MSH)**

- **L1. Boxes fit content.** A chip, button, badge, stat tile or label box is at most 2x its content width and 1.6x its content height. Padding is 0.5 to 1.5x the line height of its text. No `min-height` or fixed height that leaves more than one empty line under short text.
- **L2. No dead void.** No empty region larger than one third of the first screen unless it passes the void test in B1. No phone-width column floating on a desktop page. No blank area while loading: show the real skeleton, or the last good data with its timestamp.
- **L3. Compact first.** If the task fits in one screen at 390x844 and 1440x900, it fits. Scrolling must reveal new facts or actions; a scroll step that is mostly padding or repeated equal cards fails.
- **L4. Chrome is thin.** All fixed or sticky bars together use at most 12% of viewport height on desktop (108px at 900) and 15% on phone (127px at 844). One identity line, not stacked logo + title + subtitle + status rows.
- **L5. On grid.** Every spacing value comes from one stated scale (MoMA scale where the repo adopted `Nonarkara/moma-rules`, otherwise 4px multiples). No arbitrary values such as `mt-[13px]`. Edges that are meant to align, align to the pixel; a near miss under 8px is a fail.
- **L6. Fix the first expansion.** When something is too big, remove the cause (padding, fixed height, equal grid tracks, hero height), not the symptoms. Never fill a void with decoration.

**Hierarchy**

- **L7. Something wins.** A squinted screenshot shows one focal point, then a clear second. Adjacent hierarchy levels differ by at least 1.5x in font size (16px to 20px is not hierarchy). No grid of equal-weight cards as the main content.
- **L8. Payload on the exit.** The eye enters at the heaviest visual (image, map, big number). The headline, key number and primary action sit immediately below or beside it. Never place a headline above a heavier image and its copy below it (no leapfrog). Visual order equals keyboard tab order.

**Honesty**

- **L9. No invented data.** Every number shown has a source and, if it changes, a timestamp or "as of" date. No lorem, no placeholder stats ("10k+ users", "99.9% uptime") without evidence, no fake testimonials, no sample charts in shipped UI.
- **L10. No invented locations.** No guessed lat/lng, no province or district centroid used as a point pin, no `0,0` or default map centre as a pin, no depth or quantity the source did not state. Unclear place means unpinned and flagged for a human. Full rules: `anti-spatial-hallucination` skill.
- **L11. No filler words.** Zero uses of: unlock, seamless, revolutionize, empower, supercharge, elevate, streamline, "the power of", "in today's fast-paced world". No greeting titles ("Welcome back"), no exclamation marks in UI, no hype badges (New, PRO, Beta) used as decoration.

**Slop bans (each counted per screen)**

- **L12. Logos are never boxed.** No border, chip, tile, card, pill, shadow or different background behind any logo, including partner strips and credits. A strip is logos plus gap plus, optionally, a plain text label. Pick the logo variant that reads on the surface.
- **L13. Ship basics.** Text contrast at least 4.5:1 (3:1 at 24px+, or 18.66px+ bold). Phone tap targets at least 44x44 CSS px. Visible focus. Every image has truthful `alt`. `<html lang>` set. Pinch zoom not disabled.
- **L14. Builder is not auditor.** The agent that built the screen never signs off on it.
- **L15. Decoration bans.** Zero decorative gradients, gradient text, glassmorphism or backdrop blur, glows, blobs, or generated hero art. Zero emoji used as icons or bullets. Zero idle animation (pulse, ping, float) on things that are not live; no `transition-all`; no hover-scale on cards; `prefers-reduced-motion` honoured.
- **L16. Count caps per screen.** At most 15 boxes or cards, 3 drop shadows, 5 pills or badges, 8 font sizes, 2 type families. Corner radius 0 by default; a `STYLE.md` may name one non-zero radius, used on fewer than half the boxes.
- **L17. No default palette.** Neutral ground plus one accent with a stated job; a second accent only with a second stated job. Data status colours (e.g. a risk scale) are one semantic scale, not extra accents, and are never the only signal (pair with a label or symbol). Purple, violet or indigo (roughly hue 240 to 290) as the primary accent fails unless `STYLE.md` names it as brand. Light ground by default; dark only for products used in the dark, and then with no neon borders or glow.
- **L18. No slop fonts as primary.** Inter, Poppins, Montserrat, Roboto, Open Sans, Lato, DM Sans, Space Grotesk, Geist, Plus Jakarta Sans, Manrope, Nunito, or a bare `system-ui` stack fail as the design face unless `STYLE.md` gives a reason. House defaults: Jost (text and display), League Spartan or Josefin Sans (display only), Prompt or Kanit (Thai).
- **L19. No template skeletons.** Fail if the first screen is: centred slogan hero + button + a row of three equal icon-title-blurb cards; or a card grid where every card has the same icon-title-two-lines shape; or every line has an icon. Icons appear only where they replace or disambiguate a word, at most one per row.
- **L20. No first-load wall.** No modal, cookie wall beyond legal minimum, onboarding carousel or splash before the content answers the user's question.

---

## Part 2. Balance principles (judgment, with a rule to decide)

These keep the laws from producing cramped, joyless screens. Each has a decision test.

**B1. Whitespace is allowed when it has a job.** Name the job in five words or fewer: "frames the map", "separates two groups", "lets the headline breathe", "reading margin". Test: if you cannot name the job, or the space sits away from the focal element, it is a void (L2). Intentional space sits next to what it frames; dead space sits at the bottom or the far side of a column.

**B2. Proximity carries grouping.** Space between groups is at least 1.5x the space inside a group. Space above a heading is at least 2x the space below it. If you need a border or card to show that items belong together, first try spacing; add the container only if spacing alone fails the squint test.

**B3. Containers must earn their edges.** A box is allowed when it groups things that move, filter or get compared together. Test: delete the box mentally. If no meaning is lost, delete it for real. Never box a single element that already reads (a number, a logo, a short label).

**B4. Scale contrast over weight.** Make hierarchy with size first, then weight, then colour. Product UI steps 1.5 to 2x; marketing and posters may go 5 to 10x between display and body. Headings at weight 800 to 900 by reflex fail; use them only for display sizes above 48px.

**B5. Rhythm from a small set.** Use at most 6 distinct spacing values on one screen and at most 8 font sizes overall. Repeating a few intervals reads as calm; many near-identical intervals read as sloppy.

**B6. Asymmetry is fine; unbalanced is not.** 2/3 + 1/3 splits, off-centre heroes and wide margins are encouraged. Test: squint and cover each half of the screen in turn. If one half holds almost nothing and its emptiness has no job (B1), rebalance. Body text is left-aligned (or start-aligned); centred text only for headings of two lines or fewer.

**B7. Symbols over prose, not icon soup.** Use a mark when it is unambiguous to this audience: arrows for change, a status dot plus label, a gauge, a sparkline. Every symbol has an accessible name. If a reader would need a legend to decode three or more symbols on one screen, use words.

**B8. Density follows the page type.** Dashboards and maps: high density, everything on one screen. Landing pages: medium, one idea per screen height. Reports and documents: reading density, prose measure and generous line height. Phone: one column, the task first. Decide the type before laying out and apply Part 3.

**B9. Rich in one or two places only.** Choose one or two "moments" (a hero image, a signature chart, one transition) that get the colour and motion. Everything else stays quiet. Test: if rich colour or motion appears in more than two regions of a screen, demote the rest.

**B10. Specific beats minimal.** Passing every law while looking generic still fails. Template test: put a competitor's name on the screen. If it still fits, add something only this product has: a real photo, a real number, a local place, the author's point of view.

**B11. Style is not slop.** Before removing a distinctive element, ask: does removing it make the page more generic? If yes and it passes Part 1, keep it. Judge the stack, not the item: one serif headline is a choice; Inter + purple gradient + three cards + "seamless" is a fingerprint.

**B12. Breaking the grid needs a named grid.** Rotation, overlap or diagonal type is allowed only on a declared grid (column, modular, axial or radial) and only if the squint test still shows biggest heading, then biggest visual, then body. Product and ops screens use column or modular grids; axial and radial are for posters and art.

---

## Part 3. Per-surface rules

### Dashboard and map

- No page scroll at 1440x900 and 1280x800 in landscape: `document.scrollingElement.scrollHeight <= innerHeight`. A long list may scroll inside its own panel if it shows its row count.
- The map (or the primary chart on a non-map dashboard) takes at least 60% of the first screen on desktop and phone. Panels dock at the edges as compact instruments; nothing covers the map on load.
- One hero number or state, readable at 2 metres: at least 2x the next largest number.
- Every metric shows unit, source and "as of" time. Stale data shows its age, not a fresh-looking value. Missing feed shows "no data", never zero or all-clear.
- Stat tiles sit in a ruled strip sized to their text, never equal grid tracks; a lone last tile never stretches across the row.
- Tables over cards for anything compared row against row. Numbers right-aligned, tabular figures, one number format per view.

### Marketing and landing

- At 1440x900 the first screen shows headline, one primary action and one piece of real proof (product screenshot, real number with source, map, real photo). Hero no taller than 70% of the first screen unless the hero is the product itself.
- Headline at most 12 words; no slogan without a concrete noun.
- One primary action per screen, verb + object, content-width on desktop. Full-width buttons only in a phone column or narrow side panel.
- Features shown as a real comparison, demo, or asymmetric layout, not three identical cards (L19).
- Each subsequent screen-height adds a new fact, image or action; otherwise cut it.

### Game UI

- The playfield is the hero: HUD and controls together cover at most 20% of the screen area during play.
- HUD text at least 14px at 1280x800 and 16px on phone; numbers that change during play use tabular figures so they do not jitter.
- State changes (goal, turn, damage) use hard cuts or short snaps under 250ms; no slow crossfades.
- A title screen is allowed, but the play action is visible without scrolling and reachable in one tap or key.
- Menus fit content and anchor to an edge or the centre deliberately; no full-screen modal for a two-option choice.

### Document and report

- Prose measure 45 to 75 characters (target 60 to 70; CSS around `max-width: 65ch`). Thai and Chinese keep the same physical width.
- Body 16 to 20px, line height 1.4 to 1.6. Wide screens get margins, a side column for notes, or two columns of figures, never full-width paragraphs.
- Every chart and table has a title stating its finding, units, source and date. No chart without data behind it.
- Scrolling is expected, but no screen-height may be mostly empty or decorative. A full-viewport section break or cover image after the first screen fails.
- Pull quotes and callouts at most one per screen-height.

### Phone (390x844)

- Build at 390 first. The first screen shows the primary information and primary action without scrolling.
- One column; no horizontal scroll at 390 or 320.
- Sticky chrome within 15% of height (L4); a top nav at most 56px when the product is map-first.
- Taps at least 44x44 px with at least 8px between targets.
- Bottom sheets start collapsed to their summary on map products, so the map keeps 60% of the screen.

---

## Part 4. Audit checklist (screenshot pass/fail)

Run by a different agent from the builder (L14). Capture full-page and first-screen screenshots at 1440x900, 1280x800 and 390x844 (add 320x568 if small phones are claimed). Mark each row PASS, FAIL or N/A per viewport. Any FAIL in rows 1 to 20 blocks shipping unless Non waives it in writing.

| # | Check (on the screenshot) | Fail if |
|---|---|---|
| 1 | Squint test | No single focal point, or first and second item look equal |
| 2 | First-screen task | Primary info and primary action are not both visible |
| 3 | Chrome cost | Sticky bars over 12% height desktop, 15% phone |
| 4 | Dead void | Unnamed empty region over one third of the first screen |
| 5 | Box fit | Any box over 2x content width or 1.6x content height |
| 6 | Scroll honesty | Any scroll step mostly padding or repeated equal cards; any page scroll on a dashboard at 1440 or 1280 |
| 7 | Alignment | Edges meant to align miss by 1 to 8px; off-scale spacing in code |
| 8 | Glance path | Headline or action above a heavier visual, or split by it |
| 9 | Map/data share | Map or primary chart under 60% of first screen; covered on load |
| 10 | Logos | Any logo with border, chip, shadow or backing |
| 11 | Data honesty | Any number without source or time; lorem; placeholder stats |
| 12 | Location honesty | Any pin from a centroid, guess or default centre |
| 13 | Copy | Any banned filler word, greeting title, UI exclamation |
| 14 | Decoration | Any decorative gradient, glass blur, glow, emoji icon |
| 15 | Counts | Over 15 boxes, 3 shadows, 5 pills, 8 sizes, 2 families |
| 16 | Palette | Purple/indigo default accent; more accents than stated jobs; colour as only signal |
| 17 | Fonts | Banned face as primary without `STYLE.md` reason |
| 18 | Template | Hero + three equal cards, or icon on every line |
| 19 | Access | Contrast under 4.5:1, taps under 44px, no focus ring |
| 20 | Preservation | Fix deleted features, renamed product, reordered sections or invented data |
| 21 | Balance (judgment) | Any empty region whose job cannot be named in five words |
| 22 | Specificity (judgment) | A competitor's name would fit the screen unchanged |
| 23 | Density (judgment) | Density does not match the surface type in Part 3 |

Rows 21 to 23 are REVISE, not BLOCK. Report format:

```text
Verdict: PASS / REVISE / BLOCK
Auditor (not the builder):
URL / PR / commit:
Viewports checked: 1440x900, 1280x800, 390x844 (+320?)
Fails: row # -> element -> smallest fix (remove the first expansion)
Kept on purpose (STYLE.md or named job):
Before/after screenshot paths:
Not verified:
```

When fixing, work one layer at a time: geometry, then spacing, colour, icons, copy, type, layout within sections, details, visuals, motion. At most three render rounds, then hand to the auditor. If the change is heavy (the screen needs a new direction), stop after the audit and get Non's yes before editing, unless told "just do it".

---

## Part 5. Brief for a coding agent (paste as is)

```text
Design rules for this task (from Non's Design Principles, 9 Nov 2026):

Surface type: [dashboard/map | landing | game | report | phone-first]
Reader and one job:
Focal point (1st), 2nd, 3rd:
Heaviest visual and where the headline/action sit (below or beside it):
Grid: [column | modular] and spacing scale: [MoMA | 4px]
Accent colour and its job:
Rich "moments" (max 2):

Hard rules:
- Boxes fit content: max 2x content width, 1.6x height; no fixed min-heights.
- No dead empty region over 1/3 of the first screen; every empty area has a named job.
- Dashboards: no page scroll at 1440x900 or 1280x800; map/primary chart >= 60% of first screen.
- Sticky chrome <= 12% of height desktop, <= 15% phone. Build at 390 first.
- Hierarchy steps >= 1.5x font size. One focal point. One primary action, content-width.
- Logos never boxed. No gradients, glass, glow, emoji icons, idle animation, transition-all.
- Caps per screen: 15 boxes, 3 shadows, 5 pills, 8 font sizes, 2 families. Radius 0 unless STYLE.md.
- No purple/indigo default. Light ground unless used in the dark. Neutral + 1 accent.
- Fonts: Jost / League Spartan / Prompt or Kanit for Thai. Not Inter/Roboto/Poppins etc.
- No hero + three equal cards. No icon on every line. Body text left-aligned, <= 65ch.
- Never invent data, stats, testimonials or map coordinates. Unknown = "no data" or unpinned.
- No filler words (unlock, seamless, revolutionize, elevate...). No greeting titles.
- Contrast >= 4.5:1, taps >= 44px, visible focus, alt text, html lang.
- Respect STYLE.md choices that pass these rules; do not rename, delete features or reorder sections.

Deliver: screenshots at 1440x900, 1280x800, 390x844. A different agent audits with Part 4. Do not self-approve.
```
