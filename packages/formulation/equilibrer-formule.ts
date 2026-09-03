import { repartitionPhi } from "./repartition-phi";
import type { Etage, LigneFormule } from "./types";

/** Fixed share of the finished perfume owned by each pyramid tier. Sums to 100. */
export const REPARTITION_ETAGES: Record<Etage, number> = {
  fond: 50,
  coeur: 31,
  tete: 19,
};

const ORDRE_ETAGES: Etage[] = ["fond", "coeur", "tete"];

/**
 * Rebalances a perfume formula: each étage (fond/coeur/tête) is sized to its
 * fixed share of the whole (50/31/19), and within each étage its lines are
 * weighted by golden-ratio decay (repartitionPhi, i.e. 1 / 0.618 / 0.382 …)
 * in the order they're given — the first line of an étage is its dominant
 * note.
 *
 * Lines without an `etage` (cosmetic phase lines) are returned unchanged:
 * this function only rebalances the perfume pyramid. Existing `pourcentage`
 * values on perfume lines are ignored and fully recomputed — this is how it
 * copes with a formula whose input percentages don't sum to 100.
 */
export function equilibrerFormule(lignes: LigneFormule[]): LigneFormule[] {
  const parEtage = new Map<Etage, LigneFormule[]>(ORDRE_ETAGES.map((e) => [e, []]));
  for (const ligne of lignes) {
    if (ligne.etage) parEtage.get(ligne.etage)!.push(ligne);
  }

  const poidsParLigneId = new Map<string, number>();
  for (const etage of ORDRE_ETAGES) {
    const lignesEtage = parEtage.get(etage)!;
    const poids = repartitionPhi(lignesEtage.length, REPARTITION_ETAGES[etage]);
    lignesEtage.forEach((ligne, i) => poidsParLigneId.set(ligne.id, poids[i]));
  }

  return lignes.map((ligne) =>
    ligne.etage ? { ...ligne, pourcentage: poidsParLigneId.get(ligne.id)! } : ligne
  );
}
