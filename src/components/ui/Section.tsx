import type { ReactNode } from "react";
import styles from "./Section.module.css";

/** Conteneur centré 1200 px avec gouttière (24 px desktop, 16 px mobile). */
export function Container({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={`${styles.container} ${className ?? ""}`}>{children}</div>;
}

type SectionProps = {
  children: ReactNode;
  /** default : fond noir · alt : fond #0A0A0A avec filets haut et bas */
  tone?: "default" | "alt";
  id?: string;
  labelledBy?: string;
  /** Espacement interne du contenu (gap entre blocs). */
  gap?: "md" | "lg";
};

/** Section de page : 128 px de marge verticale (72 px mobile). */
export function Section({ children, tone = "default", id, labelledBy, gap = "lg" }: SectionProps) {
  return (
    <section id={id} aria-labelledby={labelledBy} className={tone === "alt" ? styles.alt : undefined}>
      <div className={`${styles.container} ${styles.inner} ${styles[gap]}`}>{children}</div>
    </section>
  );
}
