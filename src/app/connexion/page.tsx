import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { Field, SoonNote } from "@/components/auth/AuthParts";
import s from "@/components/auth/auth.module.css";
import { SiteShell } from "@/components/layout/SiteShell";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Kw } from "@/components/ui/SignatureTitle";
import { routes } from "@/lib/routes";
import { absoluteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Connexion",
  alternates: { canonical: absoluteUrl(routes.connexion) },
  robots: { index: false, follow: true },
};

const D = ({ children }: { children: ReactNode }) => <span className={s.dOnly}>{children}</span>;

/**
 * Connexion : statique. Rien ne peut être envoyé (voir AuthParts).
 * Variante « lien par email » : ancre #lien-email, affichée par :target, sans JavaScript.
 */
export default function ConnexionPage() {
  return (
    <SiteShell nav="auth" footer="minimal">
      <div className={s.layout}>
        <div className={s.intro}>
          <span className={s.dOnly}>
            <Eyebrow>Connexion</Eyebrow>
          </span>
          <h1 className={s.h1}>
            Content de te revoir.
            <br />
            <span className={s.second}>
              Ton copy <Kw>t&apos;attend.</Kw>
            </span>
          </h1>
        </div>

        <div className={s.card}>
          {/* Connexion par mot de passe */}
          <div className={s.pw} role="group" aria-label="Connexion par mot de passe">
            <Field id="c-email" label="Email" type="email" autoComplete="email" placeholder="toi@entreprise.fr" />
            <Field
              id="c-mdp"
              label="Mot de passe"
              type="password"
              autoComplete="current-password"
              aside={<a href="#lien-email">Mot de passe oublié ?</a>}
            />
            <Button size={52} disabled aria-describedby="c-bientot" className={s.submit}>
              Se connecter →
            </Button>
            <SoonNote id="c-bientot">La connexion ouvrira avec l&apos;app. Rien n&apos;est envoyé depuis cette page.</SoonNote>
            <div className={`${s.or} ${s.dOnlyFlex}`} aria-hidden="true">
              <span />
              OU
              <span />
            </div>
            <Button href="#lien-email" variant="outline" size={52} className={s.secondary}>
              <span>
                Recevoir un lien <D>de connexion </D>par email
              </span>
            </Button>
          </div>

          {/* Variante : lien reçu par email */}
          <div id="lien-email" className={s.magic} role="group" aria-labelledby="lien-titre">
            <p id="lien-titre" className={s.magicTitle}>
              Connexion par lien
            </p>
            <p className={s.magicText}>Saisis ton email : on t&apos;envoie un lien pour te connecter, sans mot de passe.</p>
            <Field id="l-email" label="Email" type="email" autoComplete="email" placeholder="toi@entreprise.fr" />
            <Button size={52} disabled aria-describedby="l-bientot" className={s.submit}>
              Recevoir le lien →
            </Button>
            <SoonNote id="l-bientot">L&apos;envoi de liens ouvrira avec l&apos;app. Rien n&apos;est envoyé depuis cette page.</SoonNote>
            <a href="#" className={s.back}>
              ← Revenir au mot de passe
            </a>
          </div>

          <p className={s.switch}>
            Pas encore de compte ?{" "}
            <Link href={routes.inscription}>
              Créer mon compte<D> gratuit</D>
            </Link>
          </p>
        </div>
      </div>
    </SiteShell>
  );
}
