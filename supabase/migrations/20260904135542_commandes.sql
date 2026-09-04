-- LA PARADOXA — commandes & lignes de commande (tunnel d'achat, Vague 3)
--
-- Checkout sans compte obligatoire (règle de l'agent frontend-commerce :
-- "Checkout en trois étapes, sans compte obligatoire") : client_id est donc
-- nullable, email fait autorité pour identifier une commande invité.
--
-- DÉCISION D'ARCHITECTURE — accès à une commande juste après paiement
-- ----------------------------------------------------------------------
-- Pas de policy RLS publique sur ces tables (même prudence que matieres/
-- formules : données financières). La page de confirmation, juste après la
-- redirection Stripe, n'a aucune preuve d'identité au-delà du
-- `stripe_session_id` présent dans l'URL (`?session_id=...`) — c'est un jeton
-- opaque et non devinable généré par Stripe, traité côté serveur (route
-- handler avec la clé service_role, jamais exposée au client) comme preuve
-- suffisante pour afficher CETTE commande précise. Aucune policy anon/
-- authenticated n'autorise donc la lecture directe : c'est le contournement
-- RLS du service_role, scopé à une seule commande par son session_id, qui
-- porte la sécurité ici — pas une policy large "n'importe qui avec le bon
-- e-mail". Pour /compte/commandes (Vague 3 suite, hors périmètre actuel),
-- une vraie policy `client_id = auth.uid()` sera ajoutée quand l'écran
-- existera.

create table public.commandes (
  id uuid primary key default gen_random_uuid(),
  numero_commande text not null unique, -- ex. "CMD-2026-000042", généré applicativement

  -- Client : compte optionnel (checkout invité par défaut, voir ci-dessus).
  client_id uuid references auth.users (id) on delete set null,
  email text not null,
  nom_complet text not null,
  telephone text,

  -- Adresse de livraison — colonnes plates plutôt que JSON, cohérent avec le
  -- reste du schéma (matieres/formules évitent déjà le JSON pour les champs
  -- structurés ; il n'y a ici ni volume ni variabilité qui justifierait jsonb).
  adresse_ligne1 text not null,
  adresse_ligne2 text,
  code_postal text not null,
  ville text not null,
  pays text not null default 'FR',

  -- Montants : sous_total + frais_livraison = total, tous calculés et figés
  -- côté serveur au moment de la création de session Stripe (règle non
  -- négociable CLAUDE.md n°4 appliquée au prix : jamais de calcul client).
  sous_total numeric(10, 2) not null check (sous_total >= 0),
  frais_livraison numeric(10, 2) not null default 0 check (frais_livraison >= 0),
  total numeric(10, 2) not null check (total >= 0),
  devise text not null default 'EUR' check (devise in ('EUR', 'XOF')),

  statut text not null default 'en_attente_paiement' check (
    statut in (
      'en_attente_paiement', 'payee', 'preparee', 'expediee', 'livree',
      'annulee', 'remboursee'
    )
  ),

  -- Références Stripe. stripe_session_id est le jeton d'accès "confirmation
  -- de commande" décrit ci-dessus ; stripe_payment_intent_id sert à la
  -- réconciliation webhook (idempotence : voir commande n°35 de
  -- design/INVENTAIRE.md, agent api-paiement).
  stripe_session_id text unique,
  stripe_payment_intent_id text,

  transporteur text,
  numero_suivi text,

  notes text,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.commandes is
  'Commandes du tunnel d''achat (checkout invité par défaut, client_id '
  'optionnel). Écriture réservée au rôle admin + service_role (webhook '
  'Stripe) ; aucune lecture publique directe — voir le commentaire d''en-tête '
  'de cette migration pour le mécanisme d''accès à la confirmation.';
comment on column public.commandes.stripe_session_id is
  'Jeton opaque Stripe utilisé (côté serveur uniquement, clé service_role) '
  'pour autoriser l''affichage de CETTE commande précise sur la page de '
  'confirmation, sans nécessiter de compte client.';

create trigger commandes_set_updated_at
  before update on public.commandes
  for each row
  execute function public.set_updated_at();

create index commandes_client_id_idx on public.commandes (client_id);
create index commandes_email_idx on public.commandes (email);
create index commandes_statut_idx on public.commandes (statut);
create index commandes_stripe_payment_intent_id_idx on public.commandes (stripe_payment_intent_id);

-- commande_lignes — une ligne par produit acheté, prix et nom figés au
-- moment de l'achat (ne doivent jamais dériver si le produit change ou est
-- retiré du catalogue ensuite — même logique de gel que lot_matieres.fournisseur).
create table public.commande_lignes (
  id               uuid primary key default gen_random_uuid(),
  commande_id      uuid not null references public.commandes (id) on delete cascade,
  produit_id       uuid references public.produits (id) on delete set null,

  nom_produit      text not null,
  prix_unitaire    numeric(10, 2) not null check (prix_unitaire >= 0),
  quantite         integer not null check (quantite > 0),
  sous_total       numeric(10, 2) not null check (sous_total >= 0),

  created_at timestamptz not null default now()
);

comment on table public.commande_lignes is
  'Lignes de commande : nom et prix figés au moment de l''achat (snapshot), '
  'ne dérivent jamais si public.produits change ensuite. produit_id nullable '
  '(on delete set null) : la ligne de commande doit survivre à la suppression '
  'du produit du catalogue.';

create index commande_lignes_commande_id_idx on public.commande_lignes (commande_id);
create index commande_lignes_produit_id_idx on public.commande_lignes (produit_id);

alter table public.commandes enable row level security;
alter table public.commande_lignes enable row level security;

create policy "commandes_admin_select"
  on public.commandes for select
  to authenticated
  using (public.is_admin());

create policy "commandes_admin_update"
  on public.commandes for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "commande_lignes_admin_select"
  on public.commande_lignes for select
  to authenticated
  using (public.is_admin());

create policy "commande_lignes_admin_update"
  on public.commande_lignes for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- Grants au niveau table : plomberie PostgREST (voir la même note dans les
-- migrations précédentes). La vraie frontière de sécurité reste les policies
-- RLS ci-dessus : ni anon ni authenticated non-admin n'ont de policy
-- INSERT/UPDATE/DELETE, donc ces opérations échouent en 42501 pour eux.
-- L'écriture (création de commande, décrément de stock) passe exclusivement
-- par le webhook Stripe côté serveur, avec la clé service_role qui contourne
-- RLS — jamais par une policy authenticated/anon.
grant select, insert, update, delete on public.commandes to anon, authenticated;
grant select, insert, update, delete on public.commande_lignes to anon, authenticated;
