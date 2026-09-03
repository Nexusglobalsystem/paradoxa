import { describe, expect, it, vi } from "vitest";

import {
  type AnthropicClientLike,
  type AnthropicMessageLike,
  GenerationInvalideError,
  genererPropositionAvecRetry,
  hydraterProposition,
  tenterParseJson,
} from "./generer-proposition";
import { BORNES_DENSITE, type MatiereDisponible, type PropositionGeneree } from "./schema";

const UUID_KARITE = "550e8400-e29b-41d4-a716-446655440001";
const UUID_SANTAL = "550e8400-e29b-41d4-a716-446655440002";
const UUID_COPAL = "550e8400-e29b-41d4-a716-446655440003";
const UUID_EMBRUNS = "550e8400-e29b-41d4-a716-446655440004";
const UUID_INCONNU = "550e8400-e29b-41d4-a716-446655440099";

const matieresDisponibles = new Map<string, MatiereDisponible>([
  [UUID_KARITE, { id: UUID_KARITE, nom: "Karité brut torréfié", prixParKg: 40, puissance: 3 }],
  [UUID_SANTAL, { id: UUID_SANTAL, nom: "Santal fumé", prixParKg: 120, puissance: 4 }],
  [UUID_COPAL, { id: UUID_COPAL, nom: "Résine de Copal", prixParKg: 60, puissance: 3 }],
  [UUID_EMBRUNS, { id: UUID_EMBRUNS, nom: "Brume d'embruns salins", prixParKg: 30, puissance: 2 }],
]);

function messageAvecJson(payload: unknown, usage = { input_tokens: 100, output_tokens: 50 }): AnthropicMessageLike {
  return { content: [{ type: "text", text: JSON.stringify(payload) }], usage };
}

const propositionValide: PropositionGeneree = {
  nom: "Nuit des Almadies",
  phraseRecit: "Un crépuscule salin sur basalte, adouci de karité brûlé.",
  lignes: [
    { matiereId: UUID_KARITE, etage: "fond" },
    { matiereId: UUID_SANTAL, etage: "fond" },
    { matiereId: UUID_COPAL, etage: "coeur" },
    { matiereId: UUID_EMBRUNS, etage: "tete" },
  ],
};

describe("tenterParseJson", () => {
  it("parses plain JSON", () => {
    expect(tenterParseJson('{"a":1}')).toEqual({ a: 1 });
  });

  it("strips a ```json fenced block", () => {
    expect(tenterParseJson('```json\n{"a":1}\n```')).toEqual({ a: 1 });
  });

  it("strips a plain ``` fenced block", () => {
    expect(tenterParseJson('```\n{"a":1}\n```')).toEqual({ a: 1 });
  });

  it("returns undefined (never throws) on malformed JSON", () => {
    expect(tenterParseJson("this is not json")).toBeUndefined();
  });
});

describe("hydraterProposition", () => {
  it("hydrates every line from the real matieres map", () => {
    const resultat = hydraterProposition(propositionValide, matieresDisponibles);
    expect(resultat.ok).toBe(true);
    expect(resultat.matieresIgnorees).toEqual([]);
    expect(resultat.proposition?.lignes).toHaveLength(4);
    expect(resultat.proposition?.lignes.map((l) => l.nomMatiere)).toContain("Karité brut torréfié");
  });

  it("silently drops a hallucinated matiereId not present in the real catalogue", () => {
    const proposition: PropositionGeneree = {
      ...propositionValide,
      lignes: [...propositionValide.lignes, { matiereId: UUID_INCONNU, etage: "tete" }],
    };
    const resultat = hydraterProposition(proposition, matieresDisponibles);
    expect(resultat.ok).toBe(true);
    expect(resultat.matieresIgnorees).toEqual([UUID_INCONNU]);
    // The hallucinated id never surfaces as a formula line.
    expect(resultat.proposition?.lignes.some((l) => l.id === UUID_INCONNU)).toBe(false);
  });

  it("fails when filtering unknown ids breaks étage coverage", () => {
    const proposition: PropositionGeneree = {
      nom: "Sans tête",
      phraseRecit: "...",
      lignes: [
        { matiereId: UUID_KARITE, etage: "fond" },
        { matiereId: UUID_COPAL, etage: "coeur" },
        // The only "tete" line references a material that doesn't exist.
        { matiereId: UUID_INCONNU, etage: "tete" },
      ],
    };
    const resultat = hydraterProposition(proposition, matieresDisponibles);
    expect(resultat.ok).toBe(false);
    expect(resultat.raison).toContain("tete");
  });

  it("fails when every proposed matiereId is unknown", () => {
    const proposition: PropositionGeneree = {
      nom: "Tout inconnu",
      phraseRecit: "...",
      lignes: [{ matiereId: UUID_INCONNU, etage: "fond" }],
    };
    const resultat = hydraterProposition(proposition, matieresDisponibles);
    expect(resultat.ok).toBe(false);
    expect(resultat.matieresIgnorees).toEqual([UUID_INCONNU]);
  });
});

