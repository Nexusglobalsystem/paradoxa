/**
 * POST /api/laboratoire/generation — AI-assisted perfume formula generation.
 *
 * Server-only route handler (CLAUDE.md rule 6 / .claude/agents/ia-composition.md):
 * ANTHROPIC_API_KEY is read from process.env here and never reaches the
 * client bundle. Flow: authenticate + require admin -> rate-limit -> load
 * the real active `matieres` catalogue -> ask the model, retrying once on
 * an invalid response -> reject any hallucinated material id -> balance the
 * φ pyramid with the real formulation engine -> persist a *brouillon*
 * formula -> return it. The generated formula is always a proposal
 * (`statut: "brouillon"`), never auto-validated.
 */
import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

import { FAMILLES_OLFACTIVES } from "@/components/laboratoire/familles-olfactives";
import { equilibrerFormule, type Formule, type LigneFormule } from "@/packages/formulation";
import { createClient } from "@/lib/supabase/server";

import { journaliserCoutGeneration, MODELE_GENERATION } from "./cout";
import { GenerationInvalideError, genererPropositionAvecRetry } from "./generer-proposition";
import { chargerMatieresDisponibles } from "./matieres";
import { LIMITE_GENERATIONS_PAR_FENETRE, limiteurGenerationGlobal } from "./rate-limit";
import {
  BORNES_DENSITE,
  ContraintesGenerationSchema,
  LABELS_BUDGET,
  type ContraintesGeneration,
  type MatiereDisponible,
  type ReponseGenerationErreur,
  type ReponseGenerationSucces,
} from "./schema";

export const runtime = "nodejs";

export const AVERTISSEMENT_PROPOSITION =
  "Proposition générée par intelligence artificielle — jamais une validation. Un parfumeur doit vérifier et valider cette formule avant toute production.";

const LABELS_DENSITE: Record<ContraintesGeneration["densite"], string> = {
  minimaliste: BORNES_DENSITE.minimaliste.label,
  equilibre: BORNES_DENSITE.equilibre.label,
  complexe: BORNES_DENSITE.complexe.label,
};

function construirePrompts(contraintes: ContraintesGeneration, matieres: Map<string, MatiereDisponible>) {
  const listeMatieres = [...matieres.values()].map((m) => ({
    id: m.id,
    nom: m.nom,
    famille: m.familleOlfactive,
    volatiliteTypique: m.volatilite,
    puissance: m.puissance,
    prixKg: m.prixParKg,
  }));

  const systemPrompt = [
    "Tu es le moteur de composition assistée du Laboratoire LA PARADOXA, groupe de haute parfumerie française.",
    "Tu proposes une formule de PARFUM (jamais un produit cosmétique) structurée en trois étages : fond, cœur, tête.",
    'RÈGLE ABSOLUE : tu ne peux utiliser QUE les matières listées dans le message utilisateur, en référençant leur "id" exact, recopié tel quel. Toute autre matière, ou tout id inventé, sera automatiquement rejetée et ignorée.',
    "Réponds UNIQUEMENT avec un objet JSON strict, sans texte avant ou après, sans balises Markdown, exactement au format :",
    '{"nom": string, "phraseRecit": string, "lignes": [{"matiereId": string, "etage": "fond" | "coeur" | "tete"}, ...]}',
    '"nom" est un nom de parfum évocateur en français. "phraseRecit" est une unique phrase courte et sensorielle, style haute parfumerie, racontant le parfum.',
    "Chaque étage (fond, cœur, tête) doit contenir au moins une matière. Ne répète jamais le même id.",
    `Vise ${LABELS_DENSITE[contraintes.densite]} au total.`,
  ].join("\n");

  const lignesContraintes = [
    `Maison d'attache : ${contraintes.maison === "shea" ? "SHÉA (parfums)" : "ÉCLORÉE (soins)"}.`,
    contraintes.genre ? `Genre visé : ${contraintes.genre}.` : null,
    contraintes.familleDominante
      ? `Famille olfactive dominante souhaitée : ${FAMILLES_OLFACTIVES[contraintes.familleDominante].label}.`
      : null,
    `Concentration cible : ${contraintes.concentration.toUpperCase()}.`,
    contraintes.budget ? `Budget matière : ${LABELS_BUDGET[contraintes.budget]}.` : null,
  ].filter((ligne): ligne is string => Boolean(ligne));

  const userPrompt = [
    `Description recherchée par le parfumeur :\n"""${contraintes.prompt}"""`,
    "",
    "Contraintes :",
    ...lignesContraintes,
    "",
    "Matières disponibles (utilise uniquement ces \"id\", recopiés tels quels) :",
    JSON.stringify(listeMatieres),
  ].join("\n");

  return { systemPrompt, userPrompt };
}

function erreurJson(erreur: string, status: number, details?: string[]) {
  const corps: ReponseGenerationErreur = details ? { erreur, details } : { erreur };
  return NextResponse.json(corps, { status });
}

