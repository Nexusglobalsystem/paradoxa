import { z } from "zod";

/**
 * Corps attendu par POST /api/commande/creer-session. Volontairement
 * minimal : seuls des IDs produit + quantités transitent depuis le client
 * (jamais un prix — CLAUDE.md règle n°4). route.ts relit `produits.prix` en
 * base pour chaque `produitId` avant de calculer quoi que ce soit.
 */
export const ArticlePanierSchema = z.object({
  produitId: z.string().uuid("Identifiant produit invalide."),
  quantite: z.number().int().min(1).max(99),
});

export const LivraisonSchema = z.object({
  nomComplet: z.string().trim().min(2, "Nom complet requis (2 caractères minimum).").max(200),
  email: z.string().trim().email("Adresse email invalide."),
  telephone: z.string().trim().max(30).optional(),
  adresseLigne1: z.string().trim().min(3, "Adresse requise.").max(200),
  adresseLigne2: z.string().trim().max(200).optional(),
  codePostal: z.string().trim().min(2, "Code postal requis.").max(20),
  ville: z.string().trim().min(1, "Ville requise.").max(120),
  pays: z.string().trim().length(2, "Code pays ISO à 2 lettres attendu (ex. FR).").default("FR"),
});

export const CreerSessionSchema = z.object({
  articles: z.array(ArticlePanierSchema).min(1, "Le panier est vide.").max(50),
  livraison: LivraisonSchema,
});

export type CreerSessionEntree = z.infer<typeof CreerSessionSchema>;

export interface CreerSessionReponseSucces {
  url: string;
}

export interface CreerSessionReponseErreur {
  erreur: string;
  details?: string[];
}
