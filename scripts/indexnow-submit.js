/**
 * 向 IndexNow 提交 URL（Bing、Yandex 等搜索引擎会接收）。
 *
 * 用法：
 *   node scripts/indexnow-submit.js --sitemap              # 提交 sitemap 全部 URL
 *   node scripts/indexnow-submit.js --url https://...      # 提交单个 URL（可重复）
 *   node scripts/indexnow-submit.js --urls a.html,b.html   # 提交相对路径（逗号分隔）
 *
 * 部署后首次使用：确认 https://www.ziwei.ink/{KEY}.txt 可公开访问。
 */
const fs = require("fs");
const path = require("path");
const { SITE_ORIGIN, SITE_HOST, INDEXNOW_KEY } = require("./site-config");

const ROOT = path.join(__dirname, "..");
const SITEMAP_PATH = path.join(ROOT, "sitemap.xml");
const INDEXNOW_ENDPOINT = "https://api.indexnow.org/indexnow";
const BATCH_SIZE = 100;
const BATCH_DELAY_MS = 1000;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function parseArgs(argv) {
  const options = { urls: [], sitemap: false };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--sitemap") {
      options.sitemap = true;
    } else if (arg === "--url" && argv[i + 1]) {
      options.urls.push(argv[i + 1]);
      i += 1;
    } else if (arg === "--urls" && argv[i + 1]) {
      options.urls.push(...argv[i + 1].split(",").map((u) => u.trim()).filter(Boolean));
      i += 1;
    } else if (arg === "--help" || arg === "-h") {
      options.help = true;
    }
  }
  return options;
}

function normalizeUrl(input) {
  if (/^https?:\/\//i.test(input)) {
    return input.replace(/\/+$/, "") || input;
  }
  const trimmed = input.replace(/^\/+/, "");
  return `${SITE_ORIGIN}/${trimmed}`;
}

function readSitemapUrls() {
  const xml = fs.readFileSync(SITEMAP_PATH, "utf8");
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim());
}

function chunk(list, size) {
  const out = [];
  for (let i = 0; i < list.length; i += size) {
    out.push(list.slice(i, i + size));
  }
  return out;
}

async function submitBatch(urlList) {
  const payload = {
    host: SITE_HOST,
    key: INDEXNOW_KEY,
    keyLocation: `${SITE_ORIGIN}/${INDEXNOW_KEY}.txt`,
    urlList,
  };

  const response = await fetch(INDEXNOW_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify(payload),
  });

  const body = await response.text();
  return { status: response.status, body };
}

function printHelp() {
  console.log(`IndexNow URL submission

Commands:
  npm run indexnow:sitemap
  npm run indexnow -- --url https://www.ziwei.ink/blog/posts/example.html
  npm run indexnow -- --urls blog/posts/a.html,en/blog/posts/a.html

Key file (must be deployed):
  ${SITE_ORIGIN}/${INDEXNOW_KEY}.txt
`);
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  if (options.help) {
    printHelp();
    return;
  }

  let urls = options.urls.map(normalizeUrl);
  if (options.sitemap) {
    urls = readSitemapUrls();
  }

  urls = [...new Set(urls)];
  if (urls.length === 0) {
    console.error("No URLs to submit. Use --sitemap, --url, or --urls.");
    printHelp();
    process.exit(1);
  }

  const keyFile = path.join(ROOT, `${INDEXNOW_KEY}.txt`);
  if (!fs.existsSync(keyFile)) {
    console.error(`Missing key file: ${keyFile}`);
    process.exit(1);
  }

  console.log(`Submitting ${urls.length} URL(s) to IndexNow…`);
  console.log(`Key location: ${SITE_ORIGIN}/${INDEXNOW_KEY}.txt`);

  const batches = chunk(urls, BATCH_SIZE);
  let ok = 0;
  let fail = 0;

  for (let i = 0; i < batches.length; i += 1) {
    const batch = batches[i];
    const { status, body } = await submitBatch(batch);
    if (status === 200 || status === 202) {
      ok += batch.length;
      console.log(`Batch ${i + 1}/${batches.length}: OK (${batch.length} URLs, HTTP ${status})`);
    } else {
      fail += batch.length;
      console.error(`Batch ${i + 1}/${batches.length}: FAILED (HTTP ${status})`);
      if (body) console.error(body);
    }
    if (i < batches.length - 1) {
      await sleep(BATCH_DELAY_MS);
    }
  }

  console.log(`Done. submitted=${ok}, failed=${fail}`);
  if (fail > 0) {
    process.exit(1);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
