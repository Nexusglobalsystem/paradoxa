"use client";

import Link from "next/link";

import { Badge } from "@/components/ui";
import {
  CATEGORIE_IFRA_PARFUM,
  CONCENTRATION_PAR_TYPE,
  LIBELLE_ETAGE,
  ORDRE_ETAGES,
} from "@/components/laboratoire/constantes-parfum";
import { FAMILLES_OLFACTIVES } from "@/components/laboratoire/familles-olfactives";
import { calculerCout, verifierIFRA } from "@/packages/formulation";
import type { Etage, Formule } from "@/packages/formulation";
import { cn } from "@/lib/utils";

import type { ReponseGenerationSucces } from "@/app/api/laboratoire/generation/schema";

// Descriptive subtitle per étage — the composeur (écran 32) shares the short
// label (LIBELLE_ETAGE) and the concentration/IFRA constants below; this
// longer copy is specific to this screen's mockup (écran 33).
const DESCRIPTION_ETAGE: Record<Etage, string> = {
  tete: "Première frappe volatile (0 – 30 min)",
  coeur: "Signature narrative & sillage (30 min – 4 h)",
  fond: "Rémanence & fixation (4 h – 36 h)",
};

export interface ResultatFormuleProps {
  resultat: ReponseGenerationSucces;
  concentration: string;
  onRegenerer: () => void;
}

/**
 * The generated formula card: name, story phrase, the mandatory "this is a
 * proposal, not a validation" banner (.claude/agents/ia-composition.md rule
 * 4 — visible text, not just a code comment), the three φ strata with their
 * real lines, and the two exit actions.
 *
 * Cost and IFRA figures are computed here from the real formulation engine
 * (packages/formulation) against the hydrated, real-materials-only lines —
 * never numbers invented by the model.
 */
