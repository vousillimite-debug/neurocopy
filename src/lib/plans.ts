/**
 * Plans et prix, repris des maquettes (Home, Tarifs). Source unique pour la homepage et /tarifs.
 * Valeurs PROVISOIRES : rien n'est publié avant les CGV et Stripe.
 * Placeholders à garder tels quels tant que Renaud ne les a pas fixés : [N], [−X %], [RÈGLE DE DÉCOMPTE À CONFIRMER].
 */
export type PlanId = "free" | "solo" | "growth" | "agency";
export type Period = "mensuel" | "annuel";

export type Plan = {
  id: PlanId;
  name: string;
  /** Prix mensuel en euros (facturation mensuelle). */
  price: number;
  /** Prix mensuel en facturation annuelle : null tant que la remise n'est pas fixée (affiché « [N] € »). */
  annualMonthlyPrice: number | null;
  /** Résumé court (homepage). */
  summary: string;
  /** Bouton (homepage). */
  cta: string;
  /** Bouton (page tarifs). */
  ctaTarifs: string;
  /** Pour qui (page tarifs, desktop). */
  audience: string;
  /** Liste des inclusions (page tarifs, desktop). La première ligne peut être une introduction en gras. */
  features: string[];
  featuresIntro?: string;
  /** Résumé d'une ligne (page tarifs, mobile). */
  mobileSummary: string;
  featured?: boolean;
};

export const PLANS: Plan[] = [
  {
    id: "free",
    name: "Free",
    price: 0,
    annualMonthlyPrice: 0,
    summary: "Module Analyser, pour voir.",
    cta: "Commencer",
    ctaTarifs: "Commencer",
    audience: "Pour voir ce que ton copy vaut.",
    features: ["[N] analyses par mois", "Module Analyser"],
    mobileSummary: "Analyser · [N] analyses par mois",
  },
  {
    id: "solo",
    name: "Solo",
    price: 19,
    annualMonthlyPrice: null,
    summary: "Analyser, Corriger, Rédiger.",
    cta: "Choisir Solo",
    ctaTarifs: "Choisir Solo",
    audience: "Pour le copywriter indépendant.",
    features: ["[N] analyses par mois", "Analyser, Corriger, Rédiger", "Biais et source sur chaque correction"],
    mobileSummary: "Analyser, Corriger, Rédiger · [N] analyses",
  },
  {
    id: "growth",
    name: "Growth",
    price: 49,
    annualMonthlyPrice: null,
    summary: "+ Comparer, Écouter et Offre irrésistible.",
    cta: "Choisir Growth →",
    ctaTarifs: "Commencer avec Growth →",
    audience: "Pour l'équipe qui teste et itère.",
    featuresIntro: "Tout Solo, plus :",
    features: ["Comparer", "Écouter : les mots de ton marché", "Assistant Offre irrésistible"],
    mobileSummary: "",
    featured: true,
  },
  {
    id: "agency",
    name: "Agency",
    price: 149,
    annualMonthlyPrice: null,
    summary: "+ Marque blanche et API.",
    cta: "Choisir Agency",
    ctaTarifs: "Choisir Agency",
    audience: "Pour l'agence qui livre des clients.",
    featuresIntro: "Tout Growth, plus :",
    features: ["Marque blanche", "Accès API"],
    mobileSummary: "Tout Growth · marque blanche · API",
  },
];

/** Remise annuelle : placeholder tant qu'elle n'est pas fixée. */
export const ANNUAL_DISCOUNT_LABEL = "[−X %]";

export const GUARANTEE_DAYS = 30;

/** Tableau comparatif (9 lignes). true = inclus, false = non inclus, texte = valeur affichée. */
export const COMPARISON: { label: string; short?: string; values: Record<PlanId, boolean | string> }[] = [
  { label: "Analyses par mois", short: "Analyses", values: { free: "[N]", solo: "[N]", growth: "[N]", agency: "[N]" } },
  { label: "Analyser", values: { free: true, solo: true, growth: true, agency: true } },
  { label: "Corriger", values: { free: false, solo: true, growth: true, agency: true } },
  { label: "Rédiger", values: { free: false, solo: true, growth: true, agency: true } },
  { label: "Comparer", values: { free: false, solo: false, growth: true, agency: true } },
  { label: "Écouter", values: { free: false, solo: false, growth: true, agency: true } },
  { label: "Offre irrésistible", values: { free: false, solo: false, growth: true, agency: true } },
  { label: "Marque blanche", values: { free: false, solo: false, growth: false, agency: true } },
  { label: "API", values: { free: false, solo: false, growth: false, agency: true } },
];

export function formatPrice(n: number | null): string {
  return n === null ? "[N] €" : `${n} €`;
}
