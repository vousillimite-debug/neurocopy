import "server-only";
import { TOOL_LIMITS, type ToolId, type ToolInput, validateInput } from "@/lib/tools/config";
import { isAnthropicConfigured } from "./anthropic";
import { clientIp, rateLimit } from "./rate-limit";

/** Requêtes autorisées par IP et par outil. Valeurs de départ, à ajuster à l'étape 5. */
const RATE_LIMITS: Record<ToolId, { limit: number; windowMs: number }> = {
  email: { limit: 5, windowMs: 60 * 60 * 1000 },
  accroche: { limit: 30, windowMs: 60 * 60 * 1000 },
};

/** Taille maximale du corps de requête (octets), au-delà : 413 sans lire le texte. */
const MAX_BODY_BYTES = 32 * 1024;

function json(body: Record<string, unknown>, status: number, headers: Record<string, string> = {}) {
  return Response.json(body, { status, headers: { "Cache-Control": "no-store", ...headers } });
}

function parseInput(tool: ToolId, body: unknown): ToolInput | null {
  if (!body || typeof body !== "object") return null;
  const { texte, objet } = body as Record<string, unknown>;
  if (typeof texte !== "string") return null;
  if (objet !== undefined && typeof objet !== "string") return null;
  return tool === "email" ? { texte, objet } : { texte };
}

/**
 * Traitement commun des outils gratuits.
 * Règles : aucune donnée stockée, aucun texte journalisé, limitation de débit avant tout traitement.
 * Aujourd'hui : validation complète puis 503 (l'analyse n'est pas encore branchée).
 */
export async function handleToolRequest(tool: ToolId, req: Request): Promise<Response> {
  const rl = rateLimit(`${tool}:${clientIp(req)}`, RATE_LIMITS[tool].limit, RATE_LIMITS[tool].windowMs);
  if (!rl.ok) {
    return json({ error: "trop-de-requetes" }, 429, { "Retry-After": String(rl.retryAfterSeconds) });
  }

  const size = Number(req.headers.get("content-length") ?? 0);
  if (size > MAX_BODY_BYTES) return json({ error: "trop-long" }, 413);

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return json({ error: "requete-invalide" }, 400);
  }
  const input = parseInput(tool, body);
  if (!input) return json({ error: "requete-invalide" }, 400);

  const check = validateInput(tool, input);
  if (!check.ok) {
    return json({ error: check.reason, minWords: TOOL_LIMITS[tool].minWords }, 422);
  }

  if (!isAnthropicConfigured()) return json({ error: "indisponible" }, 503);

  // Étape 5 : appel à l'API Anthropic ici, puis réponse au format AnalysisResult (src/lib/tools/types.ts).
  // Le texte reste en mémoire le temps de la requête : ni base, ni fichier, ni journal.
  return json({ error: "indisponible" }, 503);
}
