import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

/**
 * Écrans 17-18 — Espace client (/compte, /compte/connexion,
 * /compte/commandes/[id]). Gabarit e2e/portail.spec.ts, étendu comme
 * e2e/manifeste.spec.ts.
 *
 * GAP D'AUTHENTIFICATION CONNU (voir prompt Vague 5) : aucun compte client
 * réel n'existe dans cet environnement (pas de SUPABASE_SERVICE_ROLE_KEY
 * pour en fabriquer un). app/(vitrine)/compte/(protected)/layout.tsx
 * redirige donc tout visiteur anonyme vers /compte/connexion pour /compte et
 * /compte/commandes/[id] — c'est le garde-fou attendu, testé ci-dessous.
 * Le contenu authentifié (dashboard, profil olfactif, suivi de commande réel)
 * n'a pas pu être audité en conditions réelles pour cette raison — limite
 * connue documentée dans le rapport, pas un écart à corriger.
 *
 * Le formulaire de lien magique (/compte/connexion) n'est testé ici que sur
 * son chemin de validation cliente/serveur ("Adresse email invalide."), pas
 * sur un envoi réel : "quelqu'un@localhost" passe la validation native du
 * navigateur (type="email") mais échoue la regex serveur de actions.ts
 * (pas de TLD après le "."), ce qui exerce l'état d'erreur affiché sans
 * déclencher de vrai appel Supabase Auth ni envoyer d'email.
 */
test.describe("Connexion client — /compte/connexion", () => {
  test("affiche le formulaire de lien magique", async ({ page }) => {
    await page.goto("/compte/connexion");
    await expect(page.getByRole("heading", { name: "Mon compte" })).toBeVisible();
    await expect(page.getByLabel("Adresse email")).toBeVisible();
    await expect(page.getByRole("button", { name: "Recevoir mon lien de connexion" })).toBeVisible();
  });

  test("ne présente aucune violation d'accessibilité bloquante (axe-core)", async ({ page }) => {
    await page.goto("/compte/connexion");
    const resultats = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa"])
      .analyze();

    const bloquantes = resultats.violations.filter(
      (v) => v.impact === "critical" || v.impact === "serious",
    );
    expect(bloquantes, JSON.stringify(bloquantes, null, 2)).toEqual([]);
  });

  test("affiche une erreur de validation propre pour une adresse invalide", async ({ page }) => {
    await page.goto("/compte/connexion");
    await page.getByLabel("Adresse email").fill("quelquun@localhost");
    await page.getByRole("button", { name: "Recevoir mon lien de connexion" }).click();

    // getByRole("alert") seul résout aussi le route-announcer interne de
    // Next.js (role="alert" vide, __next-route-announcer__) : on filtre sur
    // le texte pour ne cibler que le message d'erreur du formulaire.
    const alerte = page.getByRole("alert").filter({ hasText: "Adresse email invalide." });
    await expect(alerte).toBeVisible();
    await expect(alerte).toHaveText("Adresse email invalide.");
  });

  test("navigation clavier : pas de piège tabindex, focus visible", async ({ page }) => {
    await page.goto("/compte/connexion");

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
    await page.goto("/compte/connexion");
    const largeurDocument = await page.evaluate(() => document.documentElement.scrollWidth);
    const largeurFenetre = page.viewportSize()?.width ?? 390;
    expect(largeurDocument).toBeLessThanOrEqual(largeurFenetre + 4);
  });

  test("prefers-reduced-motion : les transitions sont neutralisées", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/compte/connexion");
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

test.describe("Garde-fou d'authentification", () => {
  test("/compte redirige un visiteur anonyme vers /compte/connexion", async ({ page }) => {
    await page.goto("/compte");
    await expect(page).toHaveURL(/\/compte\/connexion$/);
    await expect(page.getByRole("heading", { name: "Mon compte" })).toBeVisible();
  });

  test("/compte/commandes/[id] redirige un visiteur anonyme vers /compte/connexion", async ({ page }) => {
    await page.goto("/compte/commandes/un-id-quelconque");
    await expect(page).toHaveURL(/\/compte\/connexion$/);
    await expect(page.getByRole("heading", { name: "Mon compte" })).toBeVisible();
  });
});
