import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui";

import { FLACONS, formatPrixEuros } from "./donnees-flacons";

/**
 * Landing Maison SHÉA (écran 3 de /design/INVENTAIRE.md) — fidèle à
 * /stitch_la_paradoxa/sh_a_accueil_de_la_maison/code.html. Server Component :
 * aucune interaction ne requiert d'état côté client, le défilement horizontal
 * de la rangée d'escales est un simple overflow-x-auto natif.
 */
export const metadata: Metadata = {
  title: "Maison SHÉA — Haute parfumerie sahélienne | LA PARADOXA",
  description:
    "Eaux de parfum de haute escale composées entre Paris et Dakar. Découvrez Les Six Escales de la Maison SHÉA, sa formulation harmonique au nombre d'or et son coffret découverte.",
};

export default function SheaPage() {
  return (
    <div data-maison="shea">
      <Hero />
      <Escales />
      <MethodePhi />
      <BanniereCoffret />
      <SignatureEtLien />
    </div>
  );
}

function Hero() {
  return (
    <section className="relative flex min-h-[640px] w-full flex-col justify-between overflow-hidden bg-encre-baobab px-space-lg py-space-2xl text-ivoire-bouye lg:min-h-[820px] lg:px-space-2xl">
      <Image
        src="/images/still-parfum-ambre.png"
        alt="Flacon de parfum ambré aux gouttes suspendues, lumière dorée d'un atelier de parfumeur à Dakar."
        fill
        priority
        sizes="100vw"
        className="object-cover object-center opacity-40 mix-blend-luminosity"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-t from-encre-baobab via-encre-baobab/70 to-transparent"
      />

      <div className="relative z-10 flex items-center justify-between pt-space-md">
        <div className="flex items-center gap-space-sm">
          <span className="h-2 w-2 rounded-full bg-or-karite shadow-[0_0_8px_rgba(217,178,106,0.8)]" />
          <span className="font-interface text-caption-meta tracking-[0.25em] text-or-karite">
            MAISON SHÉA · HAUTE PARFUMERIE SAHÉLIENNE
          </span>
        </div>
        <span className="hidden font-label-tabular text-label-tabular tracking-widest text-sable/70 sm:inline">
          14°41&apos;37&quot; N · 17°26&apos;48&quot; W
        </span>
      </div>

      <div className="reading-max relative z-10 my-auto space-y-space-lg pt-space-xl">
        <div className="inline-flex items-center gap-space-xs rounded-full bg-ivoire-bouye/10 px-space-sm py-space-xxs font-interface text-caption-meta text-or-karite backdrop-blur-md">
          <IconeFleur className="h-[14px] w-[14px]" />
          <span>Atelier d&apos;exception — Dakar &amp; Grasse</span>
        </div>
        <h1 className="font-display text-display-hero-mobile font-light leading-tight text-ivoire-bouye lg:text-display-hero">
          Le voyage commence à l&apos;arbre.
        </h1>
        <p className="max-w-xl font-interface text-body-reading font-light text-sable/90">
          Eaux de parfum de haute escale composées entre Paris et Dakar, sculptées dans le
          sillage de matières rares du Sahel et d&apos;essences sauvages distillées sous la
          lumière dorée.
        </p>
        <div className="flex flex-col items-start gap-space-md pt-space-sm sm:flex-row sm:items-center">
          <Link
            href="/shea/collection"
            className="inline-flex items-center justify-center gap-space-sm rounded-lg border border-or-karite px-space-xl py-space-md font-interface text-body-ui tracking-wide text-or-karite transition-colors duration-300 ease-out hover:bg-or-karite hover:text-encre-baobab"
          >
            <span>Découvrir la collection</span>
            <IconeFleche className="h-4 w-4" />
          </Link>
          <Link
            href="#methode-phi"
            className="inline-flex items-center justify-center gap-space-sm rounded-lg px-space-lg py-space-md font-interface text-body-ui text-sable transition-colors duration-300 ease-out hover:text-or-karite"
          >
            <IconeRegle className="h-[18px] w-[18px] text-or-karite" />
            <span>L&apos;architecture du nombre d&apos;or (φ)</span>
          </Link>
        </div>
      </div>

      <div className="relative z-10 flex flex-col gap-space-sm border-t border-sable/20 pt-space-md sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-wrap items-center gap-space-md font-interface text-caption-meta text-sable/70">
          <span>Extraction artisanale</span>
          <span className="hidden md:inline">•</span>
          <span className="hidden md:inline">Alcool surfin biologique</span>
          <span className="hidden md:inline">•</span>
          <span>Macération 90 jours</span>
        </div>
        <a
          href="#escales"
          className="flex items-center gap-space-xs font-interface text-caption-meta text-or-karite transition-colors duration-300 ease-out hover:text-ivoire-bouye"
        >
          <span>Faire défiler</span>
          <IconeChevronBas className="h-4 w-4" />
        </a>
      </div>
    </section>
  );
}

