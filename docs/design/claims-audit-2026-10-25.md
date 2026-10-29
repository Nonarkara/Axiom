# Claims audit - 2026-10-25

## Task and preservation

A prospective city operator needs to inspect the work and distinguish a
catalogue claim from an operational measurement before sharing the page.
The map, canvas, 18-stop tour, persistent project pins, HUD, four console
views, seven languages, catalogue, field material and event records survive.

The existing console carries the correction. A second proof banner was
rejected: it would add chrome while leaving the original claims in place.
Blue, ocher, paper and operational colour roles are unchanged.

## Found and changed

- The hero counted 73 catalogue entries as systems in production while the
  catalogue labelled only 61 Live. Both figures now state what they count.
  Live is a catalogue status, explicitly not an uptime measurement.
- Six domain rows claimed eight domains and carried unsupported distribution
  counts. The displayed-domain count now derives from those rows; the
  untraceable distribution totals are gone. Examples name actual entries.
- Zero slide decks, 68M people protected, 247 feeds, zero costs and 60 FPS
  were presented as measurements without sources for those meanings.
  Project reach now counts mapped systems, tour stops and named currencies
  from the footprint. Public access, provenance, the proposed two-week pilot
  and delivery terms are described without invented outcomes or guarantees.
- The runtime updates every figure, including zero. It does not leave an old
  value behind when a source becomes empty.
- At 480px the HUD could wrap into a different number of rows as the tour
  advanced. The spatial cross-check caught a 5px action shift. The phone HUD
  now separates heading, place and system count into predictable lines.
- An orphan `scroll-snap-type` declaration and closing brace ended the phone
  media query too soon. Phone button rules leaked onto desktop. Removing
  that obsolete fragment restores their intended scope.
- The already-hidden drag hint stays hidden explicitly, rather than relying
  on that parse error. Primary actions retain their 44px target on desktop
  as well as phone; repairing CSS scope must not shrink a working target.
- At 901px the restored desktop tracking made the action pair wrap, notably
  in Vietnamese. Zero tracking and the accurate destination label "View
  systems" keep the pair on one row in all seven editions without reducing
  the text size or targets. The footer uses the compact tier "Reference data";
  the provenance card still states that this is not a feed-health monitor.
- The console's backdrop blur and the redundant behind-map wash are removed.
  The map container retains its own dark fallback background. Neither change
  removes data, imagery, an interaction, or a visible geographic layer.

## Verification

- `npm test`: 53 tests, including six new claim/geometry guards. Mutations
  reintroducing old domain totals, protection labels, feed counts, free-cost
  claims and frame-rate telemetry are rejected.
- `npm run check`: 27 JavaScript files.
- Count gate: 73 entries, 61 Live, 12 other statuses, six displayed domains,
  25 mapped systems, 18 tour stops, three individually named currencies.
  The gate checks labels as well as arithmetic and requires every binding.
- Language gate: every rendered key supplied in all seven editions; no
  undecided English fallbacks. Persistence and language links still work.
- Browser: project-reach tab, all stop selections, and translated controls
  exercised. At 360px and 390px all 18 stops in all seven editions have zero
  primary-action movement. HUD height is 58.586px. This is a fixed-format
  changing readout, not empty padding added to balance a grid.
- The initial spatial run failed on the 480px disagreement. The subsequent
  English run caught changed geometry after the media-query repair. The
  instrument and its thresholds were not weakened.
- Three-width screenshots and the final spatial receipt are recorded with
  the release verification below. No visual pass is inferred from syntax.

## Independent review

Both configured Claude authentication routes failed. A separate local Gemma 4
vision review inspected before/after screenshots and the English claim code.
Its response is evidence of an attempted independent review, not a quality
certificate: its arithmetic objection to 73 - 61 = 12 is false; fewer pins than
mapped systems is expected because coverage anchors group systems. Its
clipping allegations were not visible in the supplied screenshots. Its
provenance concern remains useful: the console's examples could link directly
to their systems instead of requiring the reader to use the catalogue.

A second local Qwen3-Coder review inspected the count implementation, CSS diff
and tests. It did not establish a confirmed defect: "other statuses" counts
entries, not distinct status labels; the cited CSS braces are present; numeric
comparison follows the presence check; and update order is immaterial because
every instance is written. Its missing-currency concern prompted an explicit
shape assertion on every shipped stop. Neither local response substitutes for
the outstanding human and fluent-language review.

## Remaining work toward the full objective

This pass does not declare the full presentation impeccable.

- The evidence strip still calls the visit date "Verified" and falls back to
  "just now" for deployment age. Those meanings need a real evidence source.
- Field and pitch copy still need an outcome/provenance audit: followers are
  not daily active users, a pilot target is not a universal delivery promise,
  and a catalogue containing books and research is not all Thai telemetry.
- The style linter found existing type-scale and line-length issues. Its
  sample-data hit must be judged against the explicit fictional-data notice,
  not fixed by removing an honest qualification. No whole-site style pass
  or human usability result is claimed.
- The historical five-country claim still needs an attributed engagement
  list; a locale-consistency test does not establish the fact itself.
- The reading room is unchanged in this pass; its argument and full journey
  suite have not been re-certified by changes to the main hero.
- A real phone or iOS simulator, an uninstructed reader and fluent-language
  review remain unverified. Cloudflare Access for `/admin/` remains the
  owner's action, as documented in AGENTS.md.

## Release verification

Pending final spatial review, deployment and canonical-host verification.
