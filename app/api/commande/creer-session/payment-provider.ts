/**
 * Point d'extension pour les moyens de paiement (.claude/agents/api-paiement.md :
 * "Prévoir l'ajout de Wave et Orange Money derrière une abstraction
 * PaymentProvider"). Une seule implémentation réelle existe à ce stade —
 * StripeProvider, dans ./stripe-provider.ts. Wave et Orange Money (paiement
 * mobile, zone UEMOA — voir la maquette
 * /stitch_la_paradoxa/tunnel_de_commande_la_paradoxa/code.html, onglets
 * "Wave UEMOA" / "Orange Money") n'ont pas d'implémentation dans cette
 * vague : ni compte marchand ni SDK disponibles. Le tunnel affiche leurs
 * badges à titre de réassurance visuelle uniquement (voir
 * app/(vitrine)/commande/tunnel-commande.tsx), aucun bouton n'y est branché.
 *
 * Toute nouvelle implémentation (WaveProvider, OrangeMoneyProvider) n'a qu'à
 * respecter cette interface ; app/api/commande/creer-session/route.ts
 * n'aurait alors qu'à choisir le provider selon un champ "methode" envoyé
 * par le client, jamais à changer sa logique de calcul des montants (celle-ci
 * reste dans route.ts / calculs.ts, en amont de tout provider).
 */

export interface LigneCommandePourPaiement {
  produitId: string;
  nom: string;
  prixUnitaire: number;
  quantite: number;
}

export interface CoordonneesLivraison {
  nomComplet: string;
  email: string;
  telephone?: string;
  adresseLigne1: string;
  adresseLigne2?: string;
  codePostal: string;
  ville: string;
  pays: string;
}

export interface DemandeSessionPaiement {
  lignes: LigneCommandePourPaiement[];
  sousTotal: number;
  fraisLivraison: number;
  total: number;
  devise: string;
  livraison: CoordonneesLivraison;
  urlSucces: string;
  urlAnnulation: string;
  /**
   * Utilisateur Supabase Auth connecté au moment du paiement, s'il y en a
   * un — checkout invité par défaut, donc null la plupart du temps. Posé en
   * métadonnée de session (voir stripe-provider.ts) pour que le webhook
   * (app/api/webhooks/stripe/construire-commande.ts) puisse lier
   * commandes.client_id sans re-décoder de session côté serveur.
   */
  clientId: string | null;
}

export interface SessionPaiementCreee {
  url: string;
  sessionId: string;
}

export interface PaymentProvider {
  readonly nom: string;
  creerSession(demande: DemandeSessionPaiement): Promise<SessionPaiementCreee>;
}
