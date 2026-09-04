import type { Metadata } from "next";
import Link from "next/link";

import { Badge, Button, Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import { createClient } from "@/lib/supabase/server";

import { seDeconnecter } from "./actions";
import { LIBELLE_STATUT, VARIANTE_BADGE_STATUT } from "./statut-commande";

export const metadata: Metadata = {
  title: "Mon compte — LA PARADOXA",
  robots: { index: false },
};

interface ProfilOlfactif {
  escale?: string;
  famillesDominantes?: string[];
  repondiLe?: string;
}

/**
 * Écran 17 — Dashboard client (/compte). Protégé par
 * app/(vitrine)/compte/(protected)/layout.tsx (session requise).
 *
 * Navigation latérale volontairement réduite à ce que le schéma porte
 * réellement (commandes, profil, profil olfactif) : ni "mes adresses" ni
 * "mes échantillons" n'ont de table dédiée à ce stade (aucune commande n'a
 * encore de carnet d'adresses séparé de son adresse de livraison, et les
 * échantillons ne sont pas distingués des produits standard dans
 * `produits`) — à construire quand ces besoins deviendront concrets plutôt
 * que d'inventer des sections vides.
 */
export default async function CompteDashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Garanti non-null par le layout (protected), mais TypeScript ne le sait
  // pas d'une page à l'autre — vérification défensive plutôt qu'un `!`.
  if (!user) return null;

  const [{ data: profil }, { data: commandes }] = await Promise.all([
    supabase.from("profiles").select("nom_complet, profil_olfactif").eq("id", user.id).maybeSingle(),
    supabase
      .from("commandes")
      .select("id, numero_commande, created_at, statut, total, devise")
      .eq("client_id", user.id)
      .order("created_at", { ascending: false })
      .limit(10),
  ]);

  const prenom = profil?.nom_complet?.split(" ")[0] || user.email?.split("@")[0] || "";
  const profilOlfactif = profil?.profil_olfactif as ProfilOlfactif | null;
  const listeCommandes = commandes ?? [];

  return (
    <div data-maison="groupe" className="mx-auto max-w-desktop-max px-space-lg py-space-2xl lg:px-space-2xl">
      <div className="grid grid-cols-1 gap-space-xl lg:grid-cols-12">
        {/* Navigation latérale */}
        <aside className="flex flex-col gap-space-xs lg:col-span-3">
          <span className="mb-space-xs font-interface text-caption-meta uppercase tracking-widest text-on-surface-variant">
            Mon espace
          </span>
          <span className="bg-surface-container px-space-sm py-space-xs font-interface text-body-ui font-medium text-encre-baobab">
            Mes commandes
          </span>
          <Link
            href="#profil-olfactif"
            className="px-space-sm py-space-xs font-interface text-body-ui text-on-surface-variant transition-colors duration-300 ease-out hover:text-encre-baobab"
          >
            Mon profil olfactif
          </Link>
          <form action={seDeconnecter} className="pt-space-md">
            <Button type="submit" variant="ghost" size="sm">
              Se déconnecter
            </Button>
          </form>
        </aside>

        {/* Zone principale */}
        <div className="flex flex-col gap-space-xl lg:col-span-9">
          <div>
            <h1 className="font-display text-headline-lg text-encre-baobab">
              {prenom ? `Bonjour, ${prenom}` : "Bonjour"}
            </h1>
            <p className="mt-space-xxs font-interface text-body-ui text-on-surface-variant">{user.email}</p>
          </div>

          {/* Profil olfactif */}
          <Card id="profil-olfactif">
            <CardHeader>
              <CardTitle>Votre profil olfactif</CardTitle>
            </CardHeader>
            <CardContent>
              {profilOlfactif?.escale ? (
                <div className="flex flex-col gap-space-sm">
                  <p className="font-interface text-body-reading text-encre-baobab">
                    Votre escale : <span className="font-medium">{profilOlfactif.escale}</span>
                  </p>
                  {profilOlfactif.famillesDominantes && profilOlfactif.famillesDominantes.length > 0 ? (
                    <div className="flex flex-wrap gap-space-xs">
                      {profilOlfactif.famillesDominantes.map((famille) => (
                        <Badge key={famille} variant="accent">
                          {famille}
                        </Badge>
                      ))}
                    </div>
                  ) : null}
                  <Link
                    href="/shea/quiz"
                    className="font-interface text-caption-meta text-terre-de-dakar underline-offset-2 hover:underline"
                  >
                    Refaire le quiz
                  </Link>
                </div>
              ) : (
                <div className="flex flex-col items-start gap-space-sm">
                  <p className="font-interface text-body-reading text-on-surface-variant">
                    Vous n&apos;avez pas encore trouvé votre escale.
                  </p>
                  <Link href="/shea/quiz">
                    <Button type="button" variant="outline">
                      Faire le quiz olfactif
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Commandes récentes */}
          <div>
            <h2 className="mb-space-md font-display text-title-editorial text-encre-baobab">
              Mes commandes
            </h2>

            {listeCommandes.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center gap-space-md py-space-xl text-center">
                  <p className="font-interface text-body-reading text-on-surface-variant">
                    Vous n&apos;avez pas encore passé de commande.
                  </p>
                  <Link href="/shea/collection">
                    <Button type="button" variant="primary">
                      Découvrir la collection
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <div className="flex flex-col divide-y divide-sable border border-sable">
                {listeCommandes.map((commande) => (
                  <Link
                    key={commande.id}
                    href={`/compte/commandes/${commande.id}`}
                    className="flex flex-wrap items-center justify-between gap-space-sm p-space-md transition-colors duration-300 ease-out hover:bg-surface-container"
                  >
                    <div className="flex flex-col">
                      <span className="font-label-tabular text-label-tabular text-encre-baobab">
                        {commande.numero_commande}
                      </span>
                      <span className="font-interface text-caption-meta text-on-surface-variant">
                        {new Date(commande.created_at).toLocaleDateString("fr-FR", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                    <Badge variant={VARIANTE_BADGE_STATUT[commande.statut] ?? "neutral"}>
                      {LIBELLE_STATUT[commande.statut] ?? commande.statut}
                    </Badge>
                    <span className="font-label-tabular text-label-tabular text-encre-baobab">
                      {new Intl.NumberFormat("fr-FR", { style: "currency", currency: commande.devise }).format(
                        Number(commande.total),
                      )}
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
