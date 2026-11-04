# ALIFY local front-end assets

All dependencies are intended to be self-hosted; no CDN is required.

| Component | Version | Location |
| --- | --- | --- |
| Custom stylesheet | ALIFY | `assets/css/style.css` |
| Custom JS | ALIFY | `assets/js/main.js` |
| Bootstrap (complete npm distribution) | 5.3.8 | `assets/bootstrap/` |
| Font Awesome Free (complete npm distribution) | 7.3.1 | `assets/icons/` |
| GSAP (complete npm distribution) | 3.15.0 | `assets/gsap/` |
| Geist Sans / Geist Mono / Geist Pixel | 1.7.2 | `assets/font/` |

The packages contain complete vendor files, including original CSS/JS, minified
versions, maps, source modules, icon SVGs and license files where supplied.
All Geist WOFF2 files also have matching generated WOFF files.

## Use in an HTML page

```html
<link rel="stylesheet" href="assets/bootstrap/dist/css/bootstrap.min.css">
<link rel="stylesheet" href="assets/icons/css/all.min.css">
<link rel="stylesheet" href="assets/css/style.css">

<script src="assets/bootstrap/dist/js/bootstrap.bundle.min.js"></script>
<script src="assets/gsap/dist/gsap.min.js"></script>
<script src="assets/gsap/dist/ScrollTrigger.min.js"></script>
<script src="assets/js/main.js"></script>
```

Bootstrap's bundle contains Popper, so it is the recommended single Bootstrap
JavaScript build. Font Awesome's CSS references its sibling `webfonts/` directory.

## Reproducible update

Run `bash scripts/vendor-assets.sh` from an environment with Node.js, npm,
Python and pip; or run the checked-in GitHub Actions vendor workflow.
Versions are pinned in the script. Do not edit vendor files manually.
