import type { Metadata } from "next";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui";

import { NouvelleMatiereForm } from "./nouvelle-matiere-form";

export const metadata: Metadata = {
  title: "Nouvelle matière — Laboratoire LA PARADOXA",
};

export default function NouvelleMatierePage() {
  return (
    <div className="mx-auto max-w-3xl space-y-space-lg px-space-lg py-space-xl lg:px-space-2xl">
      <div className="space-y-space-xxs">
        <h1 className="font-display text-headline-md text-encre-baobab">Nouvelle matière</h1>
        <p className="font-interface text-body-ui text-on-surface-variant">
          Enregistre une matière première dans la bibliothèque du laboratoire.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Identité &amp; classification</CardTitle>
          <CardDescription>
            Les seuils IFRA par catégorie s&apos;ajoutent ensuite depuis la fiche matière.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <NouvelleMatiereForm />
        </CardContent>
      </Card>
    </div>
  );
}
