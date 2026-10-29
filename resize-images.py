#!/usr/bin/env python3
"""Resize and re-encode used images to match their display context.

Targets by CSS class:
  - .sys-cell__shot, .probono-card__shot, .stage__gallery img → 16:10 or 4:3,
    displayed up to ~400px wide on desktop. Source 800px wide is plenty for 2x retina.
  - .brand-preview img → 4:3, displayed ~320px. Source 600px is plenty.
  - Everything else (press photos etc) → cap at 1200px (full-bleed sections).

The script NEVER widens an image. If the source is already ≤ target, it's left
untouched (we just re-optimize the encoding).
"""
import os
import re
import sys
from pathlib import Path
from PIL import Image, ImageOps

ROOT = Path("/Users/nonarkara/Projects/axiom/.worktrees/thumbnails/public")

# Target widths by display context
THUMB_W = 800       # .sys-cell__shot, .probono-card__shot, .stage__gallery
BRAND_W = 600       # .brand-preview
PRESS_W = 1200      # full-bleed press photos

# File extension → format + quality
JPEG_QUALITY = 82
PNG_OPTIMIZE = True

# (path, target_max_w)
JOBS = [
    # --- screenshots/ (thumbnails) ---
    ("screenshots/flood-ami.png", THUMB_W),
    ("screenshots/sikhio-dashboard.jpg", THUMB_W),
    ("screenshots/lcb-new.png", THUMB_W),
    ("screenshots/hcmcx-dashboard.jpg", THUMB_W),
    ("screenshots/mtt-dashboard.jpg", THUMB_W),
    ("screenshots/chula.jpg", THUMB_W),
    ("screenshots/chonburi-control-tower.png", THUMB_W),
    ("screenshots/kmitl.jpg", THUMB_W),
    ("screenshots/yala.png", THUMB_W),
    ("screenshots/cityhub-split-satellite.jpg", THUMB_W),
    ("screenshots/globalmonitor-new.png", THUMB_W),
    ("screenshots/daytraders-new-v2.png", THUMB_W),
    ("screenshots/sciti-new.png", THUMB_W),
    ("screenshots/nsp-v2-prototype.png", THUMB_W),
    ("screenshots/tkcx.jpg", THUMB_W),
    ("screenshots/secondbrain_obsidian.jpg", THUMB_W),
    ("screenshots/horizon45-new.png", THUMB_W),
    ("screenshots/ascn-director.png", THUMB_W),
    ("screenshots/ekkasarn-new.png", THUMB_W),

    # --- showcase/ (thumbnails) ---
    ("showcase/nst.jpg", THUMB_W),
    ("showcase/airdash-thailand.png", THUMB_W),
    ("showcase/bkk-atlas.png", THUMB_W),
    ("showcase/bkk-culture.jpg", THUMB_W),
    ("showcase/day2.jpg", THUMB_W),
    ("showcase/geo.jpg", THUMB_W),
    ("showcase/ikigai-finance-engine.png", THUMB_W),
    ("showcase/non-gamer.png", THUMB_W),
    ("showcase/nonwriter.png", THUMB_W),
    ("showcase/drnon-digests.png", THUMB_W),
    ("showcase/nonscrape.png", THUMB_W),
    ("showcase/timepop.png", THUMB_W),
    ("showcase/luma-house.jpg", THUMB_W),
    ("showcase/openclaw-setup.jpg", THUMB_W),
    ("showcase/20-minutes-with-dr-non.jpg", THUMB_W),
    ("showcase/scth-v2.png", THUMB_W),

    # --- images/ (press/team photos) ---
    ("images/phuket-dashboard.jpg", THUMB_W),
    ("images/ai-council.jpg", THUMB_W),
    ("images/flooddash-blueprint.png", THUMB_W),
    ("images/taipei-stage.jpg", PRESS_W),
    ("images/taipei-slic-live.png", PRESS_W),
    ("images/taipei-networking.jpg", PRESS_W),
    ("images/singapore-workshop-attentive.jpg", PRESS_W),
    ("images/singapore-mainstage.jpg", PRESS_W),
    ("images/singapore-workshop.jpg", PRESS_W),
    ("images/leap-east-panel-speakers.png", PRESS_W),
    ("images/leap-east-group-selfie.png", PRESS_W),
    ("images/leap-east-orbital-wide.png", PRESS_W),

    # --- photos/products/ (thumbnails) ---
    ("photos/products/Kuching Dashboard.png", THUMB_W),
    ("photos/products/MEM.png", THUMB_W),
    ("photos/products/Phuket Smart Bus.png", THUMB_W),
    ("photos/products/SLIC Index.png", THUMB_W),

    # --- brand previews (4:3 cards, 3 columns on desktop) ---
    ("corporate-identity/axiom-brand-01-cover.png", BRAND_W),
    ("corporate-identity/axiom-brand-02-logo.png", BRAND_W),
    ("corporate-identity/axiom-brand-03-colors.png", BRAND_W),
    ("corporate-identity/axiom-brand-04-typography.png", BRAND_W),
    ("corporate-identity/axiom-brand-05-layout.png", BRAND_W),
    ("corporate-identity/axiom-brand-06-applications.png", BRAND_W),
    ("corporate-identity/axiom-brand-07-photography.png", BRAND_W),
    ("corporate-identity/axiom-brand-08-voice.png", BRAND_W),
]

