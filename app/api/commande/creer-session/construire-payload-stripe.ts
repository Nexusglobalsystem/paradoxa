import type Stripe from "stripe";

import { convertirEnUnitesStripe } from "../devises";
import type { LigneCommandePourPaiement } from "./payment-provider";

/**
 * Nom de la ligne de livraison dans Stripe Checkout — utilisé aussi par le
 * webhook (../../webhooks/stripe/construire-commande.ts) pour reconnaître
 * cette ligne quand il reconstruit commande_lignes depuis la session payée
 * (elle n'a pas de `produit_id` en métadonnées, contrairement aux vraies
 * lignes produit — voir extraireLignesProduits).
 */
export const NOM_LIGNE_LIVRAISON = "Livraison";

/**
 * Construit les line_items Stripe Checkout à partir des lignes déjà
 * calculées côté serveur (prix relus en base, jamais ceux envoyés par le
 * client — voir route.ts). Fonction pure, testable sans réseau : ne fait
 * qu'assembler un objet, n'appelle jamais l'API Stripe.
 *
 * `produit_id` est posé en métadonnées Stripe *Product* (pas Price) pour
 * que le webhook puisse reconstruire commande_lignes directement depuis
 * `stripe.checkout.sessions.listLineItems(..., { expand: ["data.price.product"] })`
 * sans avoir besoin de retrouver le panier ailleurs.
 */
export function construireLigneItemsStripe(
  lignes: readonly LigneCommandePourPaiement[],
  fraisLivraison: number,
  devise: string,
): Stripe.Checkout.SessionCreateParams.LineItem[] {
  const deviseMinuscule = devise.toLowerCase();

  const lignesProduits: Stripe.Checkout.SessionCreateParams.LineItem[] = lignes.map((ligne) => ({
    quantity: ligne.quantite,
    price_data: {
      currency: deviseMinuscule,
      unit_amount: convertirEnUnitesStripe(ligne.prixUnitaire, devise),
      product_data: {
        name: ligne.nom,
        metadata: { produit_id: ligne.produitId },
      },
    },
  }));

  if (fraisLivraison > 0) {
    lignesProduits.push({
      quantity: 1,
      price_data: {
        currency: deviseMinuscule,
        unit_amount: convertirEnUnitesStripe(fraisLivraison, devise),
        product_data: { name: NOM_LIGNE_LIVRAISON },
      },
    });
  }

  return lignesProduits;
}
