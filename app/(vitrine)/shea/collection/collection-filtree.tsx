"use client";

import Image from "next/image";
import Link from "next/link";
import * as React from "react";

import { BoutonAjouterPanier } from "../../bouton-ajouter-panier";

export interface ProduitCollection {
  id: string;
  slug: string;
  nom: string;
  prix: number;
  devise: string;
  prixLabel: string;
  contenanceLabel: string | null;
  escale: string | null;
  description: string | null;
  forme: "flacon" | "coffret";
  familles: string[];
  imageEscale: string;
  imageEscaleAlt: string;
}

type FiltreForme = "toutes" | ProduitCollection["forme"];

const FILTRES: { valeur: FiltreForme; libelle: string }[] = [
  { valeur: "toutes", libelle: "Toutes les créations" },
  { valeur: "flacon", libelle: "Flacons 100 ml" },
  { valeur: "coffret", libelle: "Coffret découverte" },
];

/**
 * Liste filtrable de la collection SHÉA. Client Component pour le seul
 * filtre par forme (state local) — la donnée elle-même a été récupérée côté
 * serveur dans page.tsx et arrive déjà prête.
 *
 * ── Choix documenté : filtre par "forme", pas par genre ─────────────────
 * Le brief demandait des filtres femme/homme/mixte/famille façon parfumerie
 * classique. `produits` n'a aucune colonne de genre (et une collection de
 * parfums de niche n'en a pas non plus dans son positionnement éditorial —
 * voir /shea/page.tsx, "Le voyage commence à l'arbre", jamais genré). On
 * propose donc un filtre honnête sur ce qui existe réellement en base : la
 * forme du produit (flacon 100 ml vs coffret de découverte). Avec 7 produits
 * seulement, son utilité pratique est limitée — c'est assumé, comme
 * l'autorise le brief ("un filtre pour la forme est acceptable même s'il ne
 * filtre pas grand-chose").
 */
