/**
 * Plans et prix, repris des maquettes (Home, Tarifs). Source unique pour la homepage et /tarifs.
 * À confirmer par Renaud avant publication : prix, contenu des plans, garantie de 30 jours.
 */
export type PlanId = "free" | "solo" | "growth" | "agency";

export type Plan = {
  id: PlanId;
  name: string;
  /** Prix mensuel en euros. */
  price: number;
  /** Résumé court (homepage). */
  summary: string;
  cta: string;
  featured?: boolean;
};

export const PLANS: Plan[] = [
  { id: "free", name: "Free", price: 0, summary: "Module Analyser, pour voir.", cta: "Commencer" },
  { id: "solo", name: "Solo", price: 19, summary: "Analyser, Corriger, Rédiger.", cta: "Choisir Solo" },
  {
    id: "growth",
    name: "Growth",
    price: 49,
    summary: "+ Comparer, Écouter et Offre irrésistible.",
    cta: "Choisir Growth →",
    featured: true,
  },
  { id: "agency", name: "Agency", price: 149, summary: "+ Marque blanche et API.", cta: "Choisir Agency" },
];

export const GUARANTEE_DAYS = 30;

export function formatPrice(n: number): string {
  return `${n} €`;
}