export function ResultatFormule({ resultat, concentration, onRegenerer }: ResultatFormuleProps) {
  const { formule, phraseRecit, avertissement, matieresIgnorees } = resultat;

  const cout = calculerCout(formule, { nom: "100 ml", contenanceMl: 100 });
  const concentrationPourcentage =
    CONCENTRATION_PAR_TYPE[concentration as keyof typeof CONCENTRATION_PAR_TYPE] ?? 18;
  const depassements = verifierIFRA(formule.lignes, concentrationPourcentage, CATEGORIE_IFRA_PARFUM);

  const lignesParEtage = new Map<Etage, Formule["lignes"]>(ORDRE_ETAGES.map((e) => [e, []]));
  for (const ligne of formule.lignes) {
    if (ligne.etage) lignesParEtage.get(ligne.etage)?.push(ligne);
  }

  return (
    <div className="space-y-space-xl">
      <div
        role="status"
        className="flex items-start gap-space-sm rounded-lg border border-or-karite/40 bg-or-karite/10 px-space-md py-space-sm"
      >
        <span aria-hidden="true" className="font-caption-meta text-or-karite">
          &#128274;
        </span>
        <p className="font-interface text-caption-meta text-ivoire-bouye">{avertissement}</p>
      </div>

      <div className="grid grid-cols-1 gap-space-md rounded-xl bg-ivoire-bouye/5 p-space-md md:grid-cols-3">
        <Metrique label="Matières" valeur={String(formule.lignes.length)} />
        <Metrique label="Coût matière estimé" valeur={`${cout.coutParFlacon.toFixed(2)} € / 100 ml`} />
        <Metrique
          label={`Conformité IFRA (cat. ${CATEGORIE_IFRA_PARFUM})`}
          valeur={depassements.length === 0 ? "Conforme" : `${depassements.length} dépassement(s)`}
          alerte={depassements.length > 0}
        />
      </div>

      <div className="grid grid-cols-1 gap-space-xl lg:grid-cols-12">
        <div className="space-y-space-md lg:col-span-8">
          <div className="flex flex-wrap items-baseline justify-between gap-space-xs">
            <h2 className="font-display text-headline-md text-ivoire-bouye">{formule.nom}</h2>
            <Badge variant="outline" className="border-sable/40 text-sable">
              {formule.maison === "shea" ? "Maison SHÉA" : "Maison ÉCLORÉE"}
            </Badge>
          </div>
          <p className="font-interface text-body-reading italic text-sable/80">{phraseRecit}</p>

          {ORDRE_ETAGES.map((etage) => {
            const lignes = lignesParEtage.get(etage) ?? [];
            if (lignes.length === 0) return null;
            const totalEtage = lignes.reduce((acc, l) => acc + l.pourcentage, 0);
            return (
              <div key={etage} className="space-y-space-sm rounded-lg bg-ivoire-bouye/5 p-space-lg">
                <div className="flex flex-wrap items-center justify-between gap-space-xs">
                  <div className="flex items-center gap-space-sm">
                    <Badge variant="outline" className="border-or-karite/40 text-or-karite">
                      {totalEtage.toFixed(1)}%
                    </Badge>
                    <h3 className="font-headline-sm text-headline-sm text-ivoire-bouye">
                      Strate de {LIBELLE_ETAGE[etage]}
                    </h3>
                  </div>
                  <span className="font-caption-meta text-caption-meta text-sable/60">
                    {DESCRIPTION_ETAGE[etage]}
                  </span>
                </div>
                <div className="flex h-1.5 w-full overflow-hidden rounded-full bg-encre-baobab">
                  {lignes.map((ligne) => (
                    <div
                      key={ligne.id}
                      className={cn(
                        "h-full first:rounded-l-full last:rounded-r-full",
                        ligne.familleOlfactive ? FAMILLES_OLFACTIVES[ligne.familleOlfactive].bg : "bg-or-karite",
                      )}
                      style={{ width: `${(ligne.pourcentage / (totalEtage || 1)) * 100}%` }}
                      title={`${ligne.nomMatiere} (${ligne.pourcentage.toFixed(1)}%)`}
                    />
                  ))}
                </div>
                <div className="grid grid-cols-1 gap-space-sm pt-space-xs sm:grid-cols-2">
                  {lignes.map((ligne) => (
                    <div key={ligne.id} className="space-y-space-xxs rounded bg-encre-baobab/60 p-space-sm">
                      <div className="flex items-center justify-between gap-space-sm">
                        <span className="font-interface text-body-ui font-medium text-ivoire-bouye">
                          {ligne.nomMatiere}
                        </span>
                        <span className="font-label-tabular text-label-tabular text-or-karite">
                          {ligne.pourcentage.toFixed(1)}%
                        </span>
                      </div>
                      <div className="flex items-center justify-between gap-space-sm">
                        {ligne.inci ? (
                          <p className="font-caption-meta text-caption-meta text-sable/50">{ligne.inci}</p>
                        ) : (
                          <span />
                        )}
                        {ligne.familleOlfactive ? (
                          <span
                            className={cn(
                              "rounded px-space-xs py-px font-caption-meta text-caption-meta",
                              FAMILLES_OLFACTIVES[ligne.familleOlfactive].badgeClass,
                            )}
                          >
                            {FAMILLES_OLFACTIVES[ligne.familleOlfactive].label}
                          </span>
                        ) : null}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}

          {matieresIgnorees.length > 0 ? (
            <p className="font-caption-meta text-caption-meta text-sable/50">
              {matieresIgnorees.length} matière(s) proposée(s) par le modèle {matieresIgnorees.length > 1 ? "ont" : "a"}{" "}
              été ignorée(s) — identifiant(s) inconnu(s) en base.
            </p>
          ) : null}
        </div>

        <div className="space-y-space-sm lg:col-span-4">
          <Link
            href={`/laboratoire/parfum/${resultat.formuleId}`}
            className="font-interface inline-flex w-full items-center justify-center gap-space-sm rounded-lg bg-or-karite px-space-lg py-space-md text-body-ui font-medium text-encre-baobab shadow-ambient transition-colors duration-300 ease-out hover:brightness-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-or-karite focus-visible:ring-offset-2 focus-visible:ring-offset-encre-baobab"
          >
            Ouvrir dans le composeur
          </Link>
          <button
            type="button"
            onClick={onRegenerer}
            className="font-interface inline-flex w-full items-center justify-center gap-space-sm rounded-lg border border-ivoire-bouye/20 px-space-lg py-space-md text-body-ui font-medium text-ivoire-bouye transition-colors duration-300 ease-out hover:bg-ivoire-bouye/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-or-karite focus-visible:ring-offset-2 focus-visible:ring-offset-encre-baobab"
          >
            Régénérer
          </button>
        </div>
      </div>
    </div>
  );
}

function Metrique({ label, valeur, alerte }: { label: string; valeur: string; alerte?: boolean }) {
  return (
    <div className="space-y-space-xxs px-space-sm">
      <span className="block font-caption-meta text-caption-meta uppercase text-sable/60">{label}</span>
      <span className={cn("font-headline-sm text-headline-sm", alerte ? "text-rouge-bissap" : "text-or-karite")}>
        {valeur}
      </span>
    </div>
  );
}
