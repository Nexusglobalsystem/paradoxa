import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Badge,
  Button,
} from "@/components/ui";
import { LIBELLE_ETAGE, ORDRE_ETAGES, PART_ETAGE } from "@/components/laboratoire/constantes-parfum";
import { createStaticClient } from "@/lib/supabase/static";

import { contenuParfum } from "../contenu-editorial";

/**
 * Écran 5 — Fiche parfum publique (/shea/parfums/[slug]).
 * Adaptée de /stitch_la_paradoxa/sh_a_fiche_parfum_bois_de_sh_a/code.html,
 * MAIS avec un écart volontaire et non négociable (CLAUDE.md règle n°2) :
 * la maquette Stitch décrit une "pyramide olfactive animée... chaque strate
 * listant ses matières" avec des noms de matière précis et des pourcentages
 * façon formule réelle ("Mandarine sanguine de Casamance givrée...", INCI
 * complet avec LIMONENE/LINALOOL...). Cette page ne lit JAMAIS `formules` ni
 * `formule_lignes` (réservées au rôle admin par RLS) et n'imite pas non plus
 * ce luxe de détail : la pyramide ci-dessous n'affiche que des FAMILLES
 * olfactives génériques inventées éditorialement (voir ../contenu-editorial),
 * avec les trois proportions fixes 19/31/50 de la méthode SHÉA (mêmes
 * constantes que le composeur labo, components/laboratoire/constantes-parfum)
 * — jamais une donnée issue d'une vraie formule. C'est exactement le
 * traitement déjà appliqué par l'agent de la Vague 2 sur /shea ("La Règle
 * d'Or" dans app/(vitrine)/shea/page.tsx).
 */

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function getProduit(slug: string) {
  const supabase = createStaticClient();
  const { data } = await supabase
    .from("produits")
    .select("*")
    .eq("maison", "shea")
    .eq("slug", slug)
    .eq("statut", "actif")
    .maybeSingle();
  return data;
}

export async function generateStaticParams() {
  const supabase = createStaticClient();
  const { data } = await supabase
    .from("produits")
    .select("slug")
    .eq("maison", "shea")
    .eq("statut", "actif");
  return (data ?? []).map((produit) => ({ slug: produit.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const produit = await getProduit(slug);

  if (!produit) {
    return { title: "Création introuvable — Maison SHÉA | LA PARADOXA" };
  }

  return {
    title: `${produit.nom} — Maison SHÉA | LA PARADOXA`,
    description:
      produit.description ??
      `${produit.nom}, création de haute parfumerie de la Maison SHÉA — LA PARADOXA.`,
  };
}

/** Formate un prix EUR à chiffres tabulaires (règle CLAUDE.md n°4/direction artistique). */
function formatPrix(prix: number, devise: string): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: devise || "EUR",
    minimumFractionDigits: prix % 1 === 0 ? 0 : 2,
  }).format(prix);
}

