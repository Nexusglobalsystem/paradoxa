import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

/**
 * Écran 2 — Manifeste. Adapté de
 * /stitch_la_paradoxa/manifeste_l_histoire_du_groupe_la_paradoxa/code.html :
 * la maquette dispose l'article en 3 colonnes (sidebar dossier technique /
 * article / sidebar éthique) ; le brief de Vague 2 demande une colonne unique
 * `reading-max` pour ce long-format, plus lisible sur les deux tiers de la
 * page qui suivent le hero. On reprend le vocabulaire visuel de la maquette
 * (hero plein cadre, kicker or, pull-quotes terre-de-dakar, mosaïque de
 * jalons) sans reconduire son grid 3 colonnes.
 */
export const metadata: Metadata = {
  title: "Le Manifeste — LA PARADOXA",
  description:
    "Vitellaria paradoxa, l'arbre de deux mondes : l'histoire du groupe LA PARADOXA, entre la haute parfumerie de Maison SHÉA et la botanique de Maison ÉCLORÉE.",
};

const JALONS = [
  {
    annee: "2018",
    titre: "L'expédition du Sénégal oriental",
    lieu: "Vallée de Fongolimbi",
    texte:
      "Aïcha Ndoye arpente les savanes du sud-est sénégalais. Découverte d'un bosquet séculaire de karité non hybridé, préservé par une chefferie locale.",
  },
  {
    annee: "2021",
    titre: "L'officine de Dakar-Plateau",
    lieu: "Atelier expérimental",
    texte:
      "Inauguration du laboratoire de formulation face à la rade de Gorée. Premiers essais de macération dans des cuves en grès émaillé.",
  },
  {
    annee: "2023",
    titre: "La formule dorée φ",
    lieu: "Canon olfactif",
    texte:
      "Formalisation du canon mathématique 50 / 31 / 19. Lancement confidentiel des premiers flacons numérotés de Maison SHÉA.",
  },
  {
    annee: "2025",
    titre: "Le rayonnement à deux maisons",
    lieu: "Paris — Dakar",
    texte:
      "Maison SHÉA et Maison ÉCLORÉE se rassemblent sous le pavillon commun du groupe LA PARADOXA, entre officine parisienne et ateliers sénégalais.",
  },
];

