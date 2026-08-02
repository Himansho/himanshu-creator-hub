import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { hasSupabaseEnv, SUPABASE_KEY, SUPABASE_URL } from "./env";

/**
 * Refreshes the auth session on matched routes and handles redirect UX:
 * logged-out visitors to /dashboard/* go to /login; a logged-in admin
 * visiting /login goes straight to /dashboard. Security is NOT enforced
 * here — every page and action re-verifies with getClaims (PRD §12).
 */
export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const path = request.nextUrl.pathname;

  // Before Supabase is configured (deploy-early M2), the dashboard cannot
  // exist yet — send those visits to the login page's setup notice.
  if (!hasSupabaseEnv()) {
    if (path.startsWith("/dashboard")) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }
    return supabaseResponse;
  }

  const supabase = createServerClient(SUPABASE_URL!, SUPABASE_KEY!, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value)
        );
        supabaseResponse = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options)
        );
      },
    },
  });

  // IMPORTANT: do not run code between client creation and getClaims —
  // per Supabase docs, that risks random logouts.
  const { data } = await supabase.auth.getClaims();
  const claims = data?.claims;

  const redirectTo = (pathname: string) => {
    const url = request.nextUrl.clone();
    url.pathname = pathname;
    const redirect = NextResponse.redirect(url);
    // Carry over any refreshed auth cookies so the session isn't lost.
    supabaseResponse.cookies
      .getAll()
      .forEach((cookie) => redirect.cookies.set(cookie));
    return redirect;
  };

  if (!claims && path.startsWith("/dashboard")) {
    return redirectTo("/login");
  }
  if (claims && path === "/login") {
    return redirectTo("/dashboard");
  }

  return supabaseResponse;
}
