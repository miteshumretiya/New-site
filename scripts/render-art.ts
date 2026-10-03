/* Renders the static thermal artwork into public/art/*.webp.
 *
 *   node scripts/render-art.ts            # all scenes
 *   node scripts/render-art.ts deadlift   # only matching files
 *   SHEET=out.png node scripts/render-art.ts   # also write a contact sheet
 *
 * Needs Playwright with Chromium (npm i -g playwright && npx playwright
 * install chromium). WebGL runs through SwiftShader, so no GPU is required. */
import { createRequire } from "node:module";
import { execSync } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import sharp from "sharp";
import { artJobs } from "../src/lib/thermal/scenes.ts";
import { fragmentShader, sceneUniforms, vertexShader } from "../src/lib/thermal/shader.ts";

const require = createRequire(import.meta.url);
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

const SS = 1.5; // supersampling factor
const outDir = path.resolve(import.meta.dirname, "../public/art");
mkdirSync(outDir, { recursive: true });

const filter = process.argv.slice(2);
const jobs = artJobs.filter((j) => !filter.length || filter.some((f) => j.file.includes(f)));

const page = (w: number, h: number, uniforms: Record<string, unknown>, time: number) => `<!doctype html>
<html><body style="margin:0;background:#000"><canvas id="c" width="${w}" height="${h}"></canvas>
<script>
const U = ${JSON.stringify(uniforms)};
const c = document.getElementById('c');
const gl = c.getContext('webgl', { preserveDrawingBuffer: true, antialias: false });
function sh(t, s) { const o = gl.createShader(t); gl.shaderSource(o, s); gl.compileShader(o);
  if (!gl.getShaderParameter(o, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(o)); return o; }
const p = gl.createProgram();
gl.attachShader(p, sh(gl.VERTEX_SHADER, ${JSON.stringify(vertexShader)}));
gl.attachShader(p, sh(gl.FRAGMENT_SHADER, ${JSON.stringify(fragmentShader)}));
gl.linkProgram(p); gl.useProgram(p);
const b = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, b);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,3,-1,-1,3]), gl.STATIC_DRAW);
const loc = gl.getAttribLocation(p, 'aPos'); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
const u = (n) => gl.getUniformLocation(p, n);
gl.uniform2f(u('uRes'), c.width, c.height);
gl.uniform1f(u('uTime'), ${time});
gl.uniform2fv(u('uJ'), U.uJ);
for (const k of ['uView','uBody','uBody2','uEnv']) gl.uniform4fv(u(k), U[k]);
for (const k of ['uCaps','uCapsP','uDisc','uDiscP']) gl.uniform4fv(u(k), U[k]);
gl.uniform1i(u('uCapN'), U.uCapN); gl.uniform1i(u('uDiscN'), U.uDiscN);
gl.drawArrays(gl.TRIANGLES, 0, 3);
document.title = 'done';
</script></body></html>`;

const toPlain = (o: Record<string, unknown>) =>
  Object.fromEntries(Object.entries(o).map(([k, v]) => [k, v instanceof Float32Array ? Array.from(v) : v]));

const { chromium } = loadPlaywright();
const browser = await chromium.launch({
  args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist"],
});
const ctx = await browser.newContext();

const thumbs: Buffer[] = [];
for (const job of jobs) {
  const w = Math.round(job.w * SS);
  const h = Math.round(job.h * SS);
  const pg = await ctx.newPage({ viewport: { width: w, height: h } });
  pg.on("pageerror", (e) => console.error("page error:", e.message));
  await pg.setContent(page(w, h, toPlain(sceneUniforms(job.scene)), job.time ?? 1.7));
  await pg.waitForFunction(() => document.title === "done", null, { timeout: 60_000 });
  const png = await pg.locator("#c").screenshot({ type: "png" });
  await pg.close();
  const file = path.join(outDir, `${job.file}.webp`);
  const info = await sharp(png)
    .resize(job.w, job.h, { kernel: "lanczos3" })
    .webp({ quality: 80, effort: 6 })
    .toFile(file);
  console.log(`${job.file.padEnd(16)} ${job.w}x${job.h}  ${(info.size / 1024).toFixed(1)} KB`);
  if (process.env.SHEET)
    thumbs.push(
      await sharp(png)
        .resize(300, Math.round((300 * job.h) / job.w))
        .png()
        .toBuffer(),
    );
}
await browser.close();

if (process.env.SHEET && thumbs.length) {
  const cols = 6;
  const cell = { w: 300, h: 400 };
  const rows = Math.ceil(thumbs.length / cols);
  const composite = thumbs.map((input, i) => ({
    input,
    left: (i % cols) * cell.w,
    top: Math.floor(i / cols) * cell.h,
  }));
  const sheet = await sharp({
    create: { width: cols * cell.w, height: rows * cell.h, channels: 3, background: "#111" },
  })
    .composite(composite)
    .png()
    .toBuffer();
  writeFileSync(process.env.SHEET, sheet);
  console.log("sheet →", process.env.SHEET);
}
