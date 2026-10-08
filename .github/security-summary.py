#!/usr/bin/env python3
"""Write a Markdown job summary from Semgrep and Trivy SARIF.

Secret findings are recorded as file:line and rule id only. Matched values
are never written to the summary.
"""

from __future__ import annotations

import json
import os
import re
from collections import Counter
from pathlib import Path

SEVERITIES = ("CRITICAL", "HIGH", "MEDIUM", "LOW", "INFO", "UNKNOWN")
RANK = {name: index for index, name in enumerate(SEVERITIES)}
TOP_LIMIT = 20

SECRET_IN_RULE = re.compile(
    r"secret|credential|password|private[-_ ]?key|api[-_ ]?key|"
    r"access[-_ ]?key|auth[-_ ]?token|github[-_ ]?pat|\bpat\b|"
    r"aws[-_ ]?(?:access|secret)|jwt",
    re.IGNORECASE,
)
SECRET_IN_TAGS = re.compile(
    r"\bsecrets?\b|\bcredentials?\b|CWE-798|CWE-312|CWE-522",
    re.IGNORECASE,
)
TOKEN_SHAPES = re.compile(
    r"\b(?:AKIA[0-9A-Z]{16}|ASIA[0-9A-Z]{16}|"
    r"ghp_[A-Za-z0-9]{20,}|github_pat_[A-Za-z0-9_]{20,}|"
    r"sk_live_[A-Za-z0-9]{10,}|xox[baprs]-[A-Za-z0-9-]{10,}|"
    r"AIza[0-9A-Za-z\-_]{30,})\b|"
    r"-----BEGIN [A-Z0-9 ]*PRIVATE KEY-----"
)


def load_sarif(path: Path):
    if not path.is_file() or path.stat().st_size == 0:
        return None
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError):
        return None


def severity_of(result: dict, rule: dict) -> str:
    props = result.get("properties") or {}
    rule_props = rule.get("properties") or {}
    tags = [str(tag) for tag in (rule_props.get("tags") or [])]
    tags.extend(str(tag) for tag in (props.get("tags") or []))
    for tag in tags:
        label = tag.strip().upper()
        if label in {"CRITICAL", "HIGH", "MEDIUM", "LOW", "INFO"}:
            return label

    score = props.get("security-severity", rule_props.get("security-severity"))
    if score is not None and str(score).strip() != "":
        try:
            number = float(score)
        except (TypeError, ValueError):
            number = None
        if number is not None:
            if number >= 9:
                return "CRITICAL"
            if number >= 7:
                return "HIGH"
            if number >= 4:
                return "MEDIUM"
            if number > 0:
                return "LOW"
            return "INFO"

    level = (
        result.get("level")
        or (rule.get("defaultConfiguration") or {}).get("level")
        or ""
    ).lower()
    return {"error": "HIGH", "warning": "MEDIUM", "note": "LOW", "none": "INFO"}.get(
        level, "UNKNOWN"
    )


def is_secret(result: dict, rule: dict) -> bool:
    rule_id = str(result.get("ruleId") or "")
    if rule_id.startswith("generic.secrets") or ".secrets." in rule_id:
        return True
    props = result.get("properties") or {}
    rule_props = rule.get("properties") or {}
    tags = " ".join(
        str(tag) for tag in (rule_props.get("tags") or []) + (props.get("tags") or [])
    )
    kind = " ".join(
        str(props.get(key) or rule_props.get(key) or "")
        for key in ("kind", "category", "scanner")
    )
    if SECRET_IN_RULE.search(rule_id) or SECRET_IN_TAGS.search(tags):
        return True
    return "secret" in kind.lower()


def location_of(result: dict) -> tuple[str, int | None]:
    locations = result.get("locations") or []
    if not locations:
        return "unknown", None
    physical = (locations[0].get("physicalLocation") or {})
    artifact = physical.get("artifactLocation") or {}
    uri = str(artifact.get("uri") or "unknown")
    uri = uri.removeprefix("file://")
    for prefix in ("/github/workspace/", "/workspace/"):
        if uri.startswith(prefix):
            uri = uri[len(prefix) :]
    line = (physical.get("region") or {}).get("startLine")
    if isinstance(line, int):
        return uri, line
    return uri, None


def public_message(result: dict, secret: bool) -> str | None:
    if secret:
        return None
    text = str((result.get("message") or {}).get("text") or "")
    text = TOKEN_SHAPES.sub("[redacted]", text)
    text = re.sub(r"\s+", " ", text).strip().replace("`", "'")
    if len(text) > 220:
        text = text[:217] + "..."
    return text or None


def findings_from(data: dict) -> list[dict]:
    findings = []
    for run in data.get("runs") or []:
        driver = (run.get("tool") or {}).get("driver") or {}
        rules = {rule.get("id"): rule for rule in driver.get("rules") or []}
        for result in run.get("results") or []:
            rule = rules.get(result.get("ruleId")) or {}
            secret = is_secret(result, rule)
            path, line = location_of(result)
            findings.append(
                {
                    "severity": severity_of(result, rule),
                    "rule": str(result.get("ruleId") or "unknown"),
                    "file": path,
                    "line": line,
                    "secret": secret,
                    "message": public_message(result, secret),
                }
            )
    return findings


def render_tool(name: str, path: Path) -> list[str]:
    lines = [f"### {name}", ""]
    data = load_sarif(path)
    if data is None:
        lines.append("Scan did not produce SARIF. Counts are unavailable.")
        lines.append("")
        return lines

    findings = findings_from(data)
    counts = Counter(item["severity"] for item in findings)
    lines.append("| Severity | Count |")
    lines.append("| --- | ---: |")
    for name_ in SEVERITIES:
        lines.append(f"| {name_} | {counts.get(name_, 0)} |")
    lines.append("")
    lines.append(f"Total findings: {len(findings)}")
    lines.append("")

    top = [item for item in findings if item["severity"] in {"CRITICAL", "HIGH"}]
    top.sort(key=lambda item: (RANK[item["severity"]], item["file"], item["line"] or 0, item["rule"]))
    lines.append("#### Critical and high")
    lines.append("")
    if not top:
        lines.append("No critical or high findings.")
        lines.append("")
        return lines

    for item in top[:TOP_LIMIT]:
        where = f"{item['file']}:{item['line']}" if item["line"] else item["file"]
        if item["secret"]:
            lines.append(f"- **{item['severity']}** `{where}` `{item['rule']}`")
        else:
            detail = f" — {item['message']}" if item["message"] else ""
            lines.append(f"- **{item['severity']}** `{where}` `{item['rule']}`{detail}")
    remaining = len(top) - TOP_LIMIT
    if remaining > 0:
        lines.append(f"- … and {remaining} more critical or high findings")
    lines.append("")
    return lines


def build_summary() -> str:
    semgrep = Path(os.environ.get("SEMGREP_SARIF", "semgrep.sarif"))
    trivy = Path(os.environ.get("TRIVY_SARIF", "trivy.sarif"))
    parts = [
        "## Security scan (report-only)",
        "",
        "Findings do not fail this workflow. Secret matches are listed as file:line and rule only.",
        "",
    ]
    parts.extend(render_tool("Semgrep OSS", semgrep))
    parts.extend(render_tool("Trivy filesystem", trivy))
    return "\n".join(parts).rstrip() + "\n"


def main() -> None:
    text = build_summary()
    destination = os.environ.get("GITHUB_STEP_SUMMARY")
    if destination:
        with open(destination, "a", encoding="utf-8") as handle:
            handle.write(text)
    else:
        print(text, end="")


if __name__ == "__main__":
    main()
