/**
 * Placeholder éditorial — à remplacer par une requête `produits` réelle
 * quand le catalogue existe (Vague 3). La table Supabase `produits` est
 * vide à ce stade (peuplée par un autre chantier, hors périmètre ici).
 *
 * Six flacons de la collection « Les Six Escales », noms, escales et prix
 * inventés mais cohérents avec l'univers SHÉA (haute parfumerie sahélienne).
 * Une seule photographie de flacon existe dans /public/images
 * (flacon-parfum-ambre.png) : elle illustre les six cartes en attendant le
 * catalogue et ses visuels dédiés par référence.
 */
export interface Flacon {
  numero: string;
  nom: string;
  escale: string;
  famille: string;
  description: string;
  prixEuros: number;
  volumeMl: number;
}

export const FLACONS: Flacon[] = [
  {
    numero: "01",
    nom: "Bois de Shéa",
    escale: "Dakar",
    famille: "Boisé ambré solaire",
    description:
      "Écorces fumées de l'anse de Ouakam, amande de karité torréfiée et encens royal du golfe.",
    prixEuros: 185,
    volumeMl: 100,
  },
  {
    numero: "02",
    nom: "Poussière d'Ocre",
    escale: "Sahel",
    famille: "Résines & cuir végétal",
    description:
      "Le souffle de la brousse chauffée à blanc, accord cuir tanné à l'acacia et résines d'oliban.",
    prixEuros: 185,
    volumeMl: 100,
  },
  {
    numero: "03",
    nom: "Ombre de Baobab",
    escale: "Bandia",
    famille: "Écorce, sève & épices sauvages",
    description:
      "Fraîcheur minérale au creux du tronc millénaire, pulpe de pain de singe et cardamome sauvage.",
    prixEuros: 195,
    volumeMl: 100,
  },
  {
    numero: "04",
    nom: "Fleur de Karité",
    escale: "Fleuve Sénégal",
    famille: "Pétales blanches & cire solaire",
    description:
      "Éclosion matinale de la fleur d'arbre sacré, voile lacté de cire d'abeille et néroli.",
    prixEuros: 185,
    volumeMl: 100,
  },
  {
    numero: "05",
    nom: "Safran de Ziguinchor",
    escale: "Casamance",
    famille: "Épices chaudes & encens noir",
    description:
      "Chaleur moite des berges fluviales, pistils safranés précieux, manglier rouge et benjoin nocturne.",
    prixEuros: 210,
    volumeMl: 100,
  },
  {
    numero: "06",
    nom: "Vent d'Harmattan",
    escale: "L'Océan & Dunes",
    famille: "Cristaux de sel & vétiver doré",
    description:
      "Courant d'air chaud chargé de silice dorée, éclats d'embruns atlantiques et racines de vétiver séchées.",
    prixEuros: 185,
    volumeMl: 100,
  },
];

/** Formate un prix en euros avec chiffres tabulaires (règle CLAUDE.md). */
export function formatPrixEuros(prix: number): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(prix);
}
