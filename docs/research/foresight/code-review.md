---
updated: 2026-11-05
drafted_by: codex/gpt-5
reviewed: false
---

# Bounded Independent Code Review

**Final verdict: PASS for the current supplement/code-review candidate.**

Both original findings below are independently resolved. Candidate archive:
`public/research/foresight-methods-v1.zip`, 84,211 bytes, SHA-256
`62b49f306ed054bba681f4dcd96ea95e3ef6d393331166d6ed16ab78f8a52504`.
This sign-off applies to those bytes, not a later manuscript/package revision,
scientific approval, final PDF layout, production deployment or new UI testing.

## Independent Package Recheck

- Fresh extraction outside both repositories; executed the README's exact Node
  arguments with `PATH=/nonexistent`, so Git was unavailable. Analysis completed,
  its 25 pinned tests passed, and `reproduced.json` equalled the packaged
  `results.json` byte-for-byte. Runtime used: Node v26.0.0, not a Node 22.13
  minimum-version compatibility test.
- All 11 source hashes match the snapshot manifest. The analysis now checks its
  independently fixed EXPECTED_HASHES before importing source files. Altering
  `src/data/anchor.ts` in the temporary extraction is rejected with
  `Source hash mismatch`; the repository files were not changed.
- Actual packager reruns under UTC/umask 022 and Asia/Bangkok/umask 077 both
  reproduce the existing archive bytes and pass its immutable-output guard.
  The original archive mtime remains unchanged: the reviewed ZIP was not replaced.
- All 18 entries are sorted, regular files with mode 0644 and timestamp
  2026-11-05 00:00:00. ZIP CRC verification reports no corrupt member.
- Included local upstream attribution hashes to
  `a5e6137fe27da9e58059066b8ab50340ae33c464b87e31dc6a89f18fd24486df`, matching
  both the packager constant and snapshot manifest. Packaging no longer fetches
  a mutable upstream README.
- Packaged analysis and primary-check hashes match the packaged results record.
  The manifest identifies only the 11 intended source inputs; archive entries
  contain no `.git` directory or environment/credential file. This is a bounded
  inventory/code inspection, not a general-purpose secret-scanner certification.
- Five previously committed PDFs still match their committed manifest hashes.

Machine-readable evidence: `/tmp/axiom-foresight-package-recheck.json`.
The fresh extraction and its tamper-test files were removed after verification.

Candidate: uncommitted changes on `beb7dd215445fd5a36e1d2c04ad9c19b09d31a0d`.
Scope only: `public/research-ui.js`, `scripts/research/build.mjs`,
`scripts/research/library.css`, `scripts/catalogue/build.mjs`,
`scripts/research/package-foresight.mjs`, `scripts/research/render-paper.py`.
Reviewer did not author these changes. Only this report was edited. Reproduction
and packaging tests used temporary files; no commit, push, UI repair, PDF
replacement or replacement of the existing supplement was performed.

## Findings

### Resolved P1: The Packaged Reproduction Command Could Not Run

Location: `scripts/research/package-foresight.mjs:24` and `:40-45`.

The packager copies the current `analysis.mjs` into the supplement and tells
recipients to run:

```sh
node --experimental-strip-types analysis.mjs --snapshot . --out reproduced.json
```

At initial review the bundled dependency accepted only `--repo` and `--out`.
It verified a commit through Git and read each source with `git show`; it had no
snapshot loader. The intended ZIP excludes the private Git repository.
Changing only the README to `--repo .` therefore would not repair the package.

Confirmed against the initial analysis file, without writing output:

```sh
node --experimental-strip-types docs/research/foresight/analysis.mjs \
  --snapshot . --out /tmp/axiom-foresight-review-reproduced.json
```

Result: exit 1, `AssertionError: Use --repo PATH [--out PATH]`, at analysis line 16.
The copied analysis and primary-check files currently match the hashes recorded
in `results.json`; this is not merely a stale local dependency.

