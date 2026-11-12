import type { Metadata } from "next";
import type { ReactNode } from "react";
import { SiteShell } from "@/components/layout/SiteShell";
import { Accordion, AccordionItem } from "@/components/ui/Accordion";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Kw, SignatureTitle } from "@/components/ui/SignatureTitle";
import { formatPrice, GUARANTEE_DAYS, PLANS } from "@/lib/plans";
import { routes, signupFor } from "@/lib/routes";
import { absoluteUrl, SITE_NAME } from "@/lib/site";
import s from "./home.module.css";

export const metadata: Metadata = {
  title: { absolute: `${SITE_NAME} : le score de conversion de ton copy` },
  description:
    "NeuroCopy lit ton texte comme ton lecteur : vite, de travers, en cherchant une raison de partir. Tu vois où il décroche, et quoi changer.",
  alternates: { canonical: absoluteUrl("/") },
};

/* ── Petits utilitaires de mise en page ─────────────────── */

/** Texte affiché seulement sur desktop (complément d'une phrase raccourcie sur mobile). */
const D = ({ children }: { children: ReactNode }) => <span className={s.dOnly}>{children}</span>;
/** Texte affiché seulement sur mobile. */
const M = ({ children }: { children: ReactNode }) => <span className={s.mOnly}>{children}</span>;

type BlockProps = {
  id?: string;
  titleId: string;
  alt?: boolean;
  eyebrow?: ReactNode;
  title: ReactNode;
  /** Titre masqué visuellement sur mobile (absent des maquettes mobiles), gardé pour l'accessibilité. */
  titleHiddenMobile?: boolean;
  intro?: ReactNode;
  gap?: "md" | "lg";
  narrow?: boolean;
  children: ReactNode;
};

