import { describe, expect, it } from "vitest";
import { calculerLot } from "./lot";
import type { Formule, LigneFormule } from "./types";

const ligne = (over: Partial<LigneFormule> & Pick<LigneFormule, "id">): LigneFormule => ({
  nomMatiere: over.id,
  pourcentage: 0,
  prixParKg: 10,
  ...over,
});

const formule = (lignes: LigneFormule[]): Formule => ({
  id: "f1",
  nom: "Formule de test",
  maison: "shea",
  type: "parfum",
  lignes,
});

describe("calculerLot", () => {
  it("returns zero weighed grams for an empty formula, with the full target as ecart", () => {
    const feuille = calculerLot(formule([]), 100);
    expect(feuille.lignes).toEqual([]);
    expect(feuille.grammesPeses).toBe(0);
    expect(feuille.ecartGrammes).toBe(100);
  });

  it("splits a batch proportionally to each line's percentage", () => {
    const lignes: LigneFormule[] = [
      ligne({ id: "a", pourcentage: 60 }),
      ligne({ id: "b", pourcentage: 40 }),
    ];
    const feuille = calculerLot(formule(lignes), 200);
    expect(feuille.lignes.find((l) => l.ligneId === "a")!.grammes).toBe(120);
    expect(feuille.lignes.find((l) => l.ligneId === "b")!.grammes).toBe(80);
    expect(feuille.grammesPeses).toBe(200);
    expect(feuille.ecartGrammes).toBe(0);
  });

  it("handles a single-line formula", () => {
    const feuille = calculerLot(formule([ligne({ id: "a", pourcentage: 100 })]), 50);
    expect(feuille.lignes).toHaveLength(1);
    expect(feuille.lignes[0].grammes).toBe(50);
  });

  it("surfaces the drift, rather than normalizing it, when percentages don't sum to 100", () => {
    const lignes: LigneFormule[] = [
      ligne({ id: "a", pourcentage: 30 }),
      ligne({ id: "b", pourcentage: 30 }),
    ];
    const feuille = calculerLot(formule(lignes), 100);
    expect(feuille.grammesPeses).toBe(60);
    expect(feuille.ecartGrammes).toBe(40);
  });

  it("rounds each line's mass to 0.01 g", () => {
    const feuille = calculerLot(formule([ligne({ id: "a", pourcentage: 33.333 })]), 100);
    expect(feuille.lignes[0].grammes).toBe(33.33);
  });

  it("rejects a non-positive batch size", () => {
    expect(() => calculerLot(formule([]), 0)).toThrow(RangeError);
    expect(() => calculerLot(formule([]), -10)).toThrow(RangeError);
  });
});
