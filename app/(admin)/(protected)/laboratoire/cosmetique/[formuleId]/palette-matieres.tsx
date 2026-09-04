"use client";

import { useMemo, useState } from "react";

import { cn } from "@/lib/utils";
import { FAMILLES_OLFACTIVES, ORDRE_FAMILLES } from "@/components/laboratoire/familles-olfactives";
import type { FamilleOlfactive } from "@/packages/formulation";

import { bienfaitsDe, formatPrix, type MatierePalette } from "./lignes";

export interface PaletteMatieresProps {
  matieres: MatierePalette[];
  dejaAjoutees: Set<string>;
  onAjouter: (matiere: MatierePalette) => void;
}

const NATURE_LABEL: Record<MatierePalette["nature"], string> = {
  naturel: "Naturel",
  synthese: "Synthèse",
};

/**
 * Filtre par défaut : "Actifs cosmétiques" en priorité, mais la palette
 * n'exclut aucune autre famille — une matière à vocation parfum (ex. une
 * touche olfactive en phase des ajouts) peut techniquement entrer dans une
 * formule cosmétique (voir page.tsx, requête non filtrée en base).
 */
const FAMILLE_PAR_DEFAUT: FamilleOlfactive = "actifs_cosmetiques";

export function PaletteMatieres({ matieres, dejaAjoutees, onAjouter }: PaletteMatieresProps) {
  const [recherche, setRecherche] = useState("");
  const [famille, setFamille] = useState<FamilleOlfactive | null>(FAMILLE_PAR_DEFAUT);

  const filtrees = useMemo(() => {
    const q = recherche.trim().toLowerCase();
    return matieres.filter((matiere) => {
      if (famille && matiere.famille_olfactive !== famille) return false;
      if (!q) return true;
      return (
        matiere.nom.toLowerCase().includes(q) ||
        (matiere.inci?.toLowerCase().includes(q) ?? false) ||
        (matiere.facette_libre?.toLowerCase().includes(q) ?? false)
      );
    });
  }, [matieres, recherche, famille]);

  return (
    <aside className="flex flex-col gap-space-md lg:col-span-3">
      <div className="flex flex-col gap-space-sm rounded-xl bg-surface-container-lowest p-space-md shadow-ambient">
        <div className="flex items-center justify-between gap-space-sm">
          <h2 className="font-title-editorial text-[17px] font-light text-encre-baobab">Matières premières</h2>
          <span className="whitespace-nowrap rounded-full bg-vert-moringa/10 px-space-xs py-0.5 font-label-tabular text-[11px] text-vert-moringa">
            {matieres.length} matière{matieres.length > 1 ? "s" : ""}
          </span>
        </div>
        <p className="font-caption-meta text-[11px] text-on-surface-variant">
          Sélectionnez un actif pour l&apos;insérer dans une phase de la formule centrale.
        </p>

        <label className="sr-only" htmlFor="recherche-matiere">
          Rechercher une matière
        </label>
        <input
          id="recherche-matiere"
          type="text"
          value={recherche}
          onChange={(e) => setRecherche(e.target.value)}
          placeholder="Rechercher par nom, INCI…"
          className="w-full rounded bg-surface-container-low px-space-sm py-space-xs font-interface text-[13px] text-encre-baobab placeholder:text-on-surface-variant/60 focus:outline-none focus:ring-1 focus:ring-vert-moringa"
        />

        <div className="flex flex-wrap gap-1 pt-1">
          <button
            type="button"
            onClick={() => setFamille(null)}
            className={cn(
              "rounded-full px-space-xs py-0.5 font-caption-meta text-[11px] transition-colors duration-300 ease-out",
              famille === null
                ? "bg-encre-baobab font-medium text-ivoire-bouye"
                : "bg-surface-container text-on-surface-variant hover:bg-surface-container-high",
            )}
          >
            Toutes
          </button>
          {ORDRE_FAMILLES.map((f) => {
            const info = FAMILLES_OLFACTIVES[f];
            const actif = famille === f;
            return (
              <button
                key={f}
                type="button"
                onClick={() => setFamille(actif ? null : f)}
                className={cn(
                  "rounded-full px-space-xs py-0.5 font-caption-meta text-[11px] transition-colors duration-300 ease-out",
                  actif
                    ? cn(info.bg, "font-medium text-encre-baobab")
                    : "bg-surface-container text-on-surface-variant hover:bg-surface-container-high",
                )}
              >
                {info.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="max-h-[720px] space-y-space-xs overflow-y-auto rounded-xl bg-surface-container-low p-space-sm">
        {filtrees.length === 0 ? (
          <p className="p-space-md text-center font-interface text-caption-meta text-on-surface-variant">
            Aucune matière ne correspond à ces critères.
          </p>
        ) : (
          filtrees.map((matiere) => {
            const ajoutee = dejaAjoutees.has(matiere.id);
            const info = FAMILLES_OLFACTIVES[matiere.famille_olfactive];
            const bienfaits = bienfaitsDe(matiere);
            return (
              <div
                key={matiere.id}
                className="relative overflow-hidden rounded-lg bg-surface-container-lowest p-space-sm shadow-sm transition-colors duration-300 ease-out hover:bg-white"
              >
                <span aria-hidden="true" className={cn("absolute inset-y-0 left-0 w-1", info.bg)} />
                <div className="flex items-start justify-between gap-1 pl-1.5">
                  <div className="space-y-0.5">
                    <h3 className="font-interface text-[13px] font-medium leading-snug text-encre-baobab">
                      {matiere.nom}
                    </h3>
                    <div className="font-label-tabular text-[10px] uppercase tracking-wider text-on-surface-variant">
                      {matiere.inci ?? "INCI non renseigné"}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => onAjouter(matiere)}
                    disabled={ajoutee}
                    aria-label={ajoutee ? `${matiere.nom} déjà dans la formule` : `Ajouter ${matiere.nom} à la formule`}
                    title={ajoutee ? "Déjà dans la formule" : "Ajouter à la formule"}
                    className="shrink-0 font-label-tabular text-[16px] text-on-surface-variant/60 transition-colors hover:text-vert-moringa disabled:cursor-default disabled:text-vert-moringa"
                  >
                    {ajoutee ? "✓" : "+"}
                  </button>
                </div>

                {bienfaits.length > 0 ? (
                  <div className="mt-1.5 flex flex-wrap gap-1 pl-1.5">
                    {bienfaits.slice(0, 3).map((b) => (
                      <span
                        key={b}
                        className="rounded-full bg-vert-moringa/10 px-1.5 py-0.5 font-caption-meta text-[10px] text-vert-moringa"
                      >
                        {b}
                      </span>
                    ))}
                  </div>
                ) : null}

                <div className="mt-2 flex items-center justify-between border-t border-outline-variant/30 pl-1.5 pt-1 font-caption-meta text-[11px] text-on-surface-variant">
                  <span className="flex items-center gap-1">
                    <span>{matiere.origine ?? matiere.fournisseur ?? "—"}</span>
                    <span aria-hidden="true">•</span>
                    <span>{NATURE_LABEL[matiere.nature]}</span>
                  </span>
                  <span className="font-label-tabular text-terre-de-dakar">
                    {matiere.prix_kg > 0 ? `${formatPrix(matiere.prix_kg)}/kg` : "Accord maison"}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </aside>
  );
}
