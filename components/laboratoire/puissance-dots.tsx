import { cn } from "@/lib/utils";

export interface PuissanceDotsProps {
  /** Échelle 1 à 5 (matieres.puissance). */
  valeur: number;
  className?: string;
}

/**
 * Échelle de puissance à 5 points (écran 30 : pastilles ●●●●●). Purement
 * présentationnel — Server Component.
 */
export function PuissanceDots({ valeur, className }: PuissanceDotsProps) {
  const points = Array.from({ length: 5 }, (_, i) => i < valeur);
  return (
    <span
      role="img"
      aria-label={`Puissance ${valeur} sur 5`}
      className={cn("inline-flex items-center gap-0.5 text-or-karite-strong text-[11px]", className)}
    >
      {points.map((rempli, i) => (
        <span key={i} aria-hidden="true" className={rempli ? undefined : "opacity-30"}>
          {rempli ? "●" : "○"}
        </span>
      ))}
    </span>
  );
}
