"use client";

import { cn } from "@/lib/utils";
import { Input } from "@/components/ui";
import { Select } from "@/components/laboratoire/select";
import { FAMILLES_OLFACTIVES } from "@/components/laboratoire/familles-olfactives";
import { LIBELLE_ETAGE, ORDRE_ETAGES, PART_ETAGE } from "@/components/laboratoire/constantes-parfum";
import type {
  CoutFormule,
  DepassementIFRA,
  Etage,
  FamilleOlfactive,
  FeuilleDePesee,
  LigneFormule,
} from "@/packages/formulation";

import { formatPrix, type MatierePalette } from "./lignes";

export interface ColonneFormulationProps {
  lignes: LigneFormule[];
  matieresParId: Map<string, MatierePalette>;
  poidsReferenceG: number;
  onChangerPoidsReference: (valeur: number) => void;
  feuillePesee: FeuilleDePesee;
  coutLotReference: CoutFormule;
  depassementsIFRA: DepassementIFRA[];
  onChangerPourcentage: (id: string, valeur: number) => void;
  onChangerEtage: (id: string, etage: Etage) => void;
  onRetirer: (id: string) => void;
}

const COULEUR_DOT_ETAGE: Record<Etage, string> = {
  tete: "bg-or-karite",
  coeur: "bg-ocre-solaire",
  fond: "bg-terre-de-dakar",
};

// Contraste du libellé posé sur le bloc coloré d'une strate — chaque couleur
// de famille (components/laboratoire/familles-olfactives.ts) a une luminosité
// différente, le texte doit rester lisible (AA) sur chacune.
const TEXTE_SUR_FAMILLE: Record<FamilleOlfactive, string> = {
  boise_resines: "text-ivoire-bouye",
  floral_botanique: "text-encre-baobab",
  ambre_balsamique: "text-encre-baobab",
  epice_chaud: "text-ivoire-bouye",
  hesperide_frais: "text-encre-baobab",
  actifs_cosmetiques: "text-ivoire-bouye",
};

