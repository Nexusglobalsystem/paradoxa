-- LA PARADOXA — produits publics (catalogue boutique SHÉA / ÉCLORÉE)
--
-- Champs alignés sur les écrans 28 (catalogue produits admin) et 29 (fiche produit —
-- édition) de design/INVENTAIRE.md : maison, code de création, contenance, prix
-- public, niveau de stock avec seuil d'alerte, statut commercial, et le lien optionnel
-- vers la formule labo qui a produit ce produit (formule_id).
--
-- Exposer formule_id sur une table publique n'expose PAS la formule elle-même : c'est
-- un simple UUID opaque, et la table formules (composition, IFRA, coûts) reste
-- réservée à l'admin par ses propres policies RLS (20260903193612_formules.sql). Un
-- client public voit "ce produit a une fiche labo", jamais son contenu — d'où le
-- placement de cette migration après formules (dépendance de clé étrangère).

create table public.produits (
  id uuid primary key default gen_random_uuid(),

  -- Identité commerciale
  maison         text not null check (maison in ('shea', 'ecloree', 'groupe')),
  nom            text not null,
  slug           text not null unique,
  code_reference text unique,
  description    text,

  -- Prix & devise. Le prix fait autorité côté serveur : seul un admin peut écrire
  -- cette table (policies plus bas) ; toute écriture applicative (ex. décrément de
  -- stock au checkout) passe par un route handler / une edge function utilisant la
  -- clé service_role, jamais directement le client.
  prix   numeric(10, 2) not null default 0 check (prix >= 0),
  devise text not null default 'EUR' check (devise in ('EUR', 'XOF')),

  -- Contenance (flacon, pot, coffret...)
  contenance_valeur numeric(10, 2),
  contenance_unite  text check (contenance_unite in ('ml', 'g', 'unite')),

  -- Stock & alerte (écran 28 : "Seuil d'alerte (≤ 15)")
  stock              integer not null default 0 check (stock >= 0),
  seuil_alerte_stock integer not null default 15 check (seuil_alerte_stock >= 0),

  -- Statut commercial — union des valeurs vues sur les écrans 28 et 29.
  statut text not null default 'brouillon' check (
    statut in ('brouillon', 'actif', 'en_maceration', 'epuise', 'tirage_prive', 'archive')
  ),

  -- Renvoie vers la formule labo (parfum ou cosmétique) associée. Nullable : un
  -- produit peut exister côté catalogue avant que sa formule ne soit finalisée, ou
  -- être un coffret sans formule propre.
  formule_id uuid references public.formules (id) on delete set null,

  -- Contenu éditorial spécifique aux fiches produit (écran 29)
  escale_geographique   text, -- SHÉA : "Escale Géographique Source" du récit de voyage
  epigraphe             text, -- "Phrase Totem (Épigraphe Frontispice)"
  protocole_application text, -- "Protocole d'application au creux du poignet"
  image_url              text,

  created_by uuid references auth.users (id) on delete set null,
  updated_by uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.produits is
  'Produits publics du catalogue boutique (SHÉA, ÉCLORÉE, éditions groupées). '
  'Lisible publiquement uniquement quand statut = actif (règle non négociable '
  'CLAUDE.md n°2) ; écriture réservée à l''admin.';
comment on column public.produits.formule_id is
  'Référence optionnelle vers la formule labo (public.formules) ayant produit ce '
  'produit. N''expose que l''UUID : la composition elle-même reste protégée par les '
  'policies RLS de la table formules, réservées à l''admin.';
comment on column public.produits.statut is
  'brouillon/en_maceration/epuise/tirage_prive/archive : visibles admin uniquement. '
  'actif : seul statut visible publiquement (anon + authenticated non-admin). '
  'Point à valider : "épuisé" est aujourd''hui masqué au public au même titre que '
  '"brouillon" — si le site doit afficher une fiche "rupture de stock" navigable, '
  'il faudra élargir cette policy (ex. statut in (''actif'',''epuise'')).';

create trigger produits_set_updated_at
  before update on public.produits
  for each row
  execute function public.set_updated_at();

create index produits_maison_idx on public.produits (maison);
create index produits_statut_idx on public.produits (statut);
create index produits_formule_id_idx on public.produits (formule_id);

-- RLS — sans exception (règle non négociable CLAUDE.md n°2).
alter table public.produits enable row level security;

-- Lecture publique strictement quand statut = 'actif' ; l'admin voit tout, y compris
-- les brouillons et produits archivés (nécessaire pour le back-office).
create policy "produits_select_public_actif_or_admin"
  on public.produits for select
  to anon, authenticated
  using (statut = 'actif' or public.is_admin());

create policy "produits_insert_admin"
  on public.produits for insert
  to authenticated
  with check (public.is_admin());

create policy "produits_update_admin"
  on public.produits for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "produits_delete_admin"
  on public.produits for delete
  to authenticated
  using (public.is_admin());

-- Grants au niveau table : plomberie nécessaire pour que PostgREST puisse même
-- adresser cette table (ce que Supabase accorde de toute façon par défaut à tout
-- nouvel objet du schéma public — voir `auto_expose_new_tables` dans config.toml,
-- "matching the cloud default"). On le rend explicite ici plutôt que de dépendre de
-- ce réglage implicite. La vraie frontière de sécurité n'est PAS ce grant : ce sont
-- les policies RLS ci-dessus. anon obtient le privilège SQL en écriture mais aucune
-- policy INSERT/UPDATE/DELETE ne le vise, donc RLS refuse ces opérations par défaut
-- (42501) ; seule la policy SELECT s'applique à anon, et seulement pour statut = 'actif'.
grant select, insert, update, delete on public.produits to anon, authenticated;
