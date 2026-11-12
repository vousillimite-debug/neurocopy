import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { routes } from "@/lib/routes";
import styles from "./Nav.module.css";

export type NavKey = "methode" | "outils" | "ressources" | "tarifs";

const LINKS: { key: NavKey; label: string; href: string }[] = [
  { key: "methode", label: "Méthode", href: routes.methode },
  { key: "outils", label: "Outils gratuits", href: routes.outils.analyseurEmail },
  { key: "ressources", label: "Ressources", href: routes.ressources.hub },
  { key: "tarifs", label: "Tarifs", href: routes.tarifs },
];

type Props = {
  /** Rubrique active (aria-current + texte blanc). */
  current?: NavKey;
  /** site : nav complète · auth : logo seul */
  variant?: "site" | "auth";
  /** Barre collante avec flou (homepage, articles). */
  sticky?: boolean;
};

/**
 * Navigation principale.
 * Desktop : liens + « Se connecter » + bouton contour.
 * Mobile (< 960 px) : logo + burger 44 px. Le menu s'ouvre avec <details>, sans JavaScript.
 */
export function Nav({ current, variant = "site", sticky = true }: Props) {
  if (variant === "auth") {
    return (
      <nav aria-label="Navigation principale" className={styles.authBar}>
        <Logo href={routes.home} />
      </nav>
    );
  }

  return (
    <nav aria-label="Navigation principale" className={`${styles.nav} ${sticky ? styles.sticky : ""}`}>
      {/* Desktop */}
      <div className={styles.desktop}>
        <Logo href={routes.home} />
        <div className={styles.links}>
          {LINKS.map((l) => (
            <Link
              key={l.key}
              href={l.href}
              className={styles.link}
              aria-current={current === l.key ? "page" : undefined}
            >
              {l.label}
            </Link>
          ))}
        </div>
        <div className={styles.actions}>
          <Link href={routes.connexion} className={styles.login}>
            Se connecter
          </Link>
          <Link href={routes.inscription} className={styles.trial}>
            Essai gratuit
          </Link>
        </div>
      </div>

      {/* Mobile */}
      <div className={styles.mobile}>
        <Logo href={routes.home} size="sm" />
        <details className={styles.menu}>
          <summary className={styles.burger}>
            <span className="nc-sr-only">Menu</span>
            <svg className={styles.iconOpen} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <path d="M4 8h16M4 16h16" />
            </svg>
            <svg className={styles.iconClose} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </summary>
          <div className={styles.panel}>
            <ul className={styles.panelList}>
              {LINKS.map((l) => (
                <li key={l.key}>
                  <Link
                    href={l.href}
                    className={styles.panelLink}
                    aria-current={current === l.key ? "page" : undefined}
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link href={routes.connexion} className={styles.panelLink}>
                  Se connecter
                </Link>
              </li>
            </ul>
            <Link href={routes.inscription} className={styles.panelTrial}>
              Essai gratuit
            </Link>
          </div>
        </details>
      </div>
    </nav>
  );
}
