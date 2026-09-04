"use client";

import { useState } from "react";

import { Button, Field, Input } from "@/components/ui";

import { usePanier } from "../panier-provider";

/**
 * Écran 15 — Tunnel de commande (/commande). Deux étapes affichées en une
 * seule page scrollable (livraison, puis récapitulatif + paiement) plutôt
 * que des routes séparées : le panier client (localStorage) n'a rien à
 * gagner à être fragmenté sur plusieurs pages pour ce volume de champs, et
 * ça évite de sérialiser l'état livraison entre deux navigations. Étape
 * "confirmation" = redirection réelle vers Stripe Checkout (hébergé), pas
 * une troisième étape de cette page — voir .claude/agents/api-paiement.md,
 * "Stripe Checkout hébergé : aucune donnée de carte ne touche notre
 * infrastructure."
 *
 * Le prix affiché ici (via calculs.ts, partagé avec le serveur) reste un
 * cache d'affichage optimiste : POST /api/commande/creer-session (déjà
 * construit, testé) relit toujours produits.prix en base avant de créer la
 * session — CLAUDE.md règle n°4.
 */
function formatPrix(montant: number, devise: string): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: devise || "EUR",
    minimumFractionDigits: montant % 1 === 0 ? 0 : 2,
  }).format(montant);
}

interface FormulaireLivraison {
  nomComplet: string;
  email: string;
  telephone: string;
  adresseLigne1: string;
  adresseLigne2: string;
  codePostal: string;
  ville: string;
  pays: string;
}

const FORMULAIRE_VIDE: FormulaireLivraison = {
  nomComplet: "",
  email: "",
  telephone: "",
  adresseLigne1: "",
  adresseLigne2: "",
  codePostal: "",
  ville: "",
  pays: "FR",
};

