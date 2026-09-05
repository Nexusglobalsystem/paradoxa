import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

/**
 * Écran 6 — Quiz olfactif (/shea/quiz). Gabarit e2e/portail.spec.ts, étendu
 * comme e2e/manifeste.spec.ts. Le quiz exige une validation explicite à
 * chaque étape (choisir une carte puis cliquer "Poursuivre le voyage" /
 * "Découvrir mon escale", voir quiz-client.tsx) : le parcours ci-dessous
 * répète ce geste pour les 5 questions plutôt que de cliquer les boutons
 * radio en boucle, pour exercer la vraie logique de progression
 * (allerSuivant() n'avance que si une option est sélectionnée).
 */
async function repondreATouteLesQuestions(page: Page) {
  await page.goto("/shea/quiz");
  for (let etape = 0; etape < 5; etape += 1) {
    // La transition entre questions (transitionner() dans quiz-client.tsx)
    // retarde le vrai changement d'étape de 260ms derrière un fondu — sans
    // attendre que le titre change, une itération suivante peut cliquer sur
    // le radio de la question qui est encore en train de disparaître,
    // laissant le bouton "Poursuivre" bloqué désactivé (Vague 5, flaky e2e).
    const titrePrecedent = await page.getByRole("heading", { level: 1 }).textContent();
    await page.getByRole("radiogroup").getByRole("radio").first().click();
    await page
      .getByRole("button", { name: /Poursuivre le voyage|Découvrir mon escale/ })
      .click();
    if (etape < 4) {
      await expect
        .poll(() => page.getByRole("heading", { level: 1 }).textContent())
        .not.toBe(titrePrecedent);
    }
  }
}

test.describe("Quiz olfactif — /shea/quiz", () => {
  test("affiche la première question du diagnostic", async ({ page }) => {
    await page.goto("/shea/quiz");
    await expect(page.locator("span").filter({ hasText: "Maison SHÉA" })).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Quel paysage vous appelle en premier ?", level: 1 }),
    ).toBeVisible();
    await expect(page.getByRole("radiogroup")).toBeVisible();
    await expect(page.getByRole("radiogroup").getByRole("radio")).toHaveCount(4);
  });

  test("ne présente aucune violation d'accessibilité bloquante (axe-core) — question I", async ({ page }) => {
    await page.goto("/shea/quiz");
    const resultats = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa"])
      .analyze();

    const bloquantes = resultats.violations.filter(
      (v) => v.impact === "critical" || v.impact === "serious",
    );
    expect(bloquantes, JSON.stringify(bloquantes, null, 2)).toEqual([]);
  });

  test("chemin critique : répondre aux 5 questions révèle une escale", async ({ page }) => {
    await repondreATouteLesQuestions(page);

    await expect(page.getByRole("heading", { name: /Votre escale est/, level: 1 })).toBeVisible();
    await expect(page.getByRole("button", { name: /Commander l'échantillon/ })).toBeVisible();
    await expect(page.getByRole("link", { name: "Voir le parfum" })).toBeVisible();
  });

  test("ne présente aucune violation d'accessibilité bloquante (axe-core) — écran de révélation", async ({
    page,
  }) => {
    await repondreATouteLesQuestions(page);
    await expect(page.getByRole("heading", { name: /Votre escale est/, level: 1 })).toBeVisible();
    const resultats = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa"])
      .analyze();

    const bloquantes = resultats.violations.filter(
      (v) => v.impact === "critical" || v.impact === "serious",
    );
    expect(bloquantes, JSON.stringify(bloquantes, null, 2)).toEqual([]);
  });

  test("navigation clavier : pas de piège tabindex, focus visible", async ({ page }) => {
    await page.goto("/shea/quiz");

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
    await page.goto("/shea/quiz");
    const largeurDocument = await page.evaluate(() => document.documentElement.scrollWidth);
    const largeurFenetre = page.viewportSize()?.width ?? 390;
    expect(largeurDocument).toBeLessThanOrEqual(largeurFenetre + 4);
  });

  test("prefers-reduced-motion : parcours complet sans transition résiduelle", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await repondreATouteLesQuestions(page);
    await expect(page.getByRole("heading", { name: /Votre escale est/, level: 1 })).toBeVisible();

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
