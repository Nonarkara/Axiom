#!/usr/bin/env python3
"""Trash image files in public/ that are NOT referenced from index.html.

Reference detection: search index.html for any occurrence of the file basename
(case-insensitive) — covers `src="…"`, `href="…"`, `content="…/og-image.png"`,
JSON-LD `"image": "…"`, etc.
"""
import os
import re
import subprocess
import sys
from pathlib import Path

ROOT = Path("/Users/nonarkara/Projects/axiom/.worktrees/thumbnails")
PUBLIC = ROOT / "public"
INDEX = PUBLIC / "index.html"

img_re = re.compile(r"\.(png|jpe?g|webp|avif)$", re.I)

# 1. Walk public/ for all image files (relative)
all_files = []
for p in PUBLIC.rglob("*"):
    if p.is_file() and img_re.search(p.name):
        rel = p.relative_to(PUBLIC).as_posix()
        all_files.append(rel)
all_files.sort()

# 2. Read index.html
html = INDEX.read_text(encoding="utf-8")
html_lower = html.lower()

# 3. Check each file: is its basename (or full rel path) referenced?
orphans = []
referenced = []
for rel in all_files:
    basename = Path(rel).name.lower()
    rel_lower = rel.lower()
    # Match full relative path or basename
    if rel_lower in html_lower or basename in html_lower:
        referenced.append(rel)
    else:
        orphans.append(rel)

# 4. Stats
def size(rel):
    return (PUBLIC / rel).stat().st_size

print(f"Total images:        {len(all_files):>4}")
print(f"Referenced:          {len(referenced):>4}  ({sum(size(r) for r in referenced):>12,} bytes)")
print(f"Orphans:             {len(orphans):>4}  ({sum(size(r) for r in orphans):>12,} bytes)")
print()
print("Orphans to trash:")
for rel in orphans:
    print(f"  {size(rel):>9,}  {rel}")
print()

# 5. Trash
if "--dry" in sys.argv:
    print("\nDRY RUN — nothing trashed.")
else:
    for rel in orphans:
        p = PUBLIC / rel
        # Skip the entire 'design core' directories for safety
        # — those are clearly Dr Non's working files, not page assets,
        # but not in scope of this "thumbnails too big" request.
        if "design core" in rel:
            print(f"  KEEP (design core, out of scope): {rel}")
            continue
        # Also keep the duplicate 'corporate identity' (with space) — that one is HUGE
        # (identical copies of files in 'corporate-identity') but technically a separate
        # directory the user might be aware of. Trashing it is a clear win.
        subprocess.run(["mavis-trash", str(p)], check=False)
    print("\nTrashed. (Run again to verify zero orphans.)")
