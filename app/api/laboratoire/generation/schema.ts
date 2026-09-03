/**
 * Zod schemas for the AI-assisted generation route. Pure validation module —
 * no Supabase, no Anthropic SDK, no Next.js imports — so it can be unit
 * tested in isolation and safely type-imported (`import type`) from the
 * client component without pulling any server code into the browser bundle.
 *
 * Two schemas live here:
 *  - `ContraintesGenerationSchema` validates the request body sent by the
 *    studio UI (the prompt + the optional constraint chips).
 *  - `buildPropositionSchema` validates the JSON the model is asked to
 *    return. It's a factory (not a static schema) because the accepted
 *    number of lines depends on the "densité" chip chosen by the user.
 */
import { z } from "zod";

import type { CategorieIFRA, Formule, FamilleOlfactive } from "@/packages/formulation";

export const MaisonGenerationSchema = z.enum(["shea", "ecloree"]);
export type MaisonGeneration = z.infer<typeof MaisonGenerationSchema>;

export const GenreParfumSchema = z.enum(["feminin", "masculin", "mixte"]);
export type GenreParfum = z.infer<typeof GenreParfumSchema>;

// Mirrors packages/formulation's FamilleOlfactive union exactly (see
// types.ts) — kept as a separate zod enum here rather than imported,
// because zod needs a runtime schema and packages/formulation exports
// only the TypeScript type. `satisfies` below keeps the two in sync: this
// file fails to compile if the two lists ever drift apart.
export const FamilleOlfactiveSchema = z.enum([
  "boise_resines",
  "floral_botanique",
  "ambre_balsamique",
  "epice_chaud",
  "hesperide_frais",
  "actifs_cosmetiques",
] as const satisfies readonly FamilleOlfactive[]);

export const ConcentrationSchema = z.enum(["edt", "edp", "extrait"]);
export type Concentration = z.infer<typeof ConcentrationSchema>;

export const DensiteMatieresSchema = z.enum(["minimaliste", "equilibre", "complexe"]);
export type DensiteMatieres = z.infer<typeof DensiteMatieresSchema>;

export const BudgetMatiereSchema = z.enum(["economique", "standard", "prestige"]);
export type BudgetMatiere = z.infer<typeof BudgetMatiereSchema>;

/** Target line-count range per "densité" chip — guidance for the prompt AND the hard bound the output schema enforces. */
export const BORNES_DENSITE: Record<DensiteMatieres, { min: number; max: number; label: string }> = {
  minimaliste: { min: 6, max: 10, label: "7 à 9 matières (minimaliste)" },
  equilibre: { min: 8, max: 13, label: "9 à 12 matières (équilibré)" },
  complexe: { min: 11, max: 16, label: "12 à 15 matières (complexe)" },
};

export const LABELS_BUDGET: Record<BudgetMatiere, string> = {
  economique: "économique — coût matière moyen visé sous 20 €/kg",
  standard: "standard — coût matière moyen visé entre 20 et 50 €/kg",
  prestige: "prestige — coût matière moyen visé au-delà de 50 €/kg, matières rares acceptées",
};

export const ContraintesGenerationSchema = z.object({
  prompt: z
    .string()
    .trim()
    .min(10, "Décrivez votre intention en au moins 10 caractères.")
    .max(2000, "La description ne peut pas dépasser 2000 caractères."),
  maison: MaisonGenerationSchema,
  genre: GenreParfumSchema.optional(),
  familleDominante: FamilleOlfactiveSchema.optional(),
  concentration: ConcentrationSchema,
  densite: DensiteMatieresSchema,
  budget: BudgetMatiereSchema.optional(),
});
export type ContraintesGeneration = z.infer<typeof ContraintesGenerationSchema>;

/** One line of the raw model output — a material reference, not yet hydrated against the real `matieres` table. */
export const LigneProposeeSchema = z.object({
  matiereId: z.uuid("matiereId doit être un UUID."),
  etage: z.enum(["fond", "coeur", "tete"]),
});
export type LigneProposee = z.infer<typeof LigneProposeeSchema>;

const ETAGES_REQUIS = ["fond", "coeur", "tete"] as const;

/**
 * Builds the schema for the model's raw JSON response. A factory rather
 * than a static export because the accepted line count depends on the
 * "densité" constraint chosen for this request.
 */
export function buildPropositionSchema(bornes: { min: number; max: number }) {
  return z
    .object({
      nom: z.string().trim().min(1, "Le nom de la formule est requis.").max(120),
      phraseRecit: z
        .string()
        .trim()
        .min(1, "La phrase-récit est requise.")
        .max(600, "La phrase-récit ne peut pas dépasser 600 caractères."),
      lignes: z
        .array(LigneProposeeSchema)
        .min(bornes.min, `Il faut au moins ${bornes.min} matières.`)
        .max(bornes.max, `Il ne faut pas dépasser ${bornes.max} matières.`),
    })
    .superRefine((proposition, ctx) => {
      const etagesPresents = new Set(proposition.lignes.map((l) => l.etage));
      for (const etage of ETAGES_REQUIS) {
        if (!etagesPresents.has(etage)) {
          ctx.addIssue({
            code: "custom",
            path: ["lignes"],
            message: `Aucune matière assignée à l'étage "${etage}" — les trois étages (fond, cœur, tête) sont obligatoires.`,
          });
        }
      }

      const ids = proposition.lignes.map((l) => l.matiereId);
      if (new Set(ids).size !== ids.length) {
        ctx.addIssue({
          code: "custom",
          path: ["lignes"],
          message: "Une même matière ne peut pas apparaître deux fois dans la formule.",
        });
      }
    });
}
export type PropositionGeneree = z.infer<ReturnType<typeof buildPropositionSchema>>;

/** A real `matieres` row, trimmed to what the generator needs. */
export interface MatiereDisponible {
  id: string;
  nom: string;
  inci?: string;
  prixParKg: number;
  familleOlfactive?: FamilleOlfactive;
  limiteIFRA?: Partial<Record<CategorieIFRA, number>>;
  volatilite?: string | null;
  puissance: number;
}

/** Successful response shape returned by POST /api/laboratoire/generation. */
export interface ReponseGenerationSucces {
  formuleId: string;
  formule: Formule;
  phraseRecit: string;
  matieresIgnorees: string[];
  tentatives: number;
  avertissement: string;
}

/** Error response shape returned by POST /api/laboratoire/generation. */
export interface ReponseGenerationErreur {
  erreur: string;
  details?: string[];
}
