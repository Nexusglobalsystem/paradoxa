import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Fusionne des classes Tailwind conditionnelles en résolvant les conflits
 * d'utilitaires (ex. deux classes p-* concurrentes). Utilisé par toutes les
 * primitives de /components/ui pour composer variants + className consommateur.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
