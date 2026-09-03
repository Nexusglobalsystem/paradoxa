import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

/**
 * `/laboratoire/parfum` sans identifiant (le lien de nav de layout.tsx
 * pointe ici) : redirige vers la formule parfum la plus récemment modifiée,
 * ou vers "nouvelle" si aucune n'existe encore.
 */
export default async function ParfumIndexPage() {
  const supabase = await createClient();

  const { data } = await supabase
    .from("formules")
    .select("id")
    .eq("type_formule", "parfum")
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  redirect(`/laboratoire/parfum/${data?.id ?? "nouvelle"}`);
}
