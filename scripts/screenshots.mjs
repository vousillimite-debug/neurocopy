/**
 * Captures desktop (1440) et mobile (390) des pages du site et des maquettes de référence.
 *
 * Usage : node scripts/screenshots.mjs [baseUrl]
 *   baseUrl par défaut : http://localhost:3000 (lancer `npm run build && npm start` avant)
 *
 * Les pages du site sont capturées JavaScript DÉSACTIVÉ : elles doivent fonctionner sans.
 * Sortie : screenshots/ (ignoré par git).
 */
import { chromium } from "@playwright/test";
import { mkdirSync } from "node:fs";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

const base = process.argv[2] ?? "http://localhost:3000";
const out = resolve("screenshots");
mkdirSync(out, { recursive: true });

const VIEWPORTS = { desktop: { width: 1440, height: 900 }, mobile: { width: 390, height: 844 } };

/** [nom, chemin du site, maquette desktop, maquette mobile] */
const PAGES = [
  ["home", "/", "Home.dc.html", "Home-mobile.dc.html"],
  ["styleguide", "/styleguide", null, null],
  // Pas de maquette pilier mobile : on compare au satellite mobile.
  ["pilier", "/biais-cognitifs", "Article-pilier.dc.html", "Article-mobile.dc.html"],
  ["satellite", "/biais-cognitifs/reciprocite", "Article-satellite.dc.html", "Article-mobile.dc.html"],
];

// Filtre optionnel : node scripts/screenshots.mjs http://localhost:3000 pilier,satellite
const only = process.argv[3]?.split(",");
if (only) PAGES.splice(0, PAGES.length, ...PAGES.filter(([n]) => only.includes(n)));

const browser = await chromium.launch();

async function shoot({ url, file, viewport, js, before }) {
  const ctx = await browser.newContext({ viewport, javaScriptEnabled: js, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  await page.goto(url, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts?.ready).catch(() => {});
  if (before) await before(page);
  await page.screenshot({ path: resolve(out, file), fullPage: true });
  await ctx.close();
  console.log("✓", file);
}

for (const [name, path, mockDesktop, mockMobile] of PAGES) {
  for (const [vp, size] of Object.entries(VIEWPORTS)) {
    await shoot({ url: base + path, file: `${name}-${vp}.png`, viewport: size, js: false });
    const mock = vp === "desktop" ? mockDesktop : mockMobile;
    if (mock) {
      const url = pathToFileURL(resolve("design", mock)).href;
      await shoot({ url, file: `${name}-${vp}-maquette.png`, viewport: size, js: true });
    }
  }
}

// Menu mobile ouvert, sans JavaScript (clic sur le <summary>)
await shoot({
  url: base + "/styleguide",
  file: "nav-mobile-ouverte.png",
  viewport: VIEWPORTS.mobile,
  js: false,
  before: (p) => p.click("summary"),
});

await browser.close();
