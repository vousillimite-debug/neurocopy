import { SiteShell } from "@/components/layout/SiteShell";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Section } from "@/components/ui/Section";
import { Kw, SignatureTitle } from "@/components/ui/SignatureTitle";

// Page provisoire : la vraie homepage arrive à l'étape 3.
export const metadata = { robots: { index: false, follow: false } };

export default function HomePage() {
  return (
    <SiteShell>
      <Section labelledBy="titre">
        <Eyebrow>Le score de conversion de ton copy</Eyebrow>
        <SignatureTitle
          as="h1"
          size="hero"
          id="titre"
          strike
          first="Ton copy a l'air bien."
          second={
            <>
              Le <Kw>cerveau</Kw> a décidé autrement.
            </>
          }
        />
        <div>
          <Button href="/styleguide" size={56}>
            Voir les composants →
          </Button>
        </div>
      </Section>
    </SiteShell>
  );
}
