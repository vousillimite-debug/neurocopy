import type { ReactNode } from "react";
import { Kw } from "@/components/ui/SignatureTitle";
import type { ToolId } from "@/lib/tools/config";

/** Textes d'interface des outils. Repris des maquettes ; les ajouts sans maquette sont signalés. */
export type ToolTexts = {
  eyebrow: string;
  eyebrowShort: string;
  h1: { first: string; second: ReactNode };
  lead: string;
  fields: { objet?: string; texte: string };
  placeholderNote?: string;
  rows: number;
  submit: string;
  scoreLabel: string;
  steps: string[];
  wins: { eyebrow: string; first: string; second: string };
  cta: { eyebrow: string; first: string; second: ReactNode; text: string };
  shortHelp: string;
};

export const TOOL_TEXTS: Record<ToolId, ToolTexts> = {
  email: {
    eyebrow: "Outil gratuit · Analyseur d'email",
    eyebrowShort: "Outil gratuit",
    h1: {
      first: "Colle ton email.",
      second: (
        <>
          Vois où le cerveau <Kw>décroche.</Kw>
        </>
      ),
    },
    lead: "Un score sur 100, trois corrections prêtes à copier, la source de chaque recommandation. Sans inscription.",
    fields: { objet: "OBJET", texte: "CORPS DE L'EMAIL" },
    rows: 8,
    submit: "Analyser mon email",
    scoreLabel: "SCORE DE CONVERSION",
    // Étapes de chargement : reprises du testeur d'accroche (maquette mobile), adaptées à l'email.
    steps: ["Lecture de l'email", "Détection des biais activés", "Évaluation du CTA", "Rédaction des quick wins"],
    wins: { eyebrow: "3 quick wins", first: "Trois phrases à changer.", second: "Copie, colle, renvoie." },
    cta: {
      eyebrow: "Analyse complète",
      first: "Tu as vu 3 problèmes.",
      second: (
        <>
          L&apos;analyse complète en trouve sur <Kw>7</Kw> dimensions.
        </>
      ),
      text: "Charge cognitive, preuve, urgence, émotion. Plus la réécriture de l'email entier, phrase par phrase.",
    },
    shortHelp: "Ton texte est trop court pour un score fiable. Ajoute au moins une phrase sur ton offre.",
  },
  accroche: {
    eyebrow: "Outil gratuit · Testeur d'accroche",
    eyebrowShort: "Outil gratuit",
    h1: {
      first: "Ton accroche.",
      second: (
        <>
          Notée par le <Kw>cerveau.</Kw>
        </>
      ),
    },
    // Sans maquette desktop : calqué sur l'analyseur d'email. Validé par Renaud.
    lead: "Un score sur 100, trois réécritures prêtes à copier, la source de chaque recommandation. Sans inscription, sans carte bancaire.",
    fields: { texte: "TON TITRE OU OBJET" },
    rows: 3,
    submit: "Tester mon accroche",
    scoreLabel: "SCORE DE L'ACCROCHE",
    steps: ["Lecture de l'accroche", "Détection des biais activés", "Évaluation du CTA", "Rédaction des quick wins"],
    // Sans maquette desktop : validé par Renaud.
    wins: { eyebrow: "3 quick wins", first: "Trois accroches à tester.", second: "Copie, colle, compare." },
    cta: {
      eyebrow: "Analyse complète",
      first: "Et le reste de ton email ?",
      second: <>7 dimensions, réécriture incluse.</>,
      text: "Charge cognitive, preuve, urgence, émotion. Plus la réécriture de l'email entier, phrase par phrase.",
    },
    shortHelp: "Trop court pour un score fiable. Écris une vraie phrase.",
  },
};