function Escales() {
  return (
    <section
      id="escales"
      className="w-full bg-terre-de-dakar px-space-lg py-space-3xl text-ivoire-bouye lg:px-space-2xl"
    >
      <div className="mx-auto max-w-desktop-max space-y-space-2xl">
        <div className="flex flex-col gap-space-lg border-b border-ivoire-bouye/20 pb-space-lg md:flex-row md:items-end md:justify-between">
          <div className="reading-max space-y-space-xs">
            <span className="flex items-center gap-space-xs font-interface text-caption-meta uppercase tracking-[0.2em] text-or-karite">
              <IconeBoussole className="h-[15px] w-[15px]" />
              Anthologie olfactive
            </span>
            <h2 className="font-display text-headline-lg-mobile font-light text-ivoire-bouye lg:text-headline-lg">
              Les Six Escales
            </h2>
            <p className="font-interface text-body-reading font-light text-sable/90">
              Chaque composition capture la mémoire d&apos;une coordonnée terrestre. Des
              contreforts côtiers du Plateau dakarois aux sables chauds de l&apos;intérieur, le
              flacon devient réceptacle d&apos;une vibration pure.
            </p>
          </div>
          <span className="font-interface text-caption-meta text-sable/70">
            Faites défiler pour explorer chaque escale →
          </span>
        </div>

        <div className="flex snap-x snap-mandatory gap-space-lg overflow-x-auto pb-space-lg [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {FLACONS.map((flacon) => (
            <article
              key={flacon.nom}
              className="group flex w-[280px] shrink-0 snap-start flex-col overflow-hidden rounded-xl bg-surface-container-lowest shadow-ambient sm:w-[340px]"
            >
              <div className="relative h-[340px] w-full overflow-hidden bg-surface-container-high sm:h-[380px]">
                <Image
                  src="/images/flacon-parfum-ambre.png"
                  alt={`Flacon du parfum ${flacon.nom}, escale ${flacon.escale}.`}
                  fill
                  sizes="(min-width: 640px) 340px, 280px"
                  className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="absolute left-4 top-4 bg-encre-baobab/85 px-3 py-1 font-interface text-caption-meta text-ivoire-bouye">
                  {flacon.numero} · {flacon.escale}
                </div>
                <div className="absolute bottom-3 right-3 bg-surface-container-lowest/90 px-2.5 py-1 font-label-tabular text-label-tabular text-encre-baobab backdrop-blur-sm">
                  {flacon.volumeMl} ml
                </div>
              </div>
              <div className="flex flex-grow flex-col justify-between gap-space-md bg-ivoire-bouye p-space-lg text-on-surface">
                <div className="space-y-space-xs">
                  <span className="block font-interface text-caption-meta uppercase tracking-wider text-terre-de-dakar">
                    {flacon.famille}
                  </span>
                  <h3 className="font-display text-headline-sm text-encre-baobab">
                    {flacon.nom}
                  </h3>
                  <p className="font-interface text-body-ui text-on-surface-variant">
                    {flacon.description}
                  </p>
                </div>
                <div className="flex items-center justify-between border-t border-sable pt-space-sm">
                  <span className="font-label-tabular text-label-tabular font-medium text-encre-baobab">
                    {formatPrixEuros(flacon.prixEuros)}
                  </span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="gap-1 text-terre-de-dakar hover:bg-transparent hover:text-encre-baobab"
                  >
                    <span>Explorer l&apos;escale</span>
                    <IconeFleche className="h-[14px] w-[14px]" />
                  </Button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/**
 * Diagramme statique 50/31/19 — proportions par défaut du nombre d'or,
 * exposées par design-tokens.css (--phi-top / --phi-heart / --phi-base).
 * Visualisation seule : pas le moteur packages/formulation, pas interactif.
 */
function MethodePhi() {
  const strates = [
    {
      cle: "tete",
      largeurVar: "var(--phi-top)",
      pourcentage: "19 %",
      couleurPastille: "bg-sauge-claire",
      couleurTexte: "text-sauge-claire",
      etiquette: "Strate aérienne · Tête",
      titre: "L'envolée immédiate",
      description: "Agrumes solaires de Casamance, graines de moringa vivifiantes, embruns d'alizé marin.",
      note: "Volatilité fine",
    },
    {
      cle: "coeur",
      largeurVar: "var(--phi-heart)",
      pourcentage: "31 %",
      couleurPastille: "bg-ocre-solaire",
      couleurTexte: "text-ocre-solaire",
      etiquette: "Strate rayonnante · Cœur",
      titre: "Le rythme solaire",
      description: "Résines chauffées au zénith, fleurs de savane gorgées d'ambre, cire brute et pistils de safran.",
      note: "Sillage d'heures chaudes",
    },
    {
      cle: "fond",
      largeurVar: "var(--phi-base)",
      pourcentage: "50 %",
      couleurPastille: "bg-terre-de-dakar",
      couleurTexte: "text-terre-de-dakar",
      etiquette: "Strate terrestre · Fond",
      titre: "L'enracinement profond",
      description: "Beurre de karité sauvage infusé, ébène noirci, racines de vétiver et myrrhe millénaire d'Éthiopie.",
      note: "Mémoire éternelle",
    },
  ] as const;

  return (
    <section
      id="methode-phi"
      className="w-full bg-encre-baobab px-space-lg py-space-3xl text-ivoire-bouye lg:px-space-2xl"
    >
      <div className="mx-auto grid max-w-desktop-max grid-cols-1 items-center gap-space-2xl lg:grid-cols-12">
        <div className="space-y-space-lg lg:col-span-5">
          <div className="space-y-space-xs">
            <span className="flex items-center gap-space-xs font-interface text-caption-meta uppercase tracking-[0.25em] text-or-karite">
              <IconeArchitecture className="h-[15px] w-[15px]" />
              Rigueur mathématique &amp; âme
            </span>
            <h2 className="font-display text-headline-lg-mobile font-light text-ivoire-bouye lg:text-headline-lg">
              La formulation harmonique (φ)
            </h2>
          </div>
          <p className="font-interface text-body-reading font-light text-sable/90">
            Dans notre atelier de la presqu&apos;île, le hasard n&apos;a aucune part dans
            l&apos;architecture des sillages. Chaque formule obéit à la divine proportion{" "}
            <span className="font-display italic text-or-karite">(φ = 1,618)</span>, transposée
            en ratio olfactif de persistance et de diffusion moléculaire.
          </p>
          <p className="font-interface text-body-ui text-sable/70">
            Ce découpage tridimensionnel résonne avec la cadence naturelle de respiration de la
            peau sahélienne : un ancrage lourd, un cœur palpitant et une tête qui s&apos;évapore
            comme une brise d&apos;aube.
          </p>
          <div className="grid grid-cols-2 gap-space-md pt-space-md">
            <div className="border-l border-or-karite bg-ivoire-bouye/5 p-space-md">
              <span className="block font-label-tabular text-label-tabular uppercase tracking-widest text-or-karite">
                Constante φ
              </span>
              <span className="block pt-1 font-display text-headline-sm text-ivoire-bouye">
                1,618033
              </span>
              <span className="font-interface text-caption-meta text-sable/60">
                Équilibre d&apos;évaporation
              </span>
            </div>
            <div className="border-l border-terre-de-dakar bg-ivoire-bouye/5 p-space-md">
              <span className="block font-label-tabular text-label-tabular uppercase tracking-widest text-terre-de-dakar">
                Maturation
              </span>
              <span className="block pt-1 font-display text-headline-sm text-ivoire-bouye">
                90 jours
              </span>
              <span className="font-interface text-caption-meta text-sable/60">
                En fûts de grès cuit
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-space-lg rounded-xl border border-sable/20 bg-ivoire-bouye/5 p-space-lg lg:col-span-7 lg:p-space-xl">
          <div className="flex items-center justify-between border-b border-sable/20 pb-space-sm">
            <span className="font-interface text-caption-meta uppercase tracking-widest text-sable">
              Architecture tripartite
            </span>
            <span className="font-label-tabular text-label-tabular text-or-karite">
              Ratio fond : cœur : tête
            </span>
          </div>

          {/* Barre proportionnelle unique — visualisation directe des largeurs φ. */}
          <div
            className="flex h-4 w-full overflow-hidden rounded-full"
            role="img"
            aria-label="Répartition de la formule : 50 % fond, 31 % cœur, 19 % tête."
          >
            <div style={{ width: "var(--phi-base)" }} className="h-full bg-terre-de-dakar" />
            <div style={{ width: "var(--phi-heart)" }} className="h-full bg-ocre-solaire" />
            <div style={{ width: "var(--phi-top)" }} className="h-full bg-sauge-claire" />
          </div>

          <div className="flex flex-col gap-space-md">
            {strates.map((strate) => (
              <div
                key={strate.cle}
                className="rounded-lg bg-ivoire-bouye/5 p-space-md transition-colors duration-300 ease-out hover:bg-ivoire-bouye/10 lg:p-space-lg"
              >
                <div className="flex items-center justify-between gap-space-md">
                  <div className="space-y-1">
                    <div className="flex items-center gap-space-xs">
                      <span className={`h-1.5 w-1.5 rounded-full ${strate.couleurPastille}`} />
                      <span
                        className={`font-interface text-caption-meta uppercase tracking-wider ${strate.couleurTexte}`}
                      >
                        {strate.etiquette}
                      </span>
                    </div>
                    <h4 className="font-display text-headline-sm text-ivoire-bouye">
                      {strate.titre}
                    </h4>
                    <p className="max-w-lg font-interface text-body-ui text-sable/80">
                      {strate.description}
                    </p>
                  </div>
                  <div className="shrink-0 text-right">
                    <span className="block font-display text-headline-md leading-none text-or-karite/90">
                      {strate.pourcentage}
                    </span>
                    <span className="font-interface text-caption-meta text-sable/60">
                      {strate.note}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between font-interface text-caption-meta text-sable/60">
            <span>∑ = 100 % de la matière parfumée</span>
            <span className="font-display italic text-or-karite">
              Formule certifiée IFRA · Origine Sénégal garantie
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

function BanniereCoffret() {
  return (
    <section className="w-full border-t border-sable bg-surface-container-low px-space-lg py-space-3xl lg:px-space-2xl">
      <div className="mx-auto grid max-w-desktop-max grid-cols-1 overflow-hidden rounded-xl bg-ivoire-bouye shadow-ambient lg:grid-cols-12">
        <div className="relative min-h-[320px] overflow-hidden bg-surface-container-high lg:col-span-6 lg:min-h-[480px]">
          <Image
            src="/images/fond-terracotta-atmospherique.png"
            alt=""
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover object-center"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-t from-encre-baobab/60 via-encre-baobab/10 to-transparent"
          />
          <div className="absolute bottom-6 left-6 flex items-center gap-space-xs bg-ivoire-bouye/95 px-space-md py-space-xs text-encre-baobab backdrop-blur-md">
            <IconeVerifie className="h-[18px] w-[18px] text-or-karite" />
            <span className="font-interface text-caption-meta uppercase tracking-wider">
              Écrin kraft gaufré &amp; dorure
            </span>
          </div>
        </div>

        <div className="flex flex-col justify-between gap-space-lg p-space-xl lg:col-span-6 lg:p-space-2xl">
          <div className="space-y-space-md">
            <div className="flex items-center gap-space-xs font-interface text-caption-meta uppercase tracking-widest text-terre-de-dakar">
              <IconeCoffret className="h-[15px] w-[15px]" />
              Initiation sensorielle
            </div>
            <h2 className="font-display text-headline-lg-mobile font-light text-encre-baobab lg:text-headline-lg">
              Cinq escales, un coffret nomade
            </h2>
            <p className="font-interface text-body-reading font-light text-on-surface-variant">
              Pour apprivoiser la peau avant de choisir son sillage définitif. Cinq fioles de 2 ml
              vaporisateur, accompagnées de leurs touches à sentir en papier vergé et du carnet de
              voyage rédigé par nos nez à Dakar.
            </p>
            <div className="space-y-space-xxs border border-or-karite/40 bg-surface-container-low p-space-md">
              <div className="flex items-center gap-space-xs font-medium text-encre-baobab">
                <IconeCadeau className="h-[18px] w-[18px] text-or-karite" />
                <span className="font-interface text-body-ui">
                  Votre découverte vous est offerte
                </span>
              </div>
              <p className="font-interface text-caption-meta text-on-surface-variant">
                Le montant de votre coffret (29 €) est intégralement déduit sous forme
                d&apos;avoir personnel lors de l&apos;acquisition de votre premier flacon de 100
                ml.
              </p>
            </div>
          </div>

          <div className="flex flex-col items-start gap-space-md border-t border-sable pt-space-md sm:flex-row sm:items-center sm:justify-between">
            <div>
              <span className="block font-interface text-caption-meta text-on-surface-variant">
                Tarif de l&apos;escale nomade
              </span>
              <div className="flex items-baseline gap-space-xs">
                <span className="font-display text-headline-md font-light text-encre-baobab">
                  {formatPrixEuros(29)}
                </span>
                <span className="font-interface text-caption-meta text-on-surface-variant">
                  TTC · Livraison offerte en France &amp; au Sénégal
                </span>
              </div>
            </div>
            <Link
              href="/shea/coffret-decouverte"
              className="inline-flex w-full items-center justify-center gap-space-xs rounded-lg border border-or-karite bg-maison-primary-strong px-space-xl py-space-md font-interface text-body-ui tracking-wide text-ivoire-bouye shadow-ambient transition-colors duration-300 ease-out hover:brightness-90 sm:w-auto"
            >
              <IconePanierPlein className="h-[18px] w-[18px] text-or-karite" />
              <span>Commander le coffret découverte</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function SignatureEtLien() {
  return (
    <section className="w-full border-t border-sable/60 bg-ivoire-bouye px-space-lg py-space-2xl lg:px-space-2xl">
      <div className="mx-auto flex max-w-desktop-max flex-col items-center justify-between gap-space-lg text-center md:flex-row md:text-left">
        <div className="space-y-space-xxs">
          <span className="block font-display text-title-editorial italic text-encre-baobab">
            « Le parfum n&apos;est pas un ornement, c&apos;est un territoire qui s&apos;avance. »
          </span>
          <span className="block font-interface text-caption-meta text-on-surface-variant">
            Abdoulaye S., Maître Formulateur Maison SHÉA — Dakar
          </span>
        </div>
        <Link
          href="/ecloree"
          className="inline-flex items-center gap-space-xs font-interface text-caption-meta tracking-wider text-on-surface-variant transition-colors duration-300 ease-out hover:text-encre-baobab"
        >
          <span>Découvrir le volet botanique · Maison ÉCLORÉE</span>
          <IconeFlecheNordEst className="h-4 w-4" />
        </Link>
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

function IconeChevronBas({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <path d="m6 9 6 6 6-6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconeFleur({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <path
        d="M12 2C8 6 5 10 5 14a7 7 0 0 0 14 0c0-4-3-8-7-12Z"
        stroke="currentColor"
        strokeWidth="1.4"
      />
    </svg>
  );
}

function IconeRegle({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <rect x="3" y="9" width="18" height="6" rx="1" stroke="currentColor" strokeWidth="1.4" />
      <path d="M7 9v3M11 9v2M15 9v3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

function IconeBoussole({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.4" />
      <path d="m14.5 9.5-2 5-3-1 2-5 3 1Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
    </svg>
  );
}

function IconeArchitecture({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <path d="M4 20h16M6 20V9l6-5 6 5v11M10 20v-6h4v6" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
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

function IconeCoffret({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <path d="M4 8h16v11a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V8Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
      <path d="M3 5h18v3H3zM12 8v12" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
    </svg>
  );
}

function IconeCadeau({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <path d="M4 9h16v11a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V9Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
      <path d="M3 6h18v3H3zM12 6v15M12 6C10 2 6 3 6 5.5S9 8 12 6ZM12 6c2-4 6-3 6-.5S15 8 12 6Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
    </svg>
  );
}

function IconePanierPlein({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <path d="M6 8h12l-1 12H7L6 8Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M9 8V6a3 3 0 0 1 6 0v2" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}
