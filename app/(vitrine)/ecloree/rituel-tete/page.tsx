import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { Badge } from "@/components/ui";
import { createStaticClient } from "@/lib/supabase/static";

import { BoutonAjouterPanier } from "../../bouton-ajouter-panier";
import { contenuSoin, estRituelTete } from "../produits/contenu-editorial";

/**
 * Écran 9 — Catégorie ÉCLORÉE "Rituel Tête" (/ecloree/rituel-tete). Adaptée
 * de /stitch_la_paradoxa/clor_e_rituel_t_te_soins_capillaires/code.html.
 *
 * ── Écart documenté : pas de colonne "rituel"/catégorie en base ──────────
 * `produits` n'a aucune notion de rituel ou de catégorie. On approxime le
 * "Rituel Tête" par une heuristique sur le nom/la description (voir
 * `estRituelTete` dans ../produits/contenu-editorial.ts, testée sur
 * "cheveux" / "capillaire" / "cuir chevelu" / "fibre"). Sur les 4 soins
 * ÉCLORÉE actuellement en base, un seul correspond réellement : "Masque
 * Réparateur Intense Cheveux". C'est un compromis assumé faute de taxonomie
 * en base — la maquette d'origine montre une grille de 6 produits filtrable
 * par sidebar à facettes ; avec un seul vrai produit capillaire, une sidebar
 * de filtres qui ne filtrerait jamais rien serait trompeuse. On garde donc
 * la mise en page éditoriale (hero, mise en avant du produit) et on
 * remplace la grille+sidebar par une mise en avant du produit trouvé, suivie
 * d'un bloc "Compléter le rituel" qui propose ouvertement les 3 autres soins
 * ÉCLORÉE en cross-sell (sans prétendre qu'ils sont eux aussi capillaires).
 */
export const metadata: Metadata = {
  title: "Rituel Tête — Soins capillaires botaniques | Maison ÉCLORÉE",
  description:
    "Karité sauvage et moringa pour restructurer la fibre et apaiser le cuir chevelu — le Rituel Tête de la Maison ÉCLORÉE.",
};

function formatPrix(prix: number, devise: string): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: devise || "EUR",
    minimumFractionDigits: prix % 1 === 0 ? 0 : 2,
  }).format(prix);
}

