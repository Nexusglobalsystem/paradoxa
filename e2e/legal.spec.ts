import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

/**
 * Écran 23 — Pages légales (/mentions-legales, /cgv, /confidentialite).
 * Les trois routes partagent le même composant `LegalPage`
 * (app/(vitrine)/legal-template.tsx, cf. design/INVENTAIRE.md § écarts) :
 * une seule route est testée ici, /mentions-legales, comme représentative
 * du gabarit — /cgv et /confidentialite n'ont pas besoin d'un fichier
 * séparé puisqu'ils rendent la même structure avec un contenu différent.
 * Gabarit e2e/portail.spec.ts.
 */
test.describe("Pages légales — /mentions-legales (gabarit partagé avec /cgv et /confidentialite)", () => {
  test("affiche le sommaire sticky et les sections numérotées", async ({ page }) => {
    await page.goto("/mentions-legales");
    await expect(page.getByRole("heading", { name: "Mentions légales", level: 1 })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Édition du site" })).toBeVisible();

    // Le sommaire (aside) est délibérément `hidden lg:block` (voir
    // app/(vitrine)/legal-template.tsx) : sticky sur desktop uniquement, absent
    // du DOM visible en dessous de 1024px. On ne l'exige donc qu'au-delà de
    // ce seuil plutôt que de casser le test sur mobile-390.
    const largeurFenetre = page.viewportSize()?.width ?? 0;
    if (largeurFenetre >= 1024) {
      await expect(page.getByRole("navigation", { name: "Sommaire" })).toBeVisible();
    }
  });

  test("ne présente aucune violation d'accessibilité bloquante (axe-core)", async ({ page }) => {
    await page.goto("/mentions-legales");
    const resultats = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa"])
      .analyze();

    const bloquantes = resultats.violations.filter(
      (v) => v.impact === "critical" || v.impact === "serious",
    );
    expect(bloquantes, JSON.stringify(bloquantes, null, 2)).toEqual([]);
  });

  test("navigation clavier : pas de piège tabindex, focus visible", async ({ page }) => {
    await page.goto("/mentions-legales");

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
    await page.goto("/mentions-legales");
    const largeurDocument = await page.evaluate(() => document.documentElement.scrollWidth);
    const largeurFenetre = page.viewportSize()?.width ?? 390;
    expect(largeurDocument).toBeLessThanOrEqual(largeurFenetre + 4);
  });
});
