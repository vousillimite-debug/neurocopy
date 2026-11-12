import type { Metadata } from "next";
import type { ReactNode } from "react";
import { SiteShell } from "@/components/layout/SiteShell";
import { Accordion, AccordionItem } from "@/components/ui/Accordion";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Kw } from "@/components/ui/SignatureTitle";
import {
  ANNUAL_DISCOUNT_LABEL,
  COMPARISON,
  formatPrice,
  GUARANTEE_DAYS,
  type Period,
  type Plan,
  PLANS,
} from "@/lib/plans";
import { routes, signupFor } from "@/lib/routes";
import { absoluteUrl } from "@/lib/site";
import s from "./tarifs.module.css";

export const metadata: Metadata = {
  title: "Tarifs",
  description:
    "Commence gratuit, paie quand ça convertit. Quatre plans sans engagement, garantie satisfait ou remboursé de 30 jours.",
  alternates: { canonical: absoluteUrl(routes.tarifs) },
};

/** Texte affiché seulement sur desktop / seulement sur mobile. */
const D = ({ children }: { children: ReactNode }) => <span className={s.dOnly}>{children}</span>;
const M = ({ children }: { children: ReactNode }) => <span className={s.mOnly}>{children}</span>;

/** Contenu propre à une période : la bascule (boutons radio + CSS) affiche l'un ou l'autre, sans JavaScript. */
const ByPeriod = ({ period, children }: { period: Period; children: ReactNode }) => (
  <span className={period === "mensuel" ? s.monthly : s.annual}>{children}</span>
);

/** Placeholders conservés tels quels (décision de Renaud). */
const FAQ = [
  {
    q: "C'est quoi, une analyse ?",
    a: "Une action sur un texte : un score, une correction ou une rédaction. [RÈGLE DE DÉCOMPTE À CONFIRMER]",
  },
  { q: "Je peux changer de plan en cours de route ?", a: "Oui. Le passage au plan supérieur est immédiat, au prorata." },
  {
    q: "Mensuel ou annuel, quelle différence ?",
    a: "Les mêmes modules. En annuel, tu paies une fois par an et moins cher. [REMISE À CONFIRMER]",
  },
  { q: "J'ai une facture avec TVA ?", a: "Oui, à chaque paiement, téléchargeable depuis ton compte." },
];

function Price({ plan, period }: { plan: Plan; period: Period }) {
  const value = period === "mensuel" ? plan.price : plan.annualMonthlyPrice;
  return (
    <ByPeriod period={period}>
      <span className={s.priceBlock}>
        <span className={s.price}>
          {formatPrice(value)}
          {plan.price > 0 && <span className={s.per}> /mois</span>}
        </span>
        {period === "annuel" && plan.price > 0 && (
          <span className={`${s.billing} ${s.dOnlyBlock}`}>facturé à l&apos;année</span>
        )}
      </span>
    </ByPeriod>
  );
}

function PlanCard({ plan }: { plan: Plan }) {
  const periods: Period[] = ["mensuel", "annuel"];
  return (
    <article
      className={`${s.plan} ${plan.featured ? s.featured : ""} ${s[`order-${plan.id}`]}`}
      aria-labelledby={`plan-${plan.id}`}
    >
      {plan.featured && <span className={s.badge}>LE PLUS CHOISI</span>}
      <div className={s.planHead}>
        <div className={s.planName}>
          <h2 id={`plan-${plan.id}`} className={s.planTitle}>
            {plan.name}
          </h2>
          <span className={`${s.audience} ${s.dOnly}`}>{plan.audience}</span>
        </div>
        {periods.map((p) => (
          <Price key={p} plan={plan} period={p} />
        ))}
      </div>

      {plan.mobileSummary && <span className={`${s.mobileSummary} ${s.mOnlyBlock}`}>{plan.mobileSummary}</span>}

      <div className={s.cta}>
        {periods.map((p) => (
          <ByPeriod key={p} period={p}>
            <Button
              href={signupFor(plan.id, plan.price > 0 ? p : undefined)}
              variant={plan.featured ? "primary" : "outline"}
              size={48}
              className={s.ctaButton}
            >
              {plan.ctaTarifs}
            </Button>
          </ByPeriod>
        ))}
      </div>

      <ul className={`${s.features} ${plan.featured ? "" : s.dOnlyBlock}`}>
        {plan.featuresIntro && (
          <li className={s.featureIntro}>
            <span className={s.check} aria-hidden="true">
              ✓
            </span>
            {plan.featuresIntro}
          </li>
        )}
        {plan.features.map((f) => (
          <li key={f}>
            <span className={s.check} aria-hidden="true">
              ✓
            </span>
            {f}
          </li>
        ))}
      </ul>
    </article>
  );
}

