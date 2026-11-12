/**
 * Règles de présentation des articles. Aucune ne modifie un texte :
 * elles découpent, colorent ou complètent l'interface autour.
 */
import { routes } from "./routes";

/** Majuscule initiale pour un libellé d'interface (le texte source reste intact). */
export function ucfirst(s: string): string {
  return s ? s.charAt(0).toLocaleUpperCase("fr-FR") + s.slice(1) : s;
}

export type SplitTitle = {
  first: string;
  /** Deuxième ligne (grise), sans son dernier mot. */
  second?: string;
  /** Dernier mot de la deuxième ligne, mis en jaune. */
  keyword?: string;
};

const SEPARATORS = [" — ", " : ", " – "];

/**
 * Titre signature à partir d'un H1 en une ligne.
 * « A — B » / « A : B » → ligne 1 « A — » / « A : », ligne 2 « B » avec son dernier mot en jaune.
 * Le séparateur reste affiché en fin de ligne 1 : le texte est identique, seule la mise en forme change.
 */
export function splitTitle(h1: string): SplitTitle {
  for (const sep of SEPARATORS) {
    const i = h1.indexOf(sep);
    if (i > 0 && i < h1.length - sep.length) {
      const first = h1.slice(0, i) + sep.trimEnd();
      const rest = h1.slice(i + sep.length).trim();
      const j = rest.lastIndexOf(" ");
      return j > 0
        ? { first, second: rest.slice(0, j + 1), keyword: rest.slice(j + 1) }
        : { first, second: "", keyword: rest };
    }
  }
  return { first: h1 };
}

/** Identifiant d'ancre stable à partir d'un titre. */
export function slugify(s: string): string {
  return s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/['’]/g, "-")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60)
    .replace(/-+$/g, "");
}

/** Ancres uniques pour une liste de titres. */
export function anchorsFor(titles: string[]): string[] {
  const used = new Map<string, number>();
  return titles.map((t) => {
    const base = slugify(t) || "section";
    const n = used.get(base) ?? 0;
    used.set(base, n + 1);
    return n ? `${base}-${n + 1}` : base;
  });
}

/** « 15 mai 2026 » */
export function formatDate(iso: string): string {
  const d = new Date(iso.replace(" ", "T").replace(/\+00$/, "Z"));
  return new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "short", year: "numeric", timeZone: "Europe/Paris" }).format(d);
}

export function isoDate(iso: string): string {
  return new Date(iso.replace(" ", "T").replace(/\+00$/, "Z")).toISOString();
}

/* ── CTA contextuel ────────────────────────── */

export type CtaTarget = {
  href: string;
  button: string;
  eyebrow: string;
  reassurance?: string;
};

/**
 * Où mène le chemin écrit dans cta_text (« → /analyser »), en attendant l'app.
 * /analyser → analyseur d'email gratuit (étape 3) ; /rediger et /comparer → tarifs.
 * À ajuster quand l'app payante existera (étape 5).
 */
export function ctaTarget(path: string | null): CtaTarget {
  switch (path) {
    case "/rediger":
      return { href: routes.tarifs, button: "Découvrir Rédiger →", eyebrow: "Passe à l'écriture" };
    case "/comparer":
      return { href: routes.tarifs, button: "Découvrir Comparer →", eyebrow: "Avant l'envoi" };
    case "/analyser":
    default:
      return {
        href: routes.outils.analyseurEmail,
        button: "Analyser mon email →",
        eyebrow: "Mets-le en pratique",
        reassurance: "Gratuit, sans carte bancaire.",
      };
  }
}
