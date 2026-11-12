import { Badge } from "@/components/ui/Badge";
import styles from "./article.module.css";

export type BeforeAfterData = {
  /** Contexte affiché dans l'étiquette : « OBJET D'EMAIL », « CTA »… */
  context?: string;
  before: string;
  after: string;
  bias?: string;
  source?: string;
  /** Libellés des colonnes (par défaut « Avant » / « Après »). */
  labels?: [string, string];
};

/**
 * Bloc avant / après. Côte à côte en desktop, empilé en mobile.
 * Le CSV ne contient pas encore d'exemples structurés : ce bloc s'affichera
 * quand la donnée existera (colonne à ajouter en base, voir CLAUDE.md).
 */
export function BeforeAfter({ context, before, after, bias, source, labels = ["Avant", "Après"] }: BeforeAfterData) {
  const suffix = context ? ` · ${context}` : "";
  return (
    <figure className={styles.ba}>
      <div className={styles.baGrid}>
        <div className={`${styles.baCell} ${styles.baBefore}`}>
          <span className={styles.baLabel}>
            {labels[0]}
            {suffix}
          </span>
          <p className={styles.baText}>{before}</p>
        </div>
        <div className={`${styles.baCell} ${styles.baAfter}`}>
          <span className={styles.baLabel}>
            {labels[1]}
            {suffix}
          </span>
          <p className={styles.baText}>{after}</p>
        </div>
      </div>
      {(bias || source) && (
        <figcaption className={styles.baFoot}>
          {bias && <Badge>{bias}</Badge>}
          {source && <Badge variant="source">{source}</Badge>}
        </figcaption>
      )}
    </figure>
  );
}
