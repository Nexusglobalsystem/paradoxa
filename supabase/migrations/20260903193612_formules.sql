-- LA PARADOXA — formules (parfum + cosmétique) et leurs lignes de composition
--
-- L'actif le plus précieux du groupe (CLAUDE.md, règle n°1). Champs alignés sur les
-- écrans 32 (composeur de parfum) et 34 (composeur cosmétique) de
-- design/INVENTAIRE.md.
--
-- Une formule est soit un parfum (étages tête/cœur/fond, concentration EDT/EDP/
-- EXTRAIT — écran 32), soit un produit cosmétique (5 phases aqueuse/huileuse/
-- émulsion/refroidissement/ajouts — écran 34, "Composition des 5 Phases" : Phase
-- Aqueuse Hydratante / Phase Huileuse & Baumes Solides / Phase Émulsion à Froid /
-- Phase Actifs Thermolabiles / Phase Stabilisation & Ajustement pH — mappées ici sur
-- aqueuse/huileuse/emulsion/refroidissement/ajouts).
--
-- Table réservée au rôle admin, sans exception (règle non négociable CLAUDE.md n°2 :
-- "Aucune formule ne transite jamais vers un client public").

create table public.formules (
  id uuid primary key default gen_random_uuid(),

  nom            text not null,
  code_reference text unique, -- ex. "SH-01-F924"
  maison         text not null check (maison in ('shea', 'ecloree')),
  type_formule   text not null check (type_formule in ('parfum', 'cosmetique')),

  -- Concentration : uniquement pertinente pour une formule parfum (écran 32, switch
  -- EDT/EDP/EXTRAIT). Contrainte croisée ci-dessous pour garantir la cohérence avec
  -- type_formule plutôt que de laisser la colonne libre.
  type_concentration text check (type_concentration in ('edt', 'edp', 'extrait')),

  -- Poids de référence ("pour 100g") utilisé par le composeur pour convertir les
  -- pourcentages de formule_lignes en grammes à l'écran (écran 32, colonne
  -- "Pour 100g"). 100 par défaut, ajustable pour un lot d'essai plus grand.
  poids_reference_g numeric(10, 3) not null default 100 check (poids_reference_g > 0),

  -- Versionnage : chaque édition significative d'une formule crée une nouvelle ligne
  -- pointant vers la précédente via formule_parent_id, plutôt que d'écraser
  -- l'historique en place — indispensable pour la traçabilité réglementaire (DIP,
  -- CPNP) et pour ne jamais perdre une version déjà utilisée par un lot de
  -- production (public.lots référence une formule précise, figée).
  version              integer not null default 1 check (version >= 1),
  formule_parent_id    uuid references public.formules (id) on delete set null,
  est_version_courante boolean not null default true,

  statut text not null default 'brouillon' check (
    statut in ('brouillon', 'en_test', 'validee', 'production', 'archivee')
  ),

  description text,
  notes       text,

  created_by uuid references auth.users (id) on delete set null,
  updated_by uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint formules_concentration_coherente check (
    (type_formule = 'parfum' and type_concentration is not null)
    or (type_formule = 'cosmetique' and type_concentration is null)
  )
);

comment on table public.formules is
  'Formules parfum et cosmétique. L''actif le plus précieux du groupe (CLAUDE.md '
  'règle n°1) — réservée au rôle admin uniquement (RLS), sans exception.';
comment on column public.formules.version is
  'Versionnage par chaînage (formule_parent_id) plutôt que par écrasement : un lot '
  'de production référence une version de formule précise et figée.';
comment on column public.formules.poids_reference_g is
  'Base de calcul ("pour 100g") utilisée par le composeur pour afficher les grammes '
  'de formule_lignes.grammes à partir du pourcentage. Ajustable par formule (lot '
  'd''essai plus grand qu''une base 100g standard).';

create trigger formules_set_updated_at
  before update on public.formules
  for each row
  execute function public.set_updated_at();

create index formules_maison_idx on public.formules (maison);
create index formules_type_formule_idx on public.formules (type_formule);
create index formules_statut_idx on public.formules (statut);
create index formules_formule_parent_id_idx on public.formules (formule_parent_id);

