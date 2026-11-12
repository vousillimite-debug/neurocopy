/**
 * Import de data/pages_rows.csv dans la table `pages` du projet Supabase NEUF.
 *
 * Usage :
 *   node scripts/import-pages.mjs              → simulation : contrôle et résumé, rien n'est envoyé
 *   node --env-file=.env.local scripts/import-pages.mjs --apply
 *                                               → envoi (upsert sur le slug)
 *
 * Variables (serveur uniquement) : SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY.
 *
 * Règles :
 * - aucun texte n'est modifié ;
 * - seule transformation : dans h2_sections, la clé « body » est renommée « contenu » (même texte) ;
 * - la ligne de test (cocon = "test") est ignorée ;
 * - les colonnes `exemples` et `sources` ne sont JAMAIS envoyées : elles restent vides
 *   (ou gardent ce que Renaud y a saisi à la main).
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { parse } from "csv-parse/sync";

const APPLY = process.argv.includes("--apply");
const CSV = resolve("data", "pages_rows.csv");
const BATCH = 50;

const JSON_COLS = ["schema_extra", "faq_schema", "breadcrumb", "h2_sections", "faq", "internal_links"];
const ARRAY_COLS = new Set(["h2_sections", "faq", "internal_links"]);
const INT_COLS = ["volume_mensuel", "kd"];

function fail(msg) {
  console.error("✗", msg);
  process.exit(1);
}

function toRow(r) {
  const row = { ...r };
  for (const c of JSON_COLS) {
    const raw = (r[c] ?? "").trim();
    try {
      row[c] = raw ? JSON.parse(raw) : ARRAY_COLS.has(c) ? [] : null;
    } catch {
      fail(`${r.slug} : JSON invalide dans « ${c} »`);
    }
  }
  for (const c of INT_COLS) {
    const raw = (r[c] ?? "").trim();
    row[c] = raw ? Number.parseInt(raw, 10) : null;
  }
  let renamed = 0;
  row.h2_sections = row.h2_sections.map((s) => {
    if (s.contenu === undefined && s.body !== undefined) {
      renamed++;
      const { body, ...rest } = s;
      return { ...rest, contenu: body };
    }
    return s;
  });
  delete row.exemples;
  delete row.sources;
  return { row, renamed };
}

const raw = parse(readFileSync(CSV, "utf8"), { columns: true, bom: true, skip_empty_lines: true });
const kept = raw.filter((r) => r.cocon !== "test");

let renamedTotal = 0;
const rows = kept.map((r) => {
  const { row, renamed } = toRow(r);
  renamedTotal += renamed;
  if (!["pilier", "satellite"].includes(row.type)) fail(`${row.slug} : type inattendu « ${row.type} »`);
  if (!row.h1) fail(`${row.slug} : h1 vide`);
  return row;
});

const slugs = new Set(rows.map((r) => r.slug));
if (slugs.size !== rows.length) fail("slugs en double dans le CSV");

console.log(`Lignes CSV : ${raw.length} · ignorées (test) : ${raw.length - kept.length} · à importer : ${rows.length}`);
console.log(`Piliers : ${rows.filter((r) => r.type === "pilier").length} · satellites : ${rows.filter((r) => r.type === "satellite").length}`);
console.log(`Sections « body » renommées en « contenu » : ${renamedTotal}`);
console.log("Colonnes exemples / sources : non envoyées (restent vides).");

if (!APPLY) {
  console.log("\nSimulation uniquement. Ajoute --apply pour envoyer.");
  process.exit(0);
}

const url = process.env.SUPABASE_URL?.replace(/\/+$/, "");
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) fail("SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY requis (fichier .env.local).");

for (let i = 0; i < rows.length; i += BATCH) {
  const chunk = rows.slice(i, i + BATCH);
  const res = await fetch(`${url}/rest/v1/pages?on_conflict=slug`, {
    method: "POST",
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      Prefer: "resolution=merge-duplicates,return=minimal",
    },
    body: JSON.stringify(chunk),
  });
  if (!res.ok) fail(`lot ${i / BATCH + 1} : ${res.status} ${await res.text()}`);
  console.log(`✓ ${Math.min(i + BATCH, rows.length)} / ${rows.length}`);
}
console.log("Import terminé.");
