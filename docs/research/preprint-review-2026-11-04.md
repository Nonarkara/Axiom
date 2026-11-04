---
updated: 2026-11-04
drafted_by: codex/gpt-5
reviewed: false
---

# Preprint Review: 4 November 2026

Internal author-facing editorial review, not peer review or independent data certification. Read all five local `public/research/*.pdf` preprints fully using `pdftotext -layout`, including methods, results, tables, captions, declarations and references: 44 printed pages total. Page references below use the printed numbering (including `n/9` and `n/7` footers), not extraction line numbers. Findings describe what the manuscripts report; underlying databases, code execution, cited literature and live services were not independently verified.

**Preserve the originals.** No PDF, author draft, manifest, generated page or application file was edited. This review is the only file owned by this task. Suggested manuscript changes require author approval and a new version, not replacement of released bytes. Follow the [publication workflow](README.md).

## 1. From Gauge to Shelter

Source: `public/research/gauge-to-shelter-v1.pdf`, v1.0, 9 pages.

**Strong contribution.** The paper turns an abstract monitoring-to-action problem into inspectable missing assets: 177 official shelter rows without coordinates, explicit geocoding precision, sanitation assumptions and a seven-link comparison of rain-to-drainage and haze-to-shelter (pp. 4-5, Tables 3-4, Figures 3-4). Reporting an adapted system's unvalidated feeds and an unassigned duty officer makes the feasibility claim more credible, not less (pp. 6-7).

**Author callouts, in priority order:**

1. **Remove the unsupported join inference.** Table 1 says that only six datasets carry a location, "so cross-agency joins on place are rare" (p. 3). The adjacent text explicitly says actual joins were not tested. Replace the inference with the measured location-field count. If joining is a contribution, test named dataset pairs, administrative identifiers, place names and coordinate precision, and report successful/failed joins; coordinate absence alone does not measure joinability.
2. **Explain shelter rows, sites and mapped/unmapped denominators.** The text reports 177 rows, three duplicates, 174 distinct shelters and precision counts of 45 building + 77 subdistrict + 55 district (p. 4). Visual inspection of p. 5 confirms Figure 3 labels 52 district + 77 subdistrict + 45 building points (174), while Figure 4b labels 55 + 77 + 45 (177). This is an unexplained denominator difference, not proof of wrong numbers: deduplication, unmapped records or another exclusion could explain it. Add a row/site/mapped/unmapped crosswalk and corresponding captions. State whether the 98,775 capacity and 40,739 sanitation-limited scenario include duplicate rows before interpreting aggregate capacity.
3. **Make the parser and absence audit diagnosable.** The 41% unreadable figure pools failed downloads, corrupt files, PDFs/images and table-parser failures (pp. 2-3). Separate those causes, give the exact Thai/English search terms and matched resource identifiers behind Table 3 (p. 4), and explain why Table 3 finds zero "API or live stream" entries while p. 3 reports two API-labelled datasets. Preserve the distinction between catalogue absence and absence from agency operations.
4. **Keep feasibility separate from safety and seasonal prediction.** The 24/25 freshness result is a dated registry check, not longitudinal uptime; the 917 webcam pairs contain no reading above 37.5 and do not validate haze detection (p. 6). Two burn seasons show concentration in March-April, not yet reliable prediction "in month and place" (p. 6). Retain these results but narrow that wording. For a next study, predefine independent event labels and log alert creation, authorized recipient, acknowledgement and action; the 104 level changes are not verified evacuations.
5. **Resolve submission dependencies visibly.** Preserve the candid disclosure that the sanitation reference was checked only secondarily (p. 2), and verify the primary standard before any compliance language. Confirm funding, organisational review and author contributions, and deposit the promised frozen reproducibility archive (p. 7). The reference-line scenario is useful without calling it certified shelter capacity.

**Recommended short library copy:**

- **Question:** Which links between measurement, warning and shelter can a provincial operations room assemble from public data?
- **Evidence:** A Chiang Mai audit covers 311 datasets, 2,869 resources and 177 official shelter rows; none of the shelter rows has coordinates, and subsequent geocoding distinguishes building-, subdistrict- and district-level precision (pp. 2-5).
- **Limitation:** Search absence is not universal absence. This is a descriptive audit and adapted-system feasibility study, not a test of institutional causes, warning effectiveness or evacuation outcomes (pp. 2-3, 6-7).
- **Study coverage:** Chiang Mai province, including the shelter register across all 25 districts; national portals are sources, not a national sampling frame (pp. 2, 4). A Chiang Mai city marker is a reference anchor, not the extent of the provincial study or a fieldwork site.

