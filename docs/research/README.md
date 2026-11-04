# Research Publication Workflow

The library presents inspectable preprints, not a claim of peer review or an
endorsement of operational safety. Public availability of data is valuable;
it does not by itself establish representativeness, causality or effectiveness.

## Add Or Revise A Paper

1. Read the actual PDF, not its filename or a deployment status. Confirm the
   title, printed author names, version, date and preprint status with the authors.
   Do not silently normalize differing author spellings across publications.
2. Preserve the source PDF under `public/research/` with a versioned filename.
   Record its SHA-256 and source in `data/research.json`. Prefer a pinned source
   revision when the original web endpoint returns an HTML fallback.
3. Write a short question, evidence summary and limitation. Cite the printed
   pages; keep an observation separate from a replay, prototype capability,
   official adoption or human outcome. Label these as English editorial summaries,
   not quotations or translated abstracts.
4. Assign documented study geography, not the authors' office or the server's
   location. Distinguish national coverage, provincial case and regional analysis.
   Use traceable geometry. A reference point is not a surveyed field site, and an
   overview frame is not an exact study boundary. Leave unsupported sites unpinned.
   Register new sourced regions in `scripts/research/geography.mjs`; until then,
   use `study.region: null` and `study.scope: "unspecified"` with an honest label.
   A paper can be published without inventing a map location.
5. Run `npm run research:build`, `npm run research:check`, `npm test` and
   `.qa/research.mjs` against both renderings. Verify that the new PDF contains
   PDF bytes and matches the manifest hash, including on the canonical live host.

Never replace an existing released PDF under an unchanged version. A substantive
correction gets an author-approved version, a new file/hash and a brief change
record. Keep earlier versions accessible. Add a separate version-history model
before publishing multiple versions of one paper as if they were different studies.

## Evidence To Preserve With The Study

| Item | What makes it useful |
| --- | --- |
| Capture manifest | Source URL, retrieval and observation clocks, time zone, hash, source terms and exclusions |
| Analysis | Pinned source revision, command, dependencies, random seed where relevant, expected tables and figures |
| Denominators | Unit of analysis, eligible sample, failed/skipped/missing inputs and exact observation windows |
| Validation | Independent reference where available; separate prospective tests from retrospective replays |
| Outcome chain | Generation, attempted delivery, receipt, acknowledgement, action and outcome are separate measures |
| Ethics and ownership | Author approval, contribution statements, participant role, conflicts, privacy and data redistribution limits |

Do not redistribute personal or restricted raw records merely to make a
reproducibility claim. Publish a privacy-safe evidence bundle or explain access
conditions and which reported claims an outside reader can actually reproduce.

## Current Editorial Review

See [the 4 November review](preprint-review-2026-11-04.md) for specific proposed
improvements. It is an internal editorial review, not peer review, independent
data certification or author approval. The library's original PDFs stay intact.
