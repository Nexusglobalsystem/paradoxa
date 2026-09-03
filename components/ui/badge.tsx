import * as React from "react";

import { cn } from "@/lib/utils";

export type BadgeVariant = "neutral" | "accent" | "success" | "danger" | "outline";

const variantClasses: Record<BadgeVariant, string> = {
  neutral: "bg-surface-container text-on-surface-variant",
  // S'adapte à la maison active via --color-maison-accent / -primary-strong.
  accent: "bg-maison-accent/20 text-maison-primary-strong",
  success: "bg-vert-moringa/15 text-success",
  danger: "bg-danger/10 text-danger",
  outline: "border border-outline-variant bg-transparent text-on-surface-variant",
};

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

/** Pill de statut — jamais en tout-majuscule (règle direction artistique). */
export function Badge({ className, variant = "neutral", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "font-interface inline-flex w-fit items-center gap-space-xxs rounded-full px-space-sm py-space-xxs text-caption-meta font-caption-meta",
        variantClasses[variant],
        className,
      )}
      {...props}
    />
  );
}
