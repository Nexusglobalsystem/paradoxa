import type { LigneCommandePourPaiement } from "./payment-provider";

/**
 * Vue minimale d'un `produits` tel que relu en base juste avant de créer une
 * session Stripe — jamais construite depuis une valeur envoyée par le client
 * (CLAUDE.md règle n°4 : prix toujours calculé côté serveur).
 */
export interface ProduitDisponible {
  id: string;
  nom: string;
  prix: number;
  devise: string;
  stock: number;
  statut: string;
}

export interface ArticleDemande {
  produitId: string;
  quantite: number;
}

export type RaisonIndisponibilite = "introuvable" | "indisponible" | "stock_insuffisant";

export interface ProblemeDisponibilite {
  produitId: string;
  raison: RaisonIndisponibilite;
  stockDisponible?: number;
}

export type ResultatVerification =
  | { ok: true; lignes: LigneCommandePourPaiement[] }
  | { ok: false; problemes: ProblemeDisponibilite[] };

/**
 * Croise les articles demandés (IDs + quantités, envoyés par le client) avec
 * les produits réellement relus en base : rejette tout produit introuvable,
 * non "actif" (brouillon/épuisé/archivé — voir
 * supabase/migrations/20260903193617_produits.sql), ou en stock
 * insuffisant, puis reconstruit chaque ligne avec le VRAI prix serveur.
 * Fonction pure : `produits` est déjà le résultat d'une lecture Supabase,
 * jamais interrogée ici — testable sans base de données.
 */
export function verifierEtConstruireLignes(
  articles: readonly ArticleDemande[],
  produits: ReadonlyMap<string, ProduitDisponible>,
): ResultatVerification {
  const problemes: ProblemeDisponibilite[] = [];
  const lignes: LigneCommandePourPaiement[] = [];

  for (const article of articles) {
    const produit = produits.get(article.produitId);

    if (!produit) {
      problemes.push({ produitId: article.produitId, raison: "introuvable" });
      continue;
    }
    if (produit.statut !== "actif") {
      problemes.push({ produitId: article.produitId, raison: "indisponible" });
      continue;
    }
    if (produit.stock < article.quantite) {
      problemes.push({ produitId: article.produitId, raison: "stock_insuffisant", stockDisponible: produit.stock });
      continue;
    }

    lignes.push({
      produitId: produit.id,
      nom: produit.nom,
      prixUnitaire: produit.prix,
      quantite: article.quantite,
    });
  }

  if (problemes.length > 0) {
    return { ok: false, problemes };
  }
  return { ok: true, lignes };
}
