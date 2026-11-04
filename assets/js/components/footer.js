/* Accessible mobile-only accordion footer + back-to-top. */
export function initFooter() {
  const footer = document.querySelector("[data-site-footer]");
  if (!footer) return;
  footer.querySelectorAll("[data-current-year]").forEach(el => {
    el.textContent = new Date().getFullYear();
  });
  const motionReduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  footer.querySelector("[data-back-to-top]")?.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: motionReduced.matches ? "instant" : "smooth" });
  });
  const mobile = window.matchMedia("(max-width: 700px)");
  const sections = Array.from(footer.querySelectorAll("[data-footer-column]"));
  function syncLayout() {
    sections.forEach(section => {
      const button = section.querySelector("[data-footer-toggle]");
      if (!button) return;
      const content = document.getElementById(button.getAttribute("aria-controls"));
      if (!content) return;
      button.tabIndex = mobile.matches ? 0 : -1;
      button.setAttribute("aria-expanded", String(!mobile.matches));
      content.hidden = mobile.matches;
    });
  }
  sections.forEach(section => {
    const button = section.querySelector("[data-footer-toggle]");
    if (!button) return;
    const content = document.getElementById(button.getAttribute("aria-controls"));
    if (!content) return;
    button.addEventListener("click", () => {
      if (!mobile.matches) return;
      const willOpen = content.hidden;
      content.hidden = !willOpen;
      button.setAttribute("aria-expanded", String(willOpen));
    });
  });
  mobile.addEventListener("change", syncLayout);
  syncLayout();
}
