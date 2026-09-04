import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { createStaticClient } from "@/lib/supabase/static";

import { contenuParfum } from "../parfums/contenu-editorial";
import { CollectionFiltree, type ProduitCollection } from "./collection-filtree";

/**
 * Écran 4 — Collection SHÉA (/shea/collection). Adaptée de
 * /stitch_la_paradoxa/sh_a_la_collection_africaine_la_carte_du_voyage/code.html.
 *
 * Deux écarts volontaires par rapport à la maquette :
 * 1. La maquette place des repères cliquables sur une carte SVG avec des
 *    coordonnées en pourcentage calées à l'œil sur son illustration precise.
 *    On n'a pas cette illustration vectorielle (seulement le PNG stylisé
 *    `carte-afrique-stylisee.png`, sans les repères) : plutôt que de deviner
 *    des positions de pins qui tomberaient à côté sur cette image-ci, la
 *    carte reste un visuel statique et la navigation par escale devient une
 *    rangée de chips ancrées (#escale-<slug>) sous l'image — même fonction
 *    (sauter à une escale), rendu honnête vis-à-vis de l'asset réel.
 * 2. La maquette liste des "accords majeurs" avec des noms de matière
 *    précis (ex. "Cristaux de sel marin, résine d'élémi..."). Cette page ne
 *    lit jamais `formules`/`formule_lignes` (RLS admin, CLAUDE.md règle 2) et
 *    n'imite pas non plus ce niveau de détail : seules des familles
 *    olfactives génériques inventées éditorialement apparaissent (badges),
 *    voir /shea/parfums/contenu-editorial.ts.
 */
export const metadata: Metadata = {
  title: "La Collection Africaine — Maison SHÉA | LA PARADOXA",
  description:
    "Une géographie sensible en sept créations olfactives, de Dakar au Ferlo. Découvrez chaque escale de la Maison SHÉA et son coffret de découverte.",
};

/** Formate un prix EUR à chiffres tabulaires. */
function formatPrix(prix: number, devise: string): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: devise || "EUR",
    minimumFractionDigits: prix % 1 === 0 ? 0 : 2,
  }).format(prix);
}

/**
 * Ordre éditorial de présentation — un fil de voyage plutôt que l'ordre
 * alphabétique de la base, avec le coffret de découverte en clôture (comme
 * dans la maquette Stitch, qui le traite en section de conversion séparée
 * après les six escales).
 */
const ORDRE_COLLECTION = [
  "bois-de-shea",
  "poussiere-docre",
  "ombre-de-baobab",
  "fleur-de-karite",
  "brume-de-goree",
  "or-du-ferlo",
  "coffret-cinq-escales",
];

