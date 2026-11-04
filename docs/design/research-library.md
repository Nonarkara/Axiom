# Shared Preprint Library

Owner brief, 4 November 2026: the research surface is a publication index,
not an artwork-bearing argument. This bibliography deliberately uses unframed
column rows rather than adding decorative artwork to satisfy an unrelated
plate rule. Existing argument plates, photographs and main-site imagery stay
untouched. If publication previews are added later, use verified PDF pages,
not invented artwork or catalogue plates.

Grid: column. Reading order: published title, authors/date/system/version,
then PDF and source. Publication titles and author spellings are not translated.
The seven main-site locales translate interface labels and the not-peer-reviewed
qualification. Counts in the system filter derive from the shared papers.

Source: `data/research.json`. Generate with `node scripts/research/build.mjs`.
Use `--check` for artifact parity and `--verify` to probe external PDF bytes.
Own-host PDF destinations map to files in `public/`; generation always verifies
their PDF signature and provided SHA-256. Never trust HTTP 200 alone.

Verification: `node --test tests/research.test.mjs` and
`node .qa/research.mjs`. The browser check accepts `AXIOM_URL` and `AXIOMX_URL`
and defaults to the integration servers on 5462 and 5461. It captures both
surfaces at 390/1024/1440 into `.qa/research-{main,book}-{width}.png`.
Budgets: no horizontal overflow; title above metadata above actions; at most
12px between metadata and its action group; row height at most 300px on phone
and 240px on larger screens for these four real publications. A 200px injected
action gap must fail that same measurement. Enlarged text reflows without
clipping. This geometry budget applies to the current paper list, not arbitrary
future titles.

CO/VR links moved out of the primary headers, not removed from the products:
main footer and book colophon retain both links in every locale. Research stays
in the main footer and book index. Current rendered main masthead is 58px
at all three widths; book header is 44px. Screenshots and automated checks are
implementation evidence; the parent owns independent visual review and release.
