import { describe, expect, it } from "vitest";

import {
  BORNES_DENSITE,
  buildPropositionSchema,
  ContraintesGenerationSchema,
  LigneProposeeSchema,
} from "./schema";

describe("ContraintesGenerationSchema", () => {
  const base = {
    prompt: "Un crépuscule aride sur les falaises de basalte des Almadies.",
    maison: "shea",
    concentration: "extrait",
    densite: "minimaliste",
  };

  it("accepts a minimal valid payload", () => {
    const resultat = ContraintesGenerationSchema.safeParse(base);
    expect(resultat.success).toBe(true);
  });

  it("accepts every optional constraint chip filled in", () => {
    const resultat = ContraintesGenerationSchema.safeParse({
      ...base,
      genre: "mixte",
      familleDominante: "boise_resines",
      budget: "prestige",
    });
    expect(resultat.success).toBe(true);
  });

  it("rejects a prompt that's too short", () => {
    const resultat = ContraintesGenerationSchema.safeParse({ ...base, prompt: "trop bref" });
    expect(resultat.success).toBe(false);
  });

  it("rejects a prompt over 2000 characters", () => {
    const resultat = ContraintesGenerationSchema.safeParse({ ...base, prompt: "a".repeat(2001) });
    expect(resultat.success).toBe(false);
  });

  it("rejects an unknown maison", () => {
    const resultat = ContraintesGenerationSchema.safeParse({ ...base, maison: "unknown-house" });
    expect(resultat.success).toBe(false);
  });

  it("rejects an unknown famille olfactive", () => {
    const resultat = ContraintesGenerationSchema.safeParse({
      ...base,
      familleDominante: "gourmand_sucre",
    });
    expect(resultat.success).toBe(false);
  });

  it("requires maison, concentration and densite (no defaults)", () => {
    expect(ContraintesGenerationSchema.safeParse({ prompt: base.prompt }).success).toBe(false);
  });
});

describe("LigneProposeeSchema", () => {
  it("accepts a valid uuid + étage", () => {
    const resultat = LigneProposeeSchema.safeParse({
      matiereId: "550e8400-e29b-41d4-a716-446655440000",
      etage: "fond",
    });
    expect(resultat.success).toBe(true);
  });

  it("rejects a non-uuid matiereId", () => {
    const resultat = LigneProposeeSchema.safeParse({ matiereId: "santal-fume", etage: "fond" });
    expect(resultat.success).toBe(false);
  });

  it("rejects an étage outside fond/coeur/tete", () => {
    const resultat = LigneProposeeSchema.safeParse({
      matiereId: "550e8400-e29b-41d4-a716-446655440000",
      etage: "base",
    });
    expect(resultat.success).toBe(false);
  });
});

describe("buildPropositionSchema", () => {
  const bornes = BORNES_DENSITE.minimaliste;
  const uuid = (n: number) => `550e8400-e29b-41d4-a716-4466554400${String(n).padStart(2, "0")}`;

  const lignesCompletes = (n: number) => {
    const etages = ["fond", "coeur", "tete"] as const;
    return Array.from({ length: n }, (_, i) => ({
      matiereId: uuid(i),
      etage: etages[i % etages.length],
    }));
  };

  it("accepts a well-formed proposition covering all three étages", () => {
    const schema = buildPropositionSchema(bornes);
    const resultat = schema.safeParse({
      nom: "Nuit des Almadies",
      phraseRecit: "Un crépuscule salin sur basalte, adouci de karité brûlé.",
      lignes: lignesCompletes(bornes.min),
    });
    expect(resultat.success).toBe(true);
  });

  it("rejects a proposition with too few lines", () => {
    const schema = buildPropositionSchema(bornes);
    const resultat = schema.safeParse({
      nom: "Trop court",
      phraseRecit: "...",
      lignes: lignesCompletes(bornes.min - 1),
    });
    expect(resultat.success).toBe(false);
  });

  it("rejects a proposition with too many lines", () => {
    const schema = buildPropositionSchema(bornes);
    const resultat = schema.safeParse({
      nom: "Trop long",
      phraseRecit: "...",
      lignes: lignesCompletes(bornes.max + 1),
    });
    expect(resultat.success).toBe(false);
  });

  it("rejects a proposition missing an étage (e.g. no fond)", () => {
    const schema = buildPropositionSchema(bornes);
    const resultat = schema.safeParse({
      nom: "Sans fond",
      phraseRecit: "...",
      lignes: [
        { matiereId: uuid(0), etage: "coeur" },
        { matiereId: uuid(1), etage: "tete" },
        { matiereId: uuid(2), etage: "coeur" },
        { matiereId: uuid(3), etage: "tete" },
        { matiereId: uuid(4), etage: "coeur" },
        { matiereId: uuid(5), etage: "tete" },
      ],
    });
    expect(resultat.success).toBe(false);
    if (!resultat.success) {
      expect(resultat.error.issues.some((i) => i.message.includes('"fond"'))).toBe(true);
    }
  });

  it("rejects a proposition that repeats the same matiereId", () => {
    const schema = buildPropositionSchema(bornes);
    const doublon = uuid(0);
    const resultat = schema.safeParse({
      nom: "Doublon",
      phraseRecit: "...",
      lignes: [
        { matiereId: doublon, etage: "fond" },
        { matiereId: doublon, etage: "coeur" },
        { matiereId: uuid(1), etage: "tete" },
        { matiereId: uuid(2), etage: "fond" },
        { matiereId: uuid(3), etage: "coeur" },
        { matiereId: uuid(4), etage: "tete" },
      ],
    });
    expect(resultat.success).toBe(false);
    if (!resultat.success) {
      expect(resultat.error.issues.some((i) => i.message.includes("deux fois"))).toBe(true);
    }
  });

  it("rejects a proposition with an empty nom", () => {
    const schema = buildPropositionSchema(bornes);
    const resultat = schema.safeParse({
      nom: "",
      phraseRecit: "...",
      lignes: lignesCompletes(bornes.min),
    });
    expect(resultat.success).toBe(false);
  });
});
