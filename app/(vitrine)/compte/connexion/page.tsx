import type { Metadata } from "next";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui";

import { FormulaireConnexion } from "./formulaire-connexion";

export const metadata: Metadata = {
  title: "Connexion — Mon compte | LA PARADOXA",
  robots: { index: false },
};

/**
 * Connexion client par lien magique — distincte de app/(admin)/connexion
 * (mot de passe + rôle admin). Volontairement hors de
 * app/(vitrine)/compte/(protected)/ pour ne jamais être elle-même derrière
 * le garde-fou qu'elle sert à contourner (même raison que
 * app/(admin)/connexion vis-à-vis de app/(admin)/(protected)).
 */
export default function ConnexionComptePage() {
  return (
    <div
      data-maison="groupe"
      className="flex min-h-[70vh] items-center justify-center px-space-lg py-space-3xl"
    >
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Mon compte</CardTitle>
          <CardDescription>
            Suivez vos commandes et retrouvez votre profil olfactif.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FormulaireConnexion />
        </CardContent>
      </Card>
    </div>
  );
}
