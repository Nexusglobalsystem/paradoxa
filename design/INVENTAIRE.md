# LA PARADOXA — Inventaire des écrans (Phase 0)

## Méthode de reconnaissance

1. **MCP Stitch** : configuré dans ce projet (`stitch` → `https://stitch.googleapis.com/mcp`) mais **non actif dans cette session** — n'apparaît pas dans les outils disponibles malgré un reload. À investiguer séparément (dialogue de confiance du dossier probable).
2. **MCP Figma** : non configuré.
3. **Fallback utilisé** : export direct Stitch en HTML + PNG, déposé dans `/stitch_la_paradoxa/` (57 dossiers). C'est le chemin de repli prévu par le brief.

Chaque écran exporté contient `code.html` (HTML + Tailwind CDN, config de tokens inline) et `screen.png` (aperçu). Le bloc `tailwind.config` (couleurs, typo, espacements, rayons) est **identique octet pour octet** dans les 40 écrans réels — vérifié par extraction sur 3 écrans et recoupement avec les 37 autres. C'est la source de vérité de `design/tokens.json`.

Légende de confiance :
- ✅ **Vérifié** — HTML ouvert et lu en détail.
- 🔍 **Confirmé par grep** — composants/états confirmés par recherche ciblée sur le fichier réel.
- 📋 **D'après le brief** — rôle et composants repris du prompt Stitch d'origine (`la_paradoxa_prompts_stitch.md`, écrit par l'utilisateur), non ouvert individuellement.

---

## Partie 1 — Écrans publics (vitrine + boutique)

| # | Écran | Dossier | Route Next.js cible | Rôle | Composants clés | Conf. |
|---|---|---|---|---|---|---|
| 1 | Portail — l'entrée | `portail_du_groupe_l_entr_e` | `/` `(vitrine)` | Hero deux portes SHÉA/ÉCLORÉE, manifeste court, footer newsletter | Split 50/50 interactif (hover expand 700ms), emblème flottant central, grille 3 piliers, 2 cartes coffret croisé, formulaire newsletter (feedback JS inline) | ✅ |
| 2 | Manifeste | `manifeste_l_histoire_du_groupe_la_paradoxa` | `/manifeste` | Histoire du groupe, article long-format | Colonne 65ch, pull-quotes, timeline horizontale, portrait fondateur | 📋 |
| 3 | SHÉA — accueil | `sh_a_accueil_de_la_maison` | `/shea` | Landing maison parfum | Hero vidéo-still, rangée scroll horizontal 6 flacons, diagramme strates φ, bannière coffret | 📋 |
| 4 | Collection africaine | `sh_a_la_collection_africaine_la_carte_du_voyage` | `/shea/collection` | Carte des 6 escales → 6 parfums | Carte SVG or interactive, 6 sections alternées image/produit, filtres (genre, famille) | 📋 |
| 5 | Fiche parfum | `sh_a_fiche_parfum_bois_de_sh_a` | `/shea/parfums/[slug]` | Fiche produit SHÉA | Colonne sticky flacon, sélecteur volume, pyramide olfactive φ animée, accordéon, produits complémentaires, avis | 📋 |
| 6 | Quiz olfactif | `sh_a_quiz_olfactif_trouvez_votre_escale` | `/shea/quiz` | Quiz immersif → recommandation | Cartes image plein écran, barre de progression or, transition ink-bleed, écran résultat | 📋 |
| 7 | Coffret découverte | `sh_a_le_coffret_d_couverte_cinq_escales` | `/shea/coffret-decouverte` | Landing produit d'appel | Hero 5 fioles, explication 3 étapes, témoignages | 📋 |
| 8 | ÉCLORÉE — accueil | `clor_e_accueil_de_la_maison` | `/ecloree` | Landing maison soin | Hero macro karité, 3 cartes rituel, 2 panneaux actifs (karité/moringa), bestsellers, bandeau sourcing | 📋 |
| 9 | Rituel Tête (catégorie) | `clor_e_rituel_t_te_soins_capillaires` | `/ecloree/rituel-tete` | Page catégorie ÉCLORÉE | Grille produit 3 col., filtres sidebar, CTA "Composer ma routine" | 📋 |
| 10 | Fiche produit cosmétique | `clor_e_masque_r_parateur_karit_intense` | `/ecloree/produits/[slug]` | Fiche produit ÉCLORÉE | 4 onglets (bienfaits/ingrédients/utilisation/engagements), bloc INCI, badge "98% origine naturelle" | 📋 |
| 11 | Page ingrédient — moringa | `clor_e_page_ingr_dient_moringa_oleifera_l_arbre_de_vie` | `/ingredients/moringa` | Éditorial ingrédient | Hero macro, layout long-format, illustration ligne or, panel molécules actives | 📋 |
| 12 | Journal — liste | `journal_la_paradoxa` | `/journal` | Index blog | Article à la une, grille masonry 2 col., tags catégorie, sidebar newsletter | 📋 |
| 13 | Article | `article_l_aube_sur_le_ferlo_la_paradoxa` | `/journal/[slug]` | Page article | Hero photo, colonne 65ch, lettrine, barre de progression lecture, related articles | 📋 |
| 14 | Panier | `panier_la_paradoxa` | `/panier` `(boutique)` | Panier | Liste articles + stepper, code promo, résumé sticky, barre livraison offerte, échantillons offerts | 🔍 (états vide/pulse confirmés par grep) |
| 15 | Tunnel de commande | `tunnel_de_commande_la_paradoxa` | `/commande` `(boutique)` | Checkout 3 étapes | Indicateur d'étapes or, formulaire, résumé sticky, CB/Apple Pay/PayPal/Wave/Orange Money | 📋 |
| 16 | Confirmation de commande | `confirmation_de_commande_la_paradoxa` | `/commande/confirmation` | Confirmation | Emblème animé, n° commande, date livraison, cross-sell | 🔍 |
| 17 | Compte client | `compte_client_la_paradoxa` | `/compte` `(boutique)` | Dashboard client | Nav latérale, profil olfactif (bar chart), liste commandes + badges statut | 📋 |
| 18 | Suivi de commande | `suivi_de_commande_la_paradoxa` | `/compte/commandes/[id]` | Tracking | Timeline horizontale 4 états, détail commande, contact SAV | 🔍 |
| 19 | Recherche | `recherche_la_paradoxa` | Overlay global (composant, pas une route dédiée) | Recherche | Input centré, résultats 3 colonnes groupées, suggestions | 📋 |
| 20 | Newsletter / lancement | `lancement_souscription_exclusive_la_paradoxa` | `/lancement` (hors nav principale) | Landing pré-lancement | Fond animé particules or, compte à rebours tabulaire, formulaire email, 3 teasers | 🔍 |
| 21 | Contact / conciergerie | `contact_conciergerie_la_paradoxa` | `/contact` | Contact | Photo atelier + adresse, formulaire, FAQ accordéon | 📋 |
| 22 | Engagements / sourcing | `engagements_sourcing_la_paradoxa` | `/engagements` | Éditorial RSE | 4 sections alternées, diagramme chaîne d'approvisionnement, chiffres clés | 📋 |
| 23 | Pages légales | `mentions_l_gales_conditions_g_n_rales_la_paradoxa` | `/mentions-legales`, `/cgv`, `/confidentialite` (template unique) | Légal | Sommaire sticky, texte long-format numéroté | 📋 |
| 24 | Erreur 404 | `404_cette_escale_n_existe_pas_la_paradoxa` | `app/not-found.tsx` | 404 | Illustration baobab or, 2 CTA (accueil / collection) | ✅ |

---

## Partie 2 — Laboratoire & administration

Palette plus sobre : Encre Baobab dominante, Or Karité pour la donnée, Vert Moringa (conforme) / Rouge Bissap (alerte).

| # | Écran | Dossier | Route Next.js cible | Rôle | Composants clés | Conf. |
|---|---|---|---|---|---|---|
| 25 | Connexion admin | `connexion_administrateur_laboratoire_la_paradoxa` | `/admin/connexion` | Auth | Split plein écran, panneau embossé, form + 2FA | 📋 |
| 26 | Tableau de bord | `tableau_de_bord_administrateur_laboratoire_la_paradoxa` | `/admin` | Dashboard | Top bar + house switcher, nav latérale, 4 KPI tabulaires, courbe CA, alertes stock | 🔍 |
| 27 | Commandes | `commandes_exp_ditions_laboratoire_la_paradoxa` | `/admin/commandes` | Liste commandes | Table dense, badges statut, panneau latéral détail commande | 🔍 |
| 28 | Catalogue produits | `catalogue_produits_administration_la_paradoxa` | `/admin/produits` | Catalogue | Toggle grille/table, stock en barre, sélection multiple + barre d'actions flottante | 🔍 |
| 29 | Fiche produit — édition | `fiche_produit_dition_laboratoire_catalogue_la_paradoxa` | `/admin/produits/[id]` | Édition produit | Cartes repliables, preview live storefront, lien vers formule labo | 🔍 |
| 30 | Bibliothèque de matières | `laboratoire_biblioth_que_de_mati_res_premi_res` | `/admin/laboratoire/matieres` | Base matières | Table dense, filtres famille olfactive (chips colorés), échelle puissance à 5 points, drawer détail | 🔍 |
| 31 | Fiche matière | `laboratoire_fiche_mati_re_karit_sauvage_la_paradoxa` | `/admin/laboratoire/matieres/[id]` (drawer) | Détail matière | Radar chart profil olfactif, table limites IFRA, historique achat | 📋 |
| 32 | **Composeur de parfum** | `composeur_de_parfum_laboratoire_la_paradoxa` | `/admin/laboratoire/parfum/[formuleId]` | **Écran cœur du produit** | 3 colonnes : palette matières draggable (filtres famille) / 3 strates φ proportionnelles (19-31-50%, largeur = % réel, vérifié exact) / table formulation 10 lignes + total 100% + panneau analyse (radar, IFRA, allergènes, coût). Bouton "Équilibrer selon φ (1.618)". Switch concentration EDT/EDP/EXTRAIT. | ✅ (lu intégralement) |
| 33 | Génération assistée | `g_n_ration_assist_e_par_ia_laboratoire_la_paradoxa` | `/admin/laboratoire/generation` | IA composition | Champ prompt central, chips contraintes, strates φ qui se dessinent en cours de génération, carte résultat | 🔍 |
| 34 | Composeur cosmétique | `composeur_cosm_tique_laboratoire_clor_e` | `/admin/laboratoire/cosmetique/[formuleId]` | Formulation cosmétique | 5 blocs de phase (aqueuse/huileuse/émulsion/refroidissement/ajouts), total qui vire au vert à 100%, INCI auto-généré + bouton copier, calculateur lot | 🔍 |
| 35 | Conformité | `conformit_r_glementaire_dip_laboratoire_la_paradoxa` | `/admin/laboratoire/conformite` | Conformité réglementaire | Table formules × statuts (IFRA/challenge test/stabilité/DIP/CPNP), pills conforme/en cours/manquant, drawer checklist | 🔍 |
| 36 | Lots et production | `lots_et_production_registre_d_atelier_la_paradoxa` | `/admin/laboratoire/lots` | Traçabilité lots | Table lots, génération auto fiche de pesée, expansion traçabilité fournisseur | 🔍 |
| 37 | Clients | `r_pertoire_fiches_clients_d_exception_la_paradoxa` | `/admin/clients` | CRM | Table clients + LTV + profil olfactif, drawer historique | 📋 |
| 38 | Éditeur du journal | `diteur_du_journal_administration_la_paradoxa` | `/admin/journal/[id]` | CMS article | Zone d'écriture Fraunces, panneau réglages (cover, SEO, preview résultat recherche) | 📋 |

---

## Partie 3 — États et déclinaisons

**Pas de dossiers dédiés** pour les écrans 39 (chargement), 40 (états vides) et 41 (mobile) du plan initial : Stitch les a **intégrés dans les écrans porteurs** plutôt que générés à part. Confirmé par recherche de motifs (`skeleton`, `animate-pulse`, textes d'état vide) : présents dans 16 des 40 écrans, dont le panier, le tableau de bord, la bibliothèque de matières, la conformité, les lots, la génération IA.
→ Pas de composants d'état séparés à cataloguer ; ils seront extraits au niveau composant (`Skeleton`, `EmptyState`) par l'agent `design-system` en Phase 1, à partir de ces 16 écrans.

| 42 | Système de design | `syst_me_de_design_grammaire_visuelle_la_paradoxa` | Page de référence interne (`/design-system`, non exposée en prod) | Doc visuelle : swatches couleurs nommées, échelle typo, boutons tous états, form fields, badges, cartes, clé couleur famille olfactive, espacements | ✅ (source principale de `tokens.json`, recoupée avec `haute_parfumerie_botanique/DESIGN.md`) |

---

## Assets visuels (photographies génération IA, pas des écrans)

15 dossiers ne contiennent qu'un `screen.png` sans `code.html` : ce sont des visuels de contenu (photos éditoriales) générés séparément par Stitch pour illustrer les pages, pas des maquettes d'interface. À copier vers `/public/images/` lors du Phase 1, pas à cataloguer comme écrans :

macro moringa · macro karité · bannière rituel capillaire · portrait femme éditorial · baobab centenaire · paysage Sahel golden hour · côte sénégalaise · carte Afrique stylisée · fond terracotta atmosphérique · flatlay coffret kraft/or · swatch texture cosmétique · flacon parfum ambré · pot cosmétique verre dépoli · coopérative de femmes · still vidéo parfum ambré.

Un 16ᵉ dossier, `embl_me_karit_la_paradoxa` (1,1 Ko), est un fragment isolé — probablement l'export de l'emblème arbre à karité seul (logo/pictogramme), pas un écran non plus.

---

## Doublon / brouillon hors plan

`la_paradoxa_haute_parfumerie_botanique/code.html` (30 Ko, ni `screen.png`) contient les mêmes titres `SHÉA` / `ÉCLORÉE` que le portail — c'est vraisemblablement une **génération antérieure ou une variante** de l'écran 1. À ignorer au profit de `portail_du_groupe_l_entr_e`, sauf si l'utilisateur préfère cette version.

---

## Écarts constatés & décisions à trancher avant Phase 1

1. **Rayons de bordure — contradiction texte/HTML.** `DESIGN.md` (généré par Stitch) prescrit une géométrie stricte à 0 rayon ("Sharp Geometry", coins à 90°, esprit "pierre taillée"). Mais le HTML réel utilise `rounded-lg` / `rounded-xl` / `rounded-full` sur 39 des 40 écrans (cartes, panneaux labo, pills, avatars) — cohérent d'un écran à l'autre, donc probablement le vrai parti pris visuel de Stitch plutôt qu'une erreur isolée. **Question : garde-t-on les rayons doux réellement dessinés, ou revient-on à l'aplomb strict décrit dans le texte ?** `design/tokens.json` documente les deux dans `radius._conflict`.
2. **Accents français — vérification systématique faite, rien de bloquant trouvé.** "ÉCLORÉE" correctement accentué sur 40/40 écrans visibles. Les 2 seules occurrences sans accent (`Ecloree`, `Shea`) sont dans des attributs `data-alt` internes (métadonnées de génération d'image), invisibles à l'écran — pas d'action requise.
3. **Palette Material 3 résiduelle.** Chaque écran embarque ~25 tokens `surface-*` / `on-primary-fixed-*` issus du générateur Material 3 de Stitch, en plus des 9 couleurs de marque. Le HTML réel n'en consomme qu'une douzaine (surtout les `surface-container-*` pour les fonds ÉCLORÉE et les panneaux labo). À élaguer en Phase 1 pour ne garder que ce qui sert réellement — évite de traîner un theme Material fantôme dans le design system.
4. **Écran "Recherche" et "Pages légales"** ne correspondent pas à une route unique — respectivement un composant overlay global et un template partagé par 3 routes. Signalé dans le tableau, pas une anomalie.

---

## Prochaine étape

Conforme au brief : **rien n'est codé**. En attente de validation de cet inventaire et de `design/tokens.json`, en particulier sur le point 1 (rayons) qui engage tout le design system, avant d'écrire `CLAUDE.md`, les sous-agents et le plan de build en vagues.
