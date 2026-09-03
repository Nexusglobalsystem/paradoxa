import { describe, expect, it } from "vitest";

import { LimiteurDebit } from "./rate-limit";

describe("LimiteurDebit", () => {
  it("allows requests up to the configured max within the window", () => {
    const limiteur = new LimiteurDebit(3, 1000);
    const t0 = 0;
    expect(limiteur.verifier("user-1", t0).autorise).toBe(true);
    expect(limiteur.verifier("user-1", t0 + 10).autorise).toBe(true);
    expect(limiteur.verifier("user-1", t0 + 20).autorise).toBe(true);
  });

  it("blocks the request once the max is exceeded within the window", () => {
    const limiteur = new LimiteurDebit(2, 1000);
    limiteur.verifier("user-1", 0);
    limiteur.verifier("user-1", 10);
    const troisieme = limiteur.verifier("user-1", 20);
    expect(troisieme.autorise).toBe(false);
    expect(troisieme.restantes).toBe(0);
  });

  it("resets the counter once the window has elapsed", () => {
    const limiteur = new LimiteurDebit(1, 1000);
    expect(limiteur.verifier("user-1", 0).autorise).toBe(true);
    expect(limiteur.verifier("user-1", 500).autorise).toBe(false);
    expect(limiteur.verifier("user-1", 1000).autorise).toBe(true);
  });

  it("tracks each user independently", () => {
    const limiteur = new LimiteurDebit(1, 1000);
    expect(limiteur.verifier("user-1", 0).autorise).toBe(true);
    expect(limiteur.verifier("user-2", 0).autorise).toBe(true);
    expect(limiteur.verifier("user-1", 10).autorise).toBe(false);
  });
});
