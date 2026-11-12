import { Eyebrow } from "@/components/ui/Eyebrow";
import styles from "./article.module.css";

/** Encart « Réponse directe » : bordure gauche jaune, fond #111. */
export function DirectAnswer({ text }: { text: string }) {
  return (
    <aside className={styles.answer} aria-label="Réponse directe">
      <Eyebrow variant="accent">Réponse directe</Eyebrow>
      <p>{text}</p>
    </aside>
  );
}
