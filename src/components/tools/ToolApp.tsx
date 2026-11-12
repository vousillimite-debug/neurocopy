"use client";

import Link from "next/link";
import { type FormEvent, useEffect, useId, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Kw } from "@/components/ui/SignatureTitle";
import { routes, signupFor } from "@/lib/routes";
import {
  countWords,
  FREE_ANALYSES,
  TOOL_LIMITS,
  type ToolId,
} from "@/lib/tools/config";
import { EXAMPLE_INPUT, EXAMPLE_RESULT, SHORT_EXAMPLE } from "@/lib/tools/examples";
import { quotaReached, recordUse } from "@/lib/tools/quota";
import { TOOL_TEXTS } from "./toolTexts";
import { ToolResult } from "./ToolResult";
import s from "./tools.module.css";

type Phase = "idle" | "loading" | "result" | "error";

/** Durée de chaque étape du chargement simulé (aucun appel d'API pour l'instant). */
const STEP_MS = 450;

/**
 * Aperçu des états, pour les captures et la relecture : ?etat=quota | erreur | court | chargement | resultat.
 * Lu dans le navigateur uniquement : la page reste 100 % statique.
 */
type Preview = "quota" | "erreur" | "court" | "chargement" | "resultat";

export function ToolApp({ tool }: { tool: ToolId }) {
  const t = TOOL_TEXTS[tool];
  const limits = TOOL_LIMITS[tool];
  const example = EXAMPLE_INPUT[tool];
  const withQuota = tool === "email";
  const uid = useId();

  const [ready, setReady] = useState(false);
  const [objet, setObjet] = useState("");
  const [texte, setTexte] = useState("");
  const [touched, setTouched] = useState(false);
  const [phase, setPhase] = useState<Phase>("idle");
  const [step, setStep] = useState(0);
  const [ownText, setOwnText] = useState(false);
  const [quota, setQuota] = useState(false);
  const timers = useRef<number[]>([]);
  const resultRef = useRef<HTMLElement>(null);

  const words = countWords(texte);
  const chars = texte.length;
  const tooShort = touched && words > 0 && words < limits.minWords;
  const canSubmit = ready && words >= limits.minWords && phase !== "loading";

  useEffect(() => {
    setReady(true);
    if (withQuota && quotaReached()) setQuota(true);

    const etat = new URLSearchParams(window.location.search).get("etat") as Preview | null;
    if (etat === "quota") setQuota(true);
    if (etat === "court") {
      setTexte(SHORT_EXAMPLE[tool]);
      setTouched(true);
    }
    if (etat === "erreur" || etat === "chargement" || etat === "resultat") {
      setObjet(example.objet ?? "");
      setTexte(example.texte);
      setPhase(etat === "erreur" ? "error" : etat === "chargement" ? "loading" : "result");
      if (etat === "chargement") setStep(2);
    }
    const pending = timers.current;
    return () => pending.forEach((id) => window.clearTimeout(id));
    // Lecture unique au chargement de la page.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (phase === "result" && ownText) resultRef.current?.focus();
  }, [phase, ownText]);

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setTouched(true);
    if (!canSubmit) return;
    if (withQuota && quotaReached()) {
      setQuota(true);
      return;
    }
    setPhase("loading");
    setStep(0);
    t.steps.forEach((_, i) => timers.current.push(window.setTimeout(() => setStep(i), i * STEP_MS)));
    timers.current.push(
      window.setTimeout(() => {
        // Étape 5 : remplacer par un POST vers routes.api (route handler serveur), puis afficher sa réponse.
        if (withQuota) recordUse();
        setOwnText(true);
        setPhase("result");
      }, t.steps.length * STEP_MS),
    );
  }

  if (quota) return <QuotaCard />;

  const submitLabel = phase === "error" ? "Réessayer l'analyse" : phase === "result" ? "Relancer l'analyse" : t.submit;
  const helpId = `${uid}-aide`;
  const showResult = phase === "idle" || phase === "result";

  return (
    <>
      <section aria-label="Saisie" className={s.narrow}>
        <form className={s.form} onSubmit={onSubmit} noValidate>
          {phase === "error" && (
            <div role="alert" className={s.alert}>
              <span className={s.alertIcon} aria-hidden="true">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                  <path d="M12 7v6M12 17h.01" />
                </svg>
              </span>
              <div className={s.alertBody}>
                <strong className={s.alertTitle}>L&apos;analyse n&apos;a pas abouti.</strong>
                <span className={s.alertText}>Ton texte n&apos;a pas été conservé. Réessaie.</span>
              </div>
            </div>
          )}

          {t.fields.objet && (
            <div className={s.field}>
              <label htmlFor={`${uid}-objet`} className={s.label}>
                {t.fields.objet}
              </label>
              <input
                id={`${uid}-objet`}
                type="text"
                className={s.input}
                value={objet}
                maxLength={limits.maxObjetChars}
                placeholder={example.objet}
                autoComplete="off"
                onChange={(e) => setObjet(e.target.value)}
              />
            </div>
          )}

          <div className={s.field}>
            <label htmlFor={`${uid}-texte`} className={s.label}>
              {t.fields.texte}
            </label>
            <textarea
              id={`${uid}-texte`}
              className={`${s.textarea} ${tool === "accroche" ? s.textareaLg : ""} ${tooShort ? s.invalid : ""}`}
              rows={t.rows}
              value={texte}
              maxLength={limits.maxChars}
              placeholder={example.texte}
              aria-invalid={tooShort || undefined}
              aria-describedby={tooShort ? helpId : undefined}
              onChange={(e) => setTexte(e.target.value)}
              onBlur={() => setTouched(true)}
            />
            {tooShort && (
              <div id={helpId} className={s.help}>
                <span>{t.shortHelp}</span>
                <span className={s.helpCount}>
                  {words} / {limits.minWords} mots
                </span>
              </div>
            )}
          </div>

          <div className={`${s.formFoot} ${tooShort ? s.formFootEnd : ""}`}>
            {!tooShort && (
              <span className={s.count}>
                {chars} caractère{chars > 1 ? "s" : ""} · ton texte n&apos;est pas conservé
              </span>
            )}
            <Button
              type="submit"
              variant={phase === "result" ? "outline" : "primary"}
              size={52}
              disabled={!canSubmit}
              fullWidthMobile
            >
              {phase === "loading" ? "Analyse en cours…" : submitLabel}
            </Button>
          </div>
          <noscript>
            <p className={s.count}>Active JavaScript pour lancer l&apos;analyse.</p>
          </noscript>
        </form>

        {phase === "loading" && <LoadingStatus steps={t.steps} step={step} />}
      </section>

      {showResult && (
        <ToolResult
          ref={resultRef}
          tool={tool}
          result={EXAMPLE_RESULT[tool]}
          example
          notice={
            ownText
              ? "Aperçu : ce résultat est l'exemple ci-dessous. L'analyse réelle de ton texte arrivera avec le branchement de l'API."
              : undefined
          }
        />
      )}
    </>
  );
}

