import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

/**
 * Écran 10 — Fiche produit cosmétique publique ÉCLORÉE
 * (/ecloree/produits/baume-prodigieux-karite-sauvage), prise comme fiche
 * représentative du gabarit dynamique `[slug]`. Gabarit e2e/portail.spec.ts.
 * Comme pour la fiche SHÉA, les assertions de fumée évitent le nom du
 * produit (donnée Supabase) au profit du texte éditorial statique.
 */
const URL_FICHE = "/ecloree/produits/baume-prodigieux-karite-sauvage";

test.describe("Fiche produit ÉCLORÉE — /ecloree/produits/baume-prodigieux-karite-sauvage", () => {
  test("affiche la fiche produit et ses onglets", async ({ page }) => {
    await page.goto(URL_FICHE);
    await expect(page.getByRole("navigation", { name: "Fil d'Ariane" })).toBeVisible();
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.getByRole("tab", { name: "Bienfaits" })).toBeVisible();
    await expect(page.getByRole("tab", { name: "Ingrédients" })).toBeVisible();
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
