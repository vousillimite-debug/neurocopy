import Link from "next/link";
import styles from "./Logo.module.css";

type Props = {
  /** Lien vers l'accueil (nav) ou simple texte (footer). */
  href?: string;
  size?: "md" | "sm";
};

export function Logo({ href, size = "md" }: Props) {
  const className = `${styles.logo} ${size === "sm" ? styles.sm : ""}`;
  const content = (
    <>
      <span className={styles.dot} aria-hidden="true" />
      NeuroCopy
    </>
  );
  return href ? (
    <Link href={href} className={className}>
      {content}
    </Link>
  ) : (
    <span className={className}>{content}</span>
  );
}
