import type { Metadata } from "next";
import { LegalPlaceholder } from "@/components/legal/LegalPlaceholder";

// Page provisoire, non indexée : texte définitif à rédiger et valider par Renaud.
// Une seule page pour les CGU et les CGV, à l'adresse /cgv (décision de Renaud).
export const metadata: Metadata = {
  title: "Conditions générales d'utilisation et de vente",
  robots: { index: false, follow: true },
};

export default function Page() {
  return <LegalPlaceholder title="Conditions générales d'utilisation et de vente" />;
}
