# Self-hosted fonts (China tofu fix)

- **Thai:** IBM Plex Sans Thai (non-looped) 400/500/600/700 — never Sarabun / Looped
- **KR:** Noto Sans KR 400/500/600/700
- **JP / ZH / Latin:** system stacks in `rams.css` (PingFang / YaHei / Hiragino / Helvetica)

Loaded via `public/fonts.css` (no `fonts.googleapis.com`).
At deploy, `scripts/fetch-fonts.mjs` fills any missing `*.woff2` from jsDelivr OFL copies.
