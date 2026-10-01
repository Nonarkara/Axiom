# Self-hosted fonts (China tofu fix)

- **Thai:** IBM Plex Sans Thai (non-looped) 400/500/600/700 — never Sarabun / Looped
- **KR:** Noto Sans KR 400/500/600/700
- **JP / ZH / Latin:** system fallbacks in `font-stack.css`, loaded after `rams.css`

Loaded via `public/fonts.css`; the landing page makes no Google Fonts requests.
All eight WOFF2 files are committed and served directly by the static deploy.
`node scripts/fetch-fonts.mjs` can fill missing binaries from pinned jsDelivr
package versions. It never changes the page. OFL license files are included here.
