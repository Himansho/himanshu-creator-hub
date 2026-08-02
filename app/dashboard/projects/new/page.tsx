import ProjectForm from "@/components/dashboard/ProjectForm";

export const metadata = { title: "New Project" };

export default function NewProjectPage() {
  return (
    <>
      <h1 className="text-2xl font-bold text-ink">New project</h1>
      <p className="mt-1 text-sm text-muted">
        It's saved as a private draft unless you choose Published.
      </p>
      <div className="mt-8 max-w-2xl">
        <ProjectForm />
      </div>
    </>
  );
}
