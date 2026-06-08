const fs = require("fs");
const path = require("path");

const indexPath = path.join(__dirname, "..", "index.html");
let html = fs.readFileSync(indexPath, "utf8");

// Remove hidden decorative SVG (display:none; PNG hero is used instead)
html = html.replace(
  /\n        <svg class="tech-svg"[\s\S]*?\n        <\/svg>/,
  ""
);

// Remove unused .tech-svg CSS rules
html = html.replace(
  /\n    \.tech-svg \{[\s\S]*?display: none;\n    \}\n/,
  "\n"
);
html = html.replace(
  /\n      \.tech-svg \{\n        display: none;\n      \}\n/,
  "\n"
);

// Defer non-critical analytics config
html = html.replace(
  '<script src="assets/js/gtag-config.js"></script>',
  '<script defer src="assets/js/gtag-config.js"></script>'
);

// Preload LCP hero image
html = html.replace(
  '<link rel="shortcut icon" href="favicon.ico" type="image/x-icon" />',
  `<link rel="shortcut icon" href="favicon.ico" type="image/x-icon" />
  <link rel="preload" as="image" href="assets/images/hero-ai-platform-servers.webp" type="image/webp" fetchpriority="high" />`
);

// Wrap PNG images with WebP picture sources
html = html.replace(
  /<img(\s[^>]*?)src="assets\/images\/([^"]+\.png)"(\s*\/?)>/g,
  (match, before, file, slash) => {
    const webp = file.replace(/\.png$/i, ".webp");
    const full = before + slash;
    const isHero = full.includes("hero-art");
    const isLogo = full.includes("brand-mark");
    let extra = "";

    if (!/loading=/.test(full) && !isHero && !isLogo) {
      extra += ' loading="lazy"';
    }
    if (!/decoding=/.test(full)) {
      extra += ' decoding="async"';
    }
    if (isHero && !/fetchpriority=/.test(full)) {
      extra += ' fetchpriority="high"';
    }

    return `<picture><source srcset="assets/images/${webp}" type="image/webp" /><img${before}src="assets/images/${file}"${extra}></picture>`;
  }
);

fs.writeFileSync(indexPath, html, "utf8");
console.log("Updated index.html");
