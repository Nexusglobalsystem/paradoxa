import type { Metadata } from "next";
import Link from "next/link";

import type { FormuleLigneRow, FormuleRow } from "@/components/laboratoire/types";
import type { LigneFormule } from "@/packages/formulation";
import { createClient } from "@/lib/supabase/server";

import { ComposeurParfum } from "./composeur-parfum";
import { ligneDepuisMatiere, type MatierePalette } from "./lignes";

export const metadata: Metadata = {
  title: "Composeur de parfum — Laboratoire LA PARADOXA",
};

const NOUVELLE = "nouvelle";

interface PageProps {
  params: Promise<{ formuleId: string }>;
}

/**
 * Écran 32 (design/INVENTAIRE.md) : composeur de parfum. Server Component —
 * charge la palette de matières actives et, hors du cas "nouvelle", la
 * formule et ses lignes existantes ; toute l'interactivité (ajout/retrait de
 * matière, édition des %, équilibrage φ, sauvegarde) vit dans
 * composeur-parfum.tsx ("use client"). `key={formuleId}` force un
 * remontage complet du composeur client à chaque changement d'identité de
 * formule (ex. juste après la création d'une "nouvelle" formule, une fois
 * redirigé vers son id réel) : sans lui, useState garderait l'état de
 * l'ancien rendu plutôt que de refléter les props fraîchement chargées.
 */
export default async function ComposeurParfumPage({ params }: PageProps) {
  const { formuleId } = await params;
  const estNouvelle = formuleId === NOUVELLE;

  const supabase = await createClient();

  const { data: matieresData } = await supabase
    .from("matieres")
    .select("*, matiere_limites_ifra(*)")
    .eq("statut", "actif")
    .neq("famille_olfactive", "actifs_cosmetiques")
    .order("nom", { ascending: true });
  const matieres = (matieresData ?? []) as MatierePalette[];

  let formule: FormuleRow | null = null;
  let lignesInitiales: LigneFormule[] = [];
  let matieresFormule: MatierePalette[] = [];

  if (!estNouvelle) {
    const { data: formuleData, error: erreurFormule } = await supabase
      .from("formules")
      .select("*")
      .eq("id", formuleId)
      .eq("type_formule", "parfum")
      .maybeSingle();

    if (erreurFormule || !formuleData) {
      return <FormuleIntrouvable />;
    }
    formule = formuleData as FormuleRow;

    const { data: lignesData } = await supabase
      .from("formule_lignes")
      .select("*, matiere:matieres(*, matiere_limites_ifra(*))")
      .eq("formule_id", formule.id)
      .order("ordre", { ascending: true });

    const lignesRows = (lignesData ?? []) as (FormuleLigneRow & { matiere: MatierePalette })[];
    lignesInitiales = lignesRows.map((ligne) =>
      ligneDepuisMatiere(ligne.matiere, ligne.etage ?? "coeur", Number(ligne.pourcentage)),
    );
    matieresFormule = lignesRows.map((ligne) => ligne.matiere);
  }

  return (
    <ComposeurParfum
      key={formuleId}
      formuleId={estNouvelle ? null : formuleId}
      formuleInitiale={formule}
      lignesInitiales={lignesInitiales}
      matieres={matieres}
      matieresFormule={matieresFormule}
    />
  );
}

function FormuleIntrouvable() {
  return (
    <div className="mx-auto max-w-2xl space-y-space-md px-space-lg py-space-3xl text-center">
      <h1 className="font-display text-headline-md text-encre-baobab">Formule introuvable</h1>
      <p className="font-interface text-body-ui text-on-surface-variant">
        Cette formule n&apos;existe pas, ou n&apos;est pas une formule de type parfum.
      </p>
      <Link
        href="/laboratoire/parfum/nouvelle"
        className="inline-flex items-center gap-space-xs font-interface text-body-ui text-terre-de-dakar underline-offset-2 hover:underline"
      >
        Composer une nouvelle formule
      </Link>
    </div>
  );
}
