"use client";

import { useCallback, useState } from "react";

import { Button, Card, CardContent, Field, Textarea } from "@/components/ui";
import { FAMILLES_OLFACTIVES, ORDRE_FAMILLES } from "@/components/laboratoire/familles-olfactives";
import type { FamilleOlfactive } from "@/packages/formulation";

import type {
  ContraintesGeneration,
  ReponseGenerationErreur,
  ReponseGenerationSucces,
} from "@/app/api/laboratoire/generation/schema";

import { ChipGroup } from "./chip-group";
import { ResultatFormule } from "./resultat-formule";
import { StrataLoading } from "./strata-loading";

type MaisonChoix = "shea" | "ecloree";
type GenreChoix = "" | "feminin" | "masculin" | "mixte";
type FamilleChoix = "" | FamilleOlfactive;
type ConcentrationChoix = "edt" | "edp" | "extrait";
type DensiteChoix = "minimaliste" | "equilibre" | "complexe";
type BudgetChoix = "" | "economique" | "standard" | "prestige";

type Etat =
  | { statut: "idle" }
  | { statut: "chargement" }
  | { statut: "erreur"; message: string; details?: string[] }
  | { statut: "succes"; resultat: ReponseGenerationSucces };

// Labels sourced from components/laboratoire/familles-olfactives.ts — the
// single source of truth shared with the matières library (écran 30) and
// the parfum composer (écran 32), so this chip list never drifts from
// theirs. "actifs_cosmetiques" is omitted: it's a cosmétique-only family,
// out of place as a dominant note for a parfum generation.
const FAMILLES: ReadonlyArray<{ value: FamilleChoix; label: string }> = [
  { value: "", label: "Laisser le modèle libre" },
  ...ORDRE_FAMILLES.filter((f) => f !== "actifs_cosmetiques").map((f) => ({
    value: f,
    label: FAMILLES_OLFACTIVES[f].label,
  })),
];

const PROMPT_MIN_LENGTH = 10;

