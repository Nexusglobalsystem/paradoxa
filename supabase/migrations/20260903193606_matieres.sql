-- LA PARADOXA — matières premières / ingrédients du laboratoire
--
-- Champs alignés sur les écrans 30 (bibliothèque de matières) et 31 (fiche matière)
-- de design/INVENTAIRE.md. La table matieres porte l'identité, la traçabilité et
-- l'économie de chaque matière ; matiere_limites_ifra porte les seuils IFRA — c'est
-- une relation un-à-plusieurs par matière (une matière a une limite différente par
-- catégorie IFRA : "Catégorie 4" = parfums fins, "Catégorie 5A" = crèmes corps, etc.,
-- vu tel quel sur l'écran 31, "Données Réglementaires & Seuils IFRA (51e Amendement)").
--
-- Table réservée au rôle admin, sans exception (règle non négociable CLAUDE.md n°2 :
-- "Aucune formule ne transite jamais vers un client public" — les matières et leurs
-- coûts font partie du même périmètre confidentiel que les formules elles-mêmes).

create table public.matieres (
  id uuid primary key default gen_random_uuid(),

  -- Identité
  nom              text not null,
  reference_interne text unique, -- ex. "MP-KAR-004"
  -- nature (origine chimique) et est_captif (exclusivité maison) sont deux axes
  -- indépendants : "Bois de Shéa Co-distillat Sauvage" est par ex. nature = naturel
  -- ET est_captif = true (procédé artisanal exclusif à l'atelier Dakar, vu tel quel
  -- sur l'écran 30 — badge "Captif" à côté d'une matière par ailleurs naturelle).
  nature           text not null default 'naturel' check (nature in ('naturel', 'synthese')),
  est_captif       boolean not null default false, -- matière/procédé exclusif à l'atelier (badge "Captif")

  -- Traçabilité réglementaire & botanique (écran 30 : colonne "INCI / CAS")
  inci        text,
  cas_number  text,
  fournisseur text,
  origine     text, -- terroir libre, ex. "Kédougou, Sénégal"

  -- Classification olfactive (écran 30 : chips de filtre par famille)
  famille_olfactive text not null check (
    famille_olfactive in (
      'boise_resines', 'floral_botanique', 'ambre_balsamique',
      'epice_chaud', 'hesperide_frais', 'actifs_cosmetiques'
    )
  ),
  facette_libre text, -- libellé affiché tel quel (ex. "Boisé Ambré", "Résineux Balsamique")

  -- Volatilité / étage typique — comportement caractéristique de la matière (à
  -- distinguer de l'étage réellement assigné dans une formule donnée, qui est porté
  -- par formule_lignes.etage : une même matière a une volatilité de référence, mais
  -- son rôle exact dépend de la formule où elle est utilisée).
  volatilite text check (volatilite in ('tete', 'tete_coeur', 'coeur', 'coeur_fond', 'fond')),

  -- Échelle de puissance à 5 points (écran 30 : pastilles ●●●●●)
  puissance smallint not null default 3 check (puissance between 1 and 5),

  -- Économie & stock (écran 30 : "Prix / kg", "Stock")
  prix_kg            numeric(10, 2) not null default 0 check (prix_kg >= 0),
  stock_kg           numeric(12, 3) not null default 0 check (stock_kg >= 0),
  seuil_alerte_stock_kg numeric(12, 3),

  statut text not null default 'actif' check (statut in ('actif', 'archive')),

  notes text,
  -- Fourre-tout structuré pour les données riches non normalisées à ce stade
  -- (facettes organoleptiques et leur %, indices physico-chimiques, certifications,
  -- coordonnées GPS de la parcelle, etc. — voir écran 31). Volontairement en JSONB
  -- plutôt qu'en colonnes dédiées : ces champs sont éditoriaux/variables d'une
  -- matière à l'autre et ne sont pas consommés par le moteur de formulation
  -- (packages/formulation), qui ne lit que les colonnes structurées ci-dessus.
  donnees_complementaires jsonb not null default '{}'::jsonb,

  created_by uuid references auth.users (id) on delete set null,
  updated_by uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.matieres is
  'Matières premières et ingrédients du laboratoire (parfum + cosmétique). Réservée '
  'au rôle admin uniquement (RLS), sans exception — règle non négociable CLAUDE.md n°2.';
comment on column public.matieres.volatilite is
  'Comportement typique de la matière (tête/cœur/fond, ou position intermédiaire '
  'observée sur les fiches — ex. "Cœur-Fond"). Valeur de référence, distincte de '
  'formule_lignes.etage qui porte l''étage réellement assigné dans une formule donnée.';
comment on column public.matieres.donnees_complementaires is
  'Données riches non normalisées (facettes organoleptiques et %, indices '
  'physico-chimiques, certifications, GPS parcelle...). Non consommées par le moteur '
  'de formulation TypeScript — usage éditorial/affichage fiche matière uniquement.';

create trigger matieres_set_updated_at
  before update on public.matieres
  for each row
  execute function public.set_updated_at();

create index matieres_famille_olfactive_idx on public.matieres (famille_olfactive);
create index matieres_statut_idx on public.matieres (statut);
create index matieres_nom_fts_idx on public.matieres using gin (to_tsvector('french', nom));

-- matiere_limites_ifra — un-à-plusieurs : une matière a une limite par catégorie IFRA.
create table public.matiere_limites_ifra (
  id                  uuid primary key default gen_random_uuid(),
  matiere_id          uuid not null references public.matieres (id) on delete cascade,
  categorie_ifra      text not null, -- ex. "1", "4", "5A", "5C" (nomenclature IFRA standard)
  application_typique text, -- ex. "Parfums fins, Eaux de Parfum, Extraits"
  seuil_pourcentage   numeric(7, 4), -- NULL si seuil non exprimable en %, voir seuil_libelle
  seuil_libelle       text, -- ex. "Sans restriction (100%)", "Qualité alimentaire (100%)"
  statut              text not null default 'conforme' check (
    statut in ('libre', 'conforme', 'attention', 'non_conforme')
  ),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (matiere_id, categorie_ifra)
);

comment on table public.matiere_limites_ifra is
  'Seuils IFRA (51e amendement) par catégorie d''application pour chaque matière — '
  'un-à-plusieurs, une ligne par catégorie IFRA concernée (écran 31 : "Données '
  'Réglementaires & Seuils IFRA"). Hérite de la confidentialité de matieres (RLS admin).';

create trigger matiere_limites_ifra_set_updated_at
  before update on public.matiere_limites_ifra
  for each row
  execute function public.set_updated_at();

create index matiere_limites_ifra_matiere_id_idx on public.matiere_limites_ifra (matiere_id);

-- RLS — réservé au rôle admin, sans exception, sur les deux tables.
alter table public.matieres enable row level security;
alter table public.matiere_limites_ifra enable row level security;

create policy "matieres_admin_select"
  on public.matieres for select
  to authenticated
  using (public.is_admin());

create policy "matieres_admin_insert"
  on public.matieres for insert
  to authenticated
  with check (public.is_admin());

create policy "matieres_admin_update"
  on public.matieres for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "matieres_admin_delete"
  on public.matieres for delete
  to authenticated
  using (public.is_admin());

create policy "matiere_limites_ifra_admin_select"
  on public.matiere_limites_ifra for select
  to authenticated
  using (public.is_admin());

create policy "matiere_limites_ifra_admin_insert"
  on public.matiere_limites_ifra for insert
  to authenticated
  with check (public.is_admin());

create policy "matiere_limites_ifra_admin_update"
  on public.matiere_limites_ifra for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "matiere_limites_ifra_admin_delete"
  on public.matiere_limites_ifra for delete
  to authenticated
  using (public.is_admin());

-- Grants au niveau table : plomberie nécessaire pour que PostgREST puisse même
-- adresser ces tables (ce que Supabase accorde de toute façon par défaut à tout
-- nouvel objet du schéma public — voir `auto_expose_new_tables` dans config.toml,
-- "matching the cloud default"). On le rend explicite ici plutôt que de dépendre de
-- ce réglage implicite. La vraie frontière de sécurité n'est PAS ce grant : ce sont
-- les policies RLS ci-dessus, toutes `to authenticated` avec is_admin(). anon obtient
-- le privilège SQL mais aucune policy ne le vise donc RLS refuse tout par défaut
-- (SELECT renvoie 0 ligne, INSERT/UPDATE/DELETE échouent en 42501) — vérifié par
-- /supabase/tests/rls_anon_cannot_read_formulas_test.sql. Un utilisateur authenticated
-- non-admin est filtré de la même façon par is_admin() = false.
grant select, insert, update, delete on public.matieres to anon, authenticated;
grant select, insert, update, delete on public.matiere_limites_ifra to anon, authenticated;
