import type { Metadata } from "next";
import { LegalPlaceholder } from "@/components/legal/LegalPlaceholder";

// Page provisoire, non indexée : texte définitif à rédiger et valider par Renaud.
export const metadata: Metadata = {
  title: "Politique de confidentialité",
  robots: { index: false, follow: true },
};

export default function Page() {
  return <LegalPlaceholder title="Politique de confidentialité" />;
}
