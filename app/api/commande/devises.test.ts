import { describe, expect, it } from "vitest";

import { convertirDepuisUnitesStripe, convertirEnUnitesStripe, estDeviseSansDecimales } from "./devises";

describe("estDeviseSansDecimales", () => {
  it("flags XOF (franc CFA — zone Wave/Orange Money) as zero-decimal", () => {
    expect(estDeviseSansDecimales("XOF")).toBe(true);
    expect(estDeviseSansDecimales("xof")).toBe(true);
  });

  it("does not flag EUR", () => {
    expect(estDeviseSansDecimales("EUR")).toBe(false);
  });
});

describe("convertirEnUnitesStripe", () => {
  it("multiplies by 100 for a standard 2-decimal currency (EUR)", () => {
    expect(convertirEnUnitesStripe(185, "EUR")).toBe(18500);
    expect(convertirEnUnitesStripe(6.9, "eur")).toBe(690);
  });

  it("does NOT multiply for a zero-decimal currency (XOF)", () => {
    expect(convertirEnUnitesStripe(121349, "XOF")).toBe(121349);
    expect(convertirEnUnitesStripe(1000, "xof")).toBe(1000);
  });

  it("rounds to the nearest integer to avoid float artifacts", () => {
    expect(convertirEnUnitesStripe(19.995, "EUR")).toBe(2000);
  });
});

describe("convertirDepuisUnitesStripe", () => {
  it("is the inverse of convertirEnUnitesStripe for EUR", () => {
    expect(convertirDepuisUnitesStripe(18500, "EUR")).toBe(185);
  });

  it("is the inverse of convertirEnUnitesStripe for XOF", () => {
    expect(convertirDepuisUnitesStripe(1000, "XOF")).toBe(1000);
  });
});
