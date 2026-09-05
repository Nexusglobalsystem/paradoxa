import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

/**
 * Écran 7 — Landing du coffret découverte (/shea/coffret-decouverte).
 * Gabarit e2e/portail.spec.ts, étendu comme e2e/manifeste.spec.ts.
 */
test.describe("Coffret découverte — /shea/coffret-decouverte", () => {
  test("affiche le hero, la partition des escales et le protocole", async ({ page }) => {
    await page.goto("/shea/coffret-decouverte");
    await expect(page.getByRole("heading", { name: "Cinq escales, un coffret", level: 1 })).toBeVisible();
    await expect(page.getByRole("button", { name: /Acquérir le coffret découverte/ })).toBeVisible();
    await expect(page.getByRole("heading", { name: "La partition des cinq escales" })).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Le protocole d'apprivoisement à domicile" }),
    ).toBeVisible();
  });

  test("ne présente aucune violation d'accessibilité bloquante (axe-core)", async ({ page }) => {
    await page.goto("/shea/coffret-decouverte");
    const resultats = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa"])
      .analyze();

    const bloquantes = resultats.violations.filter(
      (v) => v.impact === "critical" || v.impact === "serious",
    );
    expect(bloquantes, JSON.stringify(bloquantes, null, 2)).toEqual([]);
  });

  test("chemin critique : le bandeau final ajoute le coffret au panier", async ({ page }) => {
    await page.goto("/shea/coffret-decouverte");
    await page
      .getByRole("button", { name: /Ajouter au panier/ })
      .click();
    await expect(page.getByRole("button", { name: /Ajouté au panier/i })).toBeVisible();

    await page.goto("/panier");
    await expect(page.getByRole("heading", { name: "Votre panier", level: 1 })).toBeVisible();
    await expect(page.getByText("1 création sélectionnée")).toBeVisible();
  });

  test("navigation clavier : pas de piège tabindex, focus visible", async ({ page }) => {
    await page.goto("/shea/coffret-decouverte");

    const interactifsIsoles = await page.$$eval(
      'a[href], button:not([disabled]), input:not([disabled]), [role="button"]',
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
    await page.goto("/shea/coffret-decouverte");
    const largeurDocument = await page.evaluate(() => document.documentElement.scrollWidth);
    const largeurFenetre = page.viewportSize()?.width ?? 390;
    expect(largeurDocument).toBeLessThanOrEqual(largeurFenetre + 4);
  });

  test("prefers-reduced-motion : les transitions sont neutralisées", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/shea/coffret-decouverte");
    const dureeMax = await page.evaluate(() => {
      let max = 0;
      document.querySelectorAll("*").forEach((el) => {
        const style = getComputedStyle(el);
        max = Math.max(max, parseFloat(style.animationDuration) || 0, parseFloat(style.transitionDuration) || 0);
      });
      return max;
    });
    expect(dureeMax).toBeLessThanOrEqual(0.05);
  });
});
