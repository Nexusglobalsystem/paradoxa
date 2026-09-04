import { describe, expect, it } from "vitest";
import Stripe from "stripe";

import { verifierEvenementWebhook } from "./verifier-signature";

/**
 * Aucun appel réseau ici : `Stripe.webhooks.constructEvent` /
 * `generateTestHeaderString` sont du calcul HMAC local (voir le commentaire
 * de verifier-signature.ts). C'est le même mécanisme qu'utilisera le vrai
 * webhook Stripe en production — seule la clé change (un vrai
 * STRIPE_WEBHOOK_SECRET plutôt que ce secret de test).
 */
const SECRET_TEST = "whsec_test_secret_1234567890";

const EVENEMENT_JSON = JSON.stringify({
  id: "evt_test_123",
  object: "event",
  type: "checkout.session.completed",
  data: { object: { id: "cs_test_abc" } },
});

describe("verifierEvenementWebhook", () => {
  it("accepts a payload signed with the matching secret", () => {
    const signature = Stripe.webhooks.generateTestHeaderString({ payload: EVENEMENT_JSON, secret: SECRET_TEST });

    const evenement = verifierEvenementWebhook(EVENEMENT_JSON, signature, SECRET_TEST);

    expect(evenement.id).toBe("evt_test_123");
    expect(evenement.type).toBe("checkout.session.completed");
  });

  it("rejects a payload signed with a different secret", () => {
    const signature = Stripe.webhooks.generateTestHeaderString({ payload: EVENEMENT_JSON, secret: "whsec_autre_secret" });

    expect(() => verifierEvenementWebhook(EVENEMENT_JSON, signature, SECRET_TEST)).toThrow();
  });

  it("rejects a tampered payload even with a validly-formed signature", () => {
    const signature = Stripe.webhooks.generateTestHeaderString({ payload: EVENEMENT_JSON, secret: SECRET_TEST });
    const payloadModifie = EVENEMENT_JSON.replace("cs_test_abc", "cs_test_HACKED");

    expect(() => verifierEvenementWebhook(payloadModifie, signature, SECRET_TEST)).toThrow();
  });

  it("rejects a malformed signature header", () => {
    expect(() => verifierEvenementWebhook(EVENEMENT_JSON, "not-a-real-signature", SECRET_TEST)).toThrow();
  });

  it("rejects a signature older than the tolerance window", () => {
    const signatureAncienne = Stripe.webhooks.generateTestHeaderString({
      payload: EVENEMENT_JSON,
      secret: SECRET_TEST,
      timestamp: Math.floor(Date.now() / 1000) - 60 * 60, // 1h dans le passé
    });

    expect(() => verifierEvenementWebhook(EVENEMENT_JSON, signatureAncienne, SECRET_TEST)).toThrow();
  });
});
