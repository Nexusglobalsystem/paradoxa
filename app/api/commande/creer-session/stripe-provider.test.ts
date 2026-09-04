import { describe, expect, it, vi } from "vitest";
import type Stripe from "stripe";

import type { DemandeSessionPaiement } from "./payment-provider";
import { PaymentProviderIndisponibleError, StripeProvider } from "./stripe-provider";

const DEMANDE: DemandeSessionPaiement = {
  lignes: [{ produitId: "prod-1", nom: "Bois de Shéa", prixUnitaire: 185, quantite: 1 }],
  sousTotal: 185,
  fraisLivraison: 6.9,
  total: 191.9,
  devise: "EUR",
  livraison: {
    nomComplet: "Aïssata Diop",
    email: "aissata@example.com",
    telephone: "0600000000",
    adresseLigne1: "12 rue des Fleurs",
    codePostal: "75004",
    ville: "Paris",
    pays: "FR",
  },
  urlSucces: "https://laparadoxa.test/commande/confirmation?session_id={CHECKOUT_SESSION_ID}",
  urlAnnulation: "https://laparadoxa.test/commande",
};

/** Fake minimal — seule la forme utilisée par StripeProvider est mockée, aucun appel réseau. */
function creerFauxClientStripe(sessionRenvoyee: { id: string; url: string | null }) {
  const create = vi.fn().mockResolvedValue(sessionRenvoyee);
  const faux = { checkout: { sessions: { create } } };
  return { faux: faux as unknown as Stripe, create };
}

describe("StripeProvider", () => {
  it("never touches the network in tests — a mocked client is required (no real API key here)", () => {
    // Aucune clé STRIPE_SECRET_KEY n'est configurée dans cet environnement de test :
    // construire un StripeProvider sans client injecté doit échouer proprement plutôt
    // que de tenter un appel réseau réel.
    expect(() => new StripeProvider()).toThrow(PaymentProviderIndisponibleError);
  });

  it("creates a Checkout session with the pre-computed amounts and returns its url", async () => {
    const { faux, create } = creerFauxClientStripe({ id: "cs_test_123", url: "https://checkout.stripe.com/pay/cs_test_123" });
    const provider = new StripeProvider(faux);

    const resultat = await provider.creerSession(DEMANDE);

    expect(resultat).toEqual({ url: "https://checkout.stripe.com/pay/cs_test_123", sessionId: "cs_test_123" });
    expect(create).toHaveBeenCalledTimes(1);
    const params = create.mock.calls[0][0] as Stripe.Checkout.SessionCreateParams;
    expect(params.mode).toBe("payment");
    expect(params.customer_email).toBe("aissata@example.com");
    expect(params.success_url).toBe(DEMANDE.urlSucces);
    expect(params.cancel_url).toBe(DEMANDE.urlAnnulation);
    expect(params.line_items).toHaveLength(2); // 1 produit + 1 ligne livraison (fraisLivraison > 0)
    expect(params.metadata).toMatchObject({
      email: "aissata@example.com",
      sous_total: "185.00",
      frais_livraison: "6.90",
      total: "191.90",
      devise: "EUR",
    });
  });

  it("omits the shipping line item when frais livraison is 0 (free shipping threshold reached)", async () => {
    const { faux, create } = creerFauxClientStripe({ id: "cs_test_456", url: "https://checkout.stripe.com/pay/cs_test_456" });
    const provider = new StripeProvider(faux);

    await provider.creerSession({ ...DEMANDE, fraisLivraison: 0, total: DEMANDE.sousTotal });

    const params = create.mock.calls[0][0] as Stripe.Checkout.SessionCreateParams;
    expect(params.line_items).toHaveLength(1);
  });

  it("throws if Stripe returns a session without a url", async () => {
    const { faux } = creerFauxClientStripe({ id: "cs_test_789", url: null });
    const provider = new StripeProvider(faux);

    await expect(provider.creerSession(DEMANDE)).rejects.toThrow(/URL de session/);
  });
});