export default async function RituelTetePage() {
  const supabase = createStaticClient();
  const { data } = await supabase
    .from("produits")
    .select("*")
    .eq("maison", "ecloree")
    .eq("statut", "actif");

  const tousProduits = data ?? [];
  const produitsRituelTete = tousProduits.filter(estRituelTete);
  const autresProduits = tousProduits.filter((produit) => !estRituelTete(produit));

  return (
    <div data-maison="ecloree" className="flex flex-col">
      {/* Fil d'Ariane */}
      <div className="w-full border-b border-sable/60 bg-surface-container-low/70">
        <nav
          aria-label="Fil d'Ariane"
          className="mx-auto flex max-w-desktop-max flex-wrap items-center gap-space-xs px-space-lg py-space-sm font-interface text-caption-meta uppercase tracking-wider text-on-surface-variant lg:px-space-2xl"
        >
          <Link href="/ecloree" className="transition-colors duration-300 ease-out hover:text-encre-baobab">
            Maison ÉCLORÉE
          </Link>
          <span className="text-maison-primary/60" aria-hidden="true">/</span>
          <span className="font-medium text-encre-baobab">Rituel Tête</span>
        </nav>
      </div>

      {/* Hero de catégorie */}
      <section className="w-full bg-surface-container-low py-space-xl lg:py-space-2xl">
        <div className="mx-auto grid max-w-desktop-max grid-cols-1 items-center gap-space-xl px-space-lg lg:grid-cols-12 lg:px-space-2xl">
          <div className="space-y-space-md lg:col-span-7">
            <div className="inline-flex items-center gap-space-xs rounded-full bg-surface-container px-space-sm py-space-xxs font-interface text-caption-meta uppercase tracking-widest text-maison-primary">
              Maison ÉCLORÉE · Soins végétaux purs
            </div>
            <h1 className="font-display text-headline-lg font-light tracking-tight text-encre-baobab">
              Rituel Tête — la force de l&apos;arbre au sommet
            </h1>
            <p className="reading-max font-interface text-body-reading text-on-surface-variant">
              Des formules botaniques nées de la rencontre entre le beurre de karité sauvage et le
              moringa pressé à froid, pour restructurer la fibre et apaiser le cuir chevelu.
            </p>
            <div className="flex flex-wrap items-center gap-space-xs pt-space-xs font-interface text-caption-meta text-encre-baobab">
              <span className="flex items-center gap-space-xxs rounded-lg bg-surface-container-high px-space-sm py-space-xs">
                {produitsRituelTete.length} soin{produitsRituelTete.length > 1 ? "s" : ""} dédié
                {produitsRituelTete.length > 1 ? "s" : ""}
              </span>
              <span className="flex items-center gap-space-xxs rounded-lg bg-surface-container-high px-space-sm py-space-xs">
                98–100 % d&apos;origine naturelle
              </span>
              <span className="flex items-center gap-space-xxs rounded-lg bg-surface-container-high px-space-sm py-space-xs">
                0 % silicone ou sulfate
              </span>
            </div>
          </div>
          <div className="relative lg:col-span-5">
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl shadow-ambient">
              <Image
                src="/images/banniere-rituel-capillaire.png"
                alt="Flacon de soin capillaire botanique posé sur une dalle de calcaire brut, entourée de feuilles de moringa fraîches."
                fill
                priority
                sizes="(min-width: 1024px) 40vw, 100vw"
                className="object-cover object-center"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Produits du rituel */}
      <section className="w-full py-space-2xl">
        <div className="mx-auto max-w-desktop-max space-y-space-xl px-space-lg lg:px-space-2xl">
          <div className="flex items-center justify-between gap-space-md">
            <h2 className="font-display text-headline-md text-encre-baobab">
              Les soins du Rituel Tête
            </h2>
            <span className="font-label-tabular text-label-tabular text-on-surface-variant">
              {produitsRituelTete.length} référence{produitsRituelTete.length > 1 ? "s" : ""}
            </span>
          </div>

          {produitsRituelTete.length > 0 ? (
            <div className="grid grid-cols-1 gap-space-lg sm:grid-cols-2 lg:grid-cols-3">
              {produitsRituelTete.map((produit) => {
                const contenu = contenuSoin(produit.slug);
                const contenanceLabel =
                  produit.contenance_valeur != null && produit.contenance_unite
                    ? `${Number(produit.contenance_valeur)} ${produit.contenance_unite}`
                    : null;
                return (
                  <CarteProduit
                    key={produit.id}
                    id={produit.id}
                    slug={produit.slug}
                    nom={produit.nom}
                    description={produit.description}
                    prix={Number(produit.prix)}
                    devise={produit.devise}
                    prixLabel={formatPrix(Number(produit.prix), produit.devise)}
                    contenanceLabel={contenanceLabel}
                    image={contenu.image}
                    imageAlt={contenu.imageAlt}
                    accent
                  />
                );
              })}
            </div>
          ) : (
            <p className="font-interface text-body-reading text-on-surface-variant">
              Aucun soin capillaire dédié n&apos;est disponible pour le moment.
            </p>
          )}

          {produitsRituelTete.length < 3 ? (
            <p className="max-w-reading-max font-interface text-caption-meta text-on-surface-variant">
              Le Rituel Tête s&apos;enrichira à mesure que le catalogue ÉCLORÉE s&apos;étoffe.
              En attendant, découvrez le reste de la collection ci-dessous.
            </p>
          ) : null}
        </div>
      </section>

      {/* Compléter le rituel — cross-sell des autres soins ÉCLORÉE */}
      {autresProduits.length > 0 ? (
        <section className="w-full border-t border-sable bg-surface-container-low py-space-2xl">
          <div className="mx-auto max-w-desktop-max space-y-space-xl px-space-lg lg:px-space-2xl">
            <div className="flex flex-col gap-space-sm md:flex-row md:items-end md:justify-between">
              <div className="max-w-reading-max space-y-space-xxs">
                <span className="block font-interface text-caption-meta uppercase tracking-widest text-maison-primary">
                  Compléter le rituel
                </span>
                <h2 className="font-display text-headline-md text-encre-baobab">
                  Le reste de la collection ÉCLORÉE
                </h2>
                <p className="font-interface text-body-ui text-on-surface-variant">
                  Ces soins ne sont pas spécifiquement capillaires, mais s&apos;associent
                  naturellement à une routine complète.
                </p>
              </div>
              <Link
                href="/ecloree"
                className="flex w-fit shrink-0 items-center gap-space-xxs font-interface text-caption-meta uppercase tracking-widest text-maison-primary-strong transition-colors duration-300 ease-out hover:text-encre-baobab"
              >
                Voir toute la Maison ÉCLORÉE <span aria-hidden="true">→</span>
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-space-lg sm:grid-cols-2 lg:grid-cols-3">
              {autresProduits.map((produit) => {
                const contenu = contenuSoin(produit.slug);
                const contenanceLabel =
                  produit.contenance_valeur != null && produit.contenance_unite
                    ? `${Number(produit.contenance_valeur)} ${produit.contenance_unite}`
                    : null;
                return (
                  <CarteProduit
                    key={produit.id}
                    id={produit.id}
                    slug={produit.slug}
                    nom={produit.nom}
                    description={produit.description}
                    prix={Number(produit.prix)}
                    devise={produit.devise}
                    prixLabel={formatPrix(Number(produit.prix), produit.devise)}
                    contenanceLabel={contenanceLabel}
                    image={contenu.image}
                    imageAlt={contenu.imageAlt}
                    accent={false}
                  />
                );
              })}
            </div>
          </div>
        </section>
      ) : null}
    </div>
  );
}

