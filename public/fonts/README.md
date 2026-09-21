# Self-hosted fonts (Shanghai / mainland CN)

Google Fonts (`fonts.googleapis.com` / `fonts.gstatic.com`) is often blocked in
mainland China. Axiom loads Thai type from this origin instead of Google.

| Face | How loaded |
|---|---|
| **IBM Plex Sans Thai** (non-looped, OFL) | `fonts.css` → `fonts-thai-{400,500,600,700}.css` data-URI WOFF2 |
| **Korean / Japanese** | System faces via `rams.css` stack |

Source WOFF2 under `fonts/` for regeneration. Licenses: `OFL-*.txt`.
