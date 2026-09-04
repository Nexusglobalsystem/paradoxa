import type { Metadata } from "next";
import Link from "next/link";

import { createStaticClient } from "@/lib/supabase/static";

import { ORDRE_ESCALES, type EscaleSlug, type ProduitQuizLite } from "./quiz-donnees";
import { QuizClient } from "./quiz-client";

/**
 * Écran 6 — Quiz olfactif (/shea/quiz). Adapté de
 * /stitch_la_paradoxa/sh_a_quiz_olfactif_trouvez_votre_escale/code.html.
 *
 * Server Component volontairement réduit au strict minimum : il ne fait que
 * lire `produits` (client statique public, comme /shea/collection et
 * /shea/parfums/[slug]) et transmettre les 6 créations + le coffret à
 * <QuizClient>, qui porte à lui seul toute l'interaction ("use client" ne
 * descend que sur cette sous-arborescence — voir quiz-client.tsx).
 *
 * La logique de correspondance question → escale est documentée en tête de
 * ./quiz-donnees.ts.
 */
export const metadata: Metadata = {
  title: "Quiz olfactif — Trouvez votre escale | Maison SHÉA | LA PARADOXA",
  description:
    "Cinq questions sensorielles pour révéler l'escale de la collection SHÉA qui vous correspond, et commander le Coffret Cinq Escales pour l'essayer avant de choisir votre flacon.",
};

async function getProduitsQuiz() {
  const supabase = createStaticClient();
  const { data } = await supabase
    .from("produits")
    .select("id, slug, nom, prix, devise, escale_geographique")
    .eq("maison", "shea")
    .eq("statut", "actif");
  return data ?? [];
}

export default async function QuizOlfactifPage() {
  const produitsBruts = await getProduitsQuiz();

  const produitsParEscale: Partial<Record<EscaleSlug, ProduitQuizLite>> = {};
  let coffret: ProduitQuizLite | undefined;

  for (const p of produitsBruts) {
    const produit: ProduitQuizLite = {
      id: p.id,
      slug: p.slug,
      nom: p.nom,
      prix: Number(p.prix),
      devise: p.devise,
      escale_geographique: p.escale_geographique,
    };
    if (p.slug === "coffret-cinq-escales") {
      coffret = produit;
    } else if ((ORDRE_ESCALES as string[]).includes(p.slug)) {
      produitsParEscale[p.slug as EscaleSlug] = produit;
    }
  }

  const escalesManquantes = ORDRE_ESCALES.filter((slug) => !produitsParEscale[slug]);

  // État d'erreur explicite (règle .claude/agents/frontend-commerce.md) :
  // le quiz a besoin des 6 créations + du coffret pour fonctionner, jamais
  // d'un sous-ensemble partiel qui produirait une révélation cassée.
  if (escalesManquantes.length > 0 || !coffret) {
    return (
      <div data-maison="shea" className="flex min-h-[60vh] w-full items-center justify-center bg-encre-baobab px-space-lg py-space-3xl text-center">
        <div className="flex max-w-reading-max flex-col items-center gap-space-md">
          <h1 className="font-display text-headline-md font-light text-ivoire-bouye">
            Le quiz olfactif revient dans un instant
          </h1>
          <p className="font-interface text-body-reading text-sable/80">
            La collection est en cours de mise à jour. En attendant, découvrez déjà chaque escale
            depuis la collection africaine.
          </p>
          <Link
            href="/shea/collection"
            className="inline-flex items-center gap-space-sm rounded-lg border border-or-karite px-space-xl py-space-md font-interface text-body-ui tracking-wide text-or-karite transition-colors duration-300 ease-out hover:bg-or-karite hover:text-encre-baobab"
          >
            Découvrir la collection
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div data-maison="shea">
      <QuizClient produitsParEscale={produitsParEscale as Record<EscaleSlug, ProduitQuizLite>} coffret={coffret} />
    </div>
  );
}
