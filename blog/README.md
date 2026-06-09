# 资讯中心（静态博客）使用说明

> **完整维护流程**（发文章、首页构建、llms 索引、sitemap、检查清单）见项目根目录 **[MAINTENANCE.md](../MAINTENANCE.md)**。

采用**方法 1**：每篇文章一个独立 HTML 页面，便于 Google / AI 搜索收录与 GEO 引用。

站点为**中英文双语静态站**：中文在根目录，英文在 `/en/`，正文直接写在 HTML 源码中，不使用构建工具或 JS 动态渲染。

## 目录结构

```
ziwei-intelligence-website/
├── index.html                      # 中文官网首页
├── favicon.ico
├── robots.txt
├── sitemap.xml                     # 中英文 URL + hreflang 标记
├── assets/
│   ├── css/                        # 全站样式（中英文共用）
│   ├── js/                         # mobile-nav.js、lang-switch.js
│   └── images/
├── blog/
│   ├── index.html                  # 中文资讯列表
│   └── posts/
│       └── what-is-ai-suan-neng.html
└── en/
    ├── index.html                  # 英文官网首页
    └── blog/
        ├── index.html              # 英文资讯列表
        └── posts/
            └── what-is-ai-compute.html
```

## 页面对应关系

| 中文 | 英文 |
|------|------|
| `/` | `/en/` |
| `/blog/` | `/en/blog/` |
| `/blog/posts/what-is-ai-suan-neng.html` | `/en/blog/posts/what-is-ai-compute.html` |

## 发一篇新文章（中英文各一篇）

完整 10 步流程见 **[MAINTENANCE.md § 一、发布一篇新资讯](../MAINTENANCE.md#一发布一篇新资讯中英文)**。简要步骤：

1. **复制模板**
   - 中文：复制 `blog/posts/what-is-ai-suan-neng.html` → `blog/posts/你的中文-slug.html`
   - 英文：复制 `en/blog/posts/what-is-ai-compute.html` → `en/blog/posts/你的英文-slug.html`

2. **改 `<head>`（每页必做）**
   - `html lang`：`zh-CN` 或 `en`
   - `<title>`、`<meta name="description">`
   - `<link rel="canonical">`：**指向当前页面自身 URL**
   - hreflang 三件套（示例）：
     ```html
     <link rel="alternate" hreflang="zh-CN" href="https://www.ziwei.ink/blog/posts/xxx.html" />
     <link rel="alternate" hreflang="en" href="https://www.ziwei.ink/en/blog/posts/yyy.html" />
     <link rel="alternate" hreflang="x-default" href="https://www.ziwei.ink/blog/posts/xxx.html" />
     ```
   - 更新 JSON-LD `BlogPosting` 的 `headline`、`description`、`inLanguage`

3. **改正文**  
   中英文各自独立撰写，保持 **一个 H1**，正文用 H2/H3 分段。

4. **登记入口（便于抓取）**
   - `blog/index.html` 与 `en/blog/index.html` 的 `<ul class="post-list">` 各加一条
   - 中文 `index.html` 的 `#insights` 区块加文章卡片（如有）

5. **更新 sitemap.xml**  
   中英文 URL 各加一条，并附带 `xhtml:link` hreflang，例如：

   ```xml
   <url>
     <loc>https://www.ziwei.ink/blog/posts/xxx.html</loc>
     <lastmod>2026-06-02</lastmod>
     <changefreq>monthly</changefreq>
     <priority>0.7</priority>
     <xhtml:link rel="alternate" hreflang="zh-CN" href="https://www.ziwei.ink/blog/posts/xxx.html" />
     <xhtml:link rel="alternate" hreflang="en" href="https://www.ziwei.ink/en/blog/posts/yyy.html" />
     <xhtml:link rel="alternate" hreflang="x-default" href="https://www.ziwei.ink/blog/posts/xxx.html" />
   </url>
   ```

6. **语言切换**  
   `lang-switch.js` 读取页面 `<link rel="alternate" hreflang="...">` 跳转到对应语言页，**不替换正文**。

另需同步：`llms.txt`、`npm run build:llms-full`、`npm run build:en`（见 MAINTENANCE.md）。

## 更新英文首页

见 **[MAINTENANCE.md § 二](../MAINTENANCE.md#二仅修改中文首页非发文章)**。

## SEO / GEO 检查清单（每篇）

- [ ] 中英文各一篇，独立 URL
- [ ] canonical 指向当前语言页面自身
- [ ] hreflang zh-CN / en / x-default 完整且互相指向正确
- [ ] 唯一且准确的 title、description
- [ ] 至少 1 个 H1，层级清晰的 H2
- [ ] 列表页与首页有文章入口链接
- [ ] sitemap 已包含中英文 URL 及 xhtml:link
- [ ] JSON-LD 日期、语言、作者信息正确

## 运维部署

- 整站静态打包：`index.html`、`en/`、`blog/`、`assets/`、`robots.txt`、`sitemap.xml`
- 无需 Node / 数据库
- 上线后在 Google Search Console 提交 `sitemap.xml`
