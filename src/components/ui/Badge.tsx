import type { ReactNode } from "react";
import styles from "./Badge.module.css";

type Props = {
  children: ReactNode;
  /**
   * bias   : fond accent 12 %, texte jaune (nom du biais)
   * source : contour gris (référence d'étude)
   * plan   : contour, petites capitales (GROWTH), cadenas optionnel
   * filled : plein jaune (« Le plus choisi »)
   */
  variant?: "bias" | "source" | "plan" | "filled";
  locked?: boolean;
};

export function Badge({ children, variant = "bias", locked }: Props) {
  return (
    <span className={`${styles.badge} ${styles[variant]}`}>
      {locked && (
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
          <rect x="5" y="11" width="14" height="10" rx="2" />
          <path d="M8 11V7a4 4 0 0 1 8 0v4" />
        </svg>
      )}
      {children}
    </span>
  );
}
