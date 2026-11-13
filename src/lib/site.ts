/**
 * URL publique du site, lue côté serveur au build.
 * Toutes les URLs absolues (canonical, JSON-LD, sitemap) passent par ici.
 */
export const SITE_URL = (process.env.SITE_URL ?? "https://neurocopy.fr").replace(/\/+$/, "");

/**
 * Indexation par les moteurs : autorisée UNIQUEMENT si les deux conditions sont réunies.
 * - VERCEL_ENV === "production" (posée par Vercel ; absente en local, « preview » sur les prévisualisations) ;
 * - ALLOW_INDEXING === "true" (à poser par Renaud le jour de la mise en ligne, domaine connecté).
 * Sinon : balise <meta name="robots" content="noindex, nofollow"> + en-tête X-Robots-Tag sur toutes les réponses.
 * Lu au build (pages statiques) : changer ALLOW_INDEXING demande un nouveau déploiement.
 */
export const INDEXING_ALLOWED = process.env.VERCEL_ENV === "production" && process.env.ALLOW_INDEXING === "true";

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
