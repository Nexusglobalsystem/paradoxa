import { expect, test } from "@playwright/test";

/**
 * Garde-fou de tout /laboratoire : app/(admin)/(protected)/layout.tsx exige
 * une session Supabase valide ET role = 'admin' dans public.profiles, sinon
 * redirige vers /connexion (voir le commentaire de ce layout — un utilisateur
 * authentifié non-admin est traité comme non connecté, jamais de message
 * distinguant les deux cas).
 *
 * Le mécanisme vit dans ce seul layout partagé par toutes les routes
 * /laboratoire/** : vérifier un échantillon de 3 routes représentatives
 * (racine, une liste, un atelier) suffit à couvrir le principe pour
 * l'ensemble du périmètre protégé, sans avoir à énumérer chaque route.
 */
test.describe("Garde-fous /laboratoire — visiteur anonyme", () => {
  const routesProtegees = ["/laboratoire", "/laboratoire/matieres", "/laboratoire/generation"];

  for (const route of routesProtegees) {
    test(`redirige ${route} vers /connexion`, async ({ page }) => {
      await page.goto(route);
      await expect(page).toHaveURL(/\/connexion$/);
    });
  }
});
