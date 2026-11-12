import Link from "next/link";
import { Eyebrow } from "@/components/ui/Eyebrow";
import styles from "./article.module.css";

export type RelatedItem = {
  href: string;
  title: string;
  type: "pilier" | "satellite";
  minutes: number;
};

function kicker(item: RelatedItem): string {
  return `${item.type === "pilier" ? "Guide pilier" : "Satellite"} · ${item.minutes} min`;
}

/** Carte de lien interne. Pilier : bordure #474747, mise en avant. */
export function RelatedCard({ item }: { item: RelatedItem }) {
  if (item.type === "pilier") {
    return (
      <Link href={item.href} className={`${styles.card} ${styles.cardPilier}`}>
        <span className={styles.cardStack}>
          <span className={styles.cardKicker}>{kicker(item)}</span>
          <span className={styles.cardTitle}>{item.title}</span>
        </span>
        <span className={styles.cardMore}>Lire le guide →</span>
      </Link>
    );
  }
  return (
    <Link href={item.href} className={styles.card}>
      <span className={styles.cardKicker}>{kicker(item)}</span>
      <span className={styles.cardTitle}>{item.title}</span>
      <span className={styles.cardMore}>Lire →</span>
    </Link>
  );
}

type Props = {
  title: string;
  /** Pilier mis en avant au-dessus de la grille (satellite). */
  featured?: RelatedItem;
  items: RelatedItem[];
};

export function RelatedLinks({ title, featured, items }: Props) {
  if (!featured && !items.length) return null;
  return (
    <section className={styles.related} aria-label={title}>
      <Eyebrow>{title}</Eyebrow>
      {featured && <RelatedCard item={featured} />}
      {items.length > 0 && (
        <div className={styles.relatedGrid}>
          {items.map((it) => (
            <RelatedCard key={it.href} item={it} />
          ))}
        </div>
      )}
    </section>
  );
}
