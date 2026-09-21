# Shanghai index restore (PR #2)

## Status (2026-09-21 ICT)

- Sidecar parts `public/index.html.gz.b64.p0` … `p10` are on branch `fix/shanghai-self-host-fonts` (exact bytes from agent box).
- Local roundtrip: join → gunzip → **163380 bytes / ~2190 lines**, matches `/workspace/Axiom/public/index.html`.
- `scripts/fetch-fonts.mjs` prefers unpadded `p{i}` over legacy `p{00}`.
- MCP `create_or_update_file` cannot push the full 163KB `index.html` in one Contents API call from this agent (payload framing), and pushing `.github/workflows/*.yml` returns **404** (token lacks `workflow` scope).

## What Non must do before merge

### Option A — local restore + push (fastest)

```bash
git checkout fix/shanghai-self-host-fonts && git pull
node scripts/fetch-fonts.mjs
wc -l public/index.html   # expect >= 2000
grep -q 'fonts.css?v=20260921b' public/index.html
grep -q 'flood.nonarkara.org' public/index.html
grep -q 'sysStatus.degraded' public/index.html
! grep -q 'fonts.googleapis.com/css' public/index.html
git add public/index.html
git commit -m 'fix(type): restore full Shanghai index (self-host fonts, FloodDash, CDP degraded)'
git push
```

### Option B — Actions workflow

Copy `scripts/restore-shanghai-index.workflow.yml` → `.github/workflows/restore-shanghai-index.yml`, push, then run **workflow_dispatch** (or push to the branch). Merge PR **only after** Actions commits the restored index.

## Do not merge while `public/index.html` is still the stub.
