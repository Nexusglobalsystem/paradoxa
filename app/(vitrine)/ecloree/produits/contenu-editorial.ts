/**
 * Contenu éditorial des 4 soins ÉCLORÉE — /ecloree/rituel-tete ET
 * /ecloree/produits/[slug] importent ce fichier (source unique).
 *
 * ── Pourquoi ce fichier existe (règle CLAUDE.md n°2, non négociable) ──────
 * Comme pour SHÉA, cette fiche publique ne lit jamais `formules` ni
 * `formule_lignes`. L'onglet "Ingrédients" n'affiche donc pas de vraie liste
 * INCI (celle-ci vivrait, si elle existait, dans une table de laboratoire
 * réservée au rôle admin) : uniquement un texte éditorial général sur le
 * procédé de formulation, avec un encart "INCI disponible sur demande".
 * `masque-reparateur-intense-cheveux` a un `formule_id` renseigné en base —
 * on ne le lit jamais ici, il ne sert nulle part dans ce fichier.
 */

export interface Bienfait {
  titre: string;
  description: string;
}

export interface ContenuEditorialSoin {
  /** Badges courts sous le titre. */
  familles: string[];
  /** Sous-titre italique sous le nom. */
  accroche: string;
  /** Image principale (aucun produit n'a de `image_url` renseigné en base). */
  image: string;
  imageAlt: string;
  bienfaits: Bienfait[];
  ingredientsTexte: string;
  utilisation: string;
  engagements: string;
}

export const CONTENU_SOINS: Record<string, ContenuEditorialSoin> = {
  "baume-prodigieux-karite-sauvage": {
    familles: ["Nourrissant", "Réparateur", "Corps & mains"],
    accroche: "Baume 100 % karité brut — pour les zones les plus sèches",
    image: "/images/macro-karite-brut.png",
    imageAlt: "Beurre de karité brut et doré, texture crayeuse, sur une coupelle de céramique.",
    bienfaits: [
      {
        titre: "Nutrition intense",
        description:
          "Restaure le film hydrolipidique des zones les plus sèches : coudes, mains, talons.",
      },
      {
        titre: "Protection barrière",
        description: "Une couche protectrice non occlusive, qui laisse la peau respirer.",
      },
      {
        titre: "Apaisement immédiat",
        description: "Calme les tiraillements et les sensations d'inconfort cutané dès l'application.",
      },
    ],
    ingredientsTexte:
      "Un beurre de karité brut, non raffiné, pressé à froid et travaillé le moins possible pour préserver son insaponifiable naturel. Aucune matière issue de la pétrochimie, aucun parfum de synthèse n'entre dans sa composition.",
    utilisation:
      "Prélevez une noisette de baume entre les paumes pour le réchauffer, puis appliquez en pression sur les zones sèches. Idéal en soin du soir sur les mains, les coudes et les talons.",
    engagements:
      "Le karité de ce baume provient de coopératives féminines du Sahel, rémunérées au-dessus du cours mondial, avec préfinancement intégral des récoltes.",
  },
  "creme-riche-veloutee-visage": {
    familles: ["Repulpant", "Confort", "Visage"],
    accroche: "Émulsion soyeuse — céramides végétales pour une peau repulpée",
    image: "/images/pot-cosmetique-verre-depoli.png",
    imageAlt: "Pot cosmétique en verre dépoli, couvercle ivoire, sur un plinthe de travertin clair.",
    bienfaits: [
      {
        titre: "Confort longue durée",
        description: "Une texture riche qui laisse un film souple, sans effet gras ni lourd.",
      },
      {
        titre: "Repulpant",
        description: "Les céramides végétales renforcent la cohésion des cellules de l'épiderme.",
      },
      {
        titre: "Éclat du teint",
        description: "Un fini velouté, unifiant, qui redonne de la lumière au visage.",
      },
    ],
    ingredientsTexte:
      "Une émulsion à froid entre phase aqueuse florale et phase huileuse de karité et de moringa, sans eau neutre de remplissage. Céramides d'origine végétale, zéro silicone.",
    utilisation:
      "Appliquez matin et soir sur peau nettoyée, en mouvements ascendants du cou vers le front. Un temps de pause de quelques secondes avant le maquillage suffit à l'absorption complète.",
    engagements:
      "Formulée à partir de karité et de moringa sourcés en direct auprès de coopératives féminines du Sahel et de Casamance, sans intermédiaire.",
  },
  "elixir-botanique-moringa-squalane": {
    familles: ["Éclat", "Antioxydant", "Sérum"],
    accroche: "Sérum intense — moringa pressé à froid et squalane végétal",
    image: "/images/macro-moringa.png",
    imageAlt: "Feuilles et graines de moringa fraîchement cueillies, gouttes de rosée.",
    bienfaits: [
      {
        titre: "Éclat immédiat",
        description: "Régule la production de sébum sans laisser de film gras, ravive la clarté du teint.",
      },
      {
        titre: "Bouclier antioxydant",
        description: "Le moringa est reconnu pour sa richesse en antioxydants bio-compatibles.",
      },
      {
        titre: "Pénétration rapide",
        description: "Le squalane végétal a une forte affinité avec le film hydrolipidique cutané.",
      },
    ],
    ingredientsTexte:
      "Huile de graines de moringa pressée à froid, squalane d'origine végétale, sans huile minérale ni silicone. Grain fin, absorption rapide, aucune matière de synthèse lourde.",
    utilisation:
      "Quelques gouttes le matin sur peau nettoyée, avant la crème de jour. Peut se superposer à la Crème Riche Veloutée Visage pour les peaux les plus sèches.",
    engagements:
      "Le moringa est cultivé en maraîchage vivant en Casamance, sans intrant chimique, par des exploitations familiales partenaires de longue date.",
  },
  "masque-reparateur-intense-cheveux": {
    familles: ["Réparateur", "Nutrition", "Cheveux"],
    accroche: "Soin profond — karité brut et moringa pour la fibre capillaire",
    image: "/images/banniere-rituel-capillaire.png",
    imageAlt: "Flacon de soin capillaire botanique posé sur une dalle de calcaire brut, feuilles de moringa fraîches.",
    bienfaits: [
      {
        titre: "Réparation de la fibre",
        description: "Restructure les longueurs exposées aux agressions solaires et à la sécheresse.",
      },
      {
        titre: "Nutrition profonde",
        description: "Le karité brut relipide en profondeur sans alourdir la chevelure.",
      },
      {
        titre: "Douceur & discipline",
        description: "Facilite le démêlage et redonne de la souplesse aux longueurs.",
      },
    ],
    ingredientsTexte:
      "Karité brut non raffiné et huile de moringa pressée à froid, sans silicone ni sulfate. Une base végétale concentrée, pensée pour un temps de pose court mais efficace.",
    utilisation:
      "Sur cheveux lavés et essorés, répartissez le masque des longueurs aux pointes. Laissez poser 5 à 10 minutes puis rincez abondamment. Une à deux fois par semaine selon la nature du cheveu.",
    engagements:
      "Le karité et le moringa de ce masque proviennent des mêmes coopératives féminines du Sahel et de Casamance que l'ensemble des soins ÉCLORÉE.",
  },
};

