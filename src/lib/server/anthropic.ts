import "server-only";

/**
 * Accès à l'API Anthropic : SERVEUR UNIQUEMENT.
 * La clé vit dans la variable d'environnement ANTHROPIC_API_KEY (jamais NEXT_PUBLIC_, jamais dans le code client).
 * Branchement prévu à l'étape 5, après validation de Renaud. Aucun appel n'est fait aujourd'hui.
 */
export function isAnthropicConfigured(): boolean {
  return Boolean(process.env.ANTHROPIC_API_KEY);
}
