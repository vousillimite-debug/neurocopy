/**
 * Images de comparaison côte à côte : site (gauche) / maquette (droite).
 * Usage : node scripts/compare.mjs [baseUrl]   (serveur lancé)
 * Sortie : screenshots/compare-*.png
 */
import { chromium } from "@playwright/test";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

const base = process.argv[2] ?? "http://localhost:3000";
const CASES = [
  ["pilier-desktop", "/biais-cognitifs", "Article-pilier.dc.html", 1440, 2600],
  ["satellite-desktop", "/biais-cognitifs/reciprocite", "Article-satellite.dc.html", 1440, 2600],
  ["pilier-mobile", "/biais-cognitifs", "Article-mobile.dc.html", 390, 2400],
  ["satellite-mobile", "/biais-cognitifs/reciprocite", "Article-mobile.dc.html", 390, 2400],
];

const browser = await chromium.launch();
async function shot(url, w, h, js) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, javaScriptEnabled: js });
  const p = await ctx.newPage();
  await p.goto(url, { waitUntil: "load" });
  await p.evaluate(() => document.fonts.ready);
  await p.waitForTimeout(500);
  const buf = await p.screenshot();
  await ctx.close();
  return buf.toString("base64");
}
for (const [name, path, mock, w, h] of CASES) {
  const a = await shot(base + path, w, h, false);
  const b = await shot(pathToFileURL(resolve("design", mock)).href, w, h, true);
  const gap = 40;
  const ctx = await browser.newContext({ viewport: { width: w * 2 + gap * 3, height: h + 90 } });
  const p = await ctx.newPage();
  await p.setContent(`<body style="margin:0;background:#333;font:600 22px system-ui;color:#fff">
    <div style="display:flex;gap:${gap}px;padding:20px ${gap}px">
      <div><div style="height:40px">SITE ${path}</div><img src="data:image/png;base64,${a}"></div>
      <div><div style="height:40px">MAQUETTE ${mock}</div><img src="data:image/png;base64,${b}"></div>
    </div></body>`);
  await p.screenshot({ path: resolve("screenshots", `compare-${name}.png`), fullPage: true });
  await ctx.close();
  console.log("✓ compare-" + name + ".png");
}
await browser.close();
