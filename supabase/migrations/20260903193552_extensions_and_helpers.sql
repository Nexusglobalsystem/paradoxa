-- LA PARADOXA — extensions & fonction utilitaire partagée
--
-- Ce fichier ne crée aucune table métier ni aucune policy : il pose la fondation
-- technique minimale réutilisée par toutes les migrations suivantes.

-- gen_random_uuid() : déjà fourni par pgcrypto sur les images Supabase, mais on le
-- déclare explicitement pour la portabilité (ex. reset complet d'un environnement
-- local qui ne partirait pas de l'image standard).
create extension if not exists pgcrypto with schema extensions;

-- Met à jour automatiquement `updated_at` à chaque UPDATE. Rattachée par un trigger
-- BEFORE UPDATE à chaque table métier qui porte une colonne updated_at.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

comment on function public.set_updated_at() is
  'Trigger utilitaire : renseigne updated_at = now() avant chaque UPDATE.';
