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

/**
 * Phase of a cosmetic formulation (skincare, not perfume). Matches
 * `formule_lignes.phase` in supabase/migrations exactly (and the 5 phase
 * blocks of écran 34, "composeur cosmétique", in design/INVENTAIRE.md) —
 * keep the two in sync, this is the one place both sides read from.
 */
export type PhaseCosmetique =
  | "aqueuse"
  | "huileuse"
  | "emulsion"
  | "refroidissement"
  | "ajouts";

/**
 * IFRA category a limit applies to. Deliberately a plain `string`, not a
 * closed union: matches `matiere_limites_ifra.categorie_ifra` in
 * supabase/migrations, which stores the real IFRA Standards numbering
 * ("1", "4", "5A", "5C", "7A", "9", …) as free text rather than a simplified
 * enum, since a single material legitimately carries different limits across
 * more categories than the group's own two ranges currently use. Common
 * values for this project: "4" (parfum fin), "5A"/"5D" (soin non rincé),
 * "9" (soin rincé), "7A"/"7B" (usage capillaire).
 */
export type CategorieIFRA = string;

/**
 * Olfactory family — used to color blocks in the composer UI and to filter
 * the ingredient library. Matches `matieres.famille_olfactive` in
 * supabase/migrations exactly (the 6 filter chips actually drawn on écran 30
 * / écran 32 of the Stitch mockups: Boisé, Ambré, Épicé, Floral, Hespéridé,
 * Minéral/Racine) — this is a simplified raw-material classification for
 * this project's UI, not the 12-family "fragrance wheel" used in general
 * perfumery taxonomy.
 */
export type FamilleOlfactive =
  | "boise_resines"
  | "floral_botanique"
  | "ambre_balsamique"
  | "epice_chaud"
  | "hesperide_frais"
  | "actifs_cosmetiques";

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
