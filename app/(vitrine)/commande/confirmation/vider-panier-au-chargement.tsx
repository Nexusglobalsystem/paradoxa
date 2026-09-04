"use client";

import { useEffect, useRef } from "react";

import { usePanier } from "../../panier-provider";

/**
 * Vide le panier localStorage une fois la commande confirmée côté serveur —
 * ne peut se faire qu'ici (le webhook, seul à savoir que le paiement a
 * réellement abouti, n'a lui-même aucun accès au localStorage du
 * navigateur). `useRef` empêche un double vidage si React ré-exécute
 * l'effet (Strict Mode en dev).
 */
export function ViderPanierAuChargement() {
  const { viderPanier } = usePanier();
  const fait = useRef(false);

  useEffect(() => {
    if (fait.current) return;
    fait.current = true;
    viderPanier();
  }, [viderPanier]);

  return null;
}
