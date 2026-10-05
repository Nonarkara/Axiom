# Hero Project Footprint

## Design Receipt

Person: a prospective city or agency operator opening a shared link, usually on a
phone. Outcome: see the breadth of actual systems, identify a familiar place, and
open its working dashboard. Obstacle: four abstract theatres hid most locations
and placed national or regional watches at apparently local installation sites.

Chosen arrangement: retain the full-bleed map and four theatre shortcuts, with a
native location selector and a geographic tour. Rejected arrangement: add eighteen
tiles to the hero; that would obscure the map and push the first proof below the fold.
Map, canvas, HUD, rotating headline, four shortcuts, pause/resume, event sections,
catalog, and Palette theme are preserved.

The curated `public/footprint.js` joins project destinations to geographic scope.
The invariant is that every mapped system belongs to a defined stop, and every
destination is present in the catalog. This is project geography, not a live feed
or a claim that every watched region commissioned an installation.

## Evidence And Meaning

- City Hub's existing catalog copy explicitly includes Chiang Mai. Its pin opens
  the shared City Hub, not an invented dedicated Chiang Mai URL.
- Catalog destinations identify Lopburi, Sikhio, Bangkok, Chulalongkorn University,
  KMITL, Muang Thong Thani, Chonburi, Laem Chabang, Nakhon Si Thammarat, Phuket,
  Yala, Malaysia, Kuching, and Ho Chi Minh City.
- National coverage groups FloodDash, AirDash, SCITI, and Forest Carbon Thailand.
- [Kuching IOC](https://kuching.nonarkara.org/) identifies Greater Kuching and
  Padawan. [MEM](https://mem.nonarkara.org/) identifies Middle Eastern monitoring.
- Dashed frames are coarse geographic extents, not authoritative boundaries or
  service guarantees. Malaysia has separate Peninsula and Borneo extents.
- THB, MYR, and VND identify local currency contexts; no exchange values, revenue,
  transaction support, or new country-delivery counts are invented.
- The ambiguous name "Juman City" requires an exact destination from the owner.
  Ho Chi Minh City and Muang Thong Thani are independently evidenced and included.

Paper and ocher mark selected geography; existing blue remains the action colour.
Unselected pins stay present and reveal their names on hover or focus. The selected
scope names its systems in the project brief. Selecting a pin or a location pauses
the tour; the brief's link opens the dashboard. Reduced motion starts in Hold.

## Verification

Verified locally on 2026-10-06:

- 18 native tests passed, including a complete 18-stop loop, persistent 20-pin
  count, exact project selection, pause/resume, and reduced-motion Hold.
- Browser exercised every destination, observed automatic tour progression,
  and activated the Chiang Mai pin with Enter after adding explicit key handling.
- All seven locale switches retained matching scope, location options, and links.
- 1280px desktop and 390px/360px phone widths had no page, HUD, or brief overflow.
  Phones reserve a clear map window before the copy instead of burying the pins.
- Malaysia renders two separate coarse coverage frames. No catalog, map, canvas,
  protocol section, or original theatre shortcut was removed.

Deployment must additionally verify live versioned assets and actual map pixels.
Human usability, physical-device testing, and fluent-reader review remain unverified.
