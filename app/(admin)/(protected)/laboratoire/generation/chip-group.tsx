"use client";

import { cn } from "@/lib/utils";

export interface ChipOption<T extends string> {
  value: T;
  label: string;
}

export interface ChipGroupProps<T extends string> {
  legend: string;
  options: ReadonlyArray<ChipOption<T>>;
  value: T;
  onChange: (value: T) => void;
  optional?: boolean;
  className?: string;
}

/**
 * Single-select chip group — the "Maison / Genre / Famille dominante / …"
 * constraint controls of écran 33. A plain `<fieldset>` of toggle buttons
 * (native keyboard support, `aria-pressed` for state) rather than a custom
 * listbox widget, matching the mockup's chip styling without extra ARIA
 * machinery.
 */
export function ChipGroup<T extends string>({
  legend,
  options,
  value,
  onChange,
  optional,
  className,
}: ChipGroupProps<T>) {
  return (
    <fieldset className={cn("space-y-space-xs", className)}>
      <legend className="font-interface text-caption-meta uppercase tracking-widest text-or-karite">
        {legend}
        {optional ? <span className="ml-space-xxs normal-case text-sable/50">(optionnel)</span> : null}
      </legend>
      <div className="flex flex-wrap gap-space-xs">
        {options.map((option) => {
          const selectionne = option.value === value;
          return (
            <button
              key={option.value}
              type="button"
              aria-pressed={selectionne}
              onClick={() => onChange(option.value)}
              className={cn(
                "rounded font-label-tabular text-label-tabular px-space-sm py-space-xxs transition-colors duration-300 ease-out",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-or-karite focus-visible:ring-offset-2 focus-visible:ring-offset-encre-baobab",
                selectionne
                  ? "bg-or-karite text-encre-baobab"
                  : "bg-ivoire-bouye/10 text-sable hover:bg-ivoire-bouye/20",
              )}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