# Skip resize if the source is already at or below target width AND file is
# under 200KB (no point re-encoding a small already-small image).
SKIP_IF_SMALL = 200 * 1024
SKIP_IF_NARROW = True


def process(rel_path: str, target_w: int) -> tuple[bool, int, int]:
    """Returns (changed, before_bytes, after_bytes)."""
    src = ROOT / rel_path
    if not src.exists():
        return (False, 0, 0)
    before = src.stat().st_size
    try:
        img = Image.open(src)
    except Exception as e:
        print(f"  SKIP {rel_path}: open failed: {e}")
        return (False, before, before)

    w, h = img.size
    fmt = img.format

    # Skip if already small + narrow
    if SKIP_IF_NARROW and w <= target_w and before <= SKIP_IF_SMALL:
        return (False, before, before)

    # Only downscale (never up)
    if w > target_w:
        # Pillow's thumbnail() preserves aspect and is the right call here
        # Use LANCZOS for high-quality downscale
        img = img.convert("RGB") if fmt == "JPEG" else img.convert("RGBA" if "A" in img.mode or img.mode == "P" else "RGB")
        img.thumbnail((target_w, 10_000), Image.Resampling.LANCZOS)

    # Re-encode
    out_path = src  # overwrite in place
    if fmt == "JPEG" or rel_path.lower().endswith((".jpg", ".jpeg")):
        if img.mode != "RGB":
            img = img.convert("RGB")
        img.save(out_path, format="JPEG", quality=JPEG_QUALITY, optimize=True, progressive=True)
    elif fmt == "PNG" or rel_path.lower().endswith(".png"):
        if img.mode == "P":
            img = img.convert("RGBA" if "transparency" in img.info else "RGB")
        img.save(out_path, format="PNG", optimize=PNG_OPTIMIZE)
    else:
        # Unknown format — leave alone
        return (False, before, before)

    after = out_path.stat().st_size
    return (after < before, before, after)


def main():
    total_before = 0
    total_after = 0
    changed = 0
    skipped = 0
    missing = 0
    for rel, w in JOBS:
        ok, b, a = process(rel, w)
        if b == 0:
            missing += 1
            print(f"  MISS {rel}")
            continue
        if ok:
            changed += 1
            ratio = (1 - a / b) * 100 if b else 0
            print(f"  {b:>9,} → {a:>9,}  {ratio:>5.1f}%  {rel}")
        else:
            skipped += 1
        total_before += b
        total_after += a
    print()
    print(f"Changed: {changed}   Skipped (already small): {skipped}   Missing: {missing}")
    print(f"Total:  {total_before:>12,} → {total_after:>12,}  (saved {total_before-total_after:>10,} bytes / {(1-total_after/total_before)*100:.1f}%)")


if __name__ == "__main__":
    main()
