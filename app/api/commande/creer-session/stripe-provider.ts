import Stripe from "stripe";

import { construireLigneItemsStripe } from "./construire-payload-stripe";
import type { DemandeSessionPaiement, PaymentProvider, SessionPaiementCreee } from "./payment-provider";

/**
 * Seule implémentation réelle de PaymentProvider pour cette vague. Stripe
 * Checkout hébergé : aucune donnée de carte ne transite par notre
 * infrastructure (.claude/agents/api-paiement.md), ce composant ne fait que
 * demander une URL de session et rediriger l'acheteur vers Stripe.
 */
export class StripeProvider implements PaymentProvider {
  readonly nom = "stripe" as const;

  private readonly client: Stripe;

  /**
   * `client` est injectable pour les tests unitaires (aucun appel réseau
   * réel n'est fait dans construire-payload-stripe.test.ts / ce fichier —
   * voir stripe-provider.test.ts, qui passe un faux client dont
   * `checkout.sessions.create` est un mock). En production, route.ts
   * n'injecte rien : le client Stripe réel est construit ici à partir de
   * STRIPE_SECRET_KEY.
   */
  constructor(client?: Stripe) {
    if (client) {
      this.client = client;
      return;
    }
    const cleSecrete = process.env.STRIPE_SECRET_KEY;
    if (!cleSecrete) {
      throw new PaymentProviderIndisponibleError(
        "STRIPE_SECRET_KEY n'est pas configurée côté serveur (voir .env.local / .env.example). " +
          "Impossible de créer une session de paiement réelle tant que cette clé n'est pas renseignée.",
      );
    }
    // apiVersion volontairement omise : on suit la version pinnée par défaut
    // du SDK installé (package.json → "stripe") plutôt que de dupliquer un
    // numéro de version en dur ici, qui dériverait silencieusement des mises
    // à jour du SDK.
    this.client = new Stripe(cleSecrete);
  }

  async creerSession(demande: DemandeSessionPaiement): Promise<SessionPaiementCreee> {
    const line_items = construireLigneItemsStripe(demande.lignes, demande.fraisLivraison, demande.devise);

    const session = await this.client.checkout.sessions.create({
      mode: "payment",
      line_items,
      customer_email: demande.livraison.email,
      success_url: demande.urlSucces,
      cancel_url: demande.urlAnnulation,
      // Montants déjà calculés côté serveur (route.ts, à partir de
      // produits.prix) : on les recopie tels quels en métadonnées pour que
      // le webhook checkout.session.completed n'ait besoin ni de refaire
      // le calcul, ni d'interroger produits une seconde fois pour figer
      // commandes.sous_total / frais_livraison / total. Les lignes produit
      // elles-mêmes sont retrouvées via listLineItems, pas via ces
      // métadonnées (voir app/api/webhooks/stripe/construire-commande.ts).
      metadata: {
        client_id: demande.clientId ?? "",
        nom_complet: demande.livraison.nomComplet,
        email: demande.livraison.email,
        telephone: demande.livraison.telephone ?? "",
        adresse_ligne1: demande.livraison.adresseLigne1,
        adresse_ligne2: demande.livraison.adresseLigne2 ?? "",
        code_postal: demande.livraison.codePostal,
        ville: demande.livraison.ville,
        pays: demande.livraison.pays,
        sous_total: demande.sousTotal.toFixed(2),
        frais_livraison: demande.fraisLivraison.toFixed(2),
        total: demande.total.toFixed(2),
        devise: demande.devise,
      },
    });

    if (!session.url) {
      throw new Error("Stripe n'a pas renvoyé d'URL de session Checkout.");
    }

    return { url: session.url, sessionId: session.id };
  }
}

export class PaymentProviderIndisponibleError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "PaymentProviderIndisponibleError";
  }
}
