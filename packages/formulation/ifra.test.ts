import { describe, expect, it } from "vitest";
import { verifierIFRA } from "./ifra";
import type { LigneFormule } from "./types";

const ligne = (over: Partial<LigneFormule> & Pick<LigneFormule, "id">): LigneFormule => ({
  nomMatiere: over.id,
  pourcentage: 0,
  prixParKg: 10,
  ...over,
});

describe("verifierIFRA", () => {
  it("returns no depassement for an empty formula", () => {
    expect(verifierIFRA([], 20, "parfum_fin")).toEqual([]);
  });

  it("flags a line above its limit once diluted to the finished product", () => {
    const lignes: LigneFormule[] = [
      ligne({ id: "oakmoss", pourcentage: 10, limiteIFRA: { parfum_fin: 1 } }),
    ];
    // 10% of a compound diluted to 20% concentration = 2% in the finished product > 1% limit.
    const depassements = verifierIFRA(lignes, 20, "parfum_fin");
    expect(depassements).toHaveLength(1);
    expect(depassements[0]).toMatchObject({
      ligneId: "oakmoss",
      pourcentageDansProduitFini: 2,
      limiteAutorisee: 1,
      depassement: 1,
    });
  });

  it("does not flag a line within its limit", () => {
    const lignes: LigneFormule[] = [
      ligne({ id: "linalol", pourcentage: 2, limiteIFRA: { parfum_fin: 5 } }),
    ];
    expect(verifierIFRA(lignes, 20, "parfum_fin")).toEqual([]);
  });

  it("treats a material with no recorded limit as unrestricted, not a violation", () => {
    const lignes: LigneFormule[] = [ligne({ id: "sans-limite", pourcentage: 90 })];
    expect(verifierIFRA(lignes, 100, "parfum_fin")).toEqual([]);
  });

  it("checks the limit for the requested category only", () => {
    const lignes: LigneFormule[] = [
      ligne({
        id: "citral",
        pourcentage: 10,
        limiteIFRA: { parfum_fin: 1, soin_non_rince: 20 },
      }),
    ];
    // Same material, same dose: over limit for parfum_fin, fine for soin_non_rince.
    expect(verifierIFRA(lignes, 20, "parfum_fin")).toHaveLength(1);
    expect(verifierIFRA(lignes, 20, "soin_non_rince")).toEqual([]);
  });

  it("rejects a concentration outside 0-100", () => {
    expect(() => verifierIFRA([], -1, "parfum_fin")).toThrow(RangeError);
    expect(() => verifierIFRA([], 101, "parfum_fin")).toThrow(RangeError);
  });
});
