import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";

import { createStaticClient } from "@/lib/supabase/static";

import { BoutonAjouterPanier } from "../../bouton-ajouter-panier";
import { contenuParfum } from "../parfums/contenu-editorial";

/**
 * Écran 7 — Landing du coffret découverte (/shea/coffret-decouverte).
 * Adaptée de /stitch_la_paradoxa/sh_a_le_coffret_d_couverte_cinq_escales/code.html.
 *
 * ── Décision (a) vs (b) — fiche générique /shea/parfums/coffret-cinq-escales ──
 * La fiche produit générique existe déjà (template standard fiche parfum,
 * app/(vitrine)/shea/parfums/[slug]/page.tsx — hors périmètre, non modifiée
 * ici). Décision : (a) on la laisse telle quelle, et cette page devient la
 * landing marketing distincte et plus riche du produit d'appel, vers
 * laquelle /shea (BanniereCoffret) pointe déjà. Pas de redirection —
 * l'écart entre les deux fiches (le template générique reste minimal,
 * celle-ci développe hero/étapes/témoignages) est assumé plutôt que masqué :
 * une redirection aurait nécessité de toucher [slug]/page.tsx (hors
 * périmètre strict de cette tâche) ou une route de contournement fragile.
 * Un visiteur qui atterrit sur la fiche générique via un lien externe/direct
 * garde un parcours d'achat fonctionnel ; celui qui vient de /shea ou de
 * cette page elle-même profite du contenu enrichi.
 *
 * ── Escales présentées ──────────────────────────────────────────────────
 * Le coffret ne contient QUE cinq fioles, pas les six créations de la
 * collection — c'est déjà le choix éditorial acté par l'agent qui a rédigé
 * CONTENU_PARFUMS["coffret-cinq-escales"].recit ("Bois de Shéa, Poussière
 * d'Ocre, Ombre de Baobab, Fleur de Karité et Brume de Gorée" — Or du Ferlo
 * en est absent). Cette page reprend exactement cet ensemble de cinq plutôt
 * que d'improviser une sixième fiole qui contredirait ce texte déjà en
 * production.
 */
const SLUGS_ESCALES_COFFRET = [
  "bois-de-shea",
  "poussiere-docre",
  "ombre-de-baobab",
  "fleur-de-karite",
  "brume-de-goree",
] as const;

export async function generateMetadata(): Promise<Metadata> {
  const coffret = await getCoffret();
  const prix = coffret ? formatPrix(coffret.prix, coffret.devise) : "29 €";
  return {
    title: "Le Coffret Découverte — Cinq Escales | Maison SHÉA | LA PARADOXA",
    description: `Cinq fioles de voyage à ${prix}, intégralement déductibles sur votre premier flacon 100 ml. La façon la plus intime de commencer avec la Maison SHÉA.`,
  };
}

async function getCoffret() {
  const supabase = createStaticClient();
  const { data } = await supabase
    .from("produits")
    .select("*")
    .eq("maison", "shea")
    .eq("slug", "coffret-cinq-escales")
    .eq("statut", "actif")
    .maybeSingle();
  return data;
}

async function getEscalesCoffret() {
  const supabase = createStaticClient();
  const { data } = await supabase
    .from("produits")
    .select("id, slug, nom, escale_geographique, description")
    .eq("maison", "shea")
    .eq("statut", "actif")
    .in("slug", SLUGS_ESCALES_COFFRET);

  const brutes = data ?? [];
  return SLUGS_ESCALES_COFFRET.map((slug) => brutes.find((p) => p.slug === slug)).filter(
    (p): p is NonNullable<typeof p> => Boolean(p),
  );
}

/** Formate un prix EUR à chiffres tabulaires (règle CLAUDE.md n°4). */
function formatPrix(prix: number, devise: string): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: devise || "EUR",
    minimumFractionDigits: prix % 1 === 0 ? 0 : 2,
  }).format(prix);
}

export default async function CoffretDecouvertePage() {
  const [coffret, escales] = await Promise.all([getCoffret(), getEscalesCoffret()]);

  if (!coffret) {
    notFound();
  }

  const prix = formatPrix(Number(coffret.prix), coffret.devise);
  const article = {
    produitId: coffret.id,
    slug: coffret.slug,
    nom: coffret.nom,
    prixUnitaire: Number(coffret.prix),
    devise: coffret.devise,
    image: "/images/flatlay-coffret-kraft-or.png",
    maison: "shea" as const,
  };

  return (
    <div data-maison="shea" className="flex flex-col">
      <Hero prix={prix} article={article} />
      <PartitionEscales escales={escales} />
      <ProtocoleEnTroisEtapes />
      <EcrinEcoConcu />
      <Temoignages />
      <BandeauFinal prix={prix} article={article} />
    </div>
  );
}

