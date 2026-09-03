import type { FamilleOlfactive } from "@/packages/formulation";

/**
 * Couleur, libellé et classes utilitaires par famille olfactive — source
 * unique pour les chips de filtre (écran 30), les blocs de la palette et des
 * strates φ (écran 32), et les badges de la fiche matière (écran 31).
 *
 * La correspondance famille → couleur est reprise telle quelle des chips de
 * filtre de laboratoire_biblioth_que_de_mati_res_premi_res/code.html : les 6
 * libellés y sont déjà exactement ceux de matieres.famille_olfactive (voir
 * supabase/migrations/20260903193606_matieres.sql), donc ce mapping n'est
 * pas une interprétation — c'est la maquette elle-même.
 */
export interface FamilleOlfactiveInfo {
  label: string;
  /** Classe `bg-*` pleine — pastilles, blocs de strate. */
  bg: string;
  /** Classe `text-*` — badges texte, libellés colorés. */
  text: string;
  /** Fond de badge très atténué (10%) + texte plein — badges "chip". */
  badgeClass: string;
}

export const FAMILLES_OLFACTIVES: Record<FamilleOlfactive, FamilleOlfactiveInfo> = {
  boise_resines: {
    label: "Boisé & Résines",
    bg: "bg-terre-de-dakar",
    text: "text-terre-de-dakar",
    badgeClass: "bg-terre-de-dakar/10 text-terre-de-dakar",
  },
  floral_botanique: {
    label: "Floral & Botanique",
    bg: "bg-sauge-claire",
    text: "text-sauge-claire",
    badgeClass: "bg-sauge-claire/15 text-encre-baobab",
  },
  ambre_balsamique: {
    label: "Ambré & Balsamique",
    bg: "bg-ocre-solaire",
    text: "text-ocre-solaire",
    badgeClass: "bg-ocre-solaire/10 text-ocre-solaire",
  },
  epice_chaud: {
    label: "Épicé & Chaud",
    bg: "bg-rouge-bissap",
    text: "text-rouge-bissap",
    badgeClass: "bg-rouge-bissap/10 text-rouge-bissap",
  },
  hesperide_frais: {
    label: "Hespéridé & Frais",
    bg: "bg-or-karite",
    text: "text-or-karite",
    badgeClass: "bg-or-karite/15 text-encre-baobab",
  },
  actifs_cosmetiques: {
    label: "Actifs Cosmétiques Purs",
    bg: "bg-vert-moringa",
    text: "text-vert-moringa",
    badgeClass: "bg-vert-moringa/10 text-vert-moringa",
  },
};

export const ORDRE_FAMILLES: FamilleOlfactive[] = [
  "boise_resines",
  "floral_botanique",
  "ambre_balsamique",
  "epice_chaud",
  "hesperide_frais",
  "actifs_cosmetiques",
];

export function estFamilleOlfactive(valeur: string): valeur is FamilleOlfactive {
  return valeur in FAMILLES_OLFACTIVES;
}
