import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { z } from "zod";

import { Card } from "@/components/ui";
import { cn } from "@/lib/utils";

import { NewsletterForm, type EtatNewsletter } from "./newsletter-form";
import { RevealOnScroll } from "./reveal-on-scroll";

/**
 * Écran 1 — Portail du groupe (design/INVENTAIRE.md, fidèle à
 * /stitch_la_paradoxa/portail_du_groupe_l_entr_e/code.html). Server
 * Component : aucune interaction ne requiert de JS ailleurs que dans le
 * formulaire newsletter (voir newsletter-form.tsx).
 *
 * data-maison="groupe" est déjà posé par app/(vitrine)/layout.tsx pour tout
 * le chrome, mais le portail montre les deux maisons côte à côte : les
 * couleurs de chaque porte et de chaque coffret croisé sont donc forcées
 * directement (bg-terre-de-dakar, bg-vert-moringa, etc.) plutôt que lues
 * via --color-maison-* — ce mécanisme reste réservé aux pages qui vivent
 * entièrement sous une seule maison.
 */
export const metadata: Metadata = {
  title: "LA PARADOXA — Deux maisons, un seul arbre",
  description:
    "Groupe de beauté française né entre Dakar et Paris. La Maison SHÉA compose des parfums de voyage selon le nombre d'or ; la Maison ÉCLORÉE régénère la peau au karité sauvage et au moringa. Deux maisons, une même exigence de terroir.",
};

// Placeholder de démonstration (groupe fictif, aucun nom de domaine réel
// déployé à ce stade) — à remplacer par l'URL de production lors de la mise
// en ligne.
const ORGANISATION_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "LA PARADOXA",
  url: "https://www.laparadoxa.com",
  description:
    "Groupe de beauté française réunissant la Maison SHÉA (haute parfumerie de niche) et la Maison ÉCLORÉE (soin naturel karité et moringa).",
  brand: [
    { "@type": "Brand", name: "SHÉA" },
    { "@type": "Brand", name: "ÉCLORÉE" },
  ],
};

/**
 * Server Action minimale : valide l'email puis renvoie une confirmation.
 * Aucune table `newsletter` n'existe encore côté Supabase (hors périmètre
 * de cette vague, qui construit la vitrine éditoriale — pas le pipeline
 * d'inscription) : rien n'est persisté ici, c'est un choix documenté, pas
 * un oubli. Fidèle au comportement de la maquette Stitch (feedback JS
 * inline, formulaire non branché). Brancher une vraie liste de diffusion
 * (table Supabase + Resend) est un suivi explicite pour une prochaine vague.
 */
async function sInscrireALaNewsletter(
  _etatPrecedent: EtatNewsletter,
  formData: FormData,
): Promise<EtatNewsletter> {
  "use server";

  const email = String(formData.get("email") ?? "").trim();
  const analyse = z.email("Adresse email invalide.").safeParse(email);

  if (!analyse.success) {
    return { statut: "erreur", message: "Merci de renseigner une adresse email valide." };
  }

  return {
    statut: "succes",
    message: "Votre adresse a été inscrite à nos prochaines missives de récolte.",
  };
}

export default function PortailPage() {
  return (
    <>
      <h1 className="sr-only">
        LA PARADOXA — Maison SHÉA, haute parfumerie de niche, et Maison ÉCLORÉE, soin naturel au
        karité et au moringa
      </h1>
      <script
        type="application/ld+json"
        // Donnée statique et fiable (constante ci-dessus) — pas d'entrée
        // utilisateur, dangerouslySetInnerHTML est sûr ici.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ORGANISATION_JSON_LD) }}
      />

      <PortailDeuxPortes />
      {/* Le hero deux-portes a déjà son propre mouvement (expansion au
          survol) — seules les trois sections suivantes, statiques jusqu'ici,
          reçoivent la révélation douce au défilement (Vague 4). */}
      <RevealOnScroll>
        <ManifesteBandeau />
      </RevealOnScroll>
      <RevealOnScroll>
        <EditionsSignatures />
      </RevealOnScroll>
      <RevealOnScroll>
        <Correspondances />
      </RevealOnScroll>
    </>
  );
}

/* ────────────────────────────────────────────────────────────────────────
 * Section 1 — Hero deux portes
 * ──────────────────────────────────────────────────────────────────────── */

