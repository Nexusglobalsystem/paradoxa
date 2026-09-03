import type { Metadata } from "next";
import Link from "next/link";

import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui";

export const metadata: Metadata = {
  title: "Laboratoire — LA PARADOXA",
};

const ATELIERS = [
  {
    href: "/laboratoire/matieres",
    titre: "Bibliothèque de matières premières",
    description:
      "Inventaire organoleptique, profilage IFRA 51e amendement, traçabilité et coûts de formulation.",
    icone: "🌿",
  },
  {
    href: "/laboratoire/parfum",
    titre: "Composeur de parfum",
    description:
      "Structure harmonique φ (fond/cœur/tête), équilibrage, conformité IFRA, allergènes, coût.",
    icone: "🧪",
  },
  {
    href: "/laboratoire/cosmetique",
    titre: "Composeur cosmétique",
    description: "5 phases de formulation ÉCLORÉE, INCI généré automatiquement, calculateur de lot.",
    icone: "🌾",
  },
];

/** Destination d'atterrissage après connexion (voir connexion/actions.ts). */
export default function LaboratoirePage() {
  return (
    <div className="mx-auto max-w-[1440px] space-y-space-lg px-space-lg py-space-xl lg:px-space-2xl">
      <div className="space-y-space-xxs">
        <h1 className="font-display text-headline-lg text-encre-baobab">Laboratoire</h1>
        <p className="font-interface text-body-reading text-on-surface-variant">
          Formulation, matières premières et conformité réglementaire des deux maisons.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-space-md md:grid-cols-3">
        {ATELIERS.map((atelier) => (
          <Link key={atelier.href} href={atelier.href} className="group block">
            <Card className="h-full transition-colors duration-300 ease-out group-hover:border-or-karite/60">
              <CardContent className="space-y-space-sm">
                <span aria-hidden="true" className="text-[28px]">
                  {atelier.icone}
                </span>
                <CardTitle>{atelier.titre}</CardTitle>
                <CardDescription>{atelier.description}</CardDescription>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
