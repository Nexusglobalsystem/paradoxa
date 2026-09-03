"use client";

import { useState } from "react";

import { Input } from "@/components/ui";

export interface AtelierPeseeProps {
  concentrationPct: number;
  libelleConcentration: string;
}

/**
 * Calculateur d'essai au trébuchet (bandeau bas, mockup écran 32) : pour une
 * quantité d'essai arbitraire, répartit entre concentré de parfum et diluant
 * selon le taux de dilution réel de la concentration active — recalculé en
 * direct si l'utilisateur change EDT/EDP/EXTRAIT en haut de l'écran, plutôt
 * que le taux fixe câblé en dur dans la maquette source.
 */
export function AtelierPesee({ concentrationPct, libelleConcentration }: AtelierPeseeProps) {
  const [quantite, setQuantite] = useState(50);

  const fractionConcentre = concentrationPct / 100;
  const grammesConcentre = quantite * fractionConcentre;
  const grammesDiluant = quantite - grammesConcentre;

  return (
    <section className="sticky bottom-0 z-40 w-full border-t border-or-karite/30 bg-encre-baobab px-space-lg py-space-sm shadow-2xl lg:px-space-2xl">
      <div className="mx-auto flex max-w-[1440px] flex-col items-center justify-between gap-space-md text-ivoire-bouye lg:flex-row">
        <div className="flex flex-wrap items-center gap-space-md">
          <div>
            <div className="font-caption-meta text-[10px] uppercase tracking-widest text-or-karite">
              Atelier de pesée
            </div>
            <h4 className="font-title-editorial text-[14px] leading-none text-ivoire-bouye">
              Calculateur d&apos;essai au trébuchet
            </h4>
          </div>
          <div className="flex items-center gap-2 rounded border border-sable/20 bg-ivoire-bouye/5 px-space-sm py-1">
            <label htmlFor="quantite-essai" className="font-caption-meta text-[11px] text-sable/70">
              Quantité d&apos;essai :
            </label>
            <Input
              id="quantite-essai"
              type="number"
              numeric
              min={1}
              step={5}
              value={quantite}
              onChange={(e) => setQuantite(Math.max(0, Number(e.target.value) || 0))}
              className="w-16 border-sable/30 bg-transparent text-right text-ivoire-bouye focus:border-or-karite"
            />
            <span className="font-label-tabular text-[12px] text-sable/60">g</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-space-lg font-caption-meta text-[12px]">
          <div className="flex items-center gap-2">
            <span aria-hidden="true" className="h-2 w-2 rounded-full bg-sable/40" />
            <span className="text-sable/80">Diluant / alcool ({(100 - concentrationPct).toFixed(0)}%) :</span>
            <span className="font-label-tabular font-bold text-ivoire-bouye">{grammesDiluant.toFixed(2)} g</span>
          </div>
          <div aria-hidden="true" className="text-sable/30">
            •
          </div>
          <div className="flex items-center gap-2">
            <span aria-hidden="true" className="h-2 w-2 rounded-full bg-or-karite" />
            <span className="text-sable/80">
              Concentré de parfum ({libelleConcentration}, {concentrationPct}%) :
            </span>
            <span className="font-label-tabular font-bold text-or-karite">{grammesConcentre.toFixed(2)} g</span>
          </div>
        </div>
      </div>
    </section>
  );
}
