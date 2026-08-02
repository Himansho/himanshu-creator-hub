import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  // Only the routes that need sessions — static assets and the public
  // pages are skipped entirely (PRD §10 S-6).
  matcher: ["/dashboard/:path*", "/login", "/reset-password"],
};
