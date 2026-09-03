import { PHI } from "./types";

/**
 * Splits `total` across `n` positions using golden-ratio decay:
 * weight(i) ∝ φ^-i, normalized so the n weights sum exactly to `total`.
 * Position 0 is dominant, each following position is ~0.618× the previous.
 *
 * This is the primitive behind the group's proportion rules:
 * repartitionPhi(3, 100) ≈ [50, 30.9, 19.1] — the fond/coeur/tête split
 * that equilibrerFormule applies to a perfume's three étages.
 */
export function repartitionPhi(n: number, total: number): number[] {
  if (!Number.isInteger(n) || n < 0) {
    throw new RangeError(`repartitionPhi: n doit être un entier positif ou nul, reçu ${n}`);
  }
  if (n === 0) return [];
  if (total < 0) {
    throw new RangeError(`repartitionPhi: total ne peut pas être négatif, reçu ${total}`);
  }

  const poids = Array.from({ length: n }, (_, i) => PHI ** -i);
  const somme = poids.reduce((acc, p) => acc + p, 0);
  return poids.map((p) => (p / somme) * total);
}
