import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";

/**
 * Point d'arrivée du lien magique envoyé par Supabase Auth
 * (`signInWithOtp({ options: { emailRedirectTo: ".../auth/callback" } })`,
 * voir app/(vitrine)/compte/connexion/actions.ts). Échange le `code` contre
 * une session (pose les cookies via lib/supabase/server.ts), puis redirige
 * vers la destination demandée — `/compte` par défaut, ou `next` si fourni
 * (ex. revenir sur `/commande` après une connexion initiée depuis le tunnel).
 *
 * Générique, pas propre au compte client : un futur lien magique admin
 * passerait par le même point d'arrivée.
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/compte";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/compte/connexion?erreur=lien_invalide`);
}
