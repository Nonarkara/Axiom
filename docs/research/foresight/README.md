# Foresight Methods Audit: Reproduction

This is a preprint draft and software audit, not peer review, author signoff or
evidence of policy effectiveness. Research credit: Poon Thiengburanathum;
analysis credit: Non Arkaraprasertkul, following the owner's direction.

## Files

- `manuscript-v1.md`: complete manuscript; author approval pending.
- `analysis.mjs`: exhaustive enumeration and selected fixed-capture comparisons.
- `results.json`: complete generated results, 16 configurations and 176 rows.
- `primary-checks.json`: selected primary-source observations from 5 November
  2026. API vintage is later than the software revision; differences are not
  proof of an error in the original vintage.
- `independent-review.md`: separately owned reviewer record; consult its current
  verdict. It is not authored or modified by the manuscript agent.

## Execute

Use Node with TypeScript type stripping (tested with the installed Node runtime).
No npm installation, build, server, network data fetch or paid key is required.

```bash
node --experimental-strip-types analysis.mjs --snapshot . --out reproduced.json
cmp results.json reproduced.json
```

Snapshot mode requires `snapshot-manifest.json` with `sourceCommit` and
`inputHashes`, plus exactly the eleven required source paths under `src/`.
The script embeds the expected hashes independently of that manifest and of
`results.json`. It rejects a different commit, altered manifest or altered input
before importing any source code. Unrelated supplemental files are not inputs.

For a local Git repository containing the pinned objects:

```bash
node --experimental-strip-types analysis.mjs --repo /path/to/Foresights --out reproduced.json
```

The pin is `459d79c585d8c67830bd492ebe791429824f1024`. Current HEAD and
working-tree edits do not supply the inputs. Temporary execution copies are
removed afterward. `--repo` and `--snapshot` must not be combined. Omitting both
uses the original sibling-repository location for local convenience only; public
reproduction should use `--snapshot`.

## What The Checks Establish

The script enumerates binary switches, compares baseline and adjusted profiles,
checks locality, unchanged axes, insertion-order invariance, repeated baseline
reads and non-mutation, and runs the pinned suite (25 tests). It does not test
economic truth, report fidelity, forecast skill or institutional outcomes.

The forty changed fields include sixteen categorical stances. Stance is not a
fifth scored axis. Each switch is active eight times by construction; those
counts are not probabilities or independent observations.

## Source Access And Rights

The planned public bundle is
[foresight-methods-v1.zip](https://axiom.nonarkara.org/research/foresight-methods-v1.zip).
This README does not certify that it has been published. The parent publication
task must verify the downloaded bundle runs in a separate directory, without
access to the private repository, before claiming public reproducibility.

The source supplement must preserve project attribution and the applicable
upstream Thailand geometry licence/README. No blanket third-party licence is
asserted. The original foresight reports are not redistributed or claimed to
have been reviewed in full. Do not include Git history, credentials or an entire
private repository. Only the eleven pinned execution inputs are required.
