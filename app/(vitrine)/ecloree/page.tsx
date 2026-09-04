import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

import { Badge, Button } from "@/components/ui";

import { BESTSELLERS, formatPrixEuros } from "./donnees-bestsellers";

/**
 * Landing Maison ÉCLORÉE (écran 8 de /design/INVENTAIRE.md) — fidèle à
 * /stitch_la_paradoxa/clor_e_accueil_de_la_maison/code.html. Contraste
 * volontaire avec /shea : palette claire, mise en page aérée (espacements
 * généreux, peu d'aplats sombres). Server Component, aucune interaction
 * ne requiert d'état côté client.
 */
export const metadata: Metadata = {
  title: "Maison ÉCLORÉE — Soin botanique karité & moringa | LA PARADOXA",
  description:
    "Soins botaniques d'une pureté absolue nés des vergers sauvages du Sahel et de la Casamance : karité millénaire, moringa régénérant, filière équitable féminine.",
};

export default function EcloreePage() {
  return (
    <div data-maison="ecloree">
      <BandeauAnnonce />
      <Hero />
      <Rituels />
      <ActifsSignature />
      <Bestsellers />
      <BandeauSourcing />
      <BandeauDiagnostic />
    </div>
  );
}

function BandeauAnnonce() {
  return (
    <section className="w-full bg-surface-container-high/60 px-space-md py-space-xs text-encre-baobab lg:px-space-2xl">
      <div className="mx-auto flex max-w-desktop-max flex-col items-center justify-between gap-space-xs font-interface text-caption-meta tracking-wide md:flex-row">
        <div className="flex flex-wrap items-center justify-center gap-space-xs">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-vert-moringa" />
          <span className="font-medium">Maison ÉCLORÉE</span>
          <span className="text-on-surface-variant/60">•</span>
          <span>Soins botaniques vivants</span>
          <span className="text-on-surface-variant/60">•</span>
          <span className="text-on-surface-variant">Karité sauvage &amp; moringa oleifera</span>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-space-xs text-on-surface-variant">
          <span>Formulation 98 à 100 % d&apos;origine naturelle</span>
          <span className="text-on-surface-variant/60">•</span>
          <span className="font-medium text-maison-primary-strong">
            Filière équitable certifiée Casamance &amp; Sahel
          </span>
        </div>
      </div>
    </section>
  );
}

