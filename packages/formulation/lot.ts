import type { Formule } from "./types";

export interface LigneDePesee {
  ligneId: string;
  nomMatiere: string;
  pourcentage: number;
  grammes: number;
}

export interface FeuilleDePesee {
  grammesCibles: number;
  lignes: LigneDePesee[];
  grammesPeses: number;
  /** grammesCibles - grammesPeses : dérive due à l'arrondi, ou à une formule dont la somme des % ≠ 100. */
  ecartGrammes: number;
}

const arrondi2 = (n: number) => Math.round(n * 100) / 100;

/**
 * Produces the weighing sheet for a batch of `grammes` of `formule`: each
 * line's mass, rounded to 0.01 g (lab scale precision).
 *
 * Doesn't assume the lines' percentages sum to 100 — `ecartGrammes` surfaces
 * any drift instead of silently normalizing it away, so a malformed formula
 * shows up on the sheet before anything is weighed.
 */
export function calculerLot(formule: Formule, grammes: number): FeuilleDePesee {
  if (grammes <= 0) {
    throw new RangeError(`calculerLot: grammes doit être positif, reçu ${grammes}`);
  }

  const lignesPesee: LigneDePesee[] = formule.lignes.map((ligne) => ({
    ligneId: ligne.id,
    nomMatiere: ligne.nomMatiere,
    pourcentage: ligne.pourcentage,
    grammes: arrondi2((ligne.pourcentage / 100) * grammes),
  }));

  const grammesPeses = arrondi2(lignesPesee.reduce((acc, l) => acc + l.grammes, 0));

  return {
    grammesCibles: grammes,
    lignes: lignesPesee,
    grammesPeses,
    ecartGrammes: arrondi2(grammes - grammesPeses),
  };
}
