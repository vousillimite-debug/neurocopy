/**
 * Redirections permanentes validées par Renaud (12/11/2026).
 * Utilisées à deux endroits :
 *  - next.config.ts : redirection 308 si quelqu'un arrive sur l'ancienne adresse ;
 *  - au rendu des liens internes : on pointe directement vers la cible (pas de saut inutile).
 * Le texte du CSV n'est jamais modifié.
 */
export const REDIRECTS: Record<string, string> = {
  "/psychologie-marketing": "/psychologie-marketing-guide",
  "/copywriting-conversion": "/cro-psychologique",
  "/neuromarketing-copywriting": "/neuromarketing-definition",
  "/taux-ouverture-email-psychologie": "/psychologie-objet-email",
};

/** Renvoie la cible finale d'un chemin interne (inchangé s'il n'est pas redirigé). */
export function resolveRedirect(path: string): string {
  return REDIRECTS[path] ?? path;
}