function Hero() {
  return (
    <section className="relative w-full overflow-hidden bg-surface-container-low">
      <div className="mx-auto grid max-w-desktop-max grid-cols-1 items-stretch lg:min-h-[680px] lg:grid-cols-12">
        <div className="flex flex-col justify-between gap-space-2xl p-space-lg lg:col-span-6 lg:p-space-2xl">
          <div className="space-y-space-md pt-space-md lg:pt-space-xl">
            <div className="inline-flex items-center gap-space-xs rounded-full bg-sable/50 px-space-sm py-space-xxs font-interface text-caption-meta tracking-wider text-encre-baobab">
              <IconeFeuille className="h-[15px] w-[15px] text-maison-primary" />
              <span>Haute botanique de savane</span>
            </div>
            <h1 className="font-display text-display-hero-mobile leading-[1.08] tracking-tight text-encre-baobab lg:text-display-hero">
              L&apos;éclat vient de l&apos;arbre.
            </h1>
            <p className="reading-max font-interface text-body-reading leading-relaxed text-on-surface-variant">
              Des soins botaniques d&apos;une pureté absolue nés des vergers sauvages du Sahel et
              de la Casamance. La rencontre du karité millénaire et du moringa régénérant,
              capturée vivante sans aucun compromis galénique.
            </p>
            <div className="flex flex-col items-stretch gap-space-md pt-space-sm sm:flex-row sm:items-center">
              <Link
                href="#rituels"
                className="inline-flex items-center justify-center gap-space-sm rounded-lg bg-maison-primary-strong px-space-lg py-space-md text-center font-interface text-body-ui font-medium uppercase tracking-wider text-ivoire-bouye shadow-ambient transition-colors duration-300 ease-out hover:brightness-90"
              >
                Explorer les rituels botaniques
              </Link>
              <Link
                href="#actifs"
                className="inline-flex items-center justify-center gap-space-sm rounded-lg px-space-lg py-space-md text-center font-interface text-body-ui font-medium tracking-wider text-on-surface-variant transition-colors duration-300 ease-out hover:bg-surface-container hover:text-on-surface"
              >
                Découvrir nos actifs vivants
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-space-md border-t-0 pb-space-xs pt-space-xl sm:grid-cols-3">
            <BadgeMicro icone="flocon" texte="Pressage à froid < 48 h" />
            <BadgeMicro icone="coche" texte="0 % conservateur synthétique" />
            <BadgeMicro icone="recyclage" texte="Biodégradabilité 100 %" />
          </div>
        </div>

        <div className="relative min-h-[380px] bg-surface-container lg:col-span-6 lg:min-h-full">
          <Image
            src="/images/macro-karite-brut.png"
            alt="Beurre de karité brut et doré, fondant sur une coupelle en céramique sous la lumière chaude du matin."
            fill
            priority
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover object-center"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-t from-encre-baobab/30 via-transparent to-transparent"
          />
          <div className="absolute bottom-space-lg right-space-lg max-w-[260px] bg-surface-container-lowest/90 p-space-md shadow-ambient backdrop-blur-sm">
            <span className="block font-interface text-caption-meta uppercase tracking-wider text-maison-primary-strong">
              Origine sauvage
            </span>
            <p className="mt-space-xxs font-display text-title-editorial text-encre-baobab">
              Beurre brut non raffiné
            </p>
            <span className="mt-space-xxs block font-interface text-caption-meta text-on-surface-variant">
              Pressé au pilon de pierre, Sahel méridional.
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

function BadgeMicro({ icone, texte }: { icone: "flocon" | "coche" | "recyclage"; texte: string }) {
  return (
    <div className="flex items-center gap-space-xs rounded bg-surface-container-high/40 p-space-xs">
      {icone === "flocon" ? (
        <IconeFlocon className="h-[18px] w-[18px] text-maison-primary" />
      ) : icone === "coche" ? (
        <IconeCoche className="h-[18px] w-[18px] text-maison-primary" />
      ) : (
        <IconeRecyclage className="h-[18px] w-[18px] text-maison-primary" />
      )}
      <span className="font-interface text-caption-meta text-encre-baobab">{texte}</span>
    </div>
  );
}

const RITUELS = [
  {
    numero: "Rituel 01",
    titre: "Rituel Tête",
    sousTitre: "Cuir chevelu & fibre",
    description:
      "Restructuration profonde et nutrition des longueurs au baume de karité brut. Restaure l'élasticité de la fibre capillaire exposée aux rigueurs solaires.",
    image: "/images/banniere-rituel-capillaire.png",
    alt: "Flacon de tonique capillaire botanique posé sur une dalle de calcaire brut, entourée de feuilles de moringa fraîches.",
    misEnAvant: false,
  },
  {
    numero: "Culte",
    titre: "Rituel Visage",
    sousTitre: "Éclat & régénération",
    description:
      "Infusion antioxydante au moringa pressé à froid et céramides végétales. Neutralise l'impact oxydatif et ravive la clarté du teint.",
    image: "/images/pot-cosmetique-verre-depoli.png",
    alt: "Pot cosmétique en verre dépoli, couvercle ivoire, posé sur un plinthe de travertin clair.",
    misEnAvant: true,
  },
  {
    numero: "Rituel 03",
    titre: "Rituel Corps",
    sousTitre: "Caresse de savane",
    description:
      "Onctuosité fondante pour restaurer la barrière lipidique et apaiser durablement. Protège l'enveloppe corporelle du dessèchement cutané.",
    image: "/images/macro-karite-brut.png",
    alt: "Beurre de karité brut, texture onctueuse, prêt à être fondu en soin corporel.",
    misEnAvant: false,
  },
] as const;

function Rituels() {
  return (
    <section id="rituels" className="w-full bg-ivoire-bouye px-space-md py-space-3xl lg:px-space-2xl">
      <div className="mx-auto max-w-desktop-max space-y-space-2xl">
        <div className="reading-max space-y-space-xs">
          <span className="block font-interface text-caption-meta uppercase tracking-widest text-maison-primary">
            Rituels quotidiens
          </span>
          <h2 className="font-display text-headline-lg-mobile text-encre-baobab lg:text-headline-lg">
            Trois gestes fondamentaux d&apos;équilibre
          </h2>
          <p className="font-interface text-body-reading text-on-surface-variant">
            Chaque protocole honore la physiologie cutanée sans saturer l&apos;épiderme,
            unifiant la force nourrissante du karité pur et la vivacité régénérante des feuilles
            de moringa.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-space-lg md:grid-cols-3">
          {RITUELS.map((rituel) => (
            <article
              key={rituel.titre}
              className={`flex flex-col justify-between rounded-xl p-space-lg transition-shadow duration-300 ease-out hover:shadow-ambient ${
                rituel.misEnAvant ? "bg-surface-container-high shadow-ambient" : "bg-surface-container-low"
              }`}
            >
              <div className="space-y-space-md">
                <div className="relative h-64 w-full overflow-hidden rounded-lg bg-surface-container">
                  <Image
                    src={rituel.image}
                    alt={rituel.alt}
                    fill
                    sizes="(min-width: 768px) 33vw, 100vw"
                    className="object-cover"
                  />
                  <span
                    className={`absolute left-space-sm top-space-sm px-space-xs py-space-xxs font-label-tabular text-label-tabular ${
                      rituel.misEnAvant
                        ? "bg-maison-primary-strong text-ivoire-bouye"
                        : "bg-surface-container-lowest/80 text-encre-baobab"
                    }`}
                  >
                    {rituel.numero}
                  </span>
                </div>
                <div className="space-y-space-xs">
                  <h3 className="font-display text-headline-sm text-encre-baobab">{rituel.titre}</h3>
                  <p className="font-interface text-caption-meta uppercase tracking-wider text-maison-primary">
                    {rituel.sousTitre}
                  </p>
                  <p className="pt-space-xs font-interface text-body-ui text-on-surface-variant">
                    {rituel.description}
                  </p>
                </div>
              </div>
              <div className="pt-space-lg">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="gap-space-xs px-0 text-encre-baobab hover:bg-transparent hover:text-maison-primary-strong"
                >
                  <span>Découvrir le {rituel.titre}</span>
                  <IconeFleche className="h-4 w-4" />
                </Button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function ActifsSignature() {
  return (
    <section id="actifs" className="w-full bg-surface-container px-space-md py-space-3xl lg:px-space-2xl">
      <div className="mx-auto max-w-desktop-max space-y-space-2xl">
        <div className="reading-max mx-auto space-y-space-xs text-center">
          <span className="block font-interface text-caption-meta uppercase tracking-widest text-maison-primary">
            Botanique fondamentale
          </span>
          <h2 className="font-display text-headline-lg-mobile text-encre-baobab lg:text-headline-lg">
            Deux arbres souverains du Sud
          </h2>
          <p className="font-interface text-body-reading text-on-surface-variant">
            Une osmose rare entre la protection dense du beurre d&apos;arbre de vie et la
            pénétration fulgurante des feuilles d&apos;immortalité.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-space-xl md:grid-cols-2">
          <PanneauActif
            image="/images/macro-karite-brut.png"
            alt="Noix et beurre de karité brut, texture crayeuse et dorée."
            origine="Filière Sahel · Haute altitude"
            nomLatin="Vitellaria Paradoxa"
            titre="Le karité d'altitude"
            description="Riche en acides gras essentiels insaturés, acide stéarique et karitène protecteur. Les noix sont récoltées uniquement après leur chute spontanée, garantissant l'apogée nutritionnel du fruit sans traumatiser le végétal."
            bienfaits={[
              {
                titre: "Protection barrière active",
                description: "Reconstitution du film hydrolipidique sans occlusivité synthétique.",
              },
              {
                titre: "Nutrition cellulaire profonde",
                description: "Apport direct en vitamines A et E pour apaiser et assouplir.",
              },
              {
                titre: "Cicatrisation et relipidage",
                description: "Renforce la cohésion intercellulaire des tissus agressés.",
              },
            ]}
            statistique={
              <>
                Teneur en insaponifiables : <strong>11,2 %</strong> (vs 4 % sur les beurres
                industriels solvantés).
              </>
            }
          />
          <PanneauActif
            image="/images/macro-moringa.png"
            alt="Feuilles et graines de moringa fraîchement cueillies."
            origine="Casamance · Maraîchage vivant"
            nomLatin="Moringa Oleifera"
            titre="L'arbre aux miracles"
            description="Une concentration sans équivalent de 92 nutriments et 46 antioxydants bio-compatibles. Les graines pressées à froid livrent une huile sèche à haute affinité dermo-cellulaire qui pénètre instantanément l'épiderme."
            bienfaits={[
              {
                titre: "Détoxification cutanée",
                description: "Capture et neutralise les particules de pollution urbaine.",
              },
              {
                titre: "Éclat immédiat sans film gras",
                description: "Régule la production sébacée tout en illuminant les zones d'ombre.",
              },
              {
                titre: "Bouclier antiradicalaire",
                description: "Richesse exceptionnelle en zéatine, favorisant la jeunesse cellulaire.",
              },
            ]}
            statistique={
              <>
                Indice antioxydant ORAC : <strong>157 000 µmol TE/100 g</strong> (puissance 6×
                supérieure à la baie de goji).
              </>
            }
          />
        </div>

        <div className="w-full space-y-space-xs bg-encre-baobab p-space-xl text-center text-ivoire-bouye lg:p-space-2xl">
          <span className="block font-interface text-caption-meta uppercase tracking-widest text-or-karite">
            Philosophie de formulation
          </span>
          <h3 className="font-display text-headline-md text-ivoire-bouye">
            La synergie végétale — 0 % eau ajoutée
          </h3>
          <p className="reading-max mx-auto font-interface text-body-reading text-ivoire-bouye/80">
            Nos formules ne contiennent pas une seule goutte d&apos;eau neutre de remplissage.
            Chaque base est constituée d&apos;eaux florales distillées, d&apos;élixirs
            botaniques et d&apos;huiles vierges de première pression.
          </p>
        </div>
      </div>
    </section>
  );
}

function PanneauActif({
  image,
  alt,
  origine,
  nomLatin,
  titre,
  description,
  bienfaits,
  statistique,
}: {
  image: string;
  alt: string;
  origine: string;
  nomLatin: string;
  titre: string;
  description: string;
  bienfaits: { titre: string; description: string }[];
  statistique: ReactNode;
}) {
  return (
    <div className="flex flex-col justify-between gap-space-xl overflow-hidden rounded-xl bg-surface-container-lowest p-space-xl shadow-ambient md:p-space-2xl">
      <div className="space-y-space-md">
        <div className="relative h-48 w-full overflow-hidden rounded-lg bg-surface-container">
          <Image src={image} alt={alt} fill sizes="(min-width: 768px) 45vw, 100vw" className="object-cover" />
        </div>
        <div className="flex items-center justify-between">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-sable/40 text-maison-primary">
            <IconeNature className="h-5 w-5" />
          </span>
          <span className="font-label-tabular text-label-tabular text-on-surface-variant">{origine}</span>
        </div>
        <div>
          <h3 className="font-display text-headline-md text-encre-baobab">{nomLatin}</h3>
          <p className="mt-space-xxs font-interface text-caption-meta uppercase tracking-wider text-maison-primary">
            {titre}
          </p>
        </div>
        <p className="font-interface text-body-ui text-on-surface-variant">{description}</p>
        <div className="space-y-space-sm pt-space-sm">
          {bienfaits.map((bienfait) => (
            <div key={bienfait.titre} className="flex items-start gap-space-sm">
              <IconeVerifie className="mt-0.5 h-[18px] w-[18px] shrink-0 text-maison-primary" />
              <div>
                <h4 className="font-label-tabular text-label-tabular text-encre-baobab">{bienfait.titre}</h4>
                <p className="font-interface text-caption-meta text-on-surface-variant">
                  {bienfait.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="rounded bg-surface-container-low p-space-md font-interface text-caption-meta text-on-surface-variant">
        {statistique}
      </div>
    </div>
  );
}

function Bestsellers() {
  return (
    <section className="w-full bg-ivoire-bouye px-space-md py-space-3xl lg:px-space-2xl">
      <div className="mx-auto max-w-desktop-max space-y-space-2xl">
        <div className="flex flex-col gap-space-md md:flex-row md:items-end md:justify-between">
          <div className="reading-max space-y-space-xs">
            <span className="block font-interface text-caption-meta uppercase tracking-widest text-maison-primary">
              La collection signature
            </span>
            <h2 className="font-display text-headline-lg-mobile text-encre-baobab lg:text-headline-lg">
              Les essentiels botaniques
            </h2>
            <p className="font-interface text-body-reading text-on-surface-variant">
              Formulés à froid, présentés dans nos flacons de verre dépoli thermique.
            </p>
          </div>
          <Button
            type="button"
            variant="ghost"
            className="w-fit gap-space-xs px-0 text-encre-baobab hover:bg-transparent hover:text-maison-primary-strong"
          >
            <span>Consulter toute la collection</span>
            <IconeFleche className="h-4 w-4" />
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-space-lg sm:grid-cols-2 lg:grid-cols-4">
          {BESTSELLERS.map((produit) => (
            <div
              key={produit.nom}
              className={`group flex flex-col justify-between rounded-xl p-space-md transition-shadow duration-300 ease-out hover:shadow-ambient ${
                produit.statut === "Culte" ? "bg-surface-container-high" : "bg-surface-container-low"
              }`}
            >
              <div className="space-y-space-sm">
                <div className="relative h-72 w-full overflow-hidden rounded-lg bg-surface-container">
                  <Image
                    src="/images/pot-cosmetique-verre-depoli.png"
                    alt={`Pot ÉCLORÉE contenant ${produit.nom}.`}
                    fill
                    sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                  />
                  <span className="absolute right-space-xs top-space-xs bg-sable px-space-xs py-space-xxs font-interface text-caption-meta text-encre-baobab">
                    {produit.volumeMl} ml
                  </span>
                </div>
                <div className="space-y-space-xxs">
                  <span className="block font-interface text-caption-meta uppercase text-maison-primary">
                    {produit.categorie}
                  </span>
                  <h3 className="font-display text-title-editorial text-encre-baobab">{produit.nom}</h3>
                  <p className="font-interface text-caption-meta text-on-surface-variant">
                    {produit.description}
                  </p>
                </div>
              </div>
              <div className="space-y-space-sm pt-space-md">
                <div className="flex items-center justify-between">
                  <span className="font-label-tabular text-label-tabular font-medium text-encre-baobab">
                    {formatPrixEuros(produit.prixEuros)}
                  </span>
                  {produit.statut === "Culte" ? (
                    <Badge variant="accent">Culte</Badge>
                  ) : (
                    <span className="font-interface text-caption-meta text-on-surface-variant">En stock</span>
                  )}
                </div>
                <Button type="button" variant="primary" size="sm" className="w-full tracking-wide">
                  Ajouter au rituel
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function BandeauSourcing() {
  return (
    <section className="w-full bg-surface-container-low px-space-md py-space-3xl lg:px-space-2xl">
      <div className="mx-auto grid max-w-desktop-max grid-cols-1 items-center gap-space-2xl lg:grid-cols-12">
        <div className="relative lg:col-span-6">
          <div className="h-[420px] w-full overflow-hidden rounded-xl bg-surface-container shadow-ambient lg:h-[540px]">
            <Image
              src="/images/cooperative-femmes-sahel.png"
              alt="Coopérative de femmes du Sahel, réunies à l'ombre d'un arbre pour trier des noix de karité fraîchement récoltées."
              width={960}
              height={1080}
              sizes="(min-width: 1024px) 45vw, 100vw"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="absolute -bottom-space-md left-space-xs max-w-[280px] rounded-lg bg-ivoire-bouye p-space-md shadow-ambient sm:left-space-md">
            <span className="block font-interface text-caption-meta uppercase tracking-widest text-maison-primary">
              Coopérative Baobab Vert
            </span>
            <p className="mt-space-xxs font-interface text-body-ui text-encre-baobab">
              Cercle des cueilleuses de brousse · Sahel &amp; Casamance
            </p>
          </div>
        </div>

        <div className="space-y-space-xl pt-space-lg lg:col-span-6 lg:pt-0">
          <div className="space-y-space-sm">
            <span className="block font-interface text-caption-meta uppercase tracking-widest text-maison-primary">
              Économie vivante
            </span>
            <h2 className="font-display text-headline-lg-mobile leading-tight text-encre-baobab lg:text-headline-lg">
              Le respect des mains qui cueillent.
            </h2>
            <p className="pt-space-xs font-interface text-body-reading leading-relaxed text-on-surface-variant">
              Chez ÉCLORÉE, chaque gramme de karité et de moringa provient de coopératives
              féminines autonomes en Afrique de l&apos;Ouest. Nous pratiquons le préfinancement
              intégral des récoltes, un prix d&apos;achat garanti 2,5 fois supérieur aux cours du
              marché mondial, et le versement de 5 % de notre chiffre d&apos;affaires dans des
              programmes d&apos;alphabétisation et de santé communautaire.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-space-lg pt-space-md sm:grid-cols-3">
            <MetriqueSourcing valeur="1 420" libelle="Femmes artisanes et cueilleuses fédérées" accent={false} />
            <MetriqueSourcing valeur="100 %" libelle="Cueillette sauvage certifiée biologique" accent />
            <MetriqueSourcing valeur="0 %" libelle="Raffinage chimique ou blanchiment" accent={false} />
          </div>

          <Link
            href="/engagements"
            className="inline-flex items-center gap-space-xs font-interface text-body-ui text-encre-baobab transition-colors duration-300 ease-out hover:text-maison-primary-strong"
          >
            <span>Lire notre rapport d&apos;impact annuel</span>
            <IconeFlecheNordEst className="h-[17px] w-[17px]" />
          </Link>
        </div>
      </div>
    </section>
  );
}

function MetriqueSourcing({
  valeur,
  libelle,
  accent,
}: {
  valeur: string;
  libelle: string;
  accent: boolean;
}) {
  return (
    <div className="bg-surface-container p-space-md">
      <span
        className={`block font-display text-headline-lg ${accent ? "text-maison-primary" : "text-encre-baobab"}`}
      >
        {valeur}
      </span>
      <span className="mt-space-xxs block font-interface text-caption-meta text-on-surface-variant">
        {libelle}
      </span>
    </div>
  );
}

function BandeauDiagnostic() {
  return (
    <section className="w-full bg-sable/30 px-space-md py-space-2xl lg:px-space-2xl">
      <div className="mx-auto grid max-w-desktop-max grid-cols-1 items-center gap-space-xl lg:grid-cols-12">
        <div className="space-y-space-xs lg:col-span-8">
          <span className="block font-interface text-caption-meta uppercase tracking-widest text-maison-primary">
            Consultation personnalisée
          </span>
          <h3 className="font-display text-headline-md text-encre-baobab">
            Diagnostic de peau botanique offert
          </h3>
          <p className="reading-max font-interface text-body-ui text-on-surface-variant">
            En 3 minutes, identifiez la synergie karité-moringa la plus adaptée à vos variations
            cutanées et recevez votre prescription galénique personnalisée.
          </p>
        </div>
        <div className="flex lg:col-span-4 lg:justify-end">
          <Button type="button" variant="primary" size="lg" className="w-full uppercase tracking-wider sm:w-auto">
            Commencer mon diagnostic
          </Button>
        </div>
      </div>
    </section>
  );
}

function IconeFleche({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconeFlecheNordEst({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <path d="M7 17 17 7M9 7h8v8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconeFeuille({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <path d="M5 19c8 0 14-6 14-14-8 0-14 6-14 14Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
      <path d="M5 19c3-3 6-6 9-11" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

function IconeFlocon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <path d="M12 3v18M5 7l14 10M19 7 5 17" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

function IconeCoche({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.4" />
      <path d="m8.5 12.5 2.3 2.3L15.5 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconeRecyclage({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <path
        d="M7 5.5 9.5 3M7 5.5l2.5 2.5M7 5.5h6.5A3.5 3.5 0 0 1 17 9M17 18.5 14.5 21M17 18.5 19.5 16M17 18.5h-6.5A3.5 3.5 0 0 1 7 15"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconeNature({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <path d="M12 21V10M12 10C7 10 5 7 5 3c5 0 7 2 7 7ZM12 10c5 0 7-3 7-7-5 0-7 2-7 7Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
    </svg>
  );
}

function IconeVerifie({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <path d="M12 3.5 14.5 5l3-.5.5 3 2 2-1.5 2.5 1.5 2.5-2 2-.5 3-3-.5-2.5 1.5-2.5-1.5-3 .5-.5-3-2-2L5.5 12 4 9.5l2-2 .5-3 3 .5L12 3.5Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
      <path d="m8.5 12 2.3 2.3L15.5 9.6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
