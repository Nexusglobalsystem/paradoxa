"use client";

import { useMemo, useState } from "react";

import { cn } from "@/lib/utils";
import { Input } from "@/components/ui";
import { calculerLot } from "@/packages/formulation";
import type { Formule } from "@/packages/formulation";

export interface AtelierLotProps {
  formule: Formule;
}

const QUANTITE_ESSAI_DEFAUT_G = 500;
const CONTENANCE_UNITE_DEFAUT_G = 200;
const TOLERANCE_ECART_G = 0.05;

/**
 * Calculateur de lot d'essai (bandeau bas, écran 34) : pour une quantité de
 * cuve pilote arbitraire, dérive la feuille de pesée réelle de la formule
 * via calculerLot (packages/formulation) — même esprit que atelier-pesee.tsx
 * du composeur de parfum (bandeau sticky, recalcul en direct), mais appuyé
 * ici sur le moteur plutôt que sur une formule arithmétique locale, puisque
 * calculerLot répartit N lignes hétérogènes plutôt qu'un simple ratio
 * concentré/diluant à deux termes.
 */
export function AtelierLot({ formule }: AtelierLotProps) {
  const [quantite, setQuantite] = useState(QUANTITE_ESSAI_DEFAUT_G);
  const [contenanceUnite, setContenanceUnite] = useState(CONTENANCE_UNITE_DEFAUT_G);

  const feuille = useMemo(() => calculerLot(formule, Math.max(quantite, 0.01)), [formule, quantite]);

  const unites = contenanceUnite > 0 ? Math.floor(quantite / contenanceUnite) : 0;
  const ecartValide = Math.abs(feuille.ecartGrammes) < TOLERANCE_ECART_G;

  return (
    <section className="sticky bottom-0 z-40 w-full border-t border-outline-variant/40 bg-surface-container-high px-space-lg py-space-sm shadow-2xl lg:px-space-2xl">
      <div className="mx-auto flex max-w-[1440px] flex-col gap-space-sm lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap items-center gap-space-md">
          <div>
            <div className="font-caption-meta text-[10px] uppercase tracking-widest text-vert-moringa">
              Atelier de pesée
            </div>
            <h4 className="font-title-editorial text-[14px] leading-none text-encre-baobab">
              Calculateur de lot d&apos;essai
            </h4>
          </div>
          <label className="flex items-center gap-2 rounded bg-surface-container-lowest px-space-sm py-1.5 shadow-sm">
            <span className="font-caption-meta text-[11px] text-on-surface-variant">Taille du lot :</span>
            <Input
              id="quantite-lot-essai"
              type="number"
              numeric
              min={1}
              step={50}
              value={quantite}
              onChange={(e) => setQuantite(Math.max(0, Number(e.target.value) || 0))}
              className="w-20 border-outline-variant/40 bg-transparent text-right text-encre-baobab focus:border-vert-moringa"
            />
            <span className="font-label-tabular text-[12px] text-on-surface-variant">g</span>
          </label>
          <label className="flex items-center gap-2 rounded bg-surface-container-lowest px-space-sm py-1.5 shadow-sm">
            <span className="font-caption-meta text-[11px] text-on-surface-variant">Conditionnement :</span>
            <Input
              id="contenance-unite"
              type="number"
              numeric
              min={1}
              step={10}
              value={contenanceUnite}
              onChange={(e) => setContenanceUnite(Math.max(1, Number(e.target.value) || 1))}
              className="w-16 border-outline-variant/40 bg-transparent text-right text-encre-baobab focus:border-vert-moringa"
            />
            <span className="font-label-tabular text-[12px] text-on-surface-variant">
              g/unité — {unites} unité{unites > 1 ? "s" : ""}
            </span>
          </label>
        </div>

        {feuille.lignes.length === 0 ? (
          <p className="font-caption-meta text-[11px] text-on-surface-variant">
            Ajoutez des matières pour générer la feuille de pesée.
          </p>
        ) : (
          <div className="flex max-h-14 flex-wrap items-center gap-1.5 overflow-y-auto lg:max-w-[55%] lg:justify-end">
            {feuille.lignes.map((l) => (
              <span
                key={l.ligneId}
                title={`${l.nomMatiere} — ${l.pourcentage.toFixed(2)}%`}
                className="whitespace-nowrap rounded bg-surface-container-lowest px-1.5 py-0.5 font-label-tabular text-[11px] text-on-surface-variant shadow-sm"
              >
                {l.nomMatiere} <strong className="text-encre-baobab">{l.grammes.toFixed(1)} g</strong>
              </span>
            ))}
            <span
              className={cn(
                "whitespace-nowrap rounded px-1.5 py-0.5 font-label-tabular text-[11px] font-medium",
                ecartValide ? "bg-vert-moringa/15 text-success" : "bg-rouge-bissap/10 text-danger",
              )}
            >
              {ecartValide
                ? `${feuille.grammesPeses.toFixed(1)} g pesés`
                : `Écart de ${feuille.ecartGrammes.toFixed(1)} g`}
            </span>
          </div>
        )}
      </div>
    </section>
  );
}
