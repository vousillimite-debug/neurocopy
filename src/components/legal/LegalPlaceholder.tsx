import { SiteShell } from "@/components/layout/SiteShell";
import { Eyebrow } from "@/components/ui/Eyebrow";
import s from "./legal.module.css";

/**
 * Page légale provisoire : évite les 404 depuis le pied de page.
 * Le texte définitif sera rédigé et validé par Renaud avant toute mise en ligne.
 */
export function LegalPlaceholder({ title }: { title: string }) {
  return (
    <SiteShell>
      <div className={s.wrap}>
        <Eyebrow>Informations légales</Eyebrow>
        <h1 className={s.h1}>{title}</h1>
        <p className={s.text}>Page en cours de rédaction.</p>
      </div>
    </SiteShell>
  );
}
