# Self-hosted fonts (Shanghai / mainland CN)

Google Fonts is often blocked in mainland China. Axiom loads Thai (and Korean)
type from this origin instead.

| Face | Files | Loaded via |
|---|---|---|
| **IBM Plex Sans Thai** (non-looped) | `IBMPlexSansThai-*.woff2` | `fonts.css` `@font-face` → `/fonts/*.woff2` |
| **Noto Sans KR** | `NotoSansKR-*.woff2` | same |
| **Japanese** | — | system stack in `rams.css` |

Weights: 400 / 500 / 600 / 700. Licenses: `OFL-*.txt` (SIL OFL 1.1).