function Block({ id, titleId, alt, eyebrow, title, titleHiddenMobile, intro, gap = "lg", narrow, children }: BlockProps) {
  return (
    <section id={id} aria-labelledby={titleId} className={alt ? s.alt : undefined}>
      <Container className={`${s.block} ${gap === "md" ? s.gapMd : s.gapLg} ${narrow ? s.narrow : ""}`}>
        <div className={s.head}>
          {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
          <h2 id={titleId} className={`${s.h2} ${titleHiddenMobile ? s.srMobile : ""}`}>
            {title}
          </h2>
          {intro}
        </div>
        {children}
      </Container>
    </section>
  );
}

function Second({ children }: { children: ReactNode }) {
  return (
    <>
      <br />
      <span className={s.second}>{children}</span>
    </>
  );
}

/* ── Contenus (repris des maquettes, sans modification) ─── */

const MODULES = [
  { n: "01 · ANALYSER", title: "Un score sur 7 dimensions", text: "Accroche, clarté, charge cognitive, émotion, preuve, urgence, CTA." },
  { n: "02 · CORRIGER", title: "Chaque phrase, réécrite", text: "Avec le biais activé et l'étude qui le prouve. Tu acceptes ou tu refuses." },
  { n: "03 · RÉDIGER", title: "Une page blanche qui ne l'est plus", text: "Tu donnes l'offre et la cible. Tu repars avec un premier jet déjà noté." },
  { n: "04 · COMPARER", title: "A contre B, avant l'envoi", text: "Deux versions face à face. Tu sais laquelle gagne, et pourquoi.", plan: "GROWTH" },
];

const LISTEN = [
  { tag: "PEUR", quote: "« Je vais encore perdre ce client. »", src: "Reddit" },
  { tag: "FRUSTRATION", quote: "« Je relance, personne ne répond. »", src: "Amazon" },
  { tag: "DÉSIR", quote: "« Je veux juste qu'ils me répondent. »", src: "Forum" },
];

const OFFER_STEPS = [
  { n: 1, label: "MÉTHODE SUBY", title: "Qui achète, et pourquoi maintenant", text: "Recherche d'audience : douleurs, mots exacts, objections." },
  { n: 2, label: "MÉTHODE HORMOZI", title: "Ce que tu mets dans la balance", text: "Empilement de valeur, garanties, bonus. Le prix devient un détail." },
  { n: 3, label: "NEUROCOPY", title: "Les mots qui la vendent", text: "Page de vente et emails rédigés, puis notés sur 7 dimensions.", accent: true },
];

const PROFILES = [
  { role: "GROWTH MANAGER", claim: "Tu défends tes variantes avec une source, pas avec « je le sens ».", text: "Tu testes moins de mauvaises idées. Ton backlog d'A/B tests se vide plus vite." },
  { role: "COPYWRITER", claim: "Ton client ne discute plus tes choix. Il lit l'étude.", text: "Moins d'allers-retours, des devis plus faciles à justifier." },
  { role: "FOUNDER", claim: "Ta page de vente tient debout sans attendre un recrutement.", text: "Tu écris toi-même, et tu sais avant l'envoi si ça tient." },
];

const GIANTS = [
  {
    big: "×5",
    quote: "« En moyenne, cinq fois plus de gens lisent le titre que le corps du texte. »",
    note: "(traduction libre)",
    short: "lisent le titre plutôt que le texte",
    source: "David Ogilvy · Les confessions d'un publicitaire, 1963",
    sourceShort: "Ogilvy, 1963",
    inApp: "Dans NeuroCopy : la dimension Accroche pèse le plus lourd dans le score.",
  },
  {
    big: "6",
    quote: "principes d'influence : réciprocité, engagement, preuve sociale, autorité, sympathie, rareté.",
    short: "principes d'influence",
    source: "Robert Cialdini · Influence, 1984",
    sourceShort: "Cialdini, 1984",
    inApp: "Dans NeuroCopy : chaque correction nomme le principe qu'elle active.",
  },
  {
    big: "÷",
    quote: "La valeur perçue monte avec le résultat et la confiance. Elle baisse avec le délai et l'effort.",
    short: "l'équation de valeur",
    source: "Alex Hormozi · $100M Offers, 2021",
    sourceShort: "Hormozi, 2021",
    inApp: "Dans NeuroCopy : l'assistant Offre irrésistible part de cette équation.",
  },
  {
    big: "3 %",
    quote: "de ton marché est prêt à acheter maintenant, d'après Sabri Suby. Les autres doivent d'abord être convaincus.",
    short: "du marché prêt à acheter, d'après Suby",
    source: "Sabri Suby · Sell Like Crazy, 2019",
    sourceShort: "Suby, 2019",
    inApp: "Dans NeuroCopy : le score distingue copy de conversion et copy d'éducation.",
  },
];

const DEMO_SCORE = 74;
const DEMO_DIMENSIONS = [
  { label: "Accroche", value: 84 },
  { label: "Clarté", value: 90 },
  { label: "Preuve", value: 66 },
  { label: "Urgence", value: 58 },
];

/** Placeholders à remplacer par de vrais témoignages. Ne jamais inventer. */
const TESTIMONIALS = [
  { result: "[+X %]", quote: "[Citation réelle d'un utilisateur bêta, avec le résultat qu'il a mesuré]", name: "[Prénom N.]", role: "[Growth manager, entreprise]" },
  { result: "[X pts]", quote: "[Citation réelle d'un copywriter indépendant]", name: "[Prénom N.]", role: "[Copywriter freelance]" },
  { result: "[X h]", quote: "[Citation réelle d'un founder]", name: "[Prénom N.]", role: "[Founder, entreprise]" },
];

const STEPS = [
  { title: "Colle ton texte", text: <>Email, page de vente, post, objet.<D> Ce que tu veux.</D></> },
  { title: "Lis ton score", text: <>Sur 100, détaillé en 7 dimensions, avec les passages qui coincent.</> },
  { title: "Applique les corrections", text: <>Chacune avec son biais et sa source.<D> Tu gardes la main.</D></> },
];

const FAQ = [
  {
    q: "Est-ce que ça remplace un copywriter ?",
    a: "Non. NeuroCopy remplace le moment où tu relis en te demandant si ça tient. Il te montre où le lecteur décroche. Il propose une réécriture. Tu acceptes ou tu refuses : la plume reste la tienne.",
  },
  {
    q: "D'où viennent les règles du score ?",
    a: "D'études publiées en psychologie cognitive et sociale : Kahneman et Tversky, Cialdini, Loewenstein et d'autres. Chaque correction affiche le biais qu'elle active et la référence de l'étude. Pas de source, pas de règle.",
  },
  {
    q: "Ça marche pour quels textes ?",
    a: "Tout texte qui doit faire agir quelqu'un : emails, objets, pages de vente, landing pages, posts LinkedIn, publicités. Tu indiques le type de texte. Le score s'adapte.",
  },
  {
    q: "Mes textes restent privés ?",
    a: "Oui. Ton texte sert à l'analyse, puis reste dans ton historique tant que tu le gardes. Il n'est ni revendu ni utilisé pour entraîner un modèle. Tu peux tout effacer depuis ton compte.",
  },
  {
    q: "Je peux annuler quand je veux ?",
    a: "Oui. Tu annules depuis ton compte, sans appel ni formulaire. Ton plan reste actif jusqu'à la fin de la période payée. Et la garantie satisfait ou remboursé s'applique.",
  },
];

/* ── Page ───────────────────────────────────────────────── */

export default function HomePage() {
  const featured = PLANS.find((p) => p.featured);
  const others = PLANS.filter((p) => !p.featured);
  const ringLength = 2 * Math.PI * 52;

  return (
    <SiteShell>
      {/* Hero */}
      <section aria-labelledby="hero-titre">
        <Container className={s.hero}>
          <Eyebrow>
            <D>Le score de conversion de ton copy</D>
            <M>Score de conversion</M>
          </Eyebrow>
          <SignatureTitle
            as="h1"
            size="hero"
            id="hero-titre"
            strike
            first="Ton copy a l'air bien."
            second={
              <>
                Le <Kw>cerveau</Kw> a décidé autrement.
              </>
            }
          />
          <p className={s.lead}>
            NeuroCopy lit ton texte comme ton lecteur : vite, de travers, en cherchant une raison de partir.
            <D> Tu vois où il décroche, et quoi changer.</D>
          </p>
          <div className={s.actions}>
            <Button href={routes.outils.analyseurEmail} size={56} fullWidthMobile>
              Analyser mon premier email →
            </Button>
            <span className={s.dOnly}>
              <Button href={routes.demo} variant="outline" size={56}>
                Voir un exemple
              </Button>
            </span>
          </div>
          <span className={s.reassure}>
            Gratuit · sans carte bancaire<D> · en français</D>
          </span>
        </Container>
      </section>

      {/* Le problème */}
      <section aria-labelledby="probleme" className={s.alt}>
        <Container className={`${s.block} ${s.problem}`}>
          <div className={s.problemText}>
            <Eyebrow>Le problème</Eyebrow>
            <h2 id="probleme" className={s.h2}>
              Tu écris chaque mot.
              <Second>
                Ton lecteur en <Kw>saute</Kw> la plupart.
              </Second>
            </h2>
            <p className={`${s.intro} ${s.dOnly}`}>
              Il ne décide pas sur ce que tu dis. Il décide sur ce qu&apos;il a vu en scannant. Une relecture ne te dit
              pas ce qu&apos;il a vu.
            </p>
          </div>
          <div className={s.statCard}>
            <span className={s.statPrefix}>Environ</span>
            <span className={s.statBig}>20 %</span>
            <p className={s.statText}>des mots d&apos;une page sont réellement lus.</p>
            <span className={s.mono}>
              <D>Source : </D>Nielsen Norman Group, 2008
            </span>
          </div>
        </Container>
      </section>

      {/* Le mécanisme */}
      <Block
        id="methode"
        titleId="mecanisme"
        eyebrow="Le mécanisme"
        titleHiddenMobile
        title={
          <>
            Tu as un outil pour chaque métrique.
            <Second>
              Sauf celle qui <Kw>paie.</Kw>
            </Second>
          </>
        }
      >
        <ul className={s.compare}>
          <li className={s.compareItem}>
            <span className={s.compareName}>Grammarly</span> <span className={s.compareText}>vérifie ta grammaire.</span>
          </li>
          <li className={s.compareItem}>
            <span className={s.compareName}>HubSpot</span> <span className={s.compareText}>note ton SEO.</span>
          </li>
          <li className={`${s.compareItem} ${s.compareOurs}`}>
            <span className={s.compareName}>
              <span className={s.pip} aria-hidden="true" />
              NeuroCopy
            </span>{" "}
            <span className={s.compareText}>
              note ta <Kw>conversion.</Kw>
            </span>
          </li>
        </ul>
      </Block>

      {/* Les 5 modules */}
      <Block
        alt
        titleId="modules"
        eyebrow="Les 5 modules"
        title={
          <>
            Du marché au texte final.
            <Second>
              Dans le même <Kw>écran.</Kw>
            </Second>
          </>
        }
      >
        <div className={s.modules}>
          <ul className={s.moduleGrid}>
            {MODULES.map((m) => (
              <li key={m.n} className={s.module}>
                <span className={s.moduleHead}>
                  <span className={s.moduleNum}>{m.n}</span>
                  {m.plan && <span className={s.plan}>{m.plan}</span>}
                </span>
                <h3 className={s.moduleTitle}>{m.title}</h3>
                <p className={s.moduleText}>{m.text}</p>
              </li>
            ))}
          </ul>
          <div className={`${s.module} ${s.moduleWide}`}>
            <div className={s.moduleWideText}>
              <span className={s.moduleHead}>
                <span className={s.moduleNum}>05 · ÉCOUTER</span>
                <span className={s.plan}>GROWTH</span>
              </span>
              <h3 className={s.moduleWideTitle}>Écoute ton marché</h3>
              <p className={s.moduleWideBody}>
                Reddit, forums, avis Amazon : tu vois les mots exacts que ton audience emploie pour parler de ses peurs,
                de ses frustrations et de ses désirs.
              </p>
            </div>
            <div className={`${s.listen} ${s.dOnlyBlock}`}>
              <span className={s.listenLabel}>EXEMPLE DE SORTIE</span>
              {LISTEN.map((l) => (
                <div key={l.tag} className={s.listenRow}>
                  <span className={s.listenTag}>{l.tag}</span>
                  <span className={s.listenQuote}>{l.quote}</span>
                  <span className={s.listenSrc}>{l.src}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Block>

      {/* Offre irrésistible */}
      <Block
        titleId="offre"
        eyebrow="Offre irrésistible"
        gap="md"
        title={
          <>
            Parfois, ce n&apos;est pas ton copy.
            <Second>
              C&apos;est ton <Kw>offre.</Kw>
            </Second>
          </>
        }
        intro={
          <p className={`${s.intro} ${s.dOnly}`}>
            Quand le score bute sur un problème d&apos;offre, NeuroCopy te le dit. Puis l&apos;assistant la reconstruit
            avec toi, en trois étapes.
          </p>
        }
      >
        <ol className={s.offer}>
          {OFFER_STEPS.map((o) => (
            <li key={o.n} className={`${s.offerStep} ${o.accent ? s.offerAccent : ""}`}>
              <span className={s.offerLabel}>
                <D>ÉTAPE </D>
                {o.n} · {o.label}
              </span>
              <h3 className={s.offerTitle}>{o.title}</h3>
              <p className={`${s.offerText} ${s.dOnly}`}>{o.text}</p>
            </li>
          ))}
        </ol>
        <p className={`${s.equation} ${s.dOnlyFlex}`}>
          <span className={s.equationLabel}>ÉQUATION DE VALEUR</span>
          <span>
            Valeur = <Kw>(Résultat rêvé × Probabilité perçue)</Kw> ÷{" "}
            <span className={s.muted}>(Délai × Effort)</span>
          </span>
        </p>
      </Block>

      {/* Profils */}
      <Block
        alt
        titleId="profils"
        titleHiddenMobile
        eyebrow={
          <>
            Ce que ça change<D> pour toi</D>
          </>
        }
        title={
          <>
            Trois métiers.
            <Second>
              Une même <Kw>fin de journée.</Kw>
            </Second>
          </>
        }
      >
        <ul className={s.grid3}>
          {PROFILES.map((p) => (
            <li key={p.role} className={s.profile}>
              <span className={s.cardTag}>{p.role}</span>
              <p className={s.profileClaim}>{p.claim}</p>
              <p className={`${s.cardText} ${s.dOnly}`}>{p.text}</p>
            </li>
          ))}
        </ul>
      </Block>

      {/* Les géants */}
      <Block
        titleId="geants"
        titleHiddenMobile
        eyebrow={
          <>
            <D>Les </D>Preuves par les géants
          </>
        }
        title={
          <>
            Rien d&apos;inventé ici.
            <Second>
              On a lu les <Kw>classiques.</Kw>
            </Second>
          </>
        }
      >
        <ul className={s.giants}>
          {GIANTS.map((g) => (
            <li key={g.source} className={s.giant}>
              <span className={s.giantBig}>{g.big}</span>
              <p className={s.giantQuote}>
                <D>
                  {g.quote}
                  {g.note && <span className={s.giantNote}> {g.note}</span>}
                </D>
                <M>{g.short}</M>
              </p>
              <span className={s.giantSource}>
                <D>{g.source}</D>
                <M>{g.sourceShort}</M>
              </span>
              <p className={`${s.giantApp} ${s.dOnly}`}>{g.inApp}</p>
            </li>
          ))}
        </ul>
      </Block>

      {/* Démo */}
      <Block
        alt
        id="demo"
        titleId="demo-titre"
        gap="md"
        titleHiddenMobile
        eyebrow="Démo"
        title={
          <>
            Un email de relance.
            <Second>
              Noté en <Kw>quelques secondes.</Kw>
            </Second>
          </>
        }
      >
        <figure className={s.window} aria-label="Exemple d'analyse d'un email de relance">
          <div className={s.windowBar} aria-hidden="true">
            <span className={s.windowDot} />
            <span className={s.windowDot} />
            <span className={s.windowDot} />
            <span className={s.windowName}>app.neurocopy · Analyser</span>
          </div>
          <div className={s.demo}>
            <div className={s.demoEmail}>
              <p className={s.demoSubject}>
                <span className={s.demoSubjectLabel}>OBJET</span>
                <strong>Une décision de mardi attend encore ton avis</strong>
              </p>
              <p className={s.dOnly}>Tu as relancé combien de prospects cette semaine ? Et combien t&apos;ont répondu ?</p>
              <p className={s.dOnly}>
                Chaque semaine sans méthode, ce sont des devis qui dorment dans ta boîte d&apos;envoi.{" "}
                <span className={s.flag}>La prochaine session commence bientôt.</span>
              </p>
              <p className={s.dOnly}>Réponds juste « oui » et je t&apos;envoie le programme ce soir.</p>
            </div>
            <div className={s.demoScore}>
              <div className={s.scoreRow}>
                <div className={s.ring}>
                  <svg viewBox="0 0 120 120" aria-hidden="true">
                    <circle className={s.ringTrack} cx="60" cy="60" r="52" />
                    <circle
                      className={s.ringValue}
                      cx="60"
                      cy="60"
                      r="52"
                      strokeDasharray={`${(ringLength * DEMO_SCORE) / 100} ${ringLength}`}
                      transform="rotate(-90 60 60)"
                    />
                  </svg>
                  <span className={s.ringLabel}>
                    <span className={s.ringNum}>{DEMO_SCORE}</span>
                    <span className={s.ringMax}>/100</span>
                  </span>
                </div>
                <div className={s.verdict}>
                  <span className={`${s.verdictLabel} ${s.dOnly}`}>SCORE</span>
                  <strong className={s.verdictText}>Bon socle. L&apos;urgence reste floue.</strong>
                </div>
              </div>
              <ul className={`${s.bars} ${s.dOnlyFlex}`}>
                {DEMO_DIMENSIONS.map((d) => (
                  <li key={d.label} className={s.bar}>
                    <span className={s.barLabel}>{d.label}</span>
                    <span className={s.barTrack} aria-hidden="true">
                      <span className={s.barFill} style={{ width: `${d.value}%` }} />
                    </span>
                    <span className={s.barValue}>{d.value}</span>
                  </li>
                ))}
                <li className={s.barMore}>+ 3 autres dimensions</li>
              </ul>
            </div>
          </div>
        </figure>
      </Block>

      {/* Témoignages (placeholders conservés tels quels) */}
      <Block titleId="temoignages" titleHiddenMobile eyebrow="Témoignages" title="Ils l'ont testé avant toi.">
        <ul className={s.testimonials} aria-label="Témoignages">
          {TESTIMONIALS.map((t, i) => (
            <li key={i} className={s.testimonialItem}>
              <figure className={s.testimonial}>
                <span className={s.testimonialResult}>{t.result}</span>
                <blockquote className={s.testimonialQuote}>{t.quote}</blockquote>
                <figcaption className={s.testimonialWho}>
                  <span className={s.avatar} aria-hidden="true" />
                  <span>
                    <strong className={s.testimonialName}>{t.name}</strong>
                    <M> · </M>
                    {t.role}
                  </span>
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </Block>

      {/* Comment ça marche */}
      <Block
        alt
        titleId="etapes"
        titleHiddenMobile
        eyebrow="Comment ça marche"
        title={
          <>
            Trois étapes.
            <Second>
              Zéro <Kw>jargon.</Kw>
            </Second>
          </>
        }
      >
        <ol className={s.steps}>
          {STEPS.map((st, i) => (
            <li key={st.title} className={`${s.step} ${i === 0 ? s.stepFirst : ""}`}>
              <span className={s.stepNum}>{String(i + 1).padStart(2, "0")}</span>
              <div className={s.stepBody}>
                <h3 className={s.stepTitle}>{st.title}</h3>
                <p className={s.stepText}>{st.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </Block>

      {/* Tarifs */}
      <Block
        id="tarifs"
        titleId="tarifs-titre"
        gap="md"
        titleHiddenMobile
        eyebrow="Tarifs"
        title={
          <>
            Commence gratuit.
            <Second>
              Paie quand ça <Kw>convertit.</Kw>
            </Second>
          </>
        }
      >
        <ul className={s.plans}>
          {PLANS.map((p) => (
            <li key={p.id} className={`${s.plan4} ${p.featured ? s.planFeatured : s.dOnlyFlex}`}>
              {p.featured && <span className={s.planBadge}>LE PLUS CHOISI</span>}
              <div className={s.planHead}>
                <strong className={s.planName}>{p.name}</strong>
                <span className={s.planPrice}>
                  {formatPrice(p.price)}
                  {p.price > 0 && (
                    <D>
                      <span className={s.planPer}> /mois</span>
                    </D>
                  )}
                </span>
              </div>
              <span className={s.planSummary}>{p.summary}</span>
              <Button
                href={signupFor(p.id)}
                variant={p.featured ? "primary" : "outline"}
                size={48}
                className={s.planCta}
              >
                {p.cta}
              </Button>
            </li>
          ))}
        </ul>
        {featured && (
          <p className={`${s.plansOthers} ${s.mOnlyBlock}`}>
            {others.map((p) => `${p.name} ${formatPrice(p.price)}`).join(" · ")}
          </p>
        )}
        <div className={s.plansFoot}>
          <span className={s.dOnly}>
            <Kw>
              <strong>{GUARANTEE_DAYS} jours</strong>
            </Kw>{" "}
            satisfait ou remboursé · sans engagement
          </span>
          <a href={routes.tarifs} className={s.plansLink}>
            <D>Comparer les plans en détail →</D>
            <M>Voir les 4 plans →</M>
          </a>
        </div>
      </Block>

      {/* FAQ */}
      <Block alt narrow titleId="faq-titre" gap="md" title="Questions fréquentes">
        <Accordion>
          {FAQ.map((f, i) => (
            <AccordionItem key={f.q} question={f.q} open={i === 0}>
              <p>{f.a}</p>
            </AccordionItem>
          ))}
        </Accordion>
      </Block>

      {/* CTA final */}
      <section aria-labelledby="final">
        <Container className={s.final}>
          <SignatureTitle
            as="h2"
            size="display"
            id="final"
            first="Ton prochain email part quand ?"
            second={
              <>
                Analyse-le <Kw>avant.</Kw>
              </>
            }
          />
          <Button href={routes.outils.analyseurEmail} size={56} fullWidthMobile>
            Analyser mon premier email →
          </Button>
          <span className={`${s.reassure} ${s.dOnly}`}>Gratuit · sans carte bancaire</span>
        </Container>
      </section>
    </SiteShell>
  );
}