-- formule_lignes — composition d'une formule : une ligne = une matière incorporée à
-- un pourcentage donné, positionnée soit dans un étage (parfum), soit dans une phase
-- (cosmétique). on delete restrict sur matiere_id : on ne supprime jamais une matière
-- encore référencée par une composition — il faut d'abord retirer la ligne ou
-- archiver la matière (statut = 'archive').
create table public.formule_lignes (
  id         uuid primary key default gen_random_uuid(),
  formule_id uuid not null references public.formules (id) on delete cascade,
  matiere_id uuid not null references public.matieres (id) on delete restrict,

  -- Étage (parfum) OU phase (cosmétique) — jamais les deux, jamais aucun des deux.
  -- La contrainte "exactement un des deux" est vérifiée ici ; la cohérence avec
  -- formules.type_formule (étage seulement si type_formule = 'parfum', phase
  -- seulement si 'cosmetique') est vérifiée par le trigger
  -- formule_lignes_check_type_coherent ci-dessous, car un CHECK ne peut pas lire
  -- une autre table.
  etage text check (etage in ('tete', 'coeur', 'fond')),
  phase text check (phase in ('aqueuse', 'huileuse', 'emulsion', 'refroidissement', 'ajouts')),

  pourcentage numeric(7, 4) not null check (pourcentage > 0 and pourcentage <= 100),
  -- Grammes : valeur dérivée (pourcentage × formules.poids_reference_g / 100),
  -- dénormalisée ici pour l'affichage direct dans le composeur (écran 32, colonne
  -- "Pour 100g") sans recalcul côté client. Non contrainte en base par un CHECK
  -- cross-table ; c'est le moteur de formulation (packages/formulation, TypeScript
  -- pur) qui la calcule à chaque écriture. À ne jamais lire comme source de vérité :
  -- pourcentage l'est.
  grammes numeric(12, 4),

  ordre integer not null default 0, -- ordre d'affichage au sein de l'étage/phase
  notes text,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint formule_lignes_etage_xor_phase check (
    (etage is not null and phase is null) or (etage is null and phase is not null)
  ),
  -- Une matière ne devrait apparaître qu'une fois par formule (évite les lignes
  -- dupliquées par erreur de saisie). À valider : si un cas d'usage légitime exige
  -- la même matière incorporée à deux étages/moments différents d'une même formule,
  -- cette contrainte devra être assouplie (ex. ajouter etage/phase à la clé unique).
  unique (formule_id, matiere_id)
);

comment on table public.formule_lignes is
  'Lignes de composition d''une formule (une matière + un pourcentage, positionnée '
  'en étage tête/cœur/fond pour un parfum, ou en phase pour un cosmétique). Hérite '
  'de la confidentialité de formules (RLS admin).';
comment on column public.formule_lignes.grammes is
  'Valeur dénormalisée dérivée de pourcentage × formules.poids_reference_g / 100, '
  'calculée par le moteur de formulation TypeScript (packages/formulation) à chaque '
  'écriture. pourcentage reste la source de vérité pour tout calcul réglementaire.';

create trigger formule_lignes_set_updated_at
  before update on public.formule_lignes
  for each row
  execute function public.set_updated_at();

-- Cohérence croisée avec formules.type_formule : étage uniquement pour un parfum,
-- phase uniquement pour un cosmétique.
create or replace function public.formule_lignes_check_type_coherent()
returns trigger
language plpgsql
set search_path = ''
as $$
declare
  v_type_formule text;
begin
  select type_formule into v_type_formule
  from public.formules
  where id = new.formule_id;

  if v_type_formule = 'parfum' and new.etage is null then
    raise exception
      'Une ligne de formule parfum doit avoir un étage (tete/coeur/fond).'
      using errcode = '23514';
  end if;

  if v_type_formule = 'cosmetique' and new.phase is null then
    raise exception
      'Une ligne de formule cosmétique doit avoir une phase (aqueuse/huileuse/emulsion/refroidissement/ajouts).'
      using errcode = '23514';
  end if;

  return new;
end;
$$;

create trigger formule_lignes_check_type_coherent
  before insert or update on public.formule_lignes
  for each row
  execute function public.formule_lignes_check_type_coherent();

create index formule_lignes_formule_id_idx on public.formule_lignes (formule_id);
create index formule_lignes_matiere_id_idx on public.formule_lignes (matiere_id);

-- RLS — réservé au rôle admin, sans exception, sur les deux tables.
alter table public.formules enable row level security;
alter table public.formule_lignes enable row level security;

create policy "formules_admin_select"
  on public.formules for select
  to authenticated
  using (public.is_admin());

create policy "formules_admin_insert"
  on public.formules for insert
  to authenticated
  with check (public.is_admin());

create policy "formules_admin_update"
  on public.formules for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "formules_admin_delete"
  on public.formules for delete
  to authenticated
  using (public.is_admin());

create policy "formule_lignes_admin_select"
  on public.formule_lignes for select
  to authenticated
  using (public.is_admin());

create policy "formule_lignes_admin_insert"
  on public.formule_lignes for insert
  to authenticated
  with check (public.is_admin());

create policy "formule_lignes_admin_update"
  on public.formule_lignes for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "formule_lignes_admin_delete"
  on public.formule_lignes for delete
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
grant select, insert, update, delete on public.formules to anon, authenticated;
grant select, insert, update, delete on public.formule_lignes to anon, authenticated;
