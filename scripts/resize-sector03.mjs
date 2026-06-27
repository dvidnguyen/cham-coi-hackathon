import sharp from "sharp";
import { readdir, writeFile, stat } from "node:fs/promises";
import path from "node:path";

const DIR = "public/home-sector03";
const MAX = 1000;

const files = (await readdir(DIR)).filter(
  (f) => /\.(jpe?g|webp|png)$/i.test(f) && !f.endsWith(".tmp"),
);

for (const f of files) {
  const src = path.join(DIR, f);
  try {
    const meta = await sharp(src).metadata();
    if (meta.width <= MAX && meta.height <= MAX) {
      console.log(`${f}  skip (${meta.width}x${meta.height})`);
      continue;
    }
    const ext = path.extname(f).toLowerCase();
    const img = sharp(src)
      .rotate()
      .resize({ width: MAX, height: MAX, fit: "inside", withoutEnlargement: true });
    const buf =
      ext === ".webp"
        ? await img.webp({ quality: 78 }).toBuffer()
        : await img.jpeg({ quality: 78, mozjpeg: true }).toBuffer();
    await writeFile(src, buf);
    const after = await sharp(src).metadata();
    const kb = Math.round((await stat(src)).size / 1024);
    console.log(`${f}  ->  ${after.width}x${after.height}  (${kb} KB)`);
  } catch (e) {
    console.log(`${f}  ERROR: ${e.code || e.message}`);
  }
}
console.log("done");
