import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database } from "@/lib/supabase/database.types";

import type { StockRepository } from "./decrementer-stock";

/**
 * Implémentation réelle de StockRepository, adossée au client service_role
 * (voir lib/supabase/service-role.ts). Séparée de la logique de retry pure
 * (decrementer-stock.ts) exprès : ce fichier n'est pas testé unitairement
 * lui-même (il ne ferait qu'exercer le client Supabase réel), c'est
 * decrementerStock() qui l'est, avec un faux dépôt en mémoire.
 */
export function creerStockRepositorySupabase(
  supabase: SupabaseClient<Database>,
): StockRepository {
  return {
    async lireStock(produitId) {
      const { data, error } = await supabase
        .from("produits")
        .select("stock")
        .eq("id", produitId)
        .maybeSingle();
      if (error) {
        console.error("webhook.stripe.stock.erreur_lecture", { produitId, erreur: error.message });
        return null;
      }
      return data?.stock ?? null;
    },

    async ecrireStockSiInchange(produitId, stockAttendu, nouveauStock) {
      const { data, error } = await supabase
        .from("produits")
        .update({ stock: nouveauStock })
        .eq("id", produitId)
        .eq("stock", stockAttendu)
        .select("id");
      if (error) {
        console.error("webhook.stripe.stock.erreur_ecriture", { produitId, erreur: error.message });
        return false;
      }
      return (data?.length ?? 0) > 0;
    },
  };
}
