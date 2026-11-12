import type { Metadata } from "next";
import { SiteShell } from "@/components/layout/SiteShell";
import { ToolApp } from "@/components/tools/ToolApp";
import { ToolHeader } from "@/components/tools/ToolHeader";
import s from "@/components/tools/tools.module.css";
import { routes } from "@/lib/routes";
import { absoluteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Analyseur d'email gratuit",
  description:
    "Colle ton email et vois où le cerveau décroche : un score sur 100, trois corrections prêtes à copier, la source de chaque recommandation. Sans inscription.",
  alternates: { canonical: absoluteUrl(routes.outils.analyseurEmail) },
};

/** Page statique : l'en-tête est rendu au build, le formulaire s'active dans le navigateur. */
export default function Page() {
  return (
    <SiteShell current="outils" footer="compact">
      <div className={s.page}>
        <ToolHeader tool="email" />
        <ToolApp tool="email" />
      </div>
    </SiteShell>
  );
}