const CONTENU_PAR_DEFAUT: ContenuEditorialSoin = {
  familles: ["Botanique", "Naturel"],
  accroche: "Un soin de la Maison ÉCLORÉE",
  image: "/images/pot-cosmetique-verre-depoli.png",
  imageAlt: "Pot cosmétique en verre dépoli sur fond clair.",
  bienfaits: [
    { titre: "Formule botanique", description: "Composé d'actifs végétaux identifiables et dosés." },
  ],
  ingredientsTexte:
    "Une formule botanique pure, sans silicone ni pétrochimie, dans l'esprit de la Maison ÉCLORÉE.",
  utilisation: "Appliquez selon vos besoins, en geste doux, sur peau ou cheveux propres.",
  engagements: "Sourcé auprès de coopératives féminines du Sahel et de Casamance.",
};

/** Retourne le contenu éditorial d'un slug, avec repli générique si absent. */
export function contenuSoin(slug: string): ContenuEditorialSoin {
  return CONTENU_SOINS[slug] ?? CONTENU_PAR_DEFAUT;
}

/**
 * Heuristique du "Rituel Tête" (écran 9) — `produits` n'a pas de colonne de
 * catégorie/rituel. On approxime en cherchant un vocabulaire capillaire dans
 * le nom ou la description, comme suggéré par le brief de la Vague 3. Sur
 * les 4 soins ÉCLORÉE actuellement en base, un seul correspond
 * ("Masque Réparateur Intense Cheveux") : c'est un compromis assumé faute de
 * taxonomie en base, documenté ici et dans la page qui l'utilise.
 */
const MOTS_CLES_RITUEL_TETE = /cheveu|capillaire|cuir chevelu|chevelure|fibre/i;

export function estRituelTete(produit: { nom: string; description: string | null }): boolean {
  return MOTS_CLES_RITUEL_TETE.test(produit.nom) || MOTS_CLES_RITUEL_TETE.test(produit.description ?? "");
}