export function ColonneFormulation({
  lignes,
  matieresParId,
  poidsReferenceG,
  onChangerPoidsReference,
  feuillePesee,
  coutLotReference,
  depassementsIFRA,
  onChangerPourcentage,
  onChangerEtage,
  onRetirer,
}: ColonneFormulationProps) {
  const totalPourcentage = lignes.reduce((somme, ligne) => somme + ligne.pourcentage, 0);
  const totalValide = Math.abs(feuillePesee.ecartGrammes) < 0.05;
  const grammesParId = new Map(feuillePesee.lignes.map((l) => [l.ligneId, l.grammes]));
  const idsEnDepassement = new Set(depassementsIFRA.map((d) => d.ligneId));

  return (
    <section className="flex flex-col gap-space-lg lg:col-span-6">
      <div className="space-y-space-md rounded-xl bg-ivoire-bouye/10 p-space-lg text-ivoire-bouye shadow-ambient">
        <div className="flex flex-wrap items-center justify-between gap-space-sm">
          <h2 className="font-title-editorial text-title-editorial font-light text-ivoire-bouye">
            Structure harmonique φ
          </h2>
          <span
            className={cn(
              "flex items-center gap-2 rounded-full border px-space-sm py-1 font-label-tabular text-[11px] font-medium",
              totalValide
                ? "border-or-karite/30 bg-or-karite/15 text-or-karite"
                : "border-rouge-bissap/40 bg-rouge-bissap/10 text-rouge-bissap",
            )}
          >
            {totalValide ? "Proportions vérifiées" : "Écart de proportion"} ({totalPourcentage.toFixed(1)}%)
          </span>
        </div>

        <div className="space-y-space-md pt-space-xs">
          {ORDRE_ETAGES.map((etage) => {
            const lignesEtage = lignes.filter((l) => l.etage === etage);
            const totalEtage = lignesEtage.reduce((somme, l) => somme + l.pourcentage, 0);
            return (
              <div key={etage} className="space-y-1.5">
                <div className="flex items-center justify-between font-caption-meta text-[12px]">
                  <span className="flex items-center gap-1.5 font-medium text-ivoire-bouye">
                    <span aria-hidden="true" className={cn("h-2 w-2 rounded-full", COULEUR_DOT_ETAGE[etage])} />
                    Strate {LIBELLE_ETAGE[etage].toLowerCase()}
                  </span>
                  <span className="font-label-tabular font-semibold text-or-karite">
                    {totalEtage.toFixed(1)}%{" "}
                    <span className="font-normal text-sable/50">/ {PART_ETAGE[etage]}% φ</span>
                  </span>
                </div>
                <div className="flex h-11 w-full gap-1 overflow-hidden rounded-lg bg-encre-baobab/70 p-1 shadow-inner">
                  {lignesEtage.length === 0 ? (
                    <div className="flex w-full items-center justify-center font-caption-meta text-[11px] text-sable/40">
                      Aucune matière dans cette strate
                    </div>
                  ) : (
                    lignesEtage.map((ligne) => (
                      <div
                        key={ligne.id}
                        title={`${ligne.nomMatiere} — ${ligne.pourcentage.toFixed(1)}%`}
                        className={cn(
                          "flex h-full items-center justify-between rounded px-2 font-medium text-[11px] shadow-sm transition-all duration-300 ease-out hover:brightness-110",
                          ligne.familleOlfactive ? FAMILLES_OLFACTIVES[ligne.familleOlfactive].bg : "bg-or-karite",
                          ligne.familleOlfactive ? TEXTE_SUR_FAMILLE[ligne.familleOlfactive] : "text-encre-baobab",
                        )}
                        style={{ width: `${(ligne.pourcentage / (totalEtage || 1)) * 100}%` }}
                      >
                        <span className="truncate">{ligne.nomMatiere}</span>
                        <span className="ml-1 font-label-tabular">{ligne.pourcentage.toFixed(1)}%</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="space-y-space-sm rounded-xl bg-ivoire-bouye/10 p-space-md text-ivoire-bouye shadow-ambient">
        <div className="flex flex-wrap items-center justify-between gap-space-sm pb-1">
          <h3 className="font-title-editorial text-[17px] font-light text-ivoire-bouye">
            Tableau de formulation ({lignes.length} matière{lignes.length > 1 ? "s" : ""})
          </h3>
          <label className="flex items-center gap-space-xs font-caption-meta text-[11px] text-sable/70">
            Base de calcul
            <Input
              type="number"
              numeric
              min={1}
              step={5}
              value={poidsReferenceG}
              onChange={(e) => onChangerPoidsReference(Math.max(1, Number(e.target.value) || 0))}
              className="w-16 border-sable/30 bg-transparent text-right text-ivoire-bouye focus:border-or-karite"
            />
            g
          </label>
        </div>

        {lignes.length === 0 ? (
          <p className="rounded bg-encre-baobab/40 p-space-md text-center font-caption-meta text-[12px] text-sable/60">
            Ajoutez des matières depuis la palette pour composer la formule.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-sable/10 font-caption-meta text-[11px] uppercase tracking-wider text-sable/60">
                  <th scope="col" className="px-2 py-2">Strate</th>
                  <th scope="col" className="px-2 py-2">Matière première</th>
                  <th scope="col" className="px-2 py-2">Origine / Fournisseur</th>
                  <th scope="col" className="px-2 py-2 text-right">Part %</th>
                  <th scope="col" className="px-2 py-2 text-right">Pour {poidsReferenceG} g</th>
                  <th scope="col" className="px-2 py-2 text-right">Coût</th>
                  <th scope="col" className="px-2 py-2 text-center">IFRA</th>
                  <th scope="col" className="px-1 py-2 text-center">
                    <span className="sr-only">Retirer</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sable/5 font-interface text-[12px]">
                {lignes.map((ligne) => {
                  const matiere = matieresParId.get(ligne.id);
                  const etage = ligne.etage ?? "coeur";
                  const grammes = grammesParId.get(ligne.id) ?? (ligne.pourcentage / 100) * poidsReferenceG;
                  const cout = (ligne.pourcentage / 100) * ligne.prixParKg * (poidsReferenceG / 1000);
                  const enDepassement = idsEnDepassement.has(ligne.id);
                  const aLimite = Boolean(ligne.limiteIFRA && Object.keys(ligne.limiteIFRA).length > 0);
                  return (
                    <tr key={ligne.id} className="transition-colors duration-300 ease-out hover:bg-encre-baobab/40">
                      <td className="px-2 py-1.5">
                        <Select
                          aria-label={`Étage de ${ligne.nomMatiere}`}
                          value={etage}
                          onChange={(e) => onChangerEtage(ligne.id, e.target.value as Etage)}
                          className="w-auto border-0 bg-or-karite/15 px-1.5 py-0.5 text-[10px] text-or-karite"
                        >
                          {ORDRE_ETAGES.map((e) => (
                            <option key={e} value={e}>
                              {LIBELLE_ETAGE[e]}
                            </option>
                          ))}
                        </Select>
                      </td>
                      <td className="px-2 py-1.5 font-medium text-ivoire-bouye">{ligne.nomMatiere}</td>
                      <td className="px-2 py-1.5 text-[11px] text-sable/70">
                        {matiere?.origine ?? matiere?.fournisseur ?? "—"}
                      </td>
                      <td className="px-2 py-1.5 text-right">
                        <div className="flex items-center justify-end gap-0.5">
                          <input
                            type="number"
                            min={0}
                            max={100}
                            step={0.01}
                            value={ligne.pourcentage}
                            onChange={(e) => onChangerPourcentage(ligne.id, Number(e.target.value))}
                            aria-label={`Pourcentage de ${ligne.nomMatiere}`}
                            className="w-14 bg-transparent text-right font-label-tabular text-[12px] tabular-nums text-or-karite focus:outline-none focus:ring-1 focus:ring-or-karite"
                          />
                          <span aria-hidden="true" className="text-or-karite">
                            %
                          </span>
                        </div>
                      </td>
                      <td className="px-2 py-1.5 text-right font-label-tabular tabular-nums">
                        {grammes.toFixed(2)} g
                      </td>
                      <td className="px-2 py-1.5 text-right font-label-tabular tabular-nums text-sable/70">
                        {formatPrix(cout)}
                      </td>
                      <td className="px-2 py-1.5 text-center">
                        <span
                          aria-label={enDepassement ? "Dépassement IFRA" : aLimite ? "Conforme IFRA" : "Limite IFRA non documentée"}
                          title={enDepassement ? "Dépassement IFRA" : aLimite ? "Conforme IFRA" : "Limite IFRA non documentée"}
                          className={cn(
                            "inline-block h-2 w-2 rounded-full",
                            enDepassement ? "bg-rouge-bissap" : aLimite ? "bg-vert-moringa" : "bg-sable/30",
                          )}
                        />
                      </td>
                      <td className="px-1 py-1.5 text-center">
                        <button
                          type="button"
                          onClick={() => onRetirer(ligne.id)}
                          aria-label={`Retirer ${ligne.nomMatiere} de la formule`}
                          className="font-label-tabular text-[14px] text-sable/30 transition-colors hover:text-rouge-bissap"
                        >
                          ×
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr className="border-t border-or-karite/30 font-label-tabular text-[13px] font-medium text-ivoire-bouye">
                  <td className="px-2 py-2.5 font-caption-meta text-[11px] uppercase text-or-karite" colSpan={3}>
                    Total concentré formule
                  </td>
                  <td
                    className={cn(
                      "px-2 py-2.5 text-right font-bold",
                      totalValide ? "text-or-karite" : "text-rouge-bissap",
                    )}
                  >
                    {totalPourcentage.toFixed(2)}%
                  </td>
                  <td className="px-2 py-2.5 text-right">{feuillePesee.grammesPeses.toFixed(2)} g</td>
                  <td className="px-2 py-2.5 text-right text-or-karite">
                    {formatPrix(coutLotReference.coutParFlacon)}
                  </td>
                  <td
                    className={cn(
                      "px-2 py-2.5 text-center font-caption-meta text-[11px]",
                      totalValide ? "text-vert-moringa" : "text-rouge-bissap",
                    )}
                    colSpan={2}
                  >
                    {totalValide ? "100% validé" : `Écart de ${feuillePesee.ecartGrammes.toFixed(2)} g`}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}
