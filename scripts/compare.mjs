/**
 * Images de comparaison côte à côte : site (gauche) / maquette (droite).
 * Usage : node scripts/compare.mjs [baseUrl] [filtre]   (serveur lancé)
 *   filtre : noms ou préfixes séparés par des virgules, ex. « home » ou « outil-email-desktop »
 * Sortie : screenshots/compare-<nom>.png (page entière) + compare-<nom>-<n>.png (tranches)
 *
 * site :
 *   - un chemin (page entière) ;
 *   - ou { stack: [{ path, selector, label }] } : plusieurs états empilés, comme les maquettes d'états.
 * js : les pages de contenu sont capturées SANS JavaScript ; les outils, AVEC (formulaire interactif).
 */
import { chromium } from "@playwright/test";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

const base = process.argv[2] ?? "http://localhost:3000";
const filter = process.argv[3]?.split(",");

const SAISIE = 'section[aria-label="Saisie"]';
const QUOTA = 'section[aria-labelledby="quota-titre"]';

/** [nom, site, maquette, largeur, hauteur de tranche, js] */
const CASES = [
  ["home-desktop", "/", "Home.dc.html", 1440, 1800, false],
  ["home-mobile", "/", "Home-mobile.dc.html", 390, 1600, false],
  ["pilier-desktop", "/biais-cognitifs", "Article-pilier.dc.html", 1440, 2600, false],
  ["satellite-desktop", "/biais-cognitifs/reciprocite", "Article-satellite.dc.html", 1440, 2600, false],
  ["pilier-mobile", "/biais-cognitifs", "Article-mobile.dc.html", 390, 2400, false],
  ["satellite-mobile", "/biais-cognitifs/reciprocite", "Article-mobile.dc.html", 390, 2400, false],

  ["outil-email-desktop", "/analyser-email?etat=resultat", "Outil.dc.html", 1440, 1800, true],
  [
    "outil-email-etats-desktop",
    {
      stack: [
        { path: "/analyser-email?etat=quota", selector: QUOTA, label: "ÉTAT 1 · 3 ANALYSES GRATUITES UTILISÉES" },
        { path: "/analyser-email?etat=erreur", selector: SAISIE, label: "ÉTAT 2 · ERREUR D'ANALYSE" },
        { path: "/analyser-email?etat=court", selector: SAISIE, label: "ÉTAT 3 · TEXTE TROP COURT" },
      ],
    },
    "Outil-etats.dc.html",
    1440,
    1800,
    true,
  ],
  // Pas de maquette desktop du testeur d'accroche : comparé à l'analyseur d'email.
  ["outil-accroche-desktop", "/testeur-accroche?etat=resultat", "Outil.dc.html", 1440, 1800, true],
  ["outil-accroche-mobile", "/testeur-accroche?etat=resultat", "Outil-mobile.dc.html", 390, 1800, true],
  ["outil-accroche-chargement-mobile", "/testeur-accroche?etat=chargement", "Outil-mobile.dc.html", 390, 1000, true],
  [
    "outil-accroche-etats-mobile",
    {
      stack: [
        { path: "/analyser-email?etat=quota", selector: QUOTA, label: "ÉTAT 1 · QUOTA GRATUIT ATTEINT" },
        { path: "/testeur-accroche?etat=erreur", selector: SAISIE, label: "ÉTAT 2 · ERREUR D'ANALYSE" },
        { path: "/testeur-accroche?etat=court", selector: SAISIE, label: "ÉTAT 3 · TEXTE TROP COURT" },
      ],
    },
    "Outil-etats-mobile.dc.html",
    390,
    1600,
    true,
  ],
  ["tarifs-desktop", "/tarifs", "Tarifs.dc.html", 1440, 1900, false],
  ["tarifs-mobile", "/tarifs", "Tarifs-mobile.dc.html", 390, 1600, false],
  // Pas de maquette mobile de l'analyseur d'email : comparé au testeur d'accroche mobile.
  ["outil-email-mobile", "/analyser-email?etat=resultat", "Outil-mobile.dc.html", 390, 1800, true],
];

const selected = filter ? CASES.filter(([n]) => filter.some((f) => n === f || n.startsWith(f + "-"))) : CASES;

const browser = await chromium.launch();

async function open(url, w, js) {
  const ctx = await browser.newContext({ viewport: { width: w, height: 900 }, javaScriptEnabled: js });
  const p = await ctx.newPage();
  await p.goto(url, { waitUntil: "load" });
  await p.evaluate(() => document.fonts.ready);
  await p.waitForTimeout(js ? 800 : 500);
  return { ctx, p };
}

async function shot(url, w, js) {
  const { ctx, p } = await open(url, w, js);
  const buf = await p.screenshot({ fullPage: true });
  const height = await p.evaluate(() => document.documentElement.scrollHeight);
  await ctx.close();
  return { b64: buf.toString("base64"), height };
}

/** États empilés : chaque élément capturé seul, précédé de son étiquette en pointillés. */
async function stack(items, w) {
  const parts = [];
  for (const it of items) {
    const { ctx, p } = await open(base + it.path, w, true);
    const buf = await p.locator(it.selector).screenshot();
    parts.push({ label: it.label, b64: buf.toString("base64") });
    await ctx.close();
  }
  const ctx = await browser.newContext({ viewport: { width: w, height: 900 } });
  const p = await ctx.newPage();
  await p.setContent(`<body style="margin:0;background:#000;font:11px monospace;color:#858585;letter-spacing:.16em">
    ${parts
      .map(
        (x) => `<div style="margin:48px 0 32px;padding:12px 16px;border-top:1px dashed #474747;border-bottom:1px dashed #474747">${x.label}</div>
        <img src="data:image/png;base64,${x.b64}" style="display:block;margin:0 auto">`,
      )
      .join("")}</body>`);
  await p.evaluate(() => Promise.all([...document.images].map((i) => i.decode())));
  const buf = await p.screenshot({ fullPage: true });
  const height = await p.evaluate(() => document.documentElement.scrollHeight);
  await ctx.close();
  return { b64: buf.toString("base64"), height };
}

for (const [name, site, mock, w, slice, js] of selected) {
  const a = typeof site === "string" ? await shot(base + site, w, js) : await stack(site.stack, w);
  const b = await shot(pathToFileURL(resolve("design", mock)).href, w, true);
  const label = typeof site === "string" ? site : "états empilés";
  const gap = 40;
  const head = 60;
  const total = Math.max(a.height, b.height) + head;
  const width = w * 2 + gap * 3;
  const ctx = await browser.newContext({ viewport: { width, height: 900 } });
  const p = await ctx.newPage();
  await p.setContent(`<body style="margin:0;background:#333;font:600 22px system-ui;color:#fff">
    <div style="display:flex;gap:${gap}px;padding:20px ${gap}px 0">
      <div><div style="height:40px">SITE ${label}</div><img src="data:image/png;base64,${a.b64}" style="display:block"></div>
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
