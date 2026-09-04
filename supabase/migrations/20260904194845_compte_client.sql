-- LA PARADOXA — compte client : accès aux commandes + profil olfactif
--
-- Prépare le schéma pour écran 17 (compte client), 18 (suivi de commande)
-- et 6 (quiz olfactif), différés jusqu'ici (voir commentaire d'en-tête de
-- supabase/migrations/20260904135542_commandes.sql : "une vraie policy
-- client_id = auth.uid() sera ajoutée quand l'écran existera").

-- Un client authentifié peut lire ses propres commandes (et leurs lignes),
-- en plus de l'admin (policy déjà existante). Toujours aucune policy pour
-- anon : le checkout invité reste possible, mais un invité ne peut pas
-- lister ses commandes passées — il lui faut un compte, ou le lien de
-- confirmation immédiat (stripe_session_id, mécanisme déjà en place).
create policy "commandes_client_select_own"
  on public.commandes for select
  to authenticated
  using (client_id = auth.uid());

create policy "commande_lignes_client_select_own"
  on public.commande_lignes for select
  to authenticated
  using (
    exists (
      select 1 from public.commandes c
      where c.id = commande_lignes.commande_id
        and c.client_id = auth.uid()
    )
  );

-- Profil olfactif issu du quiz (écran 6) : escale trouvée, familles
-- dominantes, horodatage. JSONB plutôt que des colonnes dédiées — ce sont
-- des données d'affichage/marketing consultées telles quelles (résumé sur
-- l'écran 17), jamais interrogées/filtrées en SQL, contrairement aux
-- colonnes structurées de matieres/formules qui, elles, portent une vraie
-- logique métier.
alter table public.profiles
  add column profil_olfactif jsonb;

comment on column public.profiles.profil_olfactif is
  'Résultat du quiz olfactif (écran 6) : { escale, famillesDominantes, repondiLe }. '
  'NULL tant que le quiz n''a pas été passé en étant connecté. Écrit par le client '
  'lui-même (policy profiles_update_own_or_admin déjà existante, aucune nouvelle '
  'policy nécessaire).';
