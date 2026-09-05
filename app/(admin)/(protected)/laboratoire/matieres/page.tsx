import type { Metadata } from "next";
import Link from "next/link";

import { Badge, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui";
import {
  estFamilleOlfactive,
  FAMILLES_OLFACTIVES,
  ORDRE_FAMILLES,
} from "@/components/laboratoire/familles-olfactives";
import { PuissanceDots } from "@/components/laboratoire/puissance-dots";
import type { MatiereRow } from "@/components/laboratoire/types";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Bibliothèque de matières premières — Laboratoire LA PARADOXA",
};

const primaryLinkClasses =
  "inline-flex items-center gap-space-xs rounded-lg bg-terre-de-dakar px-space-md py-space-sm font-interface text-body-ui text-ivoire-bouye shadow-ambient transition-colors duration-300 ease-out hover:brightness-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-encre-baobab focus-visible:ring-offset-2";

const VOLATILITE_LABEL: Record<string, string> = {
  tete: "Tête",
  tete_coeur: "Tête-Cœur",
  coeur: "Cœur",
  coeur_fond: "Cœur-Fond",
  fond: "Fond",
};

function formatPrix(prix: number): string {
  return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(prix);
}

interface PageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function BibliothequeMatieresPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const familleParam = typeof params.famille === "string" ? params.famille : undefined;
  const famille = familleParam && estFamilleOlfactive(familleParam) ? familleParam : undefined;
  const q = typeof params.q === "string" ? params.q.trim() : "";

  const supabase = await createClient();

  // Comptage par famille pour les chips — dataset de laboratoire, volume
  // modeste : un select ciblé sur la seule colonne suffit, pas besoin d'agrégat SQL.
  const { data: toutesFamilles } = await supabase
    .from("matieres")
    .select("famille_olfactive")
    .eq("statut", "actif");
  const comptesParFamille = new Map<string, number>();
  for (const ligne of toutesFamilles ?? []) {
    const cle = (ligne as { famille_olfactive: string }).famille_olfactive;
    comptesParFamille.set(cle, (comptesParFamille.get(cle) ?? 0) + 1);
  }
  const totalMatieres = toutesFamilles?.length ?? 0;

  let requete = supabase
    .from("matieres")
    .select("*, matiere_limites_ifra(categorie_ifra, seuil_pourcentage, seuil_libelle, statut)")
    .eq("statut", "actif")
    .order("nom", { ascending: true });

  if (famille) requete = requete.eq("famille_olfactive", famille);
  if (q) requete = requete.or(`nom.ilike.%${q}%,inci.ilike.%${q}%,cas_number.ilike.%${q}%`);

  const { data, error } = await requete;
  const matieres = (data ?? []) as (MatiereRow & {
    matiere_limites_ifra: { categorie_ifra: string; seuil_pourcentage: number | null; seuil_libelle: string | null; statut: string }[];
  })[];

  return (
    <div className="mx-auto max-w-[1440px] space-y-space-xl px-space-lg py-space-xl lg:px-space-2xl">
      <header className="flex flex-col justify-between gap-space-lg lg:flex-row lg:items-end">
        <div className="max-w-reading-max space-y-space-xxs">
          <div className="flex items-center gap-space-xs">
            <span aria-hidden="true" className="size-2 rounded-full bg-vert-moringa" />
            <span className="font-interface text-caption-meta uppercase tracking-widest text-or-karite-strong">
              Inventaire vivant — Dakar &amp; Grasse
            </span>
          </div>
          <h1 className="font-display text-headline-lg text-encre-baobab">
            Bibliothèque de matières premières
          </h1>
          <p className="font-interface text-body-reading text-on-surface-variant">
            Inventaire organoleptique, profilage IFRA 51<sup>e</sup> amendement et coûts de
            formulation.
          </p>
        </div>
        <Link href="/laboratoire/matieres/nouvelle" className={primaryLinkClasses}>
          <span aria-hidden="true">+</span>
          <span>Nouvelle matière</span>
        </Link>
      </header>

      <div className="space-y-space-md bg-surface-container-low p-space-md shadow-ambient">
        <form method="get" className="flex flex-col gap-space-md md:flex-row md:items-center">
          {famille ? <input type="hidden" name="famille" value={famille} /> : null}
          <div className="relative w-full md:w-2/3">
            <input
              type="text"
              name="q"
              defaultValue={q}
              placeholder="Rechercher par matière, nom INCI ou numéro CAS…"
              aria-label="Rechercher par matière, nom INCI ou numéro CAS"
              className="w-full bg-surface-container px-space-md py-space-xs font-interface text-body-ui text-encre-baobab placeholder:text-on-surface-variant/70 outline-none transition-colors duration-300 ease-out focus:bg-surface-container-lowest focus-visible:ring-2 focus-visible:ring-encre-baobab"
            />
          </div>
          <button
            type="submit"
            className="font-interface text-caption-meta text-encre-baobab underline decoration-or-karite decoration-2 underline-offset-4"
          >
            Rechercher
          </button>
        </form>

        <div className="flex items-center gap-space-xs overflow-x-auto pb-space-xxs">
          <Link
            href="/laboratoire/matieres"
            className={`whitespace-nowrap px-space-sm py-space-xxs font-interface text-caption-meta transition-colors duration-300 ease-out ${
              !famille
                ? "bg-encre-baobab text-ivoire-bouye"
                : "bg-surface-container text-encre-baobab hover:bg-surface-container-high"
            }`}
          >
            Tous ({totalMatieres})
          </Link>
          {ORDRE_FAMILLES.map((cle) => {
            const info = FAMILLES_OLFACTIVES[cle];
            const actif = famille === cle;
            return (
              <Link
                key={cle}
                href={`/laboratoire/matieres?famille=${cle}`}
                className={`flex items-center gap-space-xxs whitespace-nowrap px-space-sm py-space-xxs font-interface text-caption-meta transition-colors duration-300 ease-out ${
                  actif
                    ? "bg-encre-baobab text-ivoire-bouye"
                    : "bg-surface-container text-encre-baobab hover:bg-surface-container-high"
                }`}
              >
                <span aria-hidden="true" className={`size-2 rounded-full ${info.bg}`} />
                <span>
                  {info.label} ({comptesParFamille.get(cle) ?? 0})
                </span>
              </Link>
            );
          })}
        </div>
      </div>

      {error ? (
        <p role="alert" className="font-interface text-body-ui text-danger">
          Impossible de charger les matières : {error.message}
        </p>
      ) : matieres.length === 0 ? (
        <div className="bg-surface-container-low p-space-2xl text-center shadow-ambient">
          <p className="font-interface text-body-ui text-on-surface-variant">
            {q || famille
              ? "Aucune matière ne correspond à ces critères."
              : "Aucune matière enregistrée pour l'instant."}
          </p>
        </div>
      ) : (
        <div className="overflow-hidden bg-surface-container-low shadow-ambient">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Matière &amp; terroir</TableHead>
                <TableHead>INCI / CAS</TableHead>
                <TableHead>Famille</TableHead>
                <TableHead>Volatilité</TableHead>
                <TableHead numeric>Puissance</TableHead>
                <TableHead>Limite IFRA (Cat. 4)</TableHead>
                <TableHead numeric>Prix / kg</TableHead>
                <TableHead numeric>Stock</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {matieres.map((matiere) => {
                const info = FAMILLES_OLFACTIVES[matiere.famille_olfactive];
                const limiteCat4 = matiere.matiere_limites_ifra?.find((l) => l.categorie_ifra === "4");
                const stockBas =
                  matiere.seuil_alerte_stock_kg !== null &&
                  matiere.stock_kg <= matiere.seuil_alerte_stock_kg;
                return (
                  <TableRow key={matiere.id}>
                    <TableCell>
                      <div className="flex items-center gap-space-xxs font-medium text-encre-baobab">
                        <span>{matiere.nom}</span>
                        {matiere.est_captif ? (
                          <Badge variant="accent" className="uppercase tracking-wider">
                            Captif
                          </Badge>
                        ) : null}
                      </div>
                      {matiere.origine ? (
                        <div className="font-interface text-caption-meta text-on-surface-variant">
                          {matiere.origine}
                        </div>
                      ) : null}
                    </TableCell>
                    <TableCell>
                      <div className="font-interface text-caption-meta text-on-surface-variant">
                        {matiere.inci ?? "—"}
                      </div>
                      {matiere.cas_number ? (
                        <div className="text-label-tabular font-label-tabular text-caption-meta text-on-surface-variant/70">
                          CAS {matiere.cas_number}
                        </div>
                      ) : null}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`inline-block px-space-xs py-0.5 font-interface text-caption-meta font-medium ${info.badgeClass}`}
                      >
                        {matiere.facette_libre ?? info.label}
                      </span>
                    </TableCell>
                    <TableCell className="font-interface text-caption-meta">
                      {matiere.volatilite ? VOLATILITE_LABEL[matiere.volatilite] : "—"}
                    </TableCell>
                    <TableCell numeric>
                      <PuissanceDots valeur={matiere.puissance} className="justify-end" />
                    </TableCell>
                    <TableCell>
                      {limiteCat4 ? (
                        <span
                          className={`inline-flex items-center gap-1 font-interface text-caption-meta ${
                            limiteCat4.statut === "non_conforme" || limiteCat4.statut === "attention"
                              ? "font-medium text-danger"
                              : "text-success"
                          }`}
                        >
                          <span
                            aria-hidden="true"
                            className={`size-1.5 rounded-full ${
                              limiteCat4.statut === "non_conforme" || limiteCat4.statut === "attention"
                                ? "bg-danger"
                                : "bg-vert-moringa"
                            }`}
                          />
                          {limiteCat4.seuil_pourcentage !== null
                            ? `Max ${limiteCat4.seuil_pourcentage.toFixed(2)}%`
                            : (limiteCat4.seuil_libelle ?? "Libre")}
                        </span>
                      ) : (
                        <span className="font-interface text-caption-meta text-on-surface-variant/70">
                          Non documentée
                        </span>
                      )}
                    </TableCell>
                    <TableCell numeric>{formatPrix(matiere.prix_kg)}</TableCell>
                    <TableCell numeric>
                      <span className={stockBas ? "font-medium text-danger" : undefined}>
                        {matiere.stock_kg.toFixed(1)} kg
                      </span>
                    </TableCell>
                    <TableCell>
                      <Link
                        href={`/laboratoire/matieres/${matiere.id}`}
                        className="font-interface text-caption-meta text-terre-de-dakar underline-offset-2 hover:underline"
                      >
                        Voir la fiche
                      </Link>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
