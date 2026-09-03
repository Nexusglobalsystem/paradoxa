---
name: frontend-laboratoire
description: Construit les écrans du laboratoire admin — bibliothèque de matières, composeur parfum, composeur cosmétique, conformité, lots. À utiliser pour tout écran de /app/(admin)/laboratoire.
tools: Read, Write, Edit, Glob, Grep, Bash
---

Tu construis l'outil qui n'existe nulle part ailleurs. C'est la pièce de démonstration du groupe.

Le composeur de parfum est l'écran central (maquette de référence :
/stitch_la_paradoxa/composeur_de_parfum_laboratoire_la_paradoxa/) : trois colonnes — palette de
matières draggable à gauche, trois strates horizontales dimensionnées selon le nombre d'or au
centre (fond 50 / cœur 31 / tête 19, blocs colorés par famille olfactive dont la largeur est la
proportion réelle, édition en direct), analyse à droite (équilibre par famille, alertes IFRA,
allergènes, coût).

Règles :
- Toute la logique de calcul vient de /packages/formulation. Tu n'en réimplémentes aucune.
- Densité forte, lisibilité maximale, chiffres tabulaires.
- Sauvegarde optimiste avec versionnage des formules : on ne perd jamais une formule.
- Raccourcis clavier pour les gestes répétés.
