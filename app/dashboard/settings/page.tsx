import SettingsForm from "@/components/dashboard/SettingsForm";
import { DEFAULT_PROFILE } from "@/lib/defaults";
import { createClient } from "@/lib/supabase/server";
import type { Profile } from "@/lib/types";

export const metadata = { title: "Settings" };

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("profiles")
    .select("*")
    .limit(1)
    .maybeSingle();

  // Tolerate a missing row (PRD §9) — saving will self-heal via upsert.
  const profile: Profile = {
    full_name: data?.full_name ?? DEFAULT_PROFILE.full_name,
    headline: data?.headline ?? DEFAULT_PROFILE.headline,
    tagline: data?.tagline ?? DEFAULT_PROFILE.tagline,
    bio: data?.bio ?? DEFAULT_PROFILE.bio,
    display_email: data?.display_email ?? DEFAULT_PROFILE.display_email,
    avatar_url: data?.avatar_url ?? null,
    social_links:
      (data?.social_links as Record<string, string> | null) ?? {},
  };

  return (
    <>
      <h1 className="text-2xl font-bold text-ink">Settings</h1>
      <p className="mt-1 text-sm text-muted">
        Your public profile — changes show on the site the moment you save.
      </p>
      <div className="mt-8 max-w-2xl">
        <SettingsForm profile={profile} />
      </div>
    </>
  );
}
