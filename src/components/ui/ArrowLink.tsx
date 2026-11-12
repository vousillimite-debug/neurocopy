import Link from "next/link";
import type { ReactNode } from "react";
import styles from "./ArrowLink.module.css";

type Props = {
  href: string;
  children: ReactNode;
  /** Couleur : accent (par défaut) ou blanc. */
  tone?: "accent" | "white";
};

/** Lien fléché : « Lire → », « Voir les 4 plans → ». */
export function ArrowLink({ href, children, tone = "accent" }: Props) {
  return (
    <Link href={href} className={`${styles.link} ${styles[tone]}`}>
      {children}
      <span className={styles.arrow} aria-hidden="true">
        →
      </span>
    </Link>
  );
}
