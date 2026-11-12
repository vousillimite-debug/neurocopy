import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import styles from "./article.module.css";

type Props = {
  eyebrow: string;
  /** Texte du CTA, tel qu'écrit dans le CSV. */
  title: string;
  href: string;
  button: string;
  reassurance?: string;
};

/** CTA contextuel : carte avec eyebrow, titre, bouton principal, réassurance. */
export function ContextCta({ eyebrow, title, href, button, reassurance }: Props) {
  return (
    <aside className={styles.cta} aria-label={eyebrow}>
      <span className={styles.ctaEyebrow}>
        <Eyebrow>{eyebrow}</Eyebrow>
      </span>
      <p className={styles.ctaTitle}>{title}</p>
      <Button href={href} size={52} fullWidthMobile>
        {button}
      </Button>
      {reassurance && <span className={styles.ctaNote}>{reassurance}</span>}
    </aside>
  );
}
