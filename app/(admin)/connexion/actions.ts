"use server";

import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

export interface EtatConnexion {
  erreur?: string;
}

export async function seConnecter(
  _etatPrecedent: EtatConnexion,
  formData: FormData,
): Promise<EtatConnexion> {
  const email = String(formData.get("email") ?? "");
  const motDePasse = String(formData.get("mot-de-passe") ?? "");

  if (!email || !motDePasse) {
    return { erreur: "Adresse email et mot de passe requis." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password: motDePasse,
  });

  if (error) {
    return { erreur: "Identifiants incorrects." };
  }

  // /admin n'existe pas encore comme route dédiée : /laboratoire est la
  // première destination protégée réellement construite (Vague 1).
  redirect("/laboratoire");
}
