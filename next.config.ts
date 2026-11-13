import type { NextConfig } from "next";
import { REDIRECTS } from "./src/lib/redirects";
import { INDEXING_ALLOWED } from "./src/lib/site";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // Les maquettes et les données brutes ne font pas partie de l'app.
  outputFileTracingExcludes: { "*": ["design/**"] },
  async redirects() {
    return Object.entries(REDIRECTS).map(([source, destination]) => ({
      source,
      destination,
      permanent: true,
    }));
  },
  async headers() {
    // Hors production autorisée (local, prévisualisations, production sur *.vercel.app sans ALLOW_INDEXING) :
    // en-tête noindex sur TOUTES les réponses, y compris fichiers et API.
    if (INDEXING_ALLOWED) return [];
    return [{ source: "/:path*", headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }] }];
  },
};

export default nextConfig;
