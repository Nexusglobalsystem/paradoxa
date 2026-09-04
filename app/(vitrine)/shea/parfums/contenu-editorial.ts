/**
 * Contenu éditorial des 7 créations SHÉA — /shea/collection ET
 * /shea/parfums/[slug] importent ce fichier (source unique, voir commentaire
 * dans les deux pages).
 *
 * ── Pourquoi ce fichier existe (règle CLAUDE.md n°2, non négociable) ──────
 * La fiche parfum publique NE DOIT JAMAIS lire `formules` / `formule_lignes`
 * (réservées au rôle admin par RLS). La "pyramide olfactive" ci-dessous n'est
 * donc PAS une projection de la vraie formule : c'est un texte éditorial that
 * nous inventons nous-mêmes, à la maille de la FAMILLE olfactive générique
 * (ex. "Agrumes, sel marin"), jamais de nom de matière première précis ni de
 * pourcentage réel. Les proportions 19/31/50 affichées sont les constantes
 * décoratives de la méthode SHÉA (PART_ETAGE dans
 * components/laboratoire/constantes-parfum.ts) — identiques pour toutes les
 * créations, pas une donnée par produit. `produits.formule_id` n'est utilisé
 * nulle part ici autrement que pour savoir si on affiche le badge "Composé
 * selon notre méthode du nombre d'or" (aucune lecture de son contenu).
 *
 * Les `familles` réutilisent le segment éditorial déjà présent dans
 * `produits.description` (ex. "Boisé ambré solaire — écorces fumées...") :
 * ce texte existe déjà en base, rédigé par l'agent qui a peuplé le
 * catalogue — on ne fait que le découper en badges, pas une requête sur une
 * table de formulation.
 */

export interface EtageOlfactif {
  /** Titre évocateur de la strate — jamais un nom de matière précis. */
  titre: string;
  /** 2-3 familles olfactives génériques, jamais une liste d'ingrédients. */
  familles: string;
}

export interface ContenuEditorialParfum {
  /** Badges courts sous le titre (3 mots max chacun). */
  familles: string[];
  /** Sous-titre italique sous le nom, ex. "Eau de Parfum — Escale · Dakar". */
  accroche: string;
  /** Paragraphe de la colonne droite, sous les badges. */
  recit: string;
  /** Titre de la section "L'escale" (bandeau sombre). */
  escaleTitre: string;
  /** Paragraphe de la section "L'escale". */
  escaleTexte: string;
  /**
   * Photo d'ambiance utilisée sur /shea/collection (moitié "paysage" de la
   * section alternée). `/public/images` ne compte que 15 photos de stock
   * réutilisables (pas une par produit) : plusieurs escales au territoire
   * voisin partagent donc la même image plutôt que d'inventer un chemin
   * d'asset qui n'existe pas — voir la liste dans le brief de la Vague 3.
   */
  imageEscale: string;
  imageEscaleAlt: string;
  pyramide: {
    tete: EtageOlfactif;
    coeur: EtageOlfactif;
    fond: EtageOlfactif;
  };
  /** Accordéon "Conseils d'application". */
  conseils: string;
  /** Accordéon "Composition" — texte général sur le procédé, pas la formule. */
  composition: string;
}

