"use client";

import Link from "next/link";

import { usePanier } from "./panier-provider";

/**
 * Seule partie du header à dépendre du panier — extrait du reste du chrome
 * (Server Component) pour que `layout.tsx` n'ait besoin de "use client" que
 * sur ce fragment précis.
 */
export function PanierBadge() {
  const { nombreArticles } = usePanier();

  return (
    <Link
      href="/panier"
      aria-label={`Panier, ${nombreArticles} article${nombreArticles > 1 ? "s" : ""}`}
      className="flex items-center gap-space-xxs font-interface text-caption-meta tracking-wider text-on-surface-variant transition-colors duration-300 ease-out hover:text-encre-baobab"
    >
      <svg viewBox="0 0 24 24" className="h-[17px] w-[17px] text-or-karite" fill="none" aria-hidden="true">
        <path d="M6 8h12l-1 12H7L6 8Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
        <path d="M9 8V6a3 3 0 0 1 6 0v2" stroke="currentColor" strokeWidth="1.6" />
      </svg>
      <span className="hidden sm:inline" aria-hidden="true">Panier</span>
      {/* text-or-karite-strong : l'or brut ne fait que 1.7:1 sur ce fond
          clair (header ivoire-bouye) — voir app/design-tokens.css. */}
      <span className="text-label-tabular font-label-tabular text-or-karite-strong" aria-hidden="true">
        ({nombreArticles})
      </span>
    </Link>
  );
}
