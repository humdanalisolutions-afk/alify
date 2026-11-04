/* Accessible reusable navigation: dropdown + mobile drawer. */
export function initHeader() {
  const header = document.querySelector("[data-site-header]");
  const menu = document.querySelector("[data-mobile-menu]");
  const toggle = document.querySelector("[data-menu-open]");
  const closeButton = document.querySelector("[data-menu-close]");
  const backdrop = document.querySelector("[data-menu-backdrop]");
  const dropdown = document.querySelector("[data-desktop-dropdown]");
  const dropdownToggle = document.querySelector("[data-desktop-dropdown-toggle]");
  const dropdownPanel = document.querySelector("[data-desktop-dropdown-panel]");
  const mobileToggle = document.querySelector("[data-mobile-accordion-toggle]");
  const mobileLinks = document.getElementById("mobile-service-links");
  if (!header || !menu || !toggle || !closeButton || !backdrop) return;

  const page = document.body.dataset.page;
  document.querySelectorAll("[data-nav-route]").forEach(link => {
    if (link.dataset.navRoute === page) link.setAttribute("aria-current", "page");
  });

  let isOpen = false;
  let closeTimer = null;
  function openMenu() {
    if (isOpen) return;
    clearTimeout(closeTimer);
    closeDropdown(false);
    isOpen = true;
    menu.inert = false;
    menu.setAttribute("aria-hidden", "false");
    toggle.setAttribute("aria-expanded", "true");
    backdrop.hidden = false;
    document.body.classList.add("has-open-menu");
    requestAnimationFrame(() => {
      backdrop.classList.add("is-active");
      menu.classList.add("is-active");
      closeButton.focus({ preventScroll: true });
    });
  }
  function closeMenu(restoreFocus = true) {
    if (!isOpen) return;
    isOpen = false;
    if (restoreFocus) toggle.focus({ preventScroll: true });
    menu.classList.remove("is-active");
    backdrop.classList.remove("is-active");
    toggle.setAttribute("aria-expanded", "false");
    menu.setAttribute("aria-hidden", "true");
    menu.inert = true;
    document.body.classList.remove("has-open-menu");
    clearTimeout(closeTimer);
    closeTimer = setTimeout(() => { if (!isOpen) backdrop.hidden = true; }, 380);
  }
  toggle.addEventListener("click", openMenu);
  closeButton.addEventListener("click", () => closeMenu());
  backdrop.addEventListener("click", () => closeMenu());
  menu.querySelectorAll("a[href]").forEach(link => {
    link.addEventListener("click", () => closeMenu(false));
  });

  function closeDropdown(restoreFocus = false) {
    if (!dropdownToggle || !dropdownPanel) return;
    const wasExpanded = dropdownToggle.getAttribute("aria-expanded") === "true";
    dropdownPanel.hidden = true;
    dropdownToggle.setAttribute("aria-expanded", "false");
    if (restoreFocus && wasExpanded) dropdownToggle.focus({ preventScroll: true });
  }
  dropdownToggle?.addEventListener("click", () => {
    const willOpen = dropdownPanel.hidden;
    dropdownPanel.hidden = !willOpen;
    dropdownToggle.setAttribute("aria-expanded", String(willOpen));
  });
  document.addEventListener("pointerdown", event => {
    if (dropdown && !dropdown.contains(event.target)) closeDropdown();
  });
  dropdown?.addEventListener("focusout", () => {
    requestAnimationFrame(() => {
      if (!dropdown.contains(document.activeElement)) closeDropdown();
    });
  });

  mobileToggle?.addEventListener("click", () => {
    const expanded = mobileToggle.getAttribute("aria-expanded") === "true";
    mobileToggle.setAttribute("aria-expanded", String(!expanded));
    mobileLinks.hidden = expanded;
  });

  document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
      if (isOpen) { event.preventDefault(); closeMenu(); }
      else closeDropdown(true);
    }
    if (!isOpen || event.key !== "Tab") return;
    const focusable = Array.from(menu.querySelectorAll('a[href], button:not([disabled])'))
      .filter(el => !el.closest("[hidden]") && el.getClientRects().length > 0);
    if (!focusable.length) return;
    const first = focusable[0], last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault(); last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault(); first.focus();
    }
  });

  window.matchMedia("(min-width: 1191px)").addEventListener("change", e => {
    if (e.matches) closeMenu(false);
  });
}
