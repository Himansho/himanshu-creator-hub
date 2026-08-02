export type ProjectStatus = "draft" | "in_progress" | "published";

export interface Profile {
  id?: string;
  full_name: string;
  headline: string;
  tagline: string;
  bio: string;
  display_email: string;
  avatar_url: string | null;
  social_links: Record<string, string>;
}

export interface Project {
  id: string;
  title: string;
  slug: string;
  summary: string | null;
  description: string | null;
  tech_stack: string[];
  status: ProjectStatus;
  cover_image_url: string | null;
  demo_url: string | null;
  repo_url: string | null;
  private_notes: string | null;
  progress: number;
  featured: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
  published_at: string | null;
}

/** Shape of the public_projects view — the only project data visitors ever see. */
export interface PublicProject {
  id: string;
  title: string;
  slug: string;
  summary: string | null;
  description: string | null;
  tech_stack: string[];
  cover_image_url: string | null;
  demo_url: string | null;
  repo_url: string | null;
  featured: boolean;
  published_at: string | null;
}

/** Editable fields sent from the project form to server actions. */
export interface ProjectInput {
  title: string;
  summary: string;
  description: string;
  tech_stack: string[];
  status: ProjectStatus;
  cover_image_url: string | null;
  demo_url: string;
  repo_url: string;
  private_notes: string;
  progress: number;
  featured: boolean;
}

/** Editable fields sent from the settings form to server actions. */
export interface ProfileInput {
  full_name: string;
  headline: string;
  tagline: string;
  bio: string;
  display_email: string;
  avatar_url: string | null;
  social_links: Record<string, string>;
}

export interface ActionResult {
  error?: string;
  id?: string;
}
