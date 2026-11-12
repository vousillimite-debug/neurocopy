import Link from "next/link";
import styles from "./article.module.css";

export type TocEntry = { id: string; label: string };

type Props = {
  title: string;
  entries: TocEntry[];
  aside?: { href: string; label: string };
};

/**
 * Sommaire latéral collant (desktop ≥ 960 px).
 * La barre de progression avance en CSS pur ; l'item actif est ajouté par TocSpy si JavaScript est là.
 */
export function TocSidebar({ title, entries, aside }: Props) {
  return (
    <aside className={styles.toc} aria-labelledby="toc-title">
      <span id="toc-title" className={styles.tocTitle}>
        {title.toUpperCase()}
      </span>
      <ol className={styles.tocList} data-toc>
        {entries.map((e) => (
          <li key={e.id}>
            <a href={`#${e.id}`} className={styles.tocLink}>
              {e.label}
            </a>
          </li>
        ))}
      </ol>
      <div className={styles.progress} aria-hidden="true">
        <div className={styles.progressBar} />
      </div>
      {aside && (
        <Link href={aside.href} className={styles.tocAside}>
          {aside.label}
        </Link>
      )}
    </aside>
  );
}

/** Sommaire repliable en <details> (tablette et mobile). Fonctionne sans JavaScript. */
export function TocCollapsible({ title, entries }: Props) {
  return (
    <details className={styles.tocMobile}>
      <summary>
        {title.toUpperCase()} · {entries.length}
        <span className={styles.tocPlus} aria-hidden="true">
          +
        </span>
      </summary>
      <ol className={styles.tocMobileList}>
        {entries.map((e) => (
          <li key={e.id}>
            <a href={`#${e.id}`}>{e.label}</a>
          </li>
        ))}
      </ol>
    </details>
  );
}
