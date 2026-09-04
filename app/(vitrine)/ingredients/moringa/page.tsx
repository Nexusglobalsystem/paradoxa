import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { Badge } from "@/components/ui";

/**
 * Écran 11 — Page ingrédient Moringa oleifera. Adaptée de
 * /stitch_la_paradoxa/clor_e_page_ingr_dient_moringa_oleifera_l_arbre_de_vie/code.html.
 *
 * data-maison="ecloree" ré-enveloppe le contenu de cette page (voir le
 * commentaire de app/(vitrine)/layout.tsx qui documente explicitement ce
 * pattern) : le moringa est un actif propre à Maison ÉCLORÉE, donc les CTA
 * (Button variant="primary"/"outline") et badges accent doivent utiliser la
 * teinte verte de la maison plutôt que l'encre du groupe. Le header/footer
 * du layout restent inchangés (data-maison="groupe" leur est posé plus haut).
 */
export const metadata: Metadata = {
  title: "Moringa oleifera, l'arbre de vie — Maison ÉCLORÉE",
  description:
    "Monographie botanique du moringa : origine sahélienne, usages ancestraux, bienfaits peau et cheveux, et sourcing responsable de la Maison ÉCLORÉE.",
};

const MOLECULES = [
  {
    code: "C22:0 · lipide rare",
    valeur: "72 %",
    nom: "Acide béhénique (oméga-9)",
    texte:
      "Restaure le ciment lipidique intercellulaire. Lisse les écailles cuticulaires et offre une barrière thermo-protectrice naturelle.",
    action: "Scellage & éclat",
  },
  {
    code: "Flavonoïdes",
    valeur: "98,4 %",
    nom: "Quercétine & kaempférol",
    texte:
      "Polyphénols majeurs à très haute valeur antioxydante. Neutralisation des radicaux libres et bouclier cellulaire face aux agressions urbaines.",
    action: "Anti-pollution",
  },
  {
    code: "Co-enzymes purs",
    valeur: "× 7",
    nom: "Vitamines A, C, E",
    texte:
      "Synergie antioxydante concentrée. Stimule le renouvellement cellulaire de la papille dermique et tonifie la racine.",
    action: "Oxygénation du bulbe",
  },
];

const HERBIER = [
  {
    numero: "01",
    titre: "Folioles composées imparipennées",
    texte: "Riches en chlorophylle pure et flavonoïdes antioxydants.",
  },
  {
    numero: "02",
    titre: "Fleurs blanches mellifères",
    texte: "Distillées en hydrolat apaisant au parfum de thé vert et de miel sahélien.",
  },
  {
    numero: "03",
    titre: "Gousses trigones triloculaires",
    texte: "Atteignant 60 cm, berceau de maturation des graines oléagineuses.",
  },
  {
    numero: "04",
    titre: "Graines triailées oléagineuses",
    texte: "Pressées à froid pour libérer l'huile d'or riche en acide béhénique.",
  },
];

const PILIERS_FILIERE = [
  {
    titre: "Agroforesterie sans irrigation fossile",
    texte:
      "Plantation intégrée créant des microclimats pérennes contre la désertification. Les racines profondes du moringa stabilisent les sols dégradés.",
    note: "Zéro puisage dans les nappes fossiles",
  },
  {
    titre: "Pressage à froid au domaine sous 48 h",
    texte:
      "Pour neutraliser l'oxydation des polyphénols, les pressoirs artisanaux opèrent au plus près des arbres récoltés — pas de transport avant extraction.",
    note: "Indice de peroxydes inférieur à 2 meq/kg",
  },
  {
    titre: "Rémunération juste garantie",
    texte:
      "Contrats pluriannuels directs avec les coopératives féminines du Ferlo. Financement de la scolarisation des jeunes filles et d'un fonds de santé mutuel.",
    note: "Commerce direct, sans intermédiaire",
  },
];

const PRODUITS_MORINGA = [
  {
    nom: "Élixir Botanique Moringa & Baobab",
    format: "Flacon pipette 50 ml",
    tag: "Culte capillaire",
    texte: "Sérum réparateur intensif et thermo-protecteur pour chevelures fatiguées.",
    href: "/ecloree/produits/elixir-moringa-baobab",
  },
  {
    nom: "Masque Réparateur Karité Intense",
    format: "Pot verre ambré 200 ml",
    tag: "Nutrition profonde",
    texte: "Alliance de beurre de karité sauvage et d'huile de moringa pure.",
    href: "/ecloree/produits/masque-reparateur-karite-intense",
  },
  {
    nom: "Brume Botanique Vivifiante",
    format: "Vaporisateur fin 100 ml",
    tag: "Hydratation aérienne",
    texte: "Hydrolat pur de folioles fraîches et fleur d'hibiscus rouge.",
    href: "/ecloree/produits/brume-botanique-vivifiante",
  },
];