export const CONTENU_PARFUMS: Record<string, ContenuEditorialParfum> = {
  "bois-de-shea": {
    familles: ["Boisé", "Ambré", "Solaire"],
    accroche: "Eau de Parfum — Escale · Dakar",
    recit:
      "Là où l'Atlantique heurte la roche volcanique de la presqu'île, l'amande de karité s'échauffe sous les derniers rayons du jour. Une fragrance d'aurore et de crépuscule, au sillage dense et intimiste.",
    escaleTitre: "L'anse de Ouakam, à l'heure dorée",
    escaleTexte:
      "Là où l'Atlantique heurte la roche volcanique sombre de Dakar, l'arbre de karité s'échauffe sous les derniers rayons rasants. Un souffle d'embruns iodés qui vient s'apaiser dans la rondeur fumée d'une amande précieuse, travaillée à la main par les femmes du littoral.",
    imageEscale: "/images/cote-senegalaise-golden-hour.png",
    imageEscaleAlt: "Rivage volcanique de la côte sénégalaise à l'heure dorée, falaises noires et embruns.",
    pyramide: {
      tete: { titre: "L'appel de l'Atlantique", familles: "Agrumes, embruns salins" },
      coeur: { titre: "La braise du soir", familles: "Épices chaudes, résine, encens" },
      fond: { titre: "L'ancrage de la roche", familles: "Bois fumé, karité torréfié, ambre" },
    },
    conseils:
      "Vaporisez à quelques centimètres des points de pulsation — poignets, nuque, creux du coude — et laissez la matière s'épanouir sans frotter. Le sillage se déploie en trois temps, de l'ouverture saline jusqu'à la signature boisée de fond.",
    composition:
      "Composé en atelier à Dakar puis affiné à Grasse, cet extrait suit le procédé maison : macération lente en fûts de grès, alcool surfin d'origine biologique, aucune matière issue de la pétrochimie. La formule complète, ses dosages et ses tests de conformité IFRA restent un document interne à la Maison — c'est le savoir-faire que nous protégeons.",
  },
  "poussiere-docre": {
    familles: ["Résineux", "Cuiré", "Sec"],
    accroche: "Eau de Parfum — Escale · Sahel",
    recit:
      "Le souffle continu de l'harmattan soulève la latérite rougeoyante jusqu'aux lisières épineuses. Une matière sèche et majestueuse, veloutée comme une étoffe de cuir chauffée au zénith.",
    escaleTitre: "La brousse chauffée à blanc",
    escaleTexte:
      "Sur les pistes du Sahel, le vent d'harmattan porte une poussière ocre qui se dépose sur les feuilles d'acacia et les tiges sèches. Cette création restitue cette texture minérale et tannée, presque tactile, d'un territoire qui ne se donne qu'à ceux qui prennent le temps de la traverser.",
    imageEscale: "/images/paysage-sahel-golden-hour.png",
    imageEscaleAlt: "Savane sahélienne au crépuscule doré, acacias et herbes hautes.",
    pyramide: {
      tete: { titre: "Le vent d'harmattan", familles: "Poivre, épices sèches" },
      coeur: { titre: "Le cuir des caravanes", familles: "Cuir végétal, résine d'acacia" },
      fond: { titre: "La latérite du soir", familles: "Bois tanné, ambre terreux" },
    },
    conseils:
      "Cette création dense gagne à être appliquée sur peau nue plutôt que sur l'étoffe. Une application suffit au creux du cou : son sillage sec et enveloppant se prolonge naturellement plusieurs heures.",
    composition:
      "Le concentré est macéré en fûts de grès selon le même protocole que l'ensemble de la collection. La formule précise — dosages, matières, conformité IFRA — demeure un document de laboratoire réservé à nos parfumeurs, jamais communiqué en dehors de l'atelier.",
  },
  "ombre-de-baobab": {
    familles: ["Boisé", "Épicé", "Minéral"],
    accroche: "Eau de Parfum — Escale · Le Baobab",
    recit:
      "Au creux d'un tronc millénaire, l'air se rafraîchit de plusieurs degrés — un refuge minéral au cœur de la chaleur sahélienne. Une révérence olfactive à la mémoire longue des arbres qui abritent des générations.",
    escaleTitre: "Le repos au creux du tronc",
    escaleTexte:
      "Les baobabs centenaires creusent leur ombre comme une architecture naturelle, un sanctuaire où l'écorce garde en mémoire des siècles de saisons sèches et de pluies rares. Ce parfum en restitue la fraîcheur minérale et la gravité tranquille.",
    imageEscale: "/images/baobab-millenaire.png",
    imageEscaleAlt: "Tronc majestueux d'un baobab millénaire sous la lumière dorée.",
    pyramide: {
      tete: { titre: "L'ouverture sous l'arbre", familles: "Épices vertes, agrumes sauvages" },
      coeur: { titre: "La sève et l'écorce", familles: "Sève fraîche, écorce, herbes sèches" },
      fond: { titre: "La mémoire du tronc", familles: "Bois millénaire, vétiver, mousse" },
    },
    conseils:
      "Privilégiez une application matinale : cette composition minérale et boisée accompagne idéalement les longues journées, sans jamais devenir entêtante. Superposez-la sans crainte à un baume ÉCLORÉE non parfumé.",
    composition:
      "Extrait pur macéré 90 jours en fûts de grès, alcool surfin biologique, sans matière de synthèse lourde. La composition détaillée reste, comme pour toute la collection, un document interne — c'est la garantie que ce sillage restera unique à la Maison SHÉA.",
  },
  "fleur-de-karite": {
    familles: ["Floral", "Lacté", "Solaire"],
    accroche: "Eau de Parfum — Escale · La Côte Swahilie",
    recit:
      "Sur la côte, les fleurs de l'arbre de karité s'ouvrent à l'aube en pétales blancs et fragiles, cueillies avant que le soleil ne les referme. Une ouverture lactée et solaire, légère comme la brise matinale.",
    escaleTitre: "L'éclosion matinale, côte Swahilie",
    escaleTexte:
      "Avant que la chaleur ne s'installe, les cueilleuses récoltent les fleurs blanches de karité à la rosée du matin. Ce parfum capture cet instant fugace : un voile lacté et floral, porté par un souffle d'air marin encore frais.",
    imageEscale: "/images/fond-terracotta-atmospherique.png",
    imageEscaleAlt: "Fond atmosphérique terracotta, lumière chaude et diffuse.",
    pyramide: {
      tete: { titre: "La rosée du matin", familles: "Fleurs blanches, agrumes délicats" },
      coeur: { titre: "L'éclosion", familles: "Cire d'abeille, fleurs solaires" },
      fond: { titre: "Le lait du karité", familles: "Musc végétal, karité doux, bois clair" },
    },
    conseils:
      "Une fragrance lumineuse à porter en journée, sur peau propre, au creux du poignet et derrière les oreilles. Elle se réactive doucement à la chaleur de la peau au fil des heures.",
    composition:
      "Extrait pur formulé selon le même procédé que l'ensemble des créations SHÉA — macération lente, alcool surfin biologique. Les dosages précis et la liste des matières restent réservés à notre laboratoire, jamais exposés en dehors de l'atelier.",
  },
  "brume-de-goree": {
    familles: ["Marin", "Salin", "Minéral"],
    accroche: "Eau de Parfum — Escale · Gorée",
    recit:
      "L'île se réveille dans une brume salée, portée par l'iode et la pierre chauffée du petit matin. Un sillage marin et minéral, hommage à la lumière et à la mémoire de Gorée.",
    escaleTitre: "L'aube sur l'île de Gorée",
    escaleTexte:
      "À la première heure, une brume légère se dépose sur les façades ocre et les remparts de pierre de l'île. Cette création en retient l'iode, le sel et la pierre tiède, dans un sillage qui reste discret et digne.",
    imageEscale: "/images/cote-senegalaise-golden-hour.png",
    imageEscaleAlt: "Rivage sénégalais à l'heure dorée, mer et lumière rasante.",
    pyramide: {
      tete: { titre: "La brume du large", familles: "Iode, embruns marins" },
      coeur: { titre: "Les fleurs de l'île", familles: "Fleurs salines, algue" },
      fond: { titre: "La pierre des remparts", familles: "Pierre chaude, bois clair, musc" },
    },
    conseils:
      "Un sillage discret, parfait au réveil : vaporisez sur la peau humide au sortir de la douche pour prolonger sa fraîcheur marine toute la matinée.",
    composition:
      "Concentré maturé en fûts de grès selon le protocole commun à la collection. Comme pour chaque création SHÉA, la formule exacte reste un document de laboratoire, non communiqué au public.",
  },
  "or-du-ferlo": {
    familles: ["Épicé", "Cuiré", "Ambré"],
    accroche: "Eau de Parfum — Escale · Le Ferlo",
    recit:
      "À la tombée du jour, la brousse sahélienne se pare d'une lumière dorée et d'épices chaudes portées par le vent. Un parfum dense et solennel, comme la nuit qui s'installe sur le Ferlo.",
    escaleTitre: "Le crépuscule sur la brousse",
    escaleTexte:
      "Dans le Ferlo, le jour bascule sans transition : la lumière devient cuivrée, l'air se charge d'épices et de poussière tiède. Cette création en garde la chaleur enveloppante, jusqu'à la fraîcheur soudaine de la nuit sahélienne.",
    imageEscale: "/images/paysage-sahel-golden-hour.png",
    imageEscaleAlt: "Brousse sahélienne au crépuscule, lumière dorée et sèche.",
    pyramide: {
      tete: { titre: "La lumière cuivrée", familles: "Épices chaudes, poivre rose" },
      coeur: { titre: "Le troupeau au loin", familles: "Cuir doré, résine, foin sec" },
      fond: { titre: "La nuit sahélienne", familles: "Bois précieux, ambre profond" },
    },
    conseils:
      "Composition la plus dense de la collection : deux points d'application suffisent, en soirée, sur les poignets ou le col d'un vêtement en fibre naturelle.",
    composition:
      "Extrait pur macéré 90 jours, formulé selon le procédé commun à toute la Maison SHÉA. La formule et ses dosages restent confidentiels — un principe que nous appliquons à chacune de nos créations, sans exception.",
  },
  "coffret-cinq-escales": {
    familles: ["Découverte", "Nomade", "Cinq escales"],
    accroche: "Coffret de découverte — Cinq escales, cinq fioles",
    recit:
      "Plutôt qu'une seule destination, ce coffret en propose cinq : cinq fioles de 2 ml pour apprivoiser chaque territoire avant de choisir son sillage définitif, accompagnées de leurs touches à sentir en papier vergé.",
    escaleTitre: "Le voyage entier, dans un seul écrin",
    escaleTexte:
      "Bois de Shéa, Poussière d'Ocre, Ombre de Baobab, Fleur de Karité et Brume de Gorée — chaque fiole raconte une escale de la collection. Le montant du coffret (29 €) est intégralement déduit sous forme d'avoir personnel lors de l'acquisition de votre premier flacon 100 ml.",
    imageEscale: "/images/flatlay-coffret-kraft-or.png",
    imageEscaleAlt: "Coffret ouvert en kraft gaufré et dorure, présentant les cinq fioles de voyage.",
    pyramide: {
      tete: { titre: "Cinq ouvertures", familles: "Un accord différent par escale" },
      coeur: { titre: "Cinq cœurs", familles: "La signature de chaque territoire" },
      fond: { titre: "Une méthode commune", familles: "Le même geste, cinq destinations" },
    },
    conseils:
      "Testez une fiole par jour, sur peau nue, pour laisser le temps à chaque sillage de se révéler. Notez vos préférences dans le carnet de voyage fourni avant de choisir votre flacon 100 ml.",
    composition:
      "Chaque fiole reprend l'extrait pur de sa création d'origine, macéré selon le même procédé que les flacons 100 ml. Les formules détaillées restent, comme pour toute la collection, un document interne à la Maison.",
  },
};

