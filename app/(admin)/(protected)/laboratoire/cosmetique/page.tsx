import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

/**
 * `/laboratoire/cosmetique` sans identifiant (le lien de nav de layout.tsx
 * pointe ici) : redirige vers la formule cosmétique la plus récemment
 * modifiée, ou vers "nouvelle" si aucune n'existe encore. Même pattern que
 * `/laboratoire/parfum` (voir ../parfum/page.tsx).
 */
export default async function CosmetiqueIndexPage() {
  const supabase = await createClient();

  const { data } = await supabase
    .from("formules")
    .select("id")
    .eq("type_formule", "cosmetique")
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  redirect(`/laboratoire/cosmetique/${data?.id ?? "nouvelle"}`);
}
