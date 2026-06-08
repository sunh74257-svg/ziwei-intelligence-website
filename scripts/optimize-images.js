const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const imagesDir = path.join(__dirname, "..", "assets", "images");
const quality = 82;

async function convertPngToWebp(file) {
  const input = path.join(imagesDir, file);
  const output = input.replace(/\.png$/i, ".webp");
  const before = fs.statSync(input).size;

  await sharp(input).webp({ quality, effort: 4 }).toFile(output);

  const after = fs.statSync(output).size;
  const saved = ((1 - after / before) * 100).toFixed(1);
  console.log(`${file}: ${(before / 1024).toFixed(1)}KB -> ${(after / 1024).toFixed(1)}KB (-${saved}%)`);
}

async function main() {
  const files = fs.readdirSync(imagesDir).filter((f) => f.endsWith(".png"));
  for (const file of files) {
    await convertPngToWebp(file);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
