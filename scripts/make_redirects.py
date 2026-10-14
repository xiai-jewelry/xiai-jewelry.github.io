#!/usr/bin/env python3
"""Fill a folder with redirect pages that send every old URL to the same path on the new site.

Usage: python3 scripts/make_redirects.py <old-site-folder> [new-site-url]
Run after scripts/build_site.py; the page list is taken from the built HTML files.
"""
import html
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
out = Path(sys.argv[1]).resolve()
new = (sys.argv[2] if len(sys.argv) > 2 else "https://xiai-jewelry.github.io").rstrip("/")


def page(path):
    url = new + path
    return f"""<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>XIAI JEWELRY has moved</title>
<meta name="robots" content="noindex">
<link rel="canonical" href="{html.escape(url)}">
<meta http-equiv="refresh" content="0; url={html.escape(url)}">
<script>location.replace({new!r} + location.pathname.replace(/\\.html$/, '').replace(/\\/index$/, '/') + location.search + location.hash);</script>
</head>
<body style="font-family:system-ui,sans-serif;padding:48px 24px;text-align:center">
<p>XIAI JEWELRY has moved to <a href="{html.escape(url)}">{html.escape(new.replace('https://', ''))}</a>.</p>
</body>
</html>
"""


pages = ["index.html", "404.html"] + [str(p.relative_to(ROOT)) for p in ROOT.glob("*.html") if p.name not in ("index.html", "404.html")] \
        + [str(p.relative_to(ROOT)) for p in (ROOT / "products").glob("*.html")]
for rel in pages:
    path = "/" + rel[:-5]
    path = {"/index": "/", "/products/index": "/products", "/404": "/"}.get(path, path)
    target = out / rel
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_text(page(path), encoding="utf-8")
(out / ".nojekyll").write_text("")
(out / "robots.txt").write_text(f"User-agent: *\nAllow: /\n\nSitemap: {new}/sitemap.xml\n")
(out / "README.md").write_text(f"# Moved\n\nThe XIAI JEWELRY site now lives at {new} (repo xiai-jewelry/xiai-jewelry.github.io). Every page here redirects to the same path there.\n")
print(f"{len(pages)} redirect pages -> {new}")
