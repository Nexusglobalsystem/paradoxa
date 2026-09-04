import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Badge, Card, CardContent } from "@/components/ui";
import { createStaticClient } from "@/lib/supabase/static";

import { BoutonAjouterPanier } from "../../../bouton-ajouter-panier";
import { contenuSoin, estRituelTete } from "../contenu-editorial";
import { OngletsProduit, type Onglet } from "./onglets-produit";

/**
 * Écran 10 — Fiche produit cosmétique publique (/ecloree/produits/[slug]).
 * Le brief de la Vague 3 fournit délibérément la maquette de l'écran 29
 * (édition admin d'une fiche produit) comme seule référence Stitch pour les
 * NOMS DE CHAMPS, pas la maquette publique de l'écran 10 elle-même : cette
 * page suit donc le ton éditorial des autres maquettes publiques (fiche
 * parfum SHÉA, catégorie ÉCLORÉE) plutôt qu'un fichier HTML précis.
 *
 * Comme pour SHÉA, cette page ne lit jamais `formules` / `formule_lignes`
 * (RLS admin, CLAUDE.md règle 2) : l'onglet "Ingrédients" n'affiche donc
 * qu'un texte éditorial général sur le procédé et un encart "INCI disponible
 * sur demande", jamais une vraie liste INCI issue d'une formule réelle. Voir
 * ../contenu-editorial.ts pour le détail de ce choix.
 */

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function getProduit(slug: string) {
  const supabase = createStaticClient();
  const { data } = await supabase
    .from("produits")
    .select("*")
    .eq("maison", "ecloree")
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
    .eq("maison", "ecloree")
    .eq("statut", "actif");
  return (data ?? []).map((produit) => ({ slug: produit.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const produit = await getProduit(slug);

  if (!produit) {
    return { title: "Soin introuvable — Maison ÉCLORÉE | LA PARADOXA" };
  }

  return {
    title: `${produit.nom} — Maison ÉCLORÉE | LA PARADOXA`,
    description:
      produit.description ?? `${produit.nom}, soin botanique de la Maison ÉCLORÉE — LA PARADOXA.`,
  };
}

function formatPrix(prix: number, devise: string): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: devise || "EUR",
    minimumFractionDigits: prix % 1 === 0 ? 0 : 2,
  }).format(prix);
}

