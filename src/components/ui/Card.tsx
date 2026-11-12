import type { ReactNode } from "react";
import styles from "./Card.module.css";

type Props = {
  children: ReactNode;
  /**
   * standard : fond #111, bordure #2A2A2A
   * accent   : fond #111, bordure jaune
   * alt      : fond #0A0A0A
   * ghost    : sans fond, bordure seule
   */
  variant?: "standard" | "accent" | "alt" | "ghost";
  /** Espacement interne : sm 28 · md 32 · lg 36 · xl 48/40 */
  padding?: "sm" | "md" | "lg" | "xl";
  as?: "div" | "article" | "figure" | "section" | "li" | "aside";
  className?: string;
};

export function Card({ children, variant = "standard", padding = "sm", as: Tag = "div", className }: Props) {
  return (
    <Tag className={`${styles.card} ${styles[variant]} ${styles[padding]} ${className ?? ""}`}>{children}</Tag>
  );
}
