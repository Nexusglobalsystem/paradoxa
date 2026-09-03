import { describe, expect, it } from "vitest";
import { listeAllergenes } from "./allergenes";
import type { LigneFormule } from "./types";

const ligne = (over: Partial<LigneFormule> & Pick<LigneFormule, "id">): LigneFormule => ({
  nomMatiere: over.id,
  pourcentage: 0,
  prixParKg: 10,
  ...over,
});

describe("listeAllergenes", () => {
  it("returns an empty array for an empty formula", () => {
    expect(listeAllergenes([])).toEqual([]);
  });

  it("returns an empty array when no line carries an allergen", () => {
    const lignes: LigneFormule[] = [ligne({ id: "sans-allergene", pourcentage: 10 })];
    expect(listeAllergenes(lignes)).toEqual([]);
  });

  it("deduplicates the same allergen carried by two materials, case-insensitively", () => {
    const lignes: LigneFormule[] = [
      ligne({ id: "citron", pourcentage: 5, allergenes: [{ nom: "Limonene" }] }),
      ligne({ id: "orange", pourcentage: 3, allergenes: [{ nom: "limonene" }] }),
    ];
    const resultat = listeAllergenes(lignes);
    expect(resultat).toHaveLength(1);
    expect(resultat[0].pourcentageCumule).toBeCloseTo(8, 9);
    expect(resultat[0].matieresSources).toEqual(["citron", "orange"]);
  });

  it("sorts distinct allergens alphabetically", () => {
    const lignes: LigneFormule[] = [
      ligne({ id: "a", pourcentage: 1, allergenes: [{ nom: "Linalol" }] }),
      ligne({ id: "b", pourcentage: 1, allergenes: [{ nom: "Citral" }] }),
    ];
    const resultat = listeAllergenes(lignes);
    expect(resultat.map((a) => a.nom)).toEqual(["Citral", "Linalol"]);
  });

  it("keeps the CAS number when present", () => {
    const lignes: LigneFormule[] = [
      ligne({
        id: "a",
        pourcentage: 1,
        allergenes: [{ nom: "Eugenol", numeroCAS: "97-53-0" }],
      }),
    ];
    expect(listeAllergenes(lignes)[0].numeroCAS).toBe("97-53-0");
  });
});
