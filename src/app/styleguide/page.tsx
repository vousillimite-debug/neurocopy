import type { Metadata } from "next";
import { SiteShell } from "@/components/layout/SiteShell";
import { Accordion, AccordionItem } from "@/components/ui/Accordion";
import { ArrowLink } from "@/components/ui/ArrowLink";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Section } from "@/components/ui/Section";
import { Kw, SignatureTitle } from "@/components/ui/SignatureTitle";
import styles from "./styleguide.module.css";

// Page interne de contrôle, jamais indexée.
export const metadata: Metadata = {
  title: "Styleguide",
  robots: { index: false, follow: false },
};

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className={styles.block}>
      <Eyebrow variant="muted" as="p">
        {title}
      </Eyebrow>
      <div className={styles.row}>{children}</div>
    </div>
  );
}

export default function StyleguidePage() {
  return (
    <SiteShell current="ressources">
      <Section labelledBy="sg-titre" gap="md">
        <Eyebrow>Étape 1 · composants de base</Eyebrow>
        <SignatureTitle
          as="h1"
          size="h1"
          id="sg-titre"
          first="Le design system."
          second={
            <>
              Sans une ligne de <Kw>JavaScript.</Kw>
            </>
          }
        />
      </Section>

      <Section tone="alt" labelledBy="sg-titres" gap="md">
        <h2 id="sg-titres" className="nc-sr-only">
          Titres
        </h2>
        <Block title="Titre signature · hero (barré)">
          <SignatureTitle
            as="h3"
            size="hero"
            strike
            first="Ton copy a l'air bien."
            second={
              <>
                Le <Kw>cerveau</Kw> a décidé autrement.
              </>
            }
          />
        </Block>
        <Block title="Titre signature · h2">
          <SignatureTitle
            as="h3"
            size="h2"
            first="Tu écris chaque mot."
            second={
              <>
                Ton lecteur en <Kw>saute</Kw> la plupart.
              </>
            }
          />
        </Block>
        <Block title="Eyebrow">
          <Eyebrow>Le score de conversion de ton copy</Eyebrow>
          <Eyebrow variant="accent">Réponse directe</Eyebrow>
          <Eyebrow variant="accent">01 · Analyser</Eyebrow>
          <Eyebrow variant="muted">Étape 1 · Méthode</Eyebrow>
        </Block>
      </Section>

      <Section labelledBy="sg-actions" gap="md">
        <h2 id="sg-actions" className="nc-sr-only">
          Actions
        </h2>
        <Block title="Boutons · variantes">
          <Button href="#" size={56}>
            Analyser mon premier email →
          </Button>
          <Button href="#" variant="outline" size={56}>
            Voir un exemple
          </Button>
          <Button variant="white" size={44}>
            Accepter
          </Button>
          <Button variant="text" size={44}>
            Plus tard
          </Button>
          <Button size={52} disabled>
            Désactivé
          </Button>
        </Block>
        <Block title="Boutons · tailles 44 / 48 / 52 / 56">
          <Button variant="outline" size={44}>
            44 px
          </Button>
          <Button variant="outline" size={48}>
            48 px
          </Button>
          <Button variant="outline" size={52}>
            52 px
          </Button>
          <Button variant="outline" size={56}>
            56 px
          </Button>
        </Block>
        <Block title="Bouton pleine largeur mobile">
          <Button href="#" variant="outline" size={56} fullWidthMobile>
            Pleine largeur sous 768 px
          </Button>
        </Block>
        <Block title="Liens fléchés">
          <ArrowLink href="#">Lire</ArrowLink>
          <ArrowLink href="#">Voir les 4 plans</ArrowLink>
          <ArrowLink href="#" tone="white">
            Débloquer
          </ArrowLink>
        </Block>
      </Section>

      <Section tone="alt" labelledBy="sg-contenu" gap="md">
        <h2 id="sg-contenu" className="nc-sr-only">
          Contenu
        </h2>
        <Block title="Badges">
          <Badge>Effet Zeigarnik</Badge>
          <Badge variant="source">Zeigarnik, 1927</Badge>
          <Badge variant="plan">GROWTH</Badge>
          <Badge variant="plan" locked>
            GROWTH
          </Badge>
          <Badge variant="filled">Le plus choisi</Badge>
        </Block>
        <div className={styles.grid}>
          <Card>
            <Eyebrow variant="accent">01 · Analyser</Eyebrow>
            <h3 className={styles.cardTitle}>Un score sur 7 dimensions</h3>
            <p className={styles.cardText}>Accroche, clarté, charge cognitive, émotion, preuve, urgence, CTA.</p>
          </Card>
          <Card variant="accent">
            <Eyebrow variant="accent">Étape 3 · NeuroCopy</Eyebrow>
            <h3 className={styles.cardTitle}>Carte accent</h3>
            <p className={styles.cardText}>Bordure jaune 1 px, fond #111.</p>
          </Card>
          <Card variant="alt">
            <Eyebrow variant="muted">Carte alt</Eyebrow>
            <h3 className={styles.cardTitle}>Fond #0A0A0A</h3>
            <p className={styles.cardText}>Panneaux secondaires.</p>
          </Card>
          <Card variant="ghost" padding="lg">
            <span className={styles.cardMuted}>Grammarly</span>
            <span className={styles.cardBig}>vérifie ta grammaire.</span>
          </Card>
        </div>
      </Section>

      <Section labelledBy="sg-faq" gap="md">
        <SignatureTitle as="h2" size="h2" id="sg-faq" first="Accordéon FAQ" second={<>En <Kw>details</Kw> natif.</>} />
        <div className={styles.measure}>
          <Accordion>
            <AccordionItem question="Est-ce que ça remplace un copywriter ?" open>
              <p>
                Non. NeuroCopy remplace le moment où tu relis en te demandant si ça tient. Il te montre où le lecteur
                décroche. Tu acceptes ou tu refuses : la plume reste la tienne.
              </p>
            </AccordionItem>
            <AccordionItem question="D'où viennent les règles du score ?">
              <p>
                D'études publiées en psychologie cognitive et sociale. Chaque correction affiche le biais qu'elle active
                et la référence de l'étude.
              </p>
            </AccordionItem>
          </Accordion>
        </div>
      </Section>
    </SiteShell>
  );
}
