"use client";

import { useActionState } from "react";

import { Button, Field, Input } from "@/components/ui";

import { seConnecter, type EtatConnexion } from "./actions";

const etatInitial: EtatConnexion = {};

export function LoginForm() {
  const [etat, action, enCours] = useActionState(seConnecter, etatInitial);

  return (
    <form action={action} className="flex flex-col gap-space-lg">
      <Field id="email" label="Adresse email" required>
        <Input type="email" name="email" autoComplete="email" required />
      </Field>
      <Field id="mot-de-passe" label="Mot de passe" required>
        <Input
          type="password"
          name="mot-de-passe"
          autoComplete="current-password"
          required
        />
      </Field>
      {etat.erreur ? (
        <p role="alert" className="font-interface text-caption-meta text-danger">
          {etat.erreur}
        </p>
      ) : null}
      <Button type="submit" size="lg" disabled={enCours}>
        {enCours ? "Connexion…" : "Se connecter"}
      </Button>
    </form>
  );
}
