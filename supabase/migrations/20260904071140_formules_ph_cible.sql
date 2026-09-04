-- LA PARADOXA — pH cible pour les formules cosmétiques
--
-- Le composeur cosmétique (écran 34, design/INVENTAIRE.md) affiche un champ
-- "pH cible" sans qu'aucune colonne dédiée n'existe : la première version de
-- l'écran le sérialisait donc en préfixe reconnaissable dans formules.notes
-- (voir historique git), pour ne pas perdre la donnée à chaque rechargement.
-- Colonne dédiée ajoutée ici plutôt que de laisser ce contournement en place.
--
-- Nullable et sans contrainte de type_formule : n'a de sens que pour une
-- formule cosmétique, mais rien n'empêche techniquement une formule parfum
-- de la laisser vide — pas besoin d'une contrainte croisée pour ça.

alter table public.formules
  add column ph_cible numeric(4, 2) check (ph_cible is null or (ph_cible >= 0 and ph_cible <= 14));

comment on column public.formules.ph_cible is
  'pH cible de la formule (formulation cosmétique uniquement, échelle 0-14). '
  'Affiché et édité depuis le composeur cosmétique, écran 34.';
