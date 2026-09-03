import * as React from "react";

import { cn } from "@/lib/utils";

const baseFieldClasses =
  "font-interface w-full bg-transparent py-space-xs text-body-ui text-encre-baobab placeholder:text-on-surface-variant/50 border-0 border-b-2 border-outline-variant/60 transition-colors duration-300 ease-out focus:outline-none focus:border-maison-accent disabled:cursor-not-allowed disabled:opacity-50";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Force la police et les chiffres tabulaires — prix, %, poids. */
  numeric?: boolean;
  invalid?: boolean;
}

/**
 * Champ minimaliste (filet inférieur, jamais de boîte pleine) — fidèle à la
 * section "Champs Minimalistes" du système de design Stitch. Le filet actif
 * s'accorde à la maison (--color-maison-accent).
 */
export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, numeric, invalid, "aria-invalid": ariaInvalid, ...props }, ref) => {
    return (
      <input
        ref={ref}
        aria-invalid={invalid ? true : ariaInvalid}
        className={cn(
          baseFieldClasses,
          numeric && "font-label-tabular text-label-tabular tabular-nums",
          invalid && "border-danger focus:border-danger",
          className,
        )}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  invalid?: boolean;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, invalid, "aria-invalid": ariaInvalid, rows = 4, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        rows={rows}
        aria-invalid={invalid ? true : ariaInvalid}
        className={cn(
          baseFieldClasses,
          "resize-y leading-[1.6]",
          invalid && "border-danger focus:border-danger",
          className,
        )}
        {...props}
      />
    );
  },
);
Textarea.displayName = "Textarea";
