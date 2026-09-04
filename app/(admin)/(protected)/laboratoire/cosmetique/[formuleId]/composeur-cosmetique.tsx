"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui";
import { Select } from "@/components/laboratoire/select";
import type { FormuleRow, MaisonGroupeDb, StatutFormule } from "@/components/laboratoire/types";
import { calculerCout, genererINCI } from "@/packages/formulation";
import type { Formule, LigneFormule, PhaseCosmetique } from "@/packages/formulation";

import { AtelierLot } from "./atelier-lot";
import { ColonneFormulation } from "./colonne-formulation";
import { enregistrerFormule, type PayloadEnregistrement } from "./actions";
import { ligneDepuisMatiere, phaseParDefaut, type MatierePalette } from "./lignes";
import { PaletteMatieres } from "./palette-matieres";
import { PanneauAnalyse } from "./panneau-analyse";

export interface ComposeurCosmetiqueProps {
  /** null pour une formule pas encore créée (route "nouvelle"). */
  formuleId: string | null;
  formuleInitiale: FormuleRow | null;
  lignesInitiales: LigneFormule[];
  /** Extraits de formuleInitiale.notes par page.tsx — voir ph.ts. */
  phCibleInitial: number | null;
  resteNotesInitial: string | null;
  matieres: MatierePalette[];
  matieresFormule: MatierePalette[];
}

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

