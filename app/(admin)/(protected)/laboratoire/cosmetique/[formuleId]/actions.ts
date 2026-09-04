"use server";

import { revalidatePath } from "next/cache";

import type { MaisonGroupeDb, StatutFormule } from "@/components/laboratoire/types";
import type { PhaseCosmetique } from "@/packages/formulation";
import { createClient } from "@/lib/supabase/server";

export interface LigneAEnregistrer {
  matiereId: string;
  phase: PhaseCosmetique;
  pourcentage: number;
}

export interface PayloadEnregistrement {
  /** null pour une formule pas encore créée (route "nouvelle"). */
  formuleId: string | null;
  nom: string;
  codeReference: string | null;
  maison: MaisonGroupeDb;
  poidsReferenceG: number;
  statut: StatutFormule;
  phCible: number | null;
  description: string | null;
  notesExistantes: string | null;
  lignes: LigneAEnregistrer[];
}

export type ResultatEnregistrement =
  | { succes: true; formuleId: string }
  | { succes: false; erreur: string };

/**
 * Persiste une formule cosmétique et l'intégralité de ses lignes.
 *
 * Même stratégie de remplacement que le composeur de parfum (voir
 * app/(admin)/(protected)/laboratoire/parfum/[formuleId]/actions.ts pour la
 * justification complète, reprise ici à l'identique) : plutôt qu'un diff
 * ligne à ligne, on supprime toutes les formule_lignes existantes de la
 * formule puis on réinsère en bloc l'état courant du composeur. Sûr dans ce
 * schéma pour la même raison : formule_lignes n'est référencée par aucune
 * autre table (public.lots référence formules.id, pas formule_lignes.id).
 * Les deux écritures (delete puis insert) ne sont pas dans une transaction
 * Postgres unique — supabase-js/PostgREST ne l'expose pas côté client —
 * mais l'état du composeur reste intact côté client quoi qu'il arrive : en
 * cas d'échec, l'utilisateur peut toujours cliquer à nouveau sur
 * "Enregistrer" sans avoir perdu la moindre modification.
 *
 * type_concentration est forcé à null (contrainte formules_concentration_coherente
 * de supabase/migrations/20260903193612_formules.sql : une formule cosmétique
 * ne porte jamais de concentration EDT/EDP/EXTRAIT, réservée au parfum).
 */
export async function enregistrerFormule(payload: PayloadEnregistrement): Promise<ResultatEnregistrement> {
  const nom = payload.nom.trim();
  if (!nom) {
    return { succes: false, erreur: "Le nom de la formule est requis." };
  }
  if (payload.lignes.length === 0) {
    return { succes: false, erreur: "Ajoutez au moins une matière avant d'enregistrer." };
  }
  for (const ligne of payload.lignes) {
    if (!Number.isFinite(ligne.pourcentage) || ligne.pourcentage <= 0 || ligne.pourcentage > 100) {
      return {
        succes: false,
        erreur: "Chaque matière doit avoir un pourcentage strictement compris entre 0 et 100.",
      };
    }
  }
  if (!Number.isFinite(payload.poidsReferenceG) || payload.poidsReferenceG <= 0) {
    return { succes: false, erreur: "Le poids de référence doit être un nombre positif." };
  }
  if (
    payload.phCible !== null &&
    (!Number.isFinite(payload.phCible) || payload.phCible < 0 || payload.phCible > 14)
  ) {
    return { succes: false, erreur: "Le pH cible doit être compris entre 0 et 14." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const enTeteFormule = {
    nom,
    code_reference: payload.codeReference?.trim() || null,
    maison: payload.maison,
    type_formule: "cosmetique" as const,
    type_concentration: null,
    poids_reference_g: payload.poidsReferenceG,
    statut: payload.statut,
    description: payload.description?.trim() || null,
    notes: payload.notesExistantes?.trim() || null,
    ph_cible: payload.phCible,
    updated_by: user?.id ?? null,
  };

  let formuleId = payload.formuleId;
  let formuleVientDetreCreee = false;

  if (!formuleId) {
    const { data, error } = await supabase
      .from("formules")
      .insert({ ...enTeteFormule, created_by: user?.id ?? null })
      .select("id")
      .single();

    if (error || !data) {
      return {
        succes: false,
        erreur: `Échec de la création de la formule : ${error?.message ?? "erreur inconnue"}`,
      };
    }
    formuleId = data.id;
    formuleVientDetreCreee = true;
  } else {
    const { error } = await supabase.from("formules").update(enTeteFormule).eq("id", formuleId);
    if (error) {
      return { succes: false, erreur: `Échec de la mise à jour de la formule : ${error.message}` };
    }
  }

  const { error: erreurSuppression } = await supabase
    .from("formule_lignes")
    .delete()
    .eq("formule_id", formuleId);

  if (erreurSuppression) {
    return { succes: false, erreur: `Échec du remplacement des lignes : ${erreurSuppression.message}` };
  }

  const lignesAInserer = payload.lignes.map((ligne, index) => ({
    formule_id: formuleId as string,
    matiere_id: ligne.matiereId,
    phase: ligne.phase,
    pourcentage: ligne.pourcentage,
    grammes: (ligne.pourcentage / 100) * payload.poidsReferenceG,
    ordre: index,
  }));

  const { error: erreurLignes } = await supabase.from("formule_lignes").insert(lignesAInserer);

  if (erreurLignes) {
    if (formuleVientDetreCreee) {
      // Jamais de formule orpheline sans lignes : on retire l'en-tête qu'on
      // vient de créer plutôt que de laisser un brouillon vide en base.
      await supabase.from("formules").delete().eq("id", formuleId);
    }
    return { succes: false, erreur: `Échec de l'enregistrement des lignes : ${erreurLignes.message}` };
  }

  revalidatePath(`/laboratoire/cosmetique/${formuleId}`);
  revalidatePath("/laboratoire/cosmetique");

  return { succes: true, formuleId };
}
