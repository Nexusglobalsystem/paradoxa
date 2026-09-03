/**
 * Supabase glue: loads the real, active `matieres` catalogue (+ their IFRA
 * limits) so the route handler can pass it to the model as the only source
 * of truth for what it's allowed to compose with. Kept separate from
 * generer-proposition.ts (which stays pure/testable) — this module is the
 * one place that touches the database.
 */
import type { SupabaseClient } from "@supabase/supabase-js";

import type { CategorieIFRA, FamilleOlfactive } from "@/packages/formulation";

import type { MatiereDisponible } from "./schema";

interface MatiereRow {
  id: string;
  nom: string;
  inci: string | null;
  famille_olfactive: string;
  volatilite: string | null;
  puissance: number;
  prix_kg: number;
}

interface LimiteIfraRow {
  matiere_id: string;
  categorie_ifra: string;
  seuil_pourcentage: number | null;
}

/**
 * Loads every active material plus its IFRA limits, keyed by id — the shape
 * the generator needs to (a) list candidates to the model and (b) hydrate /
 * reject the model's response line by line.
 */
export async function chargerMatieresDisponibles(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- no generated Database type exists yet in this project (see lib/supabase/*); untyped client is the only option.
  supabase: SupabaseClient<any, any, any>,
): Promise<Map<string, MatiereDisponible>> {
  const { data: matieres, error: erreurMatieres } = await supabase
    .from("matieres")
    .select("id, nom, inci, famille_olfactive, volatilite, puissance, prix_kg")
    .eq("statut", "actif")
    .returns<MatiereRow[]>();

  if (erreurMatieres) {
    throw new Error(`Impossible de charger les matières : ${erreurMatieres.message}`);
  }

  const lignesMatieres = matieres ?? [];
  const limitesParMatiere = new Map<string, Partial<Record<CategorieIFRA, number>>>();

  if (lignesMatieres.length > 0) {
    const { data: limites, error: erreurLimites } = await supabase
      .from("matiere_limites_ifra")
      .select("matiere_id, categorie_ifra, seuil_pourcentage")
      .in(
        "matiere_id",
        lignesMatieres.map((m) => m.id),
      )
      .returns<LimiteIfraRow[]>();

    if (erreurLimites) {
      throw new Error(`Impossible de charger les limites IFRA : ${erreurLimites.message}`);
    }

    for (const limite of limites ?? []) {
      if (limite.seuil_pourcentage === null) continue;
      const carte = limitesParMatiere.get(limite.matiere_id) ?? {};
      carte[limite.categorie_ifra] = Number(limite.seuil_pourcentage);
      limitesParMatiere.set(limite.matiere_id, carte);
    }
  }

  const resultat = new Map<string, MatiereDisponible>();
  for (const m of lignesMatieres) {
    resultat.set(m.id, {
      id: m.id,
      nom: m.nom,
      inci: m.inci ?? undefined,
      prixParKg: Number(m.prix_kg),
      familleOlfactive: m.famille_olfactive as FamilleOlfactive,
      limiteIFRA: limitesParMatiere.get(m.id),
      volatilite: m.volatilite,
      puissance: m.puissance,
    });
  }
  return resultat;
}
