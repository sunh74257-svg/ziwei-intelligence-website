(function () {
  const toggle = document.querySelector(".nav-toggle");
  const drawer = document.getElementById("site-mobile-nav");
  const backdrop = document.querySelector(".mobile-nav-backdrop");
  const closeBtn = document.querySelector(".mobile-nav-close");
  const sourceMenu = document.querySelector(".nav > .menu:not(.menu--drawer)");
  const drawerMenu = document.querySelector(".menu--drawer");
  const brandSource = document.querySelector(".nav > .brand");
  const brandTarget = document.querySelector(".mobile-nav-brand");
  if (!toggle || !drawer || !sourceMenu || !drawerMenu) {
    return;
  }

  drawerMenu.innerHTML = sourceMenu.innerHTML;

  if (brandSource && brandTarget) {
    brandTarget.href = brandSource.href;
    brandTarget.setAttribute("aria-label", brandSource.getAttribute("aria-label") || "首页");
    brandTarget.innerHTML = brandSource.innerHTML;
  }

  const setOpen = (open) => {
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    drawer.classList.toggle("is-open", open);
    drawer.setAttribute("aria-hidden", open ? "false" : "true");
    backdrop?.classList.toggle("is-open", open);
    backdrop?.setAttribute("aria-hidden", open ? "false" : "true");
    document.body.classList.toggle("mobile-nav-open", open);
  };

  toggle.addEventListener("click", () => {
    setOpen(!drawer.classList.contains("is-open"));
  });

  closeBtn?.addEventListener("click", () => setOpen(false));
  backdrop?.addEventListener("click", () => setOpen(false));

  drawer.addEventListener("click", (event) => {
    if (event.target.closest(".menu--drawer a")) {
      setOpen(false);
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      setOpen(false);
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 920) {
      setOpen(false);
    }
  });
})();
