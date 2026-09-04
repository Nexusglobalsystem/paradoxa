import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Badge } from "@/components/ui";
import { createClient } from "@/lib/supabase/server";

import { LIBELLE_STATUT, VARIANTE_BADGE_STATUT, etapeTimeline } from "../../statut-commande";

export const metadata: Metadata = {
  title: "Suivi de commande — LA PARADOXA",
  robots: { index: false },
};

interface PageProps {
  params: Promise<{ id: string }>;
}

const ETAPES = [
  { seuil: 1, label: "Confirmée" },
  { seuil: 2, label: "Préparée" },
  { seuil: 3, label: "Expédiée" },
  { seuil: 4, label: "Livrée" },
] as const;

/**
 * Écran 18 — Suivi de commande (/compte/commandes/[id]). La policy RLS
 * "commandes_client_select_own" (client_id = auth.uid()) garantit déjà
 * qu'une requête sur la commande d'un autre client renvoie 0 ligne — le
 * `notFound()` ci-dessous en est la conséquence normale, pas une
 * vérification supplémentaire faite ici : on ne fait confiance à aucune
 * hypothèse côté client, seulement à ce que la base a réellement renvoyé.
 */
export default async function SuiviCommandePage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: commande } = await supabase
    .from("commandes")
    .select("*, commande_lignes(*)")
    .eq("id", id)
    .maybeSingle();

  if (!commande) {
    notFound();
  }

  const etape = etapeTimeline(commande.statut);
  const formaterMontant = (montant: number) =>
    new Intl.NumberFormat("fr-FR", { style: "currency", currency: commande.devise }).format(montant);

  return (
    <div data-maison="groupe" className="mx-auto max-w-3xl px-space-lg py-space-2xl lg:px-space-2xl">
      <Link
        href="/compte"
        className="font-interface text-caption-meta text-on-surface-variant transition-colors duration-300 ease-out hover:text-encre-baobab"
      >
        ← Mes commandes
      </Link>

      <div className="mt-space-sm flex flex-wrap items-center justify-between gap-space-sm">
        <h1 className="font-display text-headline-md text-encre-baobab">
          Commande {commande.numero_commande}
        </h1>
        <Badge variant={VARIANTE_BADGE_STATUT[commande.statut] ?? "neutral"}>
          {LIBELLE_STATUT[commande.statut] ?? commande.statut}
        </Badge>
      </div>

      {/* Timeline — n'a de sens à afficher "en cours" que sur le parcours
          normal (payée → livrée) ; annulée/remboursée/en attente affichent
          simplement le badge de statut ci-dessus, sans fausse progression. */}
      {etape > 0 ? (
        <div className="mt-space-xl">
          <div className="flex items-center justify-between">
            {ETAPES.map((e) => (
              <div key={e.seuil} className="flex flex-1 flex-col items-center gap-space-xs last:flex-none">
                <span
                  className={`h-3 w-3 rounded-full ${
                    etape >= e.seuil ? "bg-or-karite" : "bg-surface-container-highest"
                  }`}
                  aria-hidden="true"
                />
                <span
                  className={`font-interface text-caption-meta ${
                    etape >= e.seuil ? "text-encre-baobab" : "text-on-surface-variant"
                  }`}
                >
                  {e.label}
                </span>
              </div>
            ))}
          </div>
          <div className="relative -mt-[38px] mb-space-lg h-px bg-surface-container-highest">
            <div
              className="h-px bg-or-karite transition-[width] duration-500 ease-out"
              style={{ width: `${((etape - 1) / (ETAPES.length - 1)) * 100}%` }}
            />
          </div>
        </div>
      ) : null}

      <div className="mt-space-xl flex flex-col gap-space-md bg-surface-container p-space-lg">
        <h2 className="font-display text-title-editorial text-encre-baobab">Détail de la commande</h2>
        <div className="flex flex-col gap-space-xxs divide-y divide-sable/60 font-interface text-body-ui">
          {commande.commande_lignes.map((ligne) => (
            <div key={ligne.id} className="flex items-center justify-between py-space-xxs">
              <span className="text-encre-baobab">
                {ligne.nom_produit} <span className="text-on-surface-variant">× {ligne.quantite}</span>
              </span>
              <span className="font-label-tabular text-label-tabular text-on-surface-variant">
                {formaterMontant(Number(ligne.sous_total))}
              </span>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between border-t border-sable pt-space-xs font-medium text-encre-baobab">
          <span>Total</span>
          <span className="font-label-tabular text-label-tabular">{formaterMontant(Number(commande.total))}</span>
        </div>
      </div>

      <div className="mt-space-lg grid grid-cols-1 gap-space-md sm:grid-cols-2">
        <div className="flex flex-col gap-space-xxs">
          <span className="font-interface text-caption-meta uppercase tracking-widest text-on-surface-variant">
            Adresse de livraison
          </span>
          <p className="font-interface text-body-ui text-encre-baobab">
            {commande.adresse_ligne1}
            {commande.adresse_ligne2 ? <>, {commande.adresse_ligne2}</> : null}
            <br />
            {commande.code_postal} {commande.ville}, {commande.pays}
          </p>
        </div>
        {commande.transporteur || commande.numero_suivi ? (
          <div className="flex flex-col gap-space-xxs">
            <span className="font-interface text-caption-meta uppercase tracking-widest text-on-surface-variant">
              Transporteur
            </span>
            <p className="font-interface text-body-ui text-encre-baobab">
              {commande.transporteur ?? "—"}
              {commande.numero_suivi ? (
                <>
                  <br />
                  <span className="font-label-tabular text-label-tabular">{commande.numero_suivi}</span>
                </>
              ) : null}
            </p>
          </div>
        ) : null}
      </div>

      <p className="mt-space-xl font-interface text-caption-meta text-on-surface-variant">
        Un souci avec cette commande ?{" "}
        <Link href="/contact" className="text-terre-de-dakar underline-offset-2 hover:underline">
          Contactez notre conciergerie
        </Link>
        .
      </p>
    </div>
  );
}
