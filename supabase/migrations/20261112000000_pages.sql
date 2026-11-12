-- NeuroCopy — table `pages` (contenu SEO).
-- À exécuter sur le projet Supabase NEUF uniquement (SQL Editor ou `supabase db push`).
-- Rejouable : n'écrase rien si la table existe déjà.

create extension if not exists pgcrypto;

create table if not exists public.pages (
  id                uuid primary key default gen_random_uuid(),
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now(),

  slug              text not null unique,           -- ex. « biais-cognitifs/reciprocite » (sans / initial)
  cocon             text not null,
  type              text not null check (type in ('pilier', 'satellite')),
  statut            text not null default 'brouillon',

  mot_cle_principal text,
  volume_mensuel    integer,
  kd                integer,
  concurrence       text,

  meta_title        text,
  meta_description  text,
  canonical         text,                           -- informatif : le site reconstruit le canonical depuis SITE_URL
  og_title          text,
  og_description    text,
  og_type           text,
  schema_type       text,
  schema_extra      jsonb,                          -- objet JSON-LD natif
  faq_schema        jsonb,
  breadcrumb        jsonb,                          -- [{url, name, position}]

  h1                text not null,
  reponse_directe   text,
  intro             text,
  h2_sections       jsonb not null default '[]'::jsonb,   -- [{h2, contenu}]
  faq               jsonb not null default '[]'::jsonb,   -- [{q, a}]
  cta_text          text,                                 -- « Texte → /chemin »
  note_editoriale   text,
  internal_links    jsonb not null default '[]'::jsonb,   -- [{url, label}]

  -- Ajoutées le 12/11/2026. Volontairement VIDES : Renaud les remplit page par page,
  -- après vérification des sources. Aucun remplissage automatique.
  exemples          jsonb,   -- [{contexte, avant, apres, biais, source}]
  sources           jsonb,   -- [{auteur, annee, titre, url}]

  constraint pages_h2_sections_array    check (jsonb_typeof(h2_sections) = 'array'),
  constraint pages_faq_array            check (jsonb_typeof(faq) = 'array'),
  constraint pages_internal_links_array check (jsonb_typeof(internal_links) = 'array'),
  constraint pages_exemples_array       check (exemples is null or jsonb_typeof(exemples) = 'array'),
  constraint pages_sources_array        check (sources is null or jsonb_typeof(sources) = 'array')
);

-- Rattrapage si la table existait avant l'ajout des deux colonnes.
alter table public.pages add column if not exists exemples jsonb;
alter table public.pages add column if not exists sources  jsonb;

create index if not exists pages_cocon_idx  on public.pages (cocon);
create index if not exists pages_statut_idx on public.pages (statut);

comment on column public.pages.exemples is 'Blocs avant/après. Saisie manuelle uniquement, sources vérifiées. Ne jamais générer.';
comment on column public.pages.sources  is 'Références citées. Saisie manuelle uniquement, sources vérifiées. Ne jamais générer.';

-- updated_at automatique, sauf si la requête fournit sa propre date
-- (l'import conserve ainsi les dates du CSV, affichées « Mis à jour le … »).
create or replace function public.set_updated_at() returns trigger
language plpgsql as $$
begin
  if new.updated_at is not distinct from old.updated_at then
    new.updated_at = now();
  end if;
  return new;
end;
$$;

drop trigger if exists pages_set_updated_at on public.pages;
create trigger pages_set_updated_at
  before update on public.pages
  for each row execute function public.set_updated_at();

-- Sécurité : lecture publique des seules pages publiées. Aucune écriture côté client
-- (l'import utilise la clé service_role, côté serveur uniquement, qui contourne RLS).
alter table public.pages enable row level security;

drop policy if exists "pages publiées lisibles" on public.pages;
create policy "pages publiées lisibles"
  on public.pages for select
  to anon, authenticated
  using (statut = 'publie');