function CarteProduit({
  id,
  slug,
  nom,
  description,
  prix,
  devise,
  prixLabel,
  contenanceLabel,
  image,
  imageAlt,
  accent,
}: {
  id: string;
  slug: string;
  nom: string;
  description: string | null;
  prix: number;
  devise: string;
  prixLabel: string;
  contenanceLabel: string | null;
  image: string;
  imageAlt: string;
  accent: boolean;
}) {
  return (
    <article
      className={`group flex flex-col justify-between overflow-hidden rounded-xl shadow-ambient transition-shadow duration-300 ease-out hover:shadow-md ${
        accent ? "bg-surface-container-high" : "bg-ivoire-bouye"
      }`}
    >
      <div className="space-y-space-sm">
        <div className="relative h-64 w-full overflow-hidden bg-surface-container">
          <Image
            src={image}
            alt={imageAlt}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          />
          {accent ? (
            <span className="absolute left-space-sm top-space-sm">
              <Badge variant="success">Rituel Tête</Badge>
            </span>
          ) : null}
        </div>
        <div className="space-y-space-xxs px-space-md">
          <h3 className="font-display text-title-editorial text-encre-baobab">{nom}</h3>
          {description ? (
            <p className="line-clamp-2 font-interface text-body-ui text-on-surface-variant">
              {description}
            </p>
          ) : null}
        </div>
      </div>
      <div className="space-y-space-sm p-space-md pt-space-lg">
        <div className="flex items-center justify-between">
          <span className="font-label-tabular text-label-tabular font-medium text-encre-baobab">
            {prixLabel}
          </span>
          {contenanceLabel ? (
            <span className="font-interface text-caption-meta text-on-surface-variant">
              {contenanceLabel}
            </span>
          ) : null}
        </div>
        <div className="flex items-center gap-space-sm">
          <Link
            href={`/ecloree/produits/${slug}`}
            className="flex-1 text-center font-interface text-caption-meta uppercase tracking-wider text-maison-primary-strong transition-colors duration-300 ease-out hover:text-encre-baobab"
          >
            Découvrir
          </Link>
          <BoutonAjouterPanier
            article={{
              produitId: id,
              slug,
              nom,
              prixUnitaire: prix,
              devise,
              image,
              maison: "ecloree",
            }}
            variant="primary"
            size="sm"
            className="flex-1"
          >
            Ajouter
          </BoutonAjouterPanier>
        </div>
      </div>
    </article>
  );
}
