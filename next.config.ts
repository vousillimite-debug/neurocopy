import type { NextConfig } from "next";
import { REDIRECTS } from "./src/lib/redirects";

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
};

export default nextConfig;
