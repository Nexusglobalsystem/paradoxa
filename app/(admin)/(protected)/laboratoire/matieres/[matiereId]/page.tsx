import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Badge, Card, CardContent, CardHeader, CardTitle, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui";
import { FAMILLES_OLFACTIVES } from "@/components/laboratoire/familles-olfactives";
import { PuissanceDots } from "@/components/laboratoire/puissance-dots";
import type { DonneesComplementaires, MatiereLimiteIfraRow, MatiereRow } from "@/components/laboratoire/types";
import { createClient } from "@/lib/supabase/server";

interface PageProps {
  params: Promise<{ matiereId: string }>;
}

const VOLATILITE_LABEL: Record<string, string> = {
  tete: "Tête",
  tete_coeur: "Tête-Cœur",
  coeur: "Cœur",
  coeur_fond: "Cœur-Fond",
  fond: "Fond",
};

const STATUT_IFRA_BADGE: Record<MatiereLimiteIfraRow["statut"], "success" | "danger" | "neutral"> = {
  libre: "neutral",
  conforme: "success",
  attention: "danger",
  non_conforme: "danger",
};

const STATUT_IFRA_LABEL: Record<MatiereLimiteIfraRow["statut"], string> = {
  libre: "Libre",
  conforme: "Conforme",
  attention: "Seuil d'attention",
  non_conforme: "Non conforme",
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { matiereId } = await params;
  const supabase = await createClient();
  const { data } = await supabase.from("matieres").select("nom").eq("id", matiereId).single();
  return { title: data ? `${data.nom} — Laboratoire LA PARADOXA` : "Fiche matière — LA PARADOXA" };
}

