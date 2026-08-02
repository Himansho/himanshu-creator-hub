import Link from "next/link";
import { notFound } from "next/navigation";
import ProjectCard from "@/components/public/ProjectCard";
import StatusBadge from "@/components/dashboard/StatusBadge";
import { createClient } from "@/lib/supabase/server";
import type { Project, PublicProject } from "@/lib/types";

export const metadata = { title: "Preview" };

export default async function PreviewProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase
    .from("projects")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (!data) notFound();
  const project = data as Project;

  // Exactly what a visitor would see (PRD F-22) — private fields stripped.
  const publicView: PublicProject = {
    id: project.id,
    title: project.title,
    slug: project.slug,
    summary: project.summary,
    description: project.description,
    tech_stack: project.tech_stack,
    cover_image_url: project.cover_image_url,
    demo_url: project.demo_url,
    repo_url: project.repo_url,
    featured: project.featured,
    published_at: project.published_at,
  };

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-ink">Preview</h1>
          <p className="mt-1 text-sm text-muted">
            This is exactly how the card looks to a visitor.
          </p>
        </div>
        <StatusBadge status={project.status} />
      </div>

      {project.status !== "published" && (
        <p className="mt-4 rounded-xl bg-accent-soft px-4 py-3 text-sm text-accent">
          This project is not published — visitors can't see it yet.
        </p>
      )}

      <div className="mt-8 max-w-sm">
        <ProjectCard project={publicView} />
      </div>

      <div className="mt-8 flex gap-3">
        <Link
          href={`/dashboard/projects/${project.id}/edit`}
          className="rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-[#14100a] transition-opacity hover:opacity-90"
        >
          Edit project
        </Link>
        <Link
          href="/dashboard"
          className="rounded-full border border-edge px-5 py-2.5 text-sm text-muted transition-colors hover:text-ink"
        >
          ← Back to dashboard
        </Link>
      </div>
    </>
  );
}
