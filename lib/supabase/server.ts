import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { hasSupabaseEnv, SUPABASE_KEY, SUPABASE_URL } from "./env";

/**
 * Server-side Supabase client. Created fresh per request (never cached in a
 * global) because it reads that request's cookies — per Supabase SSR docs.
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(SUPABASE_URL!, SUPABASE_KEY!, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // setAll was called from a Server Component. This can be ignored
          // because middleware refreshes sessions.
        }
      },
    },
  });
}

/**
 * Verifies the logged-in admin *next to the data* (PRD §12: middleware is
 * only UX — cookies can be spoofed, so every protected page/action re-checks
 * here via getClaims, never getSession).
 */
export async function getAdminClaims() {
  if (!hasSupabaseEnv()) return null;
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  return data?.claims ?? null;
}