function PortailDeuxPortes() {
  return (
    <section
      aria-label="Choisir sa maison"
      className="group/doors relative flex min-h-[calc(100vh-5rem)] w-full flex-col overflow-hidden lg:flex-row"
    >
      {/* Emblème flottant central — décoratif, masqué sous md */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-8 z-30 hidden -translate-x-1/2 flex-col items-center md:flex lg:top-1/2 lg:-translate-y-1/2"
      >
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-ivoire-bouye/90 p-3 shadow-ambient backdrop-blur-md">
          <IconeEmblemeKarite className="h-full w-full text-encre-baobab" />
        </div>
        <div className="mt-2 bg-ivoire-bouye/90 px-4 py-1 shadow-ambient backdrop-blur-sm">
          <span className="font-interface text-caption-meta uppercase tracking-[0.25em] text-encre-baobab">
            Paris &amp; Dakar
          </span>
        </div>
      </div>

      {/* Porte SHÉA — nocturne, terre cuite */}
      <div
        data-door="shea"
        className={cn(
          "group/shea relative flex min-h-[640px] flex-1 flex-col justify-between overflow-hidden bg-encre-baobab p-space-lg text-ivoire-bouye",
          "transition-all duration-700 ease-out hover:flex-[1.12]",
          "sm:p-space-xl lg:min-h-full lg:p-space-2xl",
          "group-has-[[data-door=ecloree]:hover]/doors:grayscale group-has-[[data-door=ecloree]:hover]/doors:opacity-90",
        )}
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-gradient-to-b from-terre-de-dakar/40 via-encre-baobab to-encre-baobab opacity-90"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-20 -right-20 h-96 w-96 rounded-full bg-ocre-solaire/10 blur-3xl"
        />

        <div className="relative z-10 flex items-center justify-between">
          <span className="flex items-center gap-space-xs text-or-karite">
            <IconeCrepuscule className="h-[18px] w-[18px]" />
            <span className="font-interface text-caption-meta uppercase tracking-[0.2em]">
              Nocturne &amp; Solaire
            </span>
          </span>
          <span className="font-label-tabular text-label-tabular tracking-widest text-or-karite/80">
            Vol. 01
          </span>
        </div>

        <div className="relative z-10 my-auto flex flex-col items-center py-space-md">
          <div className="relative aspect-[3/4] w-full max-w-[280px] p-space-xs transition-transform duration-700 ease-out group-hover/shea:scale-[1.02] sm:max-w-[320px]">
            <div
              aria-hidden="true"
              className="absolute inset-x-4 -bottom-3 h-8 rounded-full bg-encre-baobab/60 blur-md"
            />
            <Image
              src="/images/flacon-parfum-ambre.png"
              alt="Flacon de la Maison SHÉA sur plinthe d'argile sous lumière rasante"
              fill
              priority
              sizes="(min-width: 1024px) 320px, 60vw"
              className="object-cover shadow-2xl"
            />
            <div className="absolute inset-x-2 bottom-2 flex items-center justify-between bg-encre-baobab/70 px-space-sm py-space-xxs text-or-karite backdrop-blur-md">
              <span className="font-interface text-caption-meta tracking-wider">
                Flacon Géométrique 100 ml
              </span>
              <span className="font-label-tabular text-label-tabular">φ 1.618</span>
            </div>
          </div>
        </div>

        <div className="relative z-10 max-w-[50ch] space-y-space-sm">
          <div>
            <span className="mb-space-xxs block font-interface text-caption-meta uppercase tracking-[0.2em] text-or-karite">
              Maison de parfum — le voyage
            </span>
            <h2 className="font-display text-display-hero-mobile leading-none tracking-tight text-ivoire-bouye lg:text-display-hero">
              SHÉA
            </h2>
          </div>
          <p className="font-interface text-body-reading leading-relaxed text-sable/90">
            L&apos;art de l&apos;escale et des matières rares du Sahel. Eaux de parfum nocturnes
            sculptées à Paris selon la proportion d&apos;or, nourries d&apos;absolus solaires et de
            résines sacrées.
          </p>
          <div className="flex items-center gap-space-md pt-space-xs">
            <Link
              href="/shea"
              className="inline-flex items-center justify-center gap-space-xs bg-terre-de-dakar px-space-xl py-space-md font-interface text-body-ui tracking-wider text-ivoire-bouye shadow-ambient transition-colors duration-300 ease-out hover:bg-ocre-solaire focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-or-karite focus-visible:ring-offset-2 focus-visible:ring-offset-encre-baobab"
            >
              Entrer dans la Maison SHÉA
              <IconeFleche className="h-[18px] w-[18px]" />
            </Link>
          </div>
        </div>
      </div>

      {/* Porte ÉCLORÉE — diurne, botanique */}
      <div
        data-door="ecloree"
        className={cn(
          "group/ecloree relative flex min-h-[640px] flex-1 flex-col justify-between overflow-hidden bg-surface-container-low p-space-lg text-on-surface",
          "transition-all duration-700 ease-out hover:flex-[1.12]",
          "sm:p-space-xl lg:min-h-full lg:p-space-2xl",
          "group-has-[[data-door=shea]:hover]/doors:grayscale group-has-[[data-door=shea]:hover]/doors:opacity-90",
        )}
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-gradient-to-b from-surface-container-lowest via-surface-container-low to-sable/30"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-20 -top-20 h-96 w-96 rounded-full bg-sauge-claire/15 blur-3xl"
        />

        <div className="relative z-10 flex items-center justify-between">
          <span className="flex items-center gap-space-xs text-vert-moringa">
            <IconeFeuille className="h-[18px] w-[18px]" />
            <span className="font-interface text-caption-meta uppercase tracking-[0.2em]">
              Botanique Fondatrice
            </span>
          </span>
          <span className="font-label-tabular text-label-tabular tracking-widest text-vert-moringa/80">
            Vol. 02
          </span>
        </div>

        <div className="relative z-10 my-auto flex flex-col items-center py-space-md">
          <div className="relative aspect-[3/4] w-full max-w-[280px] p-space-xs transition-transform duration-700 ease-out group-hover/ecloree:scale-[1.02] sm:max-w-[320px]">
            <div
              aria-hidden="true"
              className="absolute inset-x-4 -bottom-3 h-8 rounded-full bg-on-surface/10 blur-md"
            />
            <Image
              src="/images/pot-cosmetique-verre-depoli.png"
              alt="Pot de soin de la Maison ÉCLORÉE sur socle minéral, entouré de noix de karité et de feuilles de moringa"
              fill
              priority
              sizes="(min-width: 1024px) 320px, 60vw"
              className="object-cover shadow-xl"
            />
            <div className="absolute inset-x-2 bottom-2 flex items-center justify-between bg-surface/85 px-space-sm py-space-xxs text-vert-moringa backdrop-blur-md">
              <span className="font-interface text-caption-meta tracking-wider">
                Baume Nutritif 60 g
              </span>
              <span className="font-label-tabular text-label-tabular">100 % Organique</span>
            </div>
          </div>
        </div>

        <div className="relative z-10 max-w-[50ch] space-y-space-sm">
          <div>
            <span className="mb-space-xxs block font-interface text-caption-meta uppercase tracking-[0.2em] text-vert-moringa">
              Body care — le rituel
            </span>
            <h2 className="font-display text-display-hero-mobile leading-none tracking-tight text-encre-baobab lg:text-display-hero">
              ÉCLORÉE
            </h2>
          </div>
          <p className="font-interface text-body-reading leading-relaxed text-on-surface-variant">
            L&apos;intelligence végétale du karité sauvage non raffiné et du moringa
            d&apos;exception. Rituels d&apos;onction sensoriels pour régénérer la trame cutanée en
            harmonie naturelle.
          </p>
          <div className="flex items-center gap-space-md pt-space-xs">
            <Link
              href="/ecloree"
              // bg-success, pas bg-vert-moringa : le vert brut ne fait que
              // 4.1:1 sur ivoire-bouye, sous les 4.5:1 requis (trouvé par
              // e2e/portail.spec.ts) — bg-success EST la même teinte
              // assombrie par color-mix déjà utilisée ailleurs pour ce
              // problème exact (voir app/design-tokens.css, --color-success).
              className="inline-flex items-center justify-center gap-space-xs bg-success px-space-xl py-space-md font-interface text-body-ui tracking-wider text-ivoire-bouye shadow-ambient transition-colors duration-300 ease-out hover:bg-encre-baobab focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-or-karite focus-visible:ring-offset-2 focus-visible:ring-offset-surface-container-low"
            >
              Découvrir la Maison ÉCLORÉE
              <IconeFleche className="h-[18px] w-[18px]" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────────────────────────────────
 * Section 2 — Bandeau manifeste + 3 piliers
 * ──────────────────────────────────────────────────────────────────────── */

function ManifesteBandeau() {
  return (
    <section className="relative w-full overflow-hidden bg-surface-container px-space-lg py-space-3xl lg:px-space-2xl">
      <svg
        aria-hidden="true"
        viewBox="0 0 200 200"
        fill="currentColor"
        className="pointer-events-none absolute right-0 top-1/2 h-[600px] w-[600px] -translate-y-1/2 text-encre-baobab opacity-5"
      >
        <path d="M100 10 C60 50 40 90 40 140 C40 173.1 66.9 200 100 200 C133.1 200 160 173.1 160 140 C160 90 140 50 100 10 Z M100 35 C130 70 145 105 145 140 C145 164.8 124.8 185 100 185 C75.2 185 55 164.8 55 140 C55 105 70 70 100 35 Z" />
        <line x1="100" y1="35" x2="100" y2="185" stroke="currentColor" strokeWidth="1.5" />
      </svg>

      <div className="relative mx-auto max-w-desktop-max space-y-space-2xl">
        <div className="mx-auto reading-max space-y-space-md text-center">
          <span className="block font-interface text-caption-meta uppercase tracking-[0.25em] text-or-karite">
            Le Manifeste du Groupe
          </span>
          <h2 className="font-display text-headline-lg-mobile leading-tight text-encre-baobab lg:text-headline-lg">
            Deux maisons, un seul arbre.
          </h2>
          <p className="font-interface text-body-reading leading-relaxed text-on-surface-variant">
            Née entre les terres solaires du Sénégal et les ateliers parisiens de haute
            formulation, LA PARADOXA réunit la parfumerie de voyage et la botanique
            d&apos;exception sous l&apos;égide d&apos;un arbre sacré : le karité (
            <em>Vitellaria paradoxa</em>).
          </p>
        </div>

        <div className="grid grid-cols-1 gap-space-lg md:grid-cols-3 lg:gap-space-xl">
          <Pilier
            numero="01"
            icone={<IconeArbre className="h-[22px] w-[22px]" />}
            titre="L'Arbre Sacré"
            accentClassName="text-terre-de-dakar"
            tag="Filière traçable"
            tagIcone={<IconeCoche className="h-[14px] w-[14px]" />}
          >
            Sourcing direct auprès de coopératives féminines au Sahel. Nous sanctuarisons les
            spécimens centenaires de karité et assurons une rétribution équitable sans
            intermédiaire.
          </Pilier>
          <Pilier
            numero="02"
            icone={<IconeCompas className="h-[22px] w-[22px]" />}
            titre="La Règle d'Or (φ)"
            accentClassName="text-or-karite"
            tag="Harmonie géométrique"
            tagIcone={<IconeBalance className="h-[14px] w-[14px]" />}
          >
            Formulations et pyramides olfactives composées selon les proportions harmoniques du
            nombre d&apos;or : 19 % en notes de tête, 31 % en cœur vibrant, et 50 % de profondeur
            d&apos;enracinement.
          </Pilier>
          <Pilier
            numero="03"
            icone={<IconeFiole className="h-[22px] w-[22px]" />}
            titre="L'Atelier Vivant"
            accentClassName="text-vert-moringa"
            tag="Laboratoire certifié"
            tagIcone={<IconeFiole className="h-[14px] w-[14px]" />}
          >
            Une chaîne ininterrompue de la cueillette sauvage au flacon numéroté. Pressage à froid
            traditionnel sous le soleil de Dakar, allié à la haute technologie cosmétique
            française.
          </Pilier>
        </div>
      </div>
    </section>
  );
}

function Pilier({
  numero,
  icone,
  titre,
  children,
  tag,
  tagIcone,
  accentClassName,
}: {
  numero: string;
  icone: ReactNode;
  titre: string;
  children: ReactNode;
  tag: string;
  tagIcone: ReactNode;
  accentClassName: string;
}) {
  return (
    <Card className="flex flex-col justify-between gap-space-md border-0 p-space-xl shadow-ambient transition-shadow duration-300 ease-out hover:shadow-lg">
      <div className="space-y-space-sm">
        <div className="flex items-center justify-between">
          <span className="font-display text-headline-sm text-or-karite">{numero}</span>
          <span className="text-or-karite">{icone}</span>
        </div>
        <h3 className="font-display text-title-editorial text-encre-baobab">{titre}</h3>
        <p className="font-interface text-body-ui leading-relaxed text-on-surface-variant">
          {children}
        </p>
      </div>
      <div
        className={cn(
          "flex items-center gap-space-xs pt-space-sm font-interface text-caption-meta uppercase tracking-wider",
          accentClassName,
        )}
      >
        <span>{tag}</span>
        {tagIcone}
      </div>
    </Card>
  );
}

/* ────────────────────────────────────────────────────────────────────────
 * Section 3 — Coffrets croisés
 * ──────────────────────────────────────────────────────────────────────── */

function EditionsSignatures() {
  return (
    <section className="w-full bg-ivoire-bouye px-space-lg py-space-3xl lg:px-space-2xl">
      <div className="mx-auto max-w-desktop-max space-y-space-2xl">
        <div className="flex flex-col justify-between gap-space-md md:flex-row md:items-end">
          <div className="space-y-space-xxs">
            <span className="font-interface text-caption-meta uppercase tracking-[0.2em] text-or-karite">
              Initiations &amp; Dialogues
            </span>
            <h2 className="font-display text-headline-lg-mobile text-encre-baobab lg:text-headline-lg">
              Les Éditions Signatures
            </h2>
          </div>
          <p className="max-w-sm font-interface text-body-ui text-on-surface-variant">
            Pour une première immersion sensorielle, nos coffrets croisés invitent à dialoguer
            avec les deux essences de notre terroir.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-space-xl lg:grid-cols-2">
          <CoffretCard
            href="/shea/coffret-decouverte"
            image="/images/flatlay-coffret-kraft-or.png"
            imageAlt="Coffret Découverte de la Maison SHÉA, cinq fioles de voyage dans un écrin kraft et or"
            etiquette="Parfum"
            etiquetteClassName="bg-encre-baobab/80 text-or-karite"
            surtitre="Édition limitée"
            surtitreClassName="text-terre-de-dakar"
            titre="Le Coffret Olfactif"
            description="Cinq fioles de voyage 10 ml encapsulant la poussière d'or, la vanille de savane et le cuir d'ébène."
            prix="110 €"
            lienClassName="text-encre-baobab hover:text-terre-de-dakar"
          />
          <CoffretCard
            href="/ecloree/rituel-tete"
            image="/images/banniere-rituel-capillaire.png"
            imageAlt="Rituel botanique de la Maison ÉCLORÉE, sérum au moringa et accessoires de soin"
            etiquette="Soin"
            etiquetteClassName="bg-vert-moringa/80 text-ivoire-bouye"
            surtitre="Rituel essentiel"
            surtitreClassName="text-vert-moringa"
            titre="Le Triptyque Botanique"
            description="L'onction d'or pur, le sérum aux graines de moringa pressées et l'exfoliant fin à la pulpe de baobab."
            prix="145 €"
            lienClassName="text-encre-baobab hover:text-vert-moringa"
          />
        </div>
      </div>
    </section>
  );
}

function CoffretCard({
  href,
  image,
  imageAlt,
  etiquette,
  etiquetteClassName,
  surtitre,
  surtitreClassName,
  titre,
  description,
  prix,
  lienClassName,
}: {
  href: string;
  image: string;
  imageAlt: string;
  etiquette: string;
  etiquetteClassName: string;
  surtitre: string;
  surtitreClassName: string;
  titre: string;
  description: string;
  prix: string;
  lienClassName: string;
}) {
  return (
    <Card className="group flex flex-col items-center gap-space-lg border-0 bg-surface-container-low p-space-xl shadow-ambient sm:flex-row">
      <div className="relative aspect-square w-full overflow-hidden sm:w-1/2">
        <Image
          src={image}
          alt={imageAlt}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 40vw, 90vw"
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        />
        <span
          className={cn(
            "absolute left-3 top-3 px-2 py-0.5 font-interface text-caption-meta uppercase",
            etiquetteClassName,
          )}
        >
          {etiquette}
        </span>
      </div>
      <div className="w-full space-y-space-sm sm:w-1/2">
        <span className={cn("font-label-tabular text-label-tabular font-semibold", surtitreClassName)}>
          {surtitre}
        </span>
        <h3 className="font-display text-headline-sm text-encre-baobab">{titre}</h3>
        <p className="font-interface text-body-ui leading-relaxed text-on-surface-variant">
          {description}
        </p>
        <div className="flex items-center justify-between pt-space-xs">
          <span className="font-label-tabular text-label-tabular font-medium text-encre-baobab">
            {prix}
          </span>
          <Link
            href={href}
            className={cn(
              "flex items-center gap-space-xxs font-interface text-body-ui tracking-wider transition-colors duration-300 ease-out",
              lienClassName,
            )}
          >
            Découvrir
            <IconeFleche className="h-[16px] w-[16px]" />
          </Link>
        </div>
      </div>
    </Card>
  );
}

/* ────────────────────────────────────────────────────────────────────────
 * Section 4 — Newsletter
 * ──────────────────────────────────────────────────────────────────────── */

function Correspondances() {
  return (
    <section className="relative w-full overflow-hidden bg-encre-baobab px-space-lg py-space-3xl text-ivoire-bouye lg:px-space-2xl">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 left-0 h-80 w-80 rounded-full bg-terre-de-dakar/10 blur-3xl"
      />
      <div className="relative z-10 mx-auto reading-max space-y-space-lg text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-or-karite/40 p-2 text-or-karite">
          <IconeEnveloppe className="h-5 w-5" />
        </div>
        <div className="space-y-space-xs">
          <span className="block font-interface text-caption-meta uppercase tracking-[0.25em] text-or-karite">
            Épistolaire
          </span>
          <h2 className="font-display text-headline-lg-mobile leading-tight text-ivoire-bouye lg:text-headline-lg">
            Les Correspondances du Karité
          </h2>
        </div>
        <p className="font-interface text-body-reading leading-relaxed text-sable">
          Chaque solstice et équinoxe, nous publions nos carnets de récolte au Sahel, les
          nouvelles formulations secrètes et les invitations exclusives aux ventes privées de nos
          deux maisons.
        </p>
        <NewsletterForm action={sInscrireALaNewsletter} />
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────────────────────────────────
 * Icônes — SVG dessinées à la main (même convention que app/(vitrine)/layout.tsx :
 * pas de dépendance Material Symbols, cf. IconeRecherche/IconeCompte/IconePanier).
 * ──────────────────────────────────────────────────────────────────────── */

function IconeEmblemeKarite({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <path
        d="M12 2C8 6 5 10 5 14a7 7 0 0 0 14 0c0-4-3-8-7-12Z"
        stroke="currentColor"
        strokeWidth="1.4"
      />
      <path d="M12 6v15" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}

function IconeCrepuscule({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <circle cx="12" cy="13" r="4.5" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M12 3.5v2M5.5 6.5l1.4 1.4M18.5 6.5l-1.4 1.4M3 20h18"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconeFeuille({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <path
        d="M20 4C10 4 4 10 4 18v2h2c8 0 14-6 14-16Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="M7 19c3-6 7-9 12-11" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}

function IconeArbre({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <path
        d="M12 3c-3 3-5 6-5 9a5 5 0 0 0 10 0c0-3-2-6-5-9Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <path d="M12 12v9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

function IconeCompas({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <circle cx="9" cy="9" r="5.5" stroke="currentColor" strokeWidth="1.3" />
      <circle cx="14.5" cy="14.5" r="3.2" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  );
}

function IconeFiole({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <path
        d="M10 3h4M10.5 3v5.5L6 16a2.5 2.5 0 0 0 2.2 3.7h7.6A2.5 2.5 0 0 0 18 16l-4.5-7.5V3"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M8 14h8" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

function IconeCoche({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.3" />
      <path d="M8.5 12.3l2.4 2.4 4.6-5.4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconeBalance({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <path d="M12 3v18M6 8h12M6 8l-3 6h6l-3-6ZM18 8l-3 6h6l-3-6Z" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconeFleche({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <path d="M4 12h16M13 5l7 7-7 7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconeEnveloppe({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <rect x="3" y="5.5" width="18" height="13" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
      <path d="m3.5 6.5 8.5 7 8.5-7" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
