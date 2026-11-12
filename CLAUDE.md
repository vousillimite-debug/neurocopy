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

## Décisions de Renaud (12/11/2026)
- **Mots interdits dans les articles** : la règle s'applique aussi au contenu, mais **ne modifier AUCUN texte** d'article. Préparer un rapport (slug + phrase) pour « solution » (seulement quand c'est un argument marketing creux), « tout-en-un » et le vouvoiement. Les corrections se font en base, page par page, après son accord.
- **Liens internes vers 4 pages inexistantes** : proposer la page existante la plus proche, Renaud valide, puis redirection (jamais de lien mort publié).
- **Pilier mobile** : pas de maquette ; construire à partir du satellite mobile + pilier desktop. Maquette à venir.
- **4 satellites sans breadcrumb / schema_extra, et faq_schema vide** : générer à partir de slug, cocon et faq.

## Choix techniques (étape 1)
- Next.js 16.4.x (≥ 16.4.1 obligatoire : failles critiques avant), React 19, TypeScript 5.9 (pas la 7).
- Polices auto-hébergées via `@fontsource` (familles « Inter » / « JetBrains Mono » = noms des tokens).
- Tokens importés directement depuis `design/neurocopy-tokens.css` dans `src/app/layout.tsx` ; valeurs mobiles dans `src/styles/globals.css`.
- CSS Modules, aucune couleur en dur. Lien global en `:where(a)` (spécificité nulle).
- Conteneur : 1200 px de contenu + gouttières (comme les maquettes, qui sont en `content-box`).
- Points de rupture : mobile < 768 px ; nav burger < 960 px.
- Adresses internes centralisées dans `src/lib/routes.ts`. URL du site dans `src/lib/site.ts` (`SITE_URL`).
- `/styleguide` : page interne non indexée qui montre tous les composants.

## Notes sur les données (diagnostic)
- Contenu en texte brut : paragraphes séparés par une ligne vide, pas de HTML ni de Markdown.
- `cta_text` contient le lien sous la forme `Texte → /chemin`.
- 30 slugs imbriqués, tous sous `biais-cognitifs/` (qui existe aussi comme page pilier).
- `breadcrumb` et `schema_extra` contiennent des URLs absolues `https://neurocopy.fr/...` à réécrire avec `SITE_URL`.
