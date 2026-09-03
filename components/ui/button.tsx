import * as React from "react";

import { cn } from "@/lib/utils";

export type ButtonVariant = "primary" | "outline" | "ghost" | "danger";
export type ButtonSize = "sm" | "md" | "lg";

const variantClasses: Record<ButtonVariant, string> = {
  // Fond plein dans la couleur d'accent de la maison active (data-maison
  // sur un ancêtre) — jamais une couleur codée en dur dans le composant.
  primary:
    "bg-maison-primary-strong text-ivoire-bouye shadow-ambient hover:brightness-90 active:brightness-95",
  outline:
    "border border-maison-primary-strong text-maison-primary-strong bg-transparent hover:bg-maison-primary/10",
  ghost: "text-on-surface-variant hover:bg-surface-container hover:text-on-surface",
  danger: "bg-danger text-ivoire-bouye hover:brightness-90 active:brightness-95",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "gap-space-xxs rounded px-space-sm py-space-xs text-caption-meta font-caption-meta",
  md: "gap-space-xs rounded-lg px-space-md py-space-sm text-body-ui font-body-ui",
  lg: "gap-space-sm rounded-lg px-space-lg py-space-md text-body-ui font-body-ui",
};

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

/**
 * Bouton d'action. Server Component : pas d'état interne, `onClick` etc.
 * ne fonctionnent que rendus depuis un parent client — c'est attendu, la
 * primitive elle-même ne force pas la frontière "use client".
 */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant = "primary", size = "md", type = "button", ...props },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        type={type}
        className={cn(
          "font-interface inline-flex items-center justify-center font-medium tracking-wide transition-colors duration-300 ease-out disabled:pointer-events-none disabled:opacity-40",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-or-karite focus-visible:ring-offset-2 focus-visible:ring-offset-surface",
          variantClasses[variant],
          sizeClasses[size],
          className,
        )}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";
