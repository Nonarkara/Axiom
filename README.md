# Axiom

<p align="center">
  <img src="docs/hero-banner.png" alt="Axiom X design workshop: a designer at the drafting table, civic transit studies, and product-language chrome. The HUD in this image is illustration only." width="1200">
</p>

<p align="center"><em>Design workshop — Axiom X civic product language.<br>
The floating HUD, palettes, and component chrome in this banner are <strong>illustration only</strong>. They are not a live product screenshot and not an operations interface.</em></p>

**Decision systems for cities, governments, and operators.**

[axiom.nonarkara.org](https://axiom.nonarkara.org) · Bangkok · Legal entity: **Axiom X Co., Ltd.** · Reg. 0105569099335

> Most “smart city” work ends as a deck. Ours runs in production.  
> Problem mapped in week one. Something working before any presentation.  
> Every decision tracked from the start.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

## What this is

This repository is the public studio surface for **Axiom X Co., Ltd.** — the landing page and live demonstration at [axiom.nonarkara.org](https://axiom.nonarkara.org). It is a *product demonstration*, not a generic marketing template: a rich dashboard used as civic product language.

Axiom is a Bangkok consultancy that builds decision systems for cities, governments, and operators. The site itself is an Axiom artifact. It proves capacity at a glance: satellite-theatre map, rotating headline, city-node strip, and the systems catalogue underneath. The visual signature *is* the pitch.

**Axiom X design / civic product language** means:

- **Instrument first.** Operators stare at these surfaces. Every mark has to serve a decision, not a moodboard.
- **Hairline geometry.** Thailand-flag blue (`#00247d`) on warm paper (`#faf9f7`). Square corners. No gradients, drop shadows, or pastels on the live site.
- **Earned content only.** Real systems, real stages, real photographs. No stock filler, no “Feature 1 / Feature 2 / Feature 3.”
- **The illusion of real-time is intentional.** The page is static HTML. The map, canvas, and HUD *behave* like an operations room. That behaviour is the methodology made visible.

This repo is **not** the client production stack, **not** a secret intelligence platform, and **not** an `npm` dashboard framework. Production deployments under client NDAs are larger; what you can open from the showcase behaves like them, with advanced modules withheld.

Sibling public work (throw these at an agent when you are actually designing a surface):

| Repo | What it is |
|---|---|
| [Axiom-Design-Core](https://github.com/Nonarkara/Axiom-Design-Core) | The design system. MoMA Law × Golden Section × The Divine Move. Instrument / Editorial / Play. |
| [Rams-NYCTA-Design-Core](https://github.com/Nonarkara/Rams-NYCTA-Design-Core) | Rams’s principles with Vignelli/NYCTA wayfinding. One law: nothing appears that does not serve a decision. |
| [`axiom DNA/`](axiom%20DNA/) | Nested open-source city-dashboard builder (Docker / PostGIS / Grafana patterns). Separate from this landing page. |

---

## Philosophy

Governments don’t have a technology problem. They have a **speed** problem.

The standard public-sector cycle — requirements, committee, vendor RFP, six-month implementation — takes 18 to 36 months before anything works. Cities fall behind. The slide deck that took three months to approve is obsolete before it ships. Axiom does not pitch systems. We build them, on real data, before any presentation. By the time the meeting happens, the working prototype is already in the room.

From [Axiom-Design-Core](https://github.com/Nonarkara/Axiom-Design-Core):

> Beauty is what remains after everything that does not work is gone. Function first. Then subtract. The subtraction is the beauty. One bold move, purely cut, until it looks like it was always there.

**MoMA Law × Golden Section × The Divine Move = Axiom.**

- **MoMA Law** — every edge resolves to another edge. Nothing floats.
- **Golden Section** — find φ in the split. Never a lazy 50/50.
- **The Divine Move** — exactly one bold gesture per surface, the one the function already demanded. Never two. Two is noise.

Four habits underneath every Axiom surface: **balanced, compact, no non-sense, communicative.**

### What we learned by shipping

These are patterns from the field, not slogans. Published because the gap between what governments need and what the market supplies only closes if people share what they figured out.

1. **The vendor said no. We shipped anyway.** A live surface changes the conversation faster than any proposal.
2. **Find the decision first.** Clients ask for dashboards. What they need is one decision that must get faster or better. Skip that and you build a beautiful screen nobody checks after launch week.
3. **Instrument from day one.** Retrofitting measurement onto a live system is nearly impossible. Leave a record.
4. **A single model answers. A council deliberates.** For decisions that matter, disagreement with a transcript is more defensible than one framing.

The site is intentionally static but creates the *illusion* of real-time. That illusion is the value proposition: civic product language you can feel before procurement starts.

---

## Ethical use

Axiom’s public ethics line is the same as the credentials plate on the live site: **operational alignment, not a claim of formal certification.**

We design and deliver against these frameworks. That does **not** imply ISO certification, accreditation, or third-party audit unless independently evidenced and stated.

| Tier | What we align to (practice-based) |
|---|---|
| Governance | [ISO/IEC 42001](https://www.iso.org/standard/81230.html) (AI management), [ISO/IEC 23894](https://www.iso.org/standard/77304.html) (AI risk), [NIST AI RMF](https://www.nist.gov/itl/ai-risk-management-framework) |
| Legal | Thailand [PDPA](https://www.pdpc.or.th/); GDPR as advisory alignment for EU-facing work |
| Ethics | [OECD AI Principles](https://www.oecd.org/en/topics/ai-principles.html), [UNESCO AI Ethics Recommendation](https://www.unesco.org/en/artificial-intelligence/recommendation-ethics) — transparency, fairness, human oversight, safety, robustness, accountable deployment |

**Use this work for civic decision-making.** City operations, transit, flood watch, campus intelligence, open indices, public briefings. The point is a faster, more honest decision — with a human still in the loop.

**Do not use this work as:**

- Surveillance theatre, covert collection, or “we have a feed” claims you cannot source
- A fake live HUD. The **banner** HUD is illustration. The **site** HUD (`#satHud`, Leaflet AUTO TOUR, canvas) is an interface demonstration on public map tiles — not a classified sensor net
- Invented API keys, invented credentials, or invented production secrets. None are required to run this public site, and none belong in a fork’s README
- A claim that uptime, response times, or outcome metrics here are guarantees. The footer states they are case-specific observations
- Impersonation of **Axiom X Co., Ltd.** A fork is a fork. Keep provenance honest. Keep the MIT notice.

If you are a municipality: this landing page shows the language. Production hardening, PDPA process, and access control are a delivery engagement — not a `git clone`.

---

## How it works

No framework. No bundler. No build step. Edit `public/`, commit, push.

| Layer | What actually runs |
|---|---|
| Page | `public/index.html` — one file, the source of truth |
| Behaviour | `public/app.js` + `public/i18n-regional.js` — vanilla JS, seven locales (EN / TH / ZH / KO / JA / VI / TS) |
| Style | `public/rams.css` + `public/hero.css` — Rams-grade system + hero (map, HUD, overlays) |
| Map | Leaflet 1.9.4 from `unpkg.com` — live map with **AUTO TOUR** (Bangkok → Phuket → Middle East → SE Asia) |
| Motion | Canvas 2D (`#heroCanvas`) behind the map |
| Local server | `server.mjs` — Node 22+ (`node:sqlite`), static files from `public/`, `/api/*` for local pageviews and contact |
| Deploy | GitHub Actions → Cloudflare Pages (`axiom`) → [axiom.nonarkara.org](https://axiom.nonarkara.org) (alias: axiom.pages.dev) |
| Local data | `data/axiom.sqlite` — gitignored. Not a production warehouse |

The Cloudflare workflow deploys the `public/` folder as-is. There is no compile step between your editor and the live site. Cache-bust query strings (`?v=YYYYMMDDxx`) on CSS/JS exist because Cloudflare caches; bump them when those files change.

**What is live vs illustrated**

| Surface | Honest status |
|---|---|
| Manga banner (`docs/hero-banner.png`) | Illustration. HUD / UI chrome are drawn, not captured from production. |
| Site hero map + AUTO TOUR + `#satHud` | Real interactive demonstration (public tiles + scripted tour). |
| Systems showcase | Links to working sandbox / public systems. Not the NDA interiors. |
| Admin UI (`public/admin/`) | Internal. Auth required. No passwords are published here. |

Thai first-person on the site is strictly **ผม**. Thai type is non-looped IBM Plex Sans Thai.

---

## How to use or fork

### Run the site locally

You need **Node 22+**. You do not need Docker, Postgres, Redis, or an API key.

```bash
git clone https://github.com/Nonarkara/Axiom.git
cd Axiom
node server.mjs
```

Open [http://127.0.0.1:3000](http://127.0.0.1:3000). You should see the Leaflet map in AUTO TOUR, the canvas behind it, the rotating headline, the satellite HUD, the city-node strip, and the systems grid. If those are gone, something has regressed — stop and read [`AGENTS.md`](AGENTS.md) §4.

`Ctrl+C` stops the server. Operator notes: [`QUICKSTART.md`](QUICKSTART.md). Agent notes: [`AGENTS.md`](AGENTS.md).

There is currently no `package.json` in the tree, so `npm run dev` has nothing to bind to. The process that actually serves the page is `node server.mjs` (listens on `127.0.0.1`, port `PORT` or `3000`).

### Fork without destroying the language

MIT lets you use, copy, modify, and ship. Civic-studio forks still have to be honest:

1. Keep the [LICENSE](LICENSE) file and copyright line (**Axiom X Co., Ltd.**, 2026).
2. Do not collapse `public/index.html` by more than about 30% in one edit. Density is personality.
3. Do not delete the live interactive elements: Leaflet map, AUTO TOUR, canvas, satellite HUD, rotating headline, city-node strip, `[EVENT_ID]` protocol sections.
4. Do not restyle into Tailwind / shadcn / rounded-card templates. That regression has happened here once already (2026-04-22). Last known-good rich HTML: commit `ee756b7`.
5. When you change a string, change it in all seven locales (`public/app.js` + `public/i18n-regional.js`).
6. When you change CSS/JS, bump `?v=` on the matching `<link>` / `<script>` in `public/index.html`.
7. Do not add CI pre-checks that name a specific file. The deploy workflow has **no** pre-checks on purpose.
8. Do not invent secrets, live classified feeds, or certification marks the original does not claim.

This site has a documented history of being overwritten by assistants defaulting to generic templates. If a file is long and “looks chaotic,” that *is* the product. Do not flatten it.

### What to edit

| You want to change… | File |
|---|---|
| Hero copy, sections, systems grid | `public/index.html` |
| Hero / map styling | `public/hero.css` |
| Page system (type, spacing, components) | `public/rams.css` |
| EN / TH / ZH / TS strings | `public/app.js` |
| KO / JA / VI strings | `public/i18n-regional.js` |
| Local HTTP + `/api/*` | `server.mjs` |
| Deploy | `.github/workflows/cloudflare-pages.yml` |

Push to `main` deploys. Forks will not publish to axiom.nonarkara.org unless they wire their own Pages project and secrets — those secrets are **not** in this repository.

---

## Studio record

The live catalogue is on the site. The page itself is the source of truth for what is currently shown.

**Clusters you will see:** COMMAND (operations rooms), INTELLIGENCE (signal and analysis), CIVIC (national platforms and citizen infrastructure), EMERGING (research-grade / preview). Examples already in public: Phuket Ops, HCMCx, Kuching IOC, campus and city control towers, SLIC Index, SCITI, Phuket Smart Bus, FloodDash, ASEAN Smart Cities Network work.

**Stages.** Smart City Summit & Expo, Taipei, 2026 — SLIC Index launched live from the City Vision Stage. GITEX AI Asia, Marina Bay Sands, Singapore, April 2026 — main-stage keynote and a workshop that filled to standing room.

**Founders.** [Dr. Non Arkaraprasertkul](https://www.researchgate.net/profile/Non-Arkaraprasertkul) (systems and story) and [Dr. Poon Thiengburanathum](https://www.researchgate.net/profile/Poon-Thiengburanathum) (infrastructure and delivery). Two people at the table; specialists join by problem, not by standing bench.

**Press (earned):** [GovInsider — vendor said no](https://govinsider.asia/intl-en/article/with-the-vendor-saying-no-thai-civil-servant-built-his-own-tools) · [GovInsider — Innovation-as-a-Service](https://govinsider.asia/intl-en/article/can-innovation-as-a-service-close-the-gap-between-policy-and-implementation) · [Mayors of Europe — SLIC](https://mayorsofeurope.eu/news/they-built-the-index-but-you-build-the-ranking/) · [The ASEAN Magazine](https://theaseanmagazine.asean.org/article/non-arkaraprasertkul-phd/) · [TechNode Global](https://technode.global/2023/01/18/a-smart-city-cannot-exist-without-its-citizens-and-technological-advances-will-foster-stronger-trust-between-citizens-and-institutions-and-encourage-civic-participation-says-dr-non-arkaraprasertkul/)

---

## Credentials

**Trade name:** Axiom  
**Legal entity:** Axiom X Co., Ltd. (บริษัท แอคเซี่ยม เอ็กซ์ จำกัด)  
**Registration:** 0105569099335 · Department of Business Development (DBD) · Thailand  
**Certificate:** [public/axiom-company-registration-certificate.pdf](public/axiom-company-registration-certificate.pdf)

This site and our services are presented under the trade name Axiom. The registered legal entity is Axiom X Co., Ltd. (Thailand).

---

## License

This project is licensed under the **MIT License**. Copyright © 2026 **Axiom X Co., Ltd.** See [LICENSE](LICENSE).

Nested `axiom DNA/LICENSE` (also MIT) is left as that tree’s own copy.

---

## Contact

[axiom.nonarkara.org](https://axiom.nonarkara.org) · [LinkedIn](https://www.linkedin.com/company/axiomthailand/) · non@nonarkara.org

*Axiom X Co., Ltd. · Bangkok, Thailand*
