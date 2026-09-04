import { describe, expect, it } from "vitest";

import { interpreterErreurConflit } from "./idempotence";

describe("interpreterErreurConflit", () => {
  it("recognizes a stripe_session_id unique violation as an already-processed event", () => {
    const resultat = interpreterErreurConflit({
      code: "23505",
      message: 'duplicate key value violates unique constraint "commandes_stripe_session_id_key"',
      details: "Key (stripe_session_id)=(cs_test_abc123) already exists.",
    });
    expect(resultat).toBe("session_deja_traitee");
  });

  it("recognizes a numero_commande unique violation as a retryable collision", () => {
    const resultat = interpreterErreurConflit({
      code: "23505",
      message: 'duplicate key value violates unique constraint "commandes_numero_commande_key"',
      details: "Key (numero_commande)=(CMD-2026-000042) already exists.",
    });
    expect(resultat).toBe("numero_collision");
  });

  it("returns 'autre' for a non-unique-violation error (e.g. a check constraint failure)", () => {
    const resultat = interpreterErreurConflit({
      code: "23514",
      message: 'new row for relation "commandes" violates check constraint "commandes_total_check"',
    });
    expect(resultat).toBe("autre");
  });

  it("returns 'autre' when there is no error at all", () => {
    expect(interpreterErreurConflit(null)).toBe("autre");
    expect(interpreterErreurConflit(undefined)).toBe("autre");
  });

  it("returns 'autre' for a 23505 whose constraint name cannot be identified", () => {
    const resultat = interpreterErreurConflit({ code: "23505", message: "duplicate key value" });
    expect(resultat).toBe("autre");
  });
});
