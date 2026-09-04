"use server";

import { createClient } from "@/lib/supabase/server";

export interface EtatConnexionClient {
  envoye?: boolean;
  erreur?: string;
}

/**
 * Connexion client par lien magique (OTP email Supabase Auth) plutôt que
 * mot de passe — cohérent avec un checkout invité par défaut : pas de mot
 * de passe à choisir/oublier pour un compte qu'on crée en une fois pour
 * suivre une commande. Envoyé par l'email intégré de Supabase Auth (aucune
 * RESEND_API_KEY nécessaire ici, contrairement à l'email de confirmation de
 * commande — voir app/api/webhooks/stripe/envoyer-email-confirmation.ts).
 * Un compte 'client' (public.profiles.role, défaut) est créé automatiquement
 * au premier lien cliqué, via le trigger handle_new_user existant
 * (supabase/migrations/20260903193558_profiles_and_roles.sql) — rien à
 * faire ici pour la création de compte elle-même.
 */
export async function envoyerLienMagique(
  _etatPrecedent: EtatConnexionClient,
  formData: FormData,
): Promise<EtatConnexionClient> {
  const email = String(formData.get("email") ?? "").trim();
  if (!email || !/.+@.+\..+/.test(email)) {
    return { erreur: "Adresse email invalide." };
  }

  const supabase = await createClient();
  const origine = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: { emailRedirectTo: `${origine}/auth/callback` },
  });

  if (error) {
    return { erreur: "Impossible d'envoyer le lien de connexion. Réessayez dans un instant." };
  }

  return { envoye: true };
}
