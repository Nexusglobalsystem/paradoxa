import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Engagements & sourcing — LA PARADOXA",
  description:
    "De l'arbre au flacon : sourcing équitable du karité et du moringa, formulation responsable, emballages recyclables et fabrication française chez LA PARADOXA.",
};

const CHIFFRES = [
  { valeur: "100 %", legende: "Cueillette sauvage, sans culture intensive ni feu de brousse" },
  { valeur: "3,8×", legende: "Surcote versée aux coopératives face au cours mondial du karité" },
  { valeur: "0", legende: "Solvant pétrochimique ou silicone dans nos extractions" },
  { valeur: "180 j.", legende: "Maturation lente en fûts avant assemblage du parfum" },
];

const ETAPES = [
  { n: "01", titre: "L'arbre sauvage", detail: "Peuplements spontanés de karité et de moringa, jamais cultivés en monoculture." },
  { n: "02", titre: "Cueillette matinale", detail: "Récolte manuelle à l'aube, avant la chaleur, pour préserver les actifs frais." },
  { n: "03", titre: "Extraction douce", detail: "Pression à froid et friction hydrique, sans hexane ni fractionnement." },
  { n: "04", titre: "Maturation", detail: "Repos en fûts de grès, de plusieurs semaines à six mois selon la formule." },
  { n: "05", titre: "Flaconnage", detail: "Coulage à la main dans nos ateliers de Dakar et Paris, lot numéroté." },
];

const PILIERS = [
  {
    numero: "01",
    surtitre: "Justice économique",
    titre: "Sourcing équitable & souveraineté sahélienne",
    image: "/images/macro-karite-brut.png",
    alt: "Beurre de karité brut et non raffiné, texture artisanale",
    legende: "Karité non désodorisé, origine protégée de Kédougou",
    paragraphs: [
      "Nous refusons l'intermédiation qui relègue les coopératives ouest-africaines à l'exportation de matière brute dépréciée. À Kédougou, une quarantaine d'artisanes cueilleuses et presseuses de karité travaillent en contrat pluriannuel direct avec la Maison.",
      "Les acomptes sont versés avant la saison de cueillette : aucune coopérative ne porte seule le risque climatique. Une pépinière communautaire régénère chaque année de jeunes karités pour les générations suivantes.",
    ],
  },
  {
    numero: "02",
    surtitre: "Chimie végétale pure",
    titre: "Formulation responsable & zéro pétrochimie",
    image: "/images/macro-moringa.png",
    alt: "Feuilles et graines de moringa, matière première botanique",
    legende: "Huile de moringa pressée à froid, sans solvant",
    paragraphs: [
      "Aucune formule ne se cache derrière des silicones volatiles ou des textures artificielles. Chaque baume et chaque extrait est composé d'actifs botaniques identifiables, dosés et documentés jusqu'au pourcentage.",
      "L'architecture olfactive et galénique suit une proportion constante entre corps nourrissant, cœur d'actifs et notes de tête — un même souci de mesure hérité du nombre d'or qui structure nos parfums.",
    ],
  },
  {
    numero: "03",
    surtitre: "Artisanat pérenne",
    titre: "Emballages recyclables & matériaux nobles",
    image: "/images/flatlay-coffret-kraft-or.png",
    alt: "Coffret en kraft recyclé avec liseré or, présentation produit",
    legende: "Coffrets en kraft recyclé, encres végétales",
    paragraphs: [
      "Le flaconnage n'est jamais pensé comme un déchet. Nos coffrets sont en kraft recyclé et carton pressé, sans plastique ni vernis UV, imprimés à l'encre végétale.",
      "Les flacons de parfum sont rechargeables : chaque retour en atelier de Paris ou Dakar donne lieu à un tarif préférentiel sur la recharge suivante.",
    ],
  },
  {
    numero: "04",
    surtitre: "Rigueur d'atelier",
    titre: "Fabrication française & traçabilité complète",
    image: "/images/flacon-parfum-ambre.png",
    alt: "Flacon de parfum ambré en cours d'assemblage en atelier",
    legende: "Assemblage et mise en flacon, atelier de Paris",
    paragraphs: [
      "L'assemblage final des extraits de la Maison SHÉA est réalisé à la main dans notre atelier parisien, dans le respect des Bonnes Pratiques de Fabrication cosmétiques (ISO 22716).",
      "Chaque lot porte un numéro de traçabilité reliant le flacon fini à sa date de maturation, à la coopérative d'origine de ses matières et à son certificat d'analyse.",
    ],
  },
];

