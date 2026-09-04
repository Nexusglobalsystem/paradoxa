/**
 * Conversion entre nos montants "humains" (185, 6.9…) et les entiers que
 * Stripe attend, dans un sens (app/api/commande/creer-session/construire-payload-stripe.ts,
 * à la création de session) comme dans l'autre (app/api/webhooks/stripe/construire-commande.ts,
 * à la lecture des line_items payés). Un seul et même fichier pour les deux
 * sens plutôt que deux listes de devises à zéro décimale dupliquées et
 * susceptibles de diverger.
 *
 * https://docs.stripe.com/currencies#zero-decimal — le XOF (franc CFA,
 * catalogue `produits.devise`) est une devise à zéro décimale : Stripe
 * l'exprime tel quel (1000 XOF → `1000`), jamais ×100 comme l'EUR.
 */
const DEVISES_SANS_DECIMALES = new Set([
  "bif", "clp", "djf", "gnf", "jpy", "kmf", "krw", "mga", "pyg", "rwf", "ugx", "vnd", "vuv", "xaf", "xof", "xpf",
]);

export function estDeviseSansDecimales(devise: string): boolean {
  return DEVISES_SANS_DECIMALES.has(devise.toLowerCase());
}

/** Montant humain (185, 6.9) → entier Stripe (18500, 690, ou 1000 XOF inchangé). */
export function convertirEnUnitesStripe(montant: number, devise: string): number {
  if (estDeviseSansDecimales(devise)) {
    return Math.round(montant);
  }
  return Math.round(montant * 100);
}

/** Entier Stripe → montant humain — inverse de convertirEnUnitesStripe. */
export function convertirDepuisUnitesStripe(montantStripe: number, devise: string): number {
  if (estDeviseSansDecimales(devise)) {
    return montantStripe;
  }
  return montantStripe / 100;
}
