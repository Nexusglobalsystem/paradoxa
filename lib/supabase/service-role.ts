import { createClient as createSupabaseClient } from "@supabase/supabase-js";

import type { Database } from "./database.types";
import { supabaseUrl } from "./env";

/**
 * Server-only client authenticated with the service_role key — bypasses RLS
 * entirely (CLAUDE.md rule 6: never exposed to the client). Two call sites,
 * both server-only route handlers / Server Components, matching the access
 * model documented in supabase/migrations/20260904135542_commandes.sql:
 *
 *  - app/api/webhooks/stripe/route.ts — writes `commandes` / `commande_lignes`
 *    and decrements `produits.stock`. No RLS policy grants anon/authenticated
 *    INSERT/UPDATE on these tables (by design), so this is the only writer.
 *  - app/(vitrine)/commande/confirmation/page.tsx — reads exactly one
 *    `commande` row by its opaque `stripe_session_id` (the URL's
 *    `?session_id=` query param). There is no public SELECT policy on
 *    `commandes`; the session id itself — unguessable, minted by Stripe — is
 *    what authorizes showing that one order to whoever holds the link, per
 *    the migration's header comment.
 *
 * Plain @supabase/supabase-js (not @supabase/ssr): service_role isn't a user
 * session, so there is no cookie/auth-refresh plumbing to wire up.
 */
function requiredServiceRoleKey(): string {
  const value = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!value) {
    throw new Error(
      "Variable d'environnement manquante : SUPABASE_SERVICE_ROLE_KEY (voir .env.example). " +
        "Nécessaire côté serveur pour le webhook Stripe et la page de confirmation de commande — " +
        "jamais exposée au client.",
    );
  }
  return value;
}

export function createServiceRoleClient() {
  return createSupabaseClient<Database>(supabaseUrl(), requiredServiceRoleKey(), {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
