import { createClient } from "@supabase/supabase-js";
import { DEFAULT_PROFILE, DEFAULT_SKILLS } from "./defaults";
import { hasSupabaseEnv, SUPABASE_KEY, SUPABASE_URL } from "./supabase/env";
import type { Profile, PublicProject } from "./types";

/**
 * Cookie-free anonymous client for the PUBLIC pages. Using this (instead of
 * the cookie-based server client) keeps the public pages statically cacheable
 * with `revalidate`, which is what makes F-9's stale-if-down behavior and the
 * publish→revalidatePath contract work (PRD §12).
 *
 * It can only ever see the public_profile / public_projects views — RLS
 * blocks everything else (PRD §10 S-1).
 */
function anonClient() {
  if (!hasSupabaseEnv()) return null;
  return createClient(SUPABASE_URL!, SUPABASE_KEY!, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export async function getPublicProfile(): Promise<Profile> {
  const supabase = anonClient();
  if (!supabase) return DEFAULT_PROFILE;
  try {
    const { data, error } = await supabase
      .from("public_profile")
      .select("*")
      .limit(1)
      .maybeSingle();
    if (error || !data) return DEFAULT_PROFILE;
    return {
      full_name: data.full_name ?? DEFAULT_PROFILE.full_name,
      headline: data.headline ?? DEFAULT_PROFILE.headline,
      tagline: data.tagline ?? DEFAULT_PROFILE.tagline,
      bio: data.bio ?? DEFAULT_PROFILE.bio,
      display_email: data.display_email ?? DEFAULT_PROFILE.display_email,
      avatar_url: data.avatar_url ?? null,
      social_links:
        (data.social_links as Record<string, string> | null) ?? {},
    };
  } catch {
    // Database unreachable (e.g. paused project) — render defaults, never crash (F-9).
    return DEFAULT_PROFILE;
  }
}

export async function getPublishedProjects(): Promise<PublicProject[]> {
  const supabase = anonClient();
  if (!supabase) return [];
  try {
    const { data, error } = await supabase
      .from("public_projects")
      .select("*")
      .order("featured", { ascending: false })
      .order("published_at", { ascending: false });
    if (error || !data) return [];
    return data as PublicProject[];
  } catch {
    return [];
  }
}

/** Skill tags for About: gathered from published work, with a default set before then. */
export function skillsFromProjects(projects: PublicProject[]): string[] {
  const tags = new Set<string>();
  for (const project of projects) {
    for (const tag of project.tech_stack ?? []) tags.add(tag);
  }
  return tags.size > 0 ? Array.from(tags).slice(0, 12) : DEFAULT_SKILLS;
}
