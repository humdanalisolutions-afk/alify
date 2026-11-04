# ALIFY Frontend

Static HTML, handcrafted CSS and accessible JavaScript, backed by self-hosted
Geist, Bootstrap grid, Font Awesome Free and GSAP. This phase implements the
**global header and footer**; the other pages are honest development placeholders.

## Preview locally

The shared HTML components use `fetch()`, so don't open `index.html` by
double-clicking from a `file://` URL. Serve the repository root:

```bash
python -m http.server 8000
```

Open `http://localhost:8000/`.

## Structure

```
index.html                      Home foundation preview
pages/*.html                    Responsive placeholder page routes
components/header.html          Shared header and mobile drawer
components/footer.html          Shared footer
assets/css/style.css            Global tokens, Geist fonts, typography, buttons
assets/css/components/header.css
assets/css/components/footer.css
assets/js/main.js                Injects components, loads optional GSAP
assets/js/components/header.js  Menu, dropdown, keyboard navigation
assets/js/components/footer.js  Mobile footer accordion, back-to-top
assets/images/alify-logo-*.svg  Vector versions of provided black/white logos
assets/images/Neon_Lines_*.webp Original self-hosted abstract backgrounds
assets/bootstrap/               Official local Bootstrap package
assets/icons/                   Official local Font Awesome package
assets/gsap/                    Official local GSAP package
assets/font/                    Self-hosted Geist font family
```

## Design rules

- Use only the three Bootstrap classes `container`, `row`, and `col`.
- All other styling is custom and organized by global component or future page.
- Use the seven specified ALIFY colors via CSS custom properties.
- Use local Geist variable fonts; avoid external Google Fonts.
- Prefer `fa-regular` icons (Font Awesome Free does not provide Pro Light).
- No fabricated contact details, social accounts, case studies, or live forms.
- All nav routes exist as development placeholders until their phases are built.
- Mobile menu supports outside click, Escape, focus-trap, scroll lock and
  responsive teardown; footer accordions work on mobile.
- Motion is subtle and disabled for users who prefer reduced motion.

## Source and browser support

ES modules and `fetch()` require a modern browser and an HTTP server.
Bootstrap is loaded as `bootstrap-grid.min.css`; its JS/components aren't used.
Font Awesome and GSAP are loaded locally from `assets/`.
