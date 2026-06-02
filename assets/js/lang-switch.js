(function () {
  const STORAGE_KEY = "ziwei-site-lang";
  const root = document.documentElement;
  const switchers = document.querySelectorAll(".nav-lang");
  if (!switchers.length) {
    return;
  }

  const supported = new Set(["zh", "en"]);

  const allLinks = () => Array.from(document.querySelectorAll(".nav-lang .nav-lang-link"));

  const setActive = (lang) => {
    const next = supported.has(lang) ? lang : "zh";
    root.lang = next === "en" ? "en" : "zh-CN";
    root.dataset.siteLang = next;
    allLinks().forEach((link) => {
      const active = link.dataset.lang === next;
      link.classList.toggle("is-active", active);
      link.setAttribute("aria-current", active ? "true" : "false");
    });
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* ignore */
    }
  };

  const saved = (() => {
    try {
      return localStorage.getItem(STORAGE_KEY);
    } catch {
      return null;
    }
  })();

  const params = new URLSearchParams(window.location.search);
  const fromQuery = params.get("lang");
  setActive(fromQuery || saved || "zh");

  document.addEventListener("click", (event) => {
    const link = event.target.closest(".nav-lang .nav-lang-link");
    if (!link || link.classList.contains("is-active")) {
      return;
    }
    const lang = link.dataset.lang;
    if (!lang || !supported.has(lang)) {
      return;
    }
    setActive(lang);
    const url = new URL(window.location.href);
    if (lang === "en") {
      url.searchParams.set("lang", "en");
    } else {
      url.searchParams.delete("lang");
    }
    window.history.replaceState({}, "", url);
  });
})();
