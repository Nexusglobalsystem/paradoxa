import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

/**
 * Écran signature n°1 (portail). Sert aussi de gabarit pour le reste de la
 * Vague 5 : un test de fumée (la page rend son contenu attendu) + un scan
 * axe-core (violations bloquantes seulement — voir .claude/agents/qa-accessibilite.md,
 * "axe-core sans violation bloquante"). Reproduire ce même schéma par écran
 * plutôt que d'inventer un nouveau pattern à chaque fichier.
 */
test.describe("Portail — /", () => {
  test("affiche les deux portes SHÉA et ÉCLORÉE", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { name: "SHÉA", exact: true })).toBeVisible();
    await expect(page.getByRole("heading", { name: "ÉCLORÉE", exact: true })).toBeVisible();
  });

  test("ne présente aucune violation d'accessibilité bloquante (axe-core)", async ({ page }) => {
    await page.goto("/");
    const resultats = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa"])
      .analyze();

    const bloquantes = resultats.violations.filter(
      (v) => v.impact === "critical" || v.impact === "serious",
    );
    expect(bloquantes, JSON.stringify(bloquantes, null, 2)).toEqual([]);
  });
});
