"use client";

import { useState } from "react";
import type { ReactNode } from "react";

import { Button, type ButtonProps } from "@/components/ui";

import { usePanier, type ArticlePanier } from "./panier-provider";

/**
 * Bouton "Ajouter au panier" partagé par les 4 écrans produit de la Vague 3
 * (collection SHÉA, fiche parfum, catégorie ÉCLORÉE, fiche produit
 * cosmétique) — un seul point d'intégration avec usePanier() plutôt que
 * quatre implémentations légèrement divergentes. Chaque page garde le
 * contrôle total de l'apparence (elle fournit ses propres `children`,
 * `variant`, `size`, `className`) ; ce composant n'ajoute que le
 * comportement (ajout au panier + confirmation visuelle transitoire).
 */
interface BoutonAjouterPanierProps extends Omit<ButtonProps, "onClick" | "type" | "children"> {
  article: Omit<ArticlePanier, "quantite">;
  quantite?: number;
  children: ReactNode;
}

export function BoutonAjouterPanier({ article, quantite = 1, children, ...props }: BoutonAjouterPanierProps) {
  const { ajouterArticle } = usePanier();
  const [ajoute, setAjoute] = useState(false);

  function gerer() {
    ajouterArticle(article, quantite);
    setAjoute(true);
    window.setTimeout(() => setAjoute(false), 1800);
  }

  return (
    <Button type="button" onClick={gerer} aria-live="polite" {...props}>
      {ajoute ? "Ajouté au panier ✓" : children}
    </Button>
  );
}
