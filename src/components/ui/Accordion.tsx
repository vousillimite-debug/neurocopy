import type { ReactNode } from "react";
import styles from "./Accordion.module.css";

type ItemProps = {
  question: ReactNode;
  children: ReactNode;
  open?: boolean;
  /** Niveau de titre sémantique de la question (optionnel). */
  headingLevel?: 2 | 3 | 4;
};

/** Accordéon FAQ en <details> natif : fonctionne sans JavaScript. */
export function AccordionItem({ question, children, open, headingLevel }: ItemProps) {
  const H = headingLevel ? (`h${headingLevel}` as const) : null;
  return (
    <details className={styles.item} open={open}>
      <summary className={styles.summary}>
        {H ? <H className={styles.q}>{question}</H> : <span className={styles.q}>{question}</span>}
        <span className={styles.plus} aria-hidden="true">
          +
        </span>
      </summary>
      <div className={styles.answer}>{children}</div>
    </details>
  );
}

export function Accordion({ children }: { children: ReactNode }) {
  return <div className={styles.list}>{children}</div>;
}
