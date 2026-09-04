import Link from "next/link";
import type { ReactNode } from "react";

import { NavLink } from "./nav-link";
import { PanierBadge } from "./panier-badge";
import { PanierProvider } from "./panier-provider";

/**
 * Chrome partagé de toutes les pages publiques/éditoriales (header + footer,
 * fidèle à /stitch_la_paradoxa/portail_du_groupe_l_entr_e/code.html) — posé
 * une seule fois ici pour que les écrans de la Vague 2 n'aient chacun qu'à
 * construire leur contenu, jamais leur propre en-tête. data-maison="groupe"
 * par défaut (encre + or) ; une page SHÉA ou ÉCLORÉE peut se ré-envelopper
 * dans son propre data-maison pour son contenu sans affecter ce chrome.
 *
 * `<PanierProvider>` enveloppe toute la vitrine (Vague 3) : le panier doit
 * être ajoutable/visible depuis n'importe quelle fiche produit, pas
 * seulement /panier et /commande — un Context scopé à ces deux seules
 * routes aurait laissé le badge du header et les boutons "Ajouter au
 * panier" des fiches produit sans accès au même état. Level Server
 * Component conservé : PanierProvider est lui-même "use client" et ne fait
 * "descendre" la frontière client que sur ses propres descendants.
 */
