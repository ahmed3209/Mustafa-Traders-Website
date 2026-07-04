import { createClient } from "@supabase/supabase-js";

/** True when both the Supabase URL and service-role key are present. */
export function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.SUPABASE_SERVICE_ROLE_KEY
  );
}

// Server-only client using the service-role key. Bypasses RLS.
// NEVER import this into a client component.
export function createSupabaseAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY"
    );
  }

  return createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
    // Force every request to bypass Next.js' Data Cache. Without this, an
    // unfiltered query cached while there were 0 orders keeps returning empty
    // on later renders (a filtered query is a different cache key, so it shows
    // fresh data). no-store guarantees admin + pricing always read live data.
    global: {
      fetch: (input: RequestInfo | URL, init?: RequestInit) =>
        fetch(input, { ...init, cache: "no-store" }),
    },
  });
}