export default function ManifestePage() {
  return (
    <div className="flex flex-col">
      {/* Hero plein cadre */}
      <section className="relative w-full overflow-hidden bg-encre-baobab text-ivoire-bouye">
        <div className="absolute inset-0">
          <Image
            src="/images/baobab-millenaire.png"
            alt="Baobab millénaire solitaire dans la savane sahélienne à l'heure dorée"
            fill
            priority
            className="object-cover object-center opacity-85"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-encre-baobab via-encre-baobab/40 to-encre-baobab/20" />
          <div className="absolute inset-0 bg-gradient-to-b from-encre-baobab/70 via-transparent to-encre-baobab" />
        </div>
        <div className="relative z-10 mx-auto flex min-h-[70vh] max-w-desktop-max flex-col justify-end px-space-lg py-space-3xl lg:px-space-2xl">
          <div className="max-w-reading-max space-y-space-md">
            <div className="flex items-center gap-space-sm text-or-karite">
              <span className="h-px w-8 bg-or-karite/80" aria-hidden="true" />
              <span className="font-interface text-caption-meta uppercase tracking-[0.25em] text-or-karite">
                Manifeste fondateur · Groupe LA PARADOXA
              </span>
            </div>
            <h1 className="font-display text-display-hero-mobile leading-tight tracking-tight text-ivoire-bouye lg:text-display-hero">
              Vitellaria paradoxa
              <br className="hidden sm:inline" />
              L&apos;arbre de deux mondes.
            </h1>
            <p className="max-w-[54ch] font-interface text-body-reading font-light text-sable/90">
              Entre la haute parfumerie de nuit et la botanique vivante d&apos;Afrique de l&apos;Ouest —
              une réconciliation sensorielle entre la terre rouge du Sahel et les laboratoires parisiens.
            </p>
          </div>
          <div className="mt-space-2xl flex flex-wrap items-center gap-space-md pt-space-md font-interface text-caption-meta text-sable/70">
            <span>Coordonnées : 12°33′N 12°11′W</span>
            <span className="hidden md:inline" aria-hidden="true">
              •
            </span>
            <span className="hidden md:inline">Terroir : Kédougou — Dakar — Paris VIIᵉ</span>
          </div>
        </div>
      </section>

      {/* Article long-format, colonne unique */}
      <section className="w-full bg-ivoire-bouye py-space-3xl">
        <div className="mx-auto max-w-desktop-max px-space-lg lg:px-space-2xl">
          <article className="reading-max mx-auto space-y-space-lg text-encre-baobab">
            <p className="font-interface text-body-reading leading-loose text-on-surface">
              Il existe dans l&apos;immensité du Sahel un silence que rien ne profane. C&apos;est dans ce
              vide vibrant, entre les contreforts rocheux du Sénégal oriental et les plaines ocres du
              Burkina Faso, que grandit le <em>Vitellaria paradoxa</em>. Ni tout à fait sauvage, ni jamais
              domestiqué, l&apos;arbre à beurre incarne un paradoxe biologique : il refuse toute tentative
              d&apos;alignement agricole moderne. Il pousse où le vent l&apos;a déposé, puisant dans un sol
              minéral d&apos;une rare pauvreté une huile d&apos;une opulence absolue.
            </p>
            <p className="font-interface text-body-reading leading-loose text-on-surface-variant">
              Pour les femmes mandingues et peules qui en recueillent les noix tombées à l&apos;aube, le
              karité n&apos;a jamais été un simple ingrédient cosmétique. C&apos;est un baume funéraire, un
              onguent de sacre, un bouclier contre l&apos;Harmattan brûlant. Lorsque LA PARADOXA fut pensée
              à Dakar en 2018, une conviction s&apos;imposa : ne pas simplement transformer cette matière
              végétale, mais lui offrir l&apos;écrin intellectuel et olfactif de la plus haute tradition de
              formulation.
            </p>

            <blockquote className="my-space-xl rounded-xl bg-surface-container-high p-space-xl shadow-ambient">
              <p className="font-display text-headline-sm font-light italic leading-snug text-terre-de-dakar">
                « Nous ne cueillons pas une matière : nous scellons la mémoire olfactive d&apos;un terroir
                millénaire. »
              </p>
              <div className="mt-space-md flex items-center gap-space-sm font-interface text-caption-meta uppercase tracking-widest text-encre-baobab">
                <span className="h-px w-6 bg-terre-de-dakar" aria-hidden="true" />
                <span>Aïcha Ndoye, Fondatrice &amp; Directrice de création</span>
              </div>
            </blockquote>

            <h2 className="font-display text-headline-md font-light text-encre-baobab">
              La dévotion à deux voix : SHÉA et ÉCLORÉE
            </h2>
            <p className="font-interface text-body-reading leading-loose text-on-surface-variant">
              LA PARADOXA s&apos;articule autour d&apos;un diptyque créatif irréconciliable et pourtant
              indissociable. D&apos;un côté, <strong>Maison SHÉA</strong> explore la nuit, l&apos;ombre
              intime et les résines ténébreuses : des extraits telluriques où le beurre brut est infusé à
              chaud de poivre de Selim, de cuir tanné et de vétiver fumé.
            </p>
            <p className="font-interface text-body-reading leading-loose text-on-surface-variant">
              De l&apos;autre côté s&apos;épanouit <strong>Maison ÉCLORÉE</strong> : un sanctuaire de la
              clarté solaire et de la pureté cellulaire. Elle puise dans les graines de moringa pressées à
              froid au Ferlo et la pulpe farineuse de bouye pour restaurer l&apos;intégrité cutanée face aux
              agressions modernes.
            </p>

            <h2 className="font-display text-headline-md font-light text-encre-baobab">
              Le souffle atlantique et les terres rouges
            </h2>
            <p className="font-interface text-body-reading leading-loose text-on-surface-variant">
              Chaque flacon et chaque galet de soin portent l&apos;empreinte de la presqu&apos;île des
              Almadies, là où l&apos;Afrique s&apos;achève dans la houle dorée de l&apos;Atlantique. Le sel
              marin dépose sur les baumes une minéralité silencieuse qui contraste avec la chaleur animale
              du karité fondu au feu de bois — le paradoxe fondateur du groupe, tenu en équilibre depuis
              sept ans.
            </p>
          </article>
        </div>
      </section>

      {/* Chronologie — liste stylée, pas d'animation */}
      <section className="w-full bg-surface-container py-space-3xl">
        <div className="mx-auto max-w-desktop-max space-y-space-2xl px-space-lg lg:px-space-2xl">
          <div className="flex flex-col gap-space-md md:flex-row md:items-end md:justify-between">
            <div className="space-y-space-xxs">
              <span className="font-interface text-caption-meta uppercase tracking-[0.2em] text-terre-de-dakar">
                Chronologie raisonnée
              </span>
              <h2 className="font-display text-headline-lg font-light text-encre-baobab">
                L&apos;itinéraire d&apos;un sacre
              </h2>
            </div>
            <p className="max-w-[42ch] font-interface text-body-ui text-on-surface-variant">
              Sept années de macérations, de rencontres tribales et d&apos;exigences analytiques pour
              donner corps à un luxe enraciné.
            </p>
          </div>

          <ol className="grid grid-cols-1 gap-space-lg md:grid-cols-2 lg:grid-cols-4">
            {JALONS.map((jalon) => (
              <li
                key={jalon.annee}
                className="flex flex-col justify-between space-y-space-xl rounded-xl bg-ivoire-bouye p-space-xl shadow-ambient"
              >
                <div className="space-y-space-sm">
                  <span className="block font-display text-headline-md font-light text-terre-de-dakar">
                    {jalon.annee}
                  </span>
                  <div className="font-display text-title-editorial text-encre-baobab">{jalon.titre}</div>
                  <p className="font-interface text-body-ui leading-relaxed text-on-surface-variant">
                    {jalon.texte}
                  </p>
                </div>
                {/* text-or-karite-strong, pas text-or-karite : cette carte est sur
                    fond clair (bg-ivoire-bouye) — l'or brut y tombe à 1.73:1 de
                    contraste, confirmé par axe-core (Vague 5). */}
                <div className="pt-space-md font-interface text-caption-meta uppercase tracking-widest text-or-karite-strong">
                  {jalon.lieu}
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Portrait fondatrice + signature */}
      <section className="w-full bg-surface-container-low py-space-3xl">
        <div className="mx-auto max-w-desktop-max px-space-lg lg:px-space-2xl">
          <div className="grid grid-cols-1 items-center gap-space-2xl lg:grid-cols-12">
            <div className="lg:col-span-5">
              <div className="relative aspect-[4/5] w-full overflow-hidden rounded-xl bg-surface-container shadow-ambient">
                <Image
                  src="/images/portrait-femme-editorial.png"
                  alt="Portrait éditorial d'Aïcha Ndoye, fondatrice de LA PARADOXA"
                  fill
                  className="object-cover object-top"
                  sizes="(min-width: 1024px) 40vw, 100vw"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-encre-baobab via-encre-baobab/70 to-transparent p-space-lg text-ivoire-bouye">
                  <span className="block font-display text-title-editorial font-light">Aïcha Ndoye</span>
                  <span className="font-interface text-caption-meta uppercase tracking-widest text-or-karite">
                    Fondatrice &amp; Directrice de création
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-space-xl lg:col-span-7 lg:pl-space-xl">
              <div className="space-y-space-md">
                <span className="font-interface text-caption-meta uppercase tracking-[0.2em] text-terre-de-dakar">
                  L&apos;engagement de la fondatrice
                </span>
                <h2 className="font-display text-headline-lg font-light leading-tight text-encre-baobab">
                  « Créer un luxe sans repentance, nourri par la juste rétribution du geste. »
                </h2>
              </div>
              <div className="space-y-space-md font-interface text-body-reading leading-loose text-on-surface">
                <p>
                  « Durant des décennies, l&apos;Occident n&apos;a considéré l&apos;Afrique subsaharienne
                  que comme un gisement de matières premières décontextualisées : un beurre blanchi en
                  cuve industrielle, désodorisé jusqu&apos;à l&apos;anéantissement de son âme, puis revendu
                  dans des flacons glacés.
                </p>
                <p>
                  Avec LA PARADOXA, nous avons inversé le regard. Nous ne blanchissons rien. Nous
                  préservons la couleur du miel sauvage, le parfum de noix grillée et l&apos;énergie du sol
                  dakarois. Le véritable luxe contemporain n&apos;est pas l&apos;artifice : c&apos;est la
                  franchise radicale de ce que la terre offre quand elle est respectée avec vénération. »
                </p>
              </div>

              <div className="flex items-center justify-between border-t border-sable/60 pt-space-md">
                <div>
                  <div className="font-display text-title-editorial italic tracking-wide text-encre-baobab">
                    Aïcha Ndoye
                  </div>
                  <div className="font-interface text-caption-meta text-on-surface-variant">
                    Officine de Dakar, Janvier 2025
                  </div>
                </div>
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-surface-container text-or-karite shadow-ambient">
                  <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" aria-hidden="true">
                    <path
                      d="M12 2C8 6 5 10 5 14a7 7 0 0 0 14 0c0-4-3-8-7-12Z"
                      stroke="currentColor"
                      strokeWidth="1.4"
                    />
                    <path d="M12 6v15" stroke="currentColor" strokeWidth="1.4" />
                  </svg>
                </div>
              </div>

              <div className="flex flex-wrap gap-space-md pt-space-sm">
                <Link
                  href="/shea"
                  className="inline-flex items-center justify-center bg-terre-de-dakar px-space-xl py-space-md font-interface text-body-ui tracking-wide text-ivoire-bouye shadow-ambient transition-colors duration-300 ease-out hover:bg-encre-baobab"
                >
                  Découvrir la parfumerie SHÉA
                </Link>
                <Link
                  href="/ecloree"
                  className="inline-flex items-center justify-center bg-surface-container px-space-xl py-space-md font-interface text-body-ui tracking-wide text-encre-baobab shadow-ambient transition-colors duration-300 ease-out hover:bg-surface-container-high"
                >
                  Explorer les soins ÉCLORÉE
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
