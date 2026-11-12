import Link from "next/link";
import styles from "./article.module.css";

export type Crumb = { name: string; href: string };

/** Fil d'Ariane. Desktop : complet. Mobile : sans « Accueil » (raccourci). */
export function Breadcrumb({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Fil d'Ariane">
      <ol className={styles.crumbs}>
        {items.map((c, i) => {
          const last = i === items.length - 1;
          return (
            <li key={c.href} className={i === 0 ? styles.crumbHome : undefined}>
              {last ? (
                <span aria-current="page">{c.name}</span>
              ) : (
                <>
                  <Link href={c.href}>{c.name}</Link>
                  <span aria-hidden="true">/</span>
                </>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
