# Self-hosted fonts (Shanghai / mainland CN)

Google Fonts (`fonts.googleapis.com` / `fonts.gstatic.com`) is often blocked in
mainland China. Axiom loads Thai (and Korean) type from this origin instead.

| Face | Files | Loaded via |
|---|---|---|
| **IBM Plex Sans Thai** (non-looped) | `IBMPlexSansThai-*.woff2` | `fonts.css` `@font-face` → `/fonts/*.woff2` |
| **Noto Sans KR** | `NotoSansKR-*.woff2` | same |
| **Japanese** | — | system stack in `rams.css` (Hiragino / Yu Gothic / Meiryo) |

Weights shipped: 400 / 500 / 600 / 700 (only those used by the site).

Licenses: `OFL-*.txt` (SIL Open Font License 1.1).
