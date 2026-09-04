import { redirect } from "next/navigation";
import type { ReactNode } from "react";

import { createClient } from "@/lib/supabase/server";

/**
 * Garde-fou de l'espace client : exige une session Supabase valide, sans
 * exigence de rôle (contrairement à app/(admin)/(protected)/layout.tsx, qui
 * exige role='admin') — n'importe quel compte authentifié (role='client' par
 * défaut, voir public.profiles) peut accéder à /compte. Un admin connecté
 * y a aussi accès, sans traitement spécial : rien ne l'empêche d'avoir
 * lui-même des commandes passées côté client.
 */
export default async function CompteProtectedLayout({ children }: { children: ReactNode }) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/compte/connexion");
  }

  return <>{children}</>;
}
