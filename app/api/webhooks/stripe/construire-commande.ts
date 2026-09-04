import type Stripe from "stripe";

import { convertirDepuisUnitesStripe } from "../../commande/devises";

/** `CMD-{année}-{6 chiffres}`, cf. le commentaire de colonne dans supabase/migrations/20260904135542_commandes.sql. */
export function genererNumeroCommande(maintenant: Date = new Date(), alea: () => number = Math.random): string {
  const annee = maintenant.getFullYear();
  const suffixe = Math.floor(alea() * 1_000_000)
    .toString()
    .padStart(6, "0");
  return `CMD-${annee}-${suffixe}`;
}

export interface CommandeAPersister {
  numero_commande: string;
  client_id: string | null;
  email: string;
  nom_complet: string;
  telephone: string | null;
  adresse_ligne1: string;
  adresse_ligne2: string | null;
  code_postal: string;
  ville: string;
  pays: string;
  sous_total: number;
  frais_livraison: number;
  total: number;
  devise: string;
  statut: "payee";
  stripe_session_id: string;
  stripe_payment_intent_id: string | null;
}

/**
 * Reconstruit la ligne `commandes` à insérer depuis une session Stripe
 * Checkout payée. Toutes les données de livraison (nom, adresse…) et les
 * montants figés (sous_total/frais_livraison/total) viennent des
 * métadonnées que app/api/commande/creer-session/stripe-provider.ts a
 * posées lui-même côté serveur au moment de créer la session — jamais
 * d'une valeur que Stripe aurait reçue directement du navigateur de
 * l'acheteur. `email` retombe sur `customer_details.email` (rempli par
 * Stripe Checkout) si la métadonnée était vide, en dernier recours.
 *
 * Fonction pure : ne touche ni Supabase ni le réseau, testable avec un
 * objet Session fabriqué à la main.
 */
export function construireCommandeDepuisSession(
  session: Pick<Stripe.Checkout.Session, "id" | "metadata" | "customer_details" | "payment_intent" | "amount_total" | "currency">,
  numeroCommande: string,
): CommandeAPersister {
  const m = session.metadata ?? {};
  const paymentIntent = session.payment_intent;

  return {
    numero_commande: numeroCommande,
    // Posé par stripe-provider.ts en métadonnée de session si un client était
    // connecté au moment du paiement ; chaîne vide (jamais undefined, Stripe
    // n'accepte que des string en métadonnée) → null, checkout invité.
    client_id: m.client_id || null,
    email: m.email || session.customer_details?.email || "",
    nom_complet: m.nom_complet || "",
    telephone: m.telephone || null,
    adresse_ligne1: m.adresse_ligne1 || "",
    adresse_ligne2: m.adresse_ligne2 || null,
    code_postal: m.code_postal || "",
    ville: m.ville || "",
    pays: m.pays || "FR",
    sous_total: Number(m.sous_total ?? 0),
    frais_livraison: Number(m.frais_livraison ?? 0),
    total: Number(m.total ?? (session.amount_total ?? 0) / 100),
    devise: (m.devise || session.currency || "EUR").toUpperCase(),
    statut: "payee",
    stripe_session_id: session.id,
    stripe_payment_intent_id: typeof paymentIntent === "string" ? paymentIntent : (paymentIntent?.id ?? null),
  };
}

export interface LigneProduitExtraite {
  produitId: string;
  nom: string;
  prixUnitaire: number;
  quantite: number;
  sousTotal: number;
}

/**
 * Isole les lignes produit d'une liste de line_items Stripe (obtenue via
 * `stripe.checkout.sessions.listLineItems(id, { expand: ["data.price.product"] })`),
 * en écartant la ligne "Livraison" (voir NOM_LIGNE_LIVRAISON dans
 * app/api/commande/creer-session/construire-payload-stripe.ts) : celle-ci
 * n'a jamais de `produit_id` dans les métadonnées Product, contrairement à
 * une vraie ligne produit — c'est le seul critère utilisé pour la filtrer,
 * plutôt que de comparer un nom affiché qui pourrait changer.
 */
export function extraireLignesProduits(lineItems: readonly Stripe.LineItem[]): LigneProduitExtraite[] {
  const lignes: LigneProduitExtraite[] = [];

  for (const item of lineItems) {
    const produit = item.price?.product;
    const produitEstObjet = typeof produit === "object" && produit !== null;
    const produitSupprime = produitEstObjet && "deleted" in produit && produit.deleted === true;
    if (!produitEstObjet || produitSupprime) continue;

    const produitId = (produit as Stripe.Product).metadata?.produit_id;
    if (!produitId) continue; // ligne "Livraison" ou toute ligne hors catalogue

    const quantite = item.quantity ?? 1;
    const prixUnitaire = convertirDepuisUnitesStripe(item.price?.unit_amount ?? 0, item.currency);

    lignes.push({
      produitId,
      nom: item.description || (produit as Stripe.Product).name,
      quantite,
      prixUnitaire,
      sousTotal: Math.round(prixUnitaire * quantite * 100) / 100,
    });
  }

  return lignes;
}