export function GenerationStudio() {
  const [prompt, setPrompt] = useState("");
  const [maison, setMaison] = useState<MaisonChoix>("shea");
  const [genre, setGenre] = useState<GenreChoix>("");
  const [famille, setFamille] = useState<FamilleChoix>("boise_resines");
  const [concentration, setConcentration] = useState<ConcentrationChoix>("extrait");
  const [densite, setDensite] = useState<DensiteChoix>("minimaliste");
  const [budget, setBudget] = useState<BudgetChoix>("");
  const [etat, setEtat] = useState<Etat>({ statut: "idle" });

  const composer = useCallback(async () => {
    setEtat({ statut: "chargement" });

    const contraintes: ContraintesGeneration = {
      prompt,
      maison,
      concentration,
      densite,
      ...(genre ? { genre } : {}),
      ...(famille ? { familleDominante: famille } : {}),
      ...(budget ? { budget } : {}),
    };

    try {
      const reponse = await fetch("/api/laboratoire/generation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(contraintes),
      });
      const corps = (await reponse.json()) as ReponseGenerationSucces | ReponseGenerationErreur;

      if (!reponse.ok || "erreur" in corps) {
        const erreurCorps = corps as ReponseGenerationErreur;
        setEtat({ statut: "erreur", message: erreurCorps.erreur, details: erreurCorps.details });
        return;
      }

      setEtat({ statut: "succes", resultat: corps });
    } catch {
      setEtat({
        statut: "erreur",
        message: "Impossible de contacter le service de génération. Vérifiez votre connexion et réessayez.",
      });
    }
  }, [prompt, maison, genre, famille, concentration, densite, budget]);

  const promptValide = prompt.trim().length >= PROMPT_MIN_LENGTH;
  const enCours = etat.statut === "chargement";

  return (
    <div data-maison="groupe">
      <section className="bg-encre-baobab px-space-lg py-space-2xl text-ivoire-bouye lg:px-space-2xl lg:py-space-3xl">
        <div className="mx-auto max-w-[1200px] space-y-space-xl">
          <div className="flex flex-col gap-space-md md:flex-row md:items-center md:justify-between">
            <span className="font-caption-meta text-caption-meta uppercase tracking-[0.25em] text-or-karite">
              Laboratoire de composition assistée — intelligence olfactive
            </span>
            <div className="flex items-center gap-space-xs rounded-full bg-ivoire-bouye/10 px-space-sm py-space-xxs">
              <span className="h-2 w-2 rounded-full bg-sauge-claire" aria-hidden="true" />
              <span className="font-label-tabular text-label-tabular text-sauge-claire">Moteur φ actif</span>
            </div>
          </div>

          <div className="max-w-3xl space-y-space-sm">
            <h1 className="font-display text-headline-lg text-ivoire-bouye">
              Génération assistée d&rsquo;accords &amp; de sillages
            </h1>
            <p className="font-interface text-body-reading text-sable/80">
              Décrivez l&rsquo;émotion, le terroir ou l&rsquo;architecture olfactive recherchée. Le moteur
              compose une proposition de formule respectant le ratio d&rsquo;or φ (50&nbsp;% fond ·
              31&nbsp;% cœur · 19&nbsp;% tête), en s&rsquo;appuyant exclusivement sur les matières réellement
              présentes dans votre bibliothèque.
            </p>
          </div>

          <Card className="border border-ivoire-bouye/10 bg-ivoire-bouye/5 backdrop-blur-md">
            <CardContent className="space-y-space-xl">
              <div className="space-y-space-xs">
                <Field id="ai-prompt" label="Formulation descriptive — architecture sensorielle" required>
                  <Textarea
                    value={prompt}
                    onChange={(event) => setPrompt(event.target.value)}
                    rows={4}
                    maxLength={2000}
                    placeholder="Décrivez l'émotion, le terroir ou l'architecture olfactive recherchée…"
                    className="border-ivoire-bouye/20 bg-transparent text-ivoire-bouye placeholder:text-sable/40 focus:border-or-karite"
                  />
                </Field>
                <p className="text-right font-label-tabular text-label-tabular text-sable/50">
                  {prompt.length} caractères
                </p>
              </div>

              <div className="grid grid-cols-1 gap-space-lg md:grid-cols-2 lg:grid-cols-3">
                <ChipGroup<MaisonChoix>
                  legend="Maison d'attache"
                  value={maison}
                  onChange={setMaison}
                  options={[
                    { value: "shea", label: "Maison SHÉA — Parfums" },
                    { value: "ecloree", label: "Maison ÉCLORÉE — Soins" },
                  ]}
                />
                <ChipGroup<GenreChoix>
                  legend="Genre"
                  optional
                  value={genre}
                  onChange={setGenre}
                  options={[
                    { value: "", label: "Sans préférence" },
                    { value: "feminin", label: "Féminin" },
                    { value: "masculin", label: "Masculin" },
                    { value: "mixte", label: "Mixte" },
                  ]}
                />
                <ChipGroup<ConcentrationChoix>
                  legend="Concentration cible"
                  value={concentration}
                  onChange={setConcentration}
                  options={[
                    { value: "extrait", label: "Extrait (28-32%)" },
                    { value: "edp", label: "Eau de Parfum (18-22%)" },
                    { value: "edt", label: "Eau de Toilette (8-14%)" },
                  ]}
                />
                <ChipGroup<FamilleChoix>
                  legend="Famille dominante"
                  optional
                  value={famille}
                  onChange={setFamille}
                  options={FAMILLES}
                  className="lg:col-span-2"
                />
                <ChipGroup<DensiteChoix>
                  legend="Densité d'ingrédients"
                  value={densite}
                  onChange={setDensite}
                  options={[
                    { value: "minimaliste", label: "Minimaliste (7-9)" },
                    { value: "equilibre", label: "Équilibré (9-12)" },
                    { value: "complexe", label: "Complexe (12-15)" },
                  ]}
                />
                <ChipGroup<BudgetChoix>
                  legend="Budget matière"
                  optional
                  value={budget}
                  onChange={setBudget}
                  options={[
                    { value: "", label: "Sans préférence" },
                    { value: "economique", label: "Économique (< 20 €/kg)" },
                    { value: "standard", label: "Standard (20-50 €/kg)" },
                    { value: "prestige", label: "Prestige (> 50 €/kg)" },
                  ]}
                />
              </div>

              <div className="flex flex-col items-center justify-between gap-space-md border-t border-ivoire-bouye/10 pt-space-md sm:flex-row">
                <p className="font-caption-meta text-caption-meta text-sable/70">
                  Modèle d&rsquo;alignement φ : 50&nbsp;% fond · 31&nbsp;% cœur · 19&nbsp;% tête
                </p>
                <Button
                  onClick={composer}
                  disabled={!promptValide || enCours}
                  size="lg"
                  className="w-full bg-terre-de-dakar text-ivoire-bouye hover:brightness-90 sm:w-auto"
                >
                  {enCours ? "Harmonisation en cours…" : "Composer"}
                </Button>
              </div>
              {!promptValide && prompt.length > 0 ? (
                <p className="font-caption-meta text-caption-meta text-sable/50">
                  Décrivez votre intention en au moins {PROMPT_MIN_LENGTH} caractères.
                </p>
              ) : null}
            </CardContent>
          </Card>
        </div>
      </section>

      <section
        aria-live="polite"
        className="bg-encre-baobab px-space-lg pb-space-3xl pt-space-lg text-ivoire-bouye lg:px-space-2xl"
      >
        <div className="mx-auto max-w-[1200px] space-y-space-xl">
          {etat.statut === "chargement" ? <StrataLoading /> : null}

          {etat.statut === "erreur" ? (
            <div
              role="alert"
              className="space-y-space-xs rounded-lg border border-rouge-bissap/50 bg-rouge-bissap/10 p-space-lg"
            >
              <p className="font-interface text-body-ui text-ivoire-bouye">{etat.message}</p>
              {etat.details && etat.details.length > 0 ? (
                <ul className="list-disc space-y-space-xxs pl-space-lg font-caption-meta text-caption-meta text-sable/70">
                  {etat.details.map((detail) => (
                    <li key={detail}>{detail}</li>
                  ))}
                </ul>
              ) : null}
            </div>
          ) : null}

          {etat.statut === "succes" ? (
            <ResultatFormule resultat={etat.resultat} concentration={concentration} onRegenerer={composer} />
          ) : null}
        </div>
      </section>
    </div>
  );
}
