import { describe, expect, it } from "vitest";
import type Stripe from "stripe";

import { construireCommandeDepuisSession, extraireLignesProduits, genererNumeroCommande } from "./construire-commande";

describe("genererNumeroCommande", () => {
  it("matches the CMD-{année}-{6 chiffres} format documented in the commandes migration", () => {
    const numero = genererNumeroCommande(new Date("2026-09-04T12:00:00Z"), () => 0.000042);
    expect(numero).toMatch(/^CMD-2026-\d{6}$/);
  });

  it("is deterministic given an injected random source (testability, not real entropy)", () => {
    expect(genererNumeroCommande(new Date("2026-01-01T00:00:00Z"), () => 0.5)).toBe("CMD-2026-500000");
  });
});

describe("construireCommandeDepuisSession", () => {
  const sessionDeBase = {
    id: "cs_test_abc123",
    metadata: {
      nom_complet: "Aïssata Diop",
      email: "aissata@example.com",
      telephone: "0600000000",
      adresse_ligne1: "12 rue des Fleurs",
      adresse_ligne2: "",
      code_postal: "75004",
      ville: "Paris",
      pays: "FR",
      sous_total: "185.00",
      frais_livraison: "6.90",
      total: "191.90",
      devise: "EUR",
    },
    customer_details: { email: "aissata@example.com" } as Stripe.Checkout.Session.CustomerDetails,
    payment_intent: "pi_test_xyz",
    amount_total: 19190,
    currency: "eur",
  };

  it("builds the commandes row from server-set metadata, never from a client-supplied amount", () => {
    const commande = construireCommandeDepuisSession(sessionDeBase, "CMD-2026-000001");

    expect(commande).toMatchObject({
      numero_commande: "CMD-2026-000001",
      client_id: null,
      email: "aissata@example.com",
      nom_complet: "Aïssata Diop",
      sous_total: 185,
      frais_livraison: 6.9,
      total: 191.9,
      devise: "EUR",
      statut: "payee",
      stripe_session_id: "cs_test_abc123",
      stripe_payment_intent_id: "pi_test_xyz",
    });
  });

  it("falls back to customer_details.email when the email metadata is missing", () => {
    const commande = construireCommandeDepuisSession(
      { ...sessionDeBase, metadata: { ...sessionDeBase.metadata, email: "" } },
      "CMD-2026-000002",
    );
    expect(commande.email).toBe("aissata@example.com");
  });

  it("falls back to amount_total/currency when total/devise metadata are absent", () => {
    const commande = construireCommandeDepuisSession(
      { ...sessionDeBase, metadata: {} },
      "CMD-2026-000003",
    );
    expect(commande.total).toBe(191.9);
    expect(commande.devise).toBe("EUR");
  });

  it("extracts payment_intent id whether it's a bare string or an expanded object", () => {
    const commandeChaine = construireCommandeDepuisSession(sessionDeBase, "CMD-2026-000004");
    expect(commandeChaine.stripe_payment_intent_id).toBe("pi_test_xyz");

    const commandeObjet = construireCommandeDepuisSession(
      { ...sessionDeBase, payment_intent: { id: "pi_expanded" } as Stripe.PaymentIntent },
      "CMD-2026-000005",
    );
    expect(commandeObjet.stripe_payment_intent_id).toBe("pi_expanded");
  });
});

function fauxLineItemProduit(produitId: string | undefined, nom: string, unitAmount: number, quantite: number, currency = "eur"): Stripe.LineItem {
  return {
    id: `li_${produitId ?? "livraison"}`,
    object: "item",
    description: nom,
    quantity: quantite,
    currency,
    price: {
      unit_amount: unitAmount,
      product: produitId
        ? ({ name: nom, metadata: { produit_id: produitId } } as unknown as Stripe.Product)
        : ({ name: nom, metadata: {} } as unknown as Stripe.Product),
    },
  } as unknown as Stripe.LineItem;
}

describe("extraireLignesProduits", () => {
  it("converts Stripe line items back into produit lines, in euros", () => {
    const lignes = extraireLignesProduits([fauxLineItemProduit("prod-1", "Bois de Shéa", 18500, 1)]);
    expect(lignes).toEqual([
      { produitId: "prod-1", nom: "Bois de Shéa", prixUnitaire: 185, quantite: 1, sousTotal: 185 },
    ]);
  });

  it("filters out the shipping line (no produit_id metadata)", () => {
    const lignes = extraireLignesProduits([
      fauxLineItemProduit("prod-1", "Bois de Shéa", 18500, 1),
      fauxLineItemProduit(undefined, "Livraison", 690, 1),
    ]);
    expect(lignes).toHaveLength(1);
    expect(lignes[0]?.produitId).toBe("prod-1");
  });

  it("handles a zero-decimal currency (XOF) without dividing by 100", () => {
    const lignes = extraireLignesProduits([fauxLineItemProduit("prod-1", "Bois de Shéa", 121349, 1, "xof")]);
    expect(lignes[0]?.prixUnitaire).toBe(121349);
  });

  it("skips a line whose product could not be expanded (only an id string)", () => {
    const ligneNonExpandee = {
      id: "li_x",
      object: "item",
      description: "Mystère",
      quantity: 1,
      currency: "eur",
      price: { unit_amount: 1000, product: "prod_raw_id" },
    } as unknown as Stripe.LineItem;
    expect(extraireLignesProduits([ligneNonExpandee])).toEqual([]);
  });

  it("multiplies price by quantity for sousTotal", () => {
    const lignes = extraireLignesProduits([fauxLineItemProduit("prod-1", "Baume Karité", 6200, 3)]);
    expect(lignes[0]?.sousTotal).toBe(186);
  });
});
