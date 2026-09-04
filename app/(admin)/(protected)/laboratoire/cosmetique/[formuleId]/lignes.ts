import type { LigneFormule, PhaseCosmetique } from "@/packages/formulation";
import type { MatiereRow } from "@/components/laboratoire/types";

/**
 * Matière consommée par le composeur cosmétique — contrairement au
 * composeur de parfum, aucune jointure matiere_limites_ifra n'est
 * nécessaire ici : l'écran 34 (design/INVENTAIRE.md) ne porte pas de
 * panneau de contrôle IFRA, seulement INCI / bienfaits / pH / coût. Simple
 * alias plutôt qu'une interface dédiée, donc.
 */
export type MatierePalette = MatiereRow;

/**
 * Phase par défaut à l'ajout d'une matière au composeur. Contrairement au
 * parfum, où matieres.volatilite permet de suggérer un étage (voir
 * etageParDefaut du composeur de parfum), le schéma ne porte aucune donnée
 * de "phase cosmétique typique" pour une matière — rien ne permet de
 * deviner si un actif est de nature aqueuse, huileuse, thermolabile...
 * Le point de départ ne peut donc être qu'un choix neutre et jamais figé :
 * "ajouts", la dernière étape de formulation (température ambiante,
 * incorporation simple), à reclasser ensuite via le sélecteur de phase de
 * chaque ligne du tableau de formulation.
 */
export function phaseParDefaut(): PhaseCosmetique {
  return "ajouts";
}

/**
 * Pourcentage de départ d'une ligne fraîchement ajoutée — valeur arbitraire
 * mais toujours valide (formule_lignes.pourcentage doit être > 0), destinée
 * à être ajustée par édition manuelle juste après l'ajout. Même convention
 * que le composeur de parfum.
 */
export const POURCENTAGE_INITIAL_LIGNE = 1;

/** Construit une LigneFormule (moteur packages/formulation) à partir d'une matière de la palette. */
export function ligneDepuisMatiere(
  matiere: MatierePalette,
  phase: PhaseCosmetique,
  pourcentage: number = POURCENTAGE_INITIAL_LIGNE,
): LigneFormule {
  return {
    id: matiere.id,
    nomMatiere: matiere.nom,
    inci: matiere.inci ?? undefined,
    pourcentage,
    phase,
    familleOlfactive: matiere.famille_olfactive,
    allergenes: matiere.donnees_complementaires.allergenes ?? [],
    prixParKg: matiere.prix_kg,
  };
}

/** Tags de bienfaits déclarés pour une matière (voir DonneesComplementaires.bienfaits). */
export function bienfaitsDe(matiere: MatierePalette): string[] {
  return matiere.donnees_complementaires.bienfaits ?? [];
}

export function formatPrix(prix: number): string {
  return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(prix);
}
