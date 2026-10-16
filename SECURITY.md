# Security Policy

Axiom X Co., Ltd. takes reports seriously. This repository is a **public portfolio surface**, and the code here is deliberately static — but "static" is a description of the build, not a guarantee about the site.

## Scope

| In scope | Out of scope |
|---|---|
| `public/` and `axiomx/` — the two deployed static sites | Client systems under NDA. Report privately; they are not in this repository |
| `server.mjs` and `lib/` — the **local** Node server | Cloudflare Pages infrastructure and account configuration |
| `tests/`, `.qa/`, `scripts/` — tooling that runs in CI or locally | Third-party services (unpkg, Google Fonts) — report those to their maintainers |
| Deployment workflows in `.github/workflows/` | |

## What this project deliberately does not do

- It publishes **no secrets**. `.env`, `.env.*`, `data/*.sqlite`, and build output are gitignored. The site needs no API key to run.
- The deploy workflows hold only `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID`, stored as repository secrets — never in source.
- The `/admin/` workspace and `/api/admin/*` are behind HTTP Basic auth and are **disabled entirely** when `AXIOM_ADMIN_PASSWORD` is unset. `server.mjs` is a local tool and binds to `127.0.0.1` only. Do not tunnel or reverse-proxy it.
- The Cloudflare deployment is static files only. The Node API and SQLite database are **not** deployed.

## Reporting a vulnerability

Email **non@nonarkara.org**. Please do not open a public GitHub issue for a live vulnerability.

Include, as far as you can:

1. What you found, and which path or file it applies to.
2. How to reproduce it — a URL, or the exact steps.
3. What an attacker gains, and what they need in order to try it.
4. Whether anything sensitive is currently exposed.

You will get an acknowledgement within **3 working days**. We aim to confirm or dismiss a finding within **14 days**, and will tell you when it is fixed. You are welcome to credit yourself in the advisory; we will not publish a CVE-level write-up without your agreement.

Already-fixed and still-relevant issues are welcome — add them to the [security audit](docs/security/cso-audit-2026-10-05.md), which records scope and residual risk in the open.

## For researchers

Good-faith research on the public surfaces is fine. Please:

- Do not test against systems you do not own, and do not use the `/api/*` endpoints to load production or enumerate other users.
- Do not exfiltrate data, persist access, degrade availability, or run automated high-volume scans.
- Do not misrepresent the site as a live intelligence feed. It is a demonstration interface over public map tiles — see the ethics section of the [README](README.md#ethical-use).
- Give reasonable notice before disclosure.

Automated tooling (Semgrep, Trivy) runs weekly and on every pull request via [`.github/workflows/security.yml`](.github/workflows/security.yml). Findings are reported, not blocking. `npm test` runs the security regression suites locally.

## Advisory scope note

An issue in this repository can only affect the two public static sites, unless it is paired with credentials that were obtained from outside this repository. If you found a credential, that is an account incident, not a code issue — report it as urgent and we will rotate first and investigate after.