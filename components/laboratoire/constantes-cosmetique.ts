import type { PhaseCosmetique } from "@/packages/formulation";

/**
 * Constantes des 5 blocs de phase du composeur cosmétique (écran 34,
 * design/INVENTAIRE.md) — même rôle que constantes-parfum.ts pour les
 * étages du composeur de parfum.
 *
 * Le libellé et la correspondance lettre A-E reprennent tels quels
 * composeur_cosm_tique_laboratoire_clor_e/code.html ("Composition des 5
 * Phases") et le commentaire canonique de
 * supabase/migrations/20260903193612_formules.sql qui fixe la
 * correspondance :
 *   A Aqueuse Hydratante / B Huileuse & Baumes Solides / C Émulsion à Froid /
 *   D Actifs Thermolabiles / E Stabilisation & Ajustement pH
 * mappées ici sur aqueuse/huileuse/emulsion/refroidissement/ajouts.
 */
export const ORDRE_PHASES: PhaseCosmetique[] = [
  "aqueuse",
  "huileuse",
  "emulsion",
  "refroidissement",
  "ajouts",
];

export const LETTRE_PHASE: Record<PhaseCosmetique, string> = {
  aqueuse: "A",
  huileuse: "B",
  emulsion: "C",
  refroidissement: "D",
  ajouts: "E",
};

export const LIBELLE_PHASE: Record<PhaseCosmetique, string> = {
  aqueuse: "Phase aqueuse",
  huileuse: "Phase huileuse",
  emulsion: "Phase émulsion",
  refroidissement: "Phase de refroidissement",
  ajouts: "Phase des ajouts",
};

/** Sous-titre affiché sous le libellé de chaque bloc de phase. */
export const SOUS_LIBELLE_PHASE: Record<PhaseCosmetique, string> = {
  aqueuse: "Hydratante — ambiante 20-25°C",
  huileuse: "Baumes & corps gras — homogénéisation douce",
  emulsion: "Émulsion à froid — cisaillement",
  refroidissement: "Actifs thermolabiles — incorporation sous 35°C",
  ajouts: "Stabilisation & ajustement pH — finition",
};

/**
 * Couleur d'accent par phase — reprise telle quelle des pastilles A-E de la
 * maquette (bg = pastille pleine/barre latérale, text = libellé coloré,
 * dotBg = fond très atténué de la pastille lettrée).
 */
export const COULEUR_PHASE: Record<PhaseCosmetique, { bg: string; text: string; dotBg: string }> = {
  aqueuse: { bg: "bg-sauge-claire", text: "text-vert-moringa", dotBg: "bg-sauge-claire/25" },
  huileuse: { bg: "bg-or-karite", text: "text-or-karite-strong", dotBg: "bg-or-karite/20" },
  emulsion: { bg: "bg-sable", text: "text-encre-baobab", dotBg: "bg-sable" },
  refroidissement: { bg: "bg-vert-moringa", text: "text-vert-moringa", dotBg: "bg-vert-moringa/20" },
  ajouts: { bg: "bg-terre-de-dakar", text: "text-terre-de-dakar", dotBg: "bg-terre-de-dakar/20" },
};
