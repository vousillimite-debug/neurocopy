import type { ReactNode } from "react";
import styles from "./Eyebrow.module.css";

type Props = {
  children: ReactNode;
  /**
   * dot    : point jaune + texte gris (en-tête de section)
   * accent : texte jaune sans point (« Réponse directe », « Note de l'auteur », « 01 · ANALYSER »)
   * muted  : texte gris sans point (« ÉTAPE 1 · … »)
   */
  variant?: "dot" | "accent" | "muted";
  as?: "span" | "p" | "div";
};

export function Eyebrow({ children, variant = "dot", as: Tag = "span" }: Props) {
  return (
    <Tag className={`${styles.eyebrow} ${styles[variant]}`}>
      {variant === "dot" && <span className={styles.pip} aria-hidden="true" />}
      {children}
    </Tag>
  );
}
