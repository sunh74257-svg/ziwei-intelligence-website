# 资讯中心（静态博客）使用说明

采用**方法 1**：每篇文章一个独立 HTML 页面，便于 Google / AI 搜索收录与 GEO 引用。

## 目录结构

```
ziwei-intelligence-website/
├── index.html                 # 官网首页
├── favicon.ico
├── robots.txt
├── sitemap.xml                # 每发一篇新文要追加 URL
├── assets/
│   ├── css/
│   │   ├── site-nav.css       # 资讯页顶部导航（与官网视觉一致）
│   │   └── blog.css           # 资讯正文区样式
│   └── images/                # 全站图片（官网 + 博客引用）
└── blog/
    ├── README.md              # 本说明
    ├── index.html             # 文章列表
    └── posts/
        └── *.html             # 单篇文章（一篇一文件）
```

## 发一篇新文章的步骤

1. **复制模板**  
   复制 `posts/what-is-ai-compute-infrastructure.html`，重命名为英文 slug，例如：  
   `gpu-cluster-best-practices.html`

2. **改 `<head>`（SEO 必做）**
   - `<title>`：文章标题 | 紫微智能科技
   - `<meta name="description">`：80–160 字摘要
   - `<link rel="canonical">`：正式网址，如 `https://www.ziweitech.com/blog/posts/xxx.html`
   - 更新文内 `application/ld+json` 的 `headline`、`datePublished`、`description`

3. **改正文**  
   保持 **一个 H1**（标题），正文用 **H2 / H3** 分段；文末可加「相关链接」指向官网区块或姊妹文章。

4. **登记列表**  
   在 `blog/index.html` 的 `<ul class="post-list">` 最上方增加一条 `<li><a class="post-card">…</a></li>`。

5. **更新 sitemap**  
   在根目录 `sitemap.xml` 增加：

   ```xml
   <url>
     <loc>https://www.ziweitech.com/blog/posts/你的slug.html</loc>
     <lastmod>2026-06-01</lastmod>
     <changefreq>monthly</changefreq>
     <priority>0.7</priority>
   </url>
   ```

6. **部署**  
   与官网一起打包给运维；确保 `blog/` 目录在网站根路径可访问。

## SEO / GEO 检查清单（每篇）

- [ ] 独立 URL，可被直接打开
- [ ] 唯一且准确的 title、description
- [ ] canonical 与线上域名一致
- [ ] 至少 1 个 H1，层级清晰的 H2
- [ ] 图片有 `alt`（若有配图）
- [ ] 文内链回 `../../index.html` 相关区块或列表页
- [ ] sitemap 已包含该 URL
- [ ] JSON-LD `BlogPosting` 日期、作者信息正确

## 运维部署注意

- 路径：`https://域名/blog/index.html`、`https://域名/blog/posts/xxx.html`
- 无需 Node / 数据库；与首页相同静态托管即可
- 上线后在 [Google Search Console](https://search.google.com/search-console) 提交 sitemap

## 后续可扩展（仍保持简单）

- 文章多了：用脚本根据 `posts/` 目录自动生成 `blog/index.html` 和 `sitemap.xml`
- 要运营自助发文：再评估 Astro / Hugo（方法 2），构建结果仍是静态 HTML
