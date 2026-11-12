/**
 * Images de comparaison côte à côte : site (gauche, JavaScript désactivé) / maquette (droite).
 * Usage : node scripts/compare.mjs [baseUrl] [filtre]   (serveur lancé)
 *   filtre : noms séparés par des virgules, ex. « home-desktop,home-mobile » ou préfixe « home »
 * Sortie : screenshots/compare-<nom>.png (page entière)
 *          + screenshots/compare-<nom>-<n>.png (tranches, pour la relecture)
 */
import { chromium } from "@playwright/test";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

const base = process.argv[2] ?? "http://localhost:3000";
const filter = process.argv[3]?.split(",");

/** [nom, chemin, maquette, largeur, hauteur de tranche] */
const CASES = [
  ["home-desktop", "/", "Home.dc.html", 1440, 1800],
  ["home-mobile", "/", "Home-mobile.dc.html", 390, 1600],
  ["pilier-desktop", "/biais-cognitifs", "Article-pilier.dc.html", 1440, 2600],
  ["satellite-desktop", "/biais-cognitifs/reciprocite", "Article-satellite.dc.html", 1440, 2600],
  ["pilier-mobile", "/biais-cognitifs", "Article-mobile.dc.html", 390, 2400],
  ["satellite-mobile", "/biais-cognitifs/reciprocite", "Article-mobile.dc.html", 390, 2400],
];

const selected = filter ? CASES.filter(([n]) => filter.some((f) => n === f || n.startsWith(f + "-"))) : CASES;

const browser = await chromium.launch();

async function shot(url, w, js) {
  const ctx = await browser.newContext({ viewport: { width: w, height: 900 }, javaScriptEnabled: js });
  const p = await ctx.newPage();
  await p.goto(url, { waitUntil: "load" });
  await p.evaluate(() => document.fonts.ready);
  await p.waitForTimeout(500);
  const buf = await p.screenshot({ fullPage: true });
  const height = await p.evaluate(() => document.documentElement.scrollHeight);
  await ctx.close();
  return { b64: buf.toString("base64"), height };
}

for (const [name, path, mock, w, slice] of selected) {
  const a = await shot(base + path, w, false);
  const b = await shot(pathToFileURL(resolve("design", mock)).href, w, true);
  const gap = 40;
  const head = 60;
  const total = Math.max(a.height, b.height) + head;
  const width = w * 2 + gap * 3;
  const ctx = await browser.newContext({ viewport: { width, height: 900 } });
  const p = await ctx.newPage();
  await p.setContent(`<body style="margin:0;background:#333;font:600 22px system-ui;color:#fff">
    <div style="display:flex;gap:${gap}px;padding:20px ${gap}px 0">
      <div><div style="height:40px">SITE ${path}</div><img src="data:image/png;base64,${a.b64}" style="display:block"></div>
      <div><div style="height:40px">MAQUETTE ${mock}</div><img src="data:image/png;base64,${b.b64}" style="display:block"></div>
    </div></body>`);
  await p.evaluate(() => Promise.all([...document.images].map((i) => i.decode())));
  await p.screenshot({ path: resolve("screenshots", `compare-${name}.png`), fullPage: true });
  let n = 1;
  for (let y = 0; y < total; y += slice, n++) {
    await p.screenshot({
      path: resolve("screenshots", `compare-${name}-${n}.png`),
      fullPage: true,
      clip: { x: 0, y, width, height: Math.min(slice, total - y) },
    });
  }
  await ctx.close();
  console.log(`✓ compare-${name}.png (${n - 1} tranches, site ${a.height}px / maquette ${b.height}px)`);
}
await browser.close();
