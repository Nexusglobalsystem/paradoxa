"use client";

import { useActionState } from "react";

import { cn } from "@/lib/utils";

export interface EtatNewsletter {
  statut: "idle" | "succes" | "erreur";
  message?: string;
}

export type ActionNewsletter = (
  etatPrecedent: EtatNewsletter,
  formData: FormData,
) => Promise<EtatNewsletter>;

const etatInitial: EtatNewsletter = { statut: "idle" };

/**
 * Seule partie du portail qui a besoin d'être Client Component : le retour
 * visuel de confirmation après soumission (useActionState). Reçoit la
 * Server Action en prop depuis page.tsx — voir le commentaire au-dessus de
 * `sInscrireALaNewsletter` pour ce qu'elle fait réellement (rien de
 * persisté, c'est documenté et volontaire pour cette vague).
 */
export function NewsletterForm({ action }: { action: ActionNewsletter }) {
  const [etat, dispatch, enCours] = useActionState(action, etatInitial);

  return (
    <div className="pt-space-md">
      <form
        action={dispatch}
        className="mx-auto flex max-w-md flex-col items-stretch gap-space-sm sm:flex-row"
      >
        <label htmlFor="newsletter-email" className="sr-only">
          Votre adresse électronique
        </label>
        <input
          id="newsletter-email"
          name="email"
          type="email"
          autoComplete="email"
          required
          placeholder="Votre adresse électronique"
          className="w-full flex-1 bg-ivoire-bouye/10 px-space-md py-space-sm font-interface text-body-ui text-ivoire-bouye placeholder:text-sable/50 focus:outline-none focus:ring-1 focus:ring-or-karite"
        />
        <button
          type="submit"
          disabled={enCours}
          className="whitespace-nowrap bg-or-karite px-space-lg py-space-sm font-interface text-body-ui tracking-wider text-encre-baobab shadow-ambient transition-colors duration-300 ease-out hover:bg-ocre-solaire hover:text-ivoire-bouye disabled:pointer-events-none disabled:opacity-60"
        >
          {enCours ? "Envoi…" : "S'inscrire"}
        </button>
      </form>
      <p
        role="status"
        aria-live="polite"
        className={cn(
          "pt-space-sm font-interface text-caption-meta",
          etat.statut === "erreur" ? "text-danger" : "text-or-karite/80",
        )}
      >
        {etat.statut !== "idle" ? etat.message : " "}
      </p>
    </div>
  );
}
