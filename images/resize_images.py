#!/usr/bin/env python3
"""Make web-sized copies of every image in a folder.

Setup:  pip install pillow
Usage:  python make_placeholders.py path/to/images
        python make_placeholders.py path/to/images --max 1800 --quality 80

Creates a "web" subfolder next to your originals (originals are never touched)
with resized JPEGs, longest side capped at --max px (default 2000).
Never upscales. Prints a ready-to-paste <img> tag for each image.
"""
import argparse
from pathlib import Path
from PIL import Image, ImageOps

EXTS = {".jpg", ".jpeg", ".png", ".webp"}


def main():
    p = argparse.ArgumentParser()
    p.add_argument("folder", help="folder containing your images")
    p.add_argument("--max", type=int, default=2000, help="max px on the longest side")
    p.add_argument("--quality", type=int, default=82, help="JPEG quality")
    a = p.parse_args()

    src = Path(a.folder)
    web = src / "web"
    web.mkdir(exist_ok=True)

    for f in sorted(src.iterdir()):
        if f.suffix.lower() not in EXTS:
            continue
        with Image.open(f) as im:
            im = ImageOps.exif_transpose(im).convert("RGB")
            im.thumbnail((a.max, a.max), Image.LANCZOS)
            w, h = im.size
            name = f"{f.stem}.jpg"
            im.save(web / name, quality=a.quality, optimize=True, progressive=True)

        print(f'<img src="web/{name}" width="{w}" height="{h}" loading="lazy" alt="">')


if __name__ == "__main__":
    main()
