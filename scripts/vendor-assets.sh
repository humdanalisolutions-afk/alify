#!/usr/bin/env bash
# Reproducibly download ALL files from the official package distributions.
# Requirements: Node.js/npm, Python 3 and pip (provided by GitHub Actions).
set -Eeuo pipefail

cd "$(dirname "${BASH_SOURCE[0]}")/.."

TMP_ROOT="$(mktemp -d)"
trap 'rm -rf "$TMP_ROOT"' EXIT

download_package() {
  local package="$1"
  local version="$2"
  local destination="$3"
  local slug="$4"
  local staging="$TMP_ROOT/pack-$slug"
  local archive

  mkdir -p "$staging" "$destination"
  echo "Downloading official npm package: $package@$version"
  archive="$(cd "$staging" && npm pack "$package@$version" --silent)"
  test -s "$staging/$archive"
  tar -xzf "$staging/$archive" -C "$staging"
  test -d "$staging/package"
  # Copy the COMPLETE npm distribution (not just a CDN/minified subset).
  cp -a "$staging/package/." "$destination/"
}

# Complete upstream packages: CSS, JS, minified builds, source maps,
# Sass/SCSS, SVG icons, webfonts, GSAP plugins, TypeScript types, licenses.
download_package "bootstrap" "5.3.8" "assets/bootstrap" "bootstrap"
download_package "@fortawesome/fontawesome-free" "7.3.1" "assets/icons" "fontawesome"
download_package "gsap" "3.15.0" "assets/gsap" "gsap"

# Vercel's Geist font family: copy all available typeface variants,
# including Geist Sans, Geist Mono and Geist Pixel.
download_package "geist" "1.7.2" "$TMP_ROOT/geist-package" "geist"
test -d "$TMP_ROOT/geist-package/dist/fonts"
mkdir -p assets/font
cp -a "$TMP_ROOT/geist-package/dist/fonts/." assets/font/
cp "$TMP_ROOT/geist-package/LICENSE.txt" assets/font/LICENSE-Geist.txt

echo "Generating WOFF alongside every official Geist WOFF2..."
python -m pip install --quiet --disable-pip-version-check fonttools brotli
python - <<'PY'
from pathlib import Path
from fontTools.ttLib import TTFont

root = Path("assets/font")
source_fonts = sorted(root.rglob("*.woff2"))
if not source_fonts:
    raise RuntimeError("No Geist WOFF2 fonts were downloaded")

for woff2 in source_fonts:
    woff = woff2.with_suffix(".woff")
    # Prefer source TTF to avoid decompressing WOFF2 unnecessarily.
    source = woff2.with_suffix(".ttf")
    if not source.exists():
        source = woff2
    font = TTFont(str(source))
    try:
        font.flavor = "woff"
        font.save(str(woff))
    finally:
        font.close()
    if woff.stat().st_size == 0:
        raise RuntimeError(f"WOFF conversion produced an empty file: {woff}")

print(f"Generated {len(source_fonts)} Geist WOFF files")
PY

test -s assets/bootstrap/dist/css/bootstrap.min.css
test -s assets/bootstrap/dist/js/bootstrap.bundle.min.js
test -s assets/icons/css/all.min.css
test -s assets/icons/webfonts/fa-solid-900.woff2
test -d assets/icons/svgs
test -s assets/gsap/dist/gsap.min.js
test -s assets/gsap/dist/ScrollTrigger.min.js
test -s assets/font/geist-sans/Geist-Variable.woff2
test -s assets/font/geist-sans/Geist-Variable.woff
test -s assets/font/geist-mono/GeistMono-Variable.woff2
test -s assets/font/geist-mono/GeistMono-Variable.woff

echo "All four official package distributions and Geist WOFF conversions are ready."
