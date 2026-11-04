#!/usr/bin/env python3
"""Dependency-free static smoke tests for the ALIFY frontend."""
from html.parser import HTMLParser
from pathlib import Path
import re
import sys
from urllib.parse import unquote, urlsplit

ROOT = Path(__file__).resolve().parents[1]
PAGES = [ROOT / "index.html", *sorted((ROOT / "pages").glob("*.html"))]
COMPONENTS = [ROOT / "components/header.html", ROOT / "components/footer.html"]


class References(HTMLParser):
    def __init__(self):
        super().__init__()
        self.refs = []

    def handle_starttag(self, tag, attrs):
        props = dict(attrs)
        for name in ("href", "src"):
            if props.get(name):
                self.refs.append((tag, props[name]))


def verify_reference(reference, source, original_path):
    if reference.startswith(("#", "mailto:", "tel:", "data:", "{{")):
        raise AssertionError(f"Unexpected unresolved or external link {reference!r} in {source}")
    parsed = urlsplit(reference)
    if parsed.scheme or parsed.netloc:
        raise AssertionError(f"CDN/external URL found in {source}: {reference}")
    target = (original_path.parent / unquote(parsed.path)).resolve()
    if not target.is_relative_to(ROOT):
        raise AssertionError(f"Reference escapes repository: {reference}")
    if not target.is_file():
        raise AssertionError(f"Missing local file referenced by {source}: {reference}")


for page in PAGES:
    raw = page.read_text(encoding="utf-8")
    if '<meta name="viewport"' not in raw:
        raise AssertionError(f"Missing viewport meta in {page}")
    if 'id="site-header-root"' not in raw or 'id="site-footer-root"' not in raw:
        raise AssertionError(f"Missing component mounts in {page}")
    root_prefix = "./" if page.parent == ROOT else "../"
    parser = References()
    parser.feed(raw)
    for component in COMPONENTS:
        parser.feed(component.read_text(encoding="utf-8").replace("{{root}}", root_prefix))
    for tag, ref in parser.refs:
        if ref.startswith(("#", "mailto:", "tel:")):
            continue
        verify_reference(ref, page.name, page)
    print(f"OK: {page.relative_to(ROOT)} ({len(parser.refs)} local/fragment references)")

for css in [
    ROOT / "assets/css/style.css",
    ROOT / "assets/css/components/header.css",
    ROOT / "assets/css/components/footer.css",
]:
    content = css.read_text(encoding="utf-8")
    for url in re.findall(r'url\(["\']?([^)"\']+)["\']?\)', content):
        if url.startswith("data:"):
            continue
        path = (css.parent / url).resolve()
        if not path.is_file():
            raise AssertionError(f"CSS asset not found: {css.name} -> {url}")
    print(f"OK: {css.relative_to(ROOT)}")

expected = [
    *[ROOT / f"assets/images/Neon_Lines_{i:02d}_1920.webp" for i in range(1, 15)],
    ROOT / "assets/images/alify-logo-light.svg",
    ROOT / "assets/images/alify-logo-dark.svg",
    ROOT / "assets/font/geist-sans/Geist-Variable.woff2",
    ROOT / "assets/font/geist-mono/GeistMono-Variable.woff2",
    ROOT / "assets/bootstrap/dist/css/bootstrap-grid.min.css",
    ROOT / "assets/icons/css/all.min.css",
    ROOT / "assets/gsap/dist/gsap.min.js",
]
for file in expected:
    if not file.exists() or file.stat().st_size == 0:
        raise AssertionError(f"Required asset missing or empty: {file.relative_to(ROOT)}")
print(f"OK: {len(expected)} required local assets")

# Enforce the user's Bootstrap rule: only the three basic layout classes.
for page in PAGES + COMPONENTS:
    text = page.read_text(encoding="utf-8")
    values = re.findall(r'class="([^"]+)"', text)
    forbidden = set()
    known = ["btn", "d-flex", "d-none", "mt-", "mb-", "col-", "row-cols-", "navbar", "dropdown-menu", "text-center", "justify-content-", "align-items-", "p-", "m-", "bg-", "text-"]
    for value in values:
        for class_name in value.split():
            if any(class_name == key or class_name.startswith(key) for key in known):
                forbidden.add(class_name)
    if forbidden:
        raise AssertionError(f"Forbidden Bootstrap utility/component classes in {page}: {sorted(forbidden)}")
print("PASS: Bootstrap classes restricted to container, row and col")
print("PASS: ALIFY frontend links, dependencies and structure validated")
