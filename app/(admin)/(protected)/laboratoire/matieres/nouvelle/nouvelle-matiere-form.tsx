"use client";

import { useActionState } from "react";

import { Button, Field, Input } from "@/components/ui";
import { FAMILLES_OLFACTIVES, ORDRE_FAMILLES } from "@/components/laboratoire/familles-olfactives";
import { Select } from "@/components/laboratoire/select";

import { creerMatiere, type EtatNouvelleMatiere } from "./actions";

const etatInitial: EtatNouvelleMatiere = {};

export function NouvelleMatiereForm() {
  const [etat, action, enCours] = useActionState(creerMatiere, etatInitial);

  return (
    <form action={action} className="space-y-space-lg">
      <div className="grid grid-cols-1 gap-space-md md:grid-cols-2">
        <Field id="nom" label="Nom de la matière" required>
          <Input name="nom" required />
        </Field>
        <Field id="reference_interne" label="Référence interne" helperText="ex. MP-KAR-004">
          <Input name="reference_interne" />
        </Field>
        <Field id="famille_olfactive" label="Famille olfactive" required>
          <Select name="famille_olfactive" required defaultValue="">
            <option value="" disabled>
              Choisir une famille…
            </option>
            {ORDRE_FAMILLES.map((cle) => (
              <option key={cle} value={cle}>
                {FAMILLES_OLFACTIVES[cle].label}
              </option>
            ))}
          </Select>
        </Field>
        <Field id="facette_libre" label="Facette (libellé affiché)" helperText='ex. "Boisé Ambré"'>
          <Input name="facette_libre" />
        </Field>
        <Field id="nature" label="Nature">
          <Select name="nature" defaultValue="naturel">
            <option value="naturel">Naturel</option>
            <option value="synthese">Synthèse</option>
          </Select>
        </Field>
        <Field id="volatilite" label="Volatilité de référence">
          <Select name="volatilite" defaultValue="">
            <option value="">Non renseignée</option>
            <option value="tete">Tête</option>
            <option value="tete_coeur">Tête-Cœur</option>
            <option value="coeur">Cœur</option>
            <option value="coeur_fond">Cœur-Fond</option>
            <option value="fond">Fond</option>
          </Select>
        </Field>
        <Field id="puissance" label="Puissance (1 à 5)" required>
          <Input name="puissance" type="number" min={1} max={5} defaultValue={3} numeric required />
        </Field>
        <Field id="prix_kg" label="Prix / kg (€)" required>
          <Input name="prix_kg" type="number" min={0} step="0.01" defaultValue={0} numeric required />
        </Field>
        <Field id="stock_kg" label="Stock initial (kg)">
          <Input name="stock_kg" type="number" min={0} step="0.001" defaultValue={0} numeric />
        </Field>
        <Field id="inci" label="Nom INCI">
          <Input name="inci" />
        </Field>
        <Field id="cas_number" label="Numéro CAS">
          <Input name="cas_number" />
        </Field>
        <Field id="fournisseur" label="Fournisseur">
          <Input name="fournisseur" />
        </Field>
        <Field id="origine" label="Origine / terroir" helperText="ex. Kédougou, Sénégal">
          <Input name="origine" />
        </Field>
      </div>

      <label className="flex items-center gap-space-xs font-interface text-body-ui text-encre-baobab">
        <input type="checkbox" name="est_captif" className="accent-encre-baobab" />
        Procédé / matière captive, exclusive à l&apos;atelier
      </label>

      {etat.erreur ? (
        <p role="alert" className="font-interface text-caption-meta text-danger">
          {etat.erreur}
        </p>
      ) : null}

      <Button type="submit" size="lg" disabled={enCours}>
        {enCours ? "Enregistrement…" : "Enregistrer la matière"}
      </Button>
    </form>
  );
}
