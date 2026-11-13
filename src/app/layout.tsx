import type { Metadata, Viewport } from "next";

// Polices auto-hébergées (aucun appel à Google Fonts au build ni au runtime).
// Les familles « Inter » et « JetBrains Mono » correspondent exactement aux tokens.
import "@fontsource/inter/400.css";
import "@fontsource/inter/400-italic.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/700.css";
import "@fontsource/inter/800.css";
import "@fontsource/jetbrains-mono/400.css";
import "@fontsource/jetbrains-mono/500.css";
import "@fontsource/jetbrains-mono/600.css";

// Source de vérité des tokens : le fichier de design, importé tel quel.
import "../../design/neurocopy-tokens.css";
import "@/styles/globals.css";

import { INDEXING_ALLOWED, SITE_NAME, SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: SITE_NAME, template: `%s | ${SITE_NAME}` },
  // Hors production autorisée : aucune page indexable. Les pages qui fixent leur propre `robots`
  // le font toujours en noindex (connexion, pages légales…), donc rien ne peut redevenir indexable ici.
  robots: INDEXING_ALLOWED ? undefined : { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: "#000000",
  colorScheme: "dark",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