export function ComposeurCosmetique({
  formuleId,
  formuleInitiale,
  lignesInitiales,
  phCibleInitial,
  resteNotesInitial,
  matieres,
  matieresFormule,
}: ComposeurCosmetiqueProps) {
  const router = useRouter();

  const [nom, setNom] = useState(formuleInitiale?.nom ?? "Nouvelle formule");
  const [codeReference, setCodeReference] = useState(formuleInitiale?.code_reference ?? "");
  const [maison, setMaison] = useState<MaisonGroupeDb>(formuleInitiale?.maison ?? "ecloree");
  const [poidsReferenceG, setPoidsReferenceG] = useState(Number(formuleInitiale?.poids_reference_g) || 100);
  const [statut, setStatut] = useState<StatutFormule>(formuleInitiale?.statut ?? "brouillon");
  const [phCible, setPhCible] = useState<number | null>(phCibleInitial);
  const [lignes, setLignes] = useState<LigneFormule[]>(lignesInitiales);
  const [enregistrement, setEnregistrement] = useState<EtatEnregistrement>({ statut: "idle" });

  const matieresParId = useMemo(() => {
    const map = new Map<string, MatierePalette>();
    for (const m of matieres) map.set(m.id, m);
    for (const m of matieresFormule) if (!map.has(m.id)) map.set(m.id, m);
    return map;
  }, [matieres, matieresFormule]);

  const dejaAjoutees = useMemo(() => new Set(lignes.map((l) => l.id)), [lignes]);

  const formule: Formule = useMemo(
    () => ({ id: formuleId ?? "", nom, maison, type: "cosmetique", lignes }),
    [formuleId, nom, maison, lignes],
  );

  const inci = useMemo(() => genererINCI(lignes), [lignes]);

  const coutLotReference = useMemo(
    () =>
      calculerCout(formule, {
        nom: "Lot de référence",
        contenanceMl: Math.max(poidsReferenceG, 0.01),
        densite: 1,
      }),
    [formule, poidsReferenceG],
  );

  function ajouterMatiere(matiere: MatierePalette) {
    if (dejaAjoutees.has(matiere.id)) return;
    setLignes((prev) => [...prev, ligneDepuisMatiere(matiere, phaseParDefaut())]);
  }

  function retirerLigne(id: string) {
    setLignes((prev) => prev.filter((l) => l.id !== id));
  }

  function changerPourcentage(id: string, valeur: number) {
    const bornee = Math.min(100, Math.max(0, Number.isFinite(valeur) ? valeur : 0));
    setLignes((prev) => prev.map((l) => (l.id === id ? { ...l, pourcentage: bornee } : l)));
  }

  function changerPhase(id: string, phase: PhaseCosmetique) {
    setLignes((prev) => prev.map((l) => (l.id === id ? { ...l, phase } : l)));
  }

  async function handleEnregistrer() {
    setEnregistrement({ statut: "cours" });

    const payload: PayloadEnregistrement = {
      formuleId,
      nom,
      codeReference: codeReference || null,
      maison,
      poidsReferenceG,
      statut,
      phCible,
      description: formuleInitiale?.description ?? null,
      notesExistantes: resteNotesInitial,
      lignes: lignes.map((l) => ({
        matiereId: l.id,
        phase: l.phase ?? "ajouts",
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
      router.push(`/laboratoire/cosmetique/${resultat.formuleId}`);
    } else {
      router.refresh();
    }
  }

  const enregistrementEnCours = enregistrement.statut === "cours";

  return (
    <div data-maison={maison} className="min-h-screen bg-ivoire-bouye">
      <section className="border-b border-sable bg-surface-container-low px-space-lg py-space-lg lg:px-space-2xl">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-space-md">
          <div className="flex flex-wrap items-center justify-between gap-space-sm font-caption-meta text-[11px] uppercase tracking-wider text-on-surface-variant">
            <div className="flex items-center gap-space-xs">
              <span>Laboratoire de formulation</span>
              <span aria-hidden="true" className="text-outline-variant">
                /
              </span>
              <span className="text-encre-baobab">Composeur cosmétique</span>
              {codeReference ? (
                <>
                  <span aria-hidden="true" className="text-outline-variant">
                    /
                  </span>
                  <span className="font-label-tabular normal-case text-on-surface-variant/80">{codeReference}</span>
                </>
              ) : null}
            </div>
            <div aria-live="polite" className="flex items-center gap-space-sm normal-case">
              {enregistrement.statut === "succes" ? (
                <span className="text-success">Sauvegardé à {enregistrement.heure}</span>
              ) : null}
              {enregistrement.statut === "erreur" ? (
                <span role="alert" className="text-danger">
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
                  className="w-auto border-outline-variant/50 py-0 font-caption-meta text-[11px] uppercase tracking-[0.2em] text-vert-moringa"
                >
                  <option value="ecloree">Maison ÉCLORÉE</option>
                  <option value="shea">Maison SHÉA</option>
                </Select>
                <span aria-hidden="true" className="text-outline-variant">
                  •
                </span>
                <Select
                  aria-label="Statut de la formule"
                  value={statut}
                  onChange={(e) => setStatut(e.target.value as StatutFormule)}
                  className="w-auto border-outline-variant/40 py-0 font-caption-meta text-[11px] text-on-surface-variant"
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
                className="w-full rounded bg-transparent font-display text-headline-md text-encre-baobab placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-1 focus:ring-vert-moringa"
              />
              <label className="sr-only" htmlFor="code-reference-formule">
                Référence de la formule
              </label>
              <input
                id="code-reference-formule"
                value={codeReference}
                onChange={(e) => setCodeReference(e.target.value)}
                placeholder="Référence (ex. EC-FORM-2025-08)"
                className="w-full rounded bg-transparent font-label-tabular text-[12px] text-on-surface-variant placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-1 focus:ring-vert-moringa"
              />
            </div>

            <div className="flex flex-wrap items-center gap-space-sm">
              <div className="rounded-lg bg-surface-container-lowest px-space-md py-2 text-right shadow-sm">
                <div className="font-caption-meta text-[10px] uppercase tracking-widest text-on-surface-variant">
                  Coût matière / kg
                </div>
                <div className="font-label-tabular text-[16px] font-semibold text-terre-de-dakar">
                  {new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(
                    coutLotReference.coutParKg,
                  )}
                </div>
              </div>

              <Button
                type="button"
                variant="primary"
                onClick={handleEnregistrer}
                disabled={enregistrementEnCours}
                className="bg-vert-moringa text-ivoire-bouye hover:brightness-90"
              >
                {enregistrementEnCours ? "Enregistrement…" : "Enregistrer la formule"}
              </Button>
            </div>
          </div>
        </div>
      </section>

      <main
        className={cn(
          "mx-auto grid max-w-[1440px] grid-cols-1 gap-space-lg px-space-lg py-space-xl lg:grid-cols-12 lg:px-space-2xl",
        )}
      >
        <PaletteMatieres matieres={matieres} dejaAjoutees={dejaAjoutees} onAjouter={ajouterMatiere} />
        <ColonneFormulation
          lignes={lignes}
          matieresParId={matieresParId}
          poidsReferenceG={poidsReferenceG}
          onChangerPoidsReference={setPoidsReferenceG}
          onChangerPourcentage={changerPourcentage}
          onChangerPhase={changerPhase}
          onRetirer={retirerLigne}
        />
        <PanneauAnalyse
          lignes={lignes}
          matieresParId={matieresParId}
          inci={inci}
          phCible={phCible}
          onChangerPhCible={setPhCible}
          cout={coutLotReference}
          poidsReferenceG={poidsReferenceG}
        />
      </main>

      <AtelierLot formule={formule} />
    </div>
  );
}
