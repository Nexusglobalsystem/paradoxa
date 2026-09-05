import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

/**
 * Écran 2 — Manifeste (/manifeste). Gabarit repris de e2e/portail.spec.ts
 * (voir son commentaire d'en-tête) : smoke + axe-core, complétés par les
 * trois autres points de la checklist Vague 5 (.claude/agents/qa-accessibilite.md) —
 * navigation clavier, débordement mobile, et ici prefers-reduced-motion en
 * complément de portail.spec.ts (page longue avec plusieurs sections, bon
 * candidat pour vérifier que la neutralisation globale tient sur un
 * long-format éditorial et pas seulement sur le hero deux-portes).
 */
test.describe("Manifeste — /manifeste", () => {
  test("affiche l'histoire du groupe et ses deux maisons", async ({ page }) => {
    await page.goto("/manifeste");
    await expect(page.getByRole("heading", { name: /Vitellaria paradoxa/i, level: 1 })).toBeVisible();
    await expect(page.getByText("La dévotion à deux voix : SHÉA et ÉCLORÉE")).toBeVisible();
    await expect(page.getByRole("link", { name: "Découvrir la parfumerie SHÉA" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Explorer les soins ÉCLORÉE" })).toBeVisible();
  });

  test("ne présente aucune violation d'accessibilité bloquante (axe-core)", async ({ page }) => {
    await page.goto("/manifeste");
    const resultats = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa"])
      .analyze();

    const bloquantes = resultats.violations.filter(
      (v) => v.impact === "critical" || v.impact === "serious",
    );
    expect(bloquantes, JSON.stringify(bloquantes, null, 2)).toEqual([]);
  });

  test("navigation clavier : pas de piège tabindex, focus visible", async ({ page }) => {
    await page.goto("/manifeste");

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
    await page.goto("/manifeste");
    const largeurDocument = await page.evaluate(() => document.documentElement.scrollWidth);
    const largeurFenetre = page.viewportSize()?.width ?? 390;
    expect(largeurDocument).toBeLessThanOrEqual(largeurFenetre + 4);
  });

  test("prefers-reduced-motion : les transitions sont neutralisées", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/manifeste");
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
