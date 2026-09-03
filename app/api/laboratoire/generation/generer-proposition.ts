/**
 * Core generation logic: talks to an Anthropic-shaped client through a
 * minimal structural interface (so tests can pass a stub — no network, no
 * real SDK — and the real `Anthropic` client still satisfies it as-is),
 * validates the JSON it returns against the Zod schema in schema.ts, and
 * rejects any material id that isn't in the real `matieres` table.
 *
 * Retry policy (per CLAUDE.md / .claude/agents/ia-composition.md): exactly
 * one retry on an invalid response, then a clear, typed error. Never a
 * half-applied formula — `genererPropositionAvecRetry` either returns a
 * fully hydrated, real-materials-only proposition, or throws.
 */
import type { LigneFormule } from "@/packages/formulation";

import {
  buildPropositionSchema,
  type MatiereDisponible,
  type PropositionGeneree,
} from "./schema";

/** Structural subset of the Anthropic SDK's Message response — real SDK responses satisfy this as-is. */
export interface AnthropicMessageLike {
  content: Array<{ type: string; text?: string }>;
  usage?: { input_tokens: number; output_tokens: number };
}

/** Structural subset of the Anthropic SDK client — real `new Anthropic()` instances satisfy this as-is. */
export interface AnthropicClientLike {
  messages: {
    create(params: {
      model: string;
      max_tokens: number;
      system: string;
      messages: Array<{ role: "user"; content: string }>;
    }): Promise<AnthropicMessageLike>;
  };
}

/** Thrown once both attempts (initial + single retry) fail validation — carries every rejection reason for logging. */
export class GenerationInvalideError extends Error {
  readonly details: string[];

  constructor(message: string, details: string[]) {
    super(message);
    this.name = "GenerationInvalideError";
    this.details = details;
  }
}

export interface PropositionValidee {
  nom: string;
  phraseRecit: string;
  /** Hydrated from real `matieres` rows — pourcentage is a placeholder (0), the caller runs `equilibrerFormule` to size it. */
  lignes: LigneFormule[];
}

interface ResultatHydratation {
  ok: boolean;
  proposition?: PropositionValidee;
  matieresIgnorees: string[];
  raison?: string;
}

const ETAGES_REQUIS = ["fond", "coeur", "tete"] as const;

/**
 * Cross-checks the model's proposed lines against the real materials map:
 * unknown ids are silently dropped (never surfaced to the user as
 * materials), then re-checks that all three étages are still covered —
 * dropping ids can break that coverage even when the raw response passed
 * schema validation.
 */
export function hydraterProposition(
  proposition: PropositionGeneree,
  matieresDisponibles: Map<string, MatiereDisponible>,
): ResultatHydratation {
  const matieresIgnorees: string[] = [];
  const lignes: LigneFormule[] = [];

  for (const ligneProposee of proposition.lignes) {
    const matiere = matieresDisponibles.get(ligneProposee.matiereId);
    if (!matiere) {
      matieresIgnorees.push(ligneProposee.matiereId);
      continue;
    }
    lignes.push({
      id: matiere.id,
      nomMatiere: matiere.nom,
      inci: matiere.inci,
      pourcentage: 0,
      etage: ligneProposee.etage,
      familleOlfactive: matiere.familleOlfactive,
      limiteIFRA: matiere.limiteIFRA,
      prixParKg: matiere.prixParKg,
    });
  }

  if (lignes.length === 0) {
    return {
      ok: false,
      matieresIgnorees,
      raison: "Toutes les matières proposées par le modèle sont inconnues en base.",
    };
  }

  const etagesCouverts = new Set(lignes.map((l) => l.etage));
  const etagesManquants = ETAGES_REQUIS.filter((e) => !etagesCouverts.has(e));
  if (etagesManquants.length > 0) {
    return {
      ok: false,
      matieresIgnorees,
      raison: `Après filtrage des matières inconnues, un étage n'est plus couvert : ${etagesManquants.join(", ")}.`,
    };
  }

  return {
    ok: true,
    matieresIgnorees,
    proposition: { nom: proposition.nom, phraseRecit: proposition.phraseRecit, lignes },
  };
}

