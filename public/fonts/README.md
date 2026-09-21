# Self-hosted fonts (Shanghai / mainland CN)

Google Fonts (`fonts.googleapis.com` / `fonts.gstatic.com`) is often blocked in
mainland China. Axiom loads Thai (and Korean) type from this origin instead.

| Face | Files | Loaded via |
|---|---|---|
| **IBM Plex Sans Thai** (non-looped) | `IBMPlexSansThai-*.woff2` | `fonts.css` `@font-face` → `/fonts/*.woff2` |
| **Noto Sans KR** | `NotoSansKR-*.woff2` | same |
| **Japanese** | — | system stack in `rams.css` |

Weights: 400 / 500 / 600 / 700. Licenses: `OFL-*.txt` (SIL OFL 1.1).

`scripts/fetch-fonts.mjs` downloads these OFL files (idempotent) before Cloudflare
Pages deploy so `/fonts/*.woff2` always exists in the deploy artifact.
