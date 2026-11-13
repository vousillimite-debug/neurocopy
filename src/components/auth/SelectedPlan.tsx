"use client";

import { useEffect, useState } from "react";
import { PLANS } from "@/lib/plans";
import s from "./auth.module.css";

/**
 * Rappel du plan choisi sur la page tarifs (?plan=growth&periode=annuel).
 * Lu dans le navigateur : la page reste statique. Valeurs inconnues ignorées.
 */
export function SelectedPlan() {
  const [label, setLabel] = useState<string | null>(null);

  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    const plan = PLANS.find((p) => p.id === q.get("plan"));
    if (!plan || plan.id === "free") return;
    const periode = q.get("periode") === "annuel" ? "annuel" : "mensuel";
    setLabel(`${plan.name} · ${periode}`);
  }, []);

  if (!label) return null;
  return (
    <p className={s.selected}>
      Plan choisi : <strong>{label}</strong>. Tu commences en Free, tu passes à ce plan quand le paiement sera ouvert.
    </p>
  );
}
