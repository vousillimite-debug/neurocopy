import type { ReactNode } from "react";
import styles from "./SignatureTitle.module.css";

type Props = {
  as?: "h1" | "h2" | "h3";
  /** hero 112 · display 96 · h1 72 · h2 56 (valeurs mobiles via les tokens) */
  size?: "hero" | "display" | "h1" | "h2";
  /** Première ligne, en blanc. */
  first: ReactNode;
  /** Deuxième ligne, en gris. Mets le mot clé dans <Kw>. Optionnelle. */
  second?: ReactNode;
  /** Barre la première ligne (variante hero). */
  strike?: boolean;
  id?: string;
  align?: "start" | "center";
};

/** Titre signature : ligne blanche + ligne grise avec un mot clé jaune. */
export function SignatureTitle({ as: Tag = "h2", size = "h2", first, second, strike, id, align = "start" }: Props) {
  return (
    <Tag id={id} className={`${styles.title} ${styles[size]} ${align === "center" ? styles.center : ""}`}>
      {strike ? <s className={styles.strike}>{first}</s> : first}
      {second && (
        <>
          <br />
          <span className={styles.second}>{second}</span>
        </>
      )}
    </Tag>
  );
}

/** Mot clé en jaune, à l'intérieur d'un titre ou d'un texte. */
export function Kw({ children }: { children: ReactNode }) {
  return <span className={styles.kw}>{children}</span>;
}
