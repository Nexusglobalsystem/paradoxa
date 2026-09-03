-- LA PARADOXA — lots de production & traçabilité (registre d'atelier)
--
-- Champs alignés sur l'écran 36 (lots et production — registre d'atelier) de
-- design/INVENTAIRE.md : lots porte le tirage lui-même (formule, quantité, dates,
-- coût, responsable) ; lot_matieres porte le détail un-à-plusieurs "quel n° de lot
-- fournisseur, pour quelle matière, en quelle quantité" — vu tel quel dans le tiroir
-- "Bordereau de Traçabilité Origines & Pesées Directes" de l'écran 36 (3 matières
-- premières détaillées avec leur propre n° de lot source par cuve).
--
-- Table réservée au rôle admin, sans exception (règle non négociable CLAUDE.md n°2).

create table public.lots (
  id           uuid primary key default gen_random_uuid(),
  numero_lot   text not null unique, -- ex. "LOT-2024-SH01-08"
  formule_id   uuid not null references public.formules (id) on delete restrict,

  -- Quantité tirée (écran 36 : "300 flacons (100 ml)", "500 pots (200 ml)")
  quantite_tiree          numeric(12, 3) not null check (quantite_tiree > 0),
  unite_quantite           text not null default 'unite' check (
    unite_quantite in ('unite', 'ml', 'l', 'kg', 'g')
  ),
  contenance_unitaire_ml   numeric(10, 2), -- ex. 100 (ml par flacon), 200 (ml par pot)

  atelier_cuve      text, -- ex. "Cuve Inox #C02 • Dakar", "Batteur Sous-Vide #B01"
  date_fabrication  date not null default current_date,

  -- Conservation & PAO (Période Après Ouverture) — écran 36 : "36 mois (PAO 24M)"
  duree_conservation_mois integer check (duree_conservation_mois > 0),
  pao_mois                integer check (pao_mois > 0),
  date_peremption          date, -- si NULL, calculée par le trigger ci-dessous

  -- Coût — figé au moment du tirage (ne doit pas dériver si le prix des matières
  -- change ensuite ; voir aussi lot_matieres.fournisseur, même logique de gel).
  cout_matiere_total numeric(12, 2) check (cout_matiere_total >= 0),
  cout_unitaire        numeric(10, 2) check (cout_unitaire >= 0),

  -- Responsable ("Maître Artisan"). Compte système si disponible, avec un nom
  -- affichable en repli pour un artisan externe sans compte (sous-traitant).
  responsable_id  uuid references auth.users (id) on delete set null,
  responsable_nom text,

  statut text not null default 'planifie' check (
    statut in ('planifie', 'en_maceration', 'en_cours', 'termine', 'libere', 'rejete', 'archive')
  ),

  -- Empreinte d'intégrité du bordereau de traçabilité (écran 36 : "Empreinte
  -- SHA-256... Scellé"). Calculée et vérifiée côté application (packages/formulation
  -- ou route handler), pas par Postgres — stockée ici pour audit/affichage.
  empreinte_integrite text,

  notes text,

  created_by uuid references auth.users (id) on delete set null,
  updated_by uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.lots is
  'Lots de production (registre d''atelier), traçant chaque tirage d''une formule : '
  'quantité, dates de fabrication et de péremption, coût matière, responsable. '
  'Réservée au rôle admin uniquement (RLS), sans exception.';
comment on column public.lots.empreinte_integrite is
  'Empreinte (ex. SHA-256) du bordereau de traçabilité, calculée côté application. '
  'Non vérifiée par Postgres : sert de preuve d''intégrité affichée/exportée, pas de '
  'mécanisme de contrôle d''accès.';

create trigger lots_set_updated_at
  before update on public.lots
  for each row
  execute function public.set_updated_at();

-- Calcule date_peremption = date_fabrication + duree_conservation_mois quand elle
-- n'est pas fournie explicitement, pour éviter les fiches lot incomplètes en usage
-- courant tout en laissant la possibilité de la surcharger (ex. résultat de contrôle
-- qualité qui raccourcit la durée réelle).
create or replace function public.lots_compute_date_peremption()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if new.date_peremption is null and new.duree_conservation_mois is not null then
    new.date_peremption := (new.date_fabrication + (new.duree_conservation_mois || ' months')::interval)::date;
  end if;
  return new;