Closure requested: provide the advertised snapshot-only execution path, verify
the included files against the manifest, and run the exact README command from
an extracted ZIP outside either repository, without private-repository access.
Compare reproduced results with the published results under an explicit policy
for analysis-file hashes if the reproduction runner changes. Do not claim the
supplement is reproducible until that extracted-package check succeeds.

Closed by the independently successful snapshot-only extraction, exact result
comparison and tampered-input rejection described above.

### Resolved P2: Fixed ZIP Times Did Not Make the Archive Deterministic

Location: `scripts/research/package-foresight.mjs:27-35`, `:66-73`.

The same UTC `utimes` values produce different ZIP DOS timestamps depending on
the process timezone. `zip -X` removes extra fields, not this local-time encoding.
An isolated fixture using the packager's timestamp and zip invocation produced:

| Environment | ZIP entry time | SHA-256 |
| --- | --- | --- |
| `TZ=UTC` | 2026-11-05 00:00 | `db9d4dd4b340afe2826128a49d881a0f2acb8cd89e45879f580f20b4f38a8b09` |
| `TZ=Asia/Bangkok` | 2026-11-05 07:00 | `716bec0b8ab221770a14364cf38ecf435b775d6e0a2e94151252167acdbb5c02` |

Fixture payload, file timestamp and entry order were identical. With a released
ZIP, this environmental difference would trip the overwrite guard even though
the study inputs had not changed. Generated file permissions also inherit the
runner's umask rather than being normalized before zip records Unix attributes.

There is a second uncontrolled input to the same deterministic-build claim:
attribution is fetched from mutable upstream `master`. Checking two licence
substrings permits unrelated README changes to alter the archive. Recording
the received hash explains the difference after the fact but does not pin it.

Closure requested: normalize ZIP timezone and entry permissions; pin and verify
the attribution bytes (or include a verified local copy). Keep the existing
versioned-output refusal. Verify two full builds under different timezones and
umasks produce identical bytes, then verify re-running against the released
output does not replace it. The fixture was temporary and was removed; the real
supplement was not generated by this review.

Closed by fixed UTC zip execution, normalized 0644 files, pinned local attribution
and two independent actual-packager reruns described above. Determinism was
verified with the local ZIP implementation, not every possible zip/compressor
version or operating system.

## Checks And Limits

- `node --test tests/research.test.mjs`: 10 passed, 0 failed. Includes metadata
  escaping, URL validation, local PDF hashes and generated research parity.
- `node scripts/catalogue/build.mjs --check`: all six generated artifacts match.
- Scoped `git diff --check`: clean.
- All five committed preprints retain identical manifest metadata and current
  PDF SHA-256 values: rain-to-phone, nobody-owns-the-haze, gauge-to-shelter,
  seeing-a-war and nst-last-mile. No existing PDF was rendered or modified.
- No additional confirmed defect found in the changed UI code: output text uses
  textContent/escaped generated metadata; new filter ResizeObserver disconnects
  on destroy; new capture-phase pointer listener has matching removal; the
  measuring select is hidden, aria-hidden, removed synchronously and excluded
  from the tab order. PDF accessible names now include their publication titles.
  This is a bounded code-review conclusion, not a new visual/accessibility pass.
- The catalogue proof-line change uses the existing structured member-path
  editor; current seven-locale generation passes parity checks.
- Renderer inspected for markup handling and output defaults. No final PDF
  layout/render check was performed independently here. The parent reports a
  seven-page preview using the pinned Python dependencies; the system Python
  initially inspected by this reviewer had different versions. This report does
  not assert an independently verified pinned rendering environment.
- Actual supplement extraction and byte-reproducibility checks are now completed
  as above. Final manuscript/scientific approval remains with the author and
  scientific reviewer. Any further manuscript/package revision needs a fresh
  candidate hash and extraction/reproduction check. Faraday's independent UI
  matrix was not rerun, and no general-purpose secret scanner was run.
- Shared-memory bootstrap was attempted; the Obsidian bridge returned
  `Transport closed`. No vault contents were changed.
