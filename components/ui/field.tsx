import * as React from "react";

import { cn } from "@/lib/utils";

type FieldControlProps = {
  id?: string;
  "aria-describedby"?: string;
  "aria-invalid"?: React.AriaAttributes["aria-invalid"];
};

export interface FieldProps {
  id: string;
  label: string;
  helperText?: string;
  errorText?: string;
  required?: boolean;
  className?: string;
  /** Input, Textarea (ou tout contrôle acceptant id / aria-*). */
  children: React.ReactElement<FieldControlProps>;
}

/**
 * Associe un label et un message d'aide/erreur à un contrôle de formulaire.
 * Server Component : id fourni explicitement par l'appelant (pas de
 * React.useId, réservé aux Client Components).
 */
export function Field({
  id,
  label,
  helperText,
  errorText,
  required,
  className,
  children,
}: FieldProps) {
  const describedBy = errorText
    ? `${id}-error`
    : helperText
      ? `${id}-helper`
      : undefined;

  return (
    <div className={cn("flex flex-col gap-space-xxs", className)}>
      <label
        htmlFor={id}
        className="font-interface text-caption-meta text-on-surface-variant"
      >
        {label}
        {required ? (
          <span aria-hidden="true" className="text-danger">
            {" "}
            *
          </span>
        ) : null}
      </label>
      {React.cloneElement(children, {
        id,
        "aria-describedby": describedBy,
        "aria-invalid": errorText ? true : undefined,
      })}
      {errorText ? (
        <p id={`${id}-error`} className="font-interface text-caption-meta text-danger">
          {errorText}
        </p>
      ) : helperText ? (
        <p
          id={`${id}-helper`}
          className="font-interface text-caption-meta text-on-surface-variant/80"
        >
          {helperText}
        </p>
      ) : null}
    </div>
  );
}