interface ArticleCoffret {
  produitId: string;
  slug: string;
  nom: string;
  prixUnitaire: number;
  devise: string;
  image: string;
  maison: "shea";
}

function Hero({ prix, article }: { prix: string; article: ArticleCoffret }) {
  return (
    <section className="relative w-full overflow-hidden bg-ivoire-bouye py-space-xl lg:py-space-3xl">
      <div className="mx-auto max-w-desktop-max px-space-lg lg:px-space-2xl">
        <div className="grid grid-cols-1 items-center gap-space-xl lg:grid-cols-12 lg:gap-space-3xl">
          <div className="relative lg:col-span-6">
            <div className="relative bg-sable/50 p-space-md shadow-ambient lg:p-space-lg">
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-surface-container">
                <Image
                  src="/images/flatlay-coffret-kraft-or.png"
                  alt="Coffret Découverte Maison SHÉA ouvert avec ses fioles de voyage alignées sur fond de lin terracotta."
                  fill
                  priority
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-cover object-center"
                />
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-t from-encre-baobab/20 via-transparent to-transparent"
                />
              </div>
              <div className="mt-space-md flex items-center justify-between px-space-xs text-on-surface-variant">
                <div className="flex items-center gap-space-xs">
                  <span className="h-2 w-2 rounded-full bg-or-karite" />
                  <span className="font-interface text-caption-meta tracking-wider text-encre-baobab">
                    Édition permanente — Cinq escales
                  </span>
                </div>
                {/* text-ocre-solaire-strong, pas text-ocre-solaire : 2.34-2.79:1 sur
                    ces fonds clairs — confirmé par axe-core (Vague 5). */}
                <span className="font-label-tabular text-label-tabular text-ocre-solaire-strong">5 × 2 ml</span>
              </div>
            </div>
            <div className="absolute -bottom-6 -right-6 hidden max-w-[240px] bg-surface-container-lowest p-space-md shadow-ambient sm:block">
              {/* text-maison-primary-strong, pas text-terre-de-dakar brut : même
                  défaut fond clair, confirmé par axe-core (Vague 5). */}
              <span className="mb-space-xxs block font-interface text-caption-meta uppercase tracking-wider text-maison-primary-strong">
                Formulation pure
              </span>
              <p className="font-interface text-body-ui text-xs text-encre-baobab">
                Macération lente dans l&apos;alcool de canne bio, sans filtres chimiques.
              </p>
            </div>
          </div>

          <div className="flex flex-col justify-center gap-space-md lg:col-span-6 lg:gap-space-lg">
            <div className="space-y-space-xs">
              {/* text-ocre-solaire-strong : même défaut fond clair, cf. plus haut. */}
              <span className="block font-interface text-caption-meta uppercase tracking-widest text-ocre-solaire-strong">
                Maison SHÉA — Initiation olfactive
              </span>
              <h1 className="font-display text-headline-lg-mobile font-light leading-tight text-encre-baobab lg:text-headline-lg">
                Cinq escales, un coffret
              </h1>
            </div>
            <p className="max-w-reading-max font-interface text-body-reading text-on-surface-variant">
              Une traversée des paysages olfactifs de l&apos;Afrique de l&apos;Ouest, de l&apos;embrun
              basaltique des falaises dakaroises au silence d&apos;ombre des baobabs. Une immersion
              intime conçue pour apprivoiser nos sillages avant d&apos;élire votre signature.
            </p>

            <div className="space-y-space-sm pt-space-xs">
              <div className="flex items-baseline gap-space-md">
                <span className="font-display text-display-hero-mobile leading-none text-encre-baobab lg:text-display-hero">
                  {prix}
                </span>
                <span className="font-interface text-caption-meta text-on-surface-variant">
                  TTC · Expédition offerte sous 48h
                </span>
              </div>
              <div className="flex items-start gap-space-sm bg-surface-container p-space-md">
                <IconeCadeau className="mt-0.5 h-5 w-5 shrink-0 text-ocre-solaire" />
                <div className="space-y-space-xxs">
                  <span className="block font-label-tabular text-label-tabular text-encre-baobab">
                    Prix 100 % déductible sur votre grand flacon
                  </span>
                  <p className="font-interface text-xs leading-relaxed text-on-surface-variant">
                    L&apos;intégralité du montant du coffret vous est créditée sous forme d&apos;avoir
                    personnel, immédiatement applicable lors de l&apos;acquisition de votre premier
                    flacon 100 ml.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-space-md pt-space-xs">
              <BoutonAjouterPanier
                article={article}
                variant="primary"
                size="lg"
                className="w-full justify-center gap-space-md bg-terre-de-dakar tracking-wide sm:w-auto"
              >
                <span>Acquérir le coffret découverte</span>
                <span className="font-label-tabular text-label-tabular">{prix}</span>
              </BoutonAjouterPanier>

              <div className="grid grid-cols-1 gap-space-sm pt-space-xxs font-interface text-caption-meta text-on-surface-variant sm:grid-cols-3">
                <ReassuranceLigne icone={<IconeCamion className="h-4 w-4" />} texte="Livraison offerte 48h" />
                <ReassuranceLigne icone={<IconeLivre className="h-4 w-4" />} texte="Carnet de voyage inclus" />
                <ReassuranceLigne icone={<IconeVerifie className="h-4 w-4" />} texte="Verre lourd réutilisable" />
              </div>

              <p className="pt-space-xs font-interface text-caption-meta text-on-surface-variant">
                Pas encore certain·e de votre escale ?{" "}
                {/* text-maison-primary-strong, pas text-terre-de-dakar brut : même
                    défaut fond clair, confirmé par axe-core (Vague 5). */}
                <Link
                  href="/shea/quiz"
                  className="text-maison-primary-strong underline underline-offset-2 transition-colors duration-300 ease-out hover:text-encre-baobab"
                >
                  Faites le quiz olfactif
                </Link>{" "}
                pour la découvrir en cinq questions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ReassuranceLigne({ icone, texte }: { icone: ReactNode; texte: string }) {
  return (
    <div className="flex items-center gap-space-xs">
      <span className="text-or-karite">{icone}</span>
      <span>{texte}</span>
    </div>
  );
}

interface EscaleCoffret {
  slug: string;
  nom: string;
  escale_geographique: string | null;
  description: string | null;
}

function PartitionEscales({ escales }: { escales: EscaleCoffret[] }) {
  return (
    <section className="w-full border-t border-sable/40 bg-surface py-space-2xl lg:py-space-3xl">
      <div className="mx-auto max-w-desktop-max px-space-lg lg:px-space-2xl">
        <div className="mb-space-xl flex flex-col justify-between gap-space-md md:flex-row md:items-end">
          <div className="space-y-space-xs">
            {/* text-ocre-solaire-strong : même défaut fond clair, cf. plus haut sur
                cette page. */}
            <span className="block font-interface text-caption-meta uppercase tracking-widest text-ocre-solaire-strong">
              Anthologie sensorielle
            </span>
            <h2 className="font-display text-headline-lg-mobile font-light text-encre-baobab lg:text-headline-lg">
              La partition des cinq escales
            </h2>
          </div>
          <p className="max-w-sm font-interface text-body-ui text-on-surface-variant">
            Chaque miniature de 2 ml contient l&apos;extrait pur de sa création d&apos;origine,
            macéré selon le même procédé que les flacons 100 ml.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-space-md sm:grid-cols-2 lg:grid-cols-5">
          {escales.map((escale, index) => {
            const contenu = contenuParfum(escale.slug);
            return (
              <article
                key={escale.slug}
                className="group flex flex-col justify-between bg-sable/40 p-space-lg shadow-sm transition-all duration-300 ease-out hover:bg-sable/70"
              >
                <div className="space-y-space-md">
                  <div className="flex items-center justify-between font-label-tabular text-label-tabular text-on-surface-variant">
                    {/* text-or-karite-strong, pas text-or-karite : cette carte claire
                        (bg-sable/40) fait tomber l'or brut à 1.7:1 de contraste, bien
                        sous les 4.5:1 requis — confirmé par axe-core (Vague 5), voir
                        app/design-tokens.css. */}
                    <span className="text-or-karite-strong">{String(index + 1).padStart(2, "0")}</span>
                  </div>
                  <div>
                    {/* text-maison-primary-strong, pas text-terre-de-dakar brut : même
                        défaut fond clair (bg-sable/40) que l'or-karite ci-dessus, confirmé
                        par axe-core (Vague 5) — le hover ci-dessous aussi, même surface. */}
                    <span className="mb-1 block font-interface text-caption-meta uppercase tracking-wider text-maison-primary-strong">
                      Escale · {escale.escale_geographique ?? escale.nom}
                    </span>
                    <h3 className="font-display text-headline-sm text-encre-baobab transition-colors group-hover:text-maison-primary-strong">
                      {escale.nom}
                    </h3>
                    <p className="mt-1 font-interface text-caption-meta text-on-surface-variant">
                      Famille : {contenu.familles.join(", ")}
                    </p>
                  </div>
                  {escale.description ? (
                    <p className="border-t border-sable/60 pt-space-xs font-interface text-xs text-on-surface-variant">
                      {escale.description}
                    </p>
                  ) : null}
                </div>
                <div className="mt-space-lg border-t border-sable/40 pt-space-sm">
                  <p className="font-display text-sm italic leading-snug text-encre-baobab/80">
                    « {contenu.escaleTitre} »
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function ProtocoleEnTroisEtapes() {
  const etapes = [
    {
      numero: "I",
      titre: "Recevez votre malle d'échantillons",
      texte:
        "Cinq fioles scellées dans leur écrin en kraft brut doré à chaud et papier ensemencé de graines de baobab. Un rituel tactile dès l'ouverture.",
      note: "Expédié sous pochette protégée",
      accent: "encre-baobab",
    },
    {
      numero: "II",
      titre: "Écoutez l'alchimie sur peau pendant 15 jours",
      texte:
        "Laissez chaque extrait réagir avec votre grain de peau à des heures différentes : l'aube saline, la tiédeur de midi ou la fraîcheur d'un soir d'harmattan.",
      note: "15 à 20 vaporisations par flacon",
      accent: "encre-baobab",
    },
    {
      numero: "III",
      titre: "Convertissez votre fiole en flacon",
      texte:
        "Utilisez l'avoir glissé dans l'écrin pour commander votre extrait pur 100 ml. Votre coffret d'essai vous revient ainsi gratuitement.",
      note: "Avoir valable 12 mois sans minimum",
      accent: "terre-de-dakar",
    },
  ] as const;

  return (
    <section className="w-full bg-ivoire-bouye py-space-2xl lg:py-space-3xl">
      <div className="mx-auto max-w-desktop-max px-space-lg lg:px-space-2xl">
        <div className="mx-auto mb-space-2xl max-w-2xl space-y-space-xs text-center">
          {/* text-ocre-solaire-strong : même défaut fond clair, cf. plus haut sur
              cette page. */}
          <span className="block font-interface text-caption-meta uppercase tracking-widest text-ocre-solaire-strong">
            Cheminement intime
          </span>
          <h2 className="font-display text-headline-lg-mobile font-light text-encre-baobab lg:text-headline-lg">
            Le protocole d&apos;apprivoisement à domicile
          </h2>
          <p className="font-interface text-body-reading text-on-surface-variant">
            Un parfum ne se choisit pas en un souffle éphémère. Il requiert la lenteur des heures et
            la chaleur de votre épiderme.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-space-xl md:grid-cols-3">
          {etapes.map((etape) => (
            <div
              key={etape.numero}
              className="flex flex-col justify-between bg-surface-container-low p-space-xl shadow-sm"
            >
              <div className="space-y-space-md">
                <div
                  className={`flex h-12 w-12 items-center justify-center font-display text-2xl font-light text-ivoire-bouye ${
                    etape.accent === "terre-de-dakar" ? "bg-terre-de-dakar" : "bg-encre-baobab"
                  }`}
                >
                  {etape.numero}
                </div>
                <h3 className="font-display text-headline-sm text-encre-baobab">{etape.titre}</h3>
                <p className="font-interface text-body-ui text-on-surface-variant">{etape.texte}</p>
              </div>
              <div className="mt-space-lg flex items-center gap-space-xs border-t border-sable pt-space-lg font-interface text-caption-meta text-on-surface-variant">
                <IconeSablier className="h-[18px] w-[18px] text-or-karite" />
                <span>{etape.note}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function EcrinEcoConcu() {
  return (
    <section className="w-full bg-encre-baobab py-space-2xl text-ivoire-bouye lg:py-space-3xl">
      <div className="mx-auto max-w-desktop-max px-space-lg lg:px-space-2xl">
        <div className="grid grid-cols-1 items-center gap-space-2xl lg:grid-cols-12">
          <div className="space-y-space-lg lg:col-span-6">
            <div className="space-y-space-xs">
              <span className="block font-interface text-caption-meta uppercase tracking-widest text-or-karite">
                L&apos;artisanat de Dakar à Grasse
              </span>
              <h2 className="font-display text-headline-lg-mobile font-light text-ivoire-bouye lg:text-headline-lg">
                L&apos;écrin pensé comme un livre d&apos;heures
              </h2>
            </div>
            <p className="max-w-reading-max font-interface text-body-reading text-inverse-on-surface/90">
              L&apos;emballage de notre coffret découverte n&apos;a recours à aucun matériau
              plastique. Élaboré à partir de cartons recyclés non blanchis pressés artisanalement, il
              est ceinturé d&apos;un ruban de coton écru bio et scellé à la main d&apos;un cachet de
              cire végétale naturelle.
            </p>
            <div className="grid grid-cols-2 gap-space-lg pt-space-xs">
              <div className="space-y-space-xxs">
                <span className="block font-display text-headline-lg-mobile leading-none text-or-karite">0%</span>
                <span className="font-label-tabular text-label-tabular text-ivoire-bouye">
                  Plastique synthétique
                </span>
                <p className="font-interface text-caption-meta text-inverse-on-surface/70">
                  Flacons en verre sodocalcique recyclable et pompe dévissable.
                </p>
              </div>
              <div className="space-y-space-xxs">
                <span className="block font-display text-headline-lg-mobile leading-none text-or-karite">100%</span>
                <span className="font-label-tabular text-label-tabular text-ivoire-bouye">
                  Compensation carbone
                </span>
                <p className="font-interface text-caption-meta text-inverse-on-surface/70">
                  Reboisement de parcelles d&apos;arbres à karité au Sénégal oriental.
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="relative bg-surface-container-high/10 p-space-xl shadow-ambient backdrop-blur-sm">
              <div className="space-y-space-md text-ivoire-bouye">
                <div className="flex items-center justify-between border-b border-or-karite/30 pb-space-sm">
                  <span className="font-display text-title-editorial tracking-wider">
                    Note d&apos;intention de la Maison
                  </span>
                  <span className="font-interface text-caption-meta text-or-karite">Atelier N° 3</span>
                </div>
                <p className="font-display text-lg italic leading-relaxed text-ivoire-bouye/90">
                  « Nous avons refusé les simples touches à sentir en papier qui trahissent la
                  vibration d&apos;un parfum. Un sillage africain exige la chair tiède, le contact du
                  vent et l&apos;empreinte des heures. »
                </p>
                <div className="flex items-center gap-space-sm pt-space-sm">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-or-karite/20 font-display text-or-karite">
                    M
                  </div>
                  <div>
                    <span className="block font-label-tabular text-label-tabular text-ivoire-bouye">
                      Mamadou Sène &amp; Céline Roux
                    </span>
                    <span className="font-interface text-caption-meta text-inverse-on-surface/70">
                      Nez créateurs de la collection Terre Mère
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Temoignages() {
  const avis = [
    {
      texte:
        "« Le Bois de Shéa m'a bouleversée dès le premier soir. L'avoir a été déduit sans aucune hésitation de mon grand flacon le surlendemain. L'expérience la plus noble vécue en parfumerie de niche. »",
      auteur: "Éléonore de V.",
      contexte: "Paris VIIe · Collectionneuse",
    },
    {
      texte:
        "« Le format 2 ml en spray est d'une précision remarquable. On est loin des languettes cartonnées habituelles. La Poussière d'Ocre est devenue mon armure olfactive en voyage. »",
      auteur: "Amadou N.",
      contexte: "Dakar & Genève · Architecte",
    },
    {
      texte:
        "« L'odeur du carton ensemencé et de la cire avant même de vaporiser les jus installe une émotion rare. Une véritable ode au temps qui passe lentement. »",
      auteur: "Camille B.",
      contexte: "Bordeaux · Journaliste beauté",
    },
  ];

  return (
    <section className="w-full bg-surface-container-low py-space-2xl lg:py-space-3xl">
      <div className="mx-auto max-w-desktop-max px-space-lg lg:px-space-2xl">
        <div className="mx-auto mb-space-2xl max-w-xl space-y-space-xs text-center">
          {/* text-ocre-solaire-strong : même défaut fond clair, cf. plus haut sur
              cette page. */}
          <span className="block font-interface text-caption-meta uppercase tracking-widest text-ocre-solaire-strong">
            Échos de la communauté
          </span>
          <h2 className="font-display text-headline-lg-mobile font-light text-encre-baobab lg:text-headline-lg">
            Paroles du cercle initiatique
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-space-lg md:grid-cols-3">
          {avis.map((temoignage) => (
            <div key={temoignage.auteur} className="flex flex-col justify-between bg-surface p-space-xl shadow-sm">
              <div className="space-y-space-sm">
                <div className="flex text-or-karite" aria-hidden="true">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <IconeEtoile key={i} className="h-4 w-4" />
                  ))}
                </div>
                <p className="font-interface text-body-reading italic text-on-surface">{temoignage.texte}</p>
              </div>
              <div className="mt-space-md border-t border-sable/50 pt-space-md">
                <span className="block font-label-tabular text-label-tabular text-encre-baobab">
                  {temoignage.auteur}
                </span>
                <span className="font-interface text-caption-meta text-on-surface-variant">
                  {temoignage.contexte}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function BandeauFinal({ prix, article }: { prix: string; article: ArticleCoffret }) {
  return (
    <section className="w-full border-t border-sable bg-sable/60 py-space-2xl">
      <div className="mx-auto max-w-desktop-max px-space-lg lg:px-space-2xl">
        <div className="flex flex-col items-center justify-between gap-space-xl bg-surface p-space-xl shadow-ambient lg:flex-row lg:p-space-2xl">
          <div className="max-w-xl space-y-space-xs text-center lg:text-left">
            {/* text-maison-primary-strong, pas text-terre-de-dakar brut : même
                défaut fond clair, confirmé par axe-core (Vague 5). */}
            <span className="block font-interface text-caption-meta uppercase tracking-wider text-maison-primary-strong">
              Votre initiation commence ici
            </span>
            <h2 className="font-display text-headline-md text-encre-baobab">Prêt à commencer la traversée ?</h2>
            <p className="font-interface text-body-ui text-on-surface-variant">
              Commandez le coffret découverte à{" "}
              <span className="font-label-tabular text-label-tabular font-semibold text-encre-baobab">{prix}</span>.
              Votre avoir vous est expédié immédiatement pour choisir votre parfum 100 ml.
            </p>
          </div>
          <BoutonAjouterPanier
            article={article}
            variant="primary"
            size="lg"
            className="w-full justify-center gap-space-sm bg-terre-de-dakar tracking-wide lg:w-auto"
          >
            <IconePanier className="h-[18px] w-[18px]" />
            <span>Ajouter au panier</span>
            <span className="font-label-tabular text-label-tabular">{prix}</span>
          </BoutonAjouterPanier>
        </div>
      </div>
    </section>
  );
}

function IconeCadeau({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <path d="M4 9h16v11a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V9Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
      <path
        d="M3 6h18v3H3zM12 6v15M12 6C10 2 6 3 6 5.5S9 8 12 6ZM12 6c2-4 6-3 6-.5S15 8 12 6Z"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconeCamion({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <path d="M3 7h11v9H3zM14 10h4l3 3v3h-7z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
      <circle cx="7.5" cy="18" r="1.6" stroke="currentColor" strokeWidth="1.3" />
      <circle cx="17.5" cy="18" r="1.6" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  );
}

function IconeLivre({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <path d="M4 5.5c2-1 5-1 8 .5 3-1.5 6-1.5 8-.5v13c-2-1-5-1-8 .5-3-1.5-6-1.5-8-.5v-13Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
      <path d="M12 6v13" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  );
}

function IconeVerifie({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <path
        d="M12 3.5 14.5 5l3-.5.5 3 2 2-1.5 2.5 1.5 2.5-2 2-.5 3-3-.5-2.5 1.5-2.5-1.5-3 .5-.5-3-2-2L5.5 12 4 9.5l2-2 .5-3 3 .5L12 3.5Z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      <path d="m8.5 12 2.3 2.3L15.5 9.6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconeSablier({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <path d="M6 3h12M6 21h12M7 3c0 5 3 6 5 8-2 2-5 3-5 8M17 3c0 5-3 6-5 8 2 2 5 3 5 8" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
    </svg>
  );
}

function IconeEtoile({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M12 2.5 14.9 9l7.1.6-5.4 4.6 1.7 6.9L12 17.6 5.7 21.1l1.7-6.9L2 9.6 9.1 9 12 2.5Z" />
    </svg>
  );
}

function IconePanier({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <path d="M6 8h12l-1 12H7L6 8Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M9 8V6a3 3 0 0 1 6 0v2" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}
