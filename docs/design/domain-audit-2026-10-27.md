# Catalogue domain audit

## Result

Both sites linked to 14 systems through Pages hostnames, and to the blog through
another Pages hostname. All 15 already have working `nonarkara.org` addresses.
No new CNAME is required. No DNS record, custom-domain binding, Worker, or other
project was created or modified.

The two catalogues, main site's hero/map links, and both blog links now use the
verified addresses below. Paths and fragments are preserved. Styles, text,
catalogue order/counts, artwork, seven-language main-site content, map, tour,
canvas, and the axiomx-only e-book extension are unchanged. Script cache versions
were bumped. Regenerating security headers produced no policy change.

| System | Previous host | Verified destination |
| --- | --- | --- |
| FloodDash | flood-ami.pages.dev | https://flood.nonarkara.org/ |
| Laem Chabang | lcbcity.pages.dev | https://lcb.nonarkara.org/dashboard |
| Muang Thong Thani | mtt-super-dashboard-v2.pages.dev | https://mtt.nonarkara.org/ |
| Chonburi | chonburi-control-tower.pages.dev | https://chonburi.nonarkara.org/ |
| KMITL | kmitl-control-tower.pages.dev | https://kmitl.nonarkara.org/ |
| Yala | yala-control-tower.pages.dev | https://yala.nonarkara.org/ |
| Bangkok IOC | bangkok-ioc.pages.dev | https://bangkok.nonarkara.org/places |
| DayTraders | siam-markets.pages.dev | https://markets.nonarkara.org/ |
| Horizon 45 | horizon-field-lab.pages.dev | https://horizon.nonarkara.org/ |
| Ekkasarn | ekkasarn-ai.pages.dev | https://ekkasarn.nonarkara.org/ |
| Time Pop | watch-1de.pages.dev | https://watch.nonarkara.org/ |
| Luma/house | luma-house.pages.dev | https://designon.nonarkara.org/ |
| O3 | otop.pages.dev | https://otop.nonarkara.org/ |
| Super League | superleague-xxd.pages.dev | https://superleague.nonarkara.org/#/lobby |
| Blog | nonarkara-blog.pages.dev | https://blog.nonarkara.org/ |

The Luma/house application itself declares `designon.nonarkara.org` canonical.
Existing aliases `luma`, `day`, and `h45` also responded, but the catalogue uses
one chosen address per system. External GitHub, social, and institutional links
are not provider-domain application URLs and were left alone. No `pages.dev` or
`workers.dev` reference remains in the textual deployed files of either site.

## Evidence and limits

Wrangler's authenticated Pages project inventory established the real project
aliases rather than deriving them from product names: the Flood project serves
`flood-ami.pages.dev`, Watch serves `watch-1de.pages.dev`, and Super League serves
`superleague-xxd.pages.dev`. The custom hosts were fetched over normal verified
HTTPS, with each exact route compared against its Pages counterpart. All 15
pairs returned 200 and identical SHA-256 HTML hashes.

DNS-record access with the current Wrangler OAuth credentials returns 403; Pages
and zone metadata reads work. No record needed changing, so no DNS-write attempt
or permission expansion was made. Credentials never entered source or evidence.

**Chonburi routing is already configured:** its old Pages domain binding reports
`deactivated`, but the zone's Workers Routes API confirms the existing route
`chonburi.nonarkara.org/*` points to `chonburi-proxy`. The custom hostname serves
the correct CTM-01 application, byte-for-byte equal to its Pages origin. The old
Pages binding is therefore not the only delivery path. Neither the proxy nor the
deactivated Pages binding was changed; no replacement CNAME is needed.

`npm run qa:domains` repeats the 15 origin comparisons and requires the exact
final custom host, path, and query. Add `-- --browser` to verify rendered links in
both catalogues, six changed map stops, and both blog links at 390/1024/1440, plus
Super League's `#/lobby` browser route. `AXIOM_URL` and `AXIOMX_URL` select local
or deployed surfaces. The migration manifest is `.qa/catalogue-domains.json`.

Independent review found a verifier gap: matching SPA HTML and any custom-domain
hostname could conceal a redirect to a different route. The audit now checks the
exact destination. The executable falsifier in `tests/domain-audit.test.mjs`
proves matching HTML on either a wrong host or `/dashboard` redirected to `/`
fails. The valid fixture passes. Browser verification handles the hash separately.

Local checks: 60 unit tests passed, 29 JavaScript files syntax checked, plate
discipline 10 passed, thumbnail band checks 8 passed, and reading-room journeys
191 passed. Rendered catalogue/map/blog links passed at all three widths, and
the live Super League browser retained its lobby fragment. Independent review
closed the verifier finding after the executable falsifier passed, with no new
confirmed findings. Before-release live geometry
was captured at 390x844, 1024x900 and 1440x900 in
`/tmp/axiom-domains-before-20261027/`. This is a destination-only change, not a
composition redesign; no geometry baseline was relaxed or re-recorded.

## Release

Commit `245d4bc` was pushed to main. Both Cloudflare Pages workflows succeeded:
main site run `40509192996`, reading room run `40509193145`. The project inventory
confirmed the actual aliases `axiom-9ye.pages.dev` and `axiomx-1d4.pages.dev`.
Each alias, then each canonical custom host, passed three consecutive SHA-256
matches for the HTML and changed scripts using disposable probe cache keys.

On the canonical live hosts, `qa:domains -- --browser` passed all 15 origin
comparisons, all 14 changed catalogue destinations on both sites, six map stop
destinations, both blog links, and Super League's lobby fragment at the three
declared widths. The live reading-room suite passed 191 checks with zero failures.
Evidence is in `/tmp/axiom-domain-audit-live-20261027.json` and its `.browser.json`.

The post-release MSH report is in `/tmp/axiom-domains-after-20261027/`. At all
three widths, both surfaces retained the same chrome measurements as before:
main 50/50/58px, reader 44/44/44px. Both had zero horizontal overflow and zero page
errors. Screenshots were captured; no composition change was intended or claimed.

An additional sweep checked 64 primary catalogue/e-book destinations under
`nonarkara.org`: all resolved in DNS. Two pre-existing service faults were found,
not missing custom domains: `cdp.nonarkara.org` returned HTTP 502 twice, and
`news.nonarkara.org` timed out at 10 seconds and again at 30 seconds. Their links
and infrastructure were not changed. These endpoints require a separate service
investigation, not a replacement CNAME. Results are in
`/tmp/axiom-all-domains-20261027.json`.

A hostname sweep across the deployed HTML, catalogue, map, e-book extension and
reader found 71 distinct linked `nonarkara.org` hosts, including secondary
editions and institutional links. All resolved. Its evidence is
`/tmp/axiom-all-linked-dns-20261027.json`.

No unresolved missing custom domain was found among the 15 migrated links.
