import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { routes } from "@/lib/routes";
import { SITE_NAME, SITE_TAGLINE } from "@/lib/site";
import styles from "./Footer.module.css";

const COLUMNS = [
  {
    title: "PRODUIT",
    // Étape 5 : remplacer routes.modules par routes.app.* quand l'app existera (évite les 404 d'ici là).
    links: [
      { label: "Analyser", href: routes.modules },
      { label: "Corriger", href: routes.modules },
      { label: "Rédiger", href: routes.modules },
      { label: "Comparer", href: routes.modules },
      { label: "Tarifs", href: routes.tarifs },
    ],
  },
  {
    title: "OUTILS GRATUITS",
    links: [
      { label: "Analyseur d'email", href: routes.outils.analyseurEmail },
      { label: "Testeur d'accroche", href: routes.outils.testeurAccroche },
    ],
  },
  {
    title: "RESSOURCES",
    links: [
      { label: "Biais cognitifs", href: routes.ressources.biaisCognitifs },
      { label: "Objets d'email", href: routes.ressources.objetsEmail },
      { label: "Pages de vente", href: routes.ressources.pagesDeVente },
      // « Glossaire » : à remettre quand la page existera.
    ],
  },
];

const LEGAL = [
  { label: "Mentions légales", href: routes.legal.mentions },
  { label: "Confidentialité", href: routes.legal.confidentialite },
  { label: "Conditions générales", href: routes.legal.conditions },
];

type Props = {
  /**
   * full    : signature + 3 colonnes + barre légale (homepage, articles)
   * compact : signature + légal sur une ligne (tarifs, outils)
   * minimal : une ligne de signature (connexion, inscription)
   */
  variant?: "full" | "compact" | "minimal";
};

export function Footer({ variant = "full" }: Props) {
  const year = new Date().getFullYear();

  if (variant === "minimal") {
    return (
      <footer className={styles.minimal}>
        {SITE_NAME} · {SITE_TAGLINE}
      </footer>
    );
  }

  const signature = (
    <div className={styles.signature}>
      <Logo />
      <span className={styles.tagline}>
        {SITE_NAME} · {SITE_TAGLINE}
      </span>
    </div>
  );

  if (variant === "compact") {
    return (
      <footer className={styles.footer}>
        <div className={`${styles.inner} ${styles.compactInner}`}>
          {signature}
          <p className={styles.compactLegal}>
            © {year} {SITE_NAME}
            {LEGAL.map((l) => (
              <span key={l.href}>
                {" · "}
                <Link href={l.href}>{l.label}</Link>
              </span>
            ))}
          </p>
        </div>
      </footer>
    );
  }

  return (
    <footer className={styles.footer}>
      <div className={`${styles.inner} ${styles.fullInner}`}>
        <div className={styles.top}>
          {signature}
          <div className={styles.columns}>
            {COLUMNS.map((col) => (
              <div key={col.title} className={styles.column}>
                <span className={styles.colTitle}>{col.title}</span>
                {col.links.map((l) => (
                  <Link key={l.label} href={l.href} className={styles.colLink}>
                    {l.label}
                  </Link>
                ))}
              </div>
            ))}
          </div>
        </div>
        <div className={styles.bottom}>
          <span>
            © {year} {SITE_NAME}
          </span>
          <span className={styles.legal}>
            {LEGAL.map((l) => (
              <Link key={l.href} href={l.href}>
                {l.label}
              </Link>
            ))}
          </span>
        </div>
      </div>
    </footer>
  );
}