export default async function FicheParfumPage({ params }: PageProps) {
  const { slug } = await params;
  const produit = await getProduit(slug);

  if (!produit) {
    notFound();
  }

  const contenu = contenuParfum(produit.slug);
  const prix = formatPrix(Number(produit.prix), produit.devise);
  const contenanceLabel =
    produit.contenance_valeur != null && produit.contenance_unite
      ? `${Number(produit.contenance_valeur)} ${produit.contenance_unite}`
      : null;

  return (
    <div data-maison="shea" className="flex flex-col">
      {/* Fil d'Ariane */}
      <div className="w-full border-b border-sable/60 bg-surface-container-low/70">
        <nav
          aria-label="Fil d'Ariane"
          className="mx-auto flex max-w-desktop-max flex-wrap items-center gap-space-xs px-space-lg py-space-sm font-interface text-caption-meta text-on-surface-variant lg:px-space-2xl"
        >
          <Link href="/shea" className="transition-colors duration-300 ease-out hover:text-encre-baobab">
            Maison SHÉA
          </Link>
          <span className="text-or-karite/70" aria-hidden="true">/</span>
          <Link
            href="/shea/collection"
            className="transition-colors duration-300 ease-out hover:text-encre-baobab"
          >
            La Collection Africaine
          </Link>
          <span className="text-or-karite/70" aria-hidden="true">/</span>
          <span className="font-medium text-encre-baobab">{produit.nom}</span>
        </nav>
      </div>

      {/* Vitrine principale */}
      <section className="mx-auto w-full max-w-desktop-max px-space-lg py-space-xl lg:px-space-2xl lg:py-space-2xl">
        <div className="grid grid-cols-1 items-start gap-space-xl lg:grid-cols-12 lg:gap-space-2xl">
          {/* Colonne gauche : flacon (sticky desktop) */}
          <div className="flex flex-col gap-space-lg lg:sticky lg:top-28 lg:col-span-7">
            <div className="relative w-full overflow-hidden bg-surface-container shadow-ambient">
              <div className="relative aspect-[4/5] w-full">
                <Image
                  src="/images/flacon-parfum-ambre.png"
                  alt={`Flacon du parfum ${produit.nom}, Maison SHÉA.`}
                  fill
                  priority
                  sizes="(min-width: 1024px) 55vw, 100vw"
                  className="object-cover object-center"
                />
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-t from-encre-baobab/20 via-transparent to-transparent"
                />
                {produit.escale_geographique ? (
                  <div className="absolute left-space-md top-space-md bg-surface-container-lowest/90 px-space-sm py-space-xxs shadow-ambient backdrop-blur-sm">
                    <span className="font-interface text-caption-meta uppercase tracking-widest text-encre-baobab">
                      Escale · {produit.escale_geographique}
                    </span>
                  </div>
                ) : null}
              </div>
              <div className="flex items-center justify-between bg-surface-container-high/60 p-space-md">
                <span className="flex items-center gap-space-xxs font-interface text-caption-meta text-on-surface-variant">
                  Flacon verre lourd — rechargeable en atelier
                </span>
                {produit.formule_id ? (
                  <Badge variant="accent">Méthode du nombre d&apos;or</Badge>
                ) : null}
              </div>
            </div>
          </div>

          {/* Colonne droite : titre, pyramide résumée, sélection, actions */}
          <div className="flex flex-col gap-space-lg lg:col-span-5">
            <div className="space-y-space-xs border-b border-sable/80 pb-space-sm">
              <span className="font-interface text-caption-meta font-medium uppercase tracking-[0.2em] text-ocre-solaire">
                Maison SHÉA · Haute parfumerie d&apos;origine
              </span>
              <h1 className="font-display text-headline-lg font-light tracking-tight text-encre-baobab">
                {produit.nom}
              </h1>
              <p className="font-display text-title-editorial italic text-on-surface-variant">
                {contenu.accroche}
              </p>
              <div className="flex flex-wrap gap-space-xs pt-space-xs">
                {contenu.familles.map((famille) => (
                  <span
                    key={famille}
                    className="bg-surface-container px-space-xs py-0.5 font-interface text-caption-meta text-encre-baobab"
                  >
                    {famille}
                  </span>
                ))}
              </div>
            </div>

            <p className="font-interface text-body-reading leading-relaxed text-on-surface-variant">
              {contenu.recit}
            </p>

            {/* Sélecteur de contenance — la table `produits` n'expose qu'une
                contenance unique par produit (pas de table de variantes de
                format) : on l'affiche donc comme l'unique option active
                plutôt que de fabriquer de faux formats 10 ml / 50 ml qui
                n'existent pas en base. */}
            {contenanceLabel ? (
              <div className="space-y-space-sm pt-space-xs">
                <span className="font-interface text-caption-meta uppercase tracking-wider text-encre-baobab">
                  Format disponible
                </span>
                <div
                  className="flex items-center justify-between gap-space-md bg-surface-container-highest p-space-sm ring-1 ring-terre-de-dakar"
                  aria-label={`Contenance sélectionnée : ${contenanceLabel}`}
                >
                  <div className="flex flex-col">
                    <span className="font-interface text-caption-meta uppercase text-terre-de-dakar">
                      Flacon d&apos;atelier
                    </span>
                    <span className="font-display text-headline-sm text-encre-baobab">
                      {contenanceLabel}
                    </span>
                  </div>
                  <span className="font-label-tabular text-label-tabular font-semibold text-encre-baobab">
                    {prix}
                  </span>
                </div>
              </div>
            ) : null}

            <div className="flex flex-col gap-space-sm pt-space-xs">
              {/* Panier non encore fonctionnel dans ce périmètre (Vague 3) :
                  /panier et son state sont construits par un autre agent en
                  parallèle, sans fichier partagé avec cette page. Le bouton
                  reste volontairement inerte plutôt que de simuler un faux
                  ajout côté client. */}
              <Button type="button" variant="primary" size="lg" className="w-full justify-between bg-terre-de-dakar tracking-wide">
                <span>Ajouter au panier</span>
                <span className="font-label-tabular text-label-tabular">{prix}</span>
              </Button>
              <p className="font-interface text-caption-meta text-on-surface-variant">
                Livraison offerte dès 80 € d&apos;achat, en France et au Sénégal.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pyramide olfactive — familles éditoriales génériques uniquement */}
      <section className="w-full bg-surface-container-low py-space-2xl lg:py-space-3xl">
        <div className="mx-auto max-w-desktop-max px-space-lg lg:px-space-2xl">
          <div className="mb-space-xl flex flex-col justify-between gap-space-md md:flex-row md:items-end">
            <div className="max-w-reading-max space-y-space-xxs">
              <span className="font-interface text-caption-meta uppercase tracking-[0.2em] text-or-karite">
                La méthode SHÉA
              </span>
              <h2 className="font-display text-headline-lg font-light text-encre-baobab">
                Architecture olfactive au nombre d&apos;or (φ = 1,618)
              </h2>
              <p className="font-interface text-body-reading text-on-surface-variant">
                Une répartition constante entre tête, cœur et fond — non pas la formule elle-même,
                mais la signature de méthode commune à toute la collection SHÉA.
              </p>
            </div>
          </div>

          <div className="space-y-space-xs">
            {ORDRE_ETAGES.map((etage) => {
              const detail = contenu.pyramide[etage];
              return (
                <div
                  key={etage}
                  className="bg-surface-container p-space-lg transition-colors duration-300 ease-out hover:bg-surface-container-high"
                >
                  <div className="flex flex-col gap-space-md md:flex-row md:items-center md:justify-between">
                    <div className="flex items-center gap-space-md md:w-1/3">
                      <span className="font-label-tabular text-[20px] font-light text-or-karite">
                        {PART_ETAGE[etage]} %
                      </span>
                      <div>
                        <span className="block font-interface text-caption-meta uppercase tracking-widest text-on-surface-variant">
                          Strate de {LIBELLE_ETAGE[etage]}
                        </span>
                        <span className="font-display text-title-editorial text-encre-baobab">
                          {detail.titre}
                        </span>
                      </div>
                    </div>
                    <div className="md:w-2/3">
                      <p className="font-interface text-body-reading text-encre-baobab">
                        {detail.familles}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div
            className="mt-space-lg flex h-2 w-full overflow-hidden"
            role="img"
            aria-label="Répartition de la pyramide olfactive : 50 % fond, 31 % cœur, 19 % tête."
          >
            <div style={{ width: `${PART_ETAGE.fond}%` }} className="h-full bg-terre-de-dakar" />
            <div style={{ width: `${PART_ETAGE.coeur}%` }} className="h-full bg-ocre-solaire" />
            <div style={{ width: `${PART_ETAGE.tete}%` }} className="h-full bg-sauge-claire" />
          </div>
        </div>
      </section>

      {/* L'escale */}
      <section className="w-full bg-encre-baobab py-space-2xl text-ivoire-bouye lg:py-space-3xl">
        <div className="mx-auto grid max-w-desktop-max grid-cols-1 items-center gap-space-xl px-space-lg lg:grid-cols-12 lg:gap-space-2xl lg:px-space-2xl">
          <div className="space-y-space-md lg:col-span-6">
            <span className="font-interface text-caption-meta uppercase tracking-widest text-or-karite">
              {produit.escale_geographique ? `L'escale · ${produit.escale_geographique}` : "L'esprit du voyage"}
            </span>
            <h2 className="font-display text-headline-lg font-light text-ivoire-bouye">
              {contenu.escaleTitre}
            </h2>
            <p className="font-interface text-body-reading text-ivoire-bouye/90">{contenu.escaleTexte}</p>
          </div>
          <div className="relative overflow-hidden shadow-ambient lg:col-span-6">
            <div className="relative aspect-[16/10] w-full">
              <Image
                src={contenu.imageEscale}
                alt={contenu.imageEscaleAlt}
                fill
                sizes="(min-width: 1024px) 45vw, 100vw"
                className="object-cover object-center"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Accordéon */}
      <section className="mx-auto w-full max-w-desktop-max px-space-lg py-space-2xl lg:px-space-2xl lg:py-space-3xl">
        <div className="grid grid-cols-1 gap-space-xl lg:grid-cols-12 lg:items-start">
          <div className="space-y-space-xs lg:col-span-4">
            <span className="font-interface text-caption-meta uppercase tracking-widest text-ocre-solaire">
              Transparence &amp; rigueur
            </span>
            <h2 className="font-display text-headline-md text-encre-baobab">Les secrets de confection</h2>
            <p className="font-interface text-body-reading text-on-surface-variant">
              Chaque étape répond aux critères de la haute parfumerie artisanale.
            </p>
          </div>
          <div className="lg:col-span-8">
            <Accordion className="bg-surface-container">
              <AccordionItem className="px-space-lg">
                <AccordionTrigger>Composition &amp; procédé</AccordionTrigger>
                <AccordionContent>{contenu.composition}</AccordionContent>
              </AccordionItem>
              <AccordionItem className="px-space-lg">
                <AccordionTrigger>Conseils d&apos;application</AccordionTrigger>
                <AccordionContent>{contenu.conseils}</AccordionContent>
              </AccordionItem>
              <AccordionItem className="px-space-lg">
                <AccordionTrigger>Engagement de sourcing</AccordionTrigger>
                <AccordionContent>
                  Le karité et les matières premières sahéliennes de cette création sont sourcés
                  selon nos engagements de filière équitable — cueillette sauvage, coopératives
                  rémunérées au juste prix, zéro solvant pétrochimique.{" "}
                  <Link
                    href="/engagements"
                    className="text-terre-de-dakar underline underline-offset-2 transition-colors duration-300 ease-out hover:text-encre-baobab"
                  >
                    Découvrir notre démarche complète
                  </Link>
                  .
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </section>
    </div>
  );
}
