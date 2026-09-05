import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

/**
 * Écrans 12 et 13 — Journal, index (/journal) et article
 * (/journal/aube-sur-le-ferlo). Regroupés dans un seul fichier : ce sont
 * deux vues d'un même gabarit éditorial (liste → détail), cohérent avec la
 * consigne de la Vague 5 de grouper les écrans apparentés. Gabarit
 * e2e/portail.spec.ts.
 */
test.describe("Journal — /journal", () => {
  test("affiche l'article à la une et la grille des chroniques", async ({ page }) => {
    await page.goto("/journal");
    await expect(
      page.getByRole("heading", { name: "Écritures de la terre et du parfum", level: 1 }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: /aube sur le Ferlo/i }),
    ).toBeVisible();
  });

  test("ne présente aucune violation d'accessibilité bloquante (axe-core)", async ({ page }) => {
    await page.goto("/journal");
    const resultats = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa"])
      .analyze();

    const bloquantes = resultats.violations.filter(
      (v) => v.impact === "critical" || v.impact === "serious",
    );
    expect(bloquantes, JSON.stringify(bloquantes, null, 2)).toEqual([]);
  });

  test("navigation clavier : pas de piège tabindex, focus visible", async ({ page }) => {
    await page.goto("/journal");

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
    await page.goto("/journal");
    const largeurDocument = await page.evaluate(() => document.documentElement.scrollWidth);
    const largeurFenetre = page.viewportSize()?.width ?? 390;
    expect(largeurDocument).toBeLessThanOrEqual(largeurFenetre + 4);
  });
});

test.describe("Article — /journal/aube-sur-le-ferlo", () => {
  test("affiche le hero, le corps de l'article et la signature", async ({ page }) => {
    await page.goto("/journal/aube-sur-le-ferlo");
    await expect(
      page.getByRole("heading", {
        name: "L'aube sur le Ferlo : sur la piste des cueilleuses de moringa",
        level: 1,
      }),
    ).toBeVisible();
    // .first() : "Aïcha Ndoye" apparaît deux fois sur la page (barre méta +
    // bloc signature en pied d'article) — un seul suffit pour le test de fumée.
    await expect(page.getByText("Aïcha Ndoye").first()).toBeVisible();
  });

  test("ne présente aucune violation d'accessibilité bloquante (axe-core)", async ({ page }) => {
    await page.goto("/journal/aube-sur-le-ferlo");
    const resultats = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa"])
      .analyze();

    const bloquantes = resultats.violations.filter(
      (v) => v.impact === "critical" || v.impact === "serious",
    );
    expect(bloquantes, JSON.stringify(bloquantes, null, 2)).toEqual([]);
  });

  test("navigation clavier : pas de piège tabindex, focus visible", async ({ page }) => {
    await page.goto("/journal/aube-sur-le-ferlo");

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
    await page.goto("/journal/aube-sur-le-ferlo");
    const largeurDocument = await page.evaluate(() => document.documentElement.scrollWidth);
    const largeurFenetre = page.viewportSize()?.width ?? 390;
    expect(largeurDocument).toBeLessThanOrEqual(largeurFenetre + 4);
  });
});