export default async function CollectionSheaPage() {
  const supabase = createStaticClient();
  const { data } = await supabase
    .from("produits")
    .select("*")
    .eq("maison", "shea")
    .eq("statut", "actif");

  const produitsBruts = data ?? [];
  produitsBruts.sort((a, b) => ORDRE_COLLECTION.indexOf(a.slug) - ORDRE_COLLECTION.indexOf(b.slug));

  const produits: ProduitCollection[] = produitsBruts.map((produit) => {
    const contenu = contenuParfum(produit.slug);
    return {
      slug: produit.slug,
      nom: produit.nom,
      prixLabel: formatPrix(Number(produit.prix), produit.devise),
      contenanceLabel:
        produit.contenance_valeur != null && produit.contenance_unite
          ? `${Number(produit.contenance_valeur)} ${produit.contenance_unite}`
          : null,
      escale: produit.escale_geographique,
      description: produit.description,
      // Heuristique de "forme" : la table `produits` n'a pas de colonne
      // dédiée à la catégorie/le genre — voir le filtre plus bas, qui
      // documente ce même compromis pour l'ensemble de la page.
      forme: produit.slug === "coffret-cinq-escales" ? "coffret" : "flacon",
      familles: contenu.familles,
      imageEscale: contenu.imageEscale,
      imageEscaleAlt: contenu.imageEscaleAlt,
    };
  });

  return (
    <div data-maison="shea" className="flex flex-col">
      {/* Hero — carte stylisée des escales */}
      <section className="relative w-full overflow-hidden bg-encre-baobab px-space-md py-space-xl text-ivoire-bouye sm:px-space-lg lg:px-space-2xl lg:py-space-2xl">
        <div className="relative mx-auto flex max-w-desktop-max flex-col gap-space-xl">
          <div className="flex flex-col gap-space-md pb-space-lg md:flex-row md:items-end md:justify-between">
            <div className="max-w-reading-max space-y-space-xs">
              <div className="flex items-center gap-space-xs text-or-karite">
                <span className="h-1.5 w-1.5 rounded-full bg-or-karite" aria-hidden="true" />
                <span className="font-interface text-caption-meta">
                  Maison SHÉA — Parfumerie d&apos;origine
                </span>
              </div>
              <h1 className="font-display text-headline-lg font-light tracking-tight text-ivoire-bouye">
                La collection africaine
              </h1>
              <p className="font-interface text-body-reading font-light text-sable/90">
                Une géographie sensible en sept créations olfactives. Matières travaillées entre
                falaises océaniques, brousse sahélienne et arbres sanctuaires.
              </p>
            </div>
            <div className="flex flex-col items-start gap-space-xxs md:items-end">
              <span className="font-interface text-caption-meta text-or-karite">
                Formulations vivantes
              </span>
              <span className="font-label-tabular text-label-tabular text-sable">
                {produits.length} créations · Méthode du nombre d&apos;or
              </span>
            </div>
          </div>

          <div className="relative aspect-[16/9] w-full overflow-hidden shadow-ambient sm:aspect-[21/9] lg:aspect-[2.3/1]">
            <Image
              src="/images/carte-afrique-stylisee.png"
              alt="Carte stylisée de l'Afrique de l'Ouest indiquant les escales de la collection SHÉA."
              fill
              priority
              sizes="100vw"
              className="object-cover object-center"
            />
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-t from-encre-baobab/90 via-transparent to-encre-baobab/30"
            />
            <span className="absolute bottom-space-sm left-space-md font-interface text-caption-meta text-sable/80">
              Tracé géopoétique · De l&apos;Atlantique au Ferlo
            </span>
          </div>

          {/* Navigation d'escale — ancres, pas de pins positionnés sur l'image */}
          <nav aria-label="Aller à une escale" className="flex flex-wrap gap-space-xs">
            {produits.map((produit) => (
              <a
                key={produit.slug}
                href={`#escale-${produit.slug}`}
                className="bg-ivoire-bouye/10 px-space-sm py-space-xxs font-interface text-caption-meta text-sable transition-colors duration-300 ease-out hover:bg-or-karite hover:text-encre-baobab"
              >
                {produit.escale ?? produit.nom}
              </a>
            ))}
          </nav>
        </div>
      </section>

      <CollectionFiltree produits={produits} />

      {/* Rappel coffret découverte */}
      <section className="w-full border-t border-sable bg-surface-container-low px-space-md py-space-2xl sm:px-space-lg lg:px-space-2xl">
        <div className="mx-auto flex max-w-desktop-max flex-col items-center justify-between gap-space-md text-center md:flex-row md:text-left">
          <p className="font-interface text-body-reading text-on-surface-variant">
            Pas encore certain·e de votre escale ? Le Coffret Cinq Escales permet d&apos;essayer
            avant de choisir votre flacon 100 ml.
          </p>
          <Link
            href="#escale-coffret-cinq-escales"
            className="inline-flex shrink-0 items-center gap-space-xs bg-terre-de-dakar px-space-lg py-space-md font-interface text-body-ui text-ivoire-bouye transition-colors duration-300 ease-out hover:bg-terre-de-dakar/90"
          >
            Découvrir le coffret
          </Link>
        </div>
      </section>
    </div>
  );
}
