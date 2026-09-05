"use client";

import { useActionState, useEffect, useRef } from "react";

import { Button, Field, Input, Textarea } from "@/components/ui";

import { envoyerMessage, type EtatContact } from "./actions";

const etatInitial: EtatContact = {};

const SUJETS = [
  { value: "sur-mesure", label: "Commande sur-mesure" },
  { value: "conseil", label: "Conseil olfactif ou rituel de soin" },
  { value: "echantillons", label: "Échantillons & presse" },
  { value: "sourcing", label: "Sourcing & partenariats" },
  { value: "sav", label: "Service après-vente" },
  { value: "autre", label: "Autre demande" },
];

// Même filet minimaliste que components/ui/input.tsx (baseFieldClasses n'est
// pas exporté) — <select> natif, pas de dépendance UI supplémentaire pour un
// menu à six options.
// focus-visible:ring-encre-baobab : même correctif que components/ui/input.tsx
// (le filet de repli seul n'offre aucun focus visible — WCAG 2.4.7, Vague 5).
const selectClasses =
  "font-interface w-full bg-transparent py-space-xs text-body-ui text-encre-baobab border-0 border-b-2 border-outline-variant/60 transition-colors duration-300 ease-out focus:border-maison-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-encre-baobab focus-visible:ring-offset-2 focus-visible:ring-offset-surface";

export function ContactForm() {
  const [etat, action, enCours] = useActionState(envoyerMessage, etatInitial);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (etat.succes) {
      formRef.current?.reset();
    }
  }, [etat.succes]);

  return (
    <form ref={formRef} action={action} className="space-y-space-lg" noValidate>
      {etat.succes ? (
        <p
          role="status"
          className="border-l-2 border-vert-moringa bg-vert-moringa/10 p-space-md font-interface text-body-ui text-encre-baobab"
        >
          Votre message a bien été transmis à notre conciergerie. Une réponse personnalisée
          vous parvient généralement sous 48 heures ouvrées.
        </p>
      ) : null}

      <div className="grid grid-cols-1 gap-space-lg sm:grid-cols-2">
        <Field id="nom" label="Nom complet" required>
          <Input name="nom" placeholder="Aïssata Diop" autoComplete="name" required />
        </Field>
        <Field id="email" label="Adresse email" required>
          <Input type="email" name="email" placeholder="vous@exemple.com" autoComplete="email" required />
        </Field>
      </div>

      <Field id="sujet" label="Objet de la demande" required>
        <select name="sujet" required defaultValue="" className={selectClasses}>
          <option value="" disabled>
            Choisir un objet…
          </option>
          {SUJETS.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      </Field>

      <Field id="message" label="Votre message" required>
        <Textarea
          name="message"
          rows={5}
          placeholder="Décrivez votre demande, vos envies olfactives ou votre routine de soin…"
          required
        />
      </Field>

      {etat.erreur ? (
        <p role="alert" className="font-interface text-caption-meta text-danger">
          {etat.erreur}
        </p>
      ) : null}

      <Button type="submit" size="lg" disabled={enCours}>
        {enCours ? "Envoi…" : "Envoyer le message"}
      </Button>
    </form>
  );
}
