import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { Badge } from "@/components/ui";

import { ARTICLES, CATEGORIE_LABEL, getArticleALaUne, getAutresArticles } from "./articles";

/**
 * Écran 12 — Journal, index. Adapté de
 * /stitch_la_paradoxa/journal_la_paradoxa/code.html : article à la une en
 * grand, grille 2 colonnes pour le reste, sidebar newsletter sur fond ocre.
 * Les données viennent du tableau statique ./articles.ts (voir son
 * commentaire d'en-tête) — pas de pagination réelle tant qu'il n'y a que 4
 * récits.
 */
export const metadata: Metadata = {
  title: "Le Journal — LA PARADOXA",
  description:
    "Récits d'expéditions sahéliennes, carnets de formulation et traités de sourcing entre Dakar et Paris — le journal du groupe LA PARADOXA.",
};

const CATEGORIES = Object.entries(CATEGORIE_LABEL) as [keyof typeof CATEGORIE_LABEL, string][];

export default function JournalPage() {
  const aLaUne = getArticleALaUne();
  const autres = getAutresArticles(aLaUne.slug);

  return (
    <div className="mx-auto w-full max-w-desktop-max space-y-space-2xl px-space-lg py-space-xl lg:space-y-space-3xl lg:px-space-2xl lg:py-space-2xl">
      {/* En-tête éditorial */}
      <header className="space-y-space-md border-b border-sable/50 pb-space-xl lg:space-y-space-lg">
        <div className="flex flex-wrap items-center justify-between gap-space-sm font-interface text-caption-meta uppercase tracking-[0.2em] text-or-karite">
          <div className="flex items-center gap-space-xs">
            <span className="h-1.5 w-1.5 rounded-full bg-or-karite" aria-hidden="true" />
            <span>Chroniques &amp; terroirs</span>
            <span className="mx-space-xxs text-sable" aria-hidden="true">
              /
            </span>
            <span className="text-on-surface-variant">Le Journal</span>
          </div>
          <span className="font-label-tabular text-label-tabular normal-case tracking-normal text-on-surface-variant/80">
            Dakar &amp; Paris · {ARTICLES.length} récits archivés
          </span>
        </div>

        <div className="grid grid-cols-1 items-end gap-space-md lg:grid-cols-12 lg:gap-space-2xl">
          <div className="space-y-space-xs lg:col-span-8">
            <h1 className="font-display text-headline-lg tracking-tight text-encre-baobab lg:text-display-hero">
              Écritures de la terre et du parfum
            </h1>
            <p className="reading-max font-interface text-body-reading leading-relaxed text-on-surface-variant">
              Récits d&apos;expéditions sahéliennes, carnets de formulation à Dakar et traités botaniques
              entre deux hémisphères.
            </p>
          </div>
          <div className="flex lg:col-span-4 lg:justify-end">
            <div className="inline-flex items-center gap-space-xs rounded-full bg-surface-container px-space-md py-space-xs font-interface text-caption-meta text-on-surface-variant">
              <span>Accès libre à toutes les chroniques</span>
            </div>
          </div>
        </div>

        {/* Taxonomie des catégories */}
        <nav aria-label="Catégories du journal" className="flex flex-wrap items-center gap-space-xs pt-space-md lg:gap-space-sm">
          <span className="rounded-full bg-encre-baobab px-space-md py-space-xs font-interface text-caption-meta tracking-wider text-ivoire-bouye shadow-ambient">
            Toutes les chroniques
          </span>
          {CATEGORIES.map(([, label]) => (
            <span
              key={label}
              className="rounded-full border border-sable/80 bg-surface-container-low px-space-md py-space-xs font-interface text-caption-meta tracking-wider text-on-surface"
            >
              {label}
            </span>
          ))}
        </nav>
      </header>

      {/* Article à la une */}
      <article className="overflow-hidden rounded-xl bg-surface-container-low shadow-ambient">
        <div className="grid min-h-[420px] grid-cols-1 lg:grid-cols-12">
          <div className="relative min-h-[280px] overflow-hidden bg-surface-container lg:col-span-7 lg:min-h-full">
            <Image
              src={aLaUne.image}
              alt={aLaUne.imageAlt}
              fill
              priority
              className="object-cover object-center"
              sizes="(min-width: 1024px) 55vw, 100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-encre-baobab/60 via-transparent to-transparent lg:hidden" />
            <div className="absolute left-space-md top-space-md rounded bg-ivoire-bouye/90 px-space-sm py-space-xxs font-interface text-caption-meta tracking-widest text-encre-baobab backdrop-blur-md">
              Chronique à la une
            </div>
          </div>
          <div className="flex flex-col justify-between space-y-space-lg bg-surface-container-low p-space-lg lg:col-span-5 lg:p-space-2xl">
            <div className="space-y-space-md">
              <div className="flex items-center gap-space-xs font-interface text-caption-meta uppercase tracking-widest text-or-karite">
                <span className="h-0.5 w-2 bg-or-karite" aria-hidden="true" />
                <span>{CATEGORIE_LABEL[aLaUne.categorie]} · Chronique totem</span>
              </div>
              <h2 className="font-display text-headline-md font-light leading-tight text-encre-baobab lg:text-headline-lg">
                {aLaUne.titre}
              </h2>
              <p className="reading-max font-interface text-body-reading leading-relaxed text-on-surface-variant">
                {aLaUne.chapeau}
              </p>
            </div>
            <div className="space-y-space-md border-t border-sable/60 pt-space-md">
              <div className="flex flex-wrap items-center justify-between gap-space-xs font-interface text-caption-meta text-on-surface-variant">
                <span>
                  Par {aLaUne.auteur} · {aLaUne.auteurRole}
                </span>
                <span>{aLaUne.tempsLectureMin} min de lecture</span>
              </div>
              <Link
                href={`/journal/${aLaUne.slug}`}
                className="group inline-flex items-center gap-space-xs font-label-tabular text-label-tabular tracking-wide text-terre-de-dakar transition-colors duration-300 ease-out hover:text-encre-baobab"
              >
                <span className="border-b border-terre-de-dakar/40 pb-0.5 group-hover:border-terre-de-dakar">
                  Lire la chronique complète
                </span>
                <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>
      </article>

      {/* Grille 2 colonnes + sidebar newsletter */}
      <div className="grid grid-cols-1 gap-space-xl lg:grid-cols-12 lg:gap-space-2xl">
        <section aria-label="Derniers articles" className="space-y-space-xl lg:col-span-8">
          <div className="flex items-center justify-between border-b border-sable/50 pb-space-xs">
            <h3 className="font-display text-title-editorial text-encre-baobab">
              Carnets d&apos;atelier &amp; découvertes
            </h3>
            <span className="font-interface text-caption-meta text-on-surface-variant">
              Classés par récence
            </span>
          </div>

          <div className="grid grid-cols-1 items-start gap-space-lg md:grid-cols-2 lg:gap-space-xl">
            {autres.map((article) => (
              <article
                key={article.slug}
                className="group flex h-full flex-col justify-between overflow-hidden rounded-lg bg-surface-container-low shadow-ambient transition-shadow duration-300 ease-out hover:shadow-md"
              >
                <div className="space-y-space-md">
                  <div className="relative aspect-[16/10] overflow-hidden bg-surface-container">
                    <Image
                      src={article.image}
                      alt={article.imageAlt}
                      fill
                      className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                      sizes="(min-width: 768px) 40vw, 100vw"
                    />
                    <span className="absolute bottom-space-xs left-space-xs rounded bg-encre-baobab/90 px-space-xs py-0.5 font-interface text-[11px] uppercase tracking-wider text-ivoire-bouye backdrop-blur-sm">
                      {CATEGORIE_LABEL[article.categorie]}
                    </span>
                  </div>
                  <div className="space-y-space-xs px-space-md pb-space-sm">
                    <div className="flex items-center justify-between font-interface text-caption-meta text-or-karite">
                      <Badge variant="outline" className="uppercase tracking-wider">
                        {CATEGORIE_LABEL[article.categorie]}
                      </Badge>
                      <span className="font-label-tabular text-on-surface-variant">
                        {article.tempsLectureMin} min
                      </span>
                    </div>
                    <h4 className="font-display text-headline-sm leading-snug text-encre-baobab transition-colors duration-300 ease-out group-hover:text-terre-de-dakar">
                      {article.titre}
                    </h4>
                    <p className="font-interface text-body-ui leading-relaxed text-on-surface-variant">
                      {article.extrait}
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between border-t border-sable/40 px-space-md pb-space-md pt-space-xs">
                  <span className="font-interface text-caption-meta text-on-surface-variant">
                    {article.lieu}
                  </span>
                  <Link
                    href={`/journal/${article.slug}`}
                    className="flex items-center gap-1 font-label-tabular text-caption-meta text-terre-de-dakar transition-transform duration-300 ease-out group-hover:translate-x-0.5"
                  >
                    Explorer <span aria-hidden="true">↗</span>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>

        <aside aria-label="Correspondance et archives" className="space-y-space-xl lg:col-span-4">
          {/* Newsletter — fond ocre. Formulaire décoratif, non câblé à un
              backend : la collecte réelle d'emails est hors du périmètre de
              cet agent (vitrine éditoriale statique). */}
          <div className="relative space-y-space-lg overflow-hidden rounded-xl bg-ocre-solaire p-space-lg text-ivoire-bouye shadow-ambient lg:p-space-xl">
            <div className="pointer-events-none absolute -bottom-8 -right-8 h-40 w-40 rounded-full bg-terre-de-dakar/20 blur-2xl" aria-hidden="true" />
            <div className="space-y-space-xs">
              <span className="block font-interface text-[11px] uppercase tracking-[0.2em] text-ivoire-bouye/80">
                Gazette épistolaire
              </span>
              <h3 className="font-display text-headline-md font-light leading-snug text-ivoire-bouye">
                Le cercle de correspondance
              </h3>
              <p className="pt-space-xxs font-interface text-body-ui leading-relaxed text-ivoire-bouye/90">
                Recevez à chaque nouveau quartier de lune un récit inédit de nos formulateurs et les
                invitations aux salons privés de Paris et Dakar.
              </p>
            </div>
            <form className="space-y-space-md">
              <div className="space-y-space-xxs">
                <label
                  htmlFor="journal-newsletter-email"
                  className="block font-interface text-caption-meta tracking-wider text-ivoire-bouye/90"
                >
                  Votre adresse de correspondance
                </label>
                <input
                  id="journal-newsletter-email"
                  type="email"
                  placeholder="nom@maison.com"
                  className="w-full border-b border-ivoire-bouye/70 bg-transparent pb-space-xs font-interface text-body-ui text-ivoire-bouye placeholder:text-ivoire-bouye/50 focus:border-ivoire-bouye focus:outline-none"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-encre-baobab py-space-sm text-center font-interface text-body-ui tracking-wider text-ivoire-bouye shadow-ambient transition-colors duration-300 ease-out hover:bg-encre-baobab/90"
              >
                Rejoindre le cercle
              </button>
            </form>
            <div className="flex items-center gap-space-xs border-t border-ivoire-bouye/20 pt-space-xs font-interface text-[11px] text-ivoire-bouye/70">
              <span>Édition confidentielle · pas plus de deux lettres par mois.</span>
            </div>
          </div>

          <blockquote className="space-y-space-xs rounded-xl bg-surface-container p-space-lg text-on-surface-variant">
            <p className="font-display text-[15px] italic leading-relaxed text-encre-baobab">
              « La haute parfumerie n&apos;est pas un artifice de salon, mais la mémoire concentrée
              d&apos;une terre qui a bu la pluie et le soleil. »
            </p>
            <cite className="block pt-space-xs font-interface text-caption-meta not-italic text-on-surface-variant">
              — Extrait du Manifeste LA PARADOXA, Dakar
            </cite>
          </blockquote>
        </aside>
      </div>
    </div>
  );
}
