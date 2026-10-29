# Contributing

Thanks for looking. This repository is the public studio surface for **Axiom X Co., Ltd.** — two live sites plus the documents that govern them.

It is MIT licensed and genuinely forkable. This file exists to make a fork easier, not to protect the original from you.

## Read this first

**[`AGENTS.md`](AGENTS.md) is the contract.** It carries the anti-regression rules, the site architecture, and the non-obvious constraints. Read it before editing anything. It is long because it was written after losing information once.

The single most important thing to know:

> This repository has a documented history of being flattened into a generic rounded-card template by an assistant that read a long file as "chaotic." It happened on 2026-04-22 and cost a session to recover. **If a file is long and looks chaotic, that is the product.** Do not flatten it.

Last known-good rich version of the main page: commit **`ee756b7`**.

## Running it

You need **Node 22+**. No Docker, no Postgres, no Redis, no API key, no install step.

```bash
git clone https://github.com/Nonarkara/Axiom.git
cd Axiom
node server.mjs          # → http://127.0.0.1:3000
```

```bash
npm test                 # security + circuit regression suites
npm run check            # JavaScript syntax check
npm run security:headers # regenerate the hashed CSP in public/_headers
```

Optional visual QA needs Playwright installed separately.

To work on axiomx locally:

```bash
cd axiomx && python3 -m http.server 5311
node .qa/axiomx-journeys.mjs    # 29 journeys — expect 29 PASS, 0 FAIL
```

## Before you open a pull request

1. **Run `npm test`.** It must pass.
2. **Run the axiomx journeys** if you touched `axiomx/`. 29 PASS, 0 FAIL.
3. **Bump the cache-bust strings** (`?v=YYYYMMDDxx`) on any CSS/JS you changed in `public/index.html`. Cloudflare caches; unchanged query strings mean visitors keep the old file.
4. **Change strings in all seven locales** if you changed copy on the main site — `public/app.js` (EN/TH/ZH/TS) and `public/i18n-regional.js` (KO/JA/VI).
5. **Do not add CI pre-checks that name a specific file.** The deploy workflows have no pre-checks on purpose; a file-name assertion is exactly how the 2026-04-22 regression was caught late instead of early.

## House rules for forks

MIT permits use, copy, modification, and distribution. These are the studio's own requests, not licence conditions:

- Keep the `LICENSE` file and the copyright line (**Axiom X Co., Ltd.**, 2026).
- Do not shrink `public/index.html` by more than about 30% in a single edit.
- Do not remove the live interactive elements: Leaflet map, AUTO TOUR, canvas, satellite HUD (`#satHud`), rotating headline, city-node strip, `[EVENT_ID]` protocol sections.
- Do not restyle into Tailwind, shadcn, or rounded-card templates.
- Keep the palette honest. Lyons Blue `#1c4286` and ocher `#e2b540` on warm paper `#faf9f7` for the main site; navy `#00247d` and red `#a51931` for axiomx. Square corners. No decorative gradients, drop shadows, or pastels.
- Do not invent API keys, live feeds, credentials, or certification marks. The site needs none, and a fork's README should not claim them either.

axiomx has its own stricter content rule: **numbers must derive, never be typed.** `systems.length`, `liveCount`, and the cluster breakdown are computed at runtime. A hardcoded count has already drifted four different ways on one page. Do not introduce another.

## Deploying your fork

Pushes to `main` run GitHub Actions, but the forks' workflows will fail without secrets. You need your own Cloudflare Pages project and your own `CLOUDFLARE_API_TOKEN` / `CLOUDFLARE_ACCOUNT_ID`. Those secrets are **not** in this repository, by design.

Point `--project-name` and the build folder at your own project — note that the two workflows deploy different folders (`public/` and `axiomx/`) to different projects.

## Reporting a security issue

Do not open a public issue. See [`SECURITY.md`](SECURITY.md).

## Contact

[axiom.nonarkara.org](https://axiom.nonarkara.org) · non@nonarkara.org