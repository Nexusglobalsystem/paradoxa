import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * Accordéon fondé sur <details>/<summary> : ouverture, clavier et ARIA sont
 * natifs au navigateur, donc pas de useState/useEffect — reste un Server
 * Component (règle CLAUDE.md n°3). La rotation du chevron est pilotée par
 * le sélecteur CSS group-open, pas par du JS.
 */
export function Accordion({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("divide-y divide-outline-variant/40", className)} {...props} />;
}

export type AccordionItemProps = React.DetailsHTMLAttributes<HTMLDetailsElement>;

export function AccordionItem({ className, ...props }: AccordionItemProps) {
  return <details className={cn("group py-space-xs", className)} {...props} />;
}

export interface AccordionTriggerProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
}

export function AccordionTrigger({ className, children, ...props }: AccordionTriggerProps) {
  return (
    <summary
      className={cn(
        "font-display marker:content-none [&::-webkit-details-marker]:hidden",
        "flex cursor-pointer list-none items-center justify-between gap-space-md py-space-sm text-title-editorial text-encre-baobab transition-colors duration-300 ease-out",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-or-karite focus-visible:ring-offset-2 focus-visible:ring-offset-surface",
        className,
      )}
      {...props}
    >
      <span>{children}</span>
      <svg
        aria-hidden="true"
        viewBox="0 0 20 20"
        fill="none"
        className="size-5 shrink-0 text-maison-primary-strong transition-transform duration-300 ease-out group-open:rotate-180"
      >
        <path
          d="M5 7.5 10 12.5 15 7.5"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </summary>
  );
}

export function AccordionContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "font-interface reading-max pb-space-md pt-space-xs text-body-ui text-on-surface-variant",
        className,
      )}
      {...props}
    />
  );
}
