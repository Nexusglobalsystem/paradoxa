import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

import type { Database } from "./database.types";
import { supabasePublishableKey, supabaseUrl } from "./env";

/**
 * Server-side Supabase client — for Server Components, Server Actions and
 * route handlers. Reads/writes the auth session via Next.js cookies(), so
 * RLS policies see the real signed-in user (never the service role: this
 * client only ever holds the publishable key).
 *
 * `setAll` is wrapped in try/catch because a Server Component can call this
 * during a render where cookies are read-only — safe to ignore there, since
 * the middleware (see middleware.ts) is what actually persists a refreshed
 * session on the response.
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(supabaseUrl(), supabasePublishableKey(), {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          for (const { name, value, options } of cookiesToSet) {
            cookieStore.set(name, value, options);
          }
        } catch {
          // Appelé depuis un Server Component (lecture seule) — sans effet,
          // le middleware se charge du rafraîchissement de session.
        }
      },
    },
  });
}
