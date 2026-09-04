/**
 * Placeholder éditorial — à remplacer par une vraie source de contenu (CMS ou
 * table Supabase) plus tard. Aucune table `articles` n'existe dans le schéma
 * actuel : le Journal de la Vague 2 est servi par ce tableau statique, codé en
 * dur, le temps qu'un vrai back-office éditorial (écran 38, `/admin/journal`)
 * soit construit. Les 4 récits sont fictifs mais cohérents avec l'univers du
 * groupe (sourcing, rituels, composition, voyages) et se répondent : l'article
 * "à la une" du Journal est le même que celui rendu par `/journal/[slug]`.
 */

export type CategorieArticle = "rituels" | "sourcing" | "composition" | "voyages";

export const CATEGORIE_LABEL: Record<CategorieArticle, string> = {
  rituels: "Rituels de soin",
  sourcing: "Sourcing & Terroirs",
  composition: "Composition & Alchimie",
  voyages: "Carnets de voyages",
};

export type BlocArticle =
  | { type: "paragraphe"; texte: string }
  | { type: "titre"; texte: string }
  | { type: "citation"; texte: string; source: string };

export interface ArticleJournal {
  slug: string;
  titre: string;
  chapeau: string;
  extrait: string;
  categorie: CategorieArticle;
  tempsLectureMin: number;
  auteur: string;
  auteurRole: string;
  auteurBio: string;
  dateISO: string;
  dateLabel: string;
  lieu: string;
  image: string;
  imageAlt: string;
  aLaUne?: boolean;
  contenu: BlocArticle[];
}

