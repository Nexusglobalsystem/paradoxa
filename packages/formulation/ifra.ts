import type { CategorieIFRA, LigneFormule } from "./types";

export interface DepassementIFRA {
  ligneId: string;
  nomMatiere: string;
  categorie: CategorieIFRA;
  pourcentageDansProduitFini: number;
  limiteAutorisee: number;
  /** Points de pourcentage au-dessus de la limite. */
  depassement: number;
}

/**
 * Flags every line whose concentration in the FINISHED product exceeds its
 * IFRA limit for `categorie`. `concentration` is the % of the compound
 * described by `lignes` in the finished product — e.g. an EDP diluted to
 * 18% means a line at 10% of the compound sits at 1.8% of the finished
 * product.
 *
 * A line with no recorded limit for `categorie` is treated as unrestricted
 * (no known IFRA data), never as a violation.
 */
export function verifierIFRA(
  lignes: LigneFormule[],
  concentration: number,
  categorie: CategorieIFRA
): DepassementIFRA[] {
  if (concentration < 0 || concentration > 100) {
    throw new RangeError(
      `verifierIFRA: concentration doit être comprise entre 0 et 100, reçu ${concentration}`
    );
  }

  const depassements: DepassementIFRA[] = [];
  for (const ligne of lignes) {
    const limite = ligne.limiteIFRA?.[categorie];
    if (limite === undefined) continue;

    const pourcentageDansProduitFini = (ligne.pourcentage * concentration) / 100;
    if (pourcentageDansProduitFini > limite) {
      depassements.push({
        ligneId: ligne.id,
        nomMatiere: ligne.nomMatiere,
        categorie,
        pourcentageDansProduitFini,
        limiteAutorisee: limite,
        depassement: pourcentageDansProduitFini - limite,
      });
    }
  }
  return depassements;
}
