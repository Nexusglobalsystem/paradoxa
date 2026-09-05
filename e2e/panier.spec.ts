import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

/**
 * Écran 14 — Panier (/panier). Gabarit e2e/portail.spec.ts, complété par les
 * points clavier/mobile de la checklist Vague 5 (voir e2e/manifeste.spec.ts
 * pour le même schéma étendu). L'état par défaut du panier (localStorage
 * vide au premier chargement d'un contexte Playwright neuf) est l'état
 * "vide" — c'est l'état réel de production pour tout nouveau visiteur, donc
 * le sujet naturel des vérifications axe/clavier/mobile. L'état peuplé est
 * couvert séparément (ajout réel via une fiche produit, pas une injection
 * directe de localStorage) pour exercer le vrai chemin critique
 * ajout-au-panier → /panier.
 */
test.describe("Panier — /panier", () => {
  test("état vide : affiche les deux CTA vers les maisons", async ({ page }) => {
    await page.goto("/panier");
    await expect(
      page.getByRole("heading", { name: "Votre panier attend son premier voyage", level: 1 }),
    ).toBeVisible();
    await expect(page.getByRole("link", { name: "Découvrir la collection SHÉA" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Explorer la Maison ÉCLORÉE" })).toBeVisible();
  });

  test("ne présente aucune violation d'accessibilité bloquante (axe-core) — état vide", async ({ page }) => {
    await page.goto("/panier");
    const resultats = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa"])
      .analyze();

    const bloquantes = resultats.violations.filter(
      (v) => v.impact === "critical" || v.impact === "serious",
    );
    expect(bloquantes, JSON.stringify(bloquantes, null, 2)).toEqual([]);
  });

  test("navigation clavier : pas de piège tabindex, focus visible", async ({ page }) => {
    await page.goto("/panier");

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
    await page.goto("/panier");
    const largeurDocument = await page.evaluate(() => document.documentElement.scrollWidth);
    const largeurFenetre = page.viewportSize()?.width ?? 390;
    expect(largeurDocument).toBeLessThanOrEqual(largeurFenetre + 4);
  });

  test("prefers-reduced-motion : les transitions sont neutralisées", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/panier");
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

  test("chemin critique : ajouter une création depuis sa fiche remplit le panier", async ({ page }) => {
    await page.goto("/shea/parfums/bois-de-shea");
    const nomProduit = await page.getByRole("heading", { level: 1 }).innerText();

    await page.getByRole("button", { name: /Ajouter au panier/i }).click();
    await expect(page.getByRole("button", { name: /Ajouté au panier/i })).toBeVisible();

    await page.goto("/panier");
    await expect(page.getByRole("heading", { name: "Votre panier", level: 1 })).toBeVisible();
    await expect(page.getByText(nomProduit)).toBeVisible();
    await expect(page.getByRole("link", { name: "Passer commande" })).toBeVisible();
  });

  test("ne présente aucune violation d'accessibilité bloquante (axe-core) — état peuplé", async ({ page }) => {
    await page.goto("/shea/parfums/bois-de-shea");
    await page.getByRole("button", { name: /Ajouter au panier/i }).click();
    await page.goto("/panier");
    await expect(page.getByRole("heading", { name: "Votre panier", level: 1 })).toBeVisible();

    const resultats = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa"])
      .analyze();

    const bloquantes = resultats.violations.filter(
      (v) => v.impact === "critical" || v.impact === "serious",
    );
    expect(bloquantes, JSON.stringify(bloquantes, null, 2)).toEqual([]);
  });

  test("retirer l'unique article revient à l'état vide", async ({ page }) => {
    await page.goto("/shea/parfums/bois-de-shea");
    await page.getByRole("button", { name: /Ajouter au panier/i }).click();
    await page.goto("/panier");

    await page.getByRole("button", { name: "Retirer" }).click();
    await expect(
      page.getByRole("heading", { name: "Votre panier attend son premier voyage", level: 1 }),
    ).toBeVisible();
  });
});
