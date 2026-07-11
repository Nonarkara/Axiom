# Contributing to Axiom Framework

Thank you for your interest in contributing to the Axiom Framework! This project exists to democratize municipal intelligence systems, and every contribution—from code to documentation to municipality profiles—makes a tangible difference in how cities operate.

---

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Ways to Contribute](#ways-to-contribute)
- [Development Setup](#development-setup)
- [Pull Request Process](#pull-request-process)
- [Commit Message Guidelines](#commit-message-guidelines)
- [Documentation Standards](#documentation-standards)
- [Testing](#testing)
- [Release Process](#release-process)

---

## Code of Conduct

This project adheres to a simple standard: **be constructive**. Whether you are filing an issue, submitting a pull request, or engaging in discussion:

- Assume good intent from all participants
- Focus on the technical merits of proposals
- Provide actionable feedback with specifics
- Respect that contributors may be operating under municipal IT constraints

Harassment, discriminatory language, or deliberate disruption will not be tolerated.

---

## Ways to Contribute

### Municipality Profiles

The most valuable contributions for new users are **municipality deployment profiles**. If you have deployed or attempted to deploy the Axiom Framework for a municipality:

1. Document the municipality characteristics (population, area, IT capacity)
2. List which data sources were actually available vs. theoretically available
3. Note any Thailand-specific regulatory hurdles encountered
4. Share actual costs and timeline vs. initial estimates
5. Submit as a pull request adding a new section to `docs/THAILAND_MUNICIPALITIES.md`

### Data Source Connectors

Thailand's open data landscape evolves continuously. New APIs appear, endpoints change, and authentication mechanisms are updated.

To contribute a new data source connector:

1. Create a new Python poller in `examples/thailand-dashboard/api_queries/`
2. Include proper error handling, retry logic, and rate limiting
3. Document the source in `docs/DATA_SOURCES.md` with all metadata fields
4. Provide a sample response in comments for future maintainers

### Dashboard Templates

Grafana and Metabase configurations that solve real municipal problems:

1. Export dashboard JSON from Grafana (or SQL from Metabase)
2. Remove any sensitive data or credentials
3. Parameterize municipality IDs and date ranges
4. Add to `examples/thailand-dashboard/grafana/` or `examples/thailand-dashboard/metabase/`

### Bug Reports

When filing an issue, please include:

- **Deployment tier**: Small, Medium, or Large
- **Operating system**: Ubuntu 22.04, Debian 12, etc.
- **Docker versions**: `docker --version` and `docker compose version`
- **Reproduction steps**: Exact commands that triggered the issue
- **Expected behavior**: What you expected to happen
- **Actual behavior**: What actually happened, including full error logs
- **Municipality context**: Which municipality profile this relates to, if any

### Feature Requests

Feature requests are welcome but are evaluated against the project principle: **something working before any presentation**. Requests for features that add complexity without operational value will be deprioritized.

Preferred format:

- **Problem statement**: What operational problem does this solve?
- **Current workaround**: How are you solving this today?
- **Proposed solution**: Specific implementation approach
- **Impact**: Which municipalities or use cases benefit?

---

## Development Setup

### Prerequisites

- Docker 25.0+ and Docker Compose 2.24+
- Python 3.10+ (for poller development)
- PlatformIO (for ESP32 firmware development)
- Node.js 18+ (for frontend development)

### Local Development Environment

```bash
# Clone the repository
git clone https://github.com/your-org/axiom-framework.git
cd axiom-framework

# Create a development .env file
cp .env.example .env.dev
# Edit .env.dev with local credentials

# Start only the database and essential services
 docker compose -f docker-compose.yml up -d postgres redis mosquitto

# Install Python dependencies for poller development
pip install -r examples/thailand-dashboard/api_queries/requirements.txt

# Run tests
 pytest tests/
```

### Code Style

- **Python**: PEP 8, 4-space indentation, max line length 100
- **SQL**: Lowercase keywords, UPPERCASE data types, aligned columns
- **Bash**: shellcheck compliant, `set -euo pipefail` by default
- **C++ (ESP32)**: Arduino style, 4-space indentation

---

## Pull Request Process

1. **Fork the repository** and create a feature branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes** with clear, focused commits following the [commit message guidelines](#commit-message-guidelines).

3. **Test your changes**:
   - For Docker changes: verify ` docker compose up -d` succeeds
   - For SQL changes: test against PostgreSQL 15+ with PostGIS and TimescaleDB
   - For Python changes: ensure scripts run without errors
   - For documentation: verify all links work and Markdown renders correctly

4. **Update documentation** if your change affects deployment, architecture, or data sources.

5. **Submit the pull request** with:
   - Clear title describing the change
   - Reference to any related issues (`Fixes #123`)
   - Summary of what changed and why
   - Testing performed

6. **Address review feedback** promptly. Maintainers aim to review within 5 business days.

---

## Commit Message Guidelines

Follow conventional commits for clear history and automated changelog generation:

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types**:

| Type | Use for |
|------|---------|
| `feat` | New features or capabilities |
| `fix` | Bug fixes |
| `docs` | Documentation changes only |
| `style` | Code style changes (formatting, no logic change) |
| `refactor` | Code restructuring without feature changes |
| `perf` | Performance improvements |
| `test` | Adding or correcting tests |
| `chore` | Maintenance tasks (deps, CI, build) |

**Scopes**:

| Scope | Area |
|-------|------|
| `db` | Database schema, migrations |
| `grafana` | Grafana dashboards and provisioning |
| `metabase` | Metabase questions and configurations |
| `poller` | Data ingestion scripts |
| `iot` | ESP32 firmware, ThingsBoard |
| `docs` | Documentation files |
| `deploy` | Docker, deployment scripts |

**Examples**:

```
feat(poller): add GISTDA flood radar ingestion

Implements REST API polling for GISTDA's flood monitoring
service with GeoJSON geometry parsing and severity classification.

Fixes #42
```

```
fix(db): correct TimescaleDB hypertable chunk interval

Changes telemetry chunk interval from 1 week to 1 day for
better query performance on small-tier deployments.

Closes #55
```

---

## Documentation Standards

All documentation contributions should follow these standards:

- **Be specific**: "Some municipalities" is not helpful. Name them.
- **Include costs**: Every deployment document should include actual or estimated costs in THB.
- **Provide context**: Explain *why* a decision was made, not just *what* was done.
- **Use tables**: Comparison data is clearer in tables than prose.
- **Link aggressively**: Cross-reference related documents everywhere.
- **Thai script**: When referencing Thai places, names, or official terms, include Thai script in parentheses on first mention.

---

## Testing

### Automated Tests

The project uses pytest for Python components:

```bash
# Run all tests
 pytest tests/

# Run with coverage
 pytest --cov=. tests/

# Run specific test file
 pytest tests/test_pollers.py
```

### Manual Testing Checklist

Before submitting a PR that affects deployment:

- [ ] ` docker compose up -d` starts all services without errors
- [ ] PostgreSQL extensions are created (check `\dx`)
- [ ] Grafana loads at `http://localhost:3000`
- [ ] Metabase loads at `http://localhost:3002`
- [ ] ThingsBoard loads at `http://localhost:8080`
- [ ] MQTT broker accepts connections on port 1883
- [ ] Kong Admin API responds on port 8001
- [ ] Sample poller scripts run without errors (with mock data if needed)

---

## Release Process

Releases follow semantic versioning (MAJOR.MINOR.PATCH):

- **MAJOR**: Incompatible architectural changes requiring re-deployment
- **MINOR**: New features, new municipality profiles, new data sources
- **PATCH**: Bug fixes, documentation improvements, dependency updates

Release checklist for maintainers:

1. Update version in `docker-compose.yml` image tags
2. Update CHANGELOG.md with all changes since last release
3. Verify all tests pass
4. Create a Git tag: `git tag -a v1.2.3 -m "Release v1.2.3"`
5. Push tag: `git push origin v1.2.3`
6. Create GitHub release with release notes

---

## Questions?

If you have questions not covered here:

- Open a [GitHub Discussion](https://github.com/your-org/axiom-framework/discussions) for general questions
- Join the community chat (link TBD)
- Contact maintainers directly for sensitive security issues

---

*Built by contributors who believe operations rooms should have real data, not PowerPoint decks.*
