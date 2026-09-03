/**
 * Cost estimation + logging for AI generation calls (per
 * .claude/agents/ia-composition.md: "coût des appels journalisé").
 *
 * Choice documented here: one structured `console.log` line per attempt,
 * not a dedicated Supabase table — sufficient for a first wave (aggregable
 * from Vercel/hosting logs) without adding a migration outside this task's
 * scope. Worth promoting to a `generation_ia_journal` table if per-user or
 * per-month cost reporting becomes a real product need.
 *
 * Pricing: Claude Opus 5 (`claude-opus-5`), $5.00 / MTok input, $25.00 /
 * MTok output — first-party Anthropic API rates (see the `claude-api`
 * skill's cached model table). Update PRIX_MODELE if the route's model
 * changes.
 */

export const MODELE_GENERATION = "claude-opus-5";

export const PRIX_MODELE = {
  inputParMTok: 5.0,
  outputParMTok: 25.0,
} as const;

export interface UsageAnthropic {
  input_tokens: number;
  output_tokens: number;
}

/** Rounded to 6 decimal places — fractions of a cent matter when volumes are low. */
export function estimerCoutUsd(usage: UsageAnthropic): number {
  const coutInput = (usage.input_tokens / 1_000_000) * PRIX_MODELE.inputParMTok;
  const coutOutput = (usage.output_tokens / 1_000_000) * PRIX_MODELE.outputParMTok;
  return Math.round((coutInput + coutOutput) * 1e6) / 1e6;
}

export interface EntreeCoutGeneration {
  userId: string;
  tentative: number;
  usage: UsageAnthropic;
}

export function journaliserCoutGeneration(entree: EntreeCoutGeneration): void {
  console.log(
    JSON.stringify({
      event: "laboratoire.generation.cout",
      timestamp: new Date().toISOString(),
      userId: entree.userId,
      tentative: entree.tentative,
      modele: MODELE_GENERATION,
      inputTokens: entree.usage.input_tokens,
      outputTokens: entree.usage.output_tokens,
      coutEstimeUsd: estimerCoutUsd(entree.usage),
    }),
  );
}
