/**
 * Balise JSON-LD. SEUL endroit du code où un objet de données structurées est sérialisé.
 * On reçoit des objets JS natifs, jamais une chaîne déjà sérialisée.
 */
export type JsonLdObject = { "@context"?: string; "@type": string } & Record<string, unknown>;

export function JsonLd({ data }: { data: JsonLdObject | JsonLdObject[] }) {
  // « < » échappé pour qu'aucun texte ne puisse fermer la balise <script>.
  const json = JSON.stringify(data).replace(/</g, "\\u003c");
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}
