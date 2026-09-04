"use client";

import { useMemo, useState } from "react";

import { Input } from "@/components/ui";
import type { CoutFormule, LigneFormule } from "@/packages/formulation";

import { bienfaitsDe, formatPrix, type MatierePalette } from "./lignes";

export interface PanneauAnalyseProps {
  lignes: LigneFormule[];
  matieresParId: Map<string, MatierePalette>;
  inci: string[];
  phCible: number | null;
  onChangerPhCible: (valeur: number | null) => void;
  cout: CoutFormule;
  poidsReferenceG: number;
}

const PH_MIN = 3;
const PH_MAX = 8;

interface BienfaitAgrege {
  nom: string;
  matieresSources: string[];
}

export function PanneauAnalyse({
  lignes,
  matieresParId,
  inci,
  phCible,
  onChangerPhCible,
  cout,
  poidsReferenceG,
}: PanneauAnalyseProps) {
  const [copie, setCopie] = useState(false);

  const bienfaitsAgreges = useMemo<BienfaitAgrege[]>(() => {
    const parNom = new Map<string, Set<string>>();
    for (const ligne of lignes) {
      const matiere = matieresParId.get(ligne.id);
      if (!matiere) continue;
      for (const bienfait of bienfaitsDe(matiere)) {
        const sources = parNom.get(bienfait) ?? new Set<string>();
        sources.add(matiere.nom);
        parNom.set(bienfait, sources);
      }
    }
    return [...parNom.entries()]
      .map(([nom, sources]) => ({ nom, matieresSources: [...sources] }))
      .sort((a, b) => a.nom.localeCompare(b.nom, "fr"));
  }, [lignes, matieresParId]);

  const totalPourcentage = lignes.reduce((somme, l) => somme + l.pourcentage, 0);
  const indiceNaturalite = useMemo(() => {
    if (totalPourcentage <= 0) return null;
    const naturel = lignes.reduce((somme, ligne) => {
      const matiere = matieresParId.get(ligne.id);
      return matiere?.nature === "naturel" ? somme + ligne.pourcentage : somme;
    }, 0);
    return (naturel / totalPourcentage) * 100;
  }, [lignes, matieresParId, totalPourcentage]);

  const texteInci = inci.length > 0 ? `${inci.join(", ")}.` : "";

  async function copierInci() {
    if (!texteInci) return;
    try {
      await navigator.clipboard.writeText(texteInci);
      setCopie(true);
      setTimeout(() => setCopie(false), 2000);
    } catch {
      // Presse-papiers indisponible (contexte non sécurisé, permission
      // refusée...) — pas d'action de repli, la liste reste sélectionnable
      // manuellement dans l'encadré ci-dessous.
    }
  }

  const phPosition = phCible === null ? null : Math.min(100, Math.max(0, ((phCible - PH_MIN) / (PH_MAX - PH_MIN)) * 100));

  return (
    <aside className="flex flex-col gap-space-lg lg:col-span-3">
      <section className="space-y-space-sm rounded-xl bg-surface-container-lowest p-space-md shadow-ambient">
        <div className="flex items-center justify-between">
          <h3 className="font-title-editorial text-[17px] font-light text-encre-baobab">
            Déclaration INCI officielle
          </h3>
          <button
            type="button"
            onClick={copierInci}
            disabled={!texteInci}
            title="Copier la liste INCI"
            aria-label="Copier la liste INCI"
            className="font-label-tabular text-[11px] text-on-surface-variant transition-colors hover:text-vert-moringa disabled:cursor-not-allowed disabled:opacity-40"
          >
            {copie ? "Copié ✓" : "Copier"}
          </button>
        </div>
        <p className="font-caption-meta text-[11px] text-on-surface-variant">
          Ordonnancement pondéral décroissant, seuil de 1% (Règlement CE n° 1223/2009).
        </p>
        <div
          className="select-all rounded border border-outline-variant/40 bg-surface-container-low p-space-xs font-label-tabular text-[11px] leading-relaxed text-on-surface-variant"
          aria-live="polite"
        >
          {texteInci || "Ajoutez des matières pour générer la liste INCI."}
        </div>
        {indiceNaturalite !== null ? (
          <div className="flex items-center justify-between font-caption-meta text-[11px] text-on-surface-variant">
            <span>
              Origine naturelle : <strong className="text-encre-baobab">{indiceNaturalite.toFixed(0)}%</strong>
            </span>
          </div>
        ) : null}
      </section>

      <section className="space-y-space-sm rounded-xl bg-surface-container-lowest p-space-md shadow-ambient">
        <h3 className="font-title-editorial text-[17px] font-light text-encre-baobab">Bienfaits agrégés</h3>
        {bienfaitsAgreges.length === 0 ? (
          <p className="font-caption-meta text-[11px] text-on-surface-variant">
            Aucun bienfait déclaré parmi les matières incorporées.
          </p>
        ) : (
          <ul className="flex flex-wrap gap-1.5">
            {bienfaitsAgreges.map((b) => (
              <li key={b.nom}>
                <span
                  title={b.matieresSources.join(", ")}
                  className="inline-flex items-center rounded-full bg-vert-moringa/10 px-space-sm py-0.5 font-caption-meta text-[11px] text-vert-moringa"
                >
                  {b.nom}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="space-y-space-xs rounded-xl bg-surface-container-lowest p-space-md shadow-ambient">
        <div className="flex items-center justify-between">
          <h3 className="font-title-editorial text-[17px] font-light text-encre-baobab">Cible pH</h3>
        </div>
        <div className="flex items-baseline gap-space-xs">
          <Input
            type="number"
            numeric
            min={0}
            max={14}
            step={0.05}
            value={phCible ?? ""}
            placeholder="—"
            onChange={(e) => {
              const brut = e.target.value;
              onChangerPhCible(brut === "" ? null : Number(brut));
            }}
            className="w-20 border-outline-variant/50 text-headline-sm text-encre-baobab"
          />
          <span className="font-caption-meta text-[11px] text-on-surface-variant">manteau cutané idéal ≈ 5.0 – 5.5</span>
        </div>
        <div className="relative mt-2 h-2 w-full rounded bg-gradient-to-r from-rouge-bissap via-ocre-solaire to-vert-moringa">
          {phPosition !== null ? (
            <div
              aria-hidden="true"
              className="absolute -top-1 h-4 w-4 -translate-x-1/2 rounded-full border-2 border-ivoire-bouye bg-encre-baobab shadow-sm"
              style={{ left: `${phPosition}%` }}
            />
          ) : null}
        </div>
        <div className="flex justify-between font-label-tabular text-[10px] text-on-surface-variant">
          <span>pH {PH_MIN.toFixed(1)}</span>
          <span>pH {PH_MAX.toFixed(1)}</span>
        </div>
      </section>

      <section className="space-y-space-xs rounded-xl bg-surface-container-lowest p-space-md shadow-ambient">
        <h3 className="font-title-editorial text-[17px] font-light text-encre-baobab">Économie de formule</h3>
        <dl className="divide-y divide-outline-variant/20 pt-space-xs font-interface text-[12px]">
          <div className="flex items-center justify-between py-1.5">
            <dt className="text-on-surface-variant">Coût matière / kg</dt>
            <dd className="font-label-tabular font-semibold text-terre-de-dakar">{formatPrix(cout.coutParKg)}</dd>
          </div>
          <div className="flex items-center justify-between py-1.5">
            <dt className="text-on-surface-variant">Lot de référence ({poidsReferenceG} g)</dt>
            <dd className="font-label-tabular font-medium text-encre-baobab">{formatPrix(cout.coutParFlacon)}</dd>
          </div>
        </dl>
      </section>
    </aside>
  );
}
