import type { Etage } from "@/packages/formulation";

/**
 * Taux de dilution du concentré dans le produit fini, par type de
 * concentration — repris tel quel de composeur_de_parfum_laboratoire_la_paradoxa
 * /code.html (switch EDT 12% / EDP 18% / EXTRAIT 28%). C'est ce taux qui sert
 * de `concentration` à verifierIFRA : le % d'une ligne dans le CONCENTRÉ n'est
 * pas son % dans le flacon fini, IFRA raisonne sur le produit fini.
 */
export const CONCENTRATION_PAR_TYPE: Record<"edt" | "edp" | "extrait", number> = {
  edt: 12,
  edp: 18,
  extrait: 28,
};

export const LIBELLE_CONCENTRATION: Record<"edt" | "edp" | "extrait", string> = {
  edt: "Eau de Toilette",
  edp: "Eau de Parfum",
  extrait: "Extrait",
};

/**
 * Catégorie IFRA vérifiée par le composeur de parfum — "4" (Parfumerie fine,
 * Eaux de Parfum, Extraits), la seule catégorie pertinente pour un parfum fini
 * type SHÉA (voir packages/formulation/types.ts, doc de CategorieIFRA).
 */
export const CATEGORIE_IFRA_PARFUM = "4";

export const ORDRE_ETAGES: Etage[] = ["tete", "coeur", "fond"];

export const LIBELLE_ETAGE: Record<Etage, string> = {
  tete: "Tête",
  coeur: "Cœur",
  fond: "Fond",
};

/** Correspond à REPARTITION_ETAGES de packages/formulation/equilibrer-formule.ts. */
export const PART_ETAGE: Record<Etage, number> = {
  fond: 50,
  coeur: 31,
  tete: 19,
};
