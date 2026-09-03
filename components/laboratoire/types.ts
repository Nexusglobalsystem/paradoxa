import type { Etage, FamilleOlfactive, PhaseCosmetique } from "@/packages/formulation";

/**
 * Formes des lignes renvoyées par Supabase pour les tables du laboratoire.
 * Le projet n'a pas encore de types générés (`pnpm db:types` / database.types.ts
 * n'existe pas au moment de cette vague) — ces interfaces sont donc écrites à
 * la main à partir du SQL exact de supabase/migrations/20260903193606_matieres.sql
 * et .../193612_formules.sql plutôt que dérivées d'un générateur. Si
 * database.types.ts apparaît plus tard, ce fichier peut être remplacé par des
 * alias `Database["public"]["Tables"][...]["Row"]`.
 */

export interface AllergeneDonnee {
  nom: string;
  numeroCAS?: string;
}

/**
 * Forme optionnelle lue dans matieres.donnees_complementaires — le schéma ne
 * modélise pas les allergènes en colonnes dédiées (voir commentaire de la
 * migration : "facettes organoleptiques, indices physico-chimiques,
 * certifications..."), donc ce JSON est la seule source possible pour
 * peupler LigneFormule.allergenes. Absent la plupart du temps : traité comme
 * "aucun allergène déclaré", jamais fabriqué côté UI.
 */
export interface DonneesComplementaires {
  allergenes?: AllergeneDonnee[];
  facettes?: { nom: string; pourcentage: number }[];
  [cle: string]: unknown;
}

export interface MatiereRow {
  id: string;
  nom: string;
  reference_interne: string | null;
  nature: "naturel" | "synthese";
  est_captif: boolean;
  inci: string | null;
  cas_number: string | null;
  fournisseur: string | null;
  origine: string | null;
  famille_olfactive: FamilleOlfactive;
  facette_libre: string | null;
  volatilite: "tete" | "tete_coeur" | "coeur" | "coeur_fond" | "fond" | null;
  puissance: number;
  prix_kg: number;
  stock_kg: number;
  seuil_alerte_stock_kg: number | null;
  statut: "actif" | "archive";
  notes: string | null;
  donnees_complementaires: DonneesComplementaires;
  created_at: string;
  updated_at: string;
}

export interface MatiereLimiteIfraRow {
  id: string;
  matiere_id: string;
  categorie_ifra: string;
  application_typique: string | null;
  seuil_pourcentage: number | null;
  seuil_libelle: string | null;
  statut: "libre" | "conforme" | "attention" | "non_conforme";
}

export type MaisonGroupeDb = "shea" | "ecloree";
export type TypeConcentrationDb = "edt" | "edp" | "extrait";
export type StatutFormule = "brouillon" | "en_test" | "validee" | "production" | "archivee";

export interface FormuleRow {
  id: string;
  nom: string;
  code_reference: string | null;
  maison: MaisonGroupeDb;
  type_formule: "parfum" | "cosmetique";
  type_concentration: TypeConcentrationDb | null;
  poids_reference_g: number;
  version: number;
  formule_parent_id: string | null;
  est_version_courante: boolean;
  statut: StatutFormule;
  description: string | null;
  notes: string | null;
  updated_at: string;
}

export interface FormuleLigneRow {
  id: string;
  formule_id: string;
  matiere_id: string;
  etage: Etage | null;
  phase: PhaseCosmetique | null;
  pourcentage: number;
  grammes: number | null;
  ordre: number;
  notes: string | null;
}

/** formule_lignes jointe à matieres — ce que les composeurs consomment réellement. */
export interface FormuleLigneAvecMatiere extends FormuleLigneRow {
  matiere: MatiereRow;
  limitesIfra: MatiereLimiteIfraRow[];
}
