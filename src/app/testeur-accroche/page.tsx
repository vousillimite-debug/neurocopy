import type { Metadata } from "next";
import { SiteShell } from "@/components/layout/SiteShell";
import { ToolApp } from "@/components/tools/ToolApp";
import { ToolHeader } from "@/components/tools/ToolHeader";
import s from "@/components/tools/tools.module.css";
import { routes } from "@/lib/routes";
import { absoluteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Testeur d'accroche gratuit",
  description:
    "Teste ton titre ou ton objet d'email : un score sur 100, trois réécritures prêtes à copier, la source de chaque recommandation. Sans inscription, sans carte bancaire.",
  alternates: { canonical: absoluteUrl(routes.outils.testeurAccroche) },
};

/** Page statique : l'en-tête est rendu au build, le formulaire s'active dans le navigateur. */
export default function Page() {
  return (
    <SiteShell current="outils" footer="compact">
      <div className={s.page}>
        <ToolHeader tool="accroche" />
        <ToolApp tool="accroche" />
      </div>
    </SiteShell>
  );
}
