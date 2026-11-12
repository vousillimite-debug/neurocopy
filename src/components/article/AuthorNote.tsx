import { Eyebrow } from "@/components/ui/Eyebrow";
import { AUTHOR } from "@/lib/site";
import styles from "./article.module.css";

type Props = {
  text: string;
  /** Eyebrow « Note de l'auteur » en tête (variante fin de page, satellite). */
  withEyebrow?: boolean;
};

/** Note de l'auteur : bordure gauche jaune, fond #0A0A0A, italique, avatar « R ». */
export function AuthorNote({ text, withEyebrow }: Props) {
  return (
    <aside className={styles.note} aria-label="Note de l'auteur">
      {withEyebrow && <Eyebrow variant="accent">Note de l'auteur</Eyebrow>}
      <p className={styles.noteText}>{text}</p>
      <div className={styles.noteSign}>
        <span className={styles.avatar} aria-hidden="true">
          {AUTHOR.initial}
        </span>
        <span>
          <strong>{AUTHOR.name}</strong> · note de l'auteur
        </span>
      </div>
    </aside>
  );
}