export function TunnelCommande() {
  const { articles, sousTotal, fraisLivraison, total } = usePanier();
  const [livraison, setLivraison] = useState<FormulaireLivraison>(FORMULAIRE_VIDE);
  const [enCours, setEnCours] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);
  const devise = articles[0]?.devise ?? "EUR";

  function majChamp<K extends keyof FormulaireLivraison>(champ: K, valeur: string) {
    setLivraison((precedent) => ({ ...precedent, [champ]: valeur }));
  }

  async function payer() {
    setErreur(null);

    if (articles.length === 0) {
      setErreur("Votre panier est vide.");
      return;
    }

    setEnCours(true);
    try {
      const reponse = await fetch("/api/commande/creer-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          articles: articles.map((a) => ({ produitId: a.produitId, quantite: a.quantite })),
          livraison: {
            nomComplet: livraison.nomComplet,
            email: livraison.email,
            telephone: livraison.telephone || undefined,
            adresseLigne1: livraison.adresseLigne1,
            adresseLigne2: livraison.adresseLigne2 || undefined,
            codePostal: livraison.codePostal,
            ville: livraison.ville,
            pays: livraison.pays,
          },
        }),
      });

      const corps: { url?: string; erreur?: string; details?: string[] } = await reponse.json();

      if (!reponse.ok || !corps.url) {
        setErreur(corps.erreur ?? "Impossible de préparer le règlement pour le moment.");
        setEnCours(false);
        return;
      }

      window.location.href = corps.url;
    } catch {
      setErreur("Une erreur réseau est survenue. Réessayez dans un instant.");
      setEnCours(false);
    }
  }

  const formulaireValide =
    livraison.nomComplet.trim().length >= 2 &&
    /.+@.+\..+/.test(livraison.email) &&
    livraison.adresseLigne1.trim().length >= 3 &&
    livraison.codePostal.trim().length >= 2 &&
    livraison.ville.trim().length >= 1;

  return (
    <div data-maison="groupe" className="mx-auto max-w-desktop-max px-space-lg py-space-2xl lg:px-space-2xl">
      <div className="mb-space-xl flex items-center gap-space-sm font-interface text-caption-meta uppercase tracking-widest text-or-karite">
        <span className="text-encre-baobab">Livraison</span>
        <span aria-hidden="true">—</span>
        <span>Paiement sécurisé</span>
      </div>

      <div className="grid grid-cols-1 gap-space-xl lg:grid-cols-12 lg:items-start">
        {/* Colonne gauche : formulaire livraison */}
        <div className="flex flex-col gap-space-md lg:col-span-7">
          <h1 className="font-display text-headline-md text-encre-baobab">Coordonnées de livraison</h1>

          <Field id="nom-complet" label="Nom complet" required>
            <Input
              value={livraison.nomComplet}
              onChange={(e) => majChamp("nomComplet", e.target.value)}
              autoComplete="name"
              required
            />
          </Field>
          <div className="grid grid-cols-1 gap-space-md sm:grid-cols-2">
            <Field id="email" label="Adresse email" required>
              <Input
                type="email"
                value={livraison.email}
                onChange={(e) => majChamp("email", e.target.value)}
                autoComplete="email"
                required
              />
            </Field>
            <Field id="telephone" label="Téléphone" helperText="Optionnel">
              <Input
                type="tel"
                value={livraison.telephone}
                onChange={(e) => majChamp("telephone", e.target.value)}
                autoComplete="tel"
              />
            </Field>
          </div>
          <Field id="adresse-1" label="Adresse" required>
            <Input
              value={livraison.adresseLigne1}
              onChange={(e) => majChamp("adresseLigne1", e.target.value)}
              autoComplete="address-line1"
              required
            />
          </Field>
          <Field id="adresse-2" label="Complément d'adresse" helperText="Optionnel">
            <Input
              value={livraison.adresseLigne2}
              onChange={(e) => majChamp("adresseLigne2", e.target.value)}
              autoComplete="address-line2"
            />
          </Field>
          <div className="grid grid-cols-1 gap-space-md sm:grid-cols-[1fr_2fr]">
            <Field id="code-postal" label="Code postal" required>
              <Input
                value={livraison.codePostal}
                onChange={(e) => majChamp("codePostal", e.target.value)}
                autoComplete="postal-code"
                required
              />
            </Field>
            <Field id="ville" label="Ville" required>
              <Input
                value={livraison.ville}
                onChange={(e) => majChamp("ville", e.target.value)}
                autoComplete="address-level2"
                required
              />
            </Field>
          </div>

          {/* Wave / Orange Money : badges de réassurance uniquement, aucune
              implémentation dans cette vague — voir
              app/api/commande/creer-session/payment-provider.ts. */}
          <div className="mt-space-md flex flex-wrap items-center gap-space-sm border-t border-sable pt-space-md font-interface text-caption-meta text-on-surface-variant">
            <span>Réglez par</span>
            <span className="bg-surface-container px-space-xs py-0.5">Carte bancaire</span>
            <span className="bg-surface-container px-space-xs py-0.5">Apple Pay</span>
            <span className="bg-surface-container px-space-xs py-0.5 opacity-50" title="Bientôt disponible">
              Wave (UEMOA)
            </span>
            <span className="bg-surface-container px-space-xs py-0.5 opacity-50" title="Bientôt disponible">
              Orange Money
            </span>
          </div>
        </div>

        {/* Colonne droite : récapitulatif + paiement */}
        <div className="lg:sticky lg:top-28 lg:col-span-5">
          <div className="flex flex-col gap-space-md bg-surface-container p-space-lg">
            <h2 className="font-display text-title-editorial text-encre-baobab">Votre commande</h2>

            <div className="flex flex-col gap-space-xs divide-y divide-sable/60">
              {articles.map((article) => (
                <div key={article.produitId} className="flex items-center justify-between gap-space-md py-space-xs font-interface text-body-ui">
                  <span className="text-encre-baobab">
                    {article.nom} <span className="text-on-surface-variant">× {article.quantite}</span>
                  </span>
                  <span className="font-label-tabular text-label-tabular text-on-surface-variant">
                    {formatPrix(article.prixUnitaire * article.quantite, article.devise)}
                  </span>
                </div>
              ))}
            </div>

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

            {erreur ? (
              <p role="alert" className="font-interface text-caption-meta text-danger">
                {erreur}
              </p>
            ) : null}

            <Button
              type="button"
              variant="primary"
              size="lg"
              className="w-full"
              disabled={!formulaireValide || articles.length === 0 || enCours}
              onClick={payer}
            >
              {enCours ? "Préparation du paiement…" : `Payer ${formatPrix(total, devise)}`}
            </Button>

            <p className="font-interface text-caption-meta text-on-surface-variant">
              Livraison offerte dès 80 € · Retours sous 30 jours · Paiement sécurisé par Stripe
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
