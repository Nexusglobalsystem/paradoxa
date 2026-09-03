"use client";

import { cn } from "@/lib/utils";
import { FAMILLES_OLFACTIVES, ORDRE_FAMILLES } from "@/components/laboratoire/familles-olfactives";
import type { AllergeneAgrege, CoutFormule, DepassementIFRA, LigneFormule } from "@/packages/formulation";

import { formatPrix } from "./lignes";

export interface PanneauAnalyseProps {
  lignes: LigneFormule[];
  depassements: DepassementIFRA[];
  allergenes: AllergeneAgrege[];
  coutLotReference: CoutFormule;
  coutFlacon100ml: CoutFormule;
  poidsReferenceG: number;
  concentrationPct: number;
}

export function PanneauAnalyse({
  lignes,
  depassements,
  allergenes,
  coutLotReference,
  coutFlacon100ml,
  poidsReferenceG,
  concentrationPct,
}: PanneauAnalyseProps) {
  const totalPourcentage = lignes.reduce((somme, l) => somme + l.pourcentage, 0) || 1;
  const parFamille = new Map<string, number>();
  for (const ligne of lignes) {
    if (!ligne.familleOlfactive) continue;
    parFamille.set(ligne.familleOlfactive, (parFamille.get(ligne.familleOlfactive) ?? 0) + ligne.pourcentage);
  }
  const famillesPresentes = ORDRE_FAMILLES.filter((f) => parFamille.has(f));

  return (
    <aside className="flex flex-col gap-space-lg lg:col-span-3">
      <section className="space-y-space-sm rounded-xl bg-ivoire-bouye/10 p-space-md text-ivoire-bouye shadow-ambient">
        <h3 className="font-title-editorial text-[17px] font-light text-ivoire-bouye">Profil olfactif</h3>
        {famillesPresentes.length === 0 ? (
          <p className="font-caption-meta text-[11px] text-sable/60">
            Ajoutez des matières pour voir le profil par famille olfactive.
          </p>
        ) : (
          <ul className="space-y-space-xs pt-space-xs">
            {famillesPresentes.map((f) => {
              const info = FAMILLES_OLFACTIVES[f];
              const pct = ((parFamille.get(f) ?? 0) / totalPourcentage) * 100;
              return (
                <li key={f} className="space-y-0.5">
                  <div className="flex items-center justify-between font-caption-meta text-[11px]">
                    <span className="flex items-center gap-1 text-sable/80">
                      <span aria-hidden="true" className={cn("h-1.5 w-1.5 rounded-full", info.bg)} />
                      {info.label}
                    </span>
                    <span className="font-label-tabular font-medium text-ivoire-bouye">{pct.toFixed(0)}%</span>
                  </div>
                  <div className="h-1 w-full overflow-hidden rounded-full bg-encre-baobab">
                    <div className={cn("h-full rounded-full", info.bg)} style={{ width: `${pct}%` }} />
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <section className="space-y-space-sm rounded-xl bg-ivoire-bouye/10 p-space-md text-ivoire-bouye shadow-ambient">
        <div className="flex items-center justify-between">
          <h3 className="font-title-editorial text-[17px] font-light text-ivoire-bouye">Contrôle IFRA 51</h3>
          <span className="whitespace-nowrap rounded bg-vert-moringa/20 px-space-xs py-0.5 font-label-tabular text-[11px] text-vert-moringa">
            Catégorie 4
          </span>
        </div>
        {depassements.length === 0 ? (
          <div className="flex items-start gap-1.5 rounded bg-encre-baobab/60 p-space-sm font-caption-meta text-[11px] text-sable/80">
            <span aria-hidden="true" className="text-vert-moringa">
              ✓
            </span>
            <span>
              {lignes.length === 0
                ? "Ajoutez des matières pour lancer le contrôle IFRA."
                : "Aucun dépassement de seuil détecté. Formule conforme pour la catégorie 4 (parfums fins, extraits)."}
            </span>
          </div>
        ) : (
          <ul className="space-y-space-xs">
            {depassements.map((d) => (
              <li key={d.ligneId} className="space-y-1 rounded bg-rouge-bissap/10 p-space-sm">
                <div className="flex items-center justify-between font-caption-meta text-[11px]">
                  <span className="text-ivoire-bouye">{d.nomMatiere}</span>
                  <span className="font-label-tabular text-rouge-bissap">
                    {d.pourcentageDansProduitFini.toFixed(2)}%{" "}
                    <span className="text-sable/50">/ Max {d.limiteAutorisee.toFixed(2)}%</span>
                  </span>
                </div>
                <p className="font-caption-meta text-[10px] text-rouge-bissap">
                  Dépassement de {d.depassement.toFixed(2)} pt(s) dans le produit fini.
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="space-y-space-sm rounded-xl bg-ivoire-bouye/10 p-space-md text-ivoire-bouye shadow-ambient">
        <h3 className="font-title-editorial text-[17px] font-light text-ivoire-bouye">Allergènes déclarés</h3>
        {allergenes.length === 0 ? (
          <p className="font-caption-meta text-[11px] text-sable/60">
            Aucun allergène déclaré parmi les matières incorporées.
          </p>
        ) : (
          <ul className="space-y-space-xs">
            {allergenes.map((a) => (
              <li key={a.nom} className="space-y-0.5 font-caption-meta text-[11px]">
                <div className="flex items-center justify-between gap-space-sm">
                  <span className="text-sable/80">
                    {a.nom}
                    {a.numeroCAS ? ` (CAS ${a.numeroCAS})` : ""}
                  </span>
                  <span className="font-label-tabular text-ivoire-bouye">{a.pourcentageCumule.toFixed(2)}%</span>
                </div>
                <p className="text-[10px] text-sable/50">{a.matieresSources.join(", ")}</p>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="space-y-space-xs rounded-xl bg-ivoire-bouye/10 p-space-md text-ivoire-bouye shadow-ambient">
        <h3 className="font-title-editorial text-[17px] font-light text-ivoire-bouye">Économie de formule</h3>
        <dl className="divide-y divide-sable/10 pt-space-xs font-interface text-[12px]">
          <div className="flex items-center justify-between py-1.5">
            <dt className="text-sable/70">Coût concentré pur / kg</dt>
            <dd className="font-label-tabular font-medium">{formatPrix(coutLotReference.coutParKg)}</dd>
          </div>
          <div className="flex items-center justify-between py-1.5">
            <dt className="text-sable/70">Lot de référence ({poidsReferenceG} g)</dt>
            <dd className="font-label-tabular font-medium">{formatPrix(coutLotReference.coutParFlacon)}</dd>
          </div>
          <div className="flex items-center justify-between py-1.5">
            <dt className="text-sable/70">Concentré / flacon 100 ml ({concentrationPct}%)</dt>
            <dd className="font-label-tabular font-semibold text-or-karite">
              {formatPrix(coutFlacon100ml.coutParFlacon)}
            </dd>
          </div>
        </dl>
      </section>
    </aside>
  );
}
