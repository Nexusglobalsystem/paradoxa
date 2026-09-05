import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

/**
 * Écran 4 — Collection africaine SHÉA (/shea/collection). Gabarit
 * e2e/portail.spec.ts. La navigation d'escale porte une animation
 * `animate-[pulse_...]` déclarée en valeur arbitraire (voir
 * app/(vitrine)/shea/collection/page.tsx) : bon candidat pour vérifier que
 * la neutralisation globale de prefers-reduced-motion (app/design-tokens.css)
 * couvre aussi les animations Tailwind arbitraires, pas seulement les
 * classes `duration-*` standard.
 */
test.describe("Collection africaine SHÉA — /shea/collection", () => {
  test("affiche la collection et sa navigation d'escales", async ({ page }) => {
    await page.goto("/shea/collection");
    await expect(page.getByRole("heading", { name: "La collection africaine", level: 1 })).toBeVisible();
    await expect(page.getByRole("navigation", { name: "Aller à une escale" })).toBeVisible();
  });

  test("ne présente aucune violation d'accessibilité bloquante (axe-core)", async ({ page }) => {
    await page.goto("/shea/collection");
    const resultats = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa"])
      .analyze();

    const bloquantes = resultats.violations.filter(
      (v) => v.impact === "critical" || v.impact === "serious",
    );
    expect(bloquantes, JSON.stringify(bloquantes, null, 2)).toEqual([]);
  });

  test("navigation clavier : pas de piège tabindex, focus visible", async ({ page }) => {
    await page.goto("/shea/collection");

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
    await page.goto("/shea/collection");
    const largeurDocument = await page.evaluate(() => document.documentElement.scrollWidth);
    const largeurFenetre = page.viewportSize()?.width ?? 390;
    expect(largeurDocument).toBeLessThanOrEqual(largeurFenetre + 4);
  });

  test("prefers-reduced-motion : l'animation de la navigation d'escale est neutralisée", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/shea/collection");
    const dureeMax = await page.evaluate(() => {
      let max = 0;
      document.querySelectorAll("*").forEach((el) => {
        const style = getComputedStyle(el);
        max = Math.max(
          max,
          parseFloat(style.animationDuration) || 0,
          parseFloat(style.transitionDuration) || 0,
        );
      });
      return max;
    });
    expect(dureeMax).toBeLessThanOrEqual(0.05);
  });
});
