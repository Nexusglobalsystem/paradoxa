import { describe, expect, it } from "vitest";
import { calculerCout } from "./cout";
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
  maison: "ecloree",
  type: "cosmetique",
  lignes,
});

describe("calculerCout", () => {
  it("costs zero for an empty formula", () => {
    const cout = calculerCout(formule([]), { nom: "50 ml", contenanceMl: 50 });
    expect(cout.coutParKg).toBe(0);
    expect(cout.coutParFlacon).toBe(0);
  });

  it("computes a weighted average cost per kg", () => {
    const lignes: LigneFormule[] = [
      ligne({ id: "a", pourcentage: 50, prixParKg: 100 }),
      ligne({ id: "b", pourcentage: 50, prixParKg: 20 }),
    ];
    // 0.5*100 + 0.5*20 = 60 €/kg
    const cout = calculerCout(formule(lignes), { nom: "test", contenanceMl: 1000 });
    expect(cout.coutParKg).toBe(60);
  });

  it("derives grams per bottle from volume and density, defaulting density to 1", () => {
    const cout = calculerCout(formule([ligne({ id: "a", pourcentage: 100, prixParKg: 50 })]), {
      nom: "50 ml",
      contenanceMl: 50,
    });
    expect(cout.grammesParFlacon).toBe(50);
    expect(cout.coutParFlacon).toBe(2.5); // 50 €/kg * 50 g / 1000
  });

  it("honors an explicit density", () => {
    const cout = calculerCout(formule([ligne({ id: "a", pourcentage: 100, prixParKg: 10 })]), {
      nom: "100 ml, huile",
      contenanceMl: 100,
      densite: 0.9,
    });
    expect(cout.grammesParFlacon).toBe(90);
  });

  it("still prices a formula whose percentages don't sum to 100", () => {
    const lignes: LigneFormule[] = [ligne({ id: "a", pourcentage: 30, prixParKg: 100 })];
    const cout = calculerCout(formule(lignes), { nom: "test", contenanceMl: 1000 });
    expect(cout.coutParKg).toBe(30); // 0.3 * 100, no forced normalization to 100%
  });

  it("rejects a non-positive contenanceMl", () => {
    expect(() => calculerCout(formule([]), { nom: "x", contenanceMl: 0 })).toThrow(RangeError);
  });
});
