# NeuroCopy — règles du projet

SaaS de copywriting neuro-psychologique en français : site SEO (~147 pages), 2 outils gratuits (analyseur d'email, testeur d'accroche), app payante.
Propriétaire : Renaud. **Toujours lui répondre en français, simplement, sans jargon inutile.**

## Environnement
- Windows géré par l'entreprise, **pas de droits admin** : ne jamais tenter d'installation admin/globale système.
- Terminal : PowerShell dans VS Code. Node 20 (via fnm), npm 10, git disponibles. Pas de pnpm, pas de Python.
- **Réseau** : l'antivirus Kaspersky intercepte le HTTPS. Pour npm/npx, définir `NODE_EXTRA_CA_CERTS=C:\Users\rczerwiec\.certs\kaspersky-root.pem` (certificat exporté du magasin Windows). Ne jamais désactiver `strict-ssl`.
- Playwright : Chromium headless installé dans le profil utilisateur. Captures : `npm run build && npm start` puis `npm run screenshots` (sortie dans `screenshots/`, ignoré par git). Repli possible : Edge (`channel: "msedge"`).
- Git local uniquement. Aucun commit sans demande, aucun push sans feu vert.

## Sources
- `design/*.dc.html` : maquettes Claude Design = **références visuelles uniquement**. Lire leurs styles inline pour reproduire couleurs, tailles, espacements, rayons. Ne jamais copier leur code.
- `design/neurocopy-tokens.css` (+ `.json`) : **source de vérité** des tokens. Aucune couleur en dur dans le code.
- `design/neurocopy-composants.md` : liste des composants et variantes. Tous fonctionnent **sans JavaScript** (`<details>` pour accordéons, sommaire mobile, etc.).
- `data/pages_rows.csv` : export de la table `pages` (148 lignes). **Ignorer la ligne `cocon = "test"`** (slug `test-page`).
- Identité : fond noir, texte blanc, un seul accent jaune `#E8FF47`, polices Inter + JetBrains Mono.

## Stack
- Next.js App Router + TypeScript.
- Pages de contenu **100 % statiques** (`generateStaticParams`), aucun contenu rendu côté client.
- Articles : route catch-all pour les slugs imbriqués (ex. `biais-cognitifs/reciprocite`).
- CSS : variables des tokens + CSS Modules (ou Tailwind branché sur les tokens).
- Données : projet Supabase **NEUF** (jamais l'ancien). Pour l'instant : migration SQL + script d'import CSV ; les pages lisent le CSV en local. Renaud fournira les clés.
- Table `pages` : id, created_at, updated_at, slug (unique), cocon, type (pilier/satellite), statut, mot_cle_principal, volume_mensuel, kd, concurrence, meta_title, meta_description, canonical, og_title, og_description, og_type, schema_type, schema_extra, faq_schema, breadcrumb, h1, reponse_directe, intro, h2_sections (jsonb `[{h2, contenu}]`), faq (jsonb `[{q, a}]`), cta_text, note_editoriale, internal_links (jsonb `[{url, label}]`).

## Règles non négociables
- **JSON-LD** : objets JS natifs, sérialisés **une seule fois** dans le composant de balise. Jamais de `JSON.stringify` en amont.
- **Sécurité** : aucune clé API côté client. Appels Anthropic uniquement via route handlers serveur, avec limitation de débit. Les outils gratuits **ne stockent pas** les textes.
- **Tutoiement** partout dans l'interface.
- **Mots interdits** : innovant, solution, révolutionnaire, tout-en-un, basé sur l'IA.
- **Pas de faux témoignage ni de faux chiffre** : les placeholders `[Prénom N.]`, `[N]`, `[−X %]` restent tels quels.
- **Canonical / URLs absolues** : construites depuis la variable d'environnement `SITE_URL` (cible : https://neurocopy.fr, domaine pas encore acheté). Ne pas se fier aux URLs absolues stockées dans le CSV.
- **Ne rien publier, ne rien pousser sur GitHub, ne créer aucun compte** sans demande explicite de Renaud.

## Plan (une étape à la fois, validation de Renaud à la fin de chaque étape)
0. Diagnostic (fait le 12/11/2026).
1. Projet Next.js + tokens + polices + layout (Nav, Footer) + composants de base.
2. Gabarit d'article pilier + satellite, desktop + mobile (sommaire, réponse directe, avant/après, FAQ, note de l'auteur, liens internes), alimenté par le CSV. Contrôle visuel Playwright (1440 et 390) vs maquettes.
3. Homepage, pages outils (analyseur d'email, testeur d'accroche) en statique, tarifs.
4. SEO technique : metadata, canonical, JSON-LD, sitemap, robots, redirections.
5. Plus tard, après validation : auth, Stripe, outils branchés sur l'API Anthropic (serveur), app payante.

