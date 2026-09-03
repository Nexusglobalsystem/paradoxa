import { listeAllergenes } from "./allergenes";
import type { LigneFormule } from "./types";

/** En dessous de ce seuil, l'ordre alphabétique est autorisé (réglementation cosmétique UE). */
const SEUIL_ORDRE_LIBRE = 1;
const NOM_PARFUM = "Parfum";

interface EntreeINCI {
  nom: string;
  pourcentage: number;
}

/**
 * Builds the INCI ingredient list: descending order by concentration for
 * ingredients ≥1%, alphabetical order for those <1% (both allowed by EU
 * cosmetic regulation), then the fragrance's allergens by name, at the very
 * end.
 *
 * Perfume lines (those carrying an `etage`) are folded into a single
 * "Parfum" entry positioned by their combined weight, since a fragrance
 * compound is disclosed as one INCI ingredient — its individual allergens
 * are what get listed separately at the end.
 */
export function genererINCI(lignes: LigneFormule[]): string[] {
  const lignesParfum = lignes.filter((l) => l.etage !== undefined);
  const lignesAutres = lignes.filter((l) => l.etage === undefined);

  const entrees: EntreeINCI[] = lignesAutres.map((l) => ({
    nom: l.inci ?? l.nomMatiere,
    pourcentage: l.pourcentage,
  }));

  if (lignesParfum.length > 0) {
    entrees.push({
      nom: NOM_PARFUM,
      pourcentage: lignesParfum.reduce((acc, l) => acc + l.pourcentage, 0),
    });
  }

  const majeurs = entrees
    .filter((e) => e.pourcentage >= SEUIL_ORDRE_LIBRE)
    .sort((a, b) => b.pourcentage - a.pourcentage || a.nom.localeCompare(b.nom, "fr"));
  const mineurs = entrees
    .filter((e) => e.pourcentage < SEUIL_ORDRE_LIBRE)
    .sort((a, b) => a.nom.localeCompare(b.nom, "fr"));

  const nomsDejaListes = new Set(entrees.map((e) => e.nom.toLowerCase()));
  const allergenesParfum = listeAllergenes(lignesParfum)
    .filter((a) => !nomsDejaListes.has(a.nom.toLowerCase()))
    .map((a) => a.nom);

  return [...majeurs, ...mineurs].map((e) => e.nom).concat(allergenesParfum);
}
