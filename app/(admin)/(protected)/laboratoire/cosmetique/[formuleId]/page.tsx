import type { Metadata } from "next";
import Link from "next/link";

import type { FormuleLigneRow, FormuleRow } from "@/components/laboratoire/types";
import type { LigneFormule } from "@/packages/formulation";
import { createClient } from "@/lib/supabase/server";

import { ComposeurCosmetique } from "./composeur-cosmetique";
import { ligneDepuisMatiere, type MatierePalette } from "./lignes";
import { extrairePhCible } from "./ph";

export const metadata: Metadata = {
  title: "Composeur cosmétique — Laboratoire LA PARADOXA",
};

const NOUVELLE = "nouvelle";

interface PageProps {
  params: Promise<{ formuleId: string }>;
}

/**
 * Écran 34 (design/INVENTAIRE.md) : composeur cosmétique. Même architecture
 * que le composeur de parfum (app/(admin)/(protected)/laboratoire/parfum/[formuleId]/page.tsx) :
 * Server Component — charge la palette de matières actives et, hors du cas
 * "nouvelle", la formule et ses lignes existantes ; toute l'interactivité
 * (ajout/retrait de matière, édition des %/phases, sauvegarde) vit dans
 * composeur-cosmetique.tsx ("use client"). `key={formuleId}` force un
 * remontage complet du composeur client à chaque changement d'identité de
 * formule, pour la même raison que côté parfum.
 */
export default async function ComposeurCosmetiquePage({ params }: PageProps) {
  const { formuleId } = await params;
  const estNouvelle = formuleId === NOUVELLE;

  const supabase = await createClient();

  // Contrairement au composeur de parfum, la palette n'est PAS filtrée en
  // base par famille : une matière de n'importe quelle famille olfactive
  // peut techniquement entrer dans une formule cosmétique (un actif capillé
  // en phase E, par exemple). Le filtre "Actifs cosmétiques en priorité"
  // demandé par le brief vit côté UI (palette-matieres.tsx présélectionne
  // ce chip, mais "Toutes" reste disponible).
  const { data: matieresData } = await supabase
    .from("matieres")
    .select("*")
    .eq("statut", "actif")
    .order("nom", { ascending: true });
  const matieres = (matieresData ?? []) as MatierePalette[];

  let formule: FormuleRow | null = null;
  let lignesInitiales: LigneFormule[] = [];
  let matieresFormule: MatierePalette[] = [];
  let phCibleInitial: number | null = null;
  let resteNotesInitial: string | null = null;

  if (!estNouvelle) {
    const { data: formuleData, error: erreurFormule } = await supabase
      .from("formules")
      .select("*")
      .eq("id", formuleId)
      .eq("type_formule", "cosmetique")
      .maybeSingle();

    if (erreurFormule || !formuleData) {
      return <FormuleIntrouvable />;
    }
    formule = formuleData as FormuleRow;
    const { phCible, resteNotes } = extrairePhCible(formule.notes);
    phCibleInitial = phCible;
    resteNotesInitial = resteNotes;

    const { data: lignesData } = await supabase
      .from("formule_lignes")
      .select("*, matiere:matieres(*)")
      .eq("formule_id", formule.id)
      .order("ordre", { ascending: true });

    const lignesRows = (lignesData ?? []) as (FormuleLigneRow & { matiere: MatierePalette })[];
    lignesInitiales = lignesRows.map((ligne) =>
      ligneDepuisMatiere(ligne.matiere, ligne.phase ?? "ajouts", Number(ligne.pourcentage)),
    );
    matieresFormule = lignesRows.map((ligne) => ligne.matiere);
  }

  return (
    <ComposeurCosmetique
      key={formuleId}
      formuleId={estNouvelle ? null : formuleId}
      formuleInitiale={formule}
      lignesInitiales={lignesInitiales}
      phCibleInitial={phCibleInitial}
      resteNotesInitial={resteNotesInitial}
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
        Cette formule n&apos;existe pas, ou n&apos;est pas une formule de type cosmétique.
      </p>
      <Link
        href="/laboratoire/cosmetique/nouvelle"
        className="inline-flex items-center gap-space-xs font-interface text-body-ui text-vert-moringa underline-offset-2 hover:underline"
      >
        Composer une nouvelle formule
      </Link>
    </div>
  );
}
