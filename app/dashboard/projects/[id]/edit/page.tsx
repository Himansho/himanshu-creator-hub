import { notFound } from "next/navigation";
import ProjectForm from "@/components/dashboard/ProjectForm";
import { createClient } from "@/lib/supabase/server";
import type { Project } from "@/lib/types";

export const metadata = { title: "Edit Project" };

export default async function EditProjectPage({
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

  return (
    <>
      <h1 className="text-2xl font-bold text-ink">Edit project</h1>
      <p className="mt-1 text-sm text-muted">{project.title}</p>
      <div className="mt-8 max-w-2xl">
        <ProjectForm initial={project} />
      </div>
    </>
  );
}
