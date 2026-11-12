/**
 * Adresses internes du site, centralisées ici pour pouvoir les changer en un seul endroit.
 * Les pages marquées « à créer » arrivent aux étapes suivantes.
 */
export const routes = {
  home: "/",
  methode: "/#methode",
  tarifs: "/tarifs", // à créer (étape 3)
  connexion: "/connexion", // à créer (étape 5)
  inscription: "/inscription", // à créer (étape 5)
  outils: {
    analyseurEmail: "/outils/analyseur-email", // à créer (étape 3)
    testeurAccroche: "/outils/testeur-accroche", // à créer (étape 3)
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
    mentions: "/mentions-legales", // à créer
    confidentialite: "/confidentialite", // à créer
    cgv: "/cgv", // à créer
  },
} as const;
