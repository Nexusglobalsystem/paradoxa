import { describe, expect, it } from "vitest";

import { decrementerStock, type StockRepository } from "./decrementer-stock";

/** Dépôt en mémoire — permet de simuler un conflit concurrent sans base réelle. */
function creerFauxDepot(stockInitial: Record<string, number>) {
  const stocks = { ...stockInitial };
  const appelsEcriture: Array<{ produitId: string; stockAttendu: number; nouveauStock: number }> = [];
  let conflitsRestants = 0;

  const depot: StockRepository = {
    async lireStock(produitId) {
      return produitId in stocks ? stocks[produitId] : null;
    },
    async ecrireStockSiInchange(produitId, stockAttendu, nouveauStock) {
      appelsEcriture.push({ produitId, stockAttendu, nouveauStock });
      if (conflitsRestants > 0) {
        conflitsRestants -= 1;
        // Simule une écriture concurrente : le stock a changé entre la
        // lecture et l'écriture, donc la nôtre échoue (verrou optimiste).
        return false;
      }
      if (stocks[produitId] !== stockAttendu) return false;
      stocks[produitId] = nouveauStock;
      return true;
    },
  };

  return { depot, stocks, appelsEcriture, simulerConflits: (n: number) => (conflitsRestants = n) };
}

describe("decrementerStock", () => {
  it("decrements normally when there is no concurrency", async () => {
    const { depot, stocks } = creerFauxDepot({ "prod-1": 42 });

    const resultat = await decrementerStock(depot, "prod-1", 2);

    expect(resultat).toEqual({ ok: true, nouveauStock: 40 });
    expect(stocks["prod-1"]).toBe(40);
  });

  it("never goes below 0 even if the requested quantity exceeds stock", async () => {
    const { depot, stocks } = creerFauxDepot({ "prod-1": 1 });

    const resultat = await decrementerStock(depot, "prod-1", 5);

    expect(resultat).toEqual({ ok: true, nouveauStock: 0 });
    expect(stocks["prod-1"]).toBe(0);
  });

  it("reports produit_introuvable when the product no longer exists", async () => {
    const { depot } = creerFauxDepot({});

    const resultat = await decrementerStock(depot, "prod-inconnu", 1);

    expect(resultat).toEqual({ ok: false, raison: "produit_introuvable" });
  });

  it("retries on a concurrent write conflict and eventually succeeds", async () => {
    const { depot, stocks, simulerConflits, appelsEcriture } = creerFauxDepot({ "prod-1": 10 });
    simulerConflits(2); // les 2 premières tentatives d'écriture échouent

    const resultat = await decrementerStock(depot, "prod-1", 3);

    expect(resultat).toEqual({ ok: true, nouveauStock: 7 });
    expect(stocks["prod-1"]).toBe(7);
    expect(appelsEcriture.length).toBeGreaterThanOrEqual(3); // 2 conflits + 1 succès
  });

  it("gives up after tentativesMax consecutive conflicts", async () => {
    const { depot, simulerConflits } = creerFauxDepot({ "prod-1": 10 });
    simulerConflits(100); // conflit permanent

    const resultat = await decrementerStock(depot, "prod-1", 1, 3);

    expect(resultat).toEqual({ ok: false, raison: "trop_de_conflits" });
  });
});
