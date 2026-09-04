import type { BadgeVariant } from "@/components/ui";

/**
 * Libellés et variantes de badge pour `commandes.statut` (7 valeurs, voir
 * supabase/migrations/20260904135542_commandes.sql) — partagés entre le
 * dashboard (liste des commandes) et le suivi de commande (timeline).
 */
export const LIBELLE_STATUT: Record<string, string> = {
  en_attente_paiement: "En attente de paiement",
  payee: "Payée",
  preparee: "En préparation",
  expediee: "Expédiée",
  livree: "Livrée",
  annulee: "Annulée",
  remboursee: "Remboursée",
};

export const VARIANTE_BADGE_STATUT: Record<string, BadgeVariant> = {
  en_attente_paiement: "neutral",
  payee: "accent",
  preparee: "accent",
  expediee: "accent",
  livree: "success",
  annulee: "danger",
  remboursee: "danger",
};

/**
 * Étape de la timeline de suivi (écran 18, 4 états : confirmée/préparée/
 * expédiée/livrée) atteinte par un statut donné — 0 si le statut est en
 * dehors du parcours normal (annulée/remboursée/en_attente_paiement), les
 * timelines n'ont alors pas de sens à afficher comme "en cours".
 */
export function etapeTimeline(statut: string): 0 | 1 | 2 | 3 | 4 {
  switch (statut) {
    case "payee":
      return 1; // confirmée
    case "preparee":
      return 2;
    case "expediee":
      return 3;
    case "livree":
      return 4;
    default:
      return 0;
  }
}