function LoadingStatus({ steps, step }: { steps: string[]; step: number }) {
  return (
    <div role="status" aria-live="polite" className={s.loading}>
      <div className={s.loadingHead}>
        <span className={s.loadingTitle}>{steps[step]}…</span>
        <span className={s.loadingCount}>
          {step + 1}/{steps.length}
        </span>
      </div>
      <div className={s.loadingTrack} aria-hidden="true">
        <span className={s.loadingFill} style={{ width: `${((step + 1) / steps.length) * 100}%` }} />
      </div>
      <ul className={s.loadingSteps}>
        {steps.map((label, i) => (
          <li key={label} className={i < step ? s.stepDone : i === step ? s.stepNow : s.stepTodo}>
            {i < step ? (
              <span className={s.check} aria-hidden="true">
                ✓
              </span>
            ) : (
              <span className={s.dot} aria-hidden="true" />
            )}
            {label}
          </li>
        ))}
      </ul>
    </div>
  );
}

function QuotaCard() {
  return (
    <section aria-labelledby="quota-titre" className={s.narrow}>
      <div className={s.quota}>
        <div className={s.quotaCount}>
          <span className={s.quotaNum}>{FREE_ANALYSES}</span>
          <span className={s.quotaMax}>/{FREE_ANALYSES} analyses</span>
        </div>
        <h2 id="quota-titre" className={s.h2}>
          Tu as utilisé tes {FREE_ANALYSES} analyses gratuites.
          <br />
          <span className={s.second}>
            Tu sais déjà où ton texte <Kw>coince.</Kw>
          </span>
        </h2>
        <p className={s.quotaText}>
          On sait ce que c&apos;est : tu étais lancé. Crée ton compte gratuit pour continuer. Tes scores restent dans ton
          historique.
        </p>
        <div className={s.quotaActions}>
          <Button href={signupFor("free")} size={52} fullWidthMobile>
            Créer mon compte gratuit →
          </Button>
          <Link href={routes.outils.testeurAccroche} className={s.quotaLink}>
            Tester une accroche, sans compte
          </Link>
        </div>
        <span className={s.quotaLogin}>
          Déjà un compte ? <Link href={routes.connexion}>Se connecter</Link>
        </span>
      </div>
    </section>
  );
}