export default async function FicheProduitEcloreePage({ params }: PageProps) {
  const { slug } = await params;
  const produit = await getProduit(slug);

  if (!produit) {
    notFound();
  }

  const contenu = contenuSoin(produit.slug);
  const prix = formatPrix(Number(produit.prix), produit.devise);
  const contenanceLabel =
    produit.contenance_valeur != null && produit.contenance_unite
      ? `${Number(produit.contenance_valeur)} ${produit.contenance_unite}`
      : null;
  const appartientRituelTete = estRituelTete(produit);

  const onglets: Onglet[] = [
    {
      id: "bienfaits",
      label: "Bienfaits",
      contenu: (
        <div className="grid grid-cols-1 gap-space-md sm:grid-cols-3">
          {contenu.bienfaits.map((bienfait) => (
            <Card key={bienfait.titre} className="shadow-none">
              <CardContent className="space-y-space-xxs">
                <h3 className="font-display text-title-editorial text-encre-baobab">
                  {bienfait.titre}
                </h3>
                <p className="font-interface text-body-ui text-on-surface-variant">
                  {bienfait.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      ),
    },
    {
      id: "ingredients",
      label: "Ingrédients",
      contenu: (
        <div className="space-y-space-md">
          <p className="reading-max font-interface text-body-reading text-on-surface-variant">
            {contenu.ingredientsTexte}
          </p>
          {/* Pas de vraie liste INCI ici : `matieres` / `formule_lignes`
              sont réservées au rôle admin par RLS et cette fiche ne les lit
              jamais (CLAUDE.md règle 2). */}
          <div className="flex items-start gap-space-sm bg-surface-container p-space-md">
            <Badge variant="accent">INCI</Badge>
            <p className="font-interface text-body-ui text-on-surface-variant">
              Liste INCI complète disponible sur demande auprès de notre conciergerie —{" "}
              <Link
                href="/contact"
                className="text-maison-primary-strong underline underline-offset-2 transition-colors duration-300 ease-out hover:text-encre-baobab"
              >
                nous contacter
              </Link>
              .
            </p>
          </div>
        </div>
      ),
    },
    {
      id: "utilisation",
      label: "Utilisation",
      contenu: (
        <p className="reading-max font-interface text-body-reading text-on-surface-variant">
          {contenu.utilisation}
        </p>
      ),
    },
    {
      id: "engagements",
      label: "Engagements",
      contenu: (
        <p className="reading-max font-interface text-body-reading text-on-surface-variant">
          {contenu.engagements}{" "}
          <Link
            href="/engagements"
            className="text-maison-primary-strong underline underline-offset-2 transition-colors duration-300 ease-out hover:text-encre-baobab"
          >
            Découvrir notre démarche complète
          </Link>
          .
        </p>
      ),
    },
  ];

  return (
    <div data-maison="ecloree" className="flex flex-col">
      {/* Fil d'Ariane */}
      <div className="w-full border-b border-sable/60 bg-surface-container-low/70">
        <nav
          aria-label="Fil d'Ariane"
          className="mx-auto flex max-w-desktop-max flex-wrap items-center gap-space-xs px-space-lg py-space-sm font-interface text-caption-meta text-on-surface-variant lg:px-space-2xl"
        >
          <Link href="/ecloree" className="transition-colors duration-300 ease-out hover:text-encre-baobab">
            Maison ÉCLORÉE
          </Link>
          <span className="text-maison-primary/60" aria-hidden="true">/</span>
          {appartientRituelTete ? (
            <>
              <Link
                href="/ecloree/rituel-tete"
                className="transition-colors duration-300 ease-out hover:text-encre-baobab"
              >
                Rituel Tête
              </Link>
              <span className="text-maison-primary/60" aria-hidden="true">/</span>
            </>
          ) : null}
          <span className="font-medium text-encre-baobab">{produit.nom}</span>
        </nav>
      </div>

      {/* Vitrine principale */}
      <section className="mx-auto w-full max-w-desktop-max px-space-lg py-space-xl lg:px-space-2xl lg:py-space-2xl">
        <div className="grid grid-cols-1 items-start gap-space-xl lg:grid-cols-12 lg:gap-space-2xl">
          <div className="lg:sticky lg:top-28 lg:col-span-6">
            <div className="relative aspect-[4/5] w-full overflow-hidden bg-surface-container shadow-ambient">
              <Image
                src={contenu.image}
                alt={contenu.imageAlt}
                fill
                priority
                sizes="(min-width: 1024px) 48vw, 100vw"
                className="object-cover object-center"
              />
            </div>
          </div>

          <div className="flex flex-col gap-space-lg lg:col-span-6">
            <div className="space-y-space-xs border-b border-sable/80 pb-space-sm">
              <span className="font-interface text-caption-meta font-medium uppercase tracking-[0.2em] text-maison-primary">
                Maison ÉCLORÉE · Soin botanique
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

            <div className="flex flex-wrap items-center gap-space-xs">
              <Badge variant="success">98–100 % d&apos;origine naturelle</Badge>
              {produit.formule_id ? (
                <Badge variant="accent">Composé par notre atelier de formulation</Badge>
              ) : null}
            </div>

            {produit.description ? (
              <p className="font-interface text-body-reading leading-relaxed text-on-surface-variant">
                {produit.description}
              </p>
            ) : null}

            {/* Contenance — un seul format existe en base pour ce produit,
                pas de sélecteur de variantes fictif. */}
            {contenanceLabel ? (
              <div className="flex items-center justify-between gap-space-md bg-surface-container p-space-sm">
                <span className="font-interface text-caption-meta uppercase tracking-wider text-on-surface-variant">
                  Contenance
                </span>
                <span className="font-label-tabular text-label-tabular text-encre-baobab">
                  {contenanceLabel}
                </span>
              </div>
            ) : null}

            <div className="flex flex-col gap-space-sm pt-space-xs">
              <BoutonAjouterPanier
                article={{
                  produitId: produit.id,
                  slug: produit.slug,
                  nom: produit.nom,
                  prixUnitaire: Number(produit.prix),
                  devise: produit.devise,
                  image: contenu.image,
                  maison: "ecloree",
                }}
                variant="primary"
                size="lg"
                className="w-full justify-between"
              >
                <span>Ajouter au panier</span>
                <span className="font-label-tabular text-label-tabular">{prix}</span>
              </BoutonAjouterPanier>
              <p className="font-interface text-caption-meta text-on-surface-variant">
                Livraison offerte dès 80 € d&apos;achat, en France et au Sénégal.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Onglets */}
      <section className="mx-auto w-full max-w-desktop-max px-space-lg py-space-xl lg:px-space-2xl lg:py-space-2xl">
        <OngletsProduit onglets={onglets} />
      </section>
    </div>
  );
}
