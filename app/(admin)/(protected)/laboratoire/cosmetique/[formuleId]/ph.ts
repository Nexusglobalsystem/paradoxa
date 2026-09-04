/**
 * pH cible de la formule cosmétique (bandeau "Cible pH cuticulaire" de la
 * maquette, panneau d'analyse écran 34) — DÉCISION ASSUMÉE, à valider :
 * supabase/migrations/20260903193612_formules.sql n'a aucune colonne pH
 * dédiée (seuls description/notes existent en texte libre) et ajouter une
 * colonne est hors périmètre de cet écran (migrations exclues du chantier).
 *
 * Plutôt que de laisser le pH cible non persisté (perdu à chaque
 * rechargement, ce qui contredit l'exigence "on ne perd jamais une
 * formule" — .claude/agents/frontend-laboratoire.md), il est sérialisé
 * comme un préfixe reconnaissable en première ligne de formules.notes, et
 * extrait à la lecture. Le reste de notes (jamais édité depuis ce
 * composeur, exactement comme pour le composeur de parfum) est préservé
 * tel quel autour de ce préfixe.
 *
 * Alternative envisagée et écartée : un champ purement côté client (jamais
 * persisté). Rejetée pour la même raison — un labo de formulation ne doit
 * jamais perdre une donnée saisie.
 */
const MARQUEUR_PH = /^\[pH cible : ([0-9]+(?:[.,][0-9]+)?)\]\n?/;

export interface NotesEtPh {
  phCible: number | null;
  resteNotes: string | null;
}

export function extrairePhCible(notes: string | null): NotesEtPh {
  if (!notes) return { phCible: null, resteNotes: notes };

  const correspondance = notes.match(MARQUEUR_PH);
  if (!correspondance) return { phCible: null, resteNotes: notes };

  const valeur = Number(correspondance[1].replace(",", "."));
  const reste = notes.slice(correspondance[0].length);
  return {
    phCible: Number.isFinite(valeur) ? valeur : null,
    resteNotes: reste.length > 0 ? reste : null,
  };
}

export function injecterPhCible(phCible: number | null, resteNotes: string | null): string | null {
  const base = resteNotes ?? "";
  if (phCible === null || !Number.isFinite(phCible)) {
    return base.length > 0 ? base : null;
  }
  return `[pH cible : ${phCible.toFixed(2)}]\n${base}`;
}
