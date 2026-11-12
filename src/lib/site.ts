/**
 * URL publique du site, lue côté serveur au build.
 * Toutes les URLs absolues (canonical, JSON-LD, sitemap) passent par ici.
 */
export const SITE_URL = (process.env.SITE_URL ?? "https://neurocopy.fr").replace(/\/+$/, "");

export const SITE_NAME = "NeuroCopy";
export const SITE_TAGLINE = "Le copy parle au cerveau, pas à l'œil.";

/** Auteur affiché sur les articles. Mention de diplôme confirmée par Renaud le 12/11/2026. */
export const AUTHOR = {
  name: "Renaud",
  fullName: "Renaud Czerwiec",
  initial: "R",
  credential: "diplômé en psychologie",
} as const;

/** Construit une URL absolue à partir d'un chemin (« /biais-cognitifs »). */
export function absoluteUrl(path = "/"): string {
  const clean = path.startsWith("/") ? path : `/${path}`;
  return clean === "/" ? SITE_URL : `${SITE_URL}${clean}`;
}
