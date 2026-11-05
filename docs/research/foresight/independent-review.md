---
updated: 2026-11-05
drafted_by: codex/gpt-5
reviewed: false
---

# Independent Scientific And Methods Review

**Verdict: PASS for the bounded methods manuscript and supplied local supplement.**

The two reproduction findings below were repaired and independently retested.
No unresolved scientific or arithmetic finding remains within this review's
scope. This verdict is not journal peer review, author approval, validation of
the unavailable reports, or certification of a not-yet-deployed download.

The current user's explicit instruction authorizes public release of this
clearly labelled preprint draft, with author-approval-pending and AI-assistance
disclosures retained. That authorization is distinct from final author signoff;
Poon Thiengburanathum's approval is not assumed. The absence of final signoff is
not a blocker to this authorized draft release and must not be represented as
approval of a final paper.

This is an independent review of the proposed paper, not a review of its UI.
Only this review file is reviewer-owned. No source, analysis, manuscript,
catalogue or publication assets were changed; no commit or push was made.

Reviewed manuscript: `manuscript-v1.md`, 183 lines, title **From Strategic
Foresight to Inspectable Decisions: A Provenance-Aware Scenario Console for
Thailand's Economic Clusters**. SHA-256:
`119ac2db8b1b7866fbc3b2ec8f1d9da089837e867a9f6bc6cb656ed35ab52fa5`.

## Findings And Resolution

1. **Closed: the manuscript initially described a snapshot mode the runner rejected.**
   Manuscript lines 55 and 169 describe a functioning `--snapshot` path and
   verification of snapshot inputs. In the reviewed `analysis.mjs`, lines
   15-16 accept only `--repo` and `--out`; lines 20-21 and 35 require Git
   objects. Executing
   `node analysis.mjs --snapshot /tmp/foresight-unavailable-snapshot` exits 1
   with `AssertionError: Use --repo PATH [--out PATH]`, before looking for the
   supplied path. This is an artifact/capability mismatch, not a missing-file
   error. That finding applied to runner hash `9584d2c...`, not the repaired
   runner identified below. The supplied revision accepts `--snapshot`, verifies
   the commit and all eleven hashes against independent embedded expectations,
   and runs without Git. The manuscript's capability statement now matches the
   executable artifact. Regenerated results carry the repaired runner hash.

