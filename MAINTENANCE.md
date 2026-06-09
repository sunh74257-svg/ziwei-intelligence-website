# 紫微智能科技官网 · 后续维护操作流程

静态双语站点（中文根目录 + `/en/`）。本文档汇总**发新文章、更新首页、LLM 索引、构建命令**等日常维护步骤。

## 常用命令

```bash
# 从中文首页重新生成英文首页（改 index.html 后必跑）
npm run build:en
# 或
node scripts/build-en-index.js

# 从各页面 meta 自动生成 llms-full.txt（发文章或改 TDK 后建议跑）
npm run build:llms-full
# 或
node scripts/build-llms-full.js
```

> **提示**：`build:en` 有时需连续运行两次，`en/index.html` 才能完全同步最新中文首页内容。

---

## 一、发布一篇新资讯（中英文）

每篇资讯 = 中文 HTML + 英文 HTML，按发布日期倒序置顶。

### 1. 新建文章页面

| 语言 | 路径 | 资源引用前缀 |
|------|------|-------------|
| 中文 | `blog/posts/{slug}.html` | `../../assets/` |
| 英文 | `en/blog/posts/{slug}.html` | `../../../assets/` |

**复制模板**（任选一篇最新文章）：

- 中文：`blog/posts/hangzhou-ai-compute-platform-ranking.html`
- 英文：`en/blog/posts/hangzhou-ai-compute-platform-ranking.html`

**slug 命名**：小写英文 + 连字符，如 `what-is-ziwei-ai-compute.html`。中英文 slug 可以不同（如 `what-is-ai-suan-neng.html` ↔ `what-is-ai-compute.html`），但 hreflang 必须互相指向正确。

### 2. 填写文章 `<head>`（每页必做）

- `html lang`：`zh-CN` 或 `en`
- `<title>`、`<meta name="description">`、`<meta name="keywords">`（建议有）
- `<link rel="canonical">`：指向**当前页面自身**的完整 URL
- hreflang 三件套（域名统一用 `https://www.ziwei.ink`）：

```html
<link rel="alternate" hreflang="zh-CN" href="https://www.ziwei.ink/blog/posts/xxx.html" />
<link rel="alternate" hreflang="en" href="https://www.ziwei.ink/en/blog/posts/yyy.html" />
<link rel="alternate" hreflang="x-default" href="https://www.ziwei.ink/blog/posts/xxx.html" />
```

- Open Graph / Twitter Card / `article:published_time`
- JSON-LD：`BreadcrumbList` + `BlogPosting`（headline、description、datePublished、inLanguage）

### 3. 编写正文

- 页面仅 **1 个 H1**（文章标题）
- 正文用 **H2 / H3** 分段
- 文末 FAQ 建议 5 条，格式与现有文章一致
- 可适当链到首页锚点：`../../index.html#product-services`、`#service-private`、`#contact`

### 4. 更新资讯列表 `blog/index.html` 与 `en/blog/index.html`

两处都要改：

1. **JSON-LD `ItemList`**：新文章插入 `position: 1`，后续条目 position 依次 +1
2. **`<ul class="post-list">`**：顶部插入新 `<li>` 卡片（日期、标题、摘要）

英文列表标题/摘要写英文；JSON-LD 的 `name` 也用英文。

### 5. 更新中文首页 `index.html`

在 `#insights` 区块的 `<div class="product-grid">` **顶部**插入 `<article class="service-card">`：

- 标题链接到 `blog/posts/{slug}.html`
- 一行摘要 + 「阅读全文 →」

### 6. 更新英文首页翻译表 `scripts/build-en-index.js`

在 `translations` 数组**靠前位置**（资讯相关条目区）新增两行：

```js
['中文标题', 'English Title'],
['中文列表摘要。', 'English list summary.'],
```

然后运行：

```bash
npm run build:en
```

### 7. 更新 `sitemap.xml`

在现有最新文章条目**之前**插入中英文各一条 `<url>`，包含：

