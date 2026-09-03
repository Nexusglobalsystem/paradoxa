import Link from "next/link";
import type { ReactNode } from "react";

/**
 * Chrome partagé par tout /laboratoire : fil d'Ariane "Console Maître" (voir
 * laboratoire_biblioth_que_de_mati_res_premi_res/code.html, en-tête) et nav
 * courte vers les trois ateliers. Le garde-fou session + rôle admin vit déjà
 * dans (protected)/layout.tsx, ce layout ne fait que la mise en page.
 */
export default function LaboratoireLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-encre-baobab">
      <header className="border-b border-or-karite/20 bg-encre-baobab px-space-lg py-space-md lg:px-space-2xl">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-space-sm">
          <div className="flex items-center gap-space-xs font-interface text-caption-meta tracking-wide text-or-karite/80">
            <span>Console Maître</span>
            <span aria-hidden="true" className="text-sable/40">
              /
            </span>
            <span className="text-ivoire-bouye">Laboratoire &amp; Formulations</span>
          </div>
          <nav className="flex flex-wrap items-center gap-space-md" aria-label="Sections du laboratoire">
            <Link
              href="/laboratoire/matieres"
              className="font-interface text-body-ui text-sable/80 transition-colors duration-300 ease-out hover:text-or-karite"
            >
              Bibliothèque de matières
            </Link>
            <Link
              href="/laboratoire/parfum"
              className="font-interface text-body-ui text-sable/80 transition-colors duration-300 ease-out hover:text-or-karite"
            >
              Composeur de parfum
            </Link>
            <Link
              href="/laboratoire/cosmetique"
              className="font-interface text-body-ui text-sable/80 transition-colors duration-300 ease-out hover:text-or-karite"
            >
              Composeur cosmétique
            </Link>
          </nav>
        </div>
      </header>
      <div className="bg-ivoire-bouye">{children}</div>
    </div>
  );
}
