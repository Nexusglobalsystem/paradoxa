import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { Button } from "@/components/ui";
import { createServiceRoleClient } from "@/lib/supabase/service-role";

import { ViderPanierAuChargement } from "./vider-panier-au-chargement";

export const metadata: Metadata = {
  title: "Commande confirmée — LA PARADOXA",
  robots: { index: false },
};

interface PageProps {
  searchParams: Promise<{ session_id?: string }>;
}

/**
 * Écran 16 — Confirmation de commande. Lit `?session_id=` (posé par Stripe
 * dans success_url, voir app/api/commande/creer-session/route.ts) et
 * l'utilise comme jeton d'accès à CETTE commande précise via le client
 * service_role — jamais de policy RLS publique sur `commandes` (voir
 * supabase/migrations/20260904135542_commandes.sql, commentaire d'en-tête).
 * `session_id` absent ou introuvable → retour au panier plutôt qu'une page
 * d'erreur : ce n'est jamais une commande légitime dans ce cas.
 */
export default async function ConfirmationCommandePage({ searchParams }: PageProps) {
  const { session_id: sessionId } = await searchParams;

  if (!sessionId) {
    redirect("/panier");
  }

  const supabase = createServiceRoleClient();
  const { data: commande } = await supabase
    .from("commandes")
    .select("*, commande_lignes(*)")
    .eq("stripe_session_id", sessionId)
    .maybeSingle();

  if (!commande) {
    // Session inconnue (webhook pas encore traité, ou lien invalide) :
    // plutôt qu'une erreur, on renvoie vers le panier — voir la note sur le
    // délai webhook/redirection dans le corps de la page ci-dessous pour le
    // cas normal (redirection Stripe plus rapide que le traitement webhook).
    redirect("/panier");
  }

  const dateLivraisonEstimee = new Date(commande.created_at);
  dateLivraisonEstimee.setDate(dateLivraisonEstimee.getDate() + 5);

  return (
    <div data-maison="groupe" className="mx-auto max-w-2xl px-space-lg py-space-3xl text-center">
      <ViderPanierAuChargement />

      <div className="mx-auto mb-space-lg flex h-16 w-16 items-center justify-center rounded-full border border-or-karite/60">
        <svg viewBox="0 0 24 24" className="h-8 w-8 text-or-karite" fill="none" aria-hidden="true">
          <path
            d="M12 2C8 6 5 10 5 14a7 7 0 0 0 14 0c0-4-3-8-7-12Z"
            stroke="currentColor"
            strokeWidth="1.4"
          />
        </svg>
      </div>

      <h1 className="font-display text-headline-lg text-encre-baobab">Votre commande est confirmée</h1>
      <p className="mt-space-sm font-interface text-body-reading text-on-surface-variant">
        Numéro de commande{" "}
        <span className="font-label-tabular text-label-tabular font-medium text-encre-baobab">
          {commande.numero_commande}
        </span>
        . Livraison estimée le{" "}
        {dateLivraisonEstimee.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}.
      </p>

      <div className="mt-space-xl flex flex-col gap-space-sm bg-surface-container p-space-lg text-left">
        <h2 className="font-display text-title-editorial text-encre-baobab">Résumé</h2>
        <div className="flex flex-col gap-space-xxs divide-y divide-sable/60 font-interface text-body-ui">
          {commande.commande_lignes.map((ligne) => (
            <div key={ligne.id} className="flex items-center justify-between py-space-xxs">
              <span className="text-encre-baobab">
                {ligne.nom_produit} <span className="text-on-surface-variant">× {ligne.quantite}</span>
              </span>
              <span className="font-label-tabular text-label-tabular text-on-surface-variant">
                {new Intl.NumberFormat("fr-FR", { style: "currency", currency: commande.devise }).format(
                  Number(ligne.sous_total),
                )}
              </span>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between border-t border-sable pt-space-xs font-medium text-encre-baobab">
          <span>Total</span>
          <span className="font-label-tabular text-label-tabular">
            {new Intl.NumberFormat("fr-FR", { style: "currency", currency: commande.devise }).format(
              Number(commande.total),
            )}
          </span>
        </div>
        <p className="pt-space-xs font-interface text-caption-meta text-on-surface-variant">
          Livraison à {commande.adresse_ligne1}, {commande.code_postal} {commande.ville}, {commande.pays}
        </p>
      </div>

      <div className="mt-space-xl flex flex-wrap justify-center gap-space-sm">
        <Link href="/">
          <Button type="button" variant="primary">
            Retour à l&apos;accueil
          </Button>
        </Link>
        <Link href="/journal">
          <Button type="button" variant="outline">
            Découvrir le journal
          </Button>
        </Link>
      </div>
    </div>
  );
}
