/**
 * Accès aux pages de contenu.
 * Source actuelle : data/pages_rows.csv, lu au BUILD uniquement (fichier serveur).
 * Plus tard : Supabase (même forme de données, seule cette couche changera).
 *
 * Règle : on ne modifie jamais les textes. On ne fait que les structurer pour le rendu.
 */
import "server-only";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { parse } from "csv-parse/sync";
import { resolveRedirect } from "./redirects";

export type H2Section = { h2: string; contenu: string };
export type FaqItem = { q: string; a: string };
export type InternalLink = { url: string; label: string };
export type BreadcrumbItem = { url: string; name: string; position: number };
export type PageType = "pilier" | "satellite";

/** Une ligne de la table `pages`, JSON déjà décodé. */
export type ContentPage = {
  id: string;
  created_at: string;
  updated_at: string;
  slug: string;
  cocon: string;
  type: PageType;
  statut: string;
  mot_cle_principal: string;
  volume_mensuel: number | null;
  kd: number | null;
  concurrence: string;
  meta_title: string;
  meta_description: string;
  canonical: string;
  og_title: string;
  og_description: string;
  og_type: string;
  schema_type: string;
  /** Objet JSON-LD natif (jamais une chaîne). */
  schema_extra: Record<string, unknown> | null;
  faq_schema: Record<string, unknown> | null;
  breadcrumb: BreadcrumbItem[] | null;
  h1: string;
  reponse_directe: string;
  intro: string;
  h2_sections: H2Section[];
  faq: FaqItem[];
  cta_text: string;
  note_editoriale: string;
  internal_links: InternalLink[];
  /** Saisis à la main par Renaud, sources vérifiées. Absents du CSV : toujours null pour l'instant. */
  exemples: Exemple[] | null;
  sources: Source[] | null;
};

export type Exemple = { contexte: string; avant: string; apres: string; biais?: string; source?: string };
export type Source = { auteur: string; annee?: string; titre?: string; url?: string };

type RawRow = Record<string, string>;

const CSV_PATH = join(process.cwd(), "data", "pages_rows.csv");

function json<T>(raw: string | undefined, fallback: T): T {
  if (!raw || !raw.trim()) return fallback;
  return JSON.parse(raw) as T;
}

function num(raw: string | undefined): number | null {
  if (!raw || !raw.trim()) return null;
  const n = Number(raw);
  return Number.isFinite(n) ? n : null;
}

function toPage(r: RawRow): ContentPage {
  return {
    id: r.id,
    created_at: r.created_at,
    updated_at: r.updated_at,
    slug: r.slug,
    cocon: r.cocon,
    type: r.type as PageType,
    statut: r.statut,
    mot_cle_principal: r.mot_cle_principal,
    volume_mensuel: num(r.volume_mensuel),
    kd: num(r.kd),
    concurrence: r.concurrence,
    meta_title: r.meta_title,
    meta_description: r.meta_description,
    canonical: r.canonical,
    og_title: r.og_title,
    og_description: r.og_description,
    og_type: r.og_type,
    schema_type: r.schema_type,
    schema_extra: json(r.schema_extra, null),
    faq_schema: json(r.faq_schema, null),
    breadcrumb: json(r.breadcrumb, null),
    h1: r.h1,
    reponse_directe: r.reponse_directe,
    intro: r.intro,
    // 59 sections du CSV utilisent la clé « body » au lieu de « contenu » : même texte, on harmonise la clé.
    h2_sections: json<Array<{ h2: string; contenu?: string; body?: string }>>(r.h2_sections, []).map((s) => ({
      h2: s.h2,
      contenu: s.contenu ?? s.body ?? "",
    })),
    faq: json(r.faq, []),
    cta_text: r.cta_text,
    note_editoriale: r.note_editoriale,
    internal_links: json(r.internal_links, []),
    exemples: null,
    sources: null,
  };
}

let cache: ContentPage[] | null = null;