function extraireTexte(reponse: AnthropicMessageLike): string {
  return reponse.content
    .filter((bloc) => bloc.type === "text" && typeof bloc.text === "string")
    .map((bloc) => bloc.text)
    .join("\n");
}

/** Strips optional Markdown code fences and parses JSON; returns undefined (never throws) on any failure. */
export function tenterParseJson(texte: string): unknown {
  let candidat = texte.trim();
  const barriereMarkdown = /^```(?:json)?\s*([\s\S]*?)\s*```$/i;
  const correspondance = barriereMarkdown.exec(candidat);
  if (correspondance) {
    candidat = correspondance[1].trim();
  }

  try {
    return JSON.parse(candidat);
  } catch {
    return undefined;
  }
}

function construirePromptCorrection(promptOriginal: string, note: string): string {
  return `${promptOriginal}\n\n---\nCORRECTION REQUISE : ${note}`;
}

export interface GenererPropositionParams {
  client: AnthropicClientLike;
  model: string;
  systemPrompt: string;
  userPrompt: string;
  bornes: { min: number; max: number };
  matieresDisponibles: Map<string, MatiereDisponible>;
  maxTokens?: number;
  /** Called after every attempt that returns usage, even a failed one — the API call was still billed. */
  onUsage?: (usage: { input_tokens: number; output_tokens: number }, tentative: number) => void;
}

export interface ResultatGeneration {
  proposition: PropositionValidee;
  matieresIgnorees: string[];
  tentatives: number;
}

const NOMBRE_MAX_TENTATIVES = 2;

/**
 * Calls the model, validates its JSON response, and hydrates it against the
 * real materials catalogue — with exactly one corrective retry (per
 * .claude/agents/ia-composition.md) before giving up with a clear error.
 */
export async function genererPropositionAvecRetry(
  params: GenererPropositionParams,
): Promise<ResultatGeneration> {
  const schema = buildPropositionSchema(params.bornes);
  const erreurs: string[] = [];
  let userPromptCourant = params.userPrompt;

  for (let tentative = 1; tentative <= NOMBRE_MAX_TENTATIVES; tentative++) {
    const reponse = await params.client.messages.create({
      model: params.model,
      max_tokens: params.maxTokens ?? 8192,
      system: params.systemPrompt,
      messages: [{ role: "user", content: userPromptCourant }],
    });

    if (reponse.usage) {
      params.onUsage?.(reponse.usage, tentative);
    }

    const texte = extraireTexte(reponse);
    const jsonBrut = tenterParseJson(texte);
    if (jsonBrut === undefined) {
      erreurs.push(`Tentative ${tentative} : la réponse n'était pas un JSON valide.`);
      userPromptCourant = construirePromptCorrection(
        params.userPrompt,
        "Ta réponse précédente n'était pas un JSON valide. Réponds UNIQUEMENT avec l'objet JSON demandé, sans texte autour, sans balises Markdown.",
      );
      continue;
    }

    const resultatParse = schema.safeParse(jsonBrut);
    if (!resultatParse.success) {
      const details = resultatParse.error.issues.map((i) => i.message);
      erreurs.push(`Tentative ${tentative} : ${details.join(" ")}`);
      userPromptCourant = construirePromptCorrection(
        params.userPrompt,
        `Ta réponse précédente était invalide : ${details.join(" ")} Corrige et renvoie un JSON strictement conforme au format demandé.`,
      );
      continue;
    }

    const hydratation = hydraterProposition(resultatParse.data, params.matieresDisponibles);
    if (!hydratation.ok || !hydratation.proposition) {
      erreurs.push(`Tentative ${tentative} : ${hydratation.raison}`);
      userPromptCourant = construirePromptCorrection(
        params.userPrompt,
        `${hydratation.raison} Utilise EXCLUSIVEMENT les "id" de la liste de matières fournie, recopiés tels quels.`,
      );
      continue;
    }

    return {
      proposition: hydratation.proposition,
      matieresIgnorees: hydratation.matieresIgnorees,
      tentatives: tentative,
    };
  }

  throw new GenerationInvalideError(
    "La génération assistée par IA n'a pas produit de formule valide après deux tentatives. Réessayez avec une description différente ou des contraintes moins strictes.",
    erreurs,
  );
}
