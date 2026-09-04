/**
 * Contenu et logique du quiz olfactif (écran 6, /shea/quiz). Fichier pur
 * (aucun "use client") : questions, options et fonction de score sont
 * importables aussi bien par le Server Component (page.tsx, qui n'a besoin
 * que du type EscaleSlug / ORDRE_ESCALES pour construire sa requête) que par
 * le Client Component qui pilote l'interaction (quiz-client.tsx).
 *
 * ── Logique de correspondance quiz → parfum ─────────────────────────────
 * Chaque question propose 4 cartes ; chaque carte vote pour UNE des 6
 * escales réelles de la collection SHÉA (voir app/(vitrine)/shea/parfums/
 * contenu-editorial.ts, qui reste la source unique du texte éditorial par
 * escale — ce fichier n'invente que les questions/options du quiz, jamais
 * une deuxième version de la description d'une escale). Sur 5 questions,
 * chaque escale reçoit 3 à 4 votes possibles ; l'escale choisie est celle
 * qui cumule le plus de réponses au fil du quiz (score simple par
 * occurrence), départagée en cas d'égalité par ORDRE_ESCALES (l'ordre
 * éditorial déjà utilisé sur /shea/collection). Pas de pondération savante
 * ni de vrai moteur psychométrique : c'est un quiz marketing, la
 * transparence de la règle prime sur sa sophistication.
 */

export type EscaleSlug =
  | "bois-de-shea"
  | "poussiere-docre"
  | "ombre-de-baobab"
  | "fleur-de-karite"
  | "brume-de-goree"
  | "or-du-ferlo";

/** Ordre éditorial (identique à ORDRE_COLLECTION sur /shea/collection, sans le coffret) — sert aussi de règle de départage en cas d'égalité de score. */
export const ORDRE_ESCALES: EscaleSlug[] = [
  "bois-de-shea",
  "poussiere-docre",
  "ombre-de-baobab",
  "fleur-de-karite",
  "brume-de-goree",
  "or-du-ferlo",
];

/** Version minimale de `produits` nécessaire au quiz — voir page.tsx. */
export interface ProduitQuizLite {
  id: string;
  slug: string;
  nom: string;
  prix: number;
  devise: string;
  escale_geographique: string | null;
}

export interface OptionQuiz {
  id: string;
  titre: string;
  description: string;
  /** Étiquette courte affichée en badge (famille olfactive évoquée). */
  famille: string;
  /** Repère de lecture bas de carte (ex. horaire, coordonnée) — purement évocateur. */
  repere: string;
  escale: EscaleSlug;
  /** Photo dans /public/images, si la carte en utilise une. */
  image?: string;
  /** Classes de dégradé Tailwind (tokens de marque uniquement) quand la carte n'a pas de photo dédiée. */
  degrade?: string;
}

export interface QuestionQuiz {
  id: string;
  numeroRomain: string;
  eyebrow: string;
  titre: string;
  soustitre: string;
  options: [OptionQuiz, OptionQuiz, OptionQuiz, OptionQuiz];
}

