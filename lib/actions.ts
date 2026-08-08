"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { hasSupabaseEnv } from "./supabase/env";
import { createClient } from "./supabase/server";
import type {
  ActionResult,
  ProfileInput,
  ProjectInput,
  ProjectStatus,
} from "./types";
import { slugify, storageObjectFromUrl } from "./utils";
import {
  clampProgress,
  cleanTags,
  normalizeUrl,
  projectInputError,
} from "./validation";

const SESSION_EXPIRED =
  "Your session has expired. Please log in again in a new tab — the content you typed is still on this screen and can be saved after that.";

const FRIENDLY_DB_ERROR =
  "Something went wrong while saving. Please try again — if it keeps happening, tell Claude what you were doing and we'll fix it.";

type SupabaseServerClient = Awaited<ReturnType<typeof createClient>>;

/** Every action re-verifies auth next to the data (PRD §12) — never trust middleware alone. */
async function getAuthed(): Promise<{
  supabase: SupabaseServerClient;
  userId: string;
} | null> {
  if (!hasSupabaseEnv()) return null;
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const sub = data?.claims?.sub;
  if (!sub) return null;
  return { supabase, userId: sub as string };
}

/** Publish/unpublish/save must show on the public site within seconds (PRD §12). */
function refreshPublicPages() {
  revalidatePath("/");
  revalidatePath("/work");
}

/** Best-effort delete of a replaced image so storage never collects orphans (F-19). */
async function removeStoredObject(
  supabase: SupabaseServerClient,
  url: string | null | undefined
) {
  if (!url) return;
  const object = storageObjectFromUrl(url);
  if (!object) return;
  try {
    await supabase.storage.from(object.bucket).remove([object.path]);
  } catch {
    // Cleanup only — never block a save on it.
  }
}

function sanitizeProject(input: ProjectInput) {
  return {
    title: input.title.trim(),
    summary: input.summary.trim() || null,
    description: input.description.trim() || null,
    tech_stack: cleanTags(input.tech_stack),
    status: input.status,
    cover_image_url: input.cover_image_url || null,
    video_url: normalizeUrl(input.video_url) || null,
    demo_url: normalizeUrl(input.demo_url) || null,
    repo_url: normalizeUrl(input.repo_url) || null,
    private_notes: input.private_notes.trim() || null,
    progress: clampProgress(input.progress),
    featured: input.featured,
  };
}

export async function createProject(
  input: ProjectInput
): Promise<ActionResult> {
  const authed = await getAuthed();
  if (!authed) return { error: SESSION_EXPIRED };

  const normalized = {
    ...input,
    demo_url: normalizeUrl(input.demo_url),
    repo_url: normalizeUrl(input.repo_url),
  };
  const validationError = projectInputError(normalized);
  if (validationError) return { error: validationError };

  const { supabase } = authed;

  // Collision-proof slug: "test" → "test-2" → "test-3"… (PRD §9)
  const base = slugify(normalized.title);
  const { data: existing } = await supabase
    .from("projects")
    .select("slug")
    .like("slug", `${base}%`);
  const taken = new Set((existing ?? []).map((row) => row.slug as string));
  let slug = base;
  let suffix = 2;
  while (taken.has(slug)) slug = `${base}-${suffix++}`;

  const { data, error } = await supabase
    .from("projects")
    .insert({ ...sanitizeProject(normalized), slug })
    .select("id")
    .single();

  if (error || !data) return { error: FRIENDLY_DB_ERROR };
  refreshPublicPages();
  return { id: data.id as string };
}

export async function updateProject(
  id: string,
  input: ProjectInput,
  previousCoverUrl: string | null
): Promise<ActionResult> {
  const authed = await getAuthed();
  if (!authed) return { error: SESSION_EXPIRED };

  const normalized = {
    ...input,
    demo_url: normalizeUrl(input.demo_url),
    repo_url: normalizeUrl(input.repo_url),
  };
  const validationError = projectInputError(normalized);
  if (validationError) return { error: validationError };

  const { supabase } = authed;
  const { error } = await supabase
    .from("projects")
    .update(sanitizeProject(normalized)) // slug intentionally untouched — frozen after creation (PRD §9)
    .eq("id", id);

  if (error) return { error: FRIENDLY_DB_ERROR };

  if (previousCoverUrl && previousCoverUrl !== input.cover_image_url) {
    await removeStoredObject(supabase, previousCoverUrl);
  }

  refreshPublicPages();
  return { id };
}

export async function setProjectStatus(
  id: string,
  status: ProjectStatus
): Promise<ActionResult> {
  const authed = await getAuthed();
  if (!authed) return { error: SESSION_EXPIRED };

  const { error } = await authed.supabase
    .from("projects")
    .update({ status }) // published_at is handled by a database trigger
    .eq("id", id);

  if (error) return { error: FRIENDLY_DB_ERROR };
  refreshPublicPages();
  return { id };
}

export async function deleteProject(id: string): Promise<ActionResult> {
  const authed = await getAuthed();
  if (!authed) return { error: SESSION_EXPIRED };
  const { supabase } = authed;

  const { data: project } = await supabase
    .from("projects")
    .select("cover_image_url")
    .eq("id", id)
    .maybeSingle();

  const { error } = await supabase.from("projects").delete().eq("id", id);
  if (error) return { error: FRIENDLY_DB_ERROR };

  await removeStoredObject(supabase, project?.cover_image_url);
  refreshPublicPages();
  return { id };
}

export async function updateProfile(
  input: ProfileInput,
  previousAvatarUrl: string | null
): Promise<ActionResult> {
  const authed = await getAuthed();
  if (!authed) return { error: SESSION_EXPIRED };

  if (!input.full_name.trim()) {
    return { error: "Please keep a display name — it appears on your public site." };
  }

  const socialLinks: Record<string, string> = {};
  for (const [key, value] of Object.entries(input.social_links)) {
    const normalized = normalizeUrl(value);
    if (normalized) socialLinks[key] = normalized;
  }

  const { supabase, userId } = authed;
  // Upsert self-heals if the profile row is ever missing (PRD §9 tolerance).
  const { error } = await supabase.from("profiles").upsert({
    id: userId,
    full_name: input.full_name.trim(),
    headline: input.headline.trim() || null,
    tagline: input.tagline.trim() || null,
    bio: input.bio.trim() || null,
    display_email: input.display_email.trim() || null,
    avatar_url: input.avatar_url || null,
    social_links: socialLinks,
  });

  if (error) return { error: FRIENDLY_DB_ERROR };

  if (previousAvatarUrl && previousAvatarUrl !== input.avatar_url) {
    await removeStoredObject(supabase, previousAvatarUrl);
  }

  refreshPublicPages();
  return {};
}

export async function signOutAction() {
  if (hasSupabaseEnv()) {
    const supabase = await createClient();
    await supabase.auth.signOut();
  }
  redirect("/login");
}
