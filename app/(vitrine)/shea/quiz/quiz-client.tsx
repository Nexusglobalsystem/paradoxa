"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useMemo, useState } from "react";

import { cn } from "@/lib/utils";

import { QUESTIONS, calculerEscaleGagnante, type EscaleSlug, type ProduitQuizLite } from "./quiz-donnees";
import { QuizResultat } from "./quiz-resultat";

/**
 * Pilote l'interaction du quiz olfactif : progression, sélection de carte,
 * transition entre questions, calcul de l'escale gagnante puis bascule vers
 * l'écran de révélation (QuizResultat). "use client" ici seulement — page.tsx
 * reste un Server Component qui ne fait que lire `produits` et passer les
 * données nécessaires en props.
 */
interface QuizClientProps {
  produitsParEscale: Record<EscaleSlug, ProduitQuizLite>;
  coffret: ProduitQuizLite;
}

const TOTAL_QUESTIONS = QUESTIONS.length;

export function QuizClient({ produitsParEscale, coffret }: QuizClientProps) {
  const [etapeIndex, setEtapeIndex] = useState(0);
  const [reponses, setReponses] = useState<Array<string | null>>(() => QUESTIONS.map(() => null));
  const [phase, setPhase] = useState<"quiz" | "resultat">("quiz");
  const [visible, setVisible] = useState(true);

  const questionActive = QUESTIONS[etapeIndex];
  const optionChoisieId = reponses[etapeIndex];

  const escaleGagnante = useMemo<EscaleSlug | null>(() => {
    if (phase !== "resultat") return null;
    const escalesChoisies: EscaleSlug[] = [];
    QUESTIONS.forEach((question, index) => {
      const optionId = reponses[index];
      const option = question.options.find((o) => o.id === optionId);
      if (option) escalesChoisies.push(option.escale);
    });
    return calculerEscaleGagnante(escalesChoisies);
  }, [phase, reponses]);

  const transitionner = useCallback((action: () => void) => {
    // Lu au moment de l'appel (dans un gestionnaire d'événement), jamais
    // pendant le rendu — react-hooks/refs interdit toute lecture de ref
    // pendant le rendu, mais ce n'est de toute façon pas nécessaire ici :
    // seul un déclenchement utilisateur (clic) atteint ce code.
    const reduireMouvement =
      typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduireMouvement) {
      action();
      return;
    }
    setVisible(false);
    window.setTimeout(() => {
      action();
      setVisible(true);
    }, 260);
  }, []);

  function choisirOption(optionId: string) {
    setReponses((precedent) => {
      const suivant = [...precedent];
      suivant[etapeIndex] = optionId;
      return suivant;
    });
  }

  function allerSuivant() {
    if (!optionChoisieId) return;
    if (etapeIndex === TOTAL_QUESTIONS - 1) {
      transitionner(() => setPhase("resultat"));
      return;
    }
    transitionner(() => setEtapeIndex((i) => i + 1));
  }

  function allerPrecedent() {
    if (etapeIndex === 0) return;
    transitionner(() => setEtapeIndex((i) => i - 1));
  }

  function modifierReponses() {
    transitionner(() => {
      setPhase("quiz");
      setEtapeIndex(TOTAL_QUESTIONS - 1);
    });
  }

  function recommencer() {
    transitionner(() => {
      setReponses(QUESTIONS.map(() => null));
      setEtapeIndex(0);
      setPhase("quiz");
    });
  }

  if (phase === "resultat" && escaleGagnante) {
    const produit = produitsParEscale[escaleGagnante];
    return (
      <div className={cn("transition-opacity duration-500 ease-out", visible ? "opacity-100" : "opacity-0")}>
        <QuizResultat produit={produit} coffret={coffret} onModifierReponses={modifierReponses} onRecommencer={recommencer} />
      </div>
    );
  }

  const progression = ((etapeIndex + 1) / TOTAL_QUESTIONS) * 100;

  return (
    <div className="relative flex w-full flex-col">
      {/* Fond atmosphérique — encre profonde avec halos or diffus, cohérent avec la maquette Stitch (dust/particules simplifiées en dégradés statiques, pas de canvas animé).
          absolute, pas fixed : voir la note dans quiz-resultat.tsx (Vague 5) — un
          ancêtre avec transform casse le positionnement fixed et laisse
          transparaître le fond clair du layout derrière un texte pensé pour un
          fond sombre. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <div className="absolute inset-0 bg-encre-baobab" />
        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-ocre-solaire/15 blur-[120px]" />
        <div className="absolute right-0 top-1/2 h-[30rem] w-[30rem] -translate-y-1/2 rounded-full bg-terre-de-dakar/20 blur-[140px]" />
        <div className="absolute -bottom-20 left-1/3 h-[36rem] w-[36rem] rounded-full bg-or-karite/10 blur-[150px]" />
      </div>

      {/* Barre de progression + en-tête de contexte */}
      <div className="relative z-10 w-full border-b border-ivoire-bouye/10 bg-encre-baobab/70 px-space-lg py-space-md backdrop-blur-md lg:px-space-2xl">
        <div className="mx-auto flex max-w-desktop-max flex-col gap-space-xs">
          <div className="flex items-center justify-between gap-space-md">
            <div className="flex items-center gap-space-md">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-or-karite/10 text-or-karite">
                <IconeBoussole className="h-4 w-4" />
              </span>
              <div className="flex flex-col">
                <span className="font-interface text-caption-meta uppercase tracking-[0.25em] text-or-karite">
                  Maison SHÉA
                </span>
                <span className="hidden font-interface text-caption-meta text-sable/80 sm:block">
                  Diagnostic sensoriel &amp; correspondance d&apos;escale
                </span>
              </div>
            </div>
            <div className="flex items-center gap-space-lg">
              <span className="hidden font-interface text-label-tabular text-sable sm:inline">
                Étape <span className="font-medium text-or-karite">{String(etapeIndex + 1).padStart(2, "0")}</span> sur{" "}
                {String(TOTAL_QUESTIONS).padStart(2, "0")}
              </span>
              {/* aria-label sur le Link : même bug que le header vitrine
                  (app/(vitrine)/layout.tsx, Vague 5) — sous md, le libellé texte
                  disparaît (hidden md:inline) et l'icône est aria-hidden, donc le
                  lien n'a plus aucun nom accessible (WCAG 4.1.2). */}
              <Link
                href="/shea"
                aria-label="Quitter l'expérience"
                className="flex items-center gap-space-xs font-interface text-caption-meta tracking-wider text-sable/70 transition-colors duration-300 ease-out hover:text-or-karite"
              >
                <span className="hidden md:inline" aria-hidden="true">Quitter l&apos;expérience</span>
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-encre-baobab/80">
                  <IconeCroix className="h-[15px] w-[15px]" />
                </span>
              </Link>
            </div>
          </div>
          <div className="relative h-[2px] w-full overflow-hidden rounded-full bg-sable/15">
            <div
              className="h-full rounded-full bg-gradient-to-r from-ocre-solaire via-or-karite to-sauge-claire transition-[width] duration-500 ease-out"
              style={{ width: `${progression}%` }}
            />
          </div>
        </div>
      </div>

      {/* Question active */}
      <main
        className={cn(
          "relative z-10 mx-auto flex w-full max-w-desktop-max flex-1 flex-col justify-between px-space-lg py-space-xl transition-opacity duration-500 ease-out lg:px-space-2xl",
          visible ? "opacity-100" : "opacity-0",
        )}
      >
        <div className="mx-auto mb-space-lg mt-space-sm flex max-w-[780px] flex-col items-center text-center">
          <div className="mb-space-sm inline-flex items-center gap-space-xs rounded-full bg-or-karite/10 px-space-md py-1 font-interface text-caption-meta uppercase tracking-[0.2em] text-or-karite">
            <IconeEtincelle className="h-[14px] w-[14px]" />
            {questionActive.eyebrow}
          </div>
          <h1 className="font-display text-headline-lg-mobile font-light leading-tight tracking-wide text-ivoire-bouye lg:text-headline-lg">
            {questionActive.titre}
          </h1>
          <p className="mt-space-xs max-w-reading-max font-interface text-body-reading font-light leading-relaxed text-sable/85">
            {questionActive.soustitre}
          </p>
        </div>

        <div
          role="radiogroup"
          aria-label={questionActive.titre}
          className="my-space-md grid w-full grid-cols-1 items-stretch gap-space-lg md:grid-cols-2 xl:grid-cols-4"
        >
          {questionActive.options.map((option) => {
            const selectionnee = optionChoisieId === option.id;
            return (
              <button
                key={option.id}
                type="button"
                role="radio"
                aria-checked={selectionnee}
                onClick={() => choisirOption(option.id)}
                className={cn(
                  "group relative flex cursor-pointer flex-col overflow-hidden rounded-xl bg-encre-baobab/65 text-left shadow-lg transition-all duration-300 ease-out hover:-translate-y-1 hover:bg-encre-baobab/90 hover:shadow-[0_16px_36px_rgba(27,42,35,0.5)]",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-or-karite focus-visible:ring-offset-2 focus-visible:ring-offset-encre-baobab",
                  selectionnee &&
                    "-translate-y-1.5 bg-encre-baobab/85 shadow-[0_16px_40px_rgba(27,42,35,0.6)] ring-2 ring-or-karite",
                )}
              >
                <div className="relative h-56 w-full overflow-hidden sm:h-64">
                  {option.image ? (
                    <Image
                      src={option.image}
                      alt=""
                      fill
                      sizes="(min-width: 1280px) 25vw, (min-width: 768px) 50vw, 100vw"
                      className="object-cover object-center brightness-95 contrast-105 transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                  ) : (
                    <div className={cn("absolute inset-0", option.degrade)} />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-encre-baobab via-encre-baobab/40 to-transparent" />
                  <div
                    className={cn(
                      "absolute right-space-md top-space-md flex h-8 w-8 items-center justify-center rounded-full text-sable/40 transition-colors group-hover:text-or-karite",
                      selectionnee ? "bg-or-karite font-bold text-encre-baobab" : "bg-encre-baobab/70",
                    )}
                    aria-hidden="true"
                  >
                    {selectionnee ? <IconeCoche className="h-[16px] w-[16px]" /> : <IconeCercle className="h-[16px] w-[16px]" />}
                  </div>
                  <div className="absolute bottom-space-sm left-space-md">
                    <span className="rounded bg-encre-baobab/90 px-space-xs py-0.5 font-interface text-caption-meta uppercase tracking-wider text-sable/90">
                      {option.famille}
                    </span>
                  </div>
                </div>
                <div className="flex flex-1 flex-col justify-between bg-gradient-to-b from-encre-baobab/80 to-encre-baobab p-space-lg">
                  <div>
                    <div className="mb-space-xxs flex items-center justify-between">
                      <span className="font-label-tabular text-label-tabular tracking-widest text-sable/70">
                        {option.repere}
                      </span>
                    </div>
                    <h3 className="mb-space-xs font-display text-headline-sm tracking-tight text-ivoire-bouye">
                      {option.titre}
                    </h3>
                    <p className="font-interface text-body-ui font-light leading-relaxed text-sable/80">
                      {option.description}
                    </p>
                  </div>
                  <div className="mt-space-md flex items-center justify-end border-t border-sable/20 pt-space-xs font-interface text-caption-meta">
                    <span className={selectionnee ? "font-medium text-or-karite" : "text-sable/40 transition-colors group-hover:text-or-karite"}>
                      {selectionnee ? "Sélectionné" : "Choisir"}
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Navigation bas de page */}
        <footer className="flex w-full flex-col-reverse items-center justify-between gap-space-md pb-space-lg pt-space-md sm:flex-row">
          <button
            type="button"
            onClick={allerPrecedent}
            disabled={etapeIndex === 0}
            className="flex items-center gap-space-xs rounded-lg px-space-md py-space-sm font-interface text-body-ui text-sable/80 transition-colors duration-300 ease-out hover:bg-ivoire-bouye/5 hover:text-ivoire-bouye disabled:pointer-events-none disabled:opacity-0"
          >
            <IconeFlecheGauche className="h-[18px] w-[18px]" />
            <span>Étape précédente</span>
          </button>

          <div className="flex items-center gap-space-sm" aria-hidden="true">
            {QUESTIONS.map((question, index) => (
              <span
                key={question.id}
                className={cn(
                  "h-2.5 w-2.5 rounded-full transition-colors duration-300 ease-out",
                  index < etapeIndex && "bg-or-karite shadow-[0_0_8px_rgba(217,178,106,0.6)]",
                  index === etapeIndex && "h-3.5 w-3.5 bg-ivoire-bouye ring-2 ring-or-karite",
                  index > etapeIndex && "bg-sable/30",
                )}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={allerSuivant}
            disabled={!optionChoisieId}
            className="group inline-flex items-center justify-center gap-space-sm rounded-lg bg-terre-de-dakar px-space-xl py-space-md font-interface text-body-ui uppercase tracking-wider text-ivoire-bouye shadow-ambient transition-all duration-300 ease-out hover:brightness-90 disabled:pointer-events-none disabled:opacity-40"
          >
            <span className="font-medium">
              {etapeIndex === TOTAL_QUESTIONS - 1
                ? "Découvrir mon escale"
                : `Poursuivre le voyage (${etapeIndex + 1}/${TOTAL_QUESTIONS})`}
            </span>
            <IconeFlecheDroite className="h-[18px] w-[18px] transition-transform group-hover:translate-x-1" />
          </button>
        </footer>
      </main>
    </div>
  );
}

function IconeBoussole({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.4" />
      <path d="m14.5 9.5-2 5-3-1 2-5 3 1Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
    </svg>
  );
}

function IconeCroix({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function IconeEtincelle({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M12 2c.6 3.8 2.2 5.4 6 6-3.8.6-5.4 2.2-6 6-.6-3.8-2.2-5.4-6-6 3.8-.6 5.4-2.2 6-6Z" />
    </svg>
  );
}

function IconeCoche({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <path d="m5 12 5 5 9-10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconeCercle({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

function IconeFlecheGauche({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <path d="M19 12H5M11 6l-6 6 6 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconeFlecheDroite({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
