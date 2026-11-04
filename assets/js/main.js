/* ALIFY application entry point — shared components are fetched once per page.
 * Run through a local web server (not file://) or a static host. */
import { initHeader } from "./components/header.js";
import { initFooter } from "./components/footer.js";

const root = document.body.dataset.siteRoot || "./";
const components = [
  { target: "site-header-root", file: "header.html" },
  { target: "site-footer-root", file: "footer.html" }
];

async function mountComponent({ target, file }) {
  const mount = document.getElementById(target);
  if (!mount) return;
  const response = await fetch(new URL(root + "components/" + file, document.baseURI));
  if (!response.ok) throw new Error("Failed to load " + file + " (" + response.status + ")");
  const markup = (await response.text()).replaceAll("{{root}}", root);
  mount.innerHTML = markup;
}

function loadOptionalGsap() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const script = document.createElement("script");
  script.src = new URL(root + "assets/gsap/dist/gsap.min.js", document.baseURI).href;
  script.defer = true;
  script.addEventListener("load", () => {
    if (!window.gsap) return;
    window.gsap.from(".site-header__bar", {
      duration: .58, y: -12, autoAlpha: 0, ease: "power2.out", clearProps: "all"
    });
  }, { once: true });
  document.head.append(script);
}

async function start() {
  try {
    await Promise.all(components.map(mountComponent));
    initHeader();
    initFooter();
    loadOptionalGsap();
  } catch (error) {
    console.error("[ALIFY] Component initialization failed:", error);
    const rootNode = document.getElementById("site-header-root");
    if (rootNode && !rootNode.children.length) {
      rootNode.innerHTML = '<div class="component-error" role="alert">Site navigation could not load. Please refresh the page.</div>';
    }
  }
}
start();
