"use client";

import { useMemo, useState } from "react";

import { cn } from "@/lib/utils";
import { FAMILLES_OLFACTIVES, ORDRE_FAMILLES } from "@/components/laboratoire/familles-olfactives";
import { PuissanceDots } from "@/components/laboratoire/puissance-dots";
import type { FamilleOlfactive } from "@/packages/formulation";

import { formatPrix, type MatierePalette } from "./lignes";

export interface PaletteMatieresProps {
  matieres: MatierePalette[];
  dejaAjoutees: Set<string>;
  onAjouter: (matiere: MatierePalette) => void;
}

const VOLATILITE_LABEL: Record<string, string> = {
  tete: "Tête",
  tete_coeur: "Tête / Cœur",
  coeur: "Cœur",
  coeur_fond: "Cœur / Fond",
  fond: "Fond",
};

// actifs_cosmetiques est une famille cosmétique pure (voir
// components/laboratoire/familles-olfactives.ts) — hors de propos pour un
// composeur de parfum, jamais proposée ici (la palette elle-même n'en
// contient déjà pas : filtrée à la source par la requête de page.tsx).
const FAMILLES_PARFUM = ORDRE_FAMILLES.filter((f) => f !== "actifs_cosmetiques");

export function PaletteMatieres({ matieres, dejaAjoutees, onAjouter }: PaletteMatieresProps) {
  const [recherche, setRecherche] = useState("");
  const [famille, setFamille] = useState<FamilleOlfactive | null>(null);

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
      <div className="flex flex-col gap-space-sm rounded-xl bg-ivoire-bouye/10 p-space-md text-ivoire-bouye shadow-ambient backdrop-blur-sm">
        <div className="flex items-center justify-between gap-space-sm">
          <h2 className="font-title-editorial text-[17px] font-light text-ivoire-bouye">Orgues &amp; Matières</h2>
          <span className="whitespace-nowrap rounded-full bg-or-karite/10 px-space-xs py-0.5 font-label-tabular text-[11px] text-or-karite">
            {matieres.length} matière{matieres.length > 1 ? "s" : ""}
          </span>
        </div>

        <label className="sr-only" htmlFor="recherche-matiere">
          Rechercher une matière
        </label>
        <input
          id="recherche-matiere"
          type="text"
          value={recherche}
          onChange={(e) => setRecherche(e.target.value)}
          placeholder="Rechercher isolat, absolu…"
          className="w-full rounded bg-encre-baobab/60 px-space-sm py-space-xs font-interface text-[13px] text-ivoire-bouye placeholder:text-sable/40 focus:outline-none focus:ring-1 focus:ring-or-karite"
        />

        <div className="flex flex-wrap gap-1 pt-1">
          <button
            type="button"
            onClick={() => setFamille(null)}
            className={cn(
              "rounded px-space-xs py-0.5 font-caption-meta text-[11px] transition-colors duration-300 ease-out",
              famille === null
                ? "bg-or-karite font-medium text-encre-baobab"
                : "bg-ivoire-bouye/10 text-sable/80 hover:bg-ivoire-bouye/20",
            )}
          >
            Toutes
          </button>
          {FAMILLES_PARFUM.map((f) => {
            const info = FAMILLES_OLFACTIVES[f];
            const actif = famille === f;
            return (
              <button
                key={f}
                type="button"
                onClick={() => setFamille(actif ? null : f)}
                className={cn(
                  "rounded px-space-xs py-0.5 font-caption-meta text-[11px] transition-colors duration-300 ease-out",
                  actif ? cn(info.bg, "font-medium text-encre-baobab") : "bg-ivoire-bouye/10 text-sable/80 hover:bg-ivoire-bouye/20",
                )}
              >
                {info.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="max-h-[720px] space-y-space-xs overflow-y-auto rounded-xl bg-ivoire-bouye/5 p-space-sm">
        {filtrees.length === 0 ? (
          <p className="p-space-md text-center font-interface text-caption-meta text-sable/60">
            Aucune matière ne correspond à ces critères.
          </p>
        ) : (
          filtrees.map((matiere) => {
            const ajoutee = dejaAjoutees.has(matiere.id);
            const info = FAMILLES_OLFACTIVES[matiere.famille_olfactive];
            return (
              <div
                key={matiere.id}
                className="relative overflow-hidden rounded-lg bg-encre-baobab/40 p-space-sm transition-colors duration-300 ease-out hover:bg-encre-baobab/60"
              >
                <span aria-hidden="true" className={cn("absolute inset-y-0 left-0 w-1", info.bg)} />
                <div className="flex items-start justify-between gap-1 pl-1.5">
                  <div className="space-y-0.5">
                    <h3 className="font-interface text-[13px] font-medium leading-snug text-ivoire-bouye">
                      {matiere.nom}
                    </h3>
                    <div className="flex flex-wrap items-center gap-1.5 font-caption-meta text-[11px] text-sable/70">
                      <span>{matiere.facette_libre ?? info.label}</span>
                      <span aria-hidden="true">•</span>
                      <span className="font-label-tabular text-or-karite">
                        {matiere.prix_kg > 0 ? `${formatPrix(matiere.prix_kg)}/kg` : "Accord maison"}
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => onAjouter(matiere)}
                    disabled={ajoutee}
                    aria-label={ajoutee ? `${matiere.nom} déjà dans la formule` : `Ajouter ${matiere.nom} à la formule`}
                    title={ajoutee ? "Déjà dans la formule" : "Ajouter à la formule"}
                    className="shrink-0 font-label-tabular text-[16px] text-sable/40 transition-colors hover:text-or-karite disabled:cursor-default disabled:text-vert-moringa"
                  >
                    {ajoutee ? "✓" : "+"}
                  </button>
                </div>
                <div className="mt-2 flex items-center justify-between border-t border-sable/10 pl-5 pt-1 font-caption-meta text-[11px]">
                  <PuissanceDots valeur={matiere.puissance} />
                  <span className="rounded bg-ivoire-bouye/10 px-1.5 py-0.5 text-[10px] text-sable/80">
                    {matiere.volatilite ? VOLATILITE_LABEL[matiere.volatilite] : "—"}
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
