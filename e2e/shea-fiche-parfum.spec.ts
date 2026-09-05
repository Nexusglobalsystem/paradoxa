import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

/**
 * Écran 5 — Fiche parfum publique SHÉA (/shea/parfums/bois-de-shea), prise
 * comme fiche représentative du gabarit dynamique `[slug]` (voir la mission
 * de la Vague 5). Gabarit e2e/portail.spec.ts. Les assertions de fumée
 * portent sur le texte éditorial statique (fil d'Ariane, méthode SHÉA,
 * bouton d'action) plutôt que sur le nom du produit lui-même, qui vient de
 * Supabase et n'est pas garanti stable dans son libellé exact.
 */
const URL_FICHE = "/shea/parfums/bois-de-shea";

test.describe("Fiche parfum SHÉA — /shea/parfums/bois-de-shea", () => {
  test("affiche la fiche produit et son architecture olfactive", async ({ page }) => {
    await page.goto(URL_FICHE);
    await expect(page.getByRole("navigation", { name: "Fil d'Ariane" })).toBeVisible();
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Architecture olfactive au nombre d'or (φ = 1,618)" }),
    ).toBeVisible();
    await expect(page.getByRole("button", { name: /Ajouter au panier/i })).toBeVisible();
  });

  test("ne présente aucune violation d'accessibilité bloquante (axe-core)", async ({ page }) => {
    await page.goto(URL_FICHE);
    const resultats = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa"])
      .analyze();

    const bloquantes = resultats.violations.filter(
      (v) => v.impact === "critical" || v.impact === "serious",
    );
    expect(bloquantes, JSON.stringify(bloquantes, null, 2)).toEqual([]);
  });

  test("navigation clavier : pas de piège tabindex, focus visible", async ({ page }) => {
    await page.goto(URL_FICHE);

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
    await page.goto(URL_FICHE);
    const largeurDocument = await page.evaluate(() => document.documentElement.scrollWidth);
    const largeurFenetre = page.viewportSize()?.width ?? 390;
    expect(largeurDocument).toBeLessThanOrEqual(largeurFenetre + 4);
  });
});