/** Toutes les pages publiées (ligne de test exclue). */
export function getAllPages(): ContentPage[] {
  if (cache) return cache;
  const rows = parse(readFileSync(CSV_PATH, "utf8"), {
    columns: true,
    bom: true,
    skip_empty_lines: true,
  }) as RawRow[];
  cache = rows
    .filter((r) => r.cocon !== "test")
    .filter((r) => r.statut === "publie")
    .filter((r) => r.type === "pilier" || r.type === "satellite")
    .map(toPage);
  return cache;
}

export function getPage(slug: string): ContentPage | undefined {
  return getAllPages().find((p) => p.slug === slug);
}

/** Chemin interne d'une page : « /biais-cognitifs/reciprocite ». */
export function pagePath(p: Pick<ContentPage, "slug">): string {
  return `/${p.slug}`;
}

function bySlugPath(path: string): ContentPage | undefined {
  return getPage(path.replace(/^\/+/, "").replace(/\/+$/, ""));
}

/**
 * Pilier de rattachement d'un satellite :
 * 1. le pilier indiqué en position 2 du fil d'Ariane ;
 * 2. sinon le premier lien interne vers un pilier du même cocon ;
 * 3. sinon le pilier du cocon s'il est unique.
 */
export function getParentPilier(p: ContentPage): ContentPage | undefined {
  if (p.type === "pilier") return undefined;
  const isPilierOfCocon = (c?: ContentPage) => c && c.type === "pilier" && c.cocon === p.cocon;

  const bc2 = p.breadcrumb?.find((b) => b.position === 2);
  if (bc2 && (p.breadcrumb?.length ?? 0) >= 3) {
    const c = bySlugPath(new URL(bc2.url).pathname);
    if (isPilierOfCocon(c)) return c;
  }
  for (const l of p.internal_links) {
    const c = bySlugPath(resolveRedirect(l.url));
    if (isPilierOfCocon(c)) return c;
  }
  const piliers = getAllPages().filter((x) => x.type === "pilier" && x.cocon === p.cocon);
  return piliers.length === 1 ? piliers[0] : undefined;
}

/* ── Lecture ───────────────────────────────── */

const WORDS_PER_MINUTE = 220;

function countWords(s: string): number {
  return s.split(/\s+/).filter(Boolean).length;
}

/** Temps de lecture estimé, en minutes (calculé, jamais inventé). */
export function readingMinutes(p: ContentPage): number {
  const text = [
    p.reponse_directe,
    p.intro,
    ...p.h2_sections.flatMap((s) => [s.h2, s.contenu]),
    ...p.faq.flatMap((f) => [f.q, f.a]),
    p.note_editoriale,
  ].join(" ");
  return Math.max(1, Math.round(countWords(text) / WORDS_PER_MINUTE));
}

/* ── Liens internes ────────────────────────── */

export type ResolvedLink = {
  href: string;
  label: string;
  target: ContentPage;
};

/**
 * Liens internes prêts à afficher : redirections appliquées,
 * cibles inexistantes écartées (jamais de lien mort publié).
 */
export function getResolvedLinks(p: ContentPage): ResolvedLink[] {
  const seen = new Set<string>();
  const out: ResolvedLink[] = [];
  for (const l of p.internal_links) {
    const href = resolveRedirect(l.url.replace(/\/+$/, "") || "/");
    const target = bySlugPath(href);
    if (!target || target.slug === p.slug || seen.has(href)) continue;
    seen.add(href);
    out.push({ href, label: l.label, target });
  }
  return out;
}

/* ── CTA ───────────────────────────────────── */

/** Découpe « Texte → /chemin » sans toucher au texte. */
export function splitCta(cta: string): { text: string; path: string | null } {
  const m = cta.match(/^(.*?)\s*→\s*(\/\S*)\s*$/s);
  if (!m) return { text: cta.trim(), path: null };
  return { text: m[1].trim(), path: m[2] };
}

/* ── Texte brut → paragraphes ──────────────── */

/** Les contenus sont en texte brut : paragraphes séparés par une ligne vide. */
export function toParagraphs(text: string): string[] {
  return text
    .split(/\n\s*\n/)
    .map((s) => s.trim())
    .filter(Boolean);
}