export function CollectionFiltree({ produits }: { produits: ProduitCollection[] }) {
  const [filtre, setFiltre] = React.useState<FiltreForme>("toutes");

  const produitsFiltres =
    filtre === "toutes" ? produits : produits.filter((produit) => produit.forme === filtre);

  return (
    <>
      <div className="sticky top-20 z-40 w-full bg-ivoire-bouye/95 px-space-md py-space-sm shadow-[0_4px_20px_rgba(27,42,35,0.06)] backdrop-blur-md sm:px-space-lg lg:px-space-2xl">
        <div className="mx-auto flex max-w-desktop-max flex-wrap items-center justify-between gap-space-md">
          <div
            className="flex flex-wrap items-center gap-space-xs"
            role="group"
            aria-label="Filtrer la collection par forme"
          >
            {FILTRES.map((option) => (
              <button
                key={option.valeur}
                type="button"
                aria-pressed={filtre === option.valeur}
                onClick={() => setFiltre(option.valeur)}
                className={
                  filtre === option.valeur
                    ? "bg-encre-baobab px-space-md py-space-xxs font-interface text-body-ui text-ivoire-bouye transition-colors duration-300 ease-out"
                    : "bg-surface-container px-space-md py-space-xxs font-interface text-body-ui text-encre-baobab transition-colors duration-300 ease-out hover:bg-surface-container-high"
                }
              >
                {option.libelle}
              </button>
            ))}
          </div>
          <span className="hidden font-interface text-caption-meta text-on-surface-variant xl:inline">
            {produitsFiltres.length} création{produitsFiltres.length > 1 ? "s" : ""} affichée
            {produitsFiltres.length > 1 ? "s" : ""}
          </span>
        </div>
      </div>

      <div className="mx-auto flex w-full max-w-desktop-max flex-col gap-space-3xl px-space-md py-space-3xl sm:px-space-lg lg:px-space-2xl">
        {produitsFiltres.map((produit, index) => {
          const inverse = index % 2 === 1;
          const estCoffret = produit.forme === "coffret";

          return (
            <article
              key={produit.slug}
              id={`escale-${produit.slug}`}
              // scroll-mt-36 (144px) plutôt que le 28 (112px) d'origine : le
              // header sticky (h-20 = 80px) plus la barre de filtre sticky
              // juste en dessous (top-20, ~54px de haut) occupent ~134px en
              // haut de viewport une fois défilé — 112px laissait le titre
              // de l'escale partiellement caché derrière la barre de filtre
              // au clic d'une puce (#escale-<slug>). 144px dégage une marge
              // confortable sans être exagéré (Vague 4, vérifié par calcul
              // des hauteurs sticky réelles ci-dessus, pas au hasard).
              className="grid w-full scroll-mt-36 grid-cols-1 items-center gap-space-xl lg:grid-cols-12 lg:gap-space-2xl"
            >
              <div className={`relative lg:col-span-7 ${inverse ? "lg:order-2" : "lg:order-1"}`}>
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-surface-container-high shadow-ambient sm:aspect-[16/10]">
                  <Image
                    src={produit.imageEscale}
                    alt={produit.imageEscaleAlt}
                    fill
                    sizes="(min-width: 1024px) 58vw, 100vw"
                    className="object-cover object-center"
                  />
                  {produit.escale ? (
                    <div className="absolute left-space-md top-space-md flex items-center gap-space-xs bg-encre-baobab/90 px-space-sm py-space-xxs text-or-karite backdrop-blur-sm">
                      <span className="font-label-tabular text-[12px]">{produit.escale}</span>
                    </div>
                  ) : null}
                </div>
              </div>

              <div
                className={`flex flex-col justify-between gap-space-lg bg-surface-container-low p-space-xl shadow-ambient lg:col-span-5 ${
                  inverse ? "lg:order-1" : "lg:order-2"
                } ${estCoffret ? "bg-surface-container-high" : ""}`}
              >
                <div className="flex flex-col gap-space-sm">
                  <div className="flex flex-wrap items-center gap-space-xs">
                    {produit.familles.map((famille) => (
                      <span
                        key={famille}
                        className="bg-surface-container px-space-xs py-0.5 font-interface text-caption-meta text-encre-baobab"
                      >
                        {famille}
                      </span>
                    ))}
                  </div>
                  <h2 className="font-display text-headline-md font-light text-encre-baobab">
                    {produit.nom}
                  </h2>
                  {produit.description ? (
                    <p className="font-interface text-body-reading text-on-surface-variant">
                      {produit.description}
                    </p>
                  ) : null}
                </div>

                <div className="flex items-center justify-between gap-space-md border-t border-sable pt-space-sm">
                  <div>
                    <span className="font-label-tabular text-label-tabular font-medium text-encre-baobab">
                      {produit.prixLabel}
                    </span>
                    {produit.contenanceLabel ? (
                      <span className="block font-interface text-caption-meta text-on-surface-variant">
                        {produit.contenanceLabel}
                      </span>
                    ) : null}
                  </div>
                  <div className="flex items-center gap-space-sm">
                    <Link
                      href={`/shea/parfums/${produit.slug}`}
                      className="font-interface text-caption-meta uppercase tracking-wider text-terre-de-dakar transition-colors duration-300 ease-out hover:text-encre-baobab"
                    >
                      {estCoffret ? "Découvrir le coffret" : "Découvrir l'escale"}
                    </Link>
                    <BoutonAjouterPanier
                      article={{
                        produitId: produit.id,
                        slug: produit.slug,
                        nom: produit.nom,
                        prixUnitaire: produit.prix,
                        devise: produit.devise,
                        image: produit.imageEscale,
                        maison: "shea",
                      }}
                      variant="primary"
                      size="sm"
                      className="bg-terre-de-dakar"
                    >
                      Ajouter
                    </BoutonAjouterPanier>
                  </div>
                </div>
              </div>
            </article>
          );
        })}

        {produitsFiltres.length === 0 ? (
          <p className="py-space-2xl text-center font-interface text-body-reading text-on-surface-variant">
            Aucune création ne correspond à ce filtre pour le moment.
          </p>
        ) : null}
      </div>
    </>
  );
}