## 2. The Last Mile Is Institutional

Source: `public/research/nst-last-mile-v1.pdf`, v1, 7 pages.

**Strong contribution.** The distinction between observation time, audit check time, declaration status and human receipt is unusually valuable. The two-check reconstruction avoids turning an observed threshold/status mismatch into an accusation of a measured warning delay (pp. 1, 4, Figure 3). The paper also exposes conflicting municipal performance accounts rather than selecting the more flattering one (p. 2).

**Author callouts, in priority order:**

1. **Bring the question into line with the design.** The opening asks about national failure and whether a system can be "put to use now" (p. 1), while the design and conclusion establish an inspectable participant prototype, not adoption or national causes (pp. 3, 6). Lead with that bounded contribution. Treat the four deficits as organising propositions, not measured causes, and keep the manuscript's explicit rival explanations.
2. **Attach the alert-clock evidence, not a delay headline.** Publish a privacy-safe extract of the two checks with observation/retrieval clocks, time zone, status fields and the source threshold definition (pp. 1, 4). Retain the 145-minute interval as unobserved time. STN2101 is in a west-coast basin with no demonstrated downstream connection to the city gauge (p. 4): do not illustrate it as a city flood-warning path without surveyed connectivity.
3. **Make the municipal outcome conflict an explicit evidence table.** Put the two report-volume and resolution-time accounts side by side with report page references, denominators, dates and unresolved definitions (p. 2). Mark the 37% workload reduction, annual savings and procurement lead-time change as secondary municipal claims pending independent records. They are not outcomes of this control-tower prototype.
4. **Pin the snapshots and separate scale from coverage.** Table 1 and p. 4 correctly distinguish 10,414 registry records from the separate 10,412-record health check and raw-retention policy (pp. 3-4). Preserve that precision in an immutable extract manifest. Identify the 51 river and 173 rain records by stable IDs and observation clocks; do not market 64.1 million retained rows as continuous historical coverage or unique Thai physical gauges. Failed/skipped catalogue resources must remain unclassified rather than evidence of no live services.
5. **Specify a bounded handover test.** The 437 villages are provincial records, vulnerability counts are estimates, and hydraulic/camera outputs are incompletely calibrated (p. 5). Test whether a named duty operator can inspect evidence, verify one priority and acknowledge a briefing, then record any authorized action separately. Couple this to a relay failure drill and a named service owner; the documented workstation failure and absent agreement matter more to continuity than commit or test counts (pp. 5-6).

**Recommended short library copy:**

- **Question:** What can a city control-tower prototype connect, and which institutional links remain outside its authority?
- **Evidence:** A participant case combines 216 catalogue datasets, dated provincial station snapshots and an operation audit; 47 adapters support source-labelled briefings and human verification (pp. 3-5).
- **Limitation:** Two checks 145 minutes apart do not measure notification delay. Calibration, official receipt, adoption and public-safety outcomes remain unestablished (pp. 4-6).
- **Study coverage:** Nakhon Si Thammarat municipal narrative and prototype, provincial catalogue/stations/village register, with wider FloodDash snapshots used as supporting evidence (pp. 2-5). Neither all 437 villages nor the full telemetry registry is a municipal deployment count. City point: reference anchor only.

## 3. Rain to Phone

Source: `public/research/rain-to-phone-v1.pdf`, v1, 8 pages.

**Strong contribution.** The useful result is the trade-off, not just speed: 84.4% replay recall comes with 12.5% precision, while the system has only 29 Telegram subscribers (p. 5). Publishing its long outage and retracting two unsupported historical alert claims makes this a substantive failure analysis rather than a dashboard demonstration (pp. 3, 5).

**Author callouts, in priority order:**

