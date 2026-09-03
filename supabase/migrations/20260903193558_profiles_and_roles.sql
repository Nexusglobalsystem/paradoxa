-- LA PARADOXA — profils utilisateurs & mécanisme de vérification du rôle admin
--
-- DÉCISION D'ARCHITECTURE À VALIDER — Vérification du rôle admin
-- ----------------------------------------------------------------
-- On introduit une table `public.profiles` (une ligne par utilisateur Supabase Auth,
-- avec une colonne `role`) plutôt que des custom claims JWT.
--
-- Pourquoi ce choix plutôt que des JWT custom claims (Custom Access Token Hook) :
--   1. Simplicité opérationnelle : pas de configuration d'un hook Auth supplémentaire
--      (ni en local ni en production), pas d'Edge Function dédiée à déployer.
--   2. Testabilité : les tests RLS (pgTAP, voir /supabase/tests) vérifient le
--      comportement en changeant simplement de rôle Postgres (`set local role anon`)
--      sans avoir à fabriquer un JWT signé porteur de claims personnalisées.
--   3. Le coût réel — une requête supplémentaire sur `profiles` à chaque vérification
--      RLS — est négligeable au volume de ce projet (un labo de formulation avec un
--      nombre d'admins de l'ordre de l'unité/dizaine), et la fonction est marquée
--      `stable` pour que Postgres mémoïse le résultat au sein d'une même requête.
--
-- Compromis assumé : si le trafic authentifié devient massif, migrer vers des JWT
-- custom claims (rôle embarqué dans le token, zéro requête DB par ligne) est
-- l'optimisation naturelle. Le point d'entrée `public.is_admin()` ci-dessous isole ce
-- choix : toutes les policies RLS l'appellent, aucune n'accède directement à
-- `profiles` — le jour où on bascule vers des JWT claims, seule cette fonction change,
-- pas les ~20 policies qui la consomment.
--
-- Ce choix engage tout le schéma qui suit — à valider avant mise en production.

create table public.profiles (
  id          uuid primary key references auth.users (id) on delete cascade,
  role        text not null default 'client' check (role in ('client', 'admin')),
  nom_complet text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

comment on table public.profiles is
  'Un profil par utilisateur Supabase Auth. La colonne role porte le mécanisme de '
  'contrôle d''accès admin utilisé par toutes les policies RLS du laboratoire '
  '(voir public.is_admin()). Décision d''architecture — voir en-tête de ce fichier.';
comment on column public.profiles.role is
  'client (défaut, tout nouvel utilisateur) ou admin (accès laboratoire). '
  'La promotion admin ne peut pas être faite par l''utilisateur lui-même : voir '
  'le trigger profiles_block_role_escalation plus bas.';

create trigger profiles_set_updated_at
  before update on public.profiles
  for each row
  execute function public.set_updated_at();

-- public.is_admin() — point d'entrée UNIQUE utilisé par toutes les policies RLS du
-- laboratoire pour savoir si l'utilisateur courant (auth.uid()) est admin.
--
-- SECURITY DEFINER + search_path vide + noms qualifiés : la fonction s'exécute avec
-- les droits de son propriétaire (le rôle propriétaire des migrations, non soumis à
-- ses propres policies RLS puisque `profiles` n'a pas FORCE ROW LEVEL SECURITY), ce
-- qui évite un problème de poule-et-l'œuf où la policy sur `profiles` empêcherait de
-- lire `profiles` pour savoir si on a le droit de lire `profiles`.
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role = 'admin'
  );
$$;

comment on function public.is_admin() is
  'Retourne true si l''utilisateur authentifié courant (auth.uid()) a le rôle admin '
  'dans public.profiles. Utilisée par toutes les policies RLS des tables du '
  'laboratoire (matieres, formules, formule_lignes, lots) et par la policy publique '
  'de produits. Retourne false pour un utilisateur anonyme (auth.uid() est NULL).';

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;

-- Crée automatiquement un profil (rôle client par défaut) à chaque inscription.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, role)
  values (new.id, 'client')
  on conflict (id) do nothing;
  return new;
end;
$$;

comment on function public.handle_new_user() is
  'Trigger sur auth.users : crée automatiquement la ligne public.profiles '
  '(role = client) associée à tout nouvel utilisateur Supabase Auth.';

create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();

-- RLS sur profiles — activée dès sa création, sans exception (règle non négociable
-- n°2 de CLAUDE.md : elle porte le rôle d'accès, donc sa propre protection est
-- critique).
alter table public.profiles enable row level security;

-- Empêche un utilisateur non-admin de s'auto-promouvoir admin, y compris sur sa
-- propre ligne (défense en profondeur en plus de la policy UPDATE ci-dessous).
create or replace function public.prevent_role_self_escalation()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if new.role is distinct from old.role and not public.is_admin() then
    raise exception
      'Seul un administrateur peut modifier le rôle d''un profil.'
      using errcode = '42501';
  end if;
  return new;
end;
$$;

create trigger profiles_block_role_escalation
  before update on public.profiles
  for each row
  execute function public.prevent_role_self_escalation();

create policy "profiles_select_own_or_admin"
  on public.profiles for select
  to authenticated
  using (id = auth.uid() or public.is_admin());

create policy "profiles_update_own_or_admin"
  on public.profiles for update
  to authenticated
  using (id = auth.uid() or public.is_admin())
  with check (id = auth.uid() or public.is_admin());

-- INSERT est normalement géré par le trigger handle_new_user (SECURITY DEFINER,
-- contourne RLS). Cette policy ne sert que pour la création manuelle d'un profil
-- par un admin (ex. script de bootstrap, compte de service).
create policy "profiles_insert_admin"
  on public.profiles for insert
  to authenticated
  with check (public.is_admin());

create policy "profiles_delete_admin"
  on public.profiles for delete
  to authenticated
  using (public.is_admin());

-- Grants au niveau table : plomberie nécessaire pour que PostgREST puisse même
-- adresser la table (ce que Supabase accorde de toute façon par défaut à tout
-- nouvel objet du schéma public — voir `auto_expose_new_tables` dans config.toml,
-- "matching the cloud default"). On le rend explicite ici plutôt que de dépendre de
-- ce réglage implicite, pour que la migration reste correcte même si ce toggle
-- change un jour. La vraie frontière de sécurité n'est PAS ce grant : ce sont les
-- policies RLS ci-dessus, toutes `to authenticated`. anon obtient le privilège SQL
-- mais aucune policy ne le vise donc RLS refuse tout par défaut (SELECT renvoie 0
-- ligne, INSERT/UPDATE/DELETE échouent avec "new row violates row-level security
-- policy", SQLSTATE 42501).
grant select, insert, update, delete on public.profiles to anon, authenticated;

-- NOTE OPÉRATIONNELLE — bootstrap du tout premier admin
-- ------------------------------------------------------
-- Par construction, personne ne peut s'auto-promouvoir admin (policy + trigger
-- ci-dessus). Le tout premier compte admin doit donc être promu manuellement, hors
-- RLS, via la clé service_role (SQL Editor du Studio Supabase, ou un script serveur
-- utilisant la clé service_role qui contourne RLS) :
--
--   update public.profiles set role = 'admin' where id = '<uuid-utilisateur>';
--
-- Cette étape ne peut pas être automatisée dans une migration (aucun utilisateur
-- n'existe encore à ce stade) — à faire une fois l'environnement provisionné.
