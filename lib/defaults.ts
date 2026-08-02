import type { Profile } from "./types";

/**
 * Fallback content shown before Supabase is connected (deploy-early milestone)
 * or if the profile row is ever missing. Everything here is editable later
 * from Dashboard → Settings — this is just the day-one default.
 */
export const DEFAULT_PROFILE: Profile = {
  full_name: "Himanshu Bartwal",
  headline: "Creator",
  tagline: "I build things which solve real problems",
  bio: "I'm a creator who builds with modern tools and AI. This hub collects everything I make — apps, experiments, and ideas in progress. The polished work lives here on the public site; the messy middle stays in my private workspace until it's ready.",
  display_email: "Himanshubartwal2022@gmail.com",
  avatar_url: null,
  social_links: {},
};

/** Skills shown in About when no published project supplies tech tags yet. */
export const DEFAULT_SKILLS = [
  "AI-assisted building",
  "Web apps",
  "Product thinking",
  "No-code tools",
];

export const SOCIAL_KEYS = [
  "github",
  "linkedin",
  "twitter",
  "instagram",
  "youtube",
] as const;

export type SocialKey = (typeof SOCIAL_KEYS)[number];

export const SOCIAL_LABELS: Record<SocialKey, string> = {
  github: "GitHub",
  linkedin: "LinkedIn",
  twitter: "X (Twitter)",
  instagram: "Instagram",
  youtube: "YouTube",
};
