import { describe, expect, it } from "vitest";

import {
  arrondirMontant,
  calculerFraisLivraison,
  calculerSousTotal,
  calculerTotal,
  FRAIS_LIVRAISON_STANDARD_EUR,
  montantRestantAvantLivraisonOfferte,
  SEUIL_LIVRAISON_OFFERTE_EUR,
  verifierDeviseUniforme,
} from "./calculs";

describe("calculerSousTotal", () => {
  it("sums unit price times quantity across lines", () => {
    expect(
      calculerSousTotal([
        { prixUnitaire: 185, quantite: 1 },
        { prixUnitaire: 54, quantite: 1 },
        { prixUnitaire: 29, quantite: 1 },
      ]),
    ).toBe(268);
  });

  it("returns 0 for an empty cart", () => {
    expect(calculerSousTotal([])).toBe(0);
  });

  it("avoids floating point residue (0.1 + 0.2 class of bug)", () => {
    expect(calculerSousTotal([{ prixUnitaire: 0.1, quantite: 1 }, { prixUnitaire: 0.2, quantite: 1 }])).toBe(0.3);
  });

  it("multiplies quantity correctly", () => {
    expect(calculerSousTotal([{ prixUnitaire: 62, quantite: 3 }])).toBe(186);
  });
});

describe("calculerFraisLivraison", () => {
  it("charges the standard fee below the free-shipping threshold", () => {
    expect(calculerFraisLivraison(54)).toBe(FRAIS_LIVRAISON_STANDARD_EUR);
  });

  it("is free exactly at the threshold", () => {
    expect(calculerFraisLivraison(SEUIL_LIVRAISON_OFFERTE_EUR)).toBe(0);
  });

  it("is free above the threshold", () => {
    expect(calculerFraisLivraison(268)).toBe(0);
  });

  it("is free for an empty/zero cart (no shipping charge with nothing to ship)", () => {
    expect(calculerFraisLivraison(0)).toBe(0);
  });

  it("honors a custom threshold/fee", () => {
    expect(calculerFraisLivraison(50, { seuil: 100, frais: 10 })).toBe(10);
    expect(calculerFraisLivraison(120, { seuil: 100, frais: 10 })).toBe(0);
  });
});

describe("calculerTotal", () => {
  it("adds subtotal and shipping", () => {
    expect(calculerTotal(268, 0)).toBe(268);
    expect(calculerTotal(54, 6.9)).toBe(60.9);
  });
});

describe("verifierDeviseUniforme", () => {
  it("returns the currency when every line agrees", () => {
    expect(verifierDeviseUniforme(["EUR", "EUR", "EUR"])).toBe("EUR");
  });

  it("returns null when currencies are mixed", () => {
    expect(verifierDeviseUniforme(["EUR", "XOF"])).toBeNull();
  });

  it("returns null for an empty list (nothing to charge)", () => {
    expect(verifierDeviseUniforme([])).toBeNull();
  });
});

describe("montantRestantAvantLivraisonOfferte", () => {
  it("returns the remaining amount below the threshold", () => {
    expect(montantRestantAvantLivraisonOfferte(54)).toBe(26);
  });

  it("never goes negative once the threshold is reached", () => {
    expect(montantRestantAvantLivraisonOfferte(268)).toBe(0);
  });
});

describe("arrondirMontant", () => {
  it("rounds to 2 decimal places", () => {
    expect(arrondirMontant(19.999)).toBe(20);
    expect(arrondirMontant(1 / 3)).toBe(0.33);
  });
});
