"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { updateProfile } from "@/lib/actions";
import { SOCIAL_KEYS, SOCIAL_LABELS } from "@/lib/defaults";
import type { Profile } from "@/lib/types";
import ImageUpload from "./ImageUpload";
import { useToast } from "./Toast";

export default function SettingsForm({ profile }: { profile: Profile }) {
  const router = useRouter();
  const toast = useToast();
  const [pending, startTransition] = useTransition();

  const [fullName, setFullName] = useState(profile.full_name);
  const [headline, setHeadline] = useState(profile.headline);
  const [tagline, setTagline] = useState(profile.tagline);
  const [bio, setBio] = useState(profile.bio);
  const [email, setEmail] = useState(profile.display_email);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(
    profile.avatar_url
  );
  const [socials, setSocials] = useState<Record<string, string>>(
    () => ({ ...profile.social_links })
  );
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);

    startTransition(async () => {
      const result = await updateProfile(
        {
          full_name: fullName,
          headline,
          tagline,
          bio,
          display_email: email,
          avatar_url: avatarUrl,
          social_links: socials,
        },
        profile.avatar_url
      );
      if (result.error) {
        setError(result.error);
        toast(result.error, "error");
        return;
      }
      toast("Profile saved — your public site is updated.");
      router.refresh();
    });
  }

  const inputClass =
    "w-full rounded-xl border border-edge bg-base px-4 py-2.5 text-sm text-ink placeholder:text-faint focus:border-accent/60 focus:outline-none";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <ImageUpload
        label="Profile picture (animated GIFs welcome ✨)"
        bucket="avatars"
        kind="avatar"
        value={avatarUrl}
        onChange={setAvatarUrl}
      />

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="mb-1.5 block text-sm text-muted">
            Display name <span className="text-danger">*</span>
          </label>
          <input
            id="name"
            value={fullName}
            onChange={(event) => setFullName(event.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <label
            htmlFor="headline"
            className="mb-1.5 block text-sm text-muted"
          >
            Headline <span className="text-faint">(e.g. Creator)</span>
          </label>
          <input
            id="headline"
            value={headline}
            onChange={(event) => setHeadline(event.target.value)}
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label htmlFor="tagline" className="mb-1.5 block text-sm text-muted">
          Tagline <span className="text-faint">(the big line under your name)</span>
        </label>
        <input
          id="tagline"
          value={tagline}
          onChange={(event) => setTagline(event.target.value)}
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="bio" className="mb-1.5 block text-sm text-muted">
          About / bio
        </label>
        <textarea
          id="bio"
          value={bio}
          rows={5}
          onChange={(event) => setBio(event.target.value)}
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="email" className="mb-1.5 block text-sm text-muted">
          Public email <span className="text-faint">(shown in Contact)</span>
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className={inputClass}
        />
      </div>

      <div className="glass space-y-4 rounded-2xl p-5">
        <p className="text-sm font-medium text-ink">Social links</p>
        <p className="text-xs text-faint">
          Leave any of these empty and its icon simply won't appear.
        </p>
        {SOCIAL_KEYS.map((key) => (
          <div key={key}>
            <label
              htmlFor={`social-${key}`}
              className="mb-1.5 block text-sm text-muted"
            >
              {SOCIAL_LABELS[key]}
            </label>
            <input
              id={`social-${key}`}
              value={socials[key] ?? ""}
              onChange={(event) =>
                setSocials({ ...socials, [key]: event.target.value })
              }
              className={inputClass}
              placeholder={`${key}.com/your-profile`}
            />
          </div>
        ))}
      </div>

      {error && (
        <p className="rounded-xl bg-danger/10 px-4 py-3 text-sm text-danger">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="rounded-full bg-accent px-7 py-2.5 text-sm font-semibold text-[#14100a] transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        {pending ? "Saving…" : "Save profile"}
      </button>
    </form>
  );
}
