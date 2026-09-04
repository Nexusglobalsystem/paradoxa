"use client";

import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui";

import { usePanier } from "../panier-provider";

/**
 * Écran 14 — Panier (/panier). Client Component entier : dépend de
 * usePanier() (localStorage, pas de contenu server-renderable stable) —
 * cohérent avec la nature "optimiste" du panier (.claude/agents/frontend-commerce.md).
 * Pas de métadonnées statiques exportées ici pour cette raison (une page
 * "use client" ne peut pas exporter `metadata`) ; le titre d'onglet reste
 * celui hérité de app/layout.tsx, acceptable pour une page utilitaire non
 * indexée.
 */
function formatPrix(montant: number, devise: string): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: devise || "EUR",
    minimumFractionDigits: montant % 1 === 0 ? 0 : 2,
  }).format(montant);
}

export default function PanierPage() {
  const {
    articles,
    modifierQuantite,
    retirerArticle,
    sousTotal,
    fraisLivraison,
    total,
    restantAvantLivraisonOfferte,
    pret,
  } = usePanier();

  const devise = articles[0]?.devise ?? "EUR";

  if (pret && articles.length === 0) {
    return (
      <div className="mx-auto flex max-w-2xl flex-col items-center gap-space-lg px-space-lg py-space-3xl text-center">
        <svg viewBox="0 0 64 64" className="h-16 w-16 text-or-karite" fill="none" aria-hidden="true">
          <path d="M12 18h40l-4 30H16L12 18Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
          <path d="M22 18v-4a10 10 0 0 1 20 0v4" stroke="currentColor" strokeWidth="1.4" />
        </svg>
        <h1 className="font-display text-headline-md text-encre-baobab">
          Votre panier attend son premier voyage
        </h1>
        <p className="font-interface text-body-reading text-on-surface-variant">
          Composez votre escale SHÉA ou votre rituel ÉCLORÉE — chaque création vous attend.
        </p>
        <div className="flex flex-wrap justify-center gap-space-sm pt-space-sm">
          <Link href="/shea/collection">
            <Button type="button" variant="primary">
              Découvrir la collection SHÉA
            </Button>
          </Link>
          <Link href="/ecloree">
            <Button type="button" variant="outline">
              Explorer la Maison ÉCLORÉE
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div data-maison="groupe" className="mx-auto max-w-desktop-max px-space-lg py-space-2xl lg:px-space-2xl">
      <h1 className="font-display text-headline-lg text-encre-baobab">Votre panier</h1>
      <p className="mt-space-xxs font-interface text-body-ui text-on-surface-variant">
        {articles.length} création{articles.length > 1 ? "s" : ""} sélectionnée{articles.length > 1 ? "s" : ""}
      </p>

      <div className="mt-space-xl grid grid-cols-1 gap-space-xl lg:grid-cols-12 lg:items-start">
        {/* Colonne gauche : liste des articles */}
        <div className="flex flex-col divide-y divide-sable lg:col-span-8">
          {articles.map((article) => (
            <div key={article.produitId} className="flex gap-space-md py-space-lg first:pt-0">
              <div className="relative h-24 w-24 shrink-0 overflow-hidden bg-surface-container">
                <Image src={article.image} alt={article.nom} fill sizes="96px" className="object-cover" />
              </div>
              <div className="flex flex-1 flex-col justify-between">
                <div className="flex items-start justify-between gap-space-md">
                  <div>
                    <span className="font-interface text-caption-meta uppercase tracking-widest text-on-surface-variant">
                      Maison {article.maison === "shea" ? "SHÉA" : "ÉCLORÉE"}
                    </span>
                    <h2 className="font-display text-title-editorial text-encre-baobab">{article.nom}</h2>
                  </div>
                  <span className="font-label-tabular text-label-tabular text-encre-baobab">
                    {formatPrix(article.prixUnitaire * article.quantite, article.devise)}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-space-md pt-space-sm">
                  <div className="flex items-center gap-space-xs" role="group" aria-label={`Quantité pour ${article.nom}`}>
                    <button
                      type="button"
                      onClick={() => modifierQuantite(article.produitId, article.quantite - 1)}
                      className="flex h-7 w-7 items-center justify-center border border-outline-variant text-encre-baobab transition-colors duration-300 ease-out hover:border-encre-baobab"
                      aria-label="Diminuer la quantité"
                    >
                      −
                    </button>
                    <span className="w-6 text-center font-label-tabular text-label-tabular text-encre-baobab">
                      {article.quantite}
                    </span>
                    <button
                      type="button"
                      onClick={() => modifierQuantite(article.produitId, article.quantite + 1)}
                      className="flex h-7 w-7 items-center justify-center border border-outline-variant text-encre-baobab transition-colors duration-300 ease-out hover:border-encre-baobab"
                      aria-label="Augmenter la quantité"
                    >
                      +
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => retirerArticle(article.produitId)}
                    className="font-interface text-caption-meta text-on-surface-variant underline-offset-2 transition-colors duration-300 ease-out hover:text-danger hover:underline"
                  >
                    Retirer
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Colonne droite : résumé sticky */}
        <div className="lg:sticky lg:top-28 lg:col-span-4">
          <div className="flex flex-col gap-space-md bg-surface-container p-space-lg">
            <h2 className="font-display text-title-editorial text-encre-baobab">Résumé</h2>

            {restantAvantLivraisonOfferte > 0 ? (
              <div className="space-y-space-xxs">
                <p className="font-interface text-caption-meta text-on-surface-variant">
                  Plus que {formatPrix(restantAvantLivraisonOfferte, devise)} pour la livraison offerte
                </p>
                <div className="h-1.5 w-full overflow-hidden bg-surface-container-highest" role="img" aria-label="Progression vers la livraison offerte">
                  <div
                    className="h-full bg-or-karite transition-[width] duration-500 ease-out"
                    style={{ width: `${Math.min((sousTotal / (sousTotal + restantAvantLivraisonOfferte)) * 100, 100)}%` }}
                  />
                </div>
              </div>
            ) : (
              <p className="font-interface text-caption-meta text-vert-moringa">Livraison offerte ✓</p>
            )}

            <div className="flex flex-col gap-space-xs border-t border-sable pt-space-sm font-interface text-body-ui">
              <div className="flex items-center justify-between text-on-surface-variant">
                <span>Sous-total</span>
                <span className="font-label-tabular text-label-tabular">{formatPrix(sousTotal, devise)}</span>
              </div>
              <div className="flex items-center justify-between text-on-surface-variant">
                <span>Livraison</span>
                <span className="font-label-tabular text-label-tabular">
                  {fraisLivraison === 0 ? "Offerte" : formatPrix(fraisLivraison, devise)}
                </span>
              </div>
              <div className="flex items-center justify-between border-t border-sable pt-space-xs font-medium text-encre-baobab">
                <span>Total</span>
                <span className="font-label-tabular text-label-tabular text-headline-sm">
                  {formatPrix(total, devise)}
                </span>
              </div>
            </div>

            <Link href="/commande" className="pt-space-xs">
              <Button type="button" variant="primary" size="lg" className="w-full">
                Passer commande
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
