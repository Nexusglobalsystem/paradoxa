import { describe, expect, it } from "vitest";
import { genererINCI } from "./inci";
import type { LigneFormule } from "./types";

const ligne = (over: Partial<LigneFormule> & Pick<LigneFormule, "id">): LigneFormule => ({
  nomMatiere: over.id,
  pourcentage: 0,
  prixParKg: 10,
  ...over,
});

describe("genererINCI", () => {
  it("returns an empty array for an empty formula", () => {
    expect(genererINCI([])).toEqual([]);
  });

  it("sorts ingredients ≥1% by descending concentration", () => {
    const lignes: LigneFormule[] = [
      ligne({ id: "aqua", inci: "Aqua", pourcentage: 70, phase: "aqueuse" }),
      ligne({ id: "karite", inci: "Butyrospermum Parkii Butter", pourcentage: 20, phase: "huileuse" }),
      ligne({ id: "glycerine", inci: "Glycerin", pourcentage: 5, phase: "actifs" }),
    ];
    expect(genererINCI(lignes)).toEqual([
      "Aqua",
      "Butyrospermum Parkii Butter",
      "Glycerin",
    ]);
  });

  it("moves ingredients <1% to an alphabetical block after the major ones", () => {
    const lignes: LigneFormule[] = [
      ligne({ id: "aqua", inci: "Aqua", pourcentage: 90, phase: "aqueuse" }),
      ligne({ id: "z", inci: "Zinc Oxide", pourcentage: 0.5, phase: "actifs" }),
      ligne({ id: "a", inci: "Ascorbic Acid", pourcentage: 0.5, phase: "actifs" }),
    ];
    expect(genererINCI(lignes)).toEqual(["Aqua", "Ascorbic Acid", "Zinc Oxide"]);
  });

  it("folds perfume lines into a single Parfum entry positioned by combined weight", () => {
    const lignes: LigneFormule[] = [
      ligne({ id: "aqua", inci: "Aqua", pourcentage: 80, phase: "aqueuse" }),
      ligne({ id: "karite", inci: "Butyrospermum Parkii Butter", pourcentage: 15, phase: "huileuse" }),
      ligne({ id: "bergamote", pourcentage: 3, etage: "tete" }),
      ligne({ id: "musc", pourcentage: 2, etage: "fond" }),
    ];
    // Parfum = 3 + 2 = 5%, which slots it between karité (15%) and nothing else.
    expect(genererINCI(lignes)).toEqual([
      "Aqua",
      "Butyrospermum Parkii Butter",
      "Parfum",
    ]);
  });

  it("appends the fragrance's allergens, alphabetically, after everything else", () => {
    const lignes: LigneFormule[] = [
      ligne({ id: "aqua", inci: "Aqua", pourcentage: 95, phase: "aqueuse" }),
      ligne({
        id: "bergamote",
        pourcentage: 3,
        etage: "tete",
        allergenes: [{ nom: "Limonene" }],
      }),
      ligne({
        id: "musc",
        pourcentage: 2,
        etage: "fond",
        allergenes: [{ nom: "Coumarin" }],
      }),
    ];
    expect(genererINCI(lignes)).toEqual(["Aqua", "Parfum", "Coumarin", "Limonene"]);
  });

  it("does not duplicate an allergen that is already listed as its own ingredient", () => {
    const lignes: LigneFormule[] = [
      ligne({ id: "aqua", inci: "Aqua", pourcentage: 90, phase: "aqueuse" }),
      ligne({ id: "limonene-pur", inci: "Limonene", pourcentage: 3, phase: "actifs" }),
      ligne({
        id: "bergamote",
        pourcentage: 2,
        etage: "tete",
        allergenes: [{ nom: "Limonene" }],
      }),
    ];
    const resultat = genererINCI(lignes);
    expect(resultat.filter((n) => n === "Limonene")).toHaveLength(1);
  });

  it("falls back to nomMatiere when no inci name is given", () => {
    const lignes: LigneFormule[] = [ligne({ id: "aqua", pourcentage: 50, phase: "aqueuse" })];
    expect(genererINCI(lignes)).toEqual(["aqua"]);
  });
});
