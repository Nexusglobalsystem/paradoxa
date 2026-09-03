import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

import { supabasePublishableKey, supabaseUrl } from "./env";

/**
 * Refreshes the Supabase auth session on every request that matches
 * middleware.ts's matcher. Required by @supabase/ssr: without this, a
 * Server Component reading an expired-but-refreshable session would see the
 * user as logged out. Does not itself gate access — route protection lives
 * in app/(admin)/(protected)/layout.tsx.
 */
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(supabaseUrl(), supabasePublishableKey(), {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        for (const { name, value } of cookiesToSet) {
          request.cookies.set(name, value);
        }
        response = NextResponse.next({ request });
        for (const { name, value, options } of cookiesToSet) {
          response.cookies.set(name, value, options);
        }
      },
    },
  });

  // Ne pas retirer : nécessaire pour que le SDK rafraîchisse effectivement
  // le token si besoin avant que la réponse ne parte.
  await supabase.auth.getUser();

  return response;
}
