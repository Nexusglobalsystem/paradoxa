"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";

import { createClient } from "@/lib/supabase/client";

import { BoutonAjouterPanier } from "../../bouton-ajouter-panier";
import { contenuParfum } from "../parfums/contenu-editorial";

import { CLE_RESULTAT_QUIZ, type ProduitQuizLite } from "./quiz-donnees";

/**
 * Écran de révélation du quiz. Le texte descriptif ("description courte")
 * réutilise le contenu éditorial déjà écrit pour la fiche parfum / la
 * collection (app/(vitrine)/shea/parfums/contenu-editorial.ts) plutôt que
 * d'inventer une troisième version du récit de chaque escale — même logique
 * que /shea/collection et /shea/parfums/[slug].
 *
 * Persistance (brief Vague 3) :
 * - localStorage TOUJOURS écrit en premier — c'est la source affichée
 *   immédiatement, y compris pour un visiteur non connecté.
 * - Si un client est connecté (vérifié côté navigateur via
 *   supabase.auth.getUser()), on tente EN PLUS une écriture best-effort dans
 *   profiles.profil_olfactif (policy profiles_update_own_or_admin déjà en
 *   place). Un échec réseau/RLS ne doit jamais bloquer ni faire disparaître
 *   le résultat déjà affiché — même philosophie que l'email de confirmation
 *   de commande (best-effort, jamais dans le chemin critique de l'UI).
 */
interface QuizResultatProps {
  produit: ProduitQuizLite;
  coffret: ProduitQuizLite;
  onModifierReponses: () => void;
  onRecommencer: () => void;
}

