import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { Checkbox, Field, SoonNote } from "@/components/auth/AuthParts";
import s from "@/components/auth/auth.module.css";
import { SelectedPlan } from "@/components/auth/SelectedPlan";
import { SiteShell } from "@/components/layout/SiteShell";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Kw } from "@/components/ui/SignatureTitle";
import { routes } from "@/lib/routes";
import { absoluteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Créer un compte",
  alternates: { canonical: absoluteUrl(routes.inscription) },
  robots: { index: false, follow: true },
};

const D = ({ children }: { children: ReactNode }) => <span className={s.dOnly}>{children}</span>;

/** Création de compte : statique. Rien ne peut être envoyé (voir AuthParts). */
export default function InscriptionPage() {
  return (
    <SiteShell nav="auth" footer="minimal">
      <div className={`${s.layout} ${s.layoutSignup}`}>
        <div className={s.intro}>
          <span className={s.dOnly}>
            <Eyebrow>Créer un compte</Eyebrow>
          </span>
          <h1 className={s.h1}>
            Crée ton compte.
            <br />
            <span className={s.second}>
              Ton prochain texte <Kw>mérite</Kw> mieux.
            </span>
          </h1>
          <ul className={`${s.perks} ${s.dOnlyFlex}`}>
            <li>
              <span className={s.tick} aria-hidden="true">
                ✓
              </span>
              Plan Free, sans carte bancaire
            </li>
            <li>
              <span className={s.tick} aria-hidden="true">
                ✓
              </span>
              Tes scores gardés dans ton historique
            </li>
            <li>
              <span className={s.tick} aria-hidden="true">
                ✓
              </span>
              Tu passes à un plan payant quand tu veux
            </li>
          </ul>
          <p className={`${s.perksShort} ${s.mOnlyBlock}`}>Plan Free, sans carte bancaire.</p>
          <SelectedPlan />
        </div>

        <div className={s.card} role="group" aria-label="Création de compte">
          <Field id="i-prenom" label="Prénom" autoComplete="given-name" />
          <Field id="i-email" label="Email" type="email" autoComplete="email" placeholder="toi@entreprise.fr" />
          <Field
            id="i-mdp"
            label="Mot de passe"
            type="password"
            autoComplete="new-password"
            help="8 caractères minimum."
          />
          <Checkbox id="i-cgu">
            J&apos;accepte les <Link href={routes.legal.conditions}>conditions<D> d&apos;utilisation</D></Link> et la{" "}
            <Link href={routes.legal.confidentialite}>politique de confidentialité</Link>.
          </Checkbox>
          <Checkbox id="i-news" muted>
            Je veux recevoir les nouveaux articles. Facultatif.
          </Checkbox>
          <Button size={52} disabled aria-describedby="i-bientot" className={s.submit}>
            Créer mon compte gratuit →
          </Button>
          <SoonNote id="i-bientot">
            La création de compte ouvrira avec l&apos;app. Rien n&apos;est envoyé depuis cette page.
          </SoonNote>
          <p className={s.switch}>
            Déjà un compte ? <Link href={routes.connexion}>Se connecter</Link>
          </p>
        </div>
      </div>
    </SiteShell>
  );
}
