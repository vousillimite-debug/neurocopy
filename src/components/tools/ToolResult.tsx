import type { Ref } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import type { ToolId } from "@/lib/tools/config";
import type { AnalysisResult } from "@/lib/tools/types";
import { signupFor } from "@/lib/routes";
import { TOOL_TEXTS } from "./toolTexts";
import s from "./tools.module.css";

type Props = {
  tool: ToolId;
  result: AnalysisResult;
  /** Résultat d'exemple (pas celui du texte de l'utilisateur) : signalé dans l'étiquette du score. */
  example?: boolean;
  /** Message affiché après une analyse lancée par l'utilisateur, tant que l'API n'est pas branchée. */
  notice?: string;
  ref?: Ref<HTMLElement>;
};

/** Résultat d'un outil : score, dimensions, 3 quick wins, appel vers l'analyse complète. */
export function ToolResult({ tool, result, example, notice, ref }: Props) {
  const t = TOOL_TEXTS[tool];
  const winsId = `${tool}-wins`;
  return (
    <section ref={ref} tabIndex={-1} aria-label="Résultat" className={`${s.narrow} ${s.result}`}>
      {notice && <p className={s.notice}>{notice}</p>}

      <div className={s.scoreRow}>
        <div className={s.scoreValue}>
          <span className={s.scoreNum}>{result.score}</span>
          <span className={s.scoreMax}>/100</span>
        </div>
        <div className={s.scoreSide}>
          <span className={s.scoreLabel}>
            {t.scoreLabel}
            {example && " · EXEMPLE"}
          </span>
          <p className={s.verdict}>
            {result.verdict.first}
            <br />
            <span className={s.second}>{result.verdict.second}</span>
          </p>
          {result.dimensions && (
            <ul className={s.dims}>
              {result.dimensions.map((d) => (
                <li key={d.label} className={s.dim}>
                  <span className={s.dimLabel}>{d.label}</span>
                  <span className={s.dimTrack} aria-hidden="true">
                    <span className={s.dimFill} style={{ width: `${d.value}%` }} />
                  </span>
                  <span className={s.dimValue}>{d.value}</span>
                </li>
              ))}
              {result.moreDimensions && <li className={s.dimMore}>{result.moreDimensions}</li>}
            </ul>
          )}
        </div>
      </div>

      <div className={s.winsHead}>
        <Eyebrow>{t.wins.eyebrow}</Eyebrow>
        <h2 id={winsId} className={s.h2}>
          {t.wins.first}
          <br />
          <span className={s.second}>{t.wins.second}</span>
        </h2>
      </div>

      <ol className={s.wins} aria-labelledby={winsId}>
        {result.quickWins.map((w, i) => (
          <li key={w.title}>
            <article className={s.win}>
              <div className={s.winHead}>
                <h3 className={s.winTitle}>
                  <span className={s.winNum}>{String(i + 1).padStart(2, "0")}</span>
                  {w.title}
                </h3>
                {w.dimension && <span className={s.winDim}>{w.dimension}</span>}
              </div>
              <div className={s.winBody}>
                <div className={s.before}>
                  <span className={s.beforeLabel}>AVANT</span>
                  <p className={s.beforeText}>
                    <s>{w.before}</s>
                  </p>
                </div>
                <div className={s.after}>
                  <span className={s.afterLabel}>APRÈS</span>
                  <p className={s.afterText}>{w.after}</p>
                </div>
              </div>
              <div className={s.winFoot}>
                <Badge>{w.bias}</Badge>
                <Badge variant="source">{w.source}</Badge>
              </div>
            </article>
          </li>
        ))}
      </ol>

      <div className={s.upsell}>
        <span className={s.dOnly}>
          <Eyebrow>{t.cta.eyebrow}</Eyebrow>
        </span>
        <p className={s.upsellTitle}>
          {t.cta.first}
          <br />
          <span className={s.second}>{t.cta.second}</span>
        </p>
        <p className={`${s.upsellText} ${s.dOnly}`}>{t.cta.text}</p>
        <Button href={signupFor("free")} size={52} fullWidthMobile>
          Voir l&apos;analyse complète →
        </Button>
        <span className={s.upsellNote}>Plan Free · sans carte bancaire</span>
      </div>
    </section>
  );
}