1. **Separate reported broadcast news from official issuance.** The Nan timeline uses an 08:30 news report as the first reported cell broadcast (pp. 1-2, 5). That is not verified first issuance, device receipt or absence of earlier warnings. Label that clock directly on Figure 1 and seek official dispatch/receipt records before claiming an institutional delay. Similarly, a retrospectively added rule firing at 01:00 is not an alert delivered that night.
2. **Make the watchlist evaluation reproducible and harder to flatter.** State eligible station-days, missed events, missing-data exclusions, repeated-event treatment and the exact archived rule revision behind 302/358 hits and 2,115 false positives (pp. 3, 5). Explain how information available at forecast issue time was preserved in the replay, compare persistence/simple bank-trend baselines, and use held-out events or prospective evaluation. Same-network bank-state prediction is not independent validation of inundation or public safety.
3. **Bound the latency headline.** The 6.7-minute median covers 162 matched water-level/precursor alerts, not all 13,766 alerts and not phone delivery (pp. 4-5, Table 1). Report matching eligibility and excluded/unmatched alerts. Reconcile the 124-day alert window with ingest logs covering 19 September-4 November and only 1,090.4 observed reliability hours (p. 3); never present 95.7% as verified full-period availability.
4. **Treat quality flags as candidates, and account for dependence.** Calling 36 bank levels impossible uses author-chosen thresholds against latest water levels (p. 4); request datum and instrument checks before certifying those metadata wrong. The 738 rain comparisons are repeated pair-hours, not independent hours or 40 independent agency comparisons. Report pair-specific error/timing diagnostics and a clustered uncertainty analysis; 2 km rainfall differences alone do not prove institutional failure.
5. **Moderate the bypass and safety claims.** "Cost nothing" does not include operator labour, AI tools, hardware or continuity (p. 6). The 48-tool sample is found largely through social media/word of mouth, not a complete census (pp. 3, 5), and the text alternates between 48 other tools and counting itself among 48 (p. 7): reconcile membership. Test the gauge-confirmation requirement for relaying official TMD warnings as a separate policy: it may suppress an official warning where local gauges are missing (pp. 2, 5). A prospective relay should retain the official warning and distinguish optional corroboration, with explicit authority and receipt evidence.

**Recommended short library copy:**

- **Question:** Can public flood feeds become a working rain-to-alert chain without waiting for agencies to merge?
- **Evidence:** 124 days of alert records and 44 integrated feeds; median gauge-to-alert lag is 6.7 minutes in 162 matched alerts. A retrospective watchlist has 84.4% recall at 12.5% precision (pp. 3-5).
- **Limitation:** The replay uses the same gauge network as its reference, not an independent flood record. Alert generation is not phone receipt or protective action; 29 Telegram subscribers were recorded (pp. 3, 5, 7).
- **Study coverage:** Thailand-wide flood-data integration with international inputs; Nan (19 August) and Phuket (25-26 October) are selected event reconstructions, not representative field trials (pp. 3, 5, 7). No gauge sits in Patong itself (p. 5). City anchors do not imply a surveyed catchment or local deployment.

## 4. Nobody Owns the Haze

Source: `public/research/nobody-owns-the-haze-v1.pdf`, v1, 11 pages.

**Strong contribution.** This paper tests useful alternatives and reports losing: bias correction improves CAMS but persistence still wins (p. 4, Figure 5 on p. 8). It also exposes token-gated adapters recording success without data, distinguishes hourly alerts from daily exposure, and gives explicit feature-removal tests before the burning season (pp. 3-6, Table 3 on p. 10).

**Author callouts, in priority order:**

1. **Extend the existing denominator explanation.** The discussion already resolves Table 1's 17 streams as 16 public feeds plus one sibling system (p. 6); this is not an unresolved 16-versus-17 error. The collector result separately counts 23 sources (p. 3). Map public feed -> stream -> adapter -> scheduler/log source, including activation dates and aliases, to explain that remaining denominator change. The headline 98.7% is logged pull success, not delivered-data availability; show configured, skipped, failed, productive and fresh states separately, retaining the two silent-token failures (pp. 3-4).
2. **Correct the visibility/extinction sentence.** Section 5.6 says extinction should fall as PM2.5 rises (p. 5). The intended decreasing quantity appears to be visual range, not extinction. Check whether the reported positive correlation uses visibility or derived extinction, correct the variable/sign explanation, and rerun after excluding or remapping the three mislabelled airport codes disclosed on pp. 4 and 6. Do not treat a relabelled table as validation of the earlier matches.
3. **Keep cross-border fire geography separate from smoke attribution.** The 86% result describes 5,159 fire cell-days in the stated regional box over 14 days (p. 5); it is not 86% of Thai PM2.5, annual burning or foreign-caused harm. The 62-province agricultural burn-scar product excludes forest and grass fires. Preserve both qualifications beside headline figures. The nine-day transport association's sensitivity to centring is a result worth foregrounding, not a validated source-apportionment model.
4. **Audit the full warning path without inventing end-to-end timing.** The 7-second median is a server handoff matched to the next broadcast line, to one or two chats; the 32-minute combined chain is random pairing of separate hops, not matched reading-to-device trajectories (pp. 3, 5). Add event/batch IDs, actual membership, attempt/result and acknowledgement clocks in a future consenting-user study. Keep the 13 evaluable warned province-days distinct from 21 warnings and from only six target dates (pp. 4-5); use date-clustered uncertainty rather than treating them as independent trials.
5. **Freeze the prospective protocol and the time scale of the verdict.** Archive the exact analysis revision, missing-data rules, eligible events and T1-T7 decision rules before 1 December; retain the admission that T2/T4 were chosen after seeing this audit (pp. 6, 10). Specify what happens if the season yields too few high events. Explicitly distinguish hourly concentration comparisons, a 24-hour regulatory mean and the composite Air Watch Score, whose author-selected weights are not a validated health-risk probability (pp. 2-3, 6). No observed health or behaviour benefit should be implied.

