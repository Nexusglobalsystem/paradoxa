import Stripe from "stripe";

/**
 * Vérifie la signature `Stripe-Signature` d'un évènement webhook et
 * reconstruit l'objet Event correspondant — lève si la signature est
 * absente/invalide/expirée (Stripe.errors.StripeSignatureVerificationError).
 *
 * `Stripe.webhooks` est une méthode STATIQUE du SDK (pas besoin d'instancier
 * un client avec une clé API : la vérification de signature est un calcul
 * HMAC local, aucun appel réseau). C'est ce qui rend
 * verifier-signature.test.ts possible sans aucune clé Stripe réelle — le
 * test génère lui-même une signature valide avec
 * `Stripe.webhooks.generateTestHeaderString`, exactement le même code que
 * celui utilisé ici pour la vérifier.
 *
 * `payload` DOIT être le corps brut de la requête (request.text()), jamais
 * request.json() reparsé : la signature porte sur les octets exacts envoyés
 * par Stripe, un JSON.stringify(JSON.parse(x)) peut différer de `x` (ordre
 * des clés, espaces) et casser la vérification.
 */
export function verifierEvenementWebhook(payload: string, signature: string, secret: string): Stripe.Event {
  return Stripe.webhooks.constructEvent(payload, signature, secret);
}
