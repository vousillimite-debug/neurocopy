import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Article } from "@/components/article/Article";
import { SiteShell } from "@/components/layout/SiteShell";
import { getAllPages, getPage, pagePath } from "@/lib/content";
import { absoluteUrl } from "@/lib/site";

type Params = { slug: string[] };

/** Toutes les pages d'articles sont générées au build. Toute autre adresse → 404. */
export const dynamicParams = false;

export function generateStaticParams(): Params[] {
  return getAllPages().map((p) => ({ slug: p.slug.split("/") }));
}

async function load(params: Promise<Params>) {
  const { slug } = await params;
  return getPage(slug.map(decodeURIComponent).join("/"));
}

// Métadonnées de base. Le SEO complet (OG, JSON-LD, sitemap) arrive à l'étape 4.
export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const page = await load(params);
  if (!page) return {};
  return {
    title: { absolute: page.meta_title },
    description: page.meta_description,
    alternates: { canonical: absoluteUrl(pagePath(page)) },
  };
}

export default async function ArticlePage({ params }: { params: Promise<Params> }) {
  const page = await load(params);
  if (!page) notFound();
  return (
    <SiteShell current="ressources">
      <Article page={page} />
    </SiteShell>
  );
}