**Recommended short library copy:**

- **Question:** What can an open haze-warning chain deliver, and where do monitoring coverage and forecast skill still fall short?
- **Evidence:** In 110 pre-burning-season days the collector logged 58,298 scheduled pulls across 23 sources; 98.7% were marked successful despite two token-gated feeds skipping without data. Persistence outperformed the corrected CAMS forecast (pp. 3-4).
- **Limitation:** This is a pre-burning-season systems audit, not a multi-year trend or health-impact study. Telegram handoff to one or two chats does not establish population receipt or response (pp. 1, 3, 6).
- **Study coverage:** National Thai monitoring (175 PCD stations in 74 provinces; fusion/forecast surfaces for 77), regional fire analysis within 4-29 degrees N and 92-110 degrees E, agricultural burn scars in 62 provinces (pp. 2-5). Northern Thailand is an analytical subset, not the whole study. No city marker establishes fieldwork, and neither the regional box nor foreign detections establish transported pollution attribution.

## 5. Seeing a War Without Standing in It

Source: `public/research/seeing-a-war-v1.pdf`, v1.0, 9 pages.

**Strong contribution.** The observability audit demonstrates why an empty map cannot mean peace: stale AIS, near-empty Egyptian ADS-B coverage without an active bulletin, and a "LOW" composite supported by only one of four inputs (pp. 3-6, Table 7 on p. 8). Auditing its own false $140 milestone is a concrete contribution to provenance practice (p. 2).

**Author callouts, in priority order:**

1. **Distinguish channels from independent witnesses.** "Five independent witnesses" (p. 1) is too strong without a lineage graph. PortWatch and the vessel snapshot both derive from AIS (p. 4), and the Axiom snapshot is not independent of the project's operator (p. 7). Classify technical, institutional and commercial dependencies, then say which comparisons genuinely fail differently. The abstract's "independent sources agree" should not erase the shared AIS risk.
2. **Separate descriptive timing from causal or behavioural interpretation.** Preserve the 28% port-call ratio and 98% control ratio (p. 2), but do not equate port calls to tonnage, closure or war-caused losses. Check seasonally matched windows, port-level sensitivity and alternative block lengths; foreground Jeddah's unresolved single-port effect (pp. 2-3). The market correlation is consistent with several mechanisms, not proof that traders viewed fuel as the main risk.
3. **Fix the price-clock mismatch.** Table 2 is headed change in close but the 4 November Brent value is explicitly intraday in the text (pp. 2, 4). Mark the final column as an as-of intraday observation with time zone, or replace it in a future version with completed closes. Document contract/roll conventions, particularly the 31 March expiry, so the peak and spread cannot be mistaken for purely physical disruption.
4. **Make observability a repeated measurement.** Four AIS snapshots over 81 minutes and eight ADS-B samples on one day cannot establish persistent receiver coverage or closed airspace (pp. 3-4, 6). Publish sample times, bounding boxes, freshness sensitivity and receiver/provider metadata where available. Maintain the distinction between OpenSky's analysis and adsb.lol's platform feed; Table 7's 134 aircraft and the analysis mean of 405 are not interchangeable coverage measures (pp. 4, 8).
5. **State the thermal window exactly and preserve candidate status.** The methods/limitations call heat a single-day cross-section, but the reported detections span 28 October-2 November, six days (pp. 2, 5-6). Clarify that extraction is on audit day while persistence is measured over six days. Three transient cells over 50 MW are candidates without ground truth, not attacks, weapons attribution or environmental damage. Preserve the aggregate-analysis and no-targeting safeguards (pp. 5-7).