export default function VitrineLayout({ children }: { children: ReactNode }) {
  return (
    <PanierProvider>
    <div data-maison="groupe" className="flex min-h-screen flex-col bg-ivoire-bouye">
      <header className="sticky top-0 z-50 w-full border-b border-sable bg-ivoire-bouye/95 backdrop-blur-md">
        <div className="mx-auto flex h-20 max-w-desktop-max items-center justify-between px-space-lg lg:px-space-2xl">
          <Link href="/" className="flex items-center gap-space-md">
            <span className="flex h-7 w-7 items-center justify-center rounded-full border border-or-karite/60">
              <svg viewBox="0 0 24 24" className="h-4 w-4 text-or-karite" fill="none" aria-hidden="true">
                <path
                  d="M12 2C8 6 5 10 5 14a7 7 0 0 0 14 0c0-4-3-8-7-12Z"
                  stroke="currentColor"
                  strokeWidth="1.4"
                />
                <path d="M12 6v15" stroke="currentColor" strokeWidth="1.4" />
              </svg>
            </span>
            <span className="font-display text-title-editorial uppercase tracking-[0.2em] text-encre-baobab">
              La Paradoxa
            </span>
          </Link>

          <nav className="hidden items-center gap-space-xl lg:flex" aria-label="Navigation principale">
            <NavLink href="/shea">Maison SHÉA</NavLink>
            <NavLink href="/ecloree">Maison ÉCLORÉE</NavLink>
            <NavLink href="/manifeste">Le Manifeste</NavLink>
            <NavLink href="/engagements">Engagements</NavLink>
            <NavLink href="/journal">Journal</NavLink>
          </nav>

          <div className="flex items-center gap-space-md lg:gap-space-lg">
            <Link
              href="/recherche"
              className="flex items-center gap-space-xxs font-interface text-caption-meta tracking-wider text-on-surface-variant transition-colors duration-300 ease-out hover:text-encre-baobab"
            >
              <IconeRecherche />
              <span className="hidden sm:inline">Recherche</span>
            </Link>
            <Link
              href="/compte"
              className="flex items-center gap-space-xxs font-interface text-caption-meta tracking-wider text-on-surface-variant transition-colors duration-300 ease-out hover:text-encre-baobab"
            >
              <IconeCompte />
              <span className="hidden sm:inline">Compte client</span>
            </Link>
            <PanierBadge />
          </div>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t border-sable bg-surface-container-low py-space-3xl">
        <div className="mx-auto max-w-desktop-max px-space-lg lg:px-space-2xl">
          <div className="grid grid-cols-1 gap-space-2xl border-b border-sable/60 pb-space-2xl md:grid-cols-4">
            <div className="space-y-space-md md:col-span-1">
              <div className="flex items-center gap-space-sm">
                <span className="flex h-6 w-6 items-center justify-center rounded-full border border-or-karite/60">
                  <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 text-or-karite" fill="none" aria-hidden="true">
                    <path
                      d="M12 2C8 6 5 10 5 14a7 7 0 0 0 14 0c0-4-3-8-7-12Z"
                      stroke="currentColor"
                      strokeWidth="1.4"
                    />
                  </svg>
                </span>
                <span className="font-display text-title-editorial uppercase tracking-[0.18em] text-encre-baobab">
                  La Paradoxa
                </span>
              </div>
              <p className="reading-max font-interface text-body-ui text-on-surface-variant">
                Convergence de la haute parfumerie nocturne et de la botanique d&apos;Afrique de
                l&apos;Ouest. Deux maisons d&apos;exception réunies sous une même exigence d&apos;art
                et de terroir.
              </p>
            </div>

            <FooterColonne titre="Les Maisons">
              <FooterLien href="/shea">Maison SHÉA — Parfums</FooterLien>
              <FooterLien href="/ecloree">Maison ÉCLORÉE — Botanique</FooterLien>
            </FooterColonne>

            <FooterColonne titre="La Philosophie">
              <FooterLien href="/manifeste">Le Manifeste Éthique</FooterLien>
              <FooterLien href="/engagements">Filières Karité &amp; Moringa</FooterLien>
              <FooterLien href="/journal">Le Journal Olfactif</FooterLien>
            </FooterColonne>

            <FooterColonne titre="Conciergerie">
              <span className="font-interface text-body-ui text-on-surface-variant">Paris — Dakar</span>
              <FooterLien href="/contact">Nous contacter</FooterLien>
              <span className="pt-space-xs font-caption-meta text-caption-meta text-on-surface-variant">
                Services personnalisés du lundi au samedi
              </span>
            </FooterColonne>
          </div>

          <div className="flex flex-col items-center justify-between gap-space-md pt-space-xl font-caption-meta text-caption-meta text-on-surface-variant md:flex-row">
            <p>© {new Date().getFullYear()} LA PARADOXA Groupe de Beauté. Tous droits réservés.</p>
            <div className="flex items-center gap-space-lg">
              <Link href="/mentions-legales" className="transition-colors duration-300 ease-out hover:text-encre-baobab">
                Mentions légales
              </Link>
              <Link href="/cgv" className="transition-colors duration-300 ease-out hover:text-encre-baobab">
                CGV
              </Link>
              <Link
                href="/confidentialite"
                className="transition-colors duration-300 ease-out hover:text-encre-baobab"
              >
                Confidentialité
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
    </PanierProvider>
  );
}

function FooterColonne({ titre, children }: { titre: string; children: ReactNode }) {
  return (
    <div className="space-y-space-sm">
      <span className="block font-caption-meta text-caption-meta uppercase tracking-widest text-or-karite">
        {titre}
      </span>
      <div className="flex flex-col gap-space-xs">{children}</div>
    </div>
  );
}

function FooterLien({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      className="font-interface text-body-ui text-on-surface-variant transition-colors duration-300 ease-out hover:text-encre-baobab"
    >
      {children}
    </Link>
  );
}

function IconeRecherche() {
  return (
    <svg viewBox="0 0 24 24" className="h-[17px] w-[17px] text-or-karite" fill="none" aria-hidden="true">
      <circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="1.6" />
      <path d="m20 20-4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function IconeCompte() {
  return (
    <svg viewBox="0 0 24 24" className="h-[17px] w-[17px] text-or-karite" fill="none" aria-hidden="true">
      <circle cx="12" cy="8" r="3.5" stroke="currentColor" strokeWidth="1.6" />
      <path d="M4.5 20c1.6-3.6 5-5.5 7.5-5.5s5.9 1.9 7.5 5.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}
