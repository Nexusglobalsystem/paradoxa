/**
 * Interprète une erreur Postgrest renvoyée par l'insertion dans `commandes`
 * pour distinguer deux cas très différents qui partagent le même code
 * Postgres 23505 (violation de contrainte unique) :
 *
 *  - `stripe_session_id` en conflit → l'évènement `checkout.session.completed`
 *    a déjà été traité pour cette session (webhook Stripe retenté après un
 *    ack manqué, ou double livraison — Stripe garantit "au moins une fois",
 *    jamais "exactement une fois"). C'est le cas d'IDEMPOTENCE attendu :
 *    on doit s'arrêter là, sans redécrémenter le stock une seconde fois
 *    (voir supabase/migrations/20260904135542_commandes.sql, colonne
 *    stripe_session_id UNIQUE).
 *  - `numero_commande` en conflit → collision improbable mais possible du
 *    générateur applicatif (genererNumeroCommande dans construire-commande.ts
 *    tire 6 chiffres au hasard, pas une séquence garantie unique) : il faut
 *    réessayer avec un nouveau numéro, pas abandonner le traitement.
 *
 * Fonction pure sur la forme de l'erreur (code + message/details) : testable
 * avec des objets fabriqués, sans base de données réelle.
 */
export type InterpretationConflit = "session_deja_traitee" | "numero_collision" | "autre";

export interface ErreurPostgrestSimplifiee {
  code?: string | null;
  message?: string | null;
  details?: string | null;
}

const CODE_VIOLATION_UNIQUE = "23505";

export function interpreterErreurConflit(erreur: ErreurPostgrestSimplifiee | null | undefined): InterpretationConflit {
  if (!erreur || erreur.code !== CODE_VIOLATION_UNIQUE) return "autre";

  const texte = `${erreur.message ?? ""} ${erreur.details ?? ""}`.toLowerCase();
  if (texte.includes("stripe_session_id")) return "session_deja_traitee";
  if (texte.includes("numero_commande")) return "numero_collision";
  return "autre";
}
