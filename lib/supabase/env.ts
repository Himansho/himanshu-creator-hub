/**
 * Supabase connection values. NEXT_PUBLIC_* vars are inlined at build time.
 * The publishable key is public-safe because Row Level Security is enforced
 * (PRD §10 S-4). The legacy ANON_KEY name is accepted as a fallback.
 */
export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
export const SUPABASE_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/**
 * The app must render (with default content) even before Supabase is
 * configured — the PRD's deploy-early milestone M2 depends on this.
 */
export function hasSupabaseEnv(): boolean {
  return Boolean(SUPABASE_URL && SUPABASE_KEY);
}
