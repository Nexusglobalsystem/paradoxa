"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

import {
  calculerFraisLivraison,
  calculerSousTotal,
  calculerTotal,
  montantRestantAvantLivraisonOfferte,
} from "@/app/api/commande/calculs";

/**
 * Panier client, persistant (localStorage) et "optimiste" — .claude/agents/frontend-commerce.md.
 * Volontairement un simple Context + hook plutôt qu'une dépendance d'état
 * globale (Zustand/Redux) : le besoin est un tableau de lignes et quatre
 * actions, rien qui justifie une nouvelle dépendance. Posé dans son propre
 * fichier, importé où nécessaire (panier/, commande/) — n'enveloppe PAS
 * app/(vitrine)/layout.tsx, qui reste commun à toute la vitrine et hors
 * périmètre de cette tâche.
 *
 * Les totaux réutilisent app/api/commande/calculs.ts (fichier pur, déjà
 * partagé avec le serveur) pour un affichage instantané cohérent avec ce
 * que route.ts recalculera à partir des vrais prix en base — jamais une
 * source de vérité, seulement un cache d'affichage (voir le commentaire
 * d'en-tête de app/api/commande/creer-session/route.ts).
 */

export interface ArticlePanier {
  produitId: string;
  slug: string;
  nom: string;
  prixUnitaire: number;
  devise: string;
  image: string;
  maison: "shea" | "ecloree" | "groupe";
  quantite: number;
}

interface PanierContextValeur {
  articles: ArticlePanier[];
  ajouterArticle: (article: Omit<ArticlePanier, "quantite">, quantite?: number) => void;
  retirerArticle: (produitId: string) => void;
  modifierQuantite: (produitId: string, quantite: number) => void;
  viderPanier: () => void;
  nombreArticles: number;
  sousTotal: number;
  fraisLivraison: number;
  total: number;
  restantAvantLivraisonOfferte: number;
  pret: boolean;
}

const CLE_STOCKAGE = "la-paradoxa-panier-v1";

const PanierContext = createContext<PanierContextValeur | null>(null);

function lirePanierStocke(): ArticlePanier[] {
  if (typeof window === "undefined") return [];
  try {
    const brut = window.localStorage.getItem(CLE_STOCKAGE);
    if (!brut) return [];
    const parsed: unknown = JSON.parse(brut);
    return Array.isArray(parsed) ? (parsed as ArticlePanier[]) : [];
  } catch {
    // localStorage indisponible (navigation privée stricte, quota...) ou
    // contenu corrompu : le panier redémarre vide plutôt que de faire
    // planter la page.
    return [];
  }
}

export function PanierProvider({ children }: { children: ReactNode }) {
  const [articles, setArticles] = useState<ArticlePanier[]>([]);
  const [pret, setPret] = useState(false);

  useEffect(() => {
    // Lecture localStorage nécessairement différée à un effet : le rendu
    // serveur (et le premier rendu client, avant hydratation) doit produire
    // le même HTML des deux côtés — impossible de lire localStorage pendant
    // le rendu sans provoquer une erreur d'hydratation. Le panier démarre
    // donc toujours vide, puis se peuple ici une fois monté côté client.
    // eslint-disable-next-line react-hooks/set-state-in-effect -- lecture localStorage post-hydratation, seul point d'entrée possible
    setArticles(lirePanierStocke());
    setPret(true);
  }, []);

  useEffect(() => {
    if (!pret) return; // évite d'écraser le stockage avec [] avant la lecture initiale
    try {
      window.localStorage.setItem(CLE_STOCKAGE, JSON.stringify(articles));
    } catch {
      // Best-effort : un échec d'écriture (quota dépassé) ne doit pas
      // interrompre l'usage du panier en mémoire pour la session en cours.
    }
  }, [articles, pret]);

  const ajouterArticle = useCallback((article: Omit<ArticlePanier, "quantite">, quantite = 1) => {
    setArticles((precedent) => {
      const existant = precedent.find((a) => a.produitId === article.produitId);
      if (existant) {
        return precedent.map((a) =>
          a.produitId === article.produitId ? { ...a, quantite: Math.min(a.quantite + quantite, 99) } : a,
        );
      }
      return [...precedent, { ...article, quantite: Math.min(Math.max(quantite, 1), 99) }];
    });
  }, []);

  const retirerArticle = useCallback((produitId: string) => {
    setArticles((precedent) => precedent.filter((a) => a.produitId !== produitId));
  }, []);

  const modifierQuantite = useCallback((produitId: string, quantite: number) => {
    if (quantite <= 0) {
      setArticles((precedent) => precedent.filter((a) => a.produitId !== produitId));
      return;
    }
    setArticles((precedent) =>
      precedent.map((a) => (a.produitId === produitId ? { ...a, quantite: Math.min(quantite, 99) } : a)),
    );
  }, []);

  const viderPanier = useCallback(() => setArticles([]), []);

  const valeur = useMemo<PanierContextValeur>(() => {
    const sousTotal = calculerSousTotal(articles.map((a) => ({ prixUnitaire: a.prixUnitaire, quantite: a.quantite })));
    const fraisLivraison = calculerFraisLivraison(sousTotal);
    const total = calculerTotal(sousTotal, fraisLivraison);
    return {
      articles,
      ajouterArticle,
      retirerArticle,
      modifierQuantite,
      viderPanier,
      nombreArticles: articles.reduce((acc, a) => acc + a.quantite, 0),
      sousTotal,
      fraisLivraison,
      total,
      restantAvantLivraisonOfferte: montantRestantAvantLivraisonOfferte(sousTotal),
      pret,
    };
  }, [articles, ajouterArticle, retirerArticle, modifierQuantite, viderPanier, pret]);

  return <PanierContext.Provider value={valeur}>{children}</PanierContext.Provider>;
}

export function usePanier(): PanierContextValeur {
  const contexte = useContext(PanierContext);
  if (!contexte) {
    throw new Error("usePanier() doit être appelé sous <PanierProvider>.");
  }
  return contexte;
}