export default function EngagementsPage() {
  return (
    <div className="flex flex-col">
      {/* Bandeau manifeste */}
      <section className="w-full bg-surface-container-high px-space-lg pb-space-xl pt-space-2xl lg:px-space-2xl">
        <div className="mx-auto flex max-w-desktop-max flex-col gap-space-lg lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-reading-max space-y-space-xs">
            <span className="flex items-center gap-space-xs font-interface text-caption-meta uppercase tracking-[0.25em] text-or-karite">
              <span className="h-1.5 w-1.5 rounded-full bg-or-karite" aria-hidden="true" />
              Engagements
            </span>
            <h1 className="font-display text-headline-lg-mobile text-encre-baobab lg:text-headline-lg">
              De l&apos;arbre au flacon
            </h1>
          </div>
          <p className="font-interface text-body-reading text-on-surface-variant lg:max-w-[48ch]">
            Une beauté souveraine, respectueuse des cycles biologiques et de la dignité des mains
            qui la font naître au Sahel.
          </p>
        </div>
      </section>

      {/* Hero coopérative de femmes */}
      <section className="w-full bg-surface-container-high">
        <div className="mx-auto max-w-desktop-max px-space-lg pb-space-2xl lg:px-space-2xl">
          <div className="relative w-full overflow-hidden rounded-xl bg-surface-dim shadow-ambient">
            <Image
              src="/images/cooperative-femmes-sahel.png"
              alt="Coopérative de femmes récoltant le karité sauvage au Sénégal"
              width={1600}
              height={900}
              priority
              className="h-[420px] w-full object-cover sm:h-[520px] lg:h-[640px]"
            />
            <div className="absolute inset-0 flex items-end bg-gradient-to-t from-encre-baobab/75 via-transparent to-transparent p-space-lg lg:p-space-2xl">
              <div className="flex w-full flex-col gap-space-xs text-ivoire-bouye sm:flex-row sm:items-baseline sm:justify-between">
                <div className="space-y-space-xxs">
                  <span className="font-interface text-caption-meta uppercase tracking-widest text-or-karite">
                    Terroir — Vallée de Kédougou
                  </span>
                  <p className="font-display text-headline-sm text-ivoire-bouye">
                    La coopérative des gardiennes du karité sauvage
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Chiffres clés */}
      <section className="w-full bg-encre-baobab py-space-2xl text-ivoire-bouye">
        <div className="mx-auto grid max-w-desktop-max grid-cols-1 gap-space-xl px-space-lg sm:grid-cols-2 lg:grid-cols-4 lg:px-space-2xl">
          {CHIFFRES.map((c) => (
            <div key={c.legende} className="space-y-space-xs">
              <span className="font-display text-headline-sm text-or-karite">{c.valeur}</span>
              <p className="font-interface text-body-ui text-ivoire-bouye/85">{c.legende}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Schéma "de l'arbre au flacon" */}
      <section className="w-full bg-surface-container px-space-lg py-space-3xl lg:px-space-2xl">
        <div className="mx-auto max-w-desktop-max space-y-space-xl">
          <div className="max-w-reading-max space-y-space-xxs">
            <span className="font-interface text-caption-meta uppercase tracking-[0.2em] text-terre-de-dakar">
              L&apos;odyssée de la matière
            </span>
            <h2 className="font-display text-headline-lg-mobile text-encre-baobab lg:text-headline-lg">
              Cinq étapes, de la canopée sahélienne au flacon
            </h2>
          </div>
          <ol className="grid grid-cols-1 gap-space-md sm:grid-cols-2 lg:grid-cols-5">
            {ETAPES.map((etape) => (
              <li
                key={etape.n}
                className="flex flex-col gap-space-sm rounded-lg bg-surface-container-low p-space-lg shadow-ambient"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded bg-or-karite font-label-tabular text-label-tabular font-semibold text-encre-baobab">
                  {etape.n}
                </span>
                <h3 className="font-display text-title-editorial text-encre-baobab">{etape.titre}</h3>
                <p className="font-interface text-body-ui text-on-surface-variant">{etape.detail}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* 4 sections alternées image / texte */}
      <section className="w-full space-y-space-3xl bg-ivoire-bouye py-space-3xl">
        {PILIERS.map((pilier, i) => (
          <div key={pilier.numero} className="mx-auto max-w-desktop-max px-space-lg lg:px-space-2xl">
            <div className="grid grid-cols-1 items-center gap-space-xl lg:grid-cols-12 lg:gap-space-2xl">
              <div
                className={`space-y-space-md lg:col-span-5 ${i % 2 === 1 ? "lg:order-2" : ""}`}
              >
                <div className="flex items-center gap-space-xs">
                  <span className="font-label-tabular text-label-tabular font-semibold text-or-karite">
                    {pilier.numero}
                  </span>
                  <span className="h-px w-8 bg-or-karite" aria-hidden="true" />
                  <span className="font-interface text-caption-meta uppercase tracking-widest text-terre-de-dakar">
                    {pilier.surtitre}
                  </span>
                </div>
                <h2 className="font-display text-headline-md text-encre-baobab">{pilier.titre}</h2>
                {pilier.paragraphs.map((p) => (
                  <p key={p} className="font-interface text-body-reading text-on-surface-variant">
                    {p}
                  </p>
                ))}
              </div>
              <div className={`lg:col-span-7 ${i % 2 === 1 ? "lg:order-1" : ""}`}>
                <div className="overflow-hidden rounded-xl bg-sable shadow-ambient">
                  <Image
                    src={pilier.image}
                    alt={pilier.alt}
                    width={1200}
                    height={800}
                    className="h-[320px] w-full object-cover sm:h-[420px] lg:h-[480px]"
                  />
                  <div className="flex items-center justify-between bg-surface-container-high p-space-md">
                    <span className="font-interface text-caption-meta text-on-surface-variant">
                      {pilier.legende}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