function Cell({ value }: { value: boolean | string }) {
  if (typeof value === "string") return <span className={s.cellText}>{value}</span>;
  return value ? (
    <>
      <span className={s.yes} aria-hidden="true">
        ✓
      </span>
      <span className="nc-sr-only">Inclus</span>
    </>
  ) : (
    <>
      <span className={s.no} aria-hidden="true">
        —
      </span>
      <span className="nc-sr-only">Non inclus</span>
    </>
  );
}

export default function TarifsPage() {
  return (
    <SiteShell current="tarifs" footer="compact">
      <div className={s.page}>
        <header className={s.header}>
          <Eyebrow>Tarifs</Eyebrow>
          <h1 className={s.h1}>
            Commence gratuit.
            <br />
            <span className={s.second}>
              Paie quand ça <Kw>convertit.</Kw>
            </span>
          </h1>
          <p className={`${s.lead} ${s.dOnly}`}>Sans engagement. Tu changes de plan ou tu arrêtes quand tu veux.</p>
          <fieldset className={s.toggle}>
            <legend className="nc-sr-only">Période de facturation</legend>
            <input type="radio" name="periode" id="periode-mensuel" value="mensuel" className={s.radio} defaultChecked />
            <label htmlFor="periode-mensuel" className={s.option}>
              Mensuel
            </label>
            <input type="radio" name="periode" id="periode-annuel" value="annuel" className={s.radio} />
            <label htmlFor="periode-annuel" className={s.option}>
              Annuel<span className={s.discount}>{ANNUAL_DISCOUNT_LABEL}</span>
            </label>
          </fieldset>
        </header>

        <section aria-label="Plans" className={s.plans}>
          {PLANS.map((p) => (
            <PlanCard key={p.id} plan={p} />
          ))}
        </section>

        <section aria-labelledby="comparatif" className={`${s.wide} ${s.compare}`}>
          <h2 id="comparatif" className={s.h2}>
            Tout comparer
            <D>
              .<br />
              <span className={s.second}>
                Ligne par <Kw>ligne.</Kw>
              </span>
            </D>
          </h2>
          <div className={s.tableWrap}>
            <table className={s.table}>
              <caption className="nc-sr-only">Comparatif des plans, fonction par fonction</caption>
              <thead>
                <tr>
                  <th scope="col" className={s.colLabel}>
                    FONCTION
                  </th>
                  {PLANS.map((p) => (
                    <th key={p.id} scope="col" className={p.featured ? s.hl : undefined}>
                      {p.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {COMPARISON.map((row) => (
                  <tr key={row.label}>
                    <th scope="row">
                      {row.short ? (
                        <>
                          <D>{row.label}</D>
                          <M>{row.short}</M>
                        </>
                      ) : (
                        row.label
                      )}
                    </th>
                    {PLANS.map((p) => (
                      <td key={p.id} className={p.featured ? s.hl : undefined}>
                        <Cell value={row.values[p.id]} />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section aria-label="Garantie" className={`${s.wide} ${s.guaranteeWrap}`}>
          <div className={s.guarantee}>
            <div className={s.guaranteeDays}>
              <span className={s.guaranteeNum}>{GUARANTEE_DAYS}</span>
              <span className={s.guaranteeUnit}>jours</span>
            </div>
            <div className={s.guaranteeText}>
              <strong className={s.guaranteeTitle}>
                <D>Garantie {GUARANTEE_DAYS} jours. </D>Satisfait ou remboursé.
              </strong>
              <span className={s.guaranteeBody}>
                Si NeuroCopy ne change rien à tes textes, tu écris un email. On te rembourse, sans justification.
              </span>
            </div>
          </div>
        </section>

        <section aria-labelledby="faq-tarifs" className={s.faq}>
          <h2 id="faq-tarifs" className={s.h2}>
            Questions sur les tarifs
          </h2>
          <Accordion>
            {FAQ.map((f, i) => (
              <AccordionItem key={f.q} question={f.q} open={i === 0}>
                <p>{f.a}</p>
              </AccordionItem>
            ))}
          </Accordion>
        </section>
      </div>
    </SiteShell>
  );
}
