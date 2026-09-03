import { LIBELLE_ETAGE, ORDRE_ETAGES, PART_ETAGE } from "@/components/laboratoire/constantes-parfum";

/**
 * Progressive φ-strata skeleton shown while a generation call is in flight
 * (écran 33 : "les strates φ se dessinent progressivement"). Simple,
 * self-contained placeholder — components/laboratoire has no shared strata
 * *visualization* component yet (the parallel composeur build hadn't landed
 * one at the time this screen was built); swap this for that component
 * later if/when it exists, rather than blocking this screen on it. It does
 * already share the étage labels and the canonical 19/31/50 proportions
 * (PART_ETAGE, itself documented as matching packages/formulation's
 * REPARTITION_ETAGES) from constantes-parfum.ts, so this placeholder stays
 * consistent with the real composeur rather than inventing its own numbers.
 */
export function StrataLoading() {
  return (
    <div className="space-y-space-md">
      <p className="sr-only" role="status">
        Génération en cours — composition de la formule par le moteur φ.
      </p>
      <p aria-hidden="true" className="font-interface text-caption-meta uppercase tracking-widest text-sable/60">
        Décomposition architecturale φ en cours…
      </p>
      <div aria-hidden="true" className="space-y-space-md">
        {ORDRE_ETAGES.map((etage) => (
          <div key={etage} className="space-y-space-sm rounded-lg bg-ivoire-bouye/5 p-space-lg">
            <div className="flex items-center justify-between">
              <span className="font-headline-sm text-headline-sm text-ivoire-bouye/50">
                Strate de {LIBELLE_ETAGE[etage]}
              </span>
              <span className="font-label-tabular text-label-tabular text-or-karite/50">
                {PART_ETAGE[etage]}%
              </span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-encre-baobab">
              <div
                className="h-full animate-pulse rounded-full bg-or-karite/50"
                style={{ width: `${PART_ETAGE[etage]}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
