/**
 * Adresses internes du site, centralisées ici pour pouvoir les changer en un seul endroit.
 * Les pages /analyser, /corriger, /rediger, /comparer (app) arrivent à l'étape 5.
 */
export const routes = {
  home: "/",
  methode: "/#methode",
  demo: "/#demo",
  /** Section « Les 5 modules » de la homepage : cible des liens Produit tant que l'app n'existe pas. */
  modules: "/#modules",
  tarifs: "/tarifs",
  connexion: "/connexion", // statique, sans authentification
  inscription: "/inscription", // statique, sans authentification
  outils: {
    analyseurEmail: "/analyser-email",
    testeurAccroche: "/testeur-accroche",
  },
  /** Route handlers serveur des outils gratuits (POST). */
  api: {
    analyserEmail: "/api/outils/analyser-email",
    testeurAccroche: "/api/outils/testeur-accroche",
  },
  app: {
    analyser: "/analyser",
    corriger: "/corriger",
    rediger: "/rediger",
    comparer: "/comparer",
  },
  ressources: {
    hub: "/biais-cognitifs",
    biaisCognitifs: "/biais-cognitifs",
    objetsEmail: "/email-marketing-psychologique",
    pagesDeVente: "/direct-response-copywriting",
  },
  legal: {
    mentions: "/mentions-legales", // provisoire
    confidentialite: "/confidentialite", // provisoire
    /** Une seule page : conditions générales d'utilisation ET de vente (décision de Renaud). */
    conditions: "/cgv", // provisoire
  },
} as const;

/** Inscription avec un plan (et une période) présélectionnés, lus plus tard par la page d'inscription. */
export function signupFor(plan: string, periode?: "mensuel" | "annuel"): string {
  const q = new URLSearchParams({ plan });
  if (periode) q.set("periode", periode);
  return `${routes.inscription}?${q}`;
}
