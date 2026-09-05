import { type ClassValue, clsx } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

/**
 * tailwind-merge ne connaît que la palette et l'échelle typographique par
 * défaut de Tailwind : sans cette extension, un nom de couleur personnalisé
 * (ex. `text-ivoire-bouye`) et un nom de taille de texte personnalisé (ex.
 * `text-body-ui`) partagent le même préfixe `text-` et sont traités comme
 * *conflictuels* — twMerge n'en garde qu'un des deux, silencieusement.
 * Bug réel constaté : sur `Button`, `variantClasses[variant]` pose
 * `text-ivoire-bouye` (couleur) puis `sizeClasses[size]` pose `text-body-ui`
 * (taille) ; twMerge supprimait la couleur, le bouton héritait de la couleur
 * de texte globale (`body { color }`) au lieu de sa couleur de variante —
 * illisible sur les variantes à fond sombre (primary/danger). Cette
 * extension déclare explicitement les deux groupes pour que les deux
 * utilitaires cohabitent, comme n'importe quelle paire `text-red-500
 * text-lg` de la palette Tailwind par défaut.
 */
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "text-color": [
        {
          text: [
            "encre-baobab",
            "terre-de-dakar",
            "terre-de-dakar-strong",
            "ocre-solaire",
            "ocre-solaire-strong",
            "or-karite",
            "or-karite-strong",
            "vert-moringa",
            "vert-moringa-strong",
            "sauge-claire",
            "rouge-bissap",
            "ivoire-bouye",
            "sable",
            "surface",
            "surface-dim",
            "surface-bright",
            "surface-container-lowest",
            "surface-container-low",
            "surface-container",
            "surface-container-high",
            "surface-container-highest",
            "surface-variant",
            "on-surface",
            "on-surface-variant",
            "inverse-surface",
            "inverse-on-surface",
            "outline",
            "outline-variant",
            "background",
            "on-background",
            "maison-primary",
            "maison-primary-strong",
            "maison-accent",
            "success",
            "danger",
          ],
        },
      ],
      "font-size": [
        {
          text: [
            "display-hero",
            "display-hero-mobile",
            "headline-lg",
            "headline-lg-mobile",
            "headline-md",
            "headline-sm",
            "title-editorial",
            "body-reading",
            "body-ui",
            "label-tabular",
            "caption-meta",
          ],
        },
      ],
    },
  },
});

/**
 * Fusionne des classes Tailwind conditionnelles en résolvant les conflits
 * d'utilitaires (ex. deux classes p-* concurrentes). Utilisé par toutes les
 * primitives de /components/ui pour composer variants + className consommateur.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
