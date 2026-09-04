"use client";

import { cn } from "@/lib/utils";
import { Input } from "@/components/ui";
import { Select } from "@/components/laboratoire/select";
import {
  COULEUR_PHASE,
  LETTRE_PHASE,
  LIBELLE_PHASE,
  ORDRE_PHASES,
  SOUS_LIBELLE_PHASE,
} from "@/components/laboratoire/constantes-cosmetique";
import type { LigneFormule, PhaseCosmetique } from "@/packages/formulation";

import { formatPrix, type MatierePalette } from "./lignes";

export interface ColonneFormulationProps {
  lignes: LigneFormule[];
  matieresParId: Map<string, MatierePalette>;
  poidsReferenceG: number;
  onChangerPoidsReference: (valeur: number) => void;
  onChangerPourcentage: (id: string, valeur: number) => void;
  onChangerPhase: (id: string, phase: PhaseCosmetique) => void;
  onRetirer: (id: string) => void;
}

/** Écart toléré sur la somme des 5 phases pour considérer la formule à 100% pile — cf. la tolérance identique du script de la maquette (0.005). */
const TOLERANCE_100 = 0.005;

export function ColonneFormulation({
  lignes,
  matieresParId,
  poidsReferenceG,
  onChangerPoidsReference,
  onChangerPourcentage,
  onChangerPhase,
  onRetirer,
}: ColonneFormulationProps) {
  const totalPourcentage = lignes.reduce((somme, ligne) => somme + ligne.pourcentage, 0);
  const totalExact = Math.abs(totalPourcentage - 100) < TOLERANCE_100;

  return (
    <section className="flex flex-col gap-space-lg lg:col-span-6">
      <div className="flex flex-col gap-space-sm rounded-xl bg-surface-container-lowest p-space-md shadow-ambient">
        <div className="flex flex-wrap items-center justify-between gap-space-sm">
          <div className="flex items-center gap-2">
            <span aria-hidden="true" className="h-3 w-3 rounded-full bg-vert-moringa" />
            <h2 className="font-title-editorial text-title-editorial font-light text-encre-baobab">
              Composition des 5 phases
            </h2>
          </div>
          <label className="flex items-center gap-space-xs font-caption-meta text-[11px] text-on-surface-variant">
            Base de calcul
            <Input
              type="number"
              numeric
              min={1}
              step={10}
              value={poidsReferenceG}
              onChange={(e) => onChangerPoidsReference(Math.max(1, Number(e.target.value) || 0))}
              className="w-16 border-outline-variant/50 bg-transparent text-right text-encre-baobab focus:border-vert-moringa"
            />
            g
          </label>
        </div>
        <p className="font-interface text-[12px] text-on-surface-variant">
          Les pourcentages d&apos;incorporation sont calculés au milligramme près. Respectez l&apos;ordre des
          phases lors de la fabrication réelle.
        </p>
      </div>

      <div className="flex flex-col gap-space-md">
        {ORDRE_PHASES.map((phase) => {
          const lignesPhase = lignes.filter((l) => l.phase === phase);
          const totalPhase = lignesPhase.reduce((somme, l) => somme + l.pourcentage, 0);
          const couleur = COULEUR_PHASE[phase];

          return (
            <div key={phase} className="space-y-space-sm rounded-xl bg-surface-container-lowest p-space-md shadow-ambient">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-sable/60 pb-2">
                <div className="flex items-center gap-2">
                  <span
                    aria-hidden="true"
                    className={cn(
                      "flex h-6 w-6 items-center justify-center rounded-full font-label-tabular text-[12px] font-bold",
                      couleur.dotBg,
                      couleur.text,
                    )}
                  >
                    {LETTRE_PHASE[phase]}
                  </span>
                  <div>
                    <h3 className="font-title-editorial text-[15px] leading-tight text-encre-baobab">
                      {LIBELLE_PHASE[phase]}
                    </h3>
                    <span className="font-caption-meta text-[11px] text-on-surface-variant">
                      {SOUS_LIBELLE_PHASE[phase]}
                    </span>
                  </div>
                </div>
                <div className="font-caption-meta text-[11px] text-encre-baobab">
                  Sous-total :{" "}
                  <strong className={cn("font-label-tabular font-semibold tabular-nums", couleur.text)}>
                    {totalPhase.toFixed(3)} %
                  </strong>
                </div>
              </div>

              {lignesPhase.length === 0 ? (
                <p className="rounded bg-surface-container-low p-space-sm text-center font-caption-meta text-[11px] text-on-surface-variant">
                  Aucun ingrédient dans cette phase.
                </p>
              ) : (
                <div className="flex flex-col gap-1">
                  {lignesPhase.map((ligne) => {
                    const grammes = (ligne.pourcentage / 100) * poidsReferenceG;
                    const cout = (ligne.pourcentage / 100) * ligne.prixParKg * (poidsReferenceG / 1000);
                    const matiere = matieresParId.get(ligne.id);
                    return (
                      <div
                        key={ligne.id}
                        className="grid grid-cols-12 items-center gap-2 rounded px-2 py-1.5 transition-colors duration-300 ease-out hover:bg-surface-container-low/70"
                      >
                        <div className="col-span-5 min-w-0">
                          <div className="truncate font-interface text-[13px] font-medium text-encre-baobab">
                            {ligne.nomMatiere}
                          </div>
                          <div className="truncate font-label-tabular text-[10px] uppercase tracking-wider text-on-surface-variant">
                            {ligne.inci ?? matiere?.inci ?? "—"}
                          </div>
                        </div>
                        <div className="col-span-2">
                          <Select
                            aria-label={`Phase de ${ligne.nomMatiere}`}
                            value={phase}
                            onChange={(e) => onChangerPhase(ligne.id, e.target.value as PhaseCosmetique)}
                            className="w-auto border-0 bg-surface-container-low px-1.5 py-0.5 text-[10px] text-encre-baobab"
                          >
                            {ORDRE_PHASES.map((p) => (
                              <option key={p} value={p}>
                                {LETTRE_PHASE[p]} — {LIBELLE_PHASE[p]}
                              </option>
                            ))}
                          </Select>
                        </div>
                        <div className="col-span-2 text-right">
                          <div className="inline-flex items-center justify-end gap-0.5">
                            <input
                              type="number"
                              min={0}
                              max={100}
                              step={0.01}
                              value={ligne.pourcentage}
                              onChange={(e) => onChangerPourcentage(ligne.id, Number(e.target.value))}
                              aria-label={`Pourcentage de ${ligne.nomMatiere}`}
                              className="w-14 bg-transparent text-right font-label-tabular text-[12px] tabular-nums text-encre-baobab focus:outline-none focus:ring-1 focus:ring-vert-moringa"
                            />
                            <span aria-hidden="true" className="text-on-surface-variant">
                              %
                            </span>
                          </div>
                        </div>
                        <div className="col-span-2 text-right font-label-tabular text-[12px] tabular-nums text-on-surface-variant">
                          <div>{grammes.toFixed(2)} g</div>
                          <div className="text-[10px] text-on-surface-variant/70">{formatPrix(cout)}</div>
                        </div>
                        <div className="col-span-1 text-center">
                          <button
                            type="button"
                            onClick={() => onRetirer(ligne.id)}
                            aria-label={`Retirer ${ligne.nomMatiere} de la formule`}
                            className="font-label-tabular text-[14px] text-on-surface-variant/50 transition-colors hover:text-rouge-bissap"
                          >
                            ×
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div
        className={cn(
          "flex flex-col gap-space-md rounded-xl bg-encre-baobab p-space-lg text-ivoire-bouye shadow-ambient sm:flex-row sm:items-center sm:justify-between",
        )}
      >
        <div className="flex items-center gap-space-md">
          <span
            aria-hidden="true"
            className={cn(
              "flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-[22px] transition-colors duration-300 ease-out",
              totalExact ? "bg-vert-moringa/25 text-vert-moringa" : "bg-rouge-bissap/20 text-rouge-bissap",
            )}
          >
            {totalExact ? "✓" : "!"}
          </span>
          <div>
            <div className="font-caption-meta text-[11px] uppercase tracking-widest text-or-karite">
              Contrôle d&apos;équilibre galénique
            </div>
            <div className="font-title-editorial text-title-editorial">
              {totalExact ? "Formule rigoureusement conforme" : "Écart de proportion à corriger"}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-space-md">
          <div className="text-right">
            <span className="block font-caption-meta text-[11px] text-ivoire-bouye/70">Somme des 5 phases</span>
            <span
              className={cn(
                "font-label-tabular text-headline-md font-light tabular-nums transition-colors duration-300 ease-out",
                totalExact ? "text-vert-moringa" : "text-rouge-bissap",
              )}
            >
              {totalPourcentage.toFixed(3)} %
            </span>
          </div>
          <span
            className={cn(
              "whitespace-nowrap rounded px-space-sm py-1 font-label-tabular text-[11px] font-medium uppercase tracking-wider transition-colors duration-300 ease-out",
              totalExact ? "bg-vert-moringa text-ivoire-bouye" : "bg-rouge-bissap text-ivoire-bouye",
            )}
          >
            {totalExact ? "Conforme" : "Non conforme"}
          </span>
        </div>
      </div>
    </section>
  );
}