export default async function FicheMatierePage({ params }: PageProps) {
  const { matiereId } = await params;
  const supabase = await createClient();

  const [{ data: matiereData, error }, { data: limitesData }, { data: usagesData }] = await Promise.all([
    supabase.from("matieres").select("*").eq("id", matiereId).single(),
    supabase
      .from("matiere_limites_ifra")
      .select("*")
      .eq("matiere_id", matiereId)
      .order("categorie_ifra", { ascending: true }),
    supabase
      .from("formule_lignes")
      .select("pourcentage, etage, phase, formules(id, nom, maison, type_formule, statut)")
      .eq("matiere_id", matiereId),
  ]);

  if (error || !matiereData) {
    notFound();
  }

  const matiere = matiereData as MatiereRow;
  const limites = (limitesData ?? []) as MatiereLimiteIfraRow[];
  const donnees = (matiere.donnees_complementaires ?? {}) as DonneesComplementaires;
  const info = FAMILLES_OLFACTIVES[matiere.famille_olfactive];
  const usages = (usagesData ?? []) as {
    pourcentage: number;
    etage: string | null;
    phase: string | null;
    formules: { id: string; nom: string; maison: string; type_formule: string; statut: string } | null;
  }[];

  return (
    <div className="mx-auto max-w-5xl space-y-space-lg px-space-lg py-space-xl lg:px-space-2xl">
      <div className="flex flex-col gap-space-xs">
        <Link
          href="/laboratoire/matieres"
          className="font-interface text-caption-meta text-on-surface-variant hover:text-encre-baobab"
        >
          ← Bibliothèque de matières
        </Link>
        <div className="flex flex-wrap items-center gap-space-sm">
          <h1 className="font-display text-headline-lg text-encre-baobab">{matiere.nom}</h1>
          {matiere.est_captif ? (
            <Badge variant="accent" className="uppercase tracking-widest">
              Captif exclusif atelier Dakar
            </Badge>
          ) : null}
          {matiere.reference_interne ? (
            <span className="text-label-tabular font-label-tabular text-caption-meta text-on-surface-variant">
              #{matiere.reference_interne}
            </span>
          ) : null}
        </div>
        <span className={`inline-block w-fit px-space-xs py-0.5 font-interface text-caption-meta font-medium ${info.badgeClass}`}>
          {matiere.facette_libre ?? info.label}
        </span>
      </div>

      <div className="grid grid-cols-1 gap-space-lg lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Identité</CardTitle>
          </CardHeader>
          <CardContent className="space-y-space-xs font-interface text-body-ui text-encre-baobab">
            <dl className="grid grid-cols-[auto_1fr] gap-x-space-md gap-y-space-xxs">
              <dt className="text-on-surface-variant">Nom INCI</dt>
              <dd>{matiere.inci ?? "—"}</dd>
              <dt className="text-on-surface-variant">Numéro CAS</dt>
              <dd className="text-label-tabular font-label-tabular">{matiere.cas_number ?? "—"}</dd>
              <dt className="text-on-surface-variant">Fournisseur</dt>
              <dd>{matiere.fournisseur ?? "—"}</dd>
              <dt className="text-on-surface-variant">Origine</dt>
              <dd>{matiere.origine ?? "—"}</dd>
              <dt className="text-on-surface-variant">Nature</dt>
              <dd className="capitalize">{matiere.nature}</dd>
            </dl>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Profil olfactif</CardTitle>
          </CardHeader>
          <CardContent className="space-y-space-sm">
            <div className="flex items-center justify-between font-interface text-body-ui">
              <span className="text-on-surface-variant">Volatilité de référence</span>
              <span className="text-encre-baobab">
                {matiere.volatilite ? VOLATILITE_LABEL[matiere.volatilite] : "Non renseignée"}
              </span>
            </div>
            <div className="flex items-center justify-between font-interface text-body-ui">
              <span className="text-on-surface-variant">Puissance</span>
              <PuissanceDots valeur={matiere.puissance} />
            </div>
            {donnees.facettes && donnees.facettes.length > 0 ? (
              <div className="space-y-space-xxs pt-space-xs">
                <span className="font-interface text-caption-meta uppercase tracking-wider text-on-surface-variant">
                  Spectre organoleptique
                </span>
                {donnees.facettes.map((facette) => (
                  <div key={facette.nom} className="space-y-0.5">
                    <div className="flex justify-between text-label-tabular font-label-tabular text-caption-meta text-encre-baobab">
                      <span>{facette.nom}</span>
                      <span>{facette.pourcentage}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-surface-container">
                      <div className={`h-1.5 ${info.bg}`} style={{ width: `${facette.pourcentage}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            ) : null}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Données réglementaires &amp; seuils IFRA (51e amendement)</CardTitle>
        </CardHeader>
        <CardContent>
          {limites.length === 0 ? (
            <p className="font-interface text-body-ui text-on-surface-variant">
              Aucun seuil IFRA documenté pour cette matière.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Catégorie IFRA</TableHead>
                  <TableHead>Application typique</TableHead>
                  <TableHead numeric>Seuil</TableHead>
                  <TableHead>Statut</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {limites.map((limite) => (
                  <TableRow key={limite.id}>
                    <TableCell className="font-medium">Catégorie {limite.categorie_ifra}</TableCell>
                    <TableCell>{limite.application_typique ?? "—"}</TableCell>
                    <TableCell numeric>
                      {limite.seuil_pourcentage !== null
                        ? `${limite.seuil_pourcentage.toFixed(2)}%`
                        : (limite.seuil_libelle ?? "—")}
                    </TableCell>
                    <TableCell>
                      <Badge variant={STATUT_IFRA_BADGE[limite.statut]}>
                        {STATUT_IFRA_LABEL[limite.statut]}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-space-lg lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Économie</CardTitle>
          </CardHeader>
          <CardContent className="space-y-space-xs font-interface text-body-ui text-encre-baobab">
            <div className="flex items-center justify-between">
              <span className="text-on-surface-variant">Prix / kg</span>
              <span className="text-label-tabular font-label-tabular">
                {new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(matiere.prix_kg)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-on-surface-variant">Stock actif</span>
              <span
                className={`text-label-tabular font-label-tabular ${
                  matiere.seuil_alerte_stock_kg !== null && matiere.stock_kg <= matiere.seuil_alerte_stock_kg
                    ? "text-danger"
                    : ""
                }`}
              >
                {matiere.stock_kg.toFixed(3)} kg
              </span>
            </div>
            {matiere.seuil_alerte_stock_kg !== null ? (
              <div className="flex items-center justify-between">
                <span className="text-on-surface-variant">Seuil d&apos;alerte</span>
                <span className="text-label-tabular font-label-tabular">
                  {matiere.seuil_alerte_stock_kg.toFixed(3)} kg
                </span>
              </div>
            ) : null}
            {matiere.notes ? (
              <p className="pt-space-xs text-caption-meta text-on-surface-variant">{matiere.notes}</p>
            ) : null}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Utilisation en formules</CardTitle>
          </CardHeader>
          <CardContent className="space-y-space-xs">
            {usages.length === 0 ? (
              <p className="font-interface text-body-ui text-on-surface-variant">
                Cette matière n&apos;est utilisée dans aucune formule pour l&apos;instant.
              </p>
            ) : (
              usages.map((usage, i) =>
                usage.formules ? (
                  <Link
                    key={i}
                    href={
                      usage.formules.type_formule === "parfum"
                        ? `/laboratoire/parfum/${usage.formules.id}`
                        : `/laboratoire/cosmetique/${usage.formules.id}`
                    }
                    className="flex items-center justify-between bg-surface-container p-space-xs font-interface text-caption-meta transition-colors duration-300 ease-out hover:bg-surface-container-high"
                  >
                    <span className="font-medium text-encre-baobab">{usage.formules.nom}</span>
                    <span className="text-label-tabular font-label-tabular text-terre-de-dakar">
                      {usage.pourcentage.toFixed(2)}%
                    </span>
                  </Link>
                ) : null,
              )
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
