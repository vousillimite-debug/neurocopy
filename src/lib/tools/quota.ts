/**
 * Compteur d'analyses gratuites, dans le navigateur (localStorage).
 * On ne stocke QU'UN NOMBRE : jamais le texte analysé.
 * C'est un confort d'interface, pas une protection : la vraie limite sera côté serveur
 * (limitation de débit dans les route handlers, puis quota par compte à l'étape 5).
 */
import { FREE_ANALYSES } from "./config";

const KEY = "nc:analyses-gratuites";

export function readUsed(): number {
  try {
    const n = Number(window.localStorage.getItem(KEY));
    return Number.isFinite(n) && n > 0 ? Math.floor(n) : 0;
  } catch {
    return 0;
  }
}

export function recordUse(): number {
  const next = Math.min(readUsed() + 1, FREE_ANALYSES);
  try {
    window.localStorage.setItem(KEY, String(next));
  } catch {
    // Stockage indisponible (navigation privée, cookies bloqués) : on ne bloque pas l'utilisateur.
  }
  return next;
}

export function quotaReached(): boolean {
  return readUsed() >= FREE_ANALYSES;
}
