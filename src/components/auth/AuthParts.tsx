import type { ReactNode } from "react";
import s from "./auth.module.css";

/**
 * Éléments des écrans de connexion et d'inscription.
 * RÈGLE (étape 3) : aucun envoi possible. Pas de <form>, pas d'attribut name sur les champs,
 * boutons désactivés avec la mention « Bientôt disponible ». Aucun mot de passe ne peut partir.
 * L'authentification sera branchée à l'étape 5, après accord de Renaud.
 */

type FieldProps = {
  id: string;
  label: string;
  type?: "text" | "email" | "password";
  autoComplete: string;
  placeholder?: string;
  help?: string;
  /** Lien affiché à droite du libellé (desktop) ou sous le champ (mobile). */
  aside?: ReactNode;
};

export function Field({ id, label, type = "text", autoComplete, placeholder, help, aside }: FieldProps) {
  const helpId = help ? `${id}-aide` : undefined;
  return (
    <div className={s.field}>
      <div className={s.labelRow}>
        <label htmlFor={id} className={s.label}>
          {label}
        </label>
        {aside && <span className={s.aside}>{aside}</span>}
      </div>
      <input
        id={id}
        type={type}
        autoComplete={autoComplete}
        placeholder={placeholder}
        aria-describedby={helpId}
        className={s.input}
      />
      {help && (
        <span id={helpId} className={s.help}>
          {help}
        </span>
      )}
    </div>
  );
}

export function Checkbox({ id, children, muted }: { id: string; children: ReactNode; muted?: boolean }) {
  return (
    <div className={`${s.check} ${muted ? s.checkMuted : ""}`}>
      <input id={id} type="checkbox" className={s.checkbox} />
      <label htmlFor={id}>{children}</label>
    </div>
  );
}

/** Mention affichée sous un bouton d'envoi inactif. */
export function SoonNote({ id, children }: { id: string; children: ReactNode }) {
  return (
    <p id={id} className={s.soon} role="note">
      <span className={s.soonTag}>Bientôt disponible</span>
      {children}
    </p>
  );
}