describe("genererPropositionAvecRetry", () => {
  const bornes = BORNES_DENSITE.minimaliste; // min 6 — override per-test via a looser proposition where needed

  function stubClient(...reponses: AnthropicMessageLike[]): AnthropicClientLike {
    const create = vi.fn();
    for (const reponse of reponses) {
      create.mockResolvedValueOnce(reponse);
    }
    return { messages: { create } };
  }

  // A proposition satisfying the default "minimaliste" bounds (6-10 lines).
  const propositionSuffisante: PropositionGeneree = {
    nom: "Nuit des Almadies",
    phraseRecit: "Un crépuscule salin sur basalte, adouci de karité brûlé.",
    lignes: [
      { matiereId: UUID_KARITE, etage: "fond" },
      { matiereId: UUID_SANTAL, etage: "fond" },
      { matiereId: UUID_COPAL, etage: "coeur" },
      { matiereId: UUID_EMBRUNS, etage: "tete" },
      { matiereId: UUID_KARITE, etage: "coeur" }, // duplicate id — intentionally invalid, see "eventually valid" test below
    ],
  };

  it("returns a hydrated proposition on the first valid attempt, calling the client exactly once", async () => {
    const client = stubClient(messageAvecJson(propositionValide));

    const resultat = await genererPropositionAvecRetry({
      client,
      model: "claude-opus-5",
      systemPrompt: "system",
      userPrompt: "user",
      bornes: { min: 4, max: 10 },
      matieresDisponibles,
    });

    expect(resultat.tentatives).toBe(1);
    expect(resultat.proposition.nom).toBe("Nuit des Almadies");
    expect(resultat.matieresIgnorees).toEqual([]);
    expect(client.messages.create).toHaveBeenCalledTimes(1);
  });

  it("retries exactly once after malformed JSON, then succeeds", async () => {
    const client = stubClient(
      { content: [{ type: "text", text: "not json at all" }] },
      messageAvecJson(propositionValide),
    );

    const resultat = await genererPropositionAvecRetry({
      client,
      model: "claude-opus-5",
      systemPrompt: "system",
      userPrompt: "user",
      bornes: { min: 4, max: 10 },
      matieresDisponibles,
    });

    expect(resultat.tentatives).toBe(2);
    expect(client.messages.create).toHaveBeenCalledTimes(2);
  });

  it("retries exactly once after a schema violation (e.g. duplicate matiereId), then succeeds", async () => {
    const client = stubClient(
      messageAvecJson(propositionSuffisante), // has a duplicate id -> schema-invalid
      messageAvecJson(propositionValide),
    );

    const resultat = await genererPropositionAvecRetry({
      client,
      model: "claude-opus-5",
      systemPrompt: "system",
      userPrompt: "user",
      bornes: { min: 4, max: 10 },
      matieresDisponibles,
    });

    expect(resultat.tentatives).toBe(2);
    expect(resultat.proposition.nom).toBe("Nuit des Almadies");
  });

  it("throws GenerationInvalideError with details after two invalid attempts — never a half-applied formula", async () => {
    const client = stubClient(
      { content: [{ type: "text", text: "invalid #1" }] },
      { content: [{ type: "text", text: "invalid #2" }] },
    );

    await expect(
      genererPropositionAvecRetry({
        client,
        model: "claude-opus-5",
        systemPrompt: "system",
        userPrompt: "user",
        bornes: { min: 4, max: 10 },
        matieresDisponibles,
      }),
    ).rejects.toBeInstanceOf(GenerationInvalideError);

    expect(client.messages.create).toHaveBeenCalledTimes(2);
  });

  it("GenerationInvalideError carries a clear, non-empty French message and per-attempt details", async () => {
    const client = stubClient(
      { content: [{ type: "text", text: "invalid #1" }] },
      { content: [{ type: "text", text: "invalid #2" }] },
    );

    try {
      await genererPropositionAvecRetry({
        client,
        model: "claude-opus-5",
        systemPrompt: "system",
        userPrompt: "user",
        bornes: { min: 4, max: 10 },
        matieresDisponibles,
      });
      expect.unreachable("devrait avoir levé GenerationInvalideError");
    } catch (error) {
      expect(error).toBeInstanceOf(GenerationInvalideError);
      const err = error as GenerationInvalideError;
      expect(err.message.length).toBeGreaterThan(0);
      expect(err.details).toHaveLength(2);
    }
  });

  it("fails after two attempts when the model only ever hallucinates matiere ids", async () => {
    const propositionHallucinee: PropositionGeneree = {
      nom: "Fantôme",
      phraseRecit: "...",
      lignes: [
        { matiereId: UUID_INCONNU, etage: "fond" },
        { matiereId: UUID_INCONNU, etage: "coeur" },
      ],
    };
    const client = stubClient(
      messageAvecJson({
        ...propositionHallucinee,
        lignes: [
          { matiereId: "550e8400-e29b-41d4-a716-446655440091", etage: "fond" },
          { matiereId: "550e8400-e29b-41d4-a716-446655440092", etage: "coeur" },
          { matiereId: "550e8400-e29b-41d4-a716-446655440093", etage: "tete" },
          { matiereId: "550e8400-e29b-41d4-a716-446655440094", etage: "fond" },
        ],
      }),
      messageAvecJson({
        ...propositionHallucinee,
        lignes: [
          { matiereId: "550e8400-e29b-41d4-a716-446655440095", etage: "fond" },
          { matiereId: "550e8400-e29b-41d4-a716-446655440096", etage: "coeur" },
          { matiereId: "550e8400-e29b-41d4-a716-446655440097", etage: "tete" },
          { matiereId: "550e8400-e29b-41d4-a716-446655440098", etage: "fond" },
        ],
      }),
    );

    await expect(
      genererPropositionAvecRetry({
        client,
        model: "claude-opus-5",
        systemPrompt: "system",
        userPrompt: "user",
        bornes: { min: 4, max: 10 },
        matieresDisponibles,
      }),
    ).rejects.toBeInstanceOf(GenerationInvalideError);
  });

  it("reports usage via onUsage for every attempt, even a failed one — the call was still billed", async () => {
    const client = stubClient(
      { content: [{ type: "text", text: "invalid" }], usage: { input_tokens: 10, output_tokens: 5 } },
      messageAvecJson(propositionValide, { input_tokens: 20, output_tokens: 15 }),
    );
    const onUsage = vi.fn();

    await genererPropositionAvecRetry({
      client,
      model: "claude-opus-5",
      systemPrompt: "system",
      userPrompt: "user",
      bornes: { min: 4, max: 10 },
      matieresDisponibles,
      onUsage,
    });

    expect(onUsage).toHaveBeenCalledTimes(2);
    expect(onUsage).toHaveBeenNthCalledWith(1, { input_tokens: 10, output_tokens: 5 }, 1);
    expect(onUsage).toHaveBeenNthCalledWith(2, { input_tokens: 20, output_tokens: 15 }, 2);
  });

  it("uses the corrective prompt (mentioning the failure) on the retry call", async () => {
    const client = stubClient(
      { content: [{ type: "text", text: "not json" }] },
      messageAvecJson(propositionValide),
    );

    await genererPropositionAvecRetry({
      client,
      model: "claude-opus-5",
      systemPrompt: "system",
      userPrompt: "prompt original",
      bornes: { min: 4, max: 10 },
      matieresDisponibles,
    });

    const create = client.messages.create as unknown as ReturnType<typeof vi.fn>;
    const deuxiemeAppel = create.mock.calls[1][0] as { messages: Array<{ content: string }> };
    expect(deuxiemeAppel.messages[0].content).toContain("prompt original");
    expect(deuxiemeAppel.messages[0].content).toContain("CORRECTION REQUISE");
  });

  it("rejects a proposal below the requested densité's minimum line count on both attempts", async () => {
    // propositionValide has 4 lines, below BORNES_DENSITE.minimaliste.min (6) —
    // every attempt is schema-invalid, so this exhausts both tries and throws.
    const client = stubClient(messageAvecJson(propositionValide), messageAvecJson(propositionValide));

    await expect(
      genererPropositionAvecRetry({
        client,
        model: "claude-opus-5",
        systemPrompt: "system",
        userPrompt: "user",
        bornes,
        matieresDisponibles,
      }),
    ).rejects.toBeInstanceOf(GenerationInvalideError);
    expect(client.messages.create).toHaveBeenCalledTimes(2);
  });
});
