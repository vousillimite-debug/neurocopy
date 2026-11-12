import type { ReactNode } from "react";
import Link from "next/link";
import { Accordion, AccordionItem } from "@/components/ui/Accordion";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { anchorsFor, ctaTarget, formatDate, isoDate, splitTitle, ucfirst } from "@/lib/article";
import {
  type ContentPage,
  getParentPilier,
  getResolvedLinks,
  pagePath,
  readingMinutes,
  splitCta,
  toParagraphs,
} from "@/lib/content";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbList } from "@/lib/jsonld";
import { routes } from "@/lib/routes";
import { AUTHOR } from "@/lib/site";
import { AuthorNote } from "./AuthorNote";
import { Breadcrumb, type Crumb } from "./Breadcrumb";
import { ContextCta } from "./ContextCta";
import { DirectAnswer } from "./DirectAnswer";
import { RelatedLinks, type RelatedItem } from "./RelatedLinks";
import { TocCollapsible, TocSidebar, type TocEntry } from "./Toc";
import { TocSpy } from "./TocSpy";
import styles from "./article.module.css";

const FAQ_ID = "faq";

function Paragraphs({ text }: { text: string }) {
  return (
    <>
      {toParagraphs(text).map((p, i) => (
        <p key={i}>{p}</p>
      ))}
    </>
  );
}

function toRelated(p: ContentPage, href = pagePath(p), title?: string): RelatedItem {
  return { href, title: title ?? ucfirst(p.mot_cle_principal), type: p.type, minutes: readingMinutes(p) };
}

/** Gabarit d'article, pilier ou satellite. 100 % rendu serveur. */
export function Article({ page }: { page: ContentPage }) {
  const isPilier = page.type === "pilier";
  const parent = getParentPilier(page);
  const minutes = readingMinutes(page);
  const title = splitTitle(page.h1);
  const sections = page.h2_sections;
  const ids = anchorsFor(sections.map((s) => s.h2));

  /* Fil d'Ariane */
  const crumbs: Crumb[] = [{ name: "Accueil", href: routes.home }];
  if (parent) crumbs.push({ name: ucfirst(parent.mot_cle_principal), href: pagePath(parent) });
  crumbs.push({ name: ucfirst(page.mot_cle_principal), href: pagePath(page) });

  /* Sommaire */
  const toc: TocEntry[] = sections.map((s, i) => ({ id: ids[i], label: s.h2 }));
  if (page.faq.length) toc.push({ id: FAQ_ID, label: "FAQ" });
  const tocTitle = isPilier ? "Sommaire" : "Dans cet article";

  /* CTA : avant la dernière section. Note : milieu (pilier) ou fin (satellite). */
  const cta = splitCta(page.cta_text);
  const target = ctaTarget(cta.path);
  const ctaAfter = Math.max(0, sections.length - 2);
  const noteAfter = isPilier ? Math.max(0, Math.ceil(sections.length / 2) - 1) : sections.length - 1;

  /* Liens internes */
  const links = getResolvedLinks(page).filter((l) => l.target.slug !== parent?.slug);
  const related = links.map((l) => toRelated(l.target, l.href, l.label));
  const featured = parent ? toRelated(parent) : undefined;

  const ctaBlock = page.cta_text ? (
    <ContextCta
      eyebrow={target.eyebrow}
      title={cta.text}
      href={target.href}
      button={target.button}
      reassurance={target.reassurance}
    />
  ) : null;
  const noteBlock = page.note_editoriale ? <AuthorNote text={page.note_editoriale} withEyebrow={!isPilier} /> : null;

  const body: ReactNode[] = [];
  sections.forEach((s, i) => {
    body.push(
      <h2 key={`h-${i}`} id={ids[i]} className={styles.h2}>
        {s.h2}
      </h2>,
    );
    toParagraphs(s.contenu).forEach((p, j) => body.push(<p key={`p-${i}-${j}`}>{p}</p>));
    if (i === ctaAfter && ctaBlock) body.push(<div key="cta">{ctaBlock}</div>);
    if (i === noteAfter && noteBlock) body.push(<div key="note">{noteBlock}</div>);
  });

  return (
    <div className={isPilier ? styles.pilier : styles.satellite}>
      <header className={`${styles.wrap} ${styles.header}`}>
        <Breadcrumb items={crumbs} />
        <JsonLd data={breadcrumbList(crumbs)} />

        {isPilier ? (
          <Eyebrow>Guide pilier · {ucfirst(page.mot_cle_principal)}</Eyebrow>
        ) : (
          parent && (
            <Link href={pagePath(parent)} className={styles.guideChip}>
              <span className={styles.chipDot} aria-hidden="true" />
              <span>
                Fait partie du guide <strong>{ucfirst(parent.mot_cle_principal)}</strong>
              </span>
            </Link>
          )
        )}

        <h1 className={styles.h1}>
          {title.first}
          {title.keyword && (
            <>
              <br />
              <span className={styles.h1Second}>
                {title.second}
                <span className={styles.h1Kw}>{title.keyword}</span>
              </span>
            </>
          )}
        </h1>

        <div className={styles.meta}>
          <span className={styles.author}>
            {isPilier && (
              <span className={styles.avatar} aria-hidden="true">
                {AUTHOR.initial}
              </span>
            )}
            <span>
              Par <strong>{AUTHOR.name}</strong>
              {isPilier && <span className={styles.metaLong}>, {AUTHOR.credential}</span>}
            </span>
          </span>
          <span className={styles.metaMono}>
            <span className={styles.metaLong}>Mis à jour le </span>
            <time dateTime={isoDate(page.updated_at)}>{formatDate(page.updated_at)}</time>
          </span>
          <span className={styles.metaMono}>
            {minutes} min<span className={styles.metaLong}> de lecture</span>
          </span>
        </div>
      </header>

      <div className={`${styles.wrap} ${styles.body}`}>
        <TocSidebar
          title={tocTitle}
          entries={toc}
          aside={isPilier ? { href: routes.outils.analyseurEmail, label: "Tester ton email gratuitement →" } : undefined}
        />

        <article className={styles.article}>
          <TocCollapsible title={tocTitle} entries={toc} />
          {page.reponse_directe && <DirectAnswer text={page.reponse_directe} />}
          <Paragraphs text={page.intro} />

          {isPilier && sections.length > 1 && (
            <nav className={styles.summary} aria-labelledby="summary-title">
              <span id="summary-title" className={styles.tocTitle}>
                CE GUIDE EN {sections.length} PARTIES
              </span>
              <ol className={styles.summaryList}>
                {sections.map((s, i) => (
                  <li key={ids[i]}>
                    <a href={`#${ids[i]}`}>
                      <span className={styles.num}>{String(i + 1).padStart(2, "0")}</span>
                      {s.h2}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
          )}

          {body}

          {page.faq.length > 0 && (
            <section id={FAQ_ID} className={styles.faq} aria-labelledby="faq-title">
              <h2 id="faq-title" className={`${styles.h2} ${styles.faqTitle}`}>
                Questions fréquentes
              </h2>
              <Accordion size="article">
                {page.faq.map((f, i) => (
                  <AccordionItem key={i} question={f.q} open={i === 0}>
                    <p>{f.a}</p>
                  </AccordionItem>
                ))}
              </Accordion>
            </section>
          )}

          <RelatedLinks
            title={isPilier ? "Approfondir" : "Pour aller plus loin"}
            featured={featured}
            items={related}
          />
        </article>
      </div>
      <TocSpy />
    </div>
  );
}
