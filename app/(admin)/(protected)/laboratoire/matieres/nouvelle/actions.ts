"use server";

import { redirect } from "next/navigation";

import { estFamilleOlfactive } from "@/components/laboratoire/familles-olfactives";
import { createClient } from "@/lib/supabase/server";

export interface EtatNouvelleMatiere {
  erreur?: string;
}

function nombreOuNull(valeur: FormDataEntryValue | null): number | null {
  if (!valeur) return null;
  const n = Number(valeur);
  return Number.isFinite(n) ? n : null;
}

export async function creerMatiere(
  _etatPrecedent: EtatNouvelleMatiere,
  formData: FormData,
): Promise<EtatNouvelleMatiere> {
  const nom = String(formData.get("nom") ?? "").trim();
  const familleOlfactive = String(formData.get("famille_olfactive") ?? "");
  const puissance = Number(formData.get("puissance") ?? 3);
  const prixKg = Number(formData.get("prix_kg") ?? 0);

  if (!nom) {
    return { erreur: "Le nom de la matière est requis." };
  }
  if (!estFamilleOlfactive(familleOlfactive)) {
    return { erreur: "Famille olfactive invalide." };
  }
  if (!Number.isFinite(puissance) || puissance < 1 || puissance > 5) {
    return { erreur: "La puissance doit être comprise entre 1 et 5." };
  }
  if (!Number.isFinite(prixKg) || prixKg < 0) {
    return { erreur: "Le prix au kg doit être un nombre positif." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from("matieres")
    .insert({
      nom,
      reference_interne: String(formData.get("reference_interne") ?? "").trim() || null,
      nature: String(formData.get("nature") ?? "naturel"),
      est_captif: formData.get("est_captif") === "on",
      inci: String(formData.get("inci") ?? "").trim() || null,
      cas_number: String(formData.get("cas_number") ?? "").trim() || null,
      fournisseur: String(formData.get("fournisseur") ?? "").trim() || null,
      origine: String(formData.get("origine") ?? "").trim() || null,
      famille_olfactive: familleOlfactive,
      facette_libre: String(formData.get("facette_libre") ?? "").trim() || null,
      volatilite: String(formData.get("volatilite") ?? "") || null,
      puissance,
      prix_kg: prixKg,
      stock_kg: nombreOuNull(formData.get("stock_kg")) ?? 0,
      created_by: user?.id ?? null,
      updated_by: user?.id ?? null,
    })
    .select("id")
    .single();

  if (error || !data) {
    return { erreur: `Échec de l'enregistrement : ${error?.message ?? "erreur inconnue"}` };
  }

  redirect(`/laboratoire/matieres/${data.id}`);
}
