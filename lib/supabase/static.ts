import { createClient as createSupabaseClient } from "@supabase/supabase-js";

import type { Database } from "./database.types";
import { supabasePublishableKey, supabaseUrl } from "./env";

/**
 * Client pour les contextes qui tournent au moment du build, sans requête
 * HTTP ni session possible — `generateStaticParams` notamment.
 * `lib/supabase/server.ts` appelle `cookies()` (API Next.js dynamique),
 * ce qui est interdit dans `generateStaticParams` : "used `cookies()`
 * inside `generateStaticParams`... runs at build time without an HTTP
 * request." Ce client n'a pas besoin de session — il ne lit que du contenu
 * public (`produits` où `statut = 'actif'`), jamais de table admin.
 */
export function createStaticClient() {
  return createSupabaseClient<Database>(supabaseUrl(), supabasePublishableKey());
}
