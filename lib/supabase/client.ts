"use client";

import { createBrowserClient } from "@supabase/ssr";

import { supabasePublishableKey, supabaseUrl } from "./env";

/**
 * Browser-side Supabase client — for Client Components only. Server
 * Components and Server Actions must use `lib/supabase/server.ts` instead,
 * which is cookie-aware in a way this one deliberately isn't.
 */
export function createClient() {
  return createBrowserClient(supabaseUrl(), supabasePublishableKey());
}
