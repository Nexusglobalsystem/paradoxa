import Link from "next/link";
import type { ReactNode } from "react";

export interface LegalSection {
  id: string;
  numeral: string;
  title: string;
  content: ReactNode;
}

export interface LegalPageProps {
  eyebrow: string;
  title: string;
  intro: string;
  reference: string;
  sections: LegalSection[];
}

/**
 * Gabarit partagé par /mentions-legales, /cgv et /confidentialite (écran 23
 * de l'inventaire — un seul template pour les 3 routes, cf.
 * design/INVENTAIRE.md). Sommaire sticky en Server Component pur : ancres
 * natives, pas de scrollspy JS (règle CLAUDE.md n°3 — pas de "use client"
 * sans état ni interaction réelle).
 */
export function LegalPage({ eyebrow, title, intro, reference, sections }: LegalPageProps) {
  return (
    <div className="flex flex-col">
      <section className="w-full bg-surface-container-low px-space-lg py-space-2xl lg:px-space-2xl">
        <div className="mx-auto flex max-w-desktop-max flex-col gap-space-md">
          <span className="font-interface text-caption-meta uppercase tracking-[0.25em] text-terre-de-dakar">
            {eyebrow}
          </span>
          <h1 className="font-display text-headline-lg-mobile text-encre-baobab lg:text-headline-lg">
            {title}
          </h1>
          <p className="reading-max font-interface text-body-reading text-on-surface-variant">
            {intro}
          </p>
        </div>
      </section>

      <section className="w-full px-space-lg py-space-2xl lg:px-space-2xl">
        <div className="mx-auto grid max-w-desktop-max grid-cols-1 gap-space-2xl lg:grid-cols-12">
          {/* Sommaire, sticky sur desktop uniquement */}
          <aside className="hidden lg:col-span-4 lg:block">
            <nav aria-label="Sommaire" className="sticky top-28 space-y-space-md pr-space-md">
              <span className="block font-interface text-caption-meta uppercase tracking-[0.2em] text-or-karite">
                Sommaire
              </span>
              <ol className="flex flex-col gap-space-xs">
                {sections.map((s) => (
                  <li key={s.id}>
                    <a
                      href={`#${s.id}`}
                      className="flex items-start gap-space-sm py-space-xxs font-interface text-body-ui text-on-surface-variant transition-colors duration-300 ease-out hover:text-encre-baobab"
                    >
                      <span className="shrink-0 font-label-tabular text-label-tabular text-or-karite">
                        {s.numeral}
                      </span>
                      <span>{s.title}</span>
                    </a>
                  </li>
                ))}
              </ol>
              <div className="mt-space-lg rounded-lg bg-surface-container p-space-md">
                <span className="font-interface text-caption-meta uppercase tracking-widest text-or-karite">
                  Référence
                </span>
                <p className="mt-space-xxs font-label-tabular text-label-tabular text-encre-baobab">
                  {reference}
                </p>
              </div>
            </nav>
          </aside>

          {/* Colonne de lecture longue, bornée à 65ch (règle reading-max) */}
          <div className="reading-max space-y-space-2xl lg:col-span-8">
            {sections.map((s) => (
              <article key={s.id} id={s.id} className="scroll-mt-28 space-y-space-md">
                <div className="flex items-baseline gap-space-sm">
                  <span
                    className="font-display text-headline-lg text-or-karite"
                    aria-hidden="true"
                  >
                    {s.numeral}
                  </span>
                  <h2 className="font-display text-headline-md text-encre-baobab">{s.title}</h2>
                </div>
                <div className="space-y-space-md font-interface text-body-reading text-on-surface">
                  {s.content}
                </div>
              </article>
            ))}

            <div className="flex flex-col items-start justify-between gap-space-md border-t border-sable pt-space-xl sm:flex-row sm:items-center">
              <p className="font-interface text-caption-meta text-on-surface-variant">
                Direction Juridique — LA PARADOXA SAS
              </p>
              <Link
                href="/contact"
                className="font-interface text-caption-meta uppercase tracking-wider text-terre-de-dakar transition-colors duration-300 ease-out hover:text-encre-baobab"
              >
                Une question ? Contacter la conciergerie
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
