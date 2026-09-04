/**
 * Placeholder éditorial — à remplacer par une requête `produits` réelle
 * quand le catalogue existe (Vague 3). La table Supabase `produits` est
 * vide à ce stade (peuplée par un autre chantier, hors périmètre ici).
 *
 * Quatre soins de la « Collection Signature », noms, contenances et prix
 * inventés mais cohérents avec l'univers ÉCLORÉE (soin naturel karité et
 * moringa). Une seule photographie de contenant existe dans
 * /public/images (pot-cosmetique-verre-depoli.png) : elle illustre les
 * quatre cartes en attendant le catalogue et ses visuels dédiés par
 * référence.
 */
export interface Bestseller {
  nom: string;
  categorie: string;
  description: string;
  prixEuros: number;
  volumeMl: number;
  statut: "En stock" | "Culte";
}

export const BESTSELLERS: Bestseller[] = [
  {
    nom: "Baume Prodigieux Karité Sauvage",
    categorie: "100 % karité brut non raffiné",
    description: "Baume multi-usages pour zones très sèches, lèvres et pointes.",
    prixEuros: 62,
    volumeMl: 100,
    statut: "En stock",
  },
  {
    nom: "Élixir Botanique Moringa & Squalane",
    categorie: "Huile sèche régénérante",
    description: "Soin d'éclat instantané, lisse le grain et combat les radicaux libres.",
    prixEuros: 78,
    volumeMl: 50,
    statut: "En stock",
  },
  {
    nom: "Crème Riche Veloutée Visage",
    categorie: "Émulsion soyeuse nutritive",
    description: "Céramides végétales et beurres précieux pour une peau souple et repulpée.",
    prixEuros: 85,
    volumeMl: 50,
    statut: "Culte",
  },
  {
    nom: "Masque Réparateur Intense Cheveux",
    categorie: "Kératine végétale & karité",
    description: "Soin profond restructurant anti-casse pour longueurs dévitalisées.",
    prixEuros: 54,
    volumeMl: 200,
    statut: "En stock",
  },
];

/** Formate un prix en euros avec chiffres tabulaires (règle CLAUDE.md). */
export function formatPrixEuros(prix: number): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  }).format(prix);
}
