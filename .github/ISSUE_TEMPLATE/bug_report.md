---
name: Something is broken
about: A defect in one of the two sites, the local server, or the tooling.
title: ''
labels: bug
assignees: ''
---

**Which site?**
<!-- Main pitch (public/), axiomx reading room (axiomx/), local server (server.mjs), or tooling/tests. -->

**Where?**
<!-- A URL on axiom.nonarkara.org, an axiomx entry/anchor, or a file path. -->

**What did you expect, and what happened?**

**Steps to reproduce**
1.
2.
3.

**Environment**
- Browser and version:
- Viewport (if it looks like a layout issue):
- Reproduced locally with `node server.mjs`? yes / no

**Evidence**
<!-- Screenshot or console output, if you have it. For a JavaScript error, the browser console text is the most useful thing you can paste. -->

<!--
Two things that are usually the cause:
  - The main site needs cache-bust strings (?v=YYYYMMDDxx) bumped when CSS/JS change.
  - axiomx derives every number at runtime. If a count looks wrong, it is often a hardcoded
    number that should be derived — say so in the report and we will fix the source, not the number.
-->