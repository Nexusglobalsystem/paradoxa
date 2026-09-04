import Image from "next/image";
import Link from "next/link";

import { createStaticClient } from "@/lib/supabase/static";

import { contenuParfum } from "../../shea/parfums/contenu-editorial";

import type { ProfilOlfactif } from "./page";

/**
 * Section "Vous aimerez aussi" du dashboard client (/compte) — Vague 4,
 * rendue juste après la carte "Votre profil olfactif" dans page.tsx.
 *
 * ── Logique de correspondance (documentée puisqu'aucun test automatisé ne
 *    couvre ce composant — vérifiée par relecture + requête manuelle sur les
 *    7 produits réels, voir le rapport de la Vague 4) ──────────────────────
 * Le quiz (../../shea/quiz/quiz-resultat.tsx) écrit
 * `profil_olfactif.famillesDominantes` comme une COPIE des familles
 * olfactives du parfum gagnant (`contenuParfum(escale).familles`, voir
 * contenu-editorial.ts). Recommander revient donc à chercher, parmi les 5
 * AUTRES créations réelles de la collection, celles dont les familles se
 * recoupent le plus avec ce jeu de 3 familles :
 *
 *   score(produit) = |familles(produit) ∩ famillesDominantes(profil)|
 *
 * Le coffret de découverte n'est jamais candidat ici : ses "familles"
 * éditoriales (["Découverte", "Nomade", "Cinq escales"]) sont un intitulé de
 * produit, pas un vocabulaire olfactif — il est déjà mis en avant ailleurs
 * (bandeau de clôture de /shea/collection, écran de résultat du quiz).
 *
 * Le classement est trié par score décroissant puis, à égalité (y compris à
 * score 0, ex. le profil "Sahel" ne recoupe qu'une seule autre création sur
 * une famille), par l'ordre éditorial de la collection (même ordre que
 * ORDRE_COLLECTION dans /shea/collection/page.tsx et ORDRE_ESCALES dans
 * /shea/quiz/quiz-donnees.ts) — pour toujours proposer trois cartes
 * cohérentes plutôt qu'une liste qui varierait en longueur selon l'escale.
 */

const ORDRE_ESCALES_REELLES: readonly string[] = [
  "bois-de-shea",
  "poussiere-docre",
  "ombre-de-baobab",
  "fleur-de-karite",
  "brume-de-goree",
  "or-du-ferlo",
];

function formatPrix(prix: number, devise: string): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: devise || "EUR",
    minimumFractionDigits: prix % 1 === 0 ? 0 : 2,
  }).format(prix);
}

export async function RecommandationsOlfactives({
  profilOlfactif,
}: {
  profilOlfactif: ProfilOlfactif | null;
}) {
  // Pas encore de quiz passé : l'invitation à le faire existe déjà dans la
  // carte "Votre profil olfactif" juste au-dessus (page.tsx) — on ne la
  // duplique pas, on n'affiche simplement rien.
  if (!profilOlfactif?.escale) return null;

  const supabase = createStaticClient();
  const { data } = await supabase
    .from("produits")
    .select("id, slug, nom, prix, devise, escale_geographique, description")
    .eq("maison", "shea")
    .eq("statut", "actif");

  const famillesProfil = new Set(profilOlfactif.famillesDominantes ?? []);

  const candidats = (data ?? [])
    .filter((produit) => ORDRE_ESCALES_REELLES.includes(produit.slug))
    // Exclut l'escale déjà révélée par le quiz — ce sont des alternatives,
    // pas une redite (même règle de correspondance que quiz-resultat.tsx,
    // qui écrit `produit.escale_geographique ?? produit.nom` comme escale).
    .filter((produit) => (produit.escale_geographique ?? produit.nom) !== profilOlfactif.escale);

  const recommandations = candidats
    .map((produit) => {
      const familles = contenuParfum(produit.slug).familles;
      const score = familles.filter((famille) => famillesProfil.has(famille)).length;
      return { produit, score, ordre: ORDRE_ESCALES_REELLES.indexOf(produit.slug) };
    })
    .sort((a, b) => b.score - a.score || a.ordre - b.ordre)
    .slice(0, 3);

  if (recommandations.length === 0) return null;

  return (
    <div>
      <h2 className="mb-space-xxs font-display text-title-editorial text-encre-baobab">
        Vous aimerez aussi
      </h2>
      <p className="mb-space-md font-interface text-caption-meta text-on-surface-variant">
        D&apos;après votre profil olfactif, trois autres escales de la collection à explorer.
      </p>
      <div className="grid grid-cols-1 gap-space-md sm:grid-cols-3">
        {recommandations.map(({ produit }) => {
          const contenu = contenuParfum(produit.slug);
          const prix = formatPrix(Number(produit.prix), produit.devise);

          return (
            <Link
              key={produit.slug}
              href={`/shea/parfums/${produit.slug}`}
              className="group flex flex-col gap-space-xs rounded-xl border border-sable bg-surface-container-low p-space-sm shadow-ambient transition-shadow duration-300 ease-out hover:shadow-lg"
            >
              <div className="relative aspect-[4/5] w-full overflow-hidden rounded-lg bg-surface-container-high">
                <Image
                  src={contenu.imageEscale}
                  alt={contenu.imageEscaleAlt}
                  fill
                  sizes="(min-width: 640px) 30vw, 90vw"
                  className="object-cover object-center transition-transform duration-500 ease-out group-hover:scale-105"
                />
                {produit.escale_geographique ? (
                  <span className="absolute left-space-xs top-space-xs rounded-full bg-encre-baobab/85 px-space-xs py-0.5 font-interface text-caption-meta text-or-karite backdrop-blur-sm">
                    {produit.escale_geographique}
                  </span>
                ) : null}
              </div>
              <div className="flex flex-col gap-space-xxs">
                <h3 className="font-display text-body-reading text-encre-baobab">{produit.nom}</h3>
                {produit.description ? (
                  <p className="line-clamp-2 font-interface text-caption-meta text-on-surface-variant">
                    {produit.description}
                  </p>
                ) : null}
                <span className="font-label-tabular text-label-tabular font-medium text-encre-baobab">
                  {prix}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
