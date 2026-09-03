import type { CategorieIFRA, Etage, LigneFormule } from "@/packages/formulation";
import type { MatiereLimiteIfraRow, MatiereRow } from "@/components/laboratoire/types";

/**
 * Matière avec ses seuils IFRA joints — forme consommée par la palette
 * (colonne 1) et par le chargement initial des lignes (page.tsx). Une seule
 * requête (matieres + matiere_limites_ifra imbriquée) alimente les deux.
 */
export interface MatierePalette extends MatiereRow {
  matiere_limites_ifra: MatiereLimiteIfraRow[];
}

function limiteIFRADepuis(matiere: MatierePalette): Partial<Record<CategorieIFRA, number>> {
  const limites: Partial<Record<CategorieIFRA, number>> = {};
  for (const limite of matiere.matiere_limites_ifra) {
    if (limite.seuil_pourcentage !== null) {
      limites[limite.categorie_ifra] = limite.seuil_pourcentage;
    }
  }
  return limites;
}

/**
 * Étage suggéré par défaut lorsqu'une matière est ajoutée à la formule,
 * dérivé de sa volatilité de référence (matieres.volatilite — comportement
 * typique de la matière, voir supabase/migrations/20260903193606_matieres.sql).
 * Reste toujours modifiable ensuite via le sélecteur d'étage du tableau de
 * formulation : ce n'est qu'un point de départ, jamais une règle figée.
 */
export function etageParDefaut(volatilite: MatiereRow["volatilite"]): Etage {
  switch (volatilite) {
    case "tete":
    case "tete_coeur":
      return "tete";
    case "coeur_fond":
    case "fond":
      return "fond";
    case "coeur":
    default:
      return "coeur";
  }
}

/**
 * Pourcentage de départ d'une ligne fraîchement ajoutée à la formule — une
 * valeur arbitraire mais toujours valide (formule_lignes.pourcentage doit
 * être > 0), destinée à être ajustée par édition manuelle ou par
 * "Équilibrer selon φ" juste après l'ajout.
 */
export const POURCENTAGE_INITIAL_LIGNE = 1;

/** Construit une LigneFormule (moteur packages/formulation) à partir d'une matière de la palette. */
export function ligneDepuisMatiere(
  matiere: MatierePalette,
  etage: Etage,
  pourcentage: number = POURCENTAGE_INITIAL_LIGNE,
): LigneFormule {
  return {
    id: matiere.id,
    nomMatiere: matiere.nom,
    inci: matiere.inci ?? undefined,
    pourcentage,
    etage,
    familleOlfactive: matiere.famille_olfactive,
    limiteIFRA: limiteIFRADepuis(matiere),
    allergenes: matiere.donnees_complementaires.allergenes ?? [],
    prixParKg: matiere.prix_kg,
  };
}

export function formatPrix(prix: number): string {
  return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(prix);
}
