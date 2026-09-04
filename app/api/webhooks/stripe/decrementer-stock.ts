/**
 * Décrément de stock — DÉCISION D'ARCHITECTURE à valider (signalée dans le
 * rapport de tâche) : idéalement un décrément atomique en une seule
 * instruction SQL (`update produits set stock = greatest(stock - qty, 0)
 * where id = ...`, ou mieux une fonction RPC dédiée) le garantirait sans
 * course possible. Cette vague ne touche pas à supabase/migrations/ (hors
 * périmètre de l'agent), donc aucune fonction RPC de ce type n'existe
 * encore côté base : ce module fait à la place un verrou optimiste
 * classique — lire le stock, réécrire seulement s'il n'a pas bougé depuis
 * (`.eq("stock", stockLu)`), et réessayer un nombre borné de fois en cas de
 * conflit. `produits.stock` porte déjà `check (stock >= 0)` en base (voir
 * supabase/migrations/20260903193617_produits.sql) : ce module ne s'appuie
 * pas sur cette contrainte pour se protéger lui-même (il calcule déjà
 * `Math.max(..., 0)` avant d'écrire), elle reste un filet de sécurité pour
 * toute autre écriture qui oublierait ce garde-fou.
 *
 * `StockRepository` isole l'accès base pour rendre la logique de retry
 * testable sans Supabase réel — voir decrementer-stock.test.ts, qui utilise
 * un dépôt en mémoire simulant un conflit concurrent.
 */

export interface StockRepository {
  /** Renvoie le stock actuel, ou null si le produit n'existe pas/plus. */
  lireStock(produitId: string): Promise<number | null>;
  /**
   * Écrit `nouveauStock` seulement si le stock est encore `stockAttendu`
   * (verrou optimiste). Renvoie `true` si l'écriture a eu lieu, `false` en
   * cas de conflit (le stock a changé entre temps — il faut relire et
   * réessayer).
   */
  ecrireStockSiInchange(produitId: string, stockAttendu: number, nouveauStock: number): Promise<boolean>;
}

export type ResultatDecrementStock =
  | { ok: true; nouveauStock: number }
  | { ok: false; raison: "produit_introuvable" | "trop_de_conflits" };

export async function decrementerStock(
  depot: StockRepository,
  produitId: string,
  quantite: number,
  tentativesMax = 5,
): Promise<ResultatDecrementStock> {
  for (let tentative = 0; tentative < tentativesMax; tentative += 1) {
    const stockActuel = await depot.lireStock(produitId);
    if (stockActuel === null) {
      return { ok: false, raison: "produit_introuvable" };
    }

    // Ne descend jamais sous 0 : une commande payée pour un stock devenu
    // insuffisant entre-temps (vérifié à la création de session, pas
    // réservé — voir app/api/commande/creer-session/route.ts) ne doit
    // jamais produire un stock négatif, elle plafonne à 0.
    const nouveauStock = Math.max(stockActuel - quantite, 0);

    const ecrit = await depot.ecrireStockSiInchange(produitId, stockActuel, nouveauStock);
    if (ecrit) {
      return { ok: true, nouveauStock };
    }
    // Conflit : un autre webhook a modifié le stock entre la lecture et
    // l'écriture — on relit et on retente.
  }

  return { ok: false, raison: "trop_de_conflits" };
}
