import type { Metadata } from "next";

import { GenerationStudio } from "./generation-studio";

export const metadata: Metadata = {
  title: "Génération assistée par IA — Laboratoire LA PARADOXA",
};

/**
 * Écran 33 (design/INVENTAIRE.md) : studio de composition assistée par IA.
 * Server Component minimal — toute l'interactivité (prompt, chips, appel à
 * /api/laboratoire/generation) vit dans generation-studio.tsx ("use client").
 */
export default function GenerationPage() {
  return <GenerationStudio />;
}
