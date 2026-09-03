"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui";
import { Select } from "@/components/laboratoire/select";
import {
  CATEGORIE_IFRA_PARFUM,
  CONCENTRATION_PAR_TYPE,
  LIBELLE_CONCENTRATION,
} from "@/components/laboratoire/constantes-parfum";
import type {
  FormuleRow,
  MaisonGroupeDb,
  StatutFormule,
  TypeConcentrationDb,
} from "@/components/laboratoire/types";
import {
  calculerCout,
  calculerLot,
  equilibrerFormule,
  listeAllergenes,
  verifierIFRA,
} from "@/packages/formulation";
import type { Etage, Formule, LigneFormule } from "@/packages/formulation";

import { AtelierPesee } from "./atelier-pesee";
import { ColonneFormulation } from "./colonne-formulation";
import { enregistrerFormule, type PayloadEnregistrement } from "./actions";
import { etageParDefaut, ligneDepuisMatiere, type MatierePalette } from "./lignes";
import { PaletteMatieres } from "./palette-matieres";
import { PanneauAnalyse } from "./panneau-analyse";

export interface ComposeurParfumProps {
  /** null pour une formule pas encore créée (route "nouvelle"). */
  formuleId: string | null;
  formuleInitiale: FormuleRow | null;
  lignesInitiales: LigneFormule[];
  matieres: MatierePalette[];
  matieresFormule: MatierePalette[];
}

const CONCENTRATIONS: TypeConcentrationDb[] = ["edt", "edp", "extrait"];

const STATUTS: { value: StatutFormule; label: string }[] = [
  { value: "brouillon", label: "Brouillon" },
  { value: "en_test", label: "En test" },
  { value: "validee", label: "Validée" },
  { value: "production", label: "Production" },
  { value: "archivee", label: "Archivée" },
];

type EtatEnregistrement =
  | { statut: "idle" }
  | { statut: "cours" }
  | { statut: "succes"; heure: string }
  | { statut: "erreur"; message: string };

