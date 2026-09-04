import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { CATEGORIE_LABEL, getArticleBySlug, getArticlesLies, ARTICLES } from "../articles";

/**
 * Écran 13 — Article. Adapté de
 * /stitch_la_paradoxa/article_l_aube_sur_le_ferlo_la_paradoxa/code.html
 * (hero plein cadre, colonne reading-max, lettrine, pull-quotes, articles
 * liés). La barre de progression de lecture animée au scroll de la maquette
 * est omise : elle exige du JS client pur decoratif, hors périmètre d'un
 * Server Component et non demandée par le brief de Vague 2.
 */
interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return ARTICLES.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) {
    return { title: "Article introuvable — LA PARADOXA" };
  }

  return {
    title: `${article.titre} — Le Journal LA PARADOXA`,
    description: article.extrait,
  };
}

export default async function ArticleJournalPage({ params }: PageProps) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const articlesLies = getArticlesLies(article.slug, 3);
  const [premierBloc, ...resteBlocs] = article.contenu;

  return (
    <div className="flex flex-col">
      {/* Hero pleine largeur */}
      <section className="relative flex h-[70vh] min-h-[520px] max-h-[860px] w-full flex-col justify-end overflow-hidden bg-encre-baobab">
        <Image
          src={article.image}
          alt={article.imageAlt}
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-encre-baobab via-encre-baobab/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-encre-baobab/70 via-transparent to-encre-baobab/30" />
        <div className="relative z-10 mx-auto w-full max-w-desktop-max px-space-lg pb-space-2xl lg:px-space-2xl lg:pb-space-3xl">
          <div className="max-w-[850px] space-y-space-md">
            <div className="flex flex-wrap items-center gap-space-sm text-ivoire-bouye/80">
              <span className="bg-encre-baobab/70 px-space-xs py-0.5 font-interface text-caption-meta uppercase tracking-[0.25em] text-or-karite backdrop-blur-sm">
                {CATEGORIE_LABEL[article.categorie]}
              </span>
              <span className="text-caption-meta text-or-karite/60" aria-hidden="true">
                •
              </span>
              <span className="font-interface text-caption-meta tracking-wider">{article.lieu}</span>
              <span className="text-caption-meta text-or-karite/60" aria-hidden="true">
                •
              </span>
              <span className="font-interface text-caption-meta tracking-wider">{article.dateLabel}</span>
            </div>
            <h1 className="text-balance font-display text-headline-lg font-light leading-[1.08] tracking-tight text-ivoire-bouye lg:text-display-hero">
              {article.titre}
            </h1>
            <div className="flex flex-col gap-space-md pt-space-sm text-ivoire-bouye/75 sm:flex-row sm:items-center sm:justify-between">
              <p className="reading-max font-display text-title-editorial font-light italic text-ivoire-bouye/90">
                {article.chapeau}
              </p>
              <div className="flex shrink-0 items-center gap-space-xs font-label-tabular text-label-tabular text-or-karite">
                <span>{article.tempsLectureMin} min de lecture</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Barre méta */}
      <div className="w-full bg-surface-container-low/70 py-space-md">
        <div className="mx-auto flex max-w-desktop-max flex-wrap items-center justify-between gap-space-md px-space-lg font-interface text-caption-meta text-on-surface-variant lg:px-space-2xl">
          <div className="flex flex-wrap items-center gap-space-md">
            <div className="flex items-center gap-space-xs">
              <span className="text-[11px] font-medium uppercase tracking-widest text-or-karite">
                Texte
              </span>
              <span className="text-body-ui font-medium text-encre-baobab">{article.auteur}</span>
            </div>
            <span className="text-or-karite/40" aria-hidden="true">
              /
            </span>
            <div className="flex items-center gap-space-xs">
              <span className="text-[11px] font-medium uppercase tracking-widest text-or-karite">
                Classification
              </span>
              <span className="text-body-ui font-medium text-encre-baobab">
                {CATEGORIE_LABEL[article.categorie]}
              </span>
            </div>
          </div>
          <Link
            href="/journal"
            className="text-on-surface-variant transition-colors duration-300 ease-out hover:text-terre-de-dakar"
          >
            ← Revenir au journal
          </Link>
        </div>
      </div>

      {/* Corps de l'article */}
      <main className="w-full px-space-lg py-space-3xl lg:px-space-2xl">
        <article className="reading-max mx-auto space-y-space-xl">
          {premierBloc.type === "paragraphe" ? (
            <p className="font-interface text-body-reading leading-[1.8] text-on-surface first-letter:float-left first-letter:mr-space-xs first-letter:font-display first-letter:text-display-hero first-letter:leading-none first-letter:text-terre-de-dakar">
              {premierBloc.texte}
            </p>
          ) : null}

          {resteBlocs.map((bloc, index) => {
            if (bloc.type === "paragraphe") {
              return (
                <p key={index} className="font-interface text-body-reading leading-[1.8] text-on-surface">
                  {bloc.texte}
                </p>
              );
            }
            if (bloc.type === "titre") {
              return (
                <h2
                  key={index}
                  className="pt-space-md font-display text-headline-lg font-light tracking-tight text-encre-baobab"
                >
                  {bloc.texte}
                </h2>
              );
            }
            return (
              <blockquote key={index} className="my-space-2xl bg-surface-container-low px-space-xl py-space-lg">
                <p className="font-display text-[24px] font-light italic leading-[1.4] text-terre-de-dakar lg:text-[28px]">
                  {bloc.texte}
                </p>
                <cite className="mt-space-sm block font-interface text-caption-meta uppercase not-italic tracking-[0.2em] text-on-surface-variant">
                  — {bloc.source}
                </cite>
              </blockquote>
            );
          })}

          {/* Signature autrice/auteur */}
          <div className="mt-space-3xl bg-surface-container p-space-xl shadow-ambient">
            <div className="flex flex-col items-center gap-space-lg sm:flex-row sm:items-start">
              <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-surface-container-high text-or-karite shadow-ambient sm:h-28 sm:w-28">
                <svg viewBox="0 0 24 24" className="h-10 w-10" fill="none" aria-hidden="true">
                  <circle cx="12" cy="8" r="3.5" stroke="currentColor" strokeWidth="1.4" />
                  <path
                    d="M4.5 20c1.6-3.6 5-5.5 7.5-5.5s5.9 1.9 7.5 5.5"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <div className="space-y-space-xs text-center sm:text-left">
                <div className="flex flex-col gap-space-xxs sm:flex-row sm:items-center sm:gap-space-sm">
                  <h4 className="font-display text-[20px] font-normal text-encre-baobab">{article.auteur}</h4>
                  <span className="hidden text-or-karite sm:inline" aria-hidden="true">
                    •
                  </span>
                  <span className="font-interface text-caption-meta uppercase tracking-widest text-or-karite">
                    {article.auteurRole}
                  </span>
                </div>
                <p className="font-interface text-body-ui leading-relaxed text-on-surface-variant">
                  {article.auteurBio}
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center justify-between gap-space-md pt-space-xl sm:flex-row">
            <Link
              href="/journal"
              className="bg-surface-container px-space-md py-space-xs font-interface text-body-ui text-encre-baobab transition-colors duration-300 ease-out hover:bg-sable/80"
            >
              ← Revenir au Journal
            </Link>
            <Link
              href="/manifeste"
              className="bg-terre-de-dakar px-space-md py-space-xs font-interface text-body-ui text-ivoire-bouye transition-colors duration-300 ease-out hover:bg-terre-de-dakar/90"
            >
              Lire le Manifeste du groupe
            </Link>
          </div>
        </article>
      </main>

      {/* Articles liés */}
      {articlesLies.length > 0 ? (
        <section className="w-full bg-surface-container py-space-3xl">
          <div className="mx-auto max-w-desktop-max space-y-space-2xl px-space-lg lg:px-space-2xl">
            <div className="flex flex-col gap-space-sm pb-space-lg md:flex-row md:items-end md:justify-between">
              <div className="space-y-space-xxs">
                <span className="block font-interface text-caption-meta uppercase tracking-[0.25em] text-or-karite">
                  Lectures complémentaires
                </span>
                <h2 className="font-display text-headline-lg font-light text-encre-baobab">
                  Poursuivre le voyage
                </h2>
              </div>
              <Link
                href="/journal"
                className="flex items-center gap-space-xxs pb-1 font-interface text-caption-meta uppercase tracking-widest text-terre-de-dakar transition-colors duration-300 ease-out hover:text-encre-baobab"
              >
                Tous les récits du journal <span aria-hidden="true">→</span>
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-space-xl md:grid-cols-3">
              {articlesLies.map((lie) => (
                <article
                  key={lie.slug}
                  className="group flex flex-col overflow-hidden bg-ivoire-bouye shadow-ambient transition-shadow duration-300 ease-out hover:shadow-md"
                >
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-surface-container">
                    <Image
                      src={lie.image}
                      alt={lie.imageAlt}
                      fill
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      sizes="(min-width: 768px) 33vw, 100vw"
                    />
                    <span className="absolute left-space-sm top-space-sm bg-encre-baobab/80 px-space-xs py-0.5 font-interface text-caption-meta uppercase tracking-widest text-ivoire-bouye">
                      {CATEGORIE_LABEL[lie.categorie]}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col justify-between space-y-space-md p-space-lg">
                    <div className="space-y-space-xs">
                      <div className="flex items-center gap-space-xs font-interface text-caption-meta text-on-surface-variant">
                        <span>{lie.lieu}</span>
                        <span aria-hidden="true">•</span>
                        <span>{lie.tempsLectureMin} min</span>
                      </div>
                      <h3 className="font-display text-[22px] font-light leading-snug text-encre-baobab transition-colors duration-300 ease-out group-hover:text-terre-de-dakar">
                        {lie.titre}
                      </h3>
                      <p className="line-clamp-3 font-interface text-body-ui text-on-surface-variant">
                        {lie.extrait}
                      </p>
                    </div>
                    <div className="flex items-center justify-between pt-space-sm font-interface text-caption-meta">
                      <span className="text-on-surface-variant">{lie.auteur}</span>
                      <Link
                        href={`/journal/${lie.slug}`}
                        className="inline-flex items-center gap-0.5 font-medium text-terre-de-dakar transition-transform duration-300 ease-out group-hover:translate-x-1"
                      >
                        Lire l&apos;essai <span aria-hidden="true">→</span>
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </div>
  );
}
