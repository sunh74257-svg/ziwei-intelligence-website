(function () {
  const switchers = document.querySelectorAll(".nav-lang");
  if (!switchers.length) {
    return;
  }

  const pageLang = (document.documentElement.lang || "zh-CN").toLowerCase();
  const isEn = pageLang.startsWith("en");
  const isFileProtocol = window.location.protocol === "file:";

  /** 从当前 file:// 路径推断站点根目录（含 index.html 与 en/ 的那一层） */
  const detectSiteRootPathname = () => {
    const pathname = decodeURIComponent(window.location.pathname).replace(/\\/g, "/");
    const parts = pathname.split("/").filter(Boolean);

    const enIndex = parts.indexOf("en");
    if (enIndex !== -1) {
      return "/" + parts.slice(0, enIndex).join("/");
    }

    const blogIndex = parts.indexOf("blog");
    if (blogIndex !== -1) {
      return "/" + parts.slice(0, blogIndex).join("/");
    }

    if (parts.length > 0 && parts[parts.length - 1].includes(".")) {
      return "/" + parts.slice(0, -1).join("/");
    }

    return "/" + parts.join("/");
  };

  /** 将 head 里 hreflang 的正式 URL 转为本地可跳转地址（优先相对路径，兼容 file://） */
  const hreflangToLocalFileUrl = (hreflangHref) => {
    const parsed = new URL(hreflangHref, "https://www.ziwei.ink/");
    let siteRel = parsed.pathname;
    if (siteRel.endsWith("/")) {
      siteRel += "index.html";
    }
    siteRel = siteRel.replace(/^\//, "");
    if (!siteRel) {
      siteRel = "index.html";
    }

    const root = detectSiteRootPathname();
    const targetPath = root + "/" + siteRel;
    const currentPath = decodeURIComponent(window.location.pathname).replace(/\\/g, "/");

    const fromParts = currentPath.split("/").filter(Boolean);
    fromParts.pop();
    const toParts = targetPath.split("/").filter(Boolean);

    let i = 0;
    while (i < fromParts.length && i < toParts.length && fromParts[i] === toParts[i]) {
      i += 1;
    }

    const ups = fromParts.length - i;
    const rel = `${ups ? "../".repeat(ups) : "./"}${toParts.slice(i).join("/")}`;
    return rel;
  };

  const getAlternateHref = (lang) => {
    const hreflang = lang === "en" ? "en" : "zh-CN";
    const link = document.querySelector(`link[rel="alternate"][hreflang="${hreflang}"]`);
    if (!link) {
      return null;
    }

    const rawHref = link.getAttribute("href");
    if (!rawHref) {
      return null;
    }

    if (isFileProtocol) {
      return hreflangToLocalFileUrl(rawHref);
    }

    return link.href;
  };

  const setActive = () => {
    document.querySelectorAll(".nav-lang .nav-lang-link").forEach((link) => {
      const active =
        (link.dataset.lang === "en" && isEn) || (link.dataset.lang === "zh" && !isEn);
      link.classList.toggle("is-active", active);
      link.setAttribute("aria-current", active ? "true" : "false");
    });
  };

  setActive();

  document.addEventListener("click", (event) => {
    const link = event.target.closest(".nav-lang .nav-lang-link");
    if (!link || link.classList.contains("is-active")) {
      return;
    }

    const lang = link.dataset.lang;
    if (lang !== "zh" && lang !== "en") {
      return;
    }

    const target = getAlternateHref(lang);
    if (target) {
      window.location.href = target;
    }
  });
})();
