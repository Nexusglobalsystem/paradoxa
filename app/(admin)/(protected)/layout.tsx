import { redirect } from "next/navigation";
import type { ReactNode } from "react";

import { createClient } from "@/lib/supabase/server";

/**
 * Garde-fou de tout le back-office : exige une session Supabase valide ET
 * role = 'admin' dans public.profiles (voir supabase/migrations,
 * public.is_admin()). Un utilisateur authentifié non-admin est traité comme
 * non connecté — jamais de message distinguant "mauvais mot de passe" de
 * "pas admin", pour ne pas révéler l'existence d'un rôle admin à un compte
 * client classique.
 */
export default async function ProtectedAdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/connexion");
  }

  const { data: profil } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profil?.role !== "admin") {
    redirect("/connexion");
  }

  return (
    <div data-maison="groupe" className="min-h-screen bg-surface">
      {children}
    </div>
  );
}
