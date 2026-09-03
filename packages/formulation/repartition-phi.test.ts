import { describe, expect, it } from "vitest";
import { PHI } from "./types";
import { repartitionPhi } from "./repartition-phi";

describe("repartitionPhi", () => {
  it("sums exactly to total", () => {
    const poids = repartitionPhi(5, 100);
    expect(poids.reduce((a, b) => a + b, 0)).toBeCloseTo(100, 9);
  });

  it("produces the canonical 50/31/19 split for n=3, total=100", () => {
    const [fond, coeur, tete] = repartitionPhi(3, 100);
    expect(fond).toBeCloseTo(50, 1);
    expect(coeur).toBeCloseTo(30.9, 1);
    expect(tete).toBeCloseTo(19.1, 1);
  });

  it("is strictly decreasing, each weight ≈ 0.618× the previous", () => {
    const poids = repartitionPhi(4, 100);
    for (let i = 1; i < poids.length; i++) {
      expect(poids[i]).toBeLessThan(poids[i - 1]);
      expect(poids[i] / poids[i - 1]).toBeCloseTo(1 / PHI, 9);
    }
  });

  it("n=1 gives the single position the full total", () => {
    expect(repartitionPhi(1, 100)).toEqual([100]);
  });

  it("n=0 returns an empty array", () => {
    expect(repartitionPhi(0, 100)).toEqual([]);
  });

  it("total=0 returns n zeros", () => {
    expect(repartitionPhi(3, 0)).toEqual([0, 0, 0]);
  });

  it("rejects a negative or non-integer n", () => {
    expect(() => repartitionPhi(-1, 100)).toThrow(RangeError);
    expect(() => repartitionPhi(1.5, 100)).toThrow(RangeError);
  });

  it("rejects a negative total", () => {
    expect(() => repartitionPhi(3, -10)).toThrow(RangeError);
  });
});