- `<loc>`、`<lastmod>`（发布日期）、`<changefreq>monthly</changefreq>`、`<priority>0.7</priority>`
- 三条 `xhtml:link`（zh-CN、en、x-default）

### 8. 更新 `llms.txt`（手动）

在 `## 资讯文章` 区块**顶部**追加两行：

```text
- 中文标题（中文）：https://www.ziwei.ink/blog/posts/xxx.html
- English Title（英文）：https://www.ziwei.ink/en/blog/posts/yyy.html
```

### 9. 重新生成 `llms-full.txt`（自动）

```bash
npm run build:llms-full
```

脚本会读取 `blog/index.html` 的 ItemList 顺序，并从各 HTML 提取 title / description / keywords / 发布日期。

### 10. 发布前检查

- [ ] 中英文各一篇，独立 URL，正文语言正确
- [ ] canonical、hreflang 完整且互相指向正确
- [ ] 列表页 JSON-LD + post-list 已置顶
- [ ] 中文首页 `#insights` 已置顶
- [ ] `build-en-index.js` 已加翻译且 `en/index.html` 已重新生成
- [ ] `sitemap.xml` 已含中英文 URL
- [ ] `llms.txt` 已手动追加链接
- [ ] `llms-full.txt` 已重新生成
- [ ] 本地打开中英文文章页，语言切换正常

---

## 二、仅修改中文首页（非发文章）

1. 编辑 `index.html`
2. 运行 `npm run build:en` 生成 `en/index.html`
3. 若 `#insights` 文案有变，确认 `scripts/build-en-index.js` 的 `translations` 已覆盖新文案
4. 必要时再跑一次 `npm run build:en`

---

## 三、LLM 索引文件说明

| 文件 | 维护方式 | 作用 |
|------|----------|------|
| `llms.txt` | **手动**追加文章链接 | 精简索引，供 AI 快速了解站点 |
| `llms-full.txt` | **`npm run build:llms-full` 自动生成** | 扩展索引，含每页 URL + 中英文 Summary |

`llms.txt` 顶部已链接到 `llms-full.txt`。发新文章时：**先改 llms.txt，再跑 build:llms-full**。

---

## 四、目录与路径约定

```
ziwei-intelligence-website/
├── index.html                 # 中文首页
├── en/index.html              # 英文首页（由 build-en-index.js 生成）
├── sitemap.xml
├── llms.txt                   # LLM 精简索引（手动维护）
├── llms-full.txt              # LLM 扩展索引（脚本生成）
├── blog/
│   ├── index.html             # 中文资讯列表
│   └── posts/*.html           # 中文文章
├── en/blog/
│   ├── index.html             # 英文资讯列表
│   └── posts/*.html           # 英文文章
├── assets/                    #  css / js / images（中英文共用）
└── scripts/
    ├── build-en-index.js      # 中文首页 → 英文首页
    └── build-llms-full.js     # 生成 llms-full.txt
```

**Canonical 域名**：统一使用 `https://www.ziwei.ink`（带 `www`）。

---

## 五、部署

静态资源直接部署，无需 Node / 数据库：

- `index.html`、`en/`、`blog/`、`assets/`
- `robots.txt`、`sitemap.xml`、`llms.txt`、`llms-full.txt`、`favicon.ico`

上线后在 Google Search Console 提交 `https://www.ziwei.ink/sitemap.xml`。

---

## 六、发新文章快速清单（复制用）

```
[ ] blog/posts/{slug}.html
[ ] en/blog/posts/{slug}.html
[ ] blog/index.html（JSON-LD + post-list）
[ ] en/blog/index.html（JSON-LD + post-list）
[ ] index.html（#insights product-grid 置顶）
[ ] scripts/build-en-index.js（translations 新增标题+摘要）
[ ] npm run build:en
[ ] sitemap.xml（中英文 URL + hreflang）
[ ] llms.txt（手动追加 2 行链接）
[ ] npm run build:llms-full
[ ] 本地抽查：文章页、语言切换、英文首页 insights
```
