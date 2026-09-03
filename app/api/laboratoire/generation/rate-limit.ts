/**
 * Per-user rate limiting for the AI generation endpoint (per
 * .claude/agents/ia-composition.md: "limitation de débit par utilisateur").
 *
 * Choice documented here rather than left implicit: an in-memory sliding
 * window, 5 generations per user per 10 minutes. Simple, no migration
 * needed for this wave. Known limitation — the counter lives in the Node
 * process handling the request: a cold start or a second serverless
 * instance resets/splits it, so this is a best-effort cap, not a hard
 * guarantee. If real traffic needs a hard multi-instance limit, move the
 * counter to a `generation_ia_limite` Supabase table or Upstash/Redis.
 */

export const LIMITE_GENERATIONS_PAR_FENETRE = 5;
export const FENETRE_LIMITE_MS = 10 * 60 * 1000; // 10 minutes

export interface VerificationDebit {
  autorise: boolean;
  restantes: number;
  reinitialisationDansMs: number;
}

export class LimiteurDebit {
  private readonly compteurs = new Map<string, { count: number; resetAt: number }>();

  constructor(
    private readonly max: number = LIMITE_GENERATIONS_PAR_FENETRE,
    private readonly fenetreMs: number = FENETRE_LIMITE_MS,
  ) {}

  /** `maintenant` is injectable so tests don't need real timers. */
  verifier(userId: string, maintenant: number = Date.now()): VerificationDebit {
    const entree = this.compteurs.get(userId);

    if (!entree || maintenant >= entree.resetAt) {
      this.compteurs.set(userId, { count: 1, resetAt: maintenant + this.fenetreMs });
      return { autorise: true, restantes: this.max - 1, reinitialisationDansMs: this.fenetreMs };
    }

    if (entree.count >= this.max) {
      return { autorise: false, restantes: 0, reinitialisationDansMs: entree.resetAt - maintenant };
    }

    entree.count += 1;
    return {
      autorise: true,
      restantes: this.max - entree.count,
      reinitialisationDansMs: entree.resetAt - maintenant,
    };
  }
}

/** Singleton used by the route handler — one counter per running Node process (see limitation above). */
export const limiteurGenerationGlobal = new LimiteurDebit();
