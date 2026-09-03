import type { LigneFormule } from "./types";

export interface AllergeneAgrege {
  nom: string;
  numeroCAS?: string;
  /** Somme des % des matières porteuses — un majorant, pas la concentration exacte de l'allergène dans le produit fini. */
  pourcentageCumule: number;
  matieresSources: string[];
}

/**
 * Deduplicated list of allergens carried by the formula's lines, matched
 * case-insensitively on name. Sorted alphabetically for a stable, readable
 * output.
 */
export function listeAllergenes(lignes: LigneFormule[]): AllergeneAgrege[] {
  const parNom = new Map<string, AllergeneAgrege>();

  for (const ligne of lignes) {
    for (const allergene of ligne.allergenes ?? []) {
      const cle = allergene.nom.trim().toLowerCase();
      const existant = parNom.get(cle);
      if (existant) {
        existant.pourcentageCumule += ligne.pourcentage;
        existant.matieresSources.push(ligne.nomMatiere);
        existant.numeroCAS ??= allergene.numeroCAS;
      } else {
        parNom.set(cle, {
          nom: allergene.nom,
          numeroCAS: allergene.numeroCAS,
          pourcentageCumule: ligne.pourcentage,
          matieresSources: [ligne.nomMatiere],
        });
      }
    }
  }

  return [...parNom.values()].sort((a, b) => a.nom.localeCompare(b.nom, "fr"));
}
