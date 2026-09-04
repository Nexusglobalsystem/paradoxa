"use client";

import { useActionState } from "react";

import { Button, Field, Input } from "@/components/ui";

import { envoyerLienMagique, type EtatConnexionClient } from "./actions";

const etatInitial: EtatConnexionClient = {};

export function FormulaireConnexion() {
  const [etat, action, enCours] = useActionState(envoyerLienMagique, etatInitial);

  if (etat.envoye) {
    return (
      <p className="font-interface text-body-reading text-encre-baobab" role="status">
        Un lien de connexion vous a été envoyé par email. Ouvrez-le depuis cet appareil pour
        accéder à votre compte — il expire après quelques minutes.
      </p>
    );
  }

  return (
    <form action={action} className="flex flex-col gap-space-lg">
      <Field
        id="email-compte"
        label="Adresse email"
        required
        helperText="Nous vous envoyons un lien de connexion, aucun mot de passe à retenir."
      >
        <Input type="email" name="email" autoComplete="email" required />
      </Field>
      {etat.erreur ? (
        <p role="alert" className="font-interface text-caption-meta text-danger">
          {etat.erreur}
        </p>
      ) : null}
      <Button type="submit" size="lg" disabled={enCours}>
        {enCours ? "Envoi…" : "Recevoir mon lien de connexion"}
      </Button>
    </form>
  );
}
