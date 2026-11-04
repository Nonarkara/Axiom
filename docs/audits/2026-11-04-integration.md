---
updated: 2026-11-04
drafted_by: codex/gpt-5
reviewed: false
---

# Integration Ledger

Reference: `c2067d44d373ed1c79b5b9476bb0817294577948` on `main`.
Read-only reconciliation, not authorization to merge. No merge, push, reset,
stash application, branch deletion, or deployment was performed.
Other workers own public/axiomx surfaces, catalogue data and the preprint library.

## Pull Requests

| PR | Exact patch | Verdict | Evidence and remaining condition |
| --- | --- | --- | --- |
| [2](https://github.com/Nonarkara/Axiom/pull/2) | Self-hosted Thai/Korean fonts, old page/status edits, recovery scripts and eleven base64 sidecars; 32 files, +484/-19 | **HOLD** | Draft, `DIRTY`/`CONFLICTING`, no registered checks; 55 commits ahead and 133 behind. The small merge-base diff is not a current-HEAD replacement. Browser verification explicitly remains unverified in the PR body. Fonts can be salvaged only as a new narrow change against current main, preserving current catalogue and CSP. Never auto-merge this recovery branch. |
| [14](https://github.com/Nonarkara/Axiom/pull/14) | `axiom DNA/examples/thailand-dashboard/api_queries/requirements.txt:15`: `pandas>=3.0.6` to `>=3.1.0` only | **MERGE-READY, narrow example dependency bump** | `CLEAN`/`MERGEABLE`; all three checks pass. PyPI version endpoint returns 200 for 3.1.0, requires Python >=3.11. No pandas imports or API calls occur in the three current pollers, so no current pandas consumer changes behavior. Dependency installation/resolver and future pandas consumers remain unverified; this is not a runtime certification of the entire example stack. |
| [15](https://github.com/Nonarkara/Axiom/pull/15) | `.github/workflows/security.yml:93,100`: two upload-sarif pins `6f2ac81...` (4.39.0) to `9b325408...` (4.39.1) | **MERGE-READY** | `CLEAN`/`MERGEABLE`; three checks pass. Upstream annotated `v4.39.1` tag `8498dc4...` dereferences to exactly `9b3254085494b55a0f7c4c2b3d2d52cc712ce370`. Run 41436441274 shows both Upload Semgrep SARIF and Upload Trivy SARIF steps succeeded, not skipped. Inputs, permissions, triggers and deployment workflows are unchanged. |
| [16](https://github.com/Nonarkara/Axiom/pull/16) | `axiom DNA/docker-compose.yml:158,203,248`: Kong 3.9.3 to 3.9.4; Grafana 13.2.4 to 13.3.0; Metabase v0.64.2.7 to v0.65.2.2 | **HOLD for stack smoke/migration evidence** | `CLEAN`/`MERGEABLE`; three security checks pass. All three Docker Hub tag endpoints return 200 and list linux/amd64 and linux/arm64 images. This proves image availability, not application/DB compatibility. Kong/Grafana/Metabase use persistent Postgres databases/volumes; Kong startup suppresses migration errors. Need disposable database restore/startup, plugin/dashboard/API smoke, and rollback evidence before applying the combined upgrade to an existing stack. No containers or live databases were changed. |

`gh pr diff`, `gh pr view` and `gh pr checks` were read separately for all four.
The security workflow is explicitly report-only (`exit 0` / continue-on-error);
a green scan is not proof of dependency installation or service startup.
Do not turn these independent verdicts into an automatic batch merge.

Upstream metadata probes:
- `https://pypi.org/pypi/pandas/3.1.0/json`
- `https://api.github.com/repos/github/codeql-action/git/ref/tags/v4.39.1`
- `https://api.github.com/repos/github/codeql-action/git/tags/8498dc4c2b27cdd99baf0f87955b29ebbf30c78d`
- `https://hub.docker.com/v2/repositories/library/kong/tags/3.9.4`
- `https://hub.docker.com/v2/repositories/grafana/grafana/tags/13.3.0`
- `https://hub.docker.com/v2/repositories/metabase/metabase/tags/v0.65.2.2`

## Concrete Regressions

All four reported child-process tests reproduced before edits. Spawning itself
worked; failures were in the generator, not an execution permission problem:

1. CLI late-invalid fixture: validator was never imported/called. The CLI wrote
   all artefacts and its `wrote public...` output broke the JSON result parser.
2. Escaping fixture: `href` values in ordinary and edition links bypassed HTML
   escaping, so query ampersands were emitted raw.
3. CR/separator fixture: single-quoted JS copy emitted a raw carriage return,
   yielding invalid JavaScript. String round-trip tests now cover all quote styles.
4. Count-change fixture: HTML count/proof/cluster fallbacks were copied unchanged;
   translated cluster counts used the redundant cached `clusterCounts` object.

Fixed validation before artefact access, escaped URLs, escaped JS separators,
and derived static/translated counts from the current systems array. Added a
zero-live-count check and edition-link drift falsifiers; the prior parity test
silently skipped the div-wrapped edition cards entirely.

Owner follow-ups: description/og:description head metadata system/country figures
now derive in `buildHtml`; a growth fixture checks both. No generated HTML was
hand-edited. `full` is now rejected whenever present, and generator support for
`sys-cell--full` is removed. Parent owns removing the Pavilion source flag,
removing the dead CSS, regeneration, header updates and visual thumbnail QA.

## Local Branches

Counts are `main-only / branch-only` from
`git rev-list --left-right --count c2067d4...REF`; unique patches use
`git cherry c2067d4 REF` (`+` only; merge commits excluded).

| Local branch | Counts | Unique patches | Disposition |
| --- | --- | --- | --- |
| main | 0 / 0 | 0 | Current shared working tree; preserve other workers' edits |
| audit/clone-and-use-plus-finance | 14 / 3 | 2 | Preserve history: a6676ac documentation and 73c4add audit, plus merge 937a26d. However merge-base-to-tip tree diff is empty, so no net content to merge; patch uniqueness alone is not missing content |
| audit/consistency-shippability | 90 / 0 | 0 | Ancestor, integrated |
| claude/happy-sinoussi-2e2a20 | 9 / 0 | 0 | Ancestor, integrated |
| feat/add-mem-shophouses | 167 / 0 | 0 | Ancestor, integrated |
| feat/catalogue-source-of-truth | 14 / 0 | 0 | Ancestor, integrated |
| feat/lab-section | 216 / 0 | 0 | Ancestor, integrated |
| feat/nonwriter-and-hover-diagrams | 220 / 0 | 0 | Ancestor, integrated |
| feat/probono-architecture | 215 / 0 | 0 | Ancestor, integrated |
| feature/hero-featured-and-showcase-tidy | 227 / 0 | 0 | Ancestor, integrated |
| fix/box-to-text-density | 112 / 0 | 0 | Ancestor, integrated |
| fix/dg-legible | 8 / 0 | 0 | Ancestor, integrated |
| fix/hero-featured-redo-and-grab-fresh-shots | 223 / 0 | 0 | Ancestor, integrated |
| fix/i18n-cards | 160 / 0 | 0 | Ancestor, integrated |
| fix/i18n-deeper | 159 / 0 | 0 | Ancestor, integrated |
| fix/mobile-audit-2026-08-03 | 197 / 0 | 0 | Ancestor, integrated |
| fix/mobile-hyper | 155 / 0 | 0 | Ancestor, but worktree has eight unique untracked diagnostic scripts; preserve |
| fix/watermark-and-shanghai | 163 / 0 | 0 | Ancestor, integrated |
| merge-plates | 6 / 0 | 0 | Ancestor, integrated |
| pr12-check | 40 / 0 | 0 | Ancestor, integrated |

## Worktrees

`git worktree list --porcelain` and each checkout's `git status --short`:

| Checkout (relative to repository unless absolute) | State |
| --- | --- |
| Main checkout | Initially clean; now active shared edits. Leave research, library, canon, public/axiomx and VR work untouched |
| /Users/nonarkara/Projects/axiom-dg | Clean, merge-plates |
| .claude/worktrees/happy-sinoussi-2e2a20 | Clean |
| .worktiles/fix-watermark-shanghai | Clean |
| .worktiles/i18n-cards | Clean |
| .worktiles/i18n-deeper | Clean |
| .worktiles/mobile-hyper | Preserve untracked audit-dc.cjs, check-index.cjs, find-overflow.cjs, find-wide-375.cjs, find-wide-qs.cjs, find-wide.cjs, find-wide2.cjs, trace-wide.cjs |
| .worktrees/audit | Clean |
| .worktrees/audit-finance | Clean, unique history described above |
| .worktrees/boxes | Clean |

## Remote-Only Work

Remote-tracking refs were inspected as locally available; no checkout/fetch/merge
was needed. PR head SHAs were independently checked through GitHub.

| origin/ suffix | Counts | Unique patches | Disposition |
| --- | --- | --- | --- |
| claude/sales-messaging-framework-6td6t9 | 141 / 0 | 0 | Integrated |
| claude/ux-ui-audit-polish-9v66lo | 164 / 5 | 5 | HOLD/preserve. 17-file historical UI/dependency diff, +4401/-2872; inspect individual intent, never replay old whole surfaces |
| cursor/axiomx-plates-iaas | 96 / 0 | 0 | Integrated |
| cursor/face-audit-perfect-51b8 | 125 / 1 | 1 | HOLD/preserve bcc9a55. Six-file copy/CSP/count diff +96/-83; reconcile claims against current generated catalogue, not stale counts |
| cursor/official-axiom-logo-7fa7 | 40 / 0 | 0 | Integrated |
| cursor/security-scan-dependabot-b2b0 | 125 / 1 | 0 | Patch-equivalent (one `-`), not unique work |
| dependabot/docker_compose/axiom-DNA/docker-compose-0a238a8d0b | 23 / 1 | 1 | Preserve historical proposal; supersession requires version-by-version review, no blanket application |
| dependabot/docker_compose/axiom-DNA/docker-compose-c6c0e175f6 | 82 / 0 | 0 | Integrated |
| dependabot/docker_compose/axiom-DNA/docker-compose-f75796f789 | 8 / 1 | 1 | PR16, hold as above |
| dependabot/github_actions/github-actions-4179f0a880 | 8 / 1 | 1 | PR15, merge-ready as above |
| dependabot/github_actions/github-actions-661aaef8c2 | 82 / 0 | 0 | Integrated |
| dependabot/github_actions/github-actions-db70476e05 | 123 / 1 | 1 | Preserve older proposal; do not downgrade current action pins |
| dependabot/pip/axiom-DNA/examples/thailand-dashboard/api_queries/pip-1f9f63631c | 8 / 1 | 1 | PR14, narrow verdict above |
| dependabot/pip/axiom-DNA/examples/thailand-dashboard/api_queries/pip-4f051e1d2f | 82 / 0 | 0 | Integrated |
| design/editorial-operations-20261002 | 130 / 0 | 0 | Integrated |
| docs/anti-slop-rules | 85 / 1 | 0 | Patch-equivalent (one `-`) |
| fix/shanghai-self-host-fonts | 133 / 55 | 54 | PR2, HOLD; one merge commit not counted by cherry |

## Stashes

- `stash@{0}` = `204c5566df20ff457718f6a8e95d03b5e1494e5a`,
  base `8a27f0b`, "pre-existing changes": 23 tracked files, +1719/-645.
  Both stash commits have only two parents, so neither contains a third-parent
  untracked snapshot. This stash mixes catalogue validation/escaping/count fixes
  with catalogue data, artwork, admin/UI and spatial instrument changes. All 23
  stored file blobs differ from current HEAD. The four reproduced generator fixes
  are present here, explaining why tests survived while implementation did not.
  Reimplemented only the owned fixes; did not apply/pop the stash. Some stashed
  changes would remove `full`, rewrite spatial instruments and change proof/hero
  count generation: preserve for separate owner-scoped reconciliation, not a
  wholesale restore.
- `stash@{1}` = `fa451433e3a678a193dc0e4315d2dec1fd4c1ccc`,
  base `25ab30e`: only `public/photos/products/MEM.png`, binary 100091 to
  100440 bytes. Its stored blob differs from HEAD. Preserve for image review;
  the i18n wording in the stash subject describes its base commit, not its diff.

## Verification

- Before fixes: four generator fixture failures reproduced; none was a spawn denial.
- Initial completed full run after root fixes: `npm test`, 121 pass, 0 fail, 0 skip.
- `npm run check`: 47 JavaScript files checked, pass.
- Both `node scripts/catalogue/check.mjs` and `build.mjs --check`: six artefacts
  match before the requested metadata/full-band follow-ups. After those follow-ups
  parent must regenerate owned assets and headers; no hand edits here.
- Final focused run after metadata/full-band follow-ups: 68 pass, 0 fail, 0 skip
  (`node --test tests/catalogue-validation.test.mjs tests/catalogue.test.mjs`).
- After parent regeneration, `node scripts/catalogue/check.mjs`: all six match.
- Final completed `npm test`: 137 tests, 136 pass, 0 fail, 1 optional VR/CO
  browser test skipped. Catalogue tests have no skips. A stale duplicate focused
  test process was interrupted after the fresh 68/68 run completed; it is not
  counted as a passing run.
- An intervening full run caught the expected generated-index drift while parent
  regeneration was pending; it was not skipped or suppressed. Parent separately
  reports its shared integration unit/browser checks; those are parent evidence,
  not independently claimed here.
- `git diff --check`: pass after all owned code and ledger edits.
- No live/browser/deploy claim is made by this worker.

Read-only PR and inventory workers were dispatched through local CLIs at the
owner's explicit request. Initial Claude dispatches failed authentication;
alternate OpenCode workers gathered independent gh/git evidence but did not return
final syntheses within the integration window and were stopped. The bounded patch
review worker likewise returned no final verdict; do not claim independent review
passed. This worker directly verified critical PR diffs, SHA provenance, run
steps, branch counts and both stash diffs.
