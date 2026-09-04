/**
 * Calculs de panier — logique métier pure, sans dépendance React ni réseau,
 * volontairement partagée entre :
 *  - l'affichage client (app/(vitrine)/panier-provider.tsx, panier/panier-view.tsx,
 *    commande/tunnel-commande.tsx) pour un total instantané, optimiste ;
 *  - app/api/commande/creer-session/route.ts, qui reste la seule source
 *    d'autorité réelle : il relit `produits.prix` en base et recalcule ces
 *    mêmes fonctions à partir des VRAIS prix serveur avant de créer la
 *    session Stripe (CLAUDE.md règle n°4 — jamais de prix client de confiance).
 *
 * Fichier pur : aucun `"use client"` nécessaire, mais aucun import serveur
 * non plus (pas de Supabase, pas de Stripe) — importable des deux côtés.
 */

/**
 * Seuil de livraison offerte et frais standard en dessous du seuil.
 * Décision produit prise pour cette vague (aucune maquette ne fixe de
 * montant précis) : 80 € HT-vitrine, cohérent avec le tunnel de commande
 * Stitch ("Offerte (dès 80 €)" — voir
 * stitch_la_paradoxa/tunnel_de_commande_la_paradoxa/code.html ligne 372).
 * Les 6,90 € de frais standard sont un choix arbitraire documenté ici faute
 * de grille tarifaire transporteur réelle — à réviser avec un vrai contrat
 * logistique.
 */
export const SEUIL_LIVRAISON_OFFERTE_EUR = 80;
export const FRAIS_LIVRAISON_STANDARD_EUR = 6.9;

export interface LignePourCalcul {
  prixUnitaire: number;
  quantite: number;
}

/** Arrondi bancaire à 2 décimales — évite les résidus flottants (0.1+0.2). */
export function arrondirMontant(montant: number): number {
  return Math.round((montant + Number.EPSILON) * 100) / 100;
}

export function calculerSousTotal(lignes: readonly LignePourCalcul[]): number {
  const total = lignes.reduce((acc, ligne) => acc + ligne.prixUnitaire * ligne.quantite, 0);
  return arrondirMontant(total);
}

export function calculerFraisLivraison(
  sousTotal: number,
  options: { seuil?: number; frais?: number } = {},
): number {
  const seuil = options.seuil ?? SEUIL_LIVRAISON_OFFERTE_EUR;
  const frais = options.frais ?? FRAIS_LIVRAISON_STANDARD_EUR;
  if (sousTotal <= 0) return 0;
  return sousTotal >= seuil ? 0 : arrondirMontant(frais);
}

export function calculerTotal(sousTotal: number, fraisLivraison: number): number {
  return arrondirMontant(sousTotal + fraisLivraison);
}

/**
 * Un tunnel de paiement Stripe Checkout n'accepte qu'une seule devise par
 * session. Le catalogue actuel est 100 % EUR, mais `produits.devise` accepte
 * aussi XOF (voir supabase/migrations/20260903193617_produits.sql) : si un
 * panier mélangeait un jour les deux, il faut le rejeter explicitement
 * plutôt que de sommer des montants incompatibles.
 */
export function verifierDeviseUniforme(devises: readonly string[]): string | null {
  const distinctes = new Set(devises);
  if (distinctes.size !== 1) return null;
  return devises[0] ?? null;
}

/** Distance restante avant la livraison offerte, jamais négative (0 = atteint). */
export function montantRestantAvantLivraisonOfferte(
  sousTotal: number,
  seuil: number = SEUIL_LIVRAISON_OFFERTE_EUR,
): number {
  return arrondirMontant(Math.max(seuil - sousTotal, 0));
}
