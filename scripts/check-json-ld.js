const fs = require("fs");
const path = require("path");

function walk(dir, out = []) {
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    if (fs.statSync(p).isDirectory()) {
      if (name === "node_modules" || name === ".git") continue;
      walk(p, out);
    } else if (name.endsWith(".html") || name === "package.json") {
      out.push(p);
    }
  }
  return out;
}

let failed = false;
for (const file of walk(".")) {
  const text = fs.readFileSync(file, "utf8");
  if (file.endsWith(".json")) {
    try {
      JSON.parse(text);
    } catch (e) {
      console.log("FAIL", file, e.message);
      failed = true;
    }
    continue;
  }
  const re = /<script type="application\/ld\+json">\s*([\s\S]*?)\s*<\/script>/g;
  let match;
  let block = 0;
  while ((match = re.exec(text))) {
    block += 1;
    try {
      JSON.parse(match[1]);
    } catch (e) {
      console.log("FAIL", file, `block ${block}:`, e.message);
      failed = true;
    }
  }
}

if (!failed) console.log("All JSON-LD blocks OK");
process.exit(failed ? 1 : 0);
