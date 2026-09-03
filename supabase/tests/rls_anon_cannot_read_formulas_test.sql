-- LA PARADOXA — test RLS obligatoire (règle .claude/agents/backend-supabase.md) :
-- "Après chaque migration, écris un test qui vérifie qu'un utilisateur anonyme ne
-- peut pas lire une formule. Ce test ne doit jamais être supprimé."
--
-- Étendu ici à toutes les tables du laboratoire explicitement citées par la règle
-- non négociable n°2 de CLAUDE.md : matieres, formules, formule_lignes, lots (+ leurs
-- tables enfants matiere_limites_ifra et lot_matieres, qui héritent de la même
-- confidentialité). Inclut aussi un contrôle positif sur produits, pour prouver que
-- la policy RLS discrimine correctement (actif = public, brouillon = admin
-- seulement) plutôt que de tout bloquer sans distinction.
--
-- COMMENT LANCER CE TEST
-- -----------------------
-- Ce test nécessite une base Postgres locale avec l'extension pgTAP et le schéma
-- Supabase Auth (auth.uid(), auth.users, rôles anon/authenticated) — c'est-à-dire un
-- stack Supabase local démarré via Docker :
--
--   npx --yes supabase@latest start   # démarre les conteneurs Docker locaux
--   npx --yes supabase@latest test db # applique les migrations puis exécute
--                                      # tous les fichiers *_test.sql sous
--                                      # /supabase/tests via pg_prove
--
-- Alternative sans le CLI (pg_prove installé localement, pointant sur une base
-- Supabase locale déjà démarrée) :
--
--   pg_prove --host 127.0.0.1 --port 54322 --username postgres \
--     supabase/tests/rls_anon_cannot_read_formulas_test.sql
--
-- Ce dépôt de travail n'a ni Docker ni Postgres local disponibles dans ce shell
-- (vérifié : `docker --version` → introuvable). Ce fichier a donc été rédigé et
-- relu statiquement, mais PAS exécuté — voir le rapport de la migration pour le
-- détail. À exécuter dès qu'un environnement Docker est disponible, avant toute
-- mise en production de ce schéma.

create extension if not exists pgtap with schema extensions;

begin;

select plan(9);

-- ---------------------------------------------------------------------------
-- Semis des données de test, exécuté en tant que propriétaire des migrations
-- (contourne RLS par propriété de table, comme le ferait la clé service_role).
-- Sert à prouver que RLS bloque l'accès à de VRAIES lignes, pas seulement à
-- observer des tables vides.
-- ---------------------------------------------------------------------------

insert into public.formules (id, nom, maison, type_formule, type_concentration)
values ('11111111-1111-1111-1111-111111111111', 'Formule de test RLS', 'shea', 'parfum', 'edp');

insert into public.matieres (id, nom, famille_olfactive, prix_kg, stock_kg)
values ('22222222-2222-2222-2222-222222222222', 'Matière de test RLS', 'boise_resines', 100, 10);

insert into public.matiere_limites_ifra (matiere_id, categorie_ifra, seuil_pourcentage)
values ('22222222-2222-2222-2222-222222222222', '4', 12.5);

insert into public.formule_lignes (formule_id, matiere_id, etage, pourcentage)
values ('11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222', 'coeur', 5);

insert into public.lots (id, numero_lot, formule_id, quantite_tiree)
values ('33333333-3333-3333-3333-333333333333', 'LOT-TEST-RLS-001', '11111111-1111-1111-1111-111111111111', 100);

insert into public.lot_matieres (lot_id, matiere_id, quantite_incorporee)
values ('33333333-3333-3333-3333-333333333333', '22222222-2222-2222-2222-222222222222', 1.5);

insert into public.produits (id, maison, nom, slug, statut)
values ('44444444-4444-4444-4444-444444444444', 'shea', 'Produit actif de test', 'produit-actif-test-rls', 'actif');

insert into public.produits (id, maison, nom, slug, statut)
values ('55555555-5555-5555-5555-555555555555', 'shea', 'Produit brouillon de test', 'produit-brouillon-test-rls', 'brouillon');

-- ---------------------------------------------------------------------------
-- Bascule vers le rôle Postgres "anon" — c'est le rôle sous lequel PostgREST
-- exécute toute requête d'un visiteur non authentifié. `set local` : la bascule
-- ne survit pas au ROLLBACK final de ce test.
-- ---------------------------------------------------------------------------

set local role anon;

select is_empty(
  $$ select 1 from public.formules $$,
  'un utilisateur anonyme ne doit voir aucune ligne dans formules'
);

select is_empty(
  $$ select 1 from public.formule_lignes $$,
  'un utilisateur anonyme ne doit voir aucune ligne dans formule_lignes'
);

select is_empty(
  $$ select 1 from public.matieres $$,
  'un utilisateur anonyme ne doit voir aucune ligne dans matieres'
);

select is_empty(
  $$ select 1 from public.matiere_limites_ifra $$,
  'un utilisateur anonyme ne doit voir aucune ligne dans matiere_limites_ifra'
);

select is_empty(
  $$ select 1 from public.lots $$,
  'un utilisateur anonyme ne doit voir aucune ligne dans lots'
);

select is_empty(
  $$ select 1 from public.lot_matieres $$,
  'un utilisateur anonyme ne doit voir aucune ligne dans lot_matieres'
);

-- Contrôle positif : la policy ne doit pas tout bloquer sans discernement — un
-- produit actif doit rester visible publiquement (règle CLAUDE.md n°2 : "produits
-- lisible publiquement quand actif").
select results_eq(
  $$ select nom from public.produits where statut = 'actif' order by nom $$,
  $$ values ('Produit actif de test'::text) $$,
  'un produit actif reste visible publiquement (contrôle positif anti faux-négatif)'
);

-- ... alors qu'un produit brouillon, lui, ne doit pas être visible publiquement.
select is_empty(
  $$ select 1 from public.produits where statut = 'brouillon' $$,
  'un utilisateur anonyme ne doit pas voir un produit au statut brouillon'
);

-- Écriture : un anonyme ne doit pas non plus pouvoir insérer dans une table du
-- laboratoire (au-delà de la simple lecture bloquée par la policy SELECT, les
-- grants de table retirent même le privilège INSERT de base au rôle anon).
select throws_ok(
  $$ insert into public.formules (nom, maison, type_formule, type_concentration)
     values ('Intrusion anonyme', 'shea', 'parfum', 'edp') $$,
  '42501',
  null,
  'un utilisateur anonyme ne doit pas pouvoir insérer dans formules'
);

select * from finish();

rollback;