end;
$$;

create trigger lots_compute_date_peremption
  before insert or update on public.lots
  for each row
  execute function public.lots_compute_date_peremption();

create index lots_formule_id_idx on public.lots (formule_id);
create index lots_statut_idx on public.lots (statut);
create index lots_date_fabrication_idx on public.lots (date_fabrication);

-- lot_matieres — traçabilité un-à-plusieurs : pour un lot donné, quelles matières ont
-- été incorporées, à quelle quantité, et sous quel n° de lot fournisseur (écran 36,
-- tiroir "Bordereau de Traçabilité Origines & Pesées Directes").
create table public.lot_matieres (
  id         uuid primary key default gen_random_uuid(),
  lot_id     uuid not null references public.lots (id) on delete cascade,
  matiere_id uuid not null references public.matieres (id) on delete restrict,

  numero_lot_fournisseur text, -- ex. "#KD-2024-A3"
  quantite_incorporee     numeric(14, 4) not null check (quantite_incorporee > 0),
  unite                    text not null default 'kg' check (unite in ('kg', 'g', 'l', 'ml')),

  -- Fournisseur figé au moment du tirage — snapshot, pas une référence live vers
  -- matieres.fournisseur qui peut changer dans le temps (le fournisseur historique
  -- réellement utilisé pour CE lot ne doit jamais dériver rétroactivement).
  fournisseur text,

  -- Analyses ponctuelles liées à cette incorporation (indice d'acide, degré alcool
  -- mesuré, teneur en insaponifiables...) — variable par matière, voir même
  -- justification JSONB que matieres.donnees_complementaires.
  -- Nommée au pluriel : `analyse` (singulier) est un mot-clé réservé PostgreSQL
  -- (synonyme de ANALYZE dans VACUUM/EXPLAIN) et provoque une erreur de syntaxe s'il
  -- est utilisé tel quel comme nom de colonne — repéré à l'exécution réelle contre
  -- pglite (voir rapport de migration).
  analyses jsonb not null default '{}'::jsonb,

  created_at timestamptz not null default now()
);

comment on table public.lot_matieres is
  'Traçabilité par matière d''un lot de production : n° de lot fournisseur, quantité '
  'incorporée, fournisseur figé au moment du tirage. Un lot a plusieurs lignes '
  '(une par matière incorporée). Hérite de la confidentialité de lots (RLS admin).';
comment on column public.lot_matieres.fournisseur is
  'Snapshot du fournisseur au moment du tirage — ne doit pas être recalculé depuis '
  'matieres.fournisseur, qui peut changer après coup (exigence de traçabilité).';

create index lot_matieres_lot_id_idx on public.lot_matieres (lot_id);
create index lot_matieres_matiere_id_idx on public.lot_matieres (matiere_id);

-- RLS — réservé au rôle admin, sans exception, sur les deux tables.
alter table public.lots enable row level security;
alter table public.lot_matieres enable row level security;

create policy "lots_admin_select"
  on public.lots for select
  to authenticated
  using (public.is_admin());

create policy "lots_admin_insert"
  on public.lots for insert
  to authenticated
  with check (public.is_admin());

create policy "lots_admin_update"
  on public.lots for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "lots_admin_delete"
  on public.lots for delete
  to authenticated
  using (public.is_admin());

create policy "lot_matieres_admin_select"
  on public.lot_matieres for select
  to authenticated
  using (public.is_admin());

create policy "lot_matieres_admin_insert"
  on public.lot_matieres for insert
  to authenticated
  with check (public.is_admin());

create policy "lot_matieres_admin_update"
  on public.lot_matieres for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "lot_matieres_admin_delete"
  on public.lot_matieres for delete
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
grant select, insert, update, delete on public.lots to anon, authenticated;
grant select, insert, update, delete on public.lot_matieres to anon, authenticated;
