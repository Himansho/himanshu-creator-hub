import Link from "next/link";
import ProjectRow from "@/components/dashboard/ProjectRow";
import { createClient } from "@/lib/supabase/server";
import type { Project } from "@/lib/types";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("projects")
    .select("*")
    .order("updated_at", { ascending: false });
  const projects = (data ?? []) as Project[];

  const stats = [
    { label: "Total", value: projects.length },
    {
      label: "Drafts",
      value: projects.filter((p) => p.status === "draft").length,
    },
    {
      label: "In progress",
      value: projects.filter((p) => p.status === "in_progress").length,
    },
    {
      label: "Published",
      value: projects.filter((p) => p.status === "published").length,
    },
  ];

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-ink">Your workspace</h1>
          <p className="mt-1 text-sm text-muted">
            Everything you're making — drafts stay private until you publish.
          </p>
        </div>
        <Link
          href="/dashboard/projects/new"
          className="rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-[#14100a] transition-opacity hover:opacity-90"
        >
          + New project
        </Link>
      </div>

      {/* Stats (PRD F-17) */}
      <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="glass rounded-2xl px-5 py-4">
            <p className="text-3xl font-bold text-ink">{stat.value}</p>
            <p className="mt-1 text-xs uppercase tracking-wider text-faint">
              {stat.label}
            </p>
          </div>
        ))}
      </div>

      {/* Project list or empty state */}
      {projects.length === 0 ? (
        <div className="glass mt-10 flex flex-col items-center gap-4 rounded-2xl px-8 py-20 text-center">
          <span className="text-4xl" aria-hidden="true">
            🚀
          </span>
          <h2 className="text-xl font-semibold text-ink">
            Add your first project
          </h2>
          <p className="max-w-sm text-sm text-muted">
            It starts as a private draft — only you can see it. Publish it
            whenever it's ready for the world.
          </p>
          <Link
            href="/dashboard/projects/new"
            className="mt-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-[#14100a] transition-opacity hover:opacity-90"
          >
            + Add your first project
          </Link>
        </div>
      ) : (
        <div className="mt-10 space-y-3">
          {projects.map((project) => (
            <ProjectRow key={project.id} project={project} />
          ))}
        </div>
      )}
    </>
  );
}
