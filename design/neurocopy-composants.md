# NeuroCopy — composants réutilisables et variantes

Tous les composants s'affichent sans JavaScript (HTML + CSS). Les tokens sont dans `neurocopy-tokens.css` / `.json`.

## Structure

| Composant | Variantes | Où |
|---|---|---|
| **Nav** | site desktop (liens + « Se connecter » + bouton contour) · site mobile (logo + burger 44 px) · auth (logo seul) | Toutes les pages publiques |
| **Nav latérale app** | item actif · item normal · item verrouillé (badge cadenas GROWTH) · section « Récents » · bloc crédits | /app |
| **Barre d'onglets app** | 5 onglets, actif · verrouillé (icône cadenas) | /app mobile |
| **Footer** | complet (4 colonnes) · compact (signature + légal) · mobile (2 colonnes) | Toutes |
| **Fil d'Ariane** | desktop · mobile (raccourci) | Articles |

## Texte et titres

| Composant | Variantes |
|---|---|
| **Eyebrow** | point jaune + mono capitales · couleur accent (« Réponse directe », « Note de l'auteur ») |
| **Titre signature** | ligne blanche + ligne grise avec mot clé jaune · hero avec 1re ligne barrée · tailles hero / h1 / h2 / mobile |
| **Ouverture d'empathie** | paragraphe 22 px blanc, 2 phrases « Tu connais ce moment où… » | 

## Actions

| Composant | Variantes |
|---|---|
| **Bouton** | principal (pilule jaune, 1 seul par écran) · contour (bordure #474747) · action locale blanche (« Accepter ») · texte (« Plus tard », « Annuler ») · désactivé · focus visible · tailles 44 / 48 / 52 / 56 · pleine largeur mobile |
| **Lien fléché** | « Lire → », « Débloquer », « Voir les 4 plans → » |
| **Bascule segmentée** | onglets outil (Email / Accroche) · période (Mensuel / Annuel + badge remise) · vue app mobile (Texte / Résultat) |

## Contenu

| Composant | Variantes |
|---|---|
| **Carte** | standard #111 · accent (bordure jaune 1–2 px) · alt #0A0A0A · module (numéro + titre + texte + badge plan) · carte large (module Écouter + exemple de sortie) |
| **Stat card** | grand chiffre jaune + phrase + source mono · desktop 144 px / mobile 96 px · version compacte 2×2 (preuves) |
| **Badge** | biais (fond accent 12 %) · source (contour) · plan (GROWTH, cadenas) · statut app (succès / alerte / erreur + libellé texte) · « Le plus choisi » (plein jaune) |
| **Encart réponse directe** | bordure gauche jaune, fond #111 · desktop / mobile |
| **Note de l'auteur** | bordure gauche jaune, fond #0A0A0A, italique, avatar « R » · milieu d'article (pilier) · fin de page avec eyebrow (satellite) |
| **Bloc avant / après** | côte à côte (desktop) · empilé (mobile) · tableau multi-lignes fermé/ouvert · avec texte barré (outil) · pied avec badges biais + source |
| **CTA contextuel** | carte avec eyebrow, titre, bouton principal, réassurance |
| **Carte de lien interne** | satellite (mono temps de lecture) · pilier (bordure #474747, accent) |
| **Table des matières** | latérale fixe avec item actif + barre de progression · sommaire numéroté en grille (pilier) · repliable `<details>` (mobile) |
| **Accordéon FAQ** | `<details>` natif, + qui pivote · ouvert / fermé · desktop / mobile (cible 56 px) |
| **Témoignage** | placeholder [Prénom N.] + résultat chiffré en jaune · carrousel mobile (pastilles) |
| **Étapes** | 01-02-03 avec filet supérieur (desktop) · liste compacte (mobile) |

## Score et analyse

| Composant | Variantes |
|---|---|
| **Carte de score** | anneau SVG + chiffre mono · 92 / 104 / 120 / 132 px · avec verdict et delta (+16 pts) |
| **Score géant** | mono 168 px jaune /100 (outil desktop) · 120 px (mobile) |
| **Barre de dimension** | jaune (site) · couleur de statut + libellé (app) · liste de 7 dimensions · légende de seuils |
| **Quick win** | numéro + titre + catégorie · avant barré / après · badges biais + source |
| **Correction** | à décider (Accepter / Refuser) · acceptée (✓ vert + Annuler) · surlignage dans le texte (souligné orange = signalé, fond jaune 12 % = accepté) |
| **Exemple de sortie Écouter** | ligne PEUR / FRUSTRATION / DÉSIR + citation + source |

## États

| Composant | Variantes |
|---|---|
| **Chargement** | barre + étape courante en jaune (« Évaluation du CTA… ») · checklist d'étapes (faite / en cours / à venir) |
| **Quota atteint** | compteur 3/3 + message d'empathie + CTA compte + lien secondaire |
| **Erreur** | `role="alert"`, icône contour jaune, texte conservé dans le champ, bouton Réessayer |
| **Validation champ** | bordure 2 px jaune + `aria-invalid` + aide + compteur mots |
| **Verrouillage** | carte pointillée (cadenas + Débloquer) · item de nav verrouillé · modale desktop · bottom sheet mobile |
| **Champ de formulaire** | label visible au-dessus · 52 px · bordure #474747 · aide liée par `aria-describedby` · case à cocher accent |

## Tarifs

| Composant | Variantes |
|---|---|
| **Carte de plan** | standard · mise en avant (bordure 2 px jaune + « Le plus choisi » + seul bouton jaune) · compacte mobile |
| **Tableau comparatif** | colonne Growth surlignée · ✓ / — avec `aria-label` · défilement horizontal sous 760 px |
| **Garantie** | grand « 30 » jaune + texte · desktop / mobile |
