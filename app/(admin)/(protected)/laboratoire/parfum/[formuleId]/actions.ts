"use server";

import { revalidatePath } from "next/cache";

import type { MaisonGroupeDb, StatutFormule, TypeConcentrationDb } from "@/components/laboratoire/types";
import type { Etage } from "@/packages/formulation";
import { createClient } from "@/lib/supabase/server";

export interface LigneAEnregistrer {
  matiereId: string;
  etage: Etage;
  pourcentage: number;
}

export interface PayloadEnregistrement {
  /** null pour une formule pas encore créée (route "nouvelle"). */
  formuleId: string | null;
  nom: string;
  codeReference: string | null;
  maison: MaisonGroupeDb;
  typeConcentration: TypeConcentrationDb;
  poidsReferenceG: number;
  statut: StatutFormule;
  description: string | null;
  notes: string | null;
  lignes: LigneAEnregistrer[];
}

export type ResultatEnregistrement =
  | { succes: true; formuleId: string }
  | { succes: false; erreur: string };

/**
 * Persiste une formule parfum et l'intégralité de ses lignes.
 *
 * Stratégie de remplacement (documentée ici, comme demandé) : plutôt qu'un
 * diff ligne à ligne, on supprime toutes les formule_lignes existantes de la
 * formule puis on réinsère en bloc l'état courant du composeur. C'est plus
 * simple, et suffisamment sûr dans ce schéma : formule_lignes n'est
 * référencée par aucune autre table (public.lots référence formules.id, pas
 * formule_lignes.id), donc rien ne dépend de l'identité d'une ligne d'une
 * sauvegarde à l'autre. Les deux écritures (delete puis insert) ne sont pas
 * dans une transaction Postgres unique — supabase-js/PostgREST ne l'expose
 * pas côté client — mais l'état du composeur reste intact côté client quoi
 * qu'il arrive : en cas d'échec, l'utilisateur peut toujours cliquer à
 * nouveau sur "Enregistrer" sans avoir perdu la moindre modification.
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

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const enTeteFormule = {
    nom,
    code_reference: payload.codeReference?.trim() || null,
    maison: payload.maison,
    type_formule: "parfum" as const,
    type_concentration: payload.typeConcentration,
    poids_reference_g: payload.poidsReferenceG,
    statut: payload.statut,
    description: payload.description?.trim() || null,
    notes: payload.notes?.trim() || null,
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
    etage: ligne.etage,
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

  revalidatePath(`/laboratoire/parfum/${formuleId}`);
  revalidatePath("/laboratoire/parfum");

  return { succes: true, formuleId };
}