const CONTENU_PAR_DEFAUT: ContenuEditorialParfum = {
  familles: ["Boisé", "Ambré"],
  accroche: "Eau de Parfum",
  recit:
    "Une création de la Maison SHÉA, composée selon notre méthode du nombre d'or entre l'atelier de Dakar et celui de Grasse.",
  escaleTitre: "Une escale de la collection",
  escaleTexte:
    "Chaque flacon SHÉA raconte une géographie précise, entre Sahel et littoral. Les détails de cette escale seront bientôt complétés.",
  imageEscale: "/images/fond-terracotta-atmospherique.png",
  imageEscaleAlt: "Fond atmosphérique terracotta, lumière chaude et diffuse.",
  pyramide: {
    tete: { titre: "L'ouverture", familles: "Agrumes, épices fraîches" },
    coeur: { titre: "Le cœur", familles: "Résine, fleurs solaires" },
    fond: { titre: "La signature", familles: "Bois, ambre, karité" },
  },
  conseils:
    "Vaporisez sur les points de pulsation — poignets, nuque, creux du coude — pour un sillage progressif tout au long de la journée.",
  composition:
    "Extrait pur formulé selon le procédé commun à la collection SHÉA. La formule détaillée reste un document interne de laboratoire, jamais communiqué au public.",
};

/** Retourne le contenu éditorial d'un slug, avec repli générique si absent. */
export function contenuParfum(slug: string): ContenuEditorialParfum {
  return CONTENU_PARFUMS[slug] ?? CONTENU_PAR_DEFAUT;
}
