/** Forme du résultat renvoyé par un outil (aujourd'hui : exemple statique ; étape 5 : route handler). */
export type QuickWin = {
  title: string;
  /** Dimension du score concernée (analyseur d'email). */
  dimension?: string;
  before: string;
  after: string;
  bias: string;
  /** Référence de l'étude, ex. « Kahneman & Tversky, 1979 ». */
  source: string;
};

export type AnalysisResult = {
  score: number;
  verdict: { first: string; second: string };
  dimensions?: { label: string; value: number }[];
  moreDimensions?: string;
  quickWins: QuickWin[];
};