export const QUESTIONS: QuestionQuiz[] = [
  {
    id: "territoire",
    numeroRomain: "I",
    eyebrow: "Question I — Le Territoire",
    titre: "Quel paysage vous appelle en premier ?",
    soustitre:
      "Avant tout accord, il y a un lieu. Fermez les yeux et laissez venir la géographie qui vous attire le plus.",
    options: [
      {
        id: "territoire-atlantique",
        titre: "Les falaises de l'Atlantique",
        description:
          "L'embrun salé qui heurte la roche volcanique de la presqu'île, à l'heure où la lumière rase l'océan.",
        famille: "Boisé & Solaire",
        repere: "14°41' N",
        escale: "bois-de-shea",
        image: "/images/cote-senegalaise-golden-hour.png",
      },
      {
        id: "territoire-sahel",
        titre: "Les dunes du Sahel",
        description:
          "Le souffle continu de l'harmattan qui soulève la latérite ocre jusqu'aux lisières épineuses de la brousse.",
        famille: "Résineux & Sec",
        repere: "Vent d'harmattan",
        escale: "poussiere-docre",
        image: "/images/paysage-sahel-golden-hour.png",
      },
      {
        id: "territoire-baobab",
        titre: "L'ombre du baobab millénaire",
        description:
          "Un refuge minéral au creux d'un tronc qui garde en mémoire des siècles de saisons sèches et de pluies rares.",
        famille: "Boisé & Minéral",
        repere: "Arbre-monde",
        escale: "ombre-de-baobab",
        image: "/images/baobab-millenaire.png",
      },
      {
        id: "territoire-goree",
        titre: "La brume dorée de Gorée",
        description:
          "L'île qui se réveille dans un voile salé, porté par l'iode et la pierre chauffée du petit matin.",
        famille: "Marin & Minéral",
        repere: "Île mémoire",
        escale: "brume-de-goree",
        image: "/images/fond-terracotta-atmospherique.png",
      },
    ],
  },
  {
    id: "matiere",
    numeroRomain: "II",
    eyebrow: "Question II — La Matière",
    titre: "Quelle matière voudriez-vous sentir sous les doigts ?",
    soustitre: "Le parfum est aussi une texture. Choisissez celle qui appelle votre toucher.",
    options: [
      {
        id: "matiere-resine",
        titre: "La résine et le bois fumé",
        description:
          "Une écorce d'acacia qui a connu le feu, une braise de troupeau qui s'éteint lentement au loin.",
        famille: "Cuiré & Ambré",
        repere: "Feu de bivouac",
        escale: "or-du-ferlo",
        degrade: "bg-gradient-to-br from-terre-de-dakar via-encre-baobab to-encre-baobab",
      },
      {
        id: "matiere-cuir",
        titre: "Le cuir et la poussière tannée",
        description:
          "Une étoffe de cuir chauffée au zénith, patinée par des années de caravanes sahéliennes.",
        famille: "Résineux & Cuiré",
        repere: "Piste caravanière",
        escale: "poussiere-docre",
        image: "/images/paysage-sahel-golden-hour.png",
      },
      {
        id: "matiere-cire",
        titre: "La cire et le pétale",
        description:
          "Une fleur blanche de karité cueillie à la rosée, avant que la chaleur ne la referme.",
        famille: "Floral & Lacté",
        repere: "Rosée du matin",
        escale: "fleur-de-karite",
        image: "/images/macro-karite-brut.png",
      },
      {
        id: "matiere-pierre",
        titre: "La pierre et le sel",
        description:
          "Un rempart de pierre tiède, patiné par des générations d'embruns et de lumière rasante.",
        famille: "Marin & Minéral",
        repere: "Rempart côtier",
        escale: "brume-de-goree",
        degrade: "bg-gradient-to-br from-outline via-sable to-encre-baobab",
      },
    ],
  },
  {
    id: "heure",
    numeroRomain: "III",
    eyebrow: "Question III — Résonance Temporelle",
    titre: "À quelle heure du monde votre mémoire s'éveille-t-elle ?",
    soustitre:
      "L'odorat ne capture pas un objet, il fige une lumière. Choisissez l'heure qui scelle votre intuition.",
    options: [
      {
        id: "heure-aube-marine",
        titre: "L'aube sur l'océan",
        description:
          "La première brume salée qui se dépose sur les remparts de pierre, avant que l'île ne s'éveille tout à fait.",
        famille: "Marin & Salin",
        repere: "05h50",
        escale: "brume-de-goree",
        image: "/images/cote-senegalaise-golden-hour.png",
      },
      {
        id: "heure-aube-florale",
        titre: "L'aube sur la côte fleurie",
        description:
          "Les pétales blancs qui s'ouvrent avant que le soleil ne les referme, portés par un souffle encore frais.",
        famille: "Floral & Solaire",
        repere: "06h15",
        escale: "fleur-de-karite",
        degrade: "bg-gradient-to-br from-ivoire-bouye via-or-karite to-sable",
      },
      {
        id: "heure-midi",
        titre: "Le midi sous l'arbre",
        description:
          "La fraîcheur minérale qui s'installe au creux du tronc, loin de la chaleur qui écrase la savane.",
        famille: "Minéral & Vert",
        repere: "13h00",
        escale: "ombre-de-baobab",
        image: "/images/baobab-millenaire.png",
      },
      {
        id: "heure-crepuscule",
        titre: "Le crépuscule sur la brousse",
        description:
          "La lumière qui devient cuivrée, l'air qui se charge d'épices et de poussière tiède avant la nuit.",
        famille: "Épicé & Ambré",
        repere: "19h30",
        escale: "or-du-ferlo",
        image: "/images/fond-terracotta-atmospherique.png",
      },
    ],
  },
  {
    id: "geste",
    numeroRomain: "IV",
    eyebrow: "Question IV — Le Geste",
    titre: "Quel geste rituel vous ressemble ?",
    soustitre: "Un parfum se porte comme un geste. Lequel de ces quatre gestes est le vôtre ?",
    options: [
      {
        id: "geste-vent",
        titre: "Se tenir face au vent, peau nue",
        description: "Laisser l'harmattan sécher la peau et emporter avec lui la chaleur du jour.",
        famille: "Sec & Résineux",
        repere: "Geste d'ouverture",
        escale: "poussiere-docre",
        degrade: "bg-gradient-to-br from-ocre-solaire via-sable to-terre-de-dakar",
      },
      {
        id: "geste-ecorce",
        titre: "Poser la paume sur l'écorce",
        description: "Sentir sous la main la fraîcheur d'un tronc qui a traversé les siècles sans bouger.",
        famille: "Boisé & Minéral",
        repere: "Geste de recueillement",
        escale: "ombre-de-baobab",
        image: "/images/baobab-millenaire.png",
      },
      {
        id: "geste-horizon",
        titre: "Regarder l'horizon s'embraser",
        description: "Observer le soleil disparaître derrière la roche volcanique, sans un geste, sans un mot.",
        famille: "Boisé & Solaire",
        repere: "Geste de contemplation",
        escale: "bois-de-shea",
        image: "/images/cote-senegalaise-golden-hour.png",
      },
      {
        id: "geste-cueillette",
        titre: "Cueillir la fleur avant l'aube",
        description: "Se lever tôt pour recueillir les pétales avant que la chaleur ne les referme à nouveau.",
        famille: "Floral & Lacté",
        repere: "Geste de cueillette",
        escale: "fleur-de-karite",
        image: "/images/macro-karite-brut.png",
      },
    ],
  },
  {
    id: "signature",
    numeroRomain: "V",
    eyebrow: "Question V — La Signature",
    titre: "Quelle matière voudriez-vous porter sur votre peau, ce soir ?",
    soustitre: "Dernière étape avant l'escale. Choisissez le sillage qui vous accompagnera jusqu'à demain.",
    options: [
      {
        id: "signature-ambre",
        titre: "Bois brûlé et ambre profond",
        description: "Un sillage dense et solennel, comme la nuit qui s'installe lentement sur le Ferlo.",
        famille: "Épicé & Ambré",
        repere: "Sillage enveloppant",
        escale: "or-du-ferlo",
        degrade: "bg-gradient-to-br from-ocre-solaire via-terre-de-dakar to-encre-baobab",
      },
      {
        id: "signature-sel",
        titre: "Sel et pierre tiède",
        description: "Un sillage discret, digne, qui garde la mémoire de l'iode et de la lumière rasante.",
        famille: "Marin & Minéral",
        repere: "Sillage discret",
        escale: "brume-de-goree",
        degrade: "bg-gradient-to-br from-sable via-outline to-encre-baobab",
      },
      {
        id: "signature-cuir",
        titre: "Cuir végétal et résine sèche",
        description: "Un sillage enveloppant qui se prolonge naturellement plusieurs heures sur la peau.",
        famille: "Cuiré & Sec",
        repere: "Sillage prolongé",
        escale: "poussiere-docre",
        image: "/images/paysage-sahel-golden-hour.png",
      },
      {
        id: "signature-karite",
        titre: "Karité torréfié et santal",
        description: "Un sillage dense et intimiste, entre aurore et crépuscule, ancré dans la roche noire.",
        famille: "Boisé & Ambré",
        repere: "Sillage intimiste",
        escale: "bois-de-shea",
        image: "/images/flacon-parfum-ambre.png",
      },
    ],
  },
];

/**
 * Calcule l'escale gagnante à partir des réponses (une escale par question
 * répondue, dans l'ordre). Score par occurrence ; égalité départagée par
 * ORDRE_ESCALES.
 */
export function calculerEscaleGagnante(reponses: EscaleSlug[]): EscaleSlug {
  const scores = new Map<EscaleSlug, number>(ORDRE_ESCALES.map((slug) => [slug, 0]));
  for (const reponse of reponses) {
    scores.set(reponse, (scores.get(reponse) ?? 0) + 1);
  }

  let escaleGagnante: EscaleSlug = ORDRE_ESCALES[0];
  let meilleurScore = -1;
  for (const slug of ORDRE_ESCALES) {
    const score = scores.get(slug) ?? 0;
    if (score > meilleurScore) {
      meilleurScore = score;
      escaleGagnante = slug;
    }
  }
  return escaleGagnante;
}

/** Clé localStorage du résultat — visiteur non connecté comme connecté. */
export const CLE_RESULTAT_QUIZ = "la-paradoxa-quiz-shea-v1";

export interface ResultatQuizStocke {
  escale: string;
  famillesDominantes: string[];
  repondiLe: string;
}
