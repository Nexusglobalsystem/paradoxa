import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

/**
 * Écran 25 — Connexion admin (/connexion). Gabarit repris de
 * e2e/portail.spec.ts (voir son commentaire d'en-tête), complété par les
 * points navigation clavier / mobile / prefers-reduced-motion déjà établis
 * sur les autres écrans de la Vague 5 (voir e2e/manifeste.spec.ts,
 * e2e/shea.spec.ts, e2e/ecloree.spec.ts).
 *
 * Seule page du périmètre admin (app/(admin)) testable en conditions
 * normales : aucun garde-fou dessus (contrairement à /laboratoire/**,
 * couvert séparément par e2e/garde-fous-laboratoire.spec.ts), donc pas
 * besoin d'une session admin bootstrapée pour l'auditer de bout en bout.
 */
test.describe("Connexion administrateur — /connexion", () => {
  test("affiche le formulaire de connexion administrateur", async ({ page }) => {
    await page.goto("/connexion");
    await expect(
      page.getByRole("heading", { name: "Laboratoire & administration" }),
    ).toBeVisible();
    await expect(page.getByLabel("Adresse email")).toBeVisible();
    await expect(page.getByLabel("Mot de passe")).toBeVisible();
    await expect(page.getByRole("button", { name: "Se connecter" })).toBeVisible();
  });

  test("ne présente aucune violation d'accessibilité bloquante (axe-core)", async ({ page }) => {
    await page.goto("/connexion");
    const resultats = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa"])
      .analyze();

    const bloquantes = resultats.violations.filter(
      (v) => v.impact === "critical" || v.impact === "serious",
    );
    expect(bloquantes, JSON.stringify(bloquantes, null, 2)).toEqual([]);
  });

  /**
   * Échoue intentionnellement, et c'est le résultat attendu de l'audit, pas
   * un test mal calibré : le premier arrêt de tabulation est le champ email
   * (components/ui/input.tsx), dont le style focus est `focus:outline-none
   * focus:border-maison-accent` — aucun outline, aucun box-shadow, seul un
   * filet inférieur qui change de couleur vers l'accent de maison (Or Karité
   * pour "groupe"). Deux problèmes cumulés : `outline-none` (plutôt que
   * `outline-hidden`) supprime l'indicateur nativement visible, et la
   * couleur de repli est Or Karité brut sur une carte claire — la même
   * famille de problème de contraste que app/design-tokens.css documente
   * pour le texte, ici appliquée à un indicateur non textuel (WCAG 1.4.11).
   * `components/ui/input.tsx` est une primitive partagée hors du périmètre
   * de cet agent (ni app/(admin), ni une occurrence `text-or-karite`) : voir
   * le rapport final de la Vague 5 plutôt qu'une correction ici. Ce test
   * reste tel quel pour servir de non-régression une fois corrigé ailleurs.
   */
  test("navigation clavier : pas de piège tabindex, focus visible", async ({ page }) => {
    await page.goto("/connexion");

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

  test("ordre de tabulation logique jusqu'au bouton de connexion", async ({ page }) => {
    await page.goto("/connexion");
    const email = page.getByLabel("Adresse email");
    const motDePasse = page.getByLabel("Mot de passe");
    const bouton = page.getByRole("button", { name: "Se connecter" });

    await email.focus();
    await expect(email).toBeFocused();
    await page.keyboard.press("Tab");
    await expect(motDePasse).toBeFocused();
    await page.keyboard.press("Tab");
    await expect(bouton).toBeFocused();
  });

  test("rendu mobile 390px : aucun débordement horizontal", async ({ page }) => {
    await page.goto("/connexion");
    const largeurDocument = await page.evaluate(() => document.documentElement.scrollWidth);
    const largeurFenetre = page.viewportSize()?.width ?? 390;
    expect(largeurDocument).toBeLessThanOrEqual(largeurFenetre + 4);
  });

  test("prefers-reduced-motion : les transitions sont neutralisées", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/connexion");
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