export function QuizResultat({ produit, coffret, onModifierReponses, onRecommencer }: QuizResultatProps) {
  const contenu = contenuParfum(produit.slug);
  const dejaEcrit = useRef<string | null>(null);

  useEffect(() => {
    // Un seul essai d'écriture par escale révélée, même si le composant
    // re-rend pour une autre raison (StrictMode, changement de props non lié).
    if (dejaEcrit.current === produit.slug) return;
    dejaEcrit.current = produit.slug;

    const resultat = {
      escale: produit.escale_geographique ?? produit.nom,
      famillesDominantes: contenu.familles,
      repondiLe: new Date().toISOString(),
    };

    try {
      window.localStorage.setItem(CLE_RESULTAT_QUIZ, JSON.stringify(resultat));
    } catch {
      // best-effort : navigation privée stricte, quota dépassé... le résultat
      // reste affiché à l'écran, seule la persistance échoue silencieusement.
    }

    (async () => {
      try {
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) return;
        await supabase.from("profiles").update({ profil_olfactif: resultat }).eq("id", user.id);
      } catch {
        // best-effort — jamais bloquant pour l'affichage du résultat, voir
        // commentaire d'en-tête.
      }
    })();
  }, [produit.slug, produit.nom, produit.escale_geographique, contenu.familles]);

  const prixCoffret = new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: coffret.devise || "EUR",
    minimumFractionDigits: coffret.prix % 1 === 0 ? 0 : 2,
  }).format(coffret.prix);

  return (
    <div className="relative flex w-full flex-col">
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute inset-0 bg-encre-baobab" />
        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-ocre-solaire/15 blur-[120px]" />
        <div className="absolute right-0 top-1/2 h-[30rem] w-[30rem] -translate-y-1/2 rounded-full bg-terre-de-dakar/20 blur-[140px]" />
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-desktop-max flex-col gap-space-2xl px-space-lg py-space-2xl lg:px-space-2xl lg:py-space-3xl">
        <div className="mx-auto flex max-w-[720px] flex-col items-center gap-space-xs text-center">
          <span className="inline-flex items-center gap-space-xs rounded-full bg-or-karite/10 px-space-md py-1 font-interface text-caption-meta uppercase tracking-[0.2em] text-or-karite">
            Convergence trouvée
          </span>
          <h1 className="font-display text-headline-lg-mobile font-light leading-tight text-ivoire-bouye lg:text-headline-lg">
            Votre escale est {produit.escale_geographique ?? produit.nom}
          </h1>
          <p className="max-w-reading-max font-interface text-body-reading font-light text-sable/85">
            D&apos;après vos réponses, la création qui vous correspond le plus est{" "}
            <span className="font-display italic text-or-karite">{produit.nom}</span>.
          </p>
        </div>

        <div className="grid grid-cols-1 items-center gap-space-2xl lg:grid-cols-12">
          <div className="relative overflow-hidden rounded-xl shadow-ambient lg:col-span-5">
            <div className="relative aspect-[4/5] w-full">
              <Image
                src="/images/flacon-parfum-ambre.png"
                alt={`Flacon du parfum ${produit.nom}, Maison SHÉA.`}
                fill
                sizes="(min-width: 1024px) 40vw, 100vw"
                className="object-cover object-center"
              />
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-t from-encre-baobab/50 via-transparent to-transparent"
              />
              {produit.escale_geographique ? (
                <div className="absolute left-space-md top-space-md bg-surface-container-lowest/90 px-space-sm py-space-xxs shadow-ambient backdrop-blur-sm">
                  <span className="font-interface text-caption-meta uppercase tracking-widest text-encre-baobab">
                    Escale · {produit.escale_geographique}
                  </span>
                </div>
              ) : null}
            </div>
          </div>

          <div className="flex flex-col gap-space-lg lg:col-span-7">
            <div className="flex flex-wrap gap-space-xs">
              {contenu.familles.map((famille) => (
                <span
                  key={famille}
                  className="rounded-full bg-ivoire-bouye/10 px-space-sm py-space-xxs font-interface text-caption-meta text-sable"
                >
                  {famille}
                </span>
              ))}
            </div>
            <p className="font-display text-title-editorial italic text-ivoire-bouye/90">{contenu.accroche}</p>
            <p className="font-interface text-body-reading leading-relaxed text-sable/85">{contenu.recit}</p>

            <div className="flex flex-col gap-space-md rounded-xl border border-or-karite/20 bg-ivoire-bouye/5 p-space-lg backdrop-blur-sm sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-space-xxs">
                <span className="block font-interface text-caption-meta uppercase tracking-widest text-or-karite">
                  Envie d&apos;essayer avant de choisir ?
                </span>
                <p className="font-interface text-body-ui text-sable/80">
                  Le Coffret Cinq Escales ({prixCoffret}) contient un échantillon de plusieurs créations de la
                  collection, dont potentiellement celle-ci.
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-space-md pt-space-xs sm:flex-row">
              <BoutonAjouterPanier
                article={{
                  produitId: coffret.id,
                  slug: coffret.slug,
                  nom: coffret.nom,
                  prixUnitaire: coffret.prix,
                  devise: coffret.devise,
                  image: "/images/flatlay-coffret-kraft-or.png",
                  maison: "shea",
                }}
                variant="primary"
                size="lg"
                className="w-full justify-between gap-space-md bg-terre-de-dakar tracking-wide sm:w-auto"
              >
                <span>Commander l&apos;échantillon</span>
                <span className="font-label-tabular text-label-tabular">{prixCoffret}</span>
              </BoutonAjouterPanier>
              <Link
                href={`/shea/parfums/${produit.slug}`}
                className="inline-flex w-full items-center justify-center gap-space-sm rounded-lg border border-or-karite px-space-xl py-space-md font-interface text-body-ui tracking-wide text-or-karite transition-colors duration-300 ease-out hover:bg-or-karite hover:text-encre-baobab sm:w-auto"
              >
                Voir le parfum
              </Link>
            </div>

            <div className="flex flex-wrap gap-space-lg pt-space-xs font-interface text-caption-meta text-sable/60">
              <button
                type="button"
                onClick={onModifierReponses}
                className="underline underline-offset-2 transition-colors duration-300 ease-out hover:text-or-karite"
              >
                Modifier mes réponses
              </button>
              <button
                type="button"
                onClick={onRecommencer}
                className="underline underline-offset-2 transition-colors duration-300 ease-out hover:text-or-karite"
              >
                Recommencer le quiz
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
