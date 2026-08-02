import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import {
  hasSupabaseEnv,
  SUPABASE_KEY,
  SUPABASE_URL,
} from "@/lib/supabase/env";

// Always hits the database — the keep-alive GitHub Action calls this so the
// Supabase free project never pauses from inactivity (PRD §17).
export const dynamic = "force-dynamic";

export async function GET() {
  if (!hasSupabaseEnv()) {
    return NextResponse.json({ ok: false, reason: "not-configured" });
  }
  try {
    const supabase = createClient(SUPABASE_URL!, SUPABASE_KEY!, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
    const { count, error } = await supabase
      .from("public_projects")
      .select("*", { count: "exact", head: true });
    if (error) {
      return NextResponse.json({ ok: false }, { status: 500 });
    }
    return NextResponse.json({ ok: true, published: count ?? 0 });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
