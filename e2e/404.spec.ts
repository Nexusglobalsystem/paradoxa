import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

/**
 * Écran 24 — Erreur 404 (app/not-found.tsx), déclenché en visitant une URL
 * inexistante. Gabarit e2e/portail.spec.ts.
 */
test.describe("404 — page introuvable", () => {
  test("affiche le message d'escale introuvable et les deux CTA", async ({ page }) => {
    const reponse = await page.goto("/cette-page-nexiste-pas");
    expect(reponse?.status()).toBe(404);
    await expect(
      page.getByRole("heading", { name: "Cette escale n'existe pas.", level: 1 }),
    ).toBeVisible();
    await expect(page.getByRole("link", { name: "Retour à l'accueil" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Voir la collection" })).toBeVisible();
  });

  test("ne présente aucune violation d'accessibilité bloquante (axe-core)", async ({ page }) => {
    await page.goto("/cette-page-nexiste-pas");
    const resultats = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa"])
      .analyze();

    const bloquantes = resultats.violations.filter(
      (v) => v.impact === "critical" || v.impact === "serious",
    );
    expect(bloquantes, JSON.stringify(bloquantes, null, 2)).toEqual([]);
  });

  test("navigation clavier : pas de piège tabindex, focus visible", async ({ page }) => {
    await page.goto("/cette-page-nexiste-pas");

    const interactifsIsoles = await page.$$eval(
      'a[href], button:not([disabled]):not([role="tab"]), input:not([disabled]), [role="button"]:not([role="tab"])',
      (elements) => elements.filter((el) => el.getAttribute("tabindex") === "-1").length,
    );
    expect(interactifsIsoles).toBe(0);

    await page.keyboard.press("Tab");
    const focus = await page.evaluate(() => {
      const el = document.activeElement as HTMLElement | null;
      if (!el) return null;
      const style = getComputedStyle(el);
      return { tag: el.tagName, outlineStyle: style.outlineStyle, boxShadow: style.boxShadow };
    });
    expect(focus).not.toBeNull();
    expect(
      focus!.outlineStyle !== "none" || focus!.boxShadow !== "none",
      `Le premier élément atteint par Tab (${focus?.tag}) ne présente aucune indication de focus visible.`,
    ).toBe(true);
  });

  test("rendu mobile 390px : aucun débordement horizontal", async ({ page }) => {
    await page.goto("/cette-page-nexiste-pas");
    const largeurDocument = await page.evaluate(() => document.documentElement.scrollWidth);
    const largeurFenetre = page.viewportSize()?.width ?? 390;
    expect(largeurDocument).toBeLessThanOrEqual(largeurFenetre + 4);
  });
});