export const ARTICLES: ArticleJournal[] = [
  {
    slug: "aube-sur-le-ferlo",
    titre: "L'aube sur le Ferlo : sur la piste des cueilleuses de moringa",
    chapeau:
      "Une traversée silencieuse de la steppe sahélienne où l'aube révèle, feuille après feuille, la générosité discrète du Nébédaye.",
    extrait:
      "Avant que le soleil n'embrase la brousse, les cueilleuses du Ferlo s'avancent entre les épineux. Récit d'une matinée de cueillette au rythme des anciennes.",
    categorie: "voyages",
    tempsLectureMin: 9,
    auteur: "Aïcha Ndoye",
    auteurRole: "Fondatrice & Directrice de création",
    auteurBio:
      "Formée entre Dakar et Grasse, Aïcha Ndoye a fondé LA PARADOXA en 2018 avec la conviction que la botanique sahélienne méritait l'exigence de la haute parfumerie. Elle partage aujourd'hui son temps entre les terroirs du Sénégal et l'officine de Paris.",
    dateISO: "2025-10-14",
    dateLabel: "14 octobre 2025",
    lieu: "Ferlo, Sénégal",
    image: "/images/paysage-sahel-golden-hour.png",
    imageAlt:
      "Paysage sahélien à l'heure dorée, savane du Ferlo baignée de lumière rasante",
    aLaUne: true,
    contenu: [
      {
        type: "paragraphe",
        texte:
          "À l'orée du désert, lorsque la nuit ne consent pas encore tout à fait à céder ses droits à l'azur, le Ferlo ne ressemble à aucune autre étendue. C'est un royaume de terre cuite, de silences minéraux et d'épineux noueux. Dans ce corridor pastoral du Sénégal septentrional, les cueilleuses s'éveillent bien avant que la première flèche solaire ne transperce la brume tiède, guidées par la seule promesse d'une récolte matinale — celle où les folioles du moringa retiennent encore la rosée de la nuit.",
      },
      {
        type: "paragraphe",
        texte:
          "Ici, la cueillette ne s'encombre d'aucun appareil moderne. Les mains reconnaissent, au toucher, les branches prêtes à donner. Chaque geste répond à un calendrier tacite : ne jamais dépouiller un arbre entier, laisser reposer les branches basses, revenir dans trois semaines. C'est une économie de la patience, transmise de mère en fille depuis que le Nébédaye — « il ne meurt jamais », en wolof — pousse sur ces sols latéritiques que rien d'autre ne consent à nourrir.",
      },
      {
        type: "citation",
        texte:
          "« On ne cueille pas le moringa, on lui rend visite. Il donne à qui sait attendre le bon matin. »",
        source: "Fatou Diop, cheffe de la coopérative de Linguère",
      },
      {
        type: "titre",
        texte: "Le panier de rônier et la pesée de l'aube",
      },
      {
        type: "paragraphe",
        texte:
          "Vers sept heures, alors que la chaleur commence tout juste à durcir l'air, les paniers de rônier tressé s'alignent devant la case de pesée. Chaque cueilleuse y dépose sa récolte du matin, consignée dans un registre où figurent son nom, la parcelle et l'heure de cueillette — le même souci de traçabilité qui préside, plus au sud, aux battages de karité. C'est cette rigueur artisanale que nos formulateurs viennent chercher : une matière dont on connaît la biographie complète avant même qu'elle n'entre en pressoir.",
      },
      {
        type: "paragraphe",
        texte:
          "Rapporter cette lumière du matin jusqu'à nos ateliers n'est pas un acte de prélèvement, mais de traduction. Chaque flacon, chaque pot de soin porte la mémoire de cette heure precise où la fraîcheur nocturne cède au premier souffle chaud de l'Harmattan — l'instant exact où la feuille de moringa concentre le plus de sève active, avant que le soleil n'en disperse la promesse.",
      },
      {
        type: "paragraphe",
        texte:
          "Le Ferlo s'éloigne déjà dans le rétroviseur de la piste, mais son empreinte verte reste incrustée sous les ongles — la promesse d'un soin qui ne s'improvise pas, mais se mérite au pas lent des cueilleuses.",
      },
    ],
  },
  {
    slug: "moringa-quintessence-verte-casamance",
    titre: "Moringa oleifera : la quintessence verte du fleuve Casamance",
    chapeau:
      "Étude de terrain sur un feuillage aux vertus régénérantes d'exception, cueilli aux premières heures du jour pour en préserver les antioxydants rares.",
    extrait:
      "Comment la coopérative de Linguère et le pressoir mécanique du Ferlo transforment une feuille frugale en huile d'or pour la Maison ÉCLORÉE.",
    categorie: "sourcing",
    tempsLectureMin: 7,
    auteur: "Dr. Aminata Diallo",
    auteurRole: "Responsable filières botaniques, Maison ÉCLORÉE",
    auteurBio:
      "Docteure en pharmacognosie formée à Dakar, Aminata Diallo supervise les relations avec les coopératives rurales du Ferlo et du Sénégal oriental depuis la création de la Maison ÉCLORÉE.",
    dateISO: "2025-09-02",
    dateLabel: "2 septembre 2025",
    lieu: "Linguère, Ferlo",
    image: "/images/cote-senegalaise-golden-hour.png",
    imageAlt: "Lumière dorée sur la côte sénégalaise, ambiance éditoriale",
    contenu: [
      {
        type: "paragraphe",
        texte:
          "Le moringa ne paie pas de mine. Frêle, dépourvu de la stature du baobab ou du karité sauvage, il prospère pourtant là où presque rien d'autre ne consent à pousser : les sols sablonneux et pauvres du Ferlo, battus par un vent d'Harmattan qui dessèche tout sur son passage. Cette frugalité extrême est précisément la genèse de sa richesse — pour survivre, la plante synthétise une profusion d'antioxydants, de phytostérols et d'acides gras rares, concentrés dans ses folioles veloutées et ses graines ailées.",
      },
      {
        type: "paragraphe",
        texte:
          "Depuis 2021, ÉCLORÉE accompagne une coopérative de plus de deux cents cueilleuses réparties entre Linguère et les abords du fleuve Casamance. Le contrat qui nous lie n'est pas ponctuel : c'est un engagement pluriannuel, avec une rémunération fixée bien au-dessus du cours local, qui finance en retour l'accès à l'eau potable et la scolarisation des filles du village.",
      },
      {
        type: "citation",
        texte:
          "« Nous ne blanchissons rien. Nous préservons la couleur de l'huile brute, le parfum vert et légèrement toasté de la graine pressée à froid. »",
        source: "Aminata Diallo, responsable filières botaniques",
      },
      {
        type: "titre",
        texte: "Du pressoir de Linguère au flacon",
      },
      {
        type: "paragraphe",
        texte:
          "Les graines décortiquées sont pressées à froid, sous 48 heures, dans un pressoir à vis lente installé au plus près des arbres récoltés — aucun transport prolongé avant extraction, aucune exposition thermique qui viendrait dénaturer les polyphénols. L'huile qui en résulte, dorée et légèrement verte, titre un indice de peroxydes inférieur à 2 meq/kg : une fraîcheur rarement atteinte sur une matière première tropicale.",
      },
      {
        type: "paragraphe",
        texte:
          "C'est cette huile qui infuse aujourd'hui plusieurs formules de la Maison ÉCLORÉE, du sérum capillaire au masque réparateur. Une matière frugale devenue, par la patience du geste, une des plus riches de notre herbier.",
      },
    ],
  },
  {
    slug: "loi-des-trois-strates-ratio-phi",
    titre: "La loi des trois strates : géométrie secrète du nombre d'or en formulation",
    chapeau:
      "Pourquoi nos extraits et nos soins refusent la pyramide occidentale traditionnelle au profit d'une proportion mathématique héritée du vivant.",
    extrait:
      "19 % tête, 31 % cœur, 50 % fond : décryptage du canon φ qui régit la construction de chaque formule du groupe, parfum comme cosmétique.",
    categorie: "composition",
    tempsLectureMin: 5,
    auteur: "La Direction de Création",
    auteurRole: "Laboratoire LA PARADOXA",
    auteurBio:
      "Le collectif de formulateurs et formulatrices qui, à Dakar comme à Paris, traduit chaque matière première en équation olfactive et cosmétique.",
    dateISO: "2025-07-21",
    dateLabel: "21 juillet 2025",
    lieu: "Laboratoire de Dakar-Plateau",
    image: "/images/paysage-sahel-golden-hour.png",
    imageAlt: "Lumière dorée sur la savane sahélienne, ambiance de laboratoire en plein air",
    contenu: [
      {
        type: "paragraphe",
        texte:
          "La pyramide olfactive classique — tête, cœur, fond — appartient au vocabulaire commun de la parfumerie depuis plus d'un siècle. Elle décrit une évolution dans le temps, sans jamais s'engager sur des proportions précises. Chez LA PARADOXA, nous avons choisi d'aller plus loin : fixer, pour chaque formule, un ratio pondéral exact, calqué sur le nombre d'or. 19 % pour la tête, 31 % pour le cœur, 50 % pour le fond — une répartition qui n'a rien d'arbitraire.",
      },
      {
        type: "paragraphe",
        texte:
          "Ce canon φ (1,618) n'est pas une coquetterie mathématique plaquée sur la matière : c'est une manière de garantir qu'aucune note ne domine indûment le sillage, que le fond ait toujours la permanence nécessaire pour porter l'ensemble, et que le cœur reste l'articulation vivante entre l'éclat initial et la trace qui demeure sur la peau ou le cheveu.",
      },
      {
        type: "citation",
        texte:
          "« Le nombre d'or ne dicte pas une esthétique : il garantit un équilibre. C'est un outil de rigueur, pas un argument marketing. »",
        source: "Extrait des carnets de formulation, atelier de Dakar-Plateau",
      },
      {
        type: "titre",
        texte: "Une grammaire commune aux deux maisons",
      },
      {
        type: "paragraphe",
        texte:
          "Le même principe irrigue les formules cosmétiques d'ÉCLORÉE, où les trois strates deviennent phase aqueuse, phase active et phase filmogène — chacune calibrée pour que l'actif (huile de moringa, beurre de karité) délivre son plein potentiel sans jamais alourdir la texture. Le composeur du laboratoire propose d'ailleurs un bouton « Équilibrer selon φ » qui recalcule automatiquement ces proportions pour toute nouvelle formule.",
      },
      {
        type: "paragraphe",
        texte:
          "Ce n'est pas un dogme immuable : certaines formules s'en écartent volontairement, quand la matière l'exige. Mais le ratio reste le point de départ, la référence à laquelle chaque composition est confrontée avant d'assumer, ou non, de s'en éloigner.",
      },
    ],
  },
  {
    slug: "gardiennes-de-kedougou-rituel-karite",
    titre: "Les gardiennes de Kédougou : mémoire vivante du karité sauvage",
    chapeau:
      "Rencontre avec la coopérative de femmes qui perpétue, sans solvant ni désodorisation thermique, le battage ancestral du beurre de karité.",
    extrait:
      "À Dindéfélo, une quarantaine d'artisanes préservent un geste rituel vieux de plusieurs générations pour livrer un beurre brut, non blanchi, à la Maison ÉCLORÉE.",
    categorie: "rituels",
    tempsLectureMin: 8,
    auteur: "Fatou Ndiaye",
    auteurRole: "Coordinatrice filière karité, coopérative de Dindéfélo",
    auteurBio:
      "Née à Kédougou, Fatou Ndiaye coordonne depuis 2019 la coopérative féminine de Dindéfélo, partenaire historique de la Maison ÉCLORÉE pour le beurre de karité sauvage.",
    dateISO: "2025-05-30",
    dateLabel: "30 mai 2025",
    lieu: "Dindéfélo, Kédougou",
    image: "/images/cote-senegalaise-golden-hour.png",
    imageAlt: "Lumière dorée sur la côte sénégalaise, ambiance de fin de journée",
    contenu: [
      {
        type: "paragraphe",
        texte:
          "À Dindéfélo, dans la vallée verdoyante du sud-est sénégalais, le karité ne se cultive pas — il s'apprivoise. Les arbres, sauvages et séculaires, réclament près de trente ans avant de livrer leur premier fruit. C'est sous leur ombre que se réunit, chaque matin de la saison sèche, la coopérative des quarante artisanes qui perpétuent un geste que rien n'a jamais su remplacer : le battage manuel du beurre brut.",
      },
      {
        type: "paragraphe",
        texte:
          "Les noix tombées à l'aube sont d'abord concassées, puis torréfiées légèrement au feu de bois — juste assez pour libérer l'arôme de noix grillée qui signe un karité non blanchi. Vient ensuite le battage : des heures durant, la pâte est travaillée à la main dans de larges bassines, jusqu'à ce que la matière grasse se sépare et prenne cette teinte ivoire crème que l'industrie, elle, désodorise et décolore par souci d'uniformité.",
      },
      {
        type: "citation",
        texte:
          "« Notre beurre garde la couleur du soleil qui a mûri la noix. C'est notre signature — nous ne l'effaçons pour personne. »",
        source: "Fatou Ndiaye, coordinatrice de la coopérative de Dindéfélo",
      },
      {
        type: "titre",
        texte: "Une rémunération à la hauteur du geste",
      },
      {
        type: "paragraphe",
        texte:
          "La Maison ÉCLORÉE rémunère cette filière à plusieurs fois le cours mondial du marché, dans le cadre de contrats pluriannuels directs avec la coopérative — sans intermédiaire. Une part de ce surplus finance un fonds de santé mutuel pour les artisanes et leurs familles, et l'installation de points d'eau solaires qui réduisent, chaque saison, la distance à parcourir pour aller puiser.",
      },
      {
        type: "paragraphe",
        texte:
          "Ce que nous rapportons de Dindéfélo n'est donc jamais une matière première anonyme. C'est un beurre dont on connaît le nom de la collectrice, la date du battage et les coordonnées de l'arbre mère — la même exigence de traçabilité absolue qui gouverne, à des milliers de kilomètres, le travail de nos formulateurs parisiens.",
      },
    ],
  },
];

export function getArticleBySlug(slug: string): ArticleJournal | undefined {
  return ARTICLES.find((article) => article.slug === slug);
}

export function getArticleALaUne(): ArticleJournal {
  return ARTICLES.find((article) => article.aLaUne) ?? ARTICLES[0];
}

export function getAutresArticles(excludeSlug?: string): ArticleJournal[] {
  return ARTICLES.filter((article) => !article.aLaUne && article.slug !== excludeSlug);
}

export function getArticlesLies(slug: string, limite = 3): ArticleJournal[] {
  return ARTICLES.filter((article) => article.slug !== slug).slice(0, limite);
}
