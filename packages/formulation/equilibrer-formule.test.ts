import { describe, expect, it } from "vitest";
import { equilibrerFormule, REPARTITION_ETAGES } from "./equilibrer-formule";
import type { LigneFormule } from "./types";

const ligne = (over: Partial<LigneFormule> & Pick<LigneFormule, "id">): LigneFormule => ({
  nomMatiere: over.id,
  pourcentage: 0,
  prixParKg: 10,
  ...over,
});

describe("equilibrerFormule", () => {
  it("returns an empty array for an empty formula", () => {
    expect(equilibrerFormule([])).toEqual([]);
  });

  it("splits three full étages 50/31/19 in total", () => {
    const lignes: LigneFormule[] = [
      ligne({ id: "bois-cedre", etage: "fond" }),
      ligne({ id: "patchouli", etage: "fond" }),
      ligne({ id: "rose", etage: "coeur" }),
      ligne({ id: "bergamote", etage: "tete" }),
    ];
    const resultat = equilibrerFormule(lignes);

    const total = (etage: string) =>
      resultat.filter((l) => l.etage === etage).reduce((a, l) => a + l.pourcentage, 0);
    expect(total("fond")).toBeCloseTo(REPARTITION_ETAGES.fond, 6);
    expect(total("coeur")).toBeCloseTo(REPARTITION_ETAGES.coeur, 6);
    expect(total("tete")).toBeCloseTo(REPARTITION_ETAGES.tete, 6);

    const grandTotal = resultat.reduce((a, l) => a + l.pourcentage, 0);
    expect(grandTotal).toBeCloseTo(100, 6);
  });

  it("gives a single-line étage the whole étage total", () => {
    const lignes: LigneFormule[] = [ligne({ id: "iris", etage: "coeur" })];
    const [resultat] = equilibrerFormule(lignes);
    expect(resultat.pourcentage).toBeCloseTo(REPARTITION_ETAGES.coeur, 6);
  });

  it("makes the first line of an étage dominant over the following ones", () => {
    const lignes: LigneFormule[] = [
      ligne({ id: "cedre", etage: "fond" }),
      ligne({ id: "vetiver", etage: "fond" }),
      ligne({ id: "mousse", etage: "fond" }),
    ];
    const [cedre, vetiver, mousse] = equilibrerFormule(lignes);
    expect(cedre.pourcentage).toBeGreaterThan(vetiver.pourcentage);
    expect(vetiver.pourcentage).toBeGreaterThan(mousse.pourcentage);
  });

  it("ignores input percentages that don't sum to 100 and recomputes them", () => {
    const lignes: LigneFormule[] = [
      ligne({ id: "a", etage: "fond", pourcentage: 5 }),
      ligne({ id: "b", etage: "tete", pourcentage: 5 }),
    ];
    const resultat = equilibrerFormule(lignes);
    const total = resultat.reduce((a, l) => a + l.pourcentage, 0);
    expect(total).toBeCloseTo(REPARTITION_ETAGES.fond + REPARTITION_ETAGES.tete, 6);
  });

  it("passes cosmetic phase lines through untouched", () => {
    const lignes: LigneFormule[] = [
      ligne({ id: "karite", phase: "huileuse", pourcentage: 42 }),
      ligne({ id: "bergamote", etage: "tete" }),
    ];
    const resultat = equilibrerFormule(lignes);
    const karite = resultat.find((l) => l.id === "karite")!;
    expect(karite.pourcentage).toBe(42);
  });
});
