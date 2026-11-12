/**
 * Outils gratuits : règles partagées entre le navigateur et le serveur.
 * Aucun secret ici (fichier importé côté client).
 */
export type ToolId = "email" | "accroche";

export type ToolInput = {
  /** Objet de l'email (analyseur d'email uniquement, facultatif). */
  objet?: string;
  /** Corps de l'email, ou accroche à tester. */
  texte: string;
};

/**
 * Limites de saisie.
 * minWords : fixés par Renaud le 12/11/2026 (30 mots pour l'email, 3 pour l'accroche), affichés tels quels.
 */
export const TOOL_LIMITS: Record<ToolId, { minWords: number; maxChars: number; maxObjetChars: number }> = {
  email: { minWords: 30, maxChars: 10_000, maxObjetChars: 200 },
  accroche: { minWords: 3, maxChars: 300, maxObjetChars: 0 },
};

/** Analyses gratuites sans compte (analyseur d'email). L'accroche n'a pas de quota (seulement la limitation de débit du serveur). */
export const FREE_ANALYSES = 3;

export function countWords(s: string): number {
  return s.split(/\s+/).filter(Boolean).length;
}

export type ValidationResult = { ok: true } | { ok: false; reason: "vide" | "trop-court" | "trop-long" };

export function validateInput(tool: ToolId, input: ToolInput): ValidationResult {
  const limits = TOOL_LIMITS[tool];
  const texte = input.texte.trim();
  if (!texte) return { ok: false, reason: "vide" };
  if (texte.length > limits.maxChars || (input.objet ?? "").length > limits.maxObjetChars) {
    return { ok: false, reason: "trop-long" };
  }
  if (countWords(texte) < limits.minWords) return { ok: false, reason: "trop-court" };
  return { ok: true };
}
