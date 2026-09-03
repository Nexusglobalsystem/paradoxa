/**
 * Shared types for the formulation engine. Pure data shapes, no logic here —
 * reused as-is by the Supabase schema (formules / formule_lignes tables) and
 * by the laboratoire UI, so keep this file the single source of truth for
 * what a "formula line" looks like.
 */

/** Golden ratio. The engine's one constant. */
export const PHI = (1 + Math.sqrt(5)) / 2;

/** Tier of the perfume pyramid a line belongs to. */
export type Etage = "fond" | "coeur" | "tete";

/** Phase of a cosmetic formulation (skincare, not perfume). */
export type PhaseCosmetique =
  | "aqueuse"
  | "huileuse"
  | "actifs"
  | "emulsion"
  | "conservation"
  | "parfum";

/**
 * Simplified subset of IFRA product categories relevant to the group's own
 * ranges (fine fragrance for SHÉA, leave-on/rinse-off cosmetics for ÉCLORÉE).
 * IFRA Standards number these 1-12; the comments below map each key to its
 * closest official category for reference. This is not the full standard.
 */
export type CategorieIFRA =
  | "parfum_fin" // catégorie 4 — parfum, eau de parfum, extrait appliqué sur peau
  | "soin_non_rince" // catégorie 5 — crème, huile, lait corporel non rincés
  | "soin_rince" // catégorie 9 — savon, gel douche, produits rincés
  | "usage_capillaire"; // catégorie 7 — produits capillaires, contact peau limité

/** Recognised olfactory families — used to color blocks in the composer UI. */
export type FamilleOlfactive =
  | "agrumes"
  | "florale"
  | "boisee"
  | "orientale"
  | "fougere"
  | "chypree"
  | "aromatique"
  | "epicee"
  | "gourmande"
  | "aquatique"
  | "musquee"
  | "verte";

/** An allergen carried by a raw material (EU cosmetic regulation, Annexe III). */
export interface Allergene {
  nom: string;
  numeroCAS?: string;
}

/**
 * One raw material entry in a formula. `pourcentage` is relative to the
 * formula (or, once equilibrerFormule has run, to its étage) — grams are
 * never stored on a line, they're only ever derived for a specific batch
 * size via calculerLot.
 */
export interface LigneFormule {
  id: string;
  nomMatiere: string;
  /** INCI name of the material itself, when it differs from nomMatiere. */
  inci?: string;
  pourcentage: number;
  /** Set for perfume formula lines (fond/coeur/tête). */
  etage?: Etage;
  /** Set for cosmetic formula lines. */
  phase?: PhaseCosmetique;
  familleOlfactive?: FamilleOlfactive;
  /** Max % allowed in the finished product, per IFRA category. An absent entry for a category means no known restriction, not "no limit". */
  limiteIFRA?: Partial<Record<CategorieIFRA, number>>;
  allergenes?: Allergene[];
  /** Material cost, EUR per kg. */
  prixParKg: number;
}

export type MaisonGroupe = "shea" | "ecloree" | "groupe";
export type TypeFormule = "parfum" | "cosmetique";

/** A formula: identifying metadata plus the lines that compose it. */
export interface Formule {
  id: string;
  nom: string;
  maison: MaisonGroupe;
  type: TypeFormule;
  lignes: LigneFormule[];
}
