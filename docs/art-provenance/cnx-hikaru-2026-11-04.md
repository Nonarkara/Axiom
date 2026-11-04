---
updated: 2026-11-04
drafted_by: codex/gpt-5
reviewed: false
---

# CNX and Hikaru plate provenance repair

Scope: two entries in `data/catalogue/plates.json` and new `axiomx/art/cnx.webp`.
No generated catalogue, UI, other data, or existing Hikaru image was changed.
Generator, cache-version bump, deployment and rendered-page verification are
deferred to the parent task, as explicitly requested. This closes the missing
CNX asset in the source checkout; it does not claim the live report is closed.

## CNX

- Artist: Edgar Degas.
- Title: A Cotton Office in New Orleans.
- Date: 1873.
- Collection: Musée des Beaux-Arts de Pau.
- Medium: oil on canvas. Physical dimensions: 74 cm high by 92 cm wide.
- Licence: Public domain; Commons `LicenseShortName` and `UsageTerms` both
  return `Public domain`, `Copyrighted=False`, `AttributionRequired=false`.
- Exact source: [Commons file](https://commons.wikimedia.org/wiki/File:Edgar_Germain_Hilaire_Degas_016.jpg),
  page ID 150053; credit: The Yorck Project (2002), DIRECTMEDIA.
- Commons original: 5016 by 3957 pixels, JPEG, 7,508,346 bytes.
- Original SHA-1: `4df479ab95fda6b7446b48315e735c52355ade00`;
  downloaded bytes match the API `imageinfo.sha1` exactly.
- Original SHA-256: `a4adb63fe8e0dc6395cf9558eb6cae6931070152f5dc56f5e16b508ace8b5521`.
- Local derivative: `axiomx/art/cnx.webp`, 1600 by 1263 pixels, 365,988 bytes.
- Local SHA-256: `e5edf42fb9bcd9a2197f442f4daec08dc0ffdbf22fb57786090f4de22b9cb95b`.
- Conversion: libwebp `cwebp` 1.6.0,
  `cwebp -q 85 -resize 1600 0 /tmp/axiom-cnx-degas-original.jpg -o axiomx/art/cnx.webp`.
  Whole image retained; no crop, compositing or generated imagery.
- Catalogue dimensions describe the local derivative, not the source JPEG.

Verification on 2026-11-04 used the Commons API with `action=query`,
`titles=File:Edgar Germain Hilaire Degas 016.jpg`,
`prop=imageinfo|revisions`, `iiprop=url|size|sha1|extmetadata`,
`rvprop=content`, `rvslots=main`, `format=json`, `formatversion=2`.
The returned Artwork wikitext supplies creator, title, date, institution,
`{{Technique|Oil|Canvas}}`, `{{Size|cm|74|92}}` and `wikidata=Q3794660`.
Wikidata API `wbgetentities`, `ids=Q3794660`, `props=labels|claims` corroborates
P170=Q46373 (Degas), P195=Q3330217 (Pau), P571=1873 (year precision),
P186=Q296955 (oil paint) and Q12321255 (canvas).

Binding rationale (interpretation, not museum metadata): the visible sample
inspection, newspaper reading and accounts place independent evidence in one
operating room. CNX similarly reads weather, traffic, fire and forecast sources
together. This is a mechanics/concept binding, not a claim about New Orleans
resembling Chiang Mai or about an artwork literally depicting a source grid.
The previous invented `Chiang_Mai_city_view.jpg` claim is removed.

## Hikaru Non Go

- Artist: Zhou Wenju.
- Display title: Playing Go Under Double Screens (detail).
- Date: 942–961; Commons `DateTimeOriginal` returns `between 942 and 961`.
- Collection: Palace Museum, Beijing (not National Palace Museum, Taipei).
- Medium/support: silk.
- Exact source: [Commons file](https://commons.wikimedia.org/wiki/File:Zhou-Wenju-Go-Players.jpg),
  page ID 7149369; credit as returned: `ArtDauly.com`.
- Licence: Public domain; `LicenseShortName=Public domain`, `UsageTerms=Public domain`,
  `Copyrighted=False`, `AttributionRequired=false`; file wikitext uses `PD-old`.
- Original: 792 by 640 pixels, JPEG, 138,858 bytes.
- Original SHA-1: `06e6bf8a6bddc326d63e16059b920bfbb6b14b1d`;
  downloaded bytes match the API `imageinfo.sha1` exactly.
- Original SHA-256: `41628b3990d3e4690d76ebf4d80a1923c293028b38a618fa5294a294471b1a43`.
- Existing local `axiomx/art/hikaru-non-go.webp`: 792 by 640 pixels,
  145,464 bytes, preserved byte-for-byte.
- Local SHA-256: `76a121a587b9790a8bcb12760559feddef7cc0136ced50f420b4978a3789ace4`.

The same Commons API query parameters above, with
`titles=File:Zhou-Wenju-Go-Players.jpg`, verify artist, date, dimensions and PD.
This file's description is `Chinese Go-players (Chong Ping Hui Qi Tu)`;
the normalized display title comes from the artwork, not `ObjectName` (which
is just the filename). Commons category `Playing Go under Double Screens`
has `pageprops.wikibase_item=Q10563863`. The Wikidata API returns that artwork's
English title, P170=Q835924 (Zhou Wenju), P195=Q2047427 (Palace Museum) and
P186=Q37681 (silk, qualified as painting support). Its P571 is century-precision
950; the narrower 942–961 range comes from Commons, not that Wikidata date.
See [artwork](https://www.wikidata.org/wiki/Q10563863),
[museum](https://www.wikidata.org/wiki/Q2047427) and
[silk](https://www.wikidata.org/wiki/Q37681).

The Commons original and the existing WebP were visually inspected side by
side: same players, board, nested screens, inscriptions and framing. No claim
of identical encoded bytes is made. The screenshot label was false; the PD
label is supported for this historical artwork, not for a product screenshot.

## Focused verification

- Before edit: `cnx.webp` did not exist; Hikaru was 145,464 bytes at 792 by 640.
- Both Commons downloads match API SHA-1; both local WebPs decode and were
  visually inspected. CNX is the full Degas composition, not another file of it.
- Neither selected work is assigned elsewhere in the current source catalogue.
  Artist totals after repair: Edgar Degas 2; Zhou Wenju 1 (both within 3).
  This is a scoped check, not a claim that unrelated historical plates pass.
- JSON comparison against HEAD must show only `cnx` and `hikaru-non-go` changed;
  all other plate records and Hikaru image bytes remain unchanged.
- Full catalogue parity/plate journeys are intentionally not certified before
  the parent regenerates the catalogue. No UI or spatial pass is claimed.
