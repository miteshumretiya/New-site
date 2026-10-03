/* Renders the social share image (1200×630) and app icons.
 *
 *   node scripts/render-og.ts
 *
 * Fonts are pulled from Google Fonts and inlined; art comes from public/art.
 * Writes src/app/opengraph-image.png, twitter-image.png, apple-icon.png and
 * icon.svg. Requires Playwright (see render-art.ts). */
import { createRequire } from "node:module";
import { execSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import sharp from "sharp";

const require = createRequire(import.meta.url);
const root = path.resolve(import.meta.dirname, "..");
const appDir = path.join(root, "src/app");

function loadPlaywright() {
  const candidates = ["playwright", process.env.PLAYWRIGHT_MODULE];
  try {
    candidates.push(path.join(execSync("npm root -g").toString().trim(), "playwright"));
  } catch {}
  for (const c of candidates) {
    if (!c) continue;
    try {
      return require(c) as typeof import("playwright");
    } catch {}
  }
  throw new Error("Playwright not found. Install it with: npm i -g playwright && npx playwright install chromium");
}

const UA = "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0 Safari/537.36";
async function inlineFonts(href: string) {
  let css = await (await fetch(href, { headers: { "user-agent": UA } })).text();
  const urls = [...new Set(css.match(/https:\/\/fonts\.gstatic\.com\/[^)]+/g) ?? [])];
  for (const u of urls) {
    const buf = Buffer.from(await (await fetch(u)).arrayBuffer());
    css = css.split(u).join(`data:font/woff2;base64,${buf.toString("base64")}`);
  }
  return css;
}

const fontCss = await inlineFonts(
  "https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62..125,100..900&family=JetBrains+Mono:wght@500&display=block&text=" +
    encodeURIComponent(
      "RHINOSBUILTFORTHELASTREP.STRENGTH&CONDITIONINGCLUBARTSDISTRICTLOSANGELESFIRSTWEEKFREEbuiltforthelastrep—·0123456789:",
    ),
);
const art = (name: string) =>
  `data:image/webp;base64,${readFileSync(path.join(root, "public/art", name)).toString("base64")}`;
const spark = `<svg viewBox="-50 -50 100 100" width="100%" height="100%"><g fill="#ff5a1f">${[0, 45, 90, 135]
  .map((a) => `<rect x="-10" y="-48" width="20" height="96" rx="10" transform="rotate(${a})"/>`)
  .join("")}</g></svg>`;

const og = `<!doctype html><html><head><style>${fontCss}
*{margin:0;box-sizing:border-box}
body{width:1200px;height:630px;background:#0d0d0c;font-family:Archivo;overflow:hidden}
.card{position:absolute;inset:18px;border-radius:34px;background:#f2eee6;overflow:hidden;display:grid;grid-template-columns:1fr 430px}
.copy{padding:46px 0 40px 48px;display:flex;flex-direction:column;justify-content:space-between}
.logo{display:flex;align-items:center;gap:12px;font-stretch:62%;font-weight:860;font-size:34px;color:#0d0d0c;letter-spacing:.01em;text-transform:uppercase}
.logo i{display:block;width:30px;height:30px}
h1{font-stretch:62%;font-weight:880;font-size:132px;line-height:.84;text-transform:uppercase;color:#0d0d0c;letter-spacing:-.012em}
h1 b{color:#ff5a1f}
.meta{font-family:'JetBrains Mono';font-size:17px;letter-spacing:.08em;text-transform:uppercase;color:#5c584f;display:flex;gap:18px;align-items:center}
.dot{width:9px;height:9px;border-radius:9px;background:#ff5a1f}
.art{position:relative;margin:14px 14px 14px 0;border-radius:24px;overflow:hidden;background:#0d0d0c}
.art img{width:100%;height:100%;object-fit:cover;object-position:50% 40%}
.chip{position:absolute;left:18px;bottom:18px;background:#ff5a1f;color:#0d0d0c;border-radius:999px;padding:12px 20px;font-family:'JetBrains Mono';font-size:16px;letter-spacing:.08em;text-transform:uppercase}
</style></head><body><div class="card"><div class="copy">
<div class="logo"><i>${spark}</i>Rhinos</div>
<h1>Built for<br>the last<br>rep<b>.</b></h1>
<div class="meta"><span class="dot"></span>Strength &amp; conditioning club · Arts District, Los Angeles</div>
</div><div class="art"><img src="${art("thruster-bottom.webp")}"><span class="chip">First week free</span></div></div></body></html>`;

const iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="#0d0d0c"/><g transform="translate(32 32) scale(.42)" fill="#ff5a1f">${[
  0, 45, 90, 135,
]
  .map((a) => `<rect x="-10" y="-48" width="20" height="96" rx="10" transform="rotate(${a})"/>`)
  .join("")}</g></svg>\n`;

const { chromium } = loadPlaywright();
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
await page.setContent(og, { waitUntil: "load" });
await page.evaluate(() => document.fonts.ready);
const png = await page.screenshot({ type: "png" });
await browser.close();

const ogPng = await sharp(png).png({ compressionLevel: 9, palette: false }).toBuffer();
writeFileSync(path.join(appDir, "opengraph-image.png"), ogPng);
writeFileSync(path.join(appDir, "twitter-image.png"), ogPng);
const alt = "Rhinos — Built for the last rep. Strength & conditioning club in the Arts District, Los Angeles.";
writeFileSync(path.join(appDir, "opengraph-image.alt.txt"), alt);
writeFileSync(path.join(appDir, "twitter-image.alt.txt"), alt);

writeFileSync(path.join(appDir, "icon.svg"), iconSvg);
await sharp(Buffer.from(iconSvg)).resize(180, 180).png().toFile(path.join(appDir, "apple-icon.png"));
await sharp(Buffer.from(iconSvg)).resize(512, 512).png().toFile(path.join(root, "public/icon-512.png"));
await sharp(Buffer.from(iconSvg)).resize(192, 192).png().toFile(path.join(root, "public/icon-192.png"));
console.log("og + icons written");
