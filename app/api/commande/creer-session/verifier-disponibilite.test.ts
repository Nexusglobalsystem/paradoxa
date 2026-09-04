import { describe, expect, it } from "vitest";

import type { ProduitDisponible } from "./verifier-disponibilite";
import { verifierEtConstruireLignes } from "./verifier-disponibilite";

const BOIS_DE_SHEA: ProduitDisponible = {
  id: "a5e0e957-5b58-43af-8378-d0fc0b432946",
  nom: "Bois de Shéa",
  prix: 185,
  devise: "EUR",
  stock: 42,
  statut: "actif",
};

const COFFRET_EPUISE: ProduitDisponible = {
  id: "7098f8eb-a772-4526-87de-798962c50c5c",
  nom: "Coffret Cinq Escales",
  prix: 29,
  devise: "EUR",
  stock: 0,
  statut: "epuise",
};

function versMap(...produits: ProduitDisponible[]) {
  return new Map(produits.map((p) => [p.id, p]));
}

describe("verifierEtConstruireLignes", () => {
  it("builds lines using the server-read price, never a client-supplied one", () => {
    const resultat = verifierEtConstruireLignes(
      [{ produitId: BOIS_DE_SHEA.id, quantite: 2 }],
      versMap(BOIS_DE_SHEA),
    );

    expect(resultat.ok).toBe(true);
    if (resultat.ok) {
      expect(resultat.lignes).toEqual([
        { produitId: BOIS_DE_SHEA.id, nom: "Bois de Shéa", prixUnitaire: 185, quantite: 2 },
      ]);
    }
  });

  it("rejects a produitId absent from the database", () => {
    const resultat = verifierEtConstruireLignes(
      [{ produitId: "00000000-0000-0000-0000-000000000000", quantite: 1 }],
      versMap(BOIS_DE_SHEA),
    );

    expect(resultat.ok).toBe(false);
    if (!resultat.ok) {
      expect(resultat.problemes).toEqual([
        { produitId: "00000000-0000-0000-0000-000000000000", raison: "introuvable" },
      ]);
    }
  });

  it("rejects a product that is not statut=actif (draft, archived, épuisé…)", () => {
    const resultat = verifierEtConstruireLignes(
      [{ produitId: COFFRET_EPUISE.id, quantite: 1 }],
      versMap(COFFRET_EPUISE),
    );

    expect(resultat.ok).toBe(false);
    if (!resultat.ok) {
      expect(resultat.problemes).toEqual([{ produitId: COFFRET_EPUISE.id, raison: "indisponible" }]);
    }
  });

  it("rejects a quantity greater than the available stock, reporting how many remain", () => {
    const resultat = verifierEtConstruireLignes(
      [{ produitId: BOIS_DE_SHEA.id, quantite: 100 }],
      versMap(BOIS_DE_SHEA),
    );

    expect(resultat.ok).toBe(false);
    if (!resultat.ok) {
      expect(resultat.problemes).toEqual([
        { produitId: BOIS_DE_SHEA.id, raison: "stock_insuffisant", stockDisponible: 42 },
      ]);
    }
  });

  it("collects every problem across a multi-line cart rather than stopping at the first", () => {
    const resultat = verifierEtConstruireLignes(
      [
        { produitId: BOIS_DE_SHEA.id, quantite: 200 },
        { produitId: COFFRET_EPUISE.id, quantite: 1 },
      ],
      versMap(BOIS_DE_SHEA, COFFRET_EPUISE),
    );

    expect(resultat.ok).toBe(false);
    if (!resultat.ok) {
      expect(resultat.problemes).toHaveLength(2);
    }
  });
});
