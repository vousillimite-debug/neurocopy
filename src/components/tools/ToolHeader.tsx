import Link from "next/link";
import { Eyebrow } from "@/components/ui/Eyebrow";
import type { ToolId } from "@/lib/tools/config";
import { routes } from "@/lib/routes";
import { TOOL_TEXTS } from "./toolTexts";
import s from "./tools.module.css";

const TABS: { id: ToolId; label: string; short: string; href: string }[] = [
  { id: "email", label: "Analyseur d'email", short: "Email", href: routes.outils.analyseurEmail },
  { id: "accroche", label: "Testeur d'accroche", short: "Accroche", href: routes.outils.testeurAccroche },
];

/** En-tête d'un outil gratuit : eyebrow, titre, promesse, bascule entre les deux outils. Rendu serveur. */
export function ToolHeader({ tool }: { tool: ToolId }) {
  const t = TOOL_TEXTS[tool];
  return (
    <header className={s.header}>
      <Eyebrow>
        <span className={s.dOnly}>{t.eyebrow}</span>
        <span className={s.mOnly}>{t.eyebrowShort}</span>
      </Eyebrow>
      <h1 className={s.h1}>
        {t.h1.first}
        <br />
        <span className={s.second}>{t.h1.second}</span>
      </h1>
      <p className={s.lead}>{t.lead}</p>
      <nav aria-label="Choisir l'outil" className={s.tabs}>
        {TABS.map((tab) => (
          <Link
            key={tab.id}
            href={tab.href}
            className={s.tab}
            aria-current={tab.id === tool ? "page" : undefined}
          >
            <span className={s.dOnly}>{tab.label}</span>
            <span className={s.mOnly}>{tab.short}</span>
          </Link>
        ))}
      </nav>
    </header>
  );
}
