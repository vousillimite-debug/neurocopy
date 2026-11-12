/**
 * Exemples repris des maquettes (Outil.dc.html, Outil-mobile.dc.html), affichés comme EXEMPLES.
 * Ils servent de résultat statique tant que l'API n'est pas branchée (étape 5).
 */
import type { ToolId, ToolInput } from "./config";
import type { AnalysisResult } from "./types";

export const EXAMPLE_INPUT: Record<ToolId, ToolInput> = {
  email: {
    objet: "Nouveauté : notre programme de coaching commercial",
    texte:
      "Salut Julie,\n\nJ'espère que tu vas bien. Je voulais te présenter notre nouveau programme de coaching commercial. Il dure 6 semaines et couvre la prospection, la négociation et le closing.\n\nSi ça t'intéresse, n'hésite pas à me répondre.\n\nBonne journée,\nMarc",
  },
  accroche: { texte: "Le guide ultime pour réussir ta prospection" },
};

/** Textes trop courts des maquettes d'états (aperçu « ?etat=court »). */
export const SHORT_EXAMPLE: Record<ToolId, string> = {
  email: "Salut, dispo pour un call jeudi ?",
  accroche: "Promo",
};

export const EXAMPLE_RESULT: Record<ToolId, AnalysisResult> = {
  email: {
    score: 58,
    verdict: { first: "Ton email se lit.", second: "Il ne se fait pas répondre." },
    dimensions: [
      { label: "Accroche", value: 41 },
      { label: "Clarté", value: 78 },
      { label: "CTA", value: 35 },
    ],
    moreDimensions: "+ 4 dimensions dans l'analyse complète",
    quickWins: [
      {
        title: "L'ouverture parle de toi",
        dimension: "Accroche",
        before: "J'espère que tu vas bien. Je voulais te présenter notre nouveau programme.",
        after: "Tu as relancé combien de prospects cette semaine ? Et combien t'ont répondu ?",
        bias: "Effet d'autoréférence",
        source: "Rogers, Kuiper & Kirker, 1977",
      },
      {
        title: "Tu listes le contenu, pas l'enjeu",
        dimension: "Émotion",
        before: "Il couvre la prospection, la négociation et le closing.",
        after: "Chaque semaine sans méthode, ce sont des devis qui dorment dans ta boîte d'envoi.",
        bias: "Aversion à la perte",
        source: "Kahneman & Tversky, 1979",
      },
      {
        title: "Ton CTA demande trop d'effort",
        dimension: "CTA",
        before: "Si ça t'intéresse, n'hésite pas à me répondre.",
        after: "Réponds juste « oui » et je t'envoie le programme ce soir.",
        bias: "Pied dans la porte",
        source: "Freedman & Fraser, 1966",
      },
    ],
  },
  accroche: {
    score: 46,
    verdict: { first: "« Ultime » ne dit rien.", second: "Le cerveau passe au suivant." },
    quickWins: [
      {
        title: "Sois concret",
        before: "Le guide ultime pour réussir ta prospection",
        after: "La relance en 3 lignes qui fait répondre les prospects muets",
        bias: "Effet de concrétude",
        source: "Paivio, 1971",
      },
      {
        title: "Nomme ce qu'il perd",
        before: "… pour réussir ta prospection",
        after: "Arrête de perdre tes prospects après le premier devis",
        bias: "Aversion à la perte",
        source: "Kahneman & Tversky, 1979",
      },
      {
        title: "Ouvre une question",
        before: "Le guide ultime…",
        after: "Pourquoi tes meilleurs prospects ignorent ta deuxième relance",
        bias: "Fossé de curiosité",
        source: "Loewenstein, 1994",
      },
    ],
  },
};