export default function IngredientMoringaPage() {
  return (
    <div data-maison="ecloree" className="flex flex-col">
      {/* Fil d'Ariane éditorial */}
      <section className="mx-auto w-full max-w-desktop-max px-space-lg pt-space-xl pb-space-lg lg:px-space-2xl">
        <div className="flex flex-col gap-space-sm border-b border-sable/70 pb-space-md md:flex-row md:items-center md:justify-between">
          <nav
            aria-label="Fil d'Ariane"
            className="flex flex-wrap items-center gap-space-xs font-interface text-caption-meta uppercase tracking-[0.18em] text-on-surface-variant"
          >
            <span>La Paradoxa</span>
            <span aria-hidden="true">/</span>
            <span className="font-medium text-vert-moringa">Maison ÉCLORÉE</span>
            <span aria-hidden="true">/</span>
            <span className="font-medium text-encre-baobab">Moringa oleifera</span>
          </nav>
          <div className="inline-flex w-fit items-center gap-space-xs rounded-full border border-vert-moringa/20 bg-sauge-claire/15 px-space-sm py-1 font-interface text-caption-meta text-vert-moringa">
            <span className="h-1.5 w-1.5 rounded-full bg-vert-moringa" aria-hidden="true" />
            <span>Filière signature d&apos;agroforesterie régénérative — Le Ferlo, Sénégal</span>
          </div>
        </div>
      </section>

      {/* Hero éditorial */}
      <section className="mx-auto mb-space-3xl w-full max-w-desktop-max px-space-lg lg:px-space-2xl">
        <div className="grid grid-cols-1 items-center gap-space-2xl lg:grid-cols-12">
          <div className="flex flex-col justify-between space-y-space-xl lg:col-span-6">
            <div className="space-y-space-md">
              <span className="font-interface text-caption-meta uppercase tracking-[0.25em] text-on-surface-variant">
                Monographie botanique n° 04
              </span>
              <h1 className="font-display text-display-hero-mobile italic leading-[1.05] tracking-tight text-encre-baobab lg:text-display-hero">
                Moringa <span className="not-italic font-normal">oleifera</span>
              </h1>
              <p className="font-display text-headline-sm tracking-wide text-vert-moringa">
                L&apos;arbre de vie — prodigieuse pharmacopée du Sahel
              </p>
              <div className="my-space-sm h-px w-16 bg-or-karite/80" aria-hidden="true" />
              <p className="reading-max font-interface text-body-reading leading-relaxed text-on-surface-variant">
                Arbre résilient aux vertus quasi mythiques, le moringa puise dans les sols arides du Ferlo
                une concentration phénoménale en antioxydants, vitamines et peptides protecteurs. Chaque
                foliole veloutée et chaque graine ailée concentre le pouvoir d&apos;un bouclier cellulaire
                face aux agressions climatiques et environnementales.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-space-xs rounded-lg border border-sable bg-surface-container/60 p-space-sm sm:grid-cols-4">
              <div className="space-y-0.5 p-space-xs">
                <span className="block font-interface text-[11px] uppercase tracking-wider text-on-surface-variant/70">
                  Famille
                </span>
                <span className="block text-label-tabular font-label-tabular text-encre-baobab">
                  Moringaceae
                </span>
              </div>
              <div className="space-y-0.5 border-l border-sable p-space-xs">
                <span className="block font-interface text-[11px] uppercase tracking-wider text-on-surface-variant/70">
                  Partie récoltée
                </span>
                <span className="block text-label-tabular font-label-tabular text-encre-baobab">
                  Graines &amp; folioles
                </span>
              </div>
              <div className="space-y-0.5 border-l border-sable p-space-xs">
                <span className="block font-interface text-[11px] uppercase tracking-wider text-on-surface-variant/70">
                  Extraction
                </span>
                <span className="block text-label-tabular font-label-tabular text-encre-baobab">
                  Pression à froid &lt;48 h
                </span>
              </div>
              <div className="space-y-0.5 border-l border-sable p-space-xs">
                <span className="block font-interface text-[11px] uppercase tracking-wider text-on-surface-variant/70">
                  Label
                </span>
                <span className="block text-label-tabular font-label-tabular text-vert-moringa">
                  Bio-régénératif
                </span>
              </div>
            </div>
          </div>

          <div className="relative lg:col-span-6">
            <div className="relative rounded-xl border border-sable/80 bg-surface-container p-2 shadow-ambient sm:p-3">
              <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-surface-container-high">
                <Image
                  src="/images/macro-moringa.png"
                  alt="Macro photographie de gousses et graines ailées de Moringa oleifera"
                  fill
                  priority
                  className="object-cover"
                  sizes="(min-width: 1024px) 45vw, 100vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-encre-baobab/40 via-transparent to-transparent" />
                <div className="absolute inset-x-4 bottom-4 flex items-center justify-between font-interface text-caption-meta text-ivoire-bouye">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-or-karite/30 bg-encre-baobab/60 px-3 py-1 backdrop-blur-md">
                    Planche botanique n° 31 — Gousses mûres et folioles
                  </span>
                  <span className="hidden font-label-tabular tracking-widest text-or-karite sm:inline">
                    Département du Ferlo
                  </span>
                </div>
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between px-1 font-interface text-caption-meta text-on-surface-variant">
              <span>Photographie naturaliste in situ · Récolte manuelle matinale</span>
              <span className="italic text-or-karite">Maison Éclorée</span>
            </div>
          </div>
        </div>
      </section>

      {/* Long-format : origine, usages, bienfaits */}
      <section className="w-full border-y border-sable bg-surface-container-low/80 py-space-3xl">
        <div className="reading-max mx-auto space-y-space-2xl px-space-lg">
          <article className="space-y-space-lg">
            <div className="flex items-center gap-3">
              <span className="font-interface text-caption-meta uppercase tracking-[0.25em] text-or-karite">
                Chapitre I
              </span>
              <span className="h-px flex-1 bg-sable" aria-hidden="true" />
              <span className="font-interface text-caption-meta text-on-surface-variant/60">
                15°24&apos;N — 14°48&apos;W
              </span>
            </div>
            <h2 className="font-display text-headline-lg font-light tracking-tight text-encre-baobab">
              Origine &amp; terroir du Ferlo
            </h2>
            <div className="space-y-space-md font-interface text-body-reading leading-[1.8] text-on-surface">
              <p className="first-letter:float-left first-letter:mr-3 first-letter:font-display first-letter:text-display-hero first-letter:leading-none first-letter:text-vert-moringa">
                Au cœur de la steppe sahélienne du Ferlo, là où les pluies annuelles ne subsistent que
                quelques semaines éphémères, s&apos;érige une silhouette paradoxale : le Moringa oleifera.
                Arbre frêle d&apos;apparence mais doté d&apos;une vitalité prodigieuse, il prospère dans des
                sols latéritiques sablonneux d&apos;une austérité absolue.
              </p>
              <p>
                Cette frugalité extrême est précisément la genèse de sa richesse active. Pour survivre aux
                assauts conjoints du vent d&apos;Harmattan et des rayonnements ultraviolets, la plante
                déploie un système d&apos;autodéfense phytochimique exceptionnel : les jeunes folioles et
                les graines ailées captent l&apos;infime humidité nocturne et synthétisent une profusion
                d&apos;antioxydants, de phytostérols et de chaînes d&apos;acides gras rares.
              </p>
              <p>
                Au sein de notre domaine expérimental de Linguère, ÉCLORÉE accompagne des coopératives
                rurales féminines composées de plus de deux cents cueilleuses. La cueillette s&apos;opère à
                l&apos;aube, avant que la rosée ne s&apos;évapore, préservant ainsi l&apos;intégrité
                enzymatique des feuilles et l&apos;arôme vert, subtilement toasté, de l&apos;amande
                végétale.
              </p>
            </div>
          </article>

          <div className="relative overflow-hidden rounded-xl border border-or-karite/40 bg-surface-container p-space-xl text-center shadow-ambient">
            <p className="font-display text-headline-md font-light italic leading-snug text-vert-moringa">
              « Là où le désert avance, le moringa offre son ombre et ses fruits, purifiant l&apos;eau et
              redonnant à la fibre capillaire son élasticité originelle. »
            </p>
            <cite className="mt-space-sm block font-interface text-caption-meta uppercase not-italic tracking-[0.2em] text-on-surface-variant">
              — Carnets de terrain du botaniste en chef, Ferlo septentrional
            </cite>
          </div>

          <article className="space-y-space-lg">
            <div className="flex items-center gap-3">
              <span className="font-interface text-caption-meta uppercase tracking-[0.25em] text-or-karite">
                Chapitre II
              </span>
              <span className="h-px flex-1 bg-sable" aria-hidden="true" />
              <span className="font-interface text-caption-meta text-on-surface-variant/60">
                Transmission orale
              </span>
            </div>
            <h2 className="font-display text-headline-lg font-light tracking-tight text-encre-baobab">
              Usages ancestraux &amp; sagesse sahélienne
            </h2>
            <div className="space-y-space-md font-interface text-body-reading leading-[1.8] text-on-surface">
              <p>
                Nommé <em>Nébédaye</em> en wolof — « il ne meurt jamais » — le moringa s&apos;inscrit au
                carrefour des pharmacopées vivantes d&apos;Afrique de l&apos;Ouest. Depuis des générations,
                les guérisseuses peules et wolofs écrasent les graines décortiquées dans des récipients en
                terre cuite : en précipitant les matières en suspension, l&apos;huile et les protéines
                purifient les eaux de source troubles.
              </p>
              <p>
                Dans les rituels de beauté nuptiaux et les préparations capillaires séculaires, les femmes
                du Sahel confectionnaient un onguent tiède mêlant la pulpe écrasée de graines fraîches à des
                beurres végétaux battus. Appliqué mèche à mèche, ce baume protégeait les tresses des
                poussières abrasives, prévenant la casse mécanique et apportant une brillance soyeuse sans
                effet occlusif.
              </p>
            </div>
          </article>

          <article className="space-y-space-lg">
            <h2 className="font-display text-headline-lg font-light tracking-tight text-encre-baobab">
              Bienfaits peau &amp; cheveux
            </h2>
            <div className="space-y-space-md font-interface text-body-reading leading-[1.8] text-on-surface">
              <p>
                Sur la fibre capillaire, l&apos;huile de moringa referme les écailles de la cuticule et
                dépose un film thermo-protecteur léger, sans jamais alourdir les longueurs — un allié
                précieux avant tout coiffage à la chaleur. Sur la peau, la richesse en vitamines A, C et E
                stimule le renouvellement cellulaire et apaise les tiraillements liés à la sécheresse
                climatique.
              </p>
              <p>
                C&apos;est cette double vocation, capillaire et cutanée, qui a guidé ÉCLORÉE dans la
                construction de sa gamme moringa : un même actif décliné en sérum, masque et brume, chacun
                calibré selon la strate — tête, cœur, fond — qui régit toutes nos formules.
              </p>
            </div>
          </article>
        </div>
      </section>

      {/* Panel composition — molécules actives */}
      <section className="mx-auto w-full max-w-desktop-max px-space-lg py-space-3xl lg:px-space-2xl">
        <div className="reading-max mb-space-2xl space-y-space-xs">
          <span className="font-interface text-caption-meta uppercase tracking-[0.2em] text-vert-moringa">
            Biochimie végétale
          </span>
          <h2 className="font-display text-headline-lg font-light text-encre-baobab">
            L&apos;architecture moléculaire du moringa
          </h2>
          <p className="font-interface text-body-reading text-on-surface-variant">
            Une symbiose de micro-nutriments et d&apos;acides gras rares au service de la cuticule du
            cheveu et de la matrice cutanée. Composition présentée à titre éditorial.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-space-md md:grid-cols-3">
          {MOLECULES.map((molecule) => (
            <div
              key={molecule.nom}
              className="flex flex-col justify-between rounded-xl border border-sable bg-surface p-space-lg shadow-ambient transition-colors duration-300 ease-out hover:border-or-karite/80"
            >
              <div>
                <div className="mb-space-md flex items-start justify-between">
                  <span className="font-interface text-caption-meta tracking-widest text-or-karite">
                    {molecule.code}
                  </span>
                  <span className="font-display text-headline-md font-light text-vert-moringa">
                    {molecule.valeur}
                  </span>
                </div>
                <h3 className="mb-1 font-display text-title-editorial font-medium text-encre-baobab">
                  {molecule.nom}
                </h3>
                <div className="my-space-xs h-0.5 w-8 bg-vert-moringa/40" aria-hidden="true" />
                <p className="font-interface text-body-ui leading-relaxed text-on-surface-variant">
                  {molecule.texte}
                </p>
              </div>
              <div className="mt-space-md flex items-center justify-between border-t border-sable/50 pt-space-md font-interface text-caption-meta text-on-surface-variant/80">
                <span>Action : {molecule.action}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Herbier — anatomie de la plante */}
      <section className="mx-auto w-full max-w-desktop-max px-space-lg py-space-3xl lg:px-space-2xl">
        <div className="rounded-2xl border border-or-karite/40 bg-surface-container p-space-xl shadow-ambient lg:p-space-2xl">
          <div className="grid grid-cols-1 items-center gap-space-xl lg:grid-cols-12">
            <div className="space-y-space-md lg:col-span-5">
              <span className="font-interface text-caption-meta uppercase tracking-[0.25em] text-or-karite">
                Anatomie de la plante
              </span>
              <h2 className="font-display text-headline-lg font-light text-encre-baobab">
                L&apos;herbier d&apos;ÉCLORÉE
              </h2>
              <p className="font-interface text-body-reading leading-relaxed text-on-surface-variant">
                Chaque organe végétal du moringa remplit un rôle complémentaire au service de nos
                formules. Notre charte d&apos;extraction fractionne séparément folioles, fleurs et graines
                pour en exalter la pureté native.
              </p>
              <div className="space-y-space-sm pt-space-sm">
                {HERBIER.map((partie) => (
                  <div
                    key={partie.numero}
                    className="flex items-start gap-3 rounded-lg border border-sable bg-surface/80 p-space-sm"
                  >
                    <span className="font-label-tabular text-label-tabular text-or-karite">
                      {partie.numero}.
                    </span>
                    <div>
                      <strong className="block font-display text-[15px] text-encre-baobab">
                        {partie.titre}
                      </strong>
                      <p className="font-interface text-caption-meta text-on-surface-variant">
                        {partie.texte}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-center p-space-lg lg:col-span-7">
              <div className="relative flex aspect-[4/5] w-full max-w-[420px] flex-col items-center justify-between rounded-xl border border-or-karite/30 bg-surface p-space-lg shadow-inner">
                <div className="flex w-full items-center justify-between border-b border-sable pb-2 font-interface text-caption-meta uppercase tracking-widest text-on-surface-variant">
                  <span>Planche iconographique IV</span>
                  <span>Herbarium Paradoxa</span>
                </div>
                <svg
                  viewBox="0 0 320 400"
                  className="my-auto h-auto w-56 text-vert-moringa sm:w-64"
                  fill="none"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    className="text-encre-baobab/70"
                    d="M160 380 Q160 220 160 40"
                    strokeLinecap="round"
                    strokeWidth="1.8"
                  />
                  <path d="M160 310 Q110 280 80 250" strokeLinecap="round" strokeWidth="1.2" />
                  <path d="M160 310 Q210 280 240 250" strokeLinecap="round" strokeWidth="1.2" />
                  <path d="M160 230 Q105 200 75 160" strokeLinecap="round" strokeWidth="1.2" />
                  <path d="M160 230 Q215 200 245 160" strokeLinecap="round" strokeWidth="1.2" />
                  <g fill="currentColor" fillOpacity="0.18" stroke="currentColor" strokeWidth="1">
                    <path d="M80 250 Q65 240 70 230 Q85 235 80 250 Z" />
                    <path d="M100 260 Q85 245 92 238 Q108 245 100 260 Z" />
                    <path d="M240 250 Q255 240 250 230 Q235 235 240 250 Z" />
                    <path d="M220 260 Q235 245 228 238 Q212 245 220 260 Z" />
                    <path d="M75 160 Q60 150 65 140 Q80 145 75 160 Z" />
                    <path d="M245 160 Q260 150 255 140 Q240 145 245 160 Z" />
                    <path d="M160 40 Q150 22 160 12 Q170 22 160 40 Z" />
                  </g>
                  <path
                    d="M160 260 Q145 320 150 370"
                    stroke="#D9B26A"
                    strokeDasharray="2 1"
                    strokeLinecap="round"
                    strokeWidth="2"
                  />
                  <g fill="#D9B26A" fillOpacity="0.15" stroke="#D9B26A" transform="translate(185, 305) scale(0.65)">
                    <polygon points="50,10 90,50 10,50" strokeWidth="1.5" />
                    <circle cx="50" cy="38" r="14" fill="#1B2A23" fillOpacity="0.7" stroke="#D9B26A" strokeWidth="1.5" />
                  </g>
                </svg>
                <div className="flex w-full items-center justify-between border-t border-sable pt-2 font-interface text-caption-meta text-on-surface-variant">
                  <span className="font-display text-[13px] italic">Moringa oleifera Lam.</span>
                  <span className="text-[11px] text-or-karite">Gravure n° 812</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filière responsable */}
      <section className="my-space-xl w-full bg-encre-baobab py-space-3xl text-ivoire-bouye">
        <div className="mx-auto max-w-desktop-max px-space-lg lg:px-space-2xl">
          <div className="reading-max mb-space-2xl space-y-space-xs">
            <span className="font-interface text-caption-meta uppercase tracking-[0.25em] text-or-karite">
              Manifeste de filière
            </span>
            <h2 className="font-display text-headline-lg font-light text-ivoire-bouye">
              L&apos;engagement éthique ÉCLORÉE
            </h2>
            <p className="font-interface text-body-reading text-ivoire-bouye/80">
              Notre chaîne de valeur n&apos;extrait pas seulement une matière première rare : elle restaure
              le biome du Sahel et protège l&apos;autonomie économique des artisanes du vivant.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-space-xl md:grid-cols-3">
            {PILIERS_FILIERE.map((pilier) => (
              <div
                key={pilier.titre}
                className="flex flex-col justify-between rounded-xl border border-or-karite/20 bg-ivoire-bouye/5 p-space-lg"
              >
                <div className="space-y-space-sm">
                  <h3 className="font-display text-title-editorial font-normal text-ivoire-bouye">
                    {pilier.titre}
                  </h3>
                  <p className="font-interface text-body-ui leading-relaxed text-ivoire-bouye/70">
                    {pilier.texte}
                  </p>
                </div>
                <div className="mt-space-md flex items-center gap-2 border-t border-ivoire-bouye/10 pt-space-md font-interface text-caption-meta text-or-karite">
                  <span>{pilier.note}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Rangée produits contenant du moringa (placeholder) */}
      <section className="mx-auto w-full max-w-desktop-max px-space-lg py-space-3xl lg:px-space-2xl">
        <div className="mb-space-2xl flex flex-col gap-space-md md:flex-row md:items-end md:justify-between">
          <div>
            <span className="font-interface text-caption-meta uppercase tracking-[0.2em] text-vert-moringa">
              Formulations botaniques
            </span>
            <h2 className="font-display text-headline-lg font-light text-encre-baobab">
              Les rituels infusés au moringa
            </h2>
          </div>
          <Link
            href="/ecloree"
            className="inline-flex items-center gap-2 self-start border-b border-vert-moringa/40 pb-1 font-interface text-caption-meta uppercase tracking-widest text-vert-moringa transition-colors duration-300 ease-out hover:text-encre-baobab md:self-auto"
          >
            Explorer la collection Maison ÉCLORÉE
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-space-xl md:grid-cols-3">
          {PRODUITS_MORINGA.map((produit) => (
            <div
              key={produit.nom}
              className="group flex flex-col overflow-hidden rounded-xl border border-sable bg-surface shadow-ambient transition-colors duration-300 ease-out hover:border-or-karite"
            >
              <div className="relative flex aspect-square items-center justify-center overflow-hidden bg-surface-container p-6">
                <Badge variant="outline" className="absolute left-4 top-4 uppercase">
                  {produit.tag}
                </Badge>
                <span className="font-interface text-caption-meta text-on-surface-variant/60">
                  Visuel produit à venir
                </span>
              </div>
              <div className="flex flex-1 flex-col justify-between space-y-space-md p-space-lg">
                <div className="space-y-space-xs">
                  <div className="flex items-baseline justify-between">
                    <span className="font-interface text-caption-meta uppercase tracking-wider text-on-surface-variant">
                      {produit.format}
                    </span>
                  </div>
                  <h3 className="font-display text-headline-sm text-encre-baobab transition-colors duration-300 ease-out group-hover:text-vert-moringa">
                    {produit.nom}
                  </h3>
                  <p className="font-interface text-body-ui leading-relaxed text-on-surface-variant">
                    {produit.texte}
                  </p>
                </div>
                <Link
                  href={produit.href}
                  className="inline-flex w-full items-center justify-center gap-space-xs rounded-lg bg-maison-primary-strong px-space-md py-space-sm font-interface text-body-ui uppercase tracking-[0.18em] text-ivoire-bouye shadow-ambient transition-colors duration-300 ease-out hover:brightness-90"
                >
                  Découvrir la formule
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
