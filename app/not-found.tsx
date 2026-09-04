import type { Metadata } from "next";
import Link from "next/link";

import VitrineLayout from "./(vitrine)/layout";

/**
 * Écran 24 (design/INVENTAIRE.md) : app/not-found.tsx est un fichier spécial
 * Next.js à la racine de app/, jamais dans un groupe de routes — aucun
 * layout ne lui est appliqué automatiquement. On importe et enveloppe donc
 * manuellement le chrome vitrine (header/footer) via le composant par
 * défaut de app/(vitrine)/layout.tsx, pour rester cohérent avec le reste du
 * site plutôt que de livrer une page nue. Fichier importé en lecture seule,
 * non modifié — hors périmètre de cet agent.
 */
export const metadata: Metadata = {
  title: "Cette escale n'existe pas — LA PARADOXA",
  description: "La page demandée n'existe pas ou n'est plus accessible.",
};

export default function NotFound() {
  return (
    <VitrineLayout>
      <div className="flex min-h-[calc(100vh-5rem)] w-full items-center justify-center bg-encre-baobab px-space-lg py-space-3xl text-ivoire-bouye lg:px-space-2xl">
        <div className="mx-auto flex max-w-2xl flex-col items-center gap-space-xl text-center">
          <div className="flex items-center gap-space-sm text-or-karite/80">
            <span className="h-px w-8 bg-or-karite/40" aria-hidden="true" />
            <span className="font-interface text-caption-meta uppercase tracking-[0.28em]">
              Écart de trajectoire
            </span>
            <span className="h-px w-8 bg-or-karite/40" aria-hidden="true" />
          </div>

          {/* Illustration simple : baobab au trait, SVG inline (pas de dépendance photo) */}
          <svg
            viewBox="0 0 240 220"
            className="h-48 w-48 text-or-karite drop-shadow-[0_2px_16px_rgba(217,178,106,0.3)] sm:h-56 sm:w-56"
            fill="none"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path d="M20 200 Q 120 197 220 200" strokeOpacity="0.35" strokeWidth="1" />
            <path
              d="M96 204 C 98 185 92 165 96 142 C 99 128 104 118 108 108 C 104 95 95 82 82 72 C 75 66 64 62 55 60"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
            />
            <path
              d="M144 204 C 142 185 148 165 144 142 C 141 128 136 118 132 108 C 136 95 145 82 158 72 C 165 66 176 62 185 60"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
            />
            <path
              d="M108 108 C 114 96 117 84 116 68 C 115 54 109 44 98 34 M116 68 C 122 55 129 46 138 36"
              strokeLinecap="round"
              strokeWidth="1.3"
            />
            <path d="M132 108 C 126 96 123 84 124 68" strokeLinecap="round" strokeWidth="1.1" />
            <path
              d="M98 34 C 92 28 84 25 78 24 M98 34 C 102 26 109 20 114 17"
              strokeLinecap="round"
              strokeWidth="0.9"
            />
            <path
              d="M138 36 C 146 29 154 26 162 25 M138 36 C 136 27 131 20 126 17"
              strokeLinecap="round"
              strokeWidth="0.9"
            />
            <circle cx="114" cy="17" r="1.6" fill="currentColor" />
            <circle cx="78" cy="24" r="1.3" fill="currentColor" />
            <circle cx="162" cy="25" r="1.3" fill="currentColor" />
            <circle cx="120" cy="100" r="1.4" fill="currentColor" opacity="0.9" />
          </svg>

          <div className="space-y-space-md">
            <h1 className="font-display text-headline-lg-mobile text-ivoire-bouye lg:text-headline-lg">
              Cette escale n&apos;existe pas.
            </h1>
            <p className="reading-max mx-auto font-interface text-body-reading text-sable">
              Le vent a effacé la piste, ou ce sentier ne figure sur aucun carnet de voyage de
              la Maison. Vérifiez l&apos;adresse ou reprenez la route depuis l&apos;accueil.
            </p>
          </div>

          <div className="flex w-full flex-col items-center gap-space-md sm:w-auto sm:flex-row">
            <Link
              href="/"
              className="flex w-full items-center justify-center gap-space-xs bg-or-karite px-space-xl py-space-md font-interface text-body-ui tracking-wide text-encre-baobab transition-colors duration-300 ease-out hover:bg-ocre-solaire sm:w-auto"
            >
              Retour à l&apos;accueil
            </Link>
            <Link
              href="/shea"
              className="flex w-full items-center justify-center gap-space-xs border border-or-karite/50 px-space-xl py-space-md font-interface text-body-ui tracking-wide text-ivoire-bouye transition-colors duration-300 ease-out hover:bg-ivoire-bouye/10 sm:w-auto"
            >
              Voir la collection
            </Link>
          </div>
        </div>
      </div>
    </VitrineLayout>
  );
}
