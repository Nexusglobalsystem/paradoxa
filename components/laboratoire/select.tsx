import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * Champ de sélection minimaliste (filet inférieur), même langage visuel que
 * `Input` de components/ui — non couvert par components/ui donc posé ici
 * (étage/phase/maison/type de concentration n'apparaissent que dans le
 * laboratoire).
 */
export const Select = React.forwardRef<
  HTMLSelectElement,
  React.SelectHTMLAttributes<HTMLSelectElement>
>(({ className, children, ...props }, ref) => {
  return (
    <select
      ref={ref}
      className={cn(
        // focus-visible:ring-encre-baobab, pas -or-karite : voir la même
        // note dans components/ui/input.tsx (WCAG 1.4.11 sur fond clair).
        "font-interface w-full bg-transparent py-space-xs text-body-ui text-encre-baobab border-0 border-b-2 border-outline-variant/60 transition-colors duration-300 ease-out focus:border-maison-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-encre-baobab focus-visible:ring-offset-2 focus-visible:ring-offset-surface disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    >
      {children}
    </select>
  );
});
Select.displayName = "Select";
