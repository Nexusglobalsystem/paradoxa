"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

export interface Onglet {
  id: string;
  label: string;
  contenu: React.ReactNode;
}

/**
 * Onglets Bienfaits / Ingrédients / Utilisation / Engagements (écran 10).
 * Aucune primitive Tabs n'existe encore dans components/ui — cette page en
 * a besoin, donc le composant vit ici plutôt que d'être ajouté prématurément
 * au design system partagé (hors périmètre de la Vague 3). Client Component
 * car l'état de l'onglet actif est requis (règle CLAUDE.md n°3).
 *
 * Pattern ARIA "tabs" standard (WAI-ARIA APG) : rôles tablist/tab/tabpanel,
 * navigation clavier flèches gauche/droite, un seul tab focusable à la fois.
 */
export function OngletsProduit({ onglets }: { onglets: Onglet[] }) {
  const [actifId, setActifId] = React.useState(onglets[0]?.id);
  const refsBoutons = React.useRef<Record<string, HTMLButtonElement | null>>({});

  function activer(id: string) {
    setActifId(id);
  }

  function onKeyDown(event: React.KeyboardEvent<HTMLButtonElement>, index: number) {
    if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") {
      return;
    }
    event.preventDefault();
    const direction = event.key === "ArrowRight" ? 1 : -1;
    const prochainIndex = (index + direction + onglets.length) % onglets.length;
    const prochain = onglets[prochainIndex];
    activer(prochain.id);
    refsBoutons.current[prochain.id]?.focus();
  }

  return (
    <div>
      <div
        role="tablist"
        aria-label="Informations sur le produit"
        className="flex flex-wrap gap-space-xs border-b border-sable"
      >
        {onglets.map((onglet, index) => {
          const selectionne = onglet.id === actifId;
          return (
            <button
              key={onglet.id}
              ref={(el) => {
                refsBoutons.current[onglet.id] = el;
              }}
              type="button"
              role="tab"
              id={`onglet-${onglet.id}`}
              aria-selected={selectionne}
              aria-controls={`panneau-${onglet.id}`}
              tabIndex={selectionne ? 0 : -1}
              onClick={() => activer(onglet.id)}
              onKeyDown={(event) => onKeyDown(event, index)}
              className={cn(
                "font-interface -mb-px px-space-md py-space-sm text-body-ui tracking-wide transition-colors duration-300 ease-out",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-maison-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface",
                selectionne
                  ? "border-b-2 border-maison-primary-strong font-medium text-maison-primary-strong"
                  : "border-b-2 border-transparent text-on-surface-variant hover:text-encre-baobab",
              )}
            >
              {onglet.label}
            </button>
          );
        })}
      </div>

      {onglets.map((onglet) => (
        <div
          key={onglet.id}
          role="tabpanel"
          id={`panneau-${onglet.id}`}
          aria-labelledby={`onglet-${onglet.id}`}
          hidden={onglet.id !== actifId}
          className="pt-space-lg"
        >
          {onglet.contenu}
        </div>
      ))}
    </div>
  );
}
