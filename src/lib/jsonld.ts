/**
 * Constructeurs de données structurées : objets JS natifs uniquement.
 * La sérialisation se fait une seule fois, dans <JsonLd>.
 */
import { absoluteUrl } from "./site";

export type CrumbData = { name: string; href: string };

/**
 * BreadcrumbList construite à partir de la MÊME liste que le fil d'Ariane affiché,
 * pour qu'ils correspondent exactement (noms, ordre, URLs).
 * Le breadcrumb du CSV n'est pas utilisé : il contient un niveau absent du site.
 */
export function breadcrumbList(crumbs: CrumbData[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: absoluteUrl(c.href),
    })),
  };
}