2. **Closed for the submitted candidate: exact execution inputs were initially absent.**
   A source hash list was not enough to reproduce the analysis outside the
   author's checkout. The delivered `public/research/foresight-methods-v1.zip`
   now includes all eleven exact input files, runner, results, selected primary
   captures, current manuscript, snapshot manifest and reproduction README.
   Its full upstream Thailand README preserves the MIT notice and Apisit
   Toompakdee attribution. Its rights statement distinguishes inspection material
   from third-party statistics, reports and publications; it does not redistribute
   the unavailable full reports or claim a blanket third-party licence.

   The independent clean-extraction test below demonstrates that the repaired
   ZIP is complete and executable, without relying on Git objects. The upstream
   [apisit README](https://github.com/apisit/thailand.json/blob/master/README.md)
   does contain the MIT notice and 2012 Apisit Toompakdee attribution; I verified
   that primary record. This is an attribution inspection, not an independent
   legal clearance of all referenced material.

Live publication remains parent-owned: after deployment, download the canonical
ZIP and verify its hash and execution before claiming the public URL is serving
these reviewed bytes. That release check is distinct from this local methods
PASS. The user-authorized public draft may proceed with its pending-approval and
AI-assistance disclosures intact. Final author approval and completed declarations
remain necessary before representing it as a final author-approved paper; this
reviewer does not supply that signoff.

## Manuscript Scientific Assessment

No confirmed aggregation error or unsupported causal/forecast-efficacy claim
was found in the reviewed draft. The title is consistent with a provenance-aware
console methods case, and the abstract expressly limits the results to the
implementation. This is not a courtesy scientific endorsement of the underlying
strategy or source reports.

- Lines 43, 67, 81-106 correctly distinguish four axes from categorical stance,
  32 changed rows from 40 changed properties, and 176 constructed rows from
  empirical observations. The baseline transitions and fifteen cluster-specific
  profiles agree with independently checked source behavior.
- Lines 45, 69, 112 and 147 correctly separate geopolitical trajectories from
  threshold configurations, set insertion order from policy sequencing, and
  repeated baseline reads from lower-level idempotence. No calibrated scenario
  probabilities or cross-cluster effects are claimed.
- Lines 49, 63 and 155 state the missing full reports and unverified source
  transcription/elicitation. Lines 118-141 avoid treating a source inventory,
  curated literature tags or derived provincial membership as empirical
  validation, a systematic review or field coverage.
- Lines 73 and 124-135 correctly retain the later-vintage and denominator
  caveats for selected statistics. Percentage-point differences are labelled
  correctly; the narrower BOI/NXPO records are not used as replacement series.
- Lines 149, 155 and 159 do not claim adoption, improved allocation, causal
  identification, forecast skill or welfare effects. Author roles and AI
  assistance are disclosed at lines 17 and 163-165. Final author approval,
  affiliations, funding and competing-interest declarations remain explicitly
  pending for final author signoff, not facts an agent can certify or a bar to
  the current user's authorized, clearly disclosed public draft release.

## Verified Methods

Source commit: `459d79c585d8c67830bd492ebe791429824f1024` in
`/Users/nonarkara/Projects/Foresights`, authored 25 August 2026. The current HEAD
differs, so the author's extraction by pinned Git object is important. For my
separate enumeration, I first checked that the locally imported scoring,
cluster and anchor modules were byte-identical to the pinned objects.

Independent computation reproduced:

| Quantity | Verified result | Interpretation |
|---|---:|---|
| Economic clusters | 11 | Encoded baseline rows, not sampled organizations |
| Scored axes | 4 | Value, growth, local contribution, sovereignty |
| Review switches | 4 | Distinct targets; no cross-cluster coupling |
| Binary switch configurations | 16 | Exhaustive for these four switches only |
| Cluster-state rows | 176 | 11 rows repeated across 16 configurations |
| Changed rows | 32 | 8 for each of EV, data centres, steel, food |
| Unchanged rows | 144 | Includes unaffected clusters and inactive targets |
| Changed properties | 40 | Growth 8, sovereignty 16, stance 16 |
| Value/local changes | 0/0 | Invariants of the encoded rules |

Stance is a categorical policy label, not a fifth scored axis. Forty changed
properties are not forty changed rows: EV changes sovereignty and stance in
each of its eight active configurations. These counts are not empirical
sample sizes, event probabilities, economic effects or uncertainty estimates.
Each switch is active in exactly eight enumerated configurations by design.

The independently checked transitions are:

- EV: sovereignty Low to Low-Med; Focus (conditional) to Focus.
- Data centres: sovereignty Very Low to Low; stance remains conditional.
- Steel: Make it exist to Keep & upgrade; growth remains Declining.
- Food: growth Low-Med to Med; sovereignty and stance do not change.

The initial Git-mode rerun produced a **byte-identical** result to the then-current
`results.json`. The final clean-extraction snapshot rerun below produced a
**byte-identical** result to the final `results.json`. Both reported **25 tests,
25 passed, 0 failed**.
The independent enumeration used native imports only after the pin comparison;
it did not reuse the author's enumeration code.

Reviewed analysis SHA-256:
`dabe20303bdd14441e42adf6ae2e236d84e3ee2ee60d7028f0dc38dbda8e2423`.

## Independent Clean-Extraction Receipt

I extracted the delivered archive into a fresh OS temporary directory, not the
author's repository or the parent's earlier extraction. I independently compared
each of its eleven source files and manifest hashes with the pinned Git objects.
I compared the archived runner, primary captures and manuscript with the delivered
paper-folder versions. All matched.

The reproduction process used `PATH=/nonexistent`, making Git unavailable to it
and its child processes, and ran under Node **v26.0.0** using the absolute Node
executable:

```text
node --experimental-strip-types analysis.mjs --snapshot <fresh-extraction> --out reproduced.json
```

Exit status was 0; the output was byte-identical to both the archived result and
the final paper-folder result. The pinned suite again reported 25/25 passes.
I then modified only the temporary copy of `src/lib/scoring.ts`: a second run
failed with `Source hash mismatch: src/lib/scoring.ts`, before import. This
falsifier confirms that the snapshot path does not just trust its directory or
manifest. No supplied source file was modified.

Final reviewed hashes:

| Artifact | SHA-256 |
|---|---|
| `foresight-methods-v1.zip` | `62b49f306ed054bba681f4dcd96ea95e3ef6d393331166d6ed16ab78f8a52504` |
| `analysis.mjs` | `dabe20303bdd14441e42adf6ae2e236d84e3ee2ee60d7028f0dc38dbda8e2423` |
| `manuscript-v1.md` | `119ac2db8b1b7866fbc3b2ec8f1d9da089837e867a9f6bc6cb656ed35ab52fa5` |
| `results.json` | `b47332bb98f2452e1f1aaf49d9a346013f295ccc0b7ff823052ac301b925d4dc` |

## Boundaries Confirmed In The Manuscript

- The one-step magnitude is the console's convention. Without the reports,
  the review cannot independently confirm even the transcription of directions
  attributed to report section 6.1. Call these encoded/transcribed judgments,
  not independently verified published measurements.
- Repeated reads start from the baseline. They demonstrate no ratcheting in
  this accessor, not mathematical idempotence of feeding adjusted scores back
  into `applyThresholds`. Active-set insertion-order invariance is not a test
  of time-varying policy implementation sequences.
- The four geopolitical trajectories are separate from the 16 threshold
  configurations. The enumeration does not estimate trajectory probabilities,
  couple scenarios to cluster changes, or simulate policy realization.
- The six-row, four-trajectory stress matrix is a judgment table. Its displayed
  means are equal-weight summaries, not expected values under calibrated
  probabilities. Exact means are 5.5, 6.25, 4.75, 7.75, 6.25 and 8.5;
  one-decimal stored values 5.5, 6.3, 4.8, 7.8, 6.3 and 8.5 are consistent.
- The 0.5-3 plotting encoding is ordinal/presentational, not a cardinal welfare
  scale. Declining shares a plotting floor with Very Low but is a direction,
  not an equal substantive category. Do not sum scores into GDP or welfare.
- The 13 literature records, 55 source records, source-tier labels and passing
  tests are inventories/checks, not full-text literature validation or proof
  that every source is correct. Geographic cluster membership is console-derived,
  not observed provincial policy exposure or fieldwork.

## Primary Checks And Evidence Limits

I independently fetched the four World Bank API URLs in `primary-checks.json`.
All returned HTTP 200, year 2024, `lastupdated: 2026-10-08`, and values exactly
matching the capture:

| Indicator | Console | Retrieved primary value | Console minus primary |
|---|---:|---:|---:|
| GDP per capita, current USD | 7900 | 7386.63615126055 | +513.36384873945 USD |
| Real GDP growth | 2.5 | 2.94859986593323 | -0.44859986593323 percentage points |
| FDI net inflows / GDP | 1.1 | 2.70165281834265 | -1.60165281834265 percentage points |
| Population aged 15-64 / total | 70 | 69.887763454186 | +0.112236545814 percentage points |

These are selected discrepancies against a retrieved vintage, not evidence of
deliberate fabrication or a complete audit of either paper's statistics. The API
vintage postdates the pinned source commit; original-vintage errors cannot be
distinguished from later revisions without historical response snapshots.

The [NXPO page](https://www.nxpo.or.th/th/en/17125/), dated 23 June 2023,
reports GERD for **2021**, 1.21% of GDP, and a **target** of 2% by 2027. It does
not establish a replacement for the console's 2023 value. The [BOI release
97/2568](https://www.boi.go.th/upload/content/PR97_2568EN.pdf), physical PDF
page 2, distinguishes 2024 BEV passenger registrations from the H1 2025 share.
Its figures cannot directly replace a full-year BEV-plus-PHEV sales-share series.

The source repository's `context.md` says the complete 139-page source study
is absent. My web retrieval attempts for both Craft source URLs did not expose
readable report text. I therefore make no source-fidelity or full-report review
claim. The paper must distinguish what the console encodes from what the
underlying reports have independently established.

## Deployment Statement And Review Limits

I independently checked manuscript line 41: the live homepage returned HTTP 200,
and its JS and CSS bytes matched the corresponding local `Foresights/dist`
assets at retrieval on 5 November 2026:

- `/assets/index-Bi_WxlJy.js`:
  `bccb3afd4d2df6a4bc50b4bcd6bbc37681a7d05c7c4532d2f3e84aad6cb2fba3`.
- `/assets/index-CU9Ve1VP.css`:
  `391654ce403c0d476973ddd1a4eb6ccb630b7306b03924327db8dac08059ac11`.

This supports the stated deployment-asset comparison, not a claim that a local
`dist` directory alone proves the build's Git provenance. The scientific
enumeration above remains anchored to the named source objects.

The source-supplement, advertised snapshot command, complete output comparison,
eleven pinned source hashes, manuscript identity and input-tamper falsifier have
now passed independent local retest. A changed manuscript, runner, result or ZIP
requires review of the changed bytes; this PASS identifies the versions above.
Only this review file was changed. No UI edits, commit, push, author signoff or
journal peer-review claim is made.