export function ComposeurParfum({
  formuleId,
  formuleInitiale,
  lignesInitiales,
  matieres,
  matieresFormule,
}: ComposeurParfumProps) {
  const router = useRouter();

  const [nom, setNom] = useState(formuleInitiale?.nom ?? "Nouvelle composition");
  const [codeReference, setCodeReference] = useState(formuleInitiale?.code_reference ?? "");
  const [maison, setMaison] = useState<MaisonGroupeDb>(formuleInitiale?.maison ?? "shea");
  const [typeConcentration, setTypeConcentration] = useState<TypeConcentrationDb>(
    formuleInitiale?.type_concentration ?? "extrait",
  );
  const [poidsReferenceG, setPoidsReferenceG] = useState(Number(formuleInitiale?.poids_reference_g) || 100);
  const [statut, setStatut] = useState<StatutFormule>(formuleInitiale?.statut ?? "brouillon");
  const [lignes, setLignes] = useState<LigneFormule[]>(lignesInitiales);
  const [pulsePhi, setPulsePhi] = useState(false);
  const [enregistrement, setEnregistrement] = useState<EtatEnregistrement>({ statut: "idle" });

  const matieresParId = useMemo(() => {
    const map = new Map<string, MatierePalette>();
    for (const m of matieres) map.set(m.id, m);
    for (const m of matieresFormule) if (!map.has(m.id)) map.set(m.id, m);
    return map;
  }, [matieres, matieresFormule]);

  const dejaAjoutees = useMemo(() => new Set(lignes.map((l) => l.id)), [lignes]);

  const formule: Formule = useMemo(
    () => ({ id: formuleId ?? "", nom, maison, type: "parfum", lignes }),
    [formuleId, nom, maison, lignes],
  );

  const concentrationPct = CONCENTRATION_PAR_TYPE[typeConcentration];

  const depassementsIFRA = useMemo(
    () => verifierIFRA(lignes, concentrationPct, CATEGORIE_IFRA_PARFUM),
    [lignes, concentrationPct],
  );
  const allergenesAgreges = useMemo(() => listeAllergenes(lignes), [lignes]);
  const feuillePesee = useMemo(
    () => calculerLot(formule, Math.max(poidsReferenceG, 0.01)),
    [formule, poidsReferenceG],
  );
  const coutLotReference = useMemo(
    () =>
      calculerCout(formule, {
        nom: "Lot de référence",
        contenanceMl: Math.max(poidsReferenceG, 0.01),
        densite: 1,
      }),
    [formule, poidsReferenceG],
  );
  const coutFlacon100ml = useMemo(
    () =>
      calculerCout(formule, {
        nom: "Flacon 100 ml",
        contenanceMl: Math.max(100 * (concentrationPct / 100), 0.01),
        densite: 1,
      }),
    [formule, concentrationPct],
  );

  function ajouterMatiere(matiere: MatierePalette) {
    if (dejaAjoutees.has(matiere.id)) return;
    setLignes((prev) => [...prev, ligneDepuisMatiere(matiere, etageParDefaut(matiere.volatilite))]);
  }

  function retirerLigne(id: string) {
    setLignes((prev) => prev.filter((l) => l.id !== id));
  }

  function changerPourcentage(id: string, valeur: number) {
    const bornee = Math.min(100, Math.max(0, Number.isFinite(valeur) ? valeur : 0));
    setLignes((prev) => prev.map((l) => (l.id === id ? { ...l, pourcentage: bornee } : l)));
  }

  function changerEtage(id: string, etage: Etage) {
    setLignes((prev) => prev.map((l) => (l.id === id ? { ...l, etage } : l)));
  }

  function equilibrerPhi() {
    setLignes((prev) => equilibrerFormule(prev));
    setPulsePhi(true);
    setTimeout(() => setPulsePhi(false), 600);
  }

  async function handleEnregistrer() {
    setEnregistrement({ statut: "cours" });

    const payload: PayloadEnregistrement = {
      formuleId,
      nom,
      codeReference: codeReference || null,
      maison,
      typeConcentration,
      poidsReferenceG,
      statut,
      description: formuleInitiale?.description ?? null,
      notes: formuleInitiale?.notes ?? null,
      lignes: lignes.map((l) => ({
        matiereId: l.id,
        etage: l.etage ?? "coeur",
        pourcentage: l.pourcentage,
      })),
    };

    const resultat = await enregistrerFormule(payload);

    if (!resultat.succes) {
      setEnregistrement({ statut: "erreur", message: resultat.erreur });
      return;
    }

    setEnregistrement({
      statut: "succes",
      heure: new Intl.DateTimeFormat("fr-FR", { hour: "2-digit", minute: "2-digit" }).format(new Date()),
    });

    if (!formuleId) {
      router.push(`/laboratoire/parfum/${resultat.formuleId}`);
    } else {
      router.refresh();
    }
  }

  const enregistrementEnCours = enregistrement.statut === "cours";

  return (
    <div data-maison={maison} className="min-h-screen bg-encre-baobab">
      <section className="relative overflow-hidden border-b border-or-karite/20 bg-encre-baobab px-space-lg py-space-lg text-ivoire-bouye shadow-xl lg:px-space-2xl">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-space-md">
          <div className="flex flex-wrap items-center justify-between gap-space-sm font-caption-meta text-[11px] uppercase tracking-wider text-or-karite/80">
            <div className="flex items-center gap-space-xs">
              <span>Laboratoire de formulation</span>
              <span aria-hidden="true" className="text-sable/40">
                /
              </span>
              <span className="text-ivoire-bouye">Composeur de parfum</span>
              {codeReference ? (
                <>
                  <span aria-hidden="true" className="text-sable/40">
                    /
                  </span>
                  <span className="font-label-tabular normal-case text-sable/70">{codeReference}</span>
                </>
              ) : null}
            </div>
            <div aria-live="polite" className="flex items-center gap-space-sm normal-case">
              {enregistrement.statut === "succes" ? (
                <span className="text-vert-moringa">Sauvegardé à {enregistrement.heure}</span>
              ) : null}
              {enregistrement.statut === "erreur" ? (
                <span role="alert" className="text-rouge-bissap">
                  {enregistrement.message}
                </span>
              ) : null}
            </div>
          </div>

          <div className="flex flex-col gap-space-md xl:flex-row xl:items-end xl:justify-between">
            <div className="max-w-2xl space-y-1">
              <div className="flex flex-wrap items-center gap-space-xs">
                <Select
                  aria-label="Maison"
                  value={maison}
                  onChange={(e) => setMaison(e.target.value as MaisonGroupeDb)}
                  className="w-auto border-or-karite/30 py-0 font-caption-meta text-[11px] uppercase tracking-[0.2em] text-or-karite"
                >
                  <option value="shea">Maison SHÉA</option>
                  <option value="ecloree">Maison ÉCLORÉE</option>
                </Select>
                <span aria-hidden="true" className="text-sable/30">
                  •
                </span>
                <Select
                  aria-label="Statut de la formule"
                  value={statut}
                  onChange={(e) => setStatut(e.target.value as StatutFormule)}
                  className="w-auto border-sable/20 py-0 font-caption-meta text-[11px] text-sable/70"
                >
                  {STATUTS.map((s) => (
                    <option key={s.value} value={s.value}>
                      {s.label}
                    </option>
                  ))}
                </Select>
              </div>
              <label className="sr-only" htmlFor="nom-formule">
                Nom de la formule
              </label>
              <input
                id="nom-formule"
                value={nom}
                onChange={(e) => setNom(e.target.value)}
                placeholder="Nom de la formule"
                className="w-full rounded bg-transparent font-display text-headline-md text-ivoire-bouye placeholder:text-sable/40 focus:outline-none focus:ring-1 focus:ring-or-karite"
              />
              <label className="sr-only" htmlFor="code-reference-formule">
                Référence de la formule
              </label>
              <input
                id="code-reference-formule"
                value={codeReference}
                onChange={(e) => setCodeReference(e.target.value)}
                placeholder="Référence (ex. SH-01-F924)"
                className="w-full rounded bg-transparent font-label-tabular text-[12px] text-sable/60 placeholder:text-sable/30 focus:outline-none focus:ring-1 focus:ring-or-karite"
              />
            </div>

            <div className="flex flex-wrap items-center gap-space-sm">
              <div className="flex items-center rounded-lg bg-ivoire-bouye/10 p-1 shadow-inner">
                {CONCENTRATIONS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setTypeConcentration(c)}
                    aria-pressed={typeConcentration === c}
                    className={cn(
                      "flex items-center gap-1 rounded px-space-sm py-1 font-label-tabular text-[13px] transition-colors duration-300 ease-out",
                      typeConcentration === c
                        ? "bg-or-karite font-medium text-encre-baobab shadow-sm"
                        : "text-sable/70 hover:text-ivoire-bouye",
                    )}
                  >
                    <span>{c.toUpperCase()}</span>
                    <span className="text-[11px] opacity-70">{CONCENTRATION_PAR_TYPE[c]}%</span>
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={equilibrerPhi}
                disabled={lignes.length === 0}
                className={cn(
                  "flex items-center gap-1.5 rounded bg-ivoire-bouye/10 px-space-sm py-2 font-interface text-[13px] text-or-karite shadow-sm transition-all duration-300 ease-out hover:bg-or-karite hover:text-encre-baobab disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-ivoire-bouye/10 disabled:hover:text-or-karite",
                  pulsePhi && "ring-2 ring-or-karite",
                )}
              >
                Équilibrer selon φ (1.618)
              </button>

              <Button
                type="button"
                variant="primary"
                onClick={handleEnregistrer}
                disabled={enregistrementEnCours}
                className="bg-terre-de-dakar text-ivoire-bouye hover:brightness-90"
              >
                {enregistrementEnCours ? "Enregistrement…" : "Enregistrer la formule"}
              </Button>
            </div>
          </div>
        </div>
      </section>

      <main className="mx-auto grid max-w-[1440px] grid-cols-1 gap-space-lg px-space-lg py-space-xl lg:grid-cols-12 lg:px-space-2xl">
        <PaletteMatieres matieres={matieres} dejaAjoutees={dejaAjoutees} onAjouter={ajouterMatiere} />
        <ColonneFormulation
          lignes={lignes}
          matieresParId={matieresParId}
          poidsReferenceG={poidsReferenceG}
          onChangerPoidsReference={setPoidsReferenceG}
          feuillePesee={feuillePesee}
          coutLotReference={coutLotReference}
          depassementsIFRA={depassementsIFRA}
          onChangerPourcentage={changerPourcentage}
          onChangerEtage={changerEtage}
          onRetirer={retirerLigne}
        />
        <PanneauAnalyse
          lignes={lignes}
          depassements={depassementsIFRA}
          allergenes={allergenesAgreges}
          coutLotReference={coutLotReference}
          coutFlacon100ml={coutFlacon100ml}
          poidsReferenceG={poidsReferenceG}
          concentrationPct={concentrationPct}
        />
      </main>

      <AtelierPesee concentrationPct={concentrationPct} libelleConcentration={LIBELLE_CONCENTRATION[typeConcentration]} />
    </div>
  );
}