## Prérequis de l'étape 5 (avant de brancher l'API Anthropic)
- **Les compteurs de limitation de débit en mémoire ne fonctionnent pas sur Vercel** (serverless : chaque instance a sa propre mémoire). Il faut d'abord un **stockage partagé** (Upstash Redis ou Supabase) derrière  ().
- **Renaud doit fixer un plafond de dépense mensuel sur la clé API Anthropic** avant tout branchement.
- IP : ne faire confiance qu'à l'en-tête posé par l'hébergeur (x-forwarded-for est falsifiable hors proxy).

## Décisions de Renaud (12/11/2026)
- **Mots interdits dans les articles** : la règle s'applique aussi au contenu, mais **ne modifier AUCUN texte** d'article. Préparer un rapport (slug + phrase) pour « solution » (seulement quand c'est un argument marketing creux), « tout-en-un » et le vouvoiement. Les corrections se font en base, page par page, après son accord.
- **Liens internes vers 4 pages inexistantes** : proposer la page existante la plus proche, Renaud valide, puis redirection (jamais de lien mort publié).
- **Pilier mobile** : pas de maquette ; construire à partir du satellite mobile + pilier desktop. Maquette à venir.
- **4 satellites sans breadcrumb / schema_extra, et faq_schema vide** : générer à partir de slug, cocon et faq.
- **Étape 2 validée** : CTA (/analyser → analyseur ; /rediger, /comparer → tarifs), « Par Renaud, diplômé en psychologie » (exact), fil d'Ariane sans « Ressources », cartes avec libellé court.
- **JSON-LD BreadcrumbList = fil d'Ariane affiché**, construit depuis la même liste (`src/lib/jsonld.ts`). Le breadcrumb du CSV n'est pas utilisé pour le rendu.
- **Colonnes `exemples` et `sources`** : nullables, vides. **Ne JAMAIS inventer d'exemple ni de référence** : Renaud les saisit page par page avec vérification des sources. L'import ne les envoie jamais.
- **Étape 3, une sous-étape à la fois, validation entre chaque** : homepage → outils (/analyser-email avec états quota, erreur, texte trop court ; /testeur-accroche) → tarifs → connexion/inscription (statiques, sans auth). Outils statiques : aucun appel d'API, seulement la structure des futurs route handlers. Captures 1440 et 390 vs maquettes pour chaque écran.

## Choix techniques (étape 1)
- Next.js 16.4.x (≥ 16.4.1 obligatoire : failles critiques avant), React 19, TypeScript 5.9 (pas la 7).
- Polices auto-hébergées via `@fontsource` (familles « Inter » / « JetBrains Mono » = noms des tokens).
- Tokens importés directement depuis `design/neurocopy-tokens.css` dans `src/app/layout.tsx` ; valeurs mobiles dans `src/styles/globals.css`.
- CSS Modules, aucune couleur en dur. Lien global en `:where(a)` (spécificité nulle).
- Conteneur : 1200 px de contenu + gouttières (comme les maquettes, qui sont en `content-box`).
- Points de rupture : mobile < 768 px ; nav burger < 960 px.
- Adresses internes centralisées dans `src/lib/routes.ts`. URL du site dans `src/lib/site.ts` (`SITE_URL`).
- `/styleguide` : page interne non indexée qui montre tous les composants.

## Choix techniques (étape 2 : articles)
- Route catch-all `src/app/[...slug]/page.tsx`, `dynamicParams = false` : 147 pages générées au build, le reste en 404.
- Données : `src/lib/content.ts` (lecture du CSV au build, `server-only`, csv-parse ≥ 7.0.2). Clé `body` → `contenu` harmonisée à la lecture (59 sections).
- Présentation : `src/lib/article.ts`. H1 découpé sur « — » / « : » (ligne 2 grise, dernier mot en jaune), texte inchangé.
- Pilier de rattachement : fil d'Ariane position 2 → lien interne vers un pilier du même cocon → pilier unique du cocon.
- CTA : placé avant la dernière section. Chemins du CSV mappés dans `ctaTarget()` : /analyser → analyseur d'email gratuit ; /rediger, /comparer → tarifs (en attendant l'app).
- Note de l'auteur : milieu d'article (pilier), fin avec eyebrow (satellite).
- Liens internes : redirections appliquées au rendu, cibles inexistantes écartées.
- Sommaire : latéral ≥ 960 px (progression en CSS `animation-timeline`, item actif via `TocSpy`, amélioration progressive), `<details>` en dessous.
- Avant/après et sources : composants prêts, mais aucune donnée structurée dans le CSV → non affichés.
- Contrôle visuel : `node scripts/compare.mjs http://localhost:3000` → `screenshots/compare-*.png`.
- JSON-LD : `<JsonLd>` (`src/components/seo/JsonLd.tsx`) est le seul endroit qui sérialise.
## Choix techniques (étape 3)
- Outils : `/analyser-email` et `/testeur-accroche` (adresses données par Renaud), dans `src/lib/routes.ts`.
- Plans et prix : `src/lib/plans.ts`, source unique pour la homepage et /tarifs (prix des maquettes, à confirmer).
- Homepage `src/app/page.tsx` + `home.module.css` : un seul HTML pour desktop et mobile. Les raccourcis mobiles des maquettes passent par `.dOnly` / `.mOnly`. Les titres absents des maquettes mobiles sont masqués visuellement mais gardés pour l'accessibilité. FAQ : texte desktop partout, sans doublon.
- Sections : `line-height: normal` à la racine, comme les maquettes ; seuls les textes qui en précisent un le changent.
- Témoignages : placeholders des maquettes conservés tels quels. Carrousel mobile en CSS (scroll-snap + `::scroll-marker`).
- Contrôle visuel : `node scripts/compare.mjs http://localhost:3000 home` → pages entières + tranches.
- Homepage validée et commitée. Textes sourcés : « environ 20 % » (Nielsen), Ogilvy « (traduction libre) », « d'après Sabri Suby ». Prix et garantie provisoires (pas de publication avant CGV + Stripe).
- Outils : pages statiques (`src/app/analyser-email`, `src/app/testeur-accroche`), en-tête rendu serveur, formulaire en composant client (`src/components/tools/ToolApp.tsx`). Sans JavaScript : formulaire visible, bouton désactivé, exemple affiché.
- Règles partagées navigateur/serveur : `src/lib/tools/config.ts`. **Minimum de mots** fixé par Renaud : 30 (email), 3 (accroche), affiché en chiffres.
- Résultat : exemples des maquettes (`src/lib/tools/examples.ts`), toujours étiquetés « EXEMPLE ». Après une analyse, bandeau « Aperçu » tant que l'API n'est pas branchée.
- Quota : 3 analyses d'email, compteur `nc:analyses-gratuites` en localStorage (un nombre, jamais le texte). Accroche sans quota (mais soumise à la limitation de débit : ne jamais écrire « sans limite » dans un texte neuf). Confort d'interface seulement : la vraie limite est côté serveur.
- Route handlers : `POST /api/outils/analyser-email` et `/api/outils/testeur-accroche` → `src/lib/server/tool-handler.ts` (limitation de débit par IP en mémoire, validation, 503 tant que l'API n'est pas branchée, `Cache-Control: no-store`, aucun texte journalisé). Clé : `ANTHROPIC_API_KEY`, serveur uniquement (`src/lib/server/anthropic.ts`).
- Aperçu des états : `?etat=quota|erreur|court|chargement|resultat` (lu dans le navigateur, page toujours statique).
- Contrôle visuel des outils : `node scripts/compare.mjs http://localhost:3000 outil` (états empilés comme les maquettes).

- Supabase : `supabase/migrations/20261112000000_pages.sql` (RLS : lecture des pages publiées seulement). Import : `node scripts/import-pages.mjs` (simulation) puis `--apply` avec `.env.local`.

## Notes sur les données (diagnostic)
- Contenu en texte brut : paragraphes séparés par une ligne vide, pas de HTML ni de Markdown.
- `cta_text` contient le lien sous la forme `Texte → /chemin`.
- 30 slugs imbriqués, tous sous `biais-cognitifs/` (qui existe aussi comme page pilier).
- `breadcrumb` et `schema_extra` contiennent des URLs absolues `https://neurocopy.fr/...` à réécrire avec `SITE_URL`.
