# Shanghai font recovery (PR #2)

## Restored on 2026-10-01

`public/index.html` is the full page again. The intact September 21 recovery
copy was compared against the branch base, then its font/FloodDash/CDP changes
were applied to main at `1c68e9a`, preserving all newer sections and copy.

Recovery source: https://drive.google.com/file/d/1PzOK_20xD6QVsjp4E6WT69CFoVvB-bas/view

The old `public/index.html.gz.b64.p0` … `p10` files fail gzip integrity checks.
They are retained only as historical recovery artifacts. Do not reconstruct the
page from them or activate the obsolete workflow template in `scripts/`.

`node scripts/fetch-fonts.mjs` now only fills missing font binaries. It never
rewrites the HTML. All eight binaries and their OFL licenses are committed, so
Cloudflare can serve this static tree without a font download/build step.

## Local checks

```
node --test scripts/test-shanghai-recovery.mjs
node --check server.mjs
node --check public/app.js
node --check public/i18n-regional.js
node --check scripts/fetch-fonts.mjs
```

The PR remains draft. Browser rendering, map interactions, locale switching,
mobile layout, and complete visual QA still require a browser-capable executor.
No deployment or merge is part of this recovery.
