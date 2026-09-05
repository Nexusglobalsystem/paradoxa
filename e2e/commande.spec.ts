import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

/**
 * Écran 15 — Tunnel de commande (/commande). Gabarit e2e/portail.spec.ts,
 * étendu comme e2e/manifeste.spec.ts. Le tunnel affiche un bouton "Payer"
 * désactivé tant que le panier est vide (voir tunnel-commande.tsx) : chaque
 * test passe donc d'abord par une fiche produit réelle pour peupler le
 * panier, exactement comme un visiteur le ferait, plutôt que d'injecter un
 * état de panier synthétique.
 *
 * GAP CONNU (voir prompt Vague 5) : STRIPE_SECRET_KEY n'est pas configurée
 * dans cet environnement. Le clic sur "Payer" doit donc échouer proprement
 * avec le message utilisateur de app/api/commande/creer-session/route.ts
 * ("Le règlement en ligne est momentanément indisponible…") — c'est le
 * comportement attendu et le test qui suit vérifie précisément cet
 * affichage, pas un vrai parcours de paiement.
 */
async function remplirPanier(page: Page) {
  await page.goto("/shea/parfums/bois-de-shea");
  await page.getByRole("button", { name: /Ajouter au panier/i }).click();
  await expect(page.getByRole("button", { name: /Ajouté au panier/i })).toBeVisible();
  await page.goto("/commande");
}

test.describe("Tunnel de commande — /commande", () => {
  test("affiche le formulaire de livraison et le récapitulatif du panier", async ({ page }) => {
    await remplirPanier(page);
    await expect(page.getByRole("heading", { name: "Coordonnées de livraison", level: 1 })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Votre commande", level: 2 })).toBeVisible();
    await expect(page.getByRole("button", { name: /Payer/ })).toBeVisible();
  });

  test("ne présente aucune violation d'accessibilité bloquante (axe-core)", async ({ page }) => {
    await remplirPanier(page);
    const resultats = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa"])
      .analyze();

    const bloquantes = resultats.violations.filter(
      (v) => v.impact === "critical" || v.impact === "serious",
    );
    expect(bloquantes, JSON.stringify(bloquantes, null, 2)).toEqual([]);
  });

  test("un règlement échoue proprement en l'absence de STRIPE_SECRET_KEY (comportement attendu)", async ({
    page,
  }) => {
    await remplirPanier(page);

    await page.getByLabel("Nom complet").fill("Aïcha Diallo");
    await page.getByLabel("Adresse email").fill("aicha.diallo@example.com");
    // getByLabel("Adresse", { exact: true }) : le label porte aussi un
    // astérisque aria-hidden (champ requis) qui rend le matching exact
    // fragile selon le moteur d'accessible-name ; on cible directement le
    // champ par son id (voir Field id="adresse-1" dans tunnel-commande.tsx).
    await page.locator("#adresse-1").fill("12 rue des Baobabs");
    await page.getByLabel("Code postal").fill("75012");
    await page.getByLabel("Ville").fill("Paris");

    await page.getByRole("button", { name: /Payer/ }).click();

    // getByRole("alert") seul résout aussi le route-announcer interne de
    // Next.js (role="alert" vide, __next-route-announcer__) : on filtre sur
    // le texte pour ne cibler que le message d'erreur du tunnel.
    const alerte = page.getByRole("alert").filter({ hasText: "momentanément indisponible" });
    await expect(alerte).toBeVisible();
    await expect(alerte).toHaveText(/momentanément indisponible/i);
  });

  test("navigation clavier : pas de piège tabindex, focus visible", async ({ page }) => {
    await remplirPanier(page);

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
    await remplirPanier(page);
    const largeurDocument = await page.evaluate(() => document.documentElement.scrollWidth);
    const largeurFenetre = page.viewportSize()?.width ?? 390;
    expect(largeurDocument).toBeLessThanOrEqual(largeurFenetre + 4);
  });

  test("prefers-reduced-motion : les transitions sont neutralisées", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await remplirPanier(page);
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
