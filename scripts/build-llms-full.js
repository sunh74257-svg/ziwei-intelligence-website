const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const BASE = "https://www.ziwei.ink";

function read(filePath) {
  return fs.readFileSync(path.join(root, filePath), "utf8");
}

function meta(html) {
  const pick = (re) => {
    const m = html.match(re);
    return m ? m[1].trim() : "";
  };
  return {
    title: pick(/<title>([^<]+)<\/title>/i),
    description: pick(/<meta name="description" content="([^"]*)"/i),
    keywords: pick(/<meta name="keywords" content="([^"]*)"/i),
    canonical: pick(/<link rel="canonical" href="([^"]+)"/i),
    hreflangEn: pick(/<link rel="alternate" hreflang="en" href="([^"]+)"/i),
    hreflangZh: pick(/<link rel="alternate" hreflang="zh-CN" href="([^"]+)"/i),
    published: pick(/<meta property="article:published_time" content="([^"]+)"/i),
    headline: pick(/<h1>([^<]+)<\/h1>/i),
    lang: pick(/<html lang="([^"]+)"/i),
  };
}

function parseBlogOrder() {
  const html = read("blog/index.html");
  const urls = [...html.matchAll(/"url": "(https:\/\/www\.ziwei\.ink\/blog\/posts\/[^"]+)"/g)].map(
    (m) => m[1]
  );
  return urls;
}

function slugFromUrl(url) {
  return url.replace(`${BASE}/blog/posts/`, "");
}

function enPathFromZhSlug(zhSlug, zhHtml) {
  const m = meta(zhHtml);
  if (m.hreflangEn) {
    const p = m.hreflangEn.replace(`${BASE}/en/blog/posts/`, "");
    if (p) return `en/blog/posts/${p}`;
  }
  return `en/blog/posts/${zhSlug}`;
}

function formatEntry(index, title, fields) {
  const lines = [`### ${index}. ${title}`];
  for (const [key, value] of Object.entries(fields)) {
    if (value) lines.push(`${key}: ${value}`);
  }
  return lines.join("\n");
}

function corePage(file, index, displayTitle) {
  const html = read(file);
  const m = meta(html);
  const isEn = file.startsWith("en/");
  return formatEntry(index, displayTitle || m.title.replace(/｜紫微智能科技$/, "").replace(/ \| ZIWEI Tech$/, ""), {
    URL: m.canonical,
    Lang: isEn ? "en" : "zh-CN",
    Alternate: isEn ? m.hreflangZh : m.hreflangEn,
    Summary: m.description,
  });
}

function articlePair(zhSlug, index) {
  const zhPath = `blog/posts/${zhSlug}`;
  const zhHtml = read(zhPath);
  const zm = meta(zhHtml);
  const enPath = enPathFromZhSlug(zhSlug, zhHtml);
  const enHtml = read(enPath);
  const em = meta(enHtml);
  const title = zm.headline || zm.title.replace(/｜紫微智能科技$/, "");

  return formatEntry(index, title, {
    "URL (zh-CN)": zm.canonical || `${BASE}/blog/posts/${zhSlug}`,
    "URL (en)": em.canonical || `${BASE}/${enPath.replace(/\\/g, "/")}`,
    Published: zm.published || "",
    "Keywords (zh-CN)": zm.keywords,
    "Keywords (en)": em.keywords,
    "Summary (zh-CN)": zm.description,
    "Summary (en)": em.description,
  });
}

const generated = new Date().toISOString().replace(/\.\d{3}Z$/, "Z");
const slugs = parseBlogOrder().map(slugFromUrl);

const sections = [
  `# 紫微智能科技 / ZIWEI Tech | LLMS Extended Index`,
  ``,
  `Generated (UTC): ${generated}`,
  `Base URL: ${BASE}`,
  `Compact index: ${BASE}/llms.txt`,
  `Sitemap: ${BASE}/sitemap.xml`,
  ``,
  `> 领先的 AI 算能基础设施与平台服务商，提供高性能 GPU 集群、弹性算力平台与全栈 AI 服务。`,
  ``,
  `## 关于我们`,
  ``,
  `紫微智能科技（北京）有限公司（ZIWEI Tech）专注于 AI 算能基础设施建设，覆盖 GPU 算力实例、高性能存储、高速 RDMA 网络、模型训练平台、推理加速服务与企业级私有化部署。`,
  ``,
  `- 联系邮箱：malone18@foxmail.com`,
  ``,
  `## 核心能力`,
  ``,
  `- GPU 算力实例与弹性伸缩`,
  `- 高性能并行存储`,
  `- 高速 RDMA 网络`,
  `- 模型训练平台（兼容 PyTorch、TensorFlow 等）`,
  `- 推理加速服务`,
  `- 企业私有化部署`,
  ``,
  `## 核心页面`,
  ``,
  corePage("index.html", 1, "紫微智能科技 | AI 算能基础设施"),
  ``,
  corePage("en/index.html", 2, "ZIWEI Tech | AI Compute Infrastructure"),
  ``,
  corePage("blog/index.html", 3, "资讯中心 | 紫微智能科技"),
  ``,
  corePage("en/blog/index.html", 4, "Insights | ZIWEI Tech"),
  ``,
  `## 产品矩阵（外部）`,
  ``,
  formatEntry(1, "心语AI / 心理健康 AI 平台", {
    URL: "https://xinyu.bitsafe.cloud/",
    Summary: "心理陪伴、情绪疏导、智能问答等心理健康 AI 能力。",
  }),
  ``,
  formatEntry(2, "算权宝 / AI 算能平台", {
    URL: "https://compute.bitsafe.cloud/",
    Summary: "算力调度、资源管理、弹性扩展等企业 AI 算能平台。",
  }),
  ``,
  `## 资讯文章（共 ${slugs.length} 篇，按发布时间倒序）`,
  ``,
];

for (let i = 0; i < slugs.length; i++) {
  sections.push(articlePair(slugs[i], i + 1));
  sections.push("");
}

sections.push(`## 引用指南`);
sections.push(``);
sections.push(
  `引用本站点内容时，请注明来源「紫微智能科技」或「ZIWEI Tech」，并附上对应页面 canonical URL。`
);

const out = sections.join("\n");
fs.writeFileSync(path.join(root, "llms-full.txt"), out, "utf8");
console.log(`Wrote llms-full.txt (${slugs.length} articles, ${out.split("\n").length} lines)`);
