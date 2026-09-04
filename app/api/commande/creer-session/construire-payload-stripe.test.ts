import { describe, expect, it } from "vitest";

import { construireLigneItemsStripe, NOM_LIGNE_LIVRAISON } from "./construire-payload-stripe";
import type { LigneCommandePourPaiement } from "./payment-provider";

const LIGNES: LigneCommandePourPaiement[] = [
  { produitId: "a5e0e957-5b58-43af-8378-d0fc0b432946", nom: "Bois de Shéa", prixUnitaire: 185, quantite: 1 },
  { produitId: "9185cd18-da4a-44ac-aac6-e1147e528d59", nom: "Baume Prodigieux Karité Sauvage", prixUnitaire: 62, quantite: 2 },
];

describe("construireLigneItemsStripe", () => {
  it("builds one Stripe price_data line item per cart line, in cents, with the real EUR price", () => {
    const items = construireLigneItemsStripe(LIGNES, 0, "EUR");

    expect(items).toHaveLength(2);
    expect(items[0]).toMatchObject({
      quantity: 1,
      price_data: {
        currency: "eur",
        unit_amount: 18500,
        product_data: { name: "Bois de Shéa", metadata: { produit_id: LIGNES[0].produitId } },
      },
    });
    expect(items[1]).toMatchObject({
      quantity: 2,
      price_data: { currency: "eur", unit_amount: 6200 },
    });
  });

  it("appends a shipping line item only when frais > 0", () => {
    const sansFrais = construireLigneItemsStripe(LIGNES, 0, "EUR");
    expect(sansFrais.some((item) => item.price_data?.product_data?.name === NOM_LIGNE_LIVRAISON)).toBe(false);

    const avecFrais = construireLigneItemsStripe(LIGNES, 6.9, "EUR");
    const ligneLivraison = avecFrais.find((item) => item.price_data?.product_data?.name === NOM_LIGNE_LIVRAISON);
    expect(ligneLivraison).toMatchObject({ quantity: 1, price_data: { unit_amount: 690 } });
  });

  it("never attaches a produit_id to the shipping line (webhook relies on this to filter it out)", () => {
    const items = construireLigneItemsStripe(LIGNES, 6.9, "EUR");
    const ligneLivraison = items.find((item) => item.price_data?.product_data?.name === NOM_LIGNE_LIVRAISON);
    expect(ligneLivraison?.price_data?.product_data?.metadata).toBeUndefined();
  });
});
