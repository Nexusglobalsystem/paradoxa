import type { Formule } from "./types";

export interface FormatProduit {
  /** Libellé du format côté SKU, ex. "50 ml", "Pot 200 g". */
  nom: string;
  contenanceMl: number;
  /** g/mL — défaut 1 (eau) si la densité réelle du mélange fini n'est pas encore connue. */
  densite?: number;
}

export interface CoutFormule {
  coutParKg: number;
  grammesParFlacon: number;
  coutParFlacon: number;
}

const arrondi2 = (n: number) => Math.round(n * 100) / 100;

/**
 * Material cost of the formula: per kg of compound, and per finished unit
 * of `format`. Weights each material's price by the share it's given —
 * doesn't require the lines' percentages to sum to 100, it just prices what
 * it's handed.
 */
export function calculerCout(formule: Formule, format: FormatProduit): CoutFormule {
  if (format.contenanceMl <= 0) {
    throw new RangeError(
      `calculerCout: contenanceMl doit être positive, reçu ${format.contenanceMl}`
    );
  }

  const coutParKg = arrondi2(
    formule.lignes.reduce((acc, l) => acc + (l.pourcentage / 100) * l.prixParKg, 0)
  );
  const grammesParFlacon = arrondi2(format.contenanceMl * (format.densite ?? 1));
  const coutParFlacon = arrondi2((coutParKg * grammesParFlacon) / 1000);

  return { coutParKg, grammesParFlacon, coutParFlacon };
}