export async function POST(request: Request) {
  let corpsBrut: unknown;
  try {
    corpsBrut = await request.json();
  } catch {
    return erreurJson("Corps de requête JSON invalide.", 400);
  }

  const parseContraintes = ContraintesGenerationSchema.safeParse(corpsBrut);
  if (!parseContraintes.success) {
    return erreurJson(
      "Contraintes invalides.",
      400,
      parseContraintes.error.issues.map((i) => i.message),
    );
  }
  const contraintes = parseContraintes.data;

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return erreurJson("Authentification requise.", 401);
  }

  const { data: profil } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (profil?.role !== "admin") {
    // Même traitement qu'un utilisateur non connecté — voir
    // app/(admin)/(protected)/layout.tsx : on ne révèle jamais l'existence
    // du rôle admin à un compte non-admin.
    return erreurJson("Authentification requise.", 401);
  }

  const verificationDebit = limiteurGenerationGlobal.verifier(user.id);
  if (!verificationDebit.autorise) {
    const minutes = Math.ceil(verificationDebit.reinitialisationDansMs / 60000);
    return NextResponse.json(
      {
        erreur: `Limite de ${LIMITE_GENERATIONS_PAR_FENETRE} générations atteinte. Réessayez dans ${minutes} minute${minutes > 1 ? "s" : ""}.`,
      } satisfies ReponseGenerationErreur,
      {
        status: 429,
        headers: { "Retry-After": String(Math.ceil(verificationDebit.reinitialisationDansMs / 1000)) },
      },
    );
  }

  let matieres: Map<string, MatiereDisponible>;
  try {
    matieres = await chargerMatieresDisponibles(supabase);
  } catch (error) {
    console.error("laboratoire.generation.erreur_matieres", error);
    return erreurJson("Impossible de charger la base de matières.", 500);
  }

  if (matieres.size === 0) {
    return erreurJson(
      "Aucune matière active en base — impossible de générer une formule. Ajoutez des matières dans la bibliothèque du laboratoire avant de composer.",
      422,
    );
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return erreurJson(
      "Génération IA indisponible : ANTHROPIC_API_KEY n'est pas configurée côté serveur (voir .env.local / .env.example).",
      500,
    );
  }

  const client = new Anthropic({ apiKey });
  const { systemPrompt, userPrompt } = construirePrompts(contraintes, matieres);

  let resultatGeneration;
  try {
    resultatGeneration = await genererPropositionAvecRetry({
      client,
      model: MODELE_GENERATION,
      systemPrompt,
      userPrompt,
      bornes: BORNES_DENSITE[contraintes.densite],
      matieresDisponibles: matieres,
      onUsage: (usage, tentative) => {
        journaliserCoutGeneration({ userId: user.id, tentative, usage });
      },
    });
  } catch (error) {
    if (error instanceof GenerationInvalideError) {
      console.warn("laboratoire.generation.invalide", error.details);
      return erreurJson(error.message, 502, error.details);
    }
    if (error instanceof Anthropic.AuthenticationError) {
      return erreurJson("Clé API Anthropic invalide — contactez un administrateur.", 500);
    }
    if (error instanceof Anthropic.RateLimitError) {
      return erreurJson("Le service de génération IA est temporairement surchargé. Réessayez dans quelques instants.", 503);
    }
    if (error instanceof Anthropic.APIError) {
      return erreurJson(`Erreur du service de génération IA : ${error.message}`, 502);
    }
    console.error("laboratoire.generation.erreur_inattendue", error);
    return erreurJson("Erreur inattendue lors de la génération. Réessayez.", 500);
  }

  const { proposition, matieresIgnorees, tentatives } = resultatGeneration;

  // Balance the φ pyramid (50/31/19, golden-ratio decay within each étage)
  // with the real formulation engine — the model only chose materials and
  // their étage; the actual percentages are always computed here, never
  // trusted from the model.
  const lignesEquilibrees = equilibrerFormule(proposition.lignes);

  const { data: formuleInseree, error: erreurFormule } = await supabase
    .from("formules")
    .insert({
      nom: proposition.nom,
      maison: contraintes.maison,
      type_formule: "parfum",
      type_concentration: contraintes.concentration,
      statut: "brouillon",
      description: proposition.phraseRecit,
      notes: AVERTISSEMENT_PROPOSITION,
      created_by: user.id,
      updated_by: user.id,
    })
    .select("id, poids_reference_g")
    .single();

  if (erreurFormule || !formuleInseree) {
    console.error("laboratoire.generation.erreur_persistance_formule", erreurFormule);
    return erreurJson("La formule a été générée mais n'a pas pu être enregistrée. Réessayez.", 500);
  }

  const poidsReferenceG = Number(formuleInseree.poids_reference_g);
  const lignesAInserer = lignesEquilibrees.map((ligne, index) => ({
    formule_id: formuleInseree.id as string,
    matiere_id: ligne.id,
    etage: ligne.etage,
    pourcentage: ligne.pourcentage,
    grammes: (ligne.pourcentage / 100) * poidsReferenceG,
    ordre: index,
  }));

  const { data: lignesInserees, error: erreurLignes } = await supabase
    .from("formule_lignes")
    .insert(lignesAInserer)
    .select("id, matiere_id, etage, pourcentage");

  if (erreurLignes || !lignesInserees) {
    console.error("laboratoire.generation.erreur_persistance_lignes", erreurLignes);
    // Never leave a half-applied formula: roll back the orphan header row.
    await supabase.from("formules").delete().eq("id", formuleInseree.id as string);
    return erreurJson("La formule a été générée mais n'a pas pu être enregistrée. Réessayez.", 500);
  }

  const lignesParMatiereId = new Map(lignesEquilibrees.map((l) => [l.id, l]));
  const lignesFinales: LigneFormule[] = lignesInserees.map((row) => {
    const source = lignesParMatiereId.get(row.matiere_id as string);
    return {
      ...(source as LigneFormule),
      id: row.id as string,
      etage: row.etage as LigneFormule["etage"],
      pourcentage: Number(row.pourcentage),
    };
  });

  const formule: Formule = {
    id: formuleInseree.id as string,
    nom: proposition.nom,
    maison: contraintes.maison,
    type: "parfum",
    lignes: lignesFinales,
  };

  const reponse: ReponseGenerationSucces = {
    formuleId: formuleInseree.id as string,
    formule,
    phraseRecit: proposition.phraseRecit,
    matieresIgnorees,
    tentatives,
    avertissement: AVERTISSEMENT_PROPOSITION,
  };

  return NextResponse.json(reponse, { status: 201 });
}