**Recommended short library copy:**

- **Question:** What can ships, aircraft, thermal satellites, markets and regulators reveal from outside a conflict zone?
- **Evidence:** Five observation channels with control ports and coverage checks: Gulf port calls fall to 28% of their earlier rate; only 17.5% of 68,680 vessel positions are under six hours old (pp. 2-4).
- **Limitation:** One-event descriptive comparisons do not identify causes. Shared AIS lineage, sparse receivers, stale positions and industrial heat limit conclusions about absent activity, weapons attribution or human impact (pp. 3-7).
- **Study coverage:** Gulf/Middle East conflict analysis with global market/AIS data and explicit comparison regions: Singapore/Rotterdam control ports, European/Southeast Asian aviation boxes, and other thermal regions (pp. 2-6). Not a Thailand city study and not conflict-zone fieldwork. A regional overview frame is not an exact common boundary for all five channels.

## Manifest Review And Shared Editorial Decisions

Read the parent's enriched `data/research.json` during this task; did not edit it. The Rain to Phone, NST and Seeing a War question/evidence/limitation copy is supported as written. The study labels correctly separate national, provincial and regional coverage, and the reading guide correctly disclaims fieldwork and adoption.

- **CNX citation correction:** its evidence ends with subsequently located shelter precision, whose results are on pp. 4-5. Change the evidence citation from `(pp. 1-3)` to `(pp. 2-5)` or cite the geocoding results separately. Its limited causal/absence language is appropriate; do not import Table 1's unsupported "joins are rare" inference.
- **AirDash denominator clarification:** prefer `110 pre-burning-season days; 58,298 scheduled pulls across 23 logged sources`. The original 16 is a valid public-feed count: p. 6 explicitly explains the 17 streams as 16 public feeds plus one sibling system. Do not flag that as an error. The useful author request is a crosswalk to the 23 collector sources, so library copy does not imply that 16 feeds share the pull denominator. Keep the logged-success and token-skip caveats. Add p. 6 to the limitation citation for the explicit non-outcome/population-scale limit.
- **Shared outcome contract:** distinguish source observation -> retrieval -> rule output -> attempted channel handoff -> recipient/device receipt -> acknowledgement -> authorized action -> outcome. No paper measures that entire chain. A published prototype, successful test, low generation latency or simulated replay must not be summarised as official adoption or protective benefit.
- **Shared reproducibility contract:** archive the exact input extracts, capture clocks, hashes, analysis revision, eligibility/missingness rules and expected outputs. State inaccessible raw-data limits. These are author improvements, not claims that this review reran or certified the analyses.
- **Cross-paper caution:** NST's 64.1 million retained reading rows (p. 4) and Rain to Phone's 33.9 million raw readings (p. 3) should not be silently harmonised. Ask for table definitions, snapshot clocks and a source crosswalk before displaying a shared total; different snapshots/definitions may explain them. Likewise, preserve the printed `Pun` in the AirDash byline versus `Poon` elsewhere until the authors confirm any correction.

## Source Preservation Record

Local PDF SHA-256 values were recorded before review and rechecked after writing. These identify the exact versions reviewed, not independently verified upstream or live-host bytes.

| Original PDF | Pages | SHA-256 |
| --- | ---: | --- |
| `gauge-to-shelter-v1.pdf` | 9 | `2b151f3b820d6875cc63615b872d1b581028041b97c619dd9bcc2ed6e64782cf` |
| `nst-last-mile-v1.pdf` | 7 | `e8eefb756410298c0b1b3c5fe8df919d5db913a5fd474329ed050e8d2d7fb6b7` |
| `rain-to-phone-v1.pdf` | 8 | `d97e8b1daf7b556ef9f0d6d6fe7354159325d7fe7b39c46a73b57d830852a664` |
| `nobody-owns-the-haze-v1.pdf` | 11 | `774936f3e9eb63b0c0721d4c2f305cf3635c53b97d456beb343811c4a0a44eb9` |
| `seeing-a-war-v1.pdf` | 9 | `5dbb9959067c7198d4ed3b776c25e1157df3d3e7ea4099de74c61a47c4ff2d5e` |

No commit, push or deployment was performed. No layout, rendering or operational-effectiveness pass is claimed for this text-only review.
