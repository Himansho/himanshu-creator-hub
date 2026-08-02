"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { createProject, updateProject } from "@/lib/actions";
import type { Project, ProjectInput, ProjectStatus } from "@/lib/types";
import { LIMITS, normalizeUrl, projectInputError } from "@/lib/validation";
import ImageUpload from "./ImageUpload";
import { useToast } from "./Toast";

const STATUS_OPTIONS: { value: ProjectStatus; label: string }[] = [
  { value: "draft", label: "🟡 Draft — only I can see it" },
  { value: "in_progress", label: "🔵 In Progress — still private" },
  { value: "published", label: "🟢 Published — visible to everyone" },
];

export default function ProjectForm({ initial }: { initial?: Project }) {
  const router = useRouter();
  const toast = useToast();
  const [pending, startTransition] = useTransition();

  const [title, setTitle] = useState(initial?.title ?? "");
  const [summary, setSummary] = useState(initial?.summary ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [tags, setTags] = useState<string[]>(initial?.tech_stack ?? []);
  const [tagDraft, setTagDraft] = useState("");
  const [status, setStatus] = useState<ProjectStatus>(
    initial?.status ?? "draft"
  );
  const [coverUrl, setCoverUrl] = useState<string | null>(
    initial?.cover_image_url ?? null
  );
  const [demoUrl, setDemoUrl] = useState(initial?.demo_url ?? "");
  const [repoUrl, setRepoUrl] = useState(initial?.repo_url ?? "");
  const [notes, setNotes] = useState(initial?.private_notes ?? "");
  const [progress, setProgress] = useState(initial?.progress ?? 0);
  const [featured, setFeatured] = useState(initial?.featured ?? false);
  const [error, setError] = useState<string | null>(null);

  function addTag() {
    const value = tagDraft.trim().replace(/,+$/, "").slice(0, LIMITS.tagMax);
    if (value && !tags.some((t) => t.toLowerCase() === value.toLowerCase())) {
      setTags([...tags, value]);
    }
    setTagDraft("");
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);

    const input: ProjectInput = {
      title,
      summary,
      description,
      tech_stack: tags,
      status,
      cover_image_url: coverUrl,
      demo_url: normalizeUrl(demoUrl),
      repo_url: normalizeUrl(repoUrl),
      private_notes: notes,
      progress,
      featured,
    };

    const validationError = projectInputError(input);
    if (validationError) {
      setError(validationError);
      return;
    }

    startTransition(async () => {
      const result = initial
        ? await updateProject(initial.id, input, initial.cover_image_url)
        : await createProject(input);

      if (result.error) {
        setError(result.error);
        toast(result.error, "error");
        return;
      }
      toast(
        initial
          ? "Saved! Your changes are in."
          : status === "published"
            ? "Project created and published! 🎉"
            : "Project saved as a private draft."
      );
      router.push("/dashboard");
      router.refresh();
    });
  }

  const publishNotes: string[] = [];
  if (status === "published") {
    if (!coverUrl) publishNotes.push("a cover image");
    if (!summary.trim()) publishNotes.push("a short summary");
  }

  const inputClass =
    "w-full rounded-xl border border-edge bg-base px-4 py-2.5 text-sm text-ink placeholder:text-faint focus:border-accent/60 focus:outline-none";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Title */}
      <div>
        <label htmlFor="title" className="mb-1.5 block text-sm text-muted">
          Title <span className="text-danger">*</span>
          <span className="float-right text-xs text-faint">
            {title.length}/{LIMITS.titleMax}
          </span>
        </label>
        <input
          id="title"
          value={title}
          maxLength={LIMITS.titleMax}
          onChange={(event) => setTitle(event.target.value)}
          className={inputClass}
          placeholder="My awesome app"
        />
      </div>

      {/* Summary */}
      <div>
        <label htmlFor="summary" className="mb-1.5 block text-sm text-muted">
          Short summary <span className="text-faint">(shown on the card)</span>
          <span className="float-right text-xs text-faint">
            {summary.length}/{LIMITS.summaryMax}
          </span>
        </label>
        <input
          id="summary"
          value={summary}
          maxLength={LIMITS.summaryMax}
          onChange={(event) => setSummary(event.target.value)}
          className={inputClass}
          placeholder="One or two sentences about what it does"
        />
      </div>

      {/* Description */}
      <div>
        <label
          htmlFor="description"
          className="mb-1.5 block text-sm text-muted"
        >
          Longer description <span className="text-faint">(optional)</span>
        </label>
        <textarea
          id="description"
          value={description}
          rows={5}
          onChange={(event) => setDescription(event.target.value)}
          className={inputClass}
          placeholder="The story, the features, what you learned…"
        />
      </div>

      {/* Cover image */}
      <ImageUpload
        label="Cover image (recommended ~1200×630)"
        bucket="project-images"
        kind="cover"
        value={coverUrl}
        onChange={setCoverUrl}
      />

      {/* Tech tags */}
      <div>
        <label htmlFor="tags" className="mb-1.5 block text-sm text-muted">
          Tech / tools used{" "}
          <span className="text-faint">(type one and press Enter)</span>
        </label>
        {tags.length > 0 && (
          <ul className="mb-2 flex flex-wrap gap-1.5">
            {tags.map((tag) => (
              <li
                key={tag}
                className="flex items-center gap-1.5 rounded-full border border-edge px-3 py-1 text-xs text-muted"
              >
                {tag}
                <button
                  type="button"
                  aria-label={`Remove ${tag}`}
                  onClick={() => setTags(tags.filter((t) => t !== tag))}
                  className="text-faint hover:text-danger"
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
        )}
        <input
          id="tags"
          value={tagDraft}
          maxLength={LIMITS.tagMax}
          onChange={(event) => setTagDraft(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === ",") {
              event.preventDefault();
              addTag();
            }
          }}
          onBlur={addTag}
          className={inputClass}
          placeholder="e.g. Next.js"
        />
      </div>

      {/* Links */}
      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="demo" className="mb-1.5 block text-sm text-muted">
            Live demo link <span className="text-faint">(optional)</span>
          </label>
          <input
            id="demo"
            value={demoUrl}
            onChange={(event) => setDemoUrl(event.target.value)}
            className={inputClass}
            placeholder="myapp.vercel.app"
          />
        </div>
        <div>
          <label htmlFor="repo" className="mb-1.5 block text-sm text-muted">
            Code link <span className="text-faint">(optional)</span>
          </label>
          <input
            id="repo"
            value={repoUrl}
            onChange={(event) => setRepoUrl(event.target.value)}
            className={inputClass}
            placeholder="github.com/you/project"
          />
        </div>
      </div>

      {/* Status + featured + progress */}
      <div className="glass space-y-5 rounded-2xl p-5">
        <div>
          <label htmlFor="status" className="mb-1.5 block text-sm text-muted">
            Status
          </label>
          <select
            id="status"
            value={status}
            onChange={(event) =>
              setStatus(event.target.value as ProjectStatus)
            }
            className={inputClass}
          >
            {STATUS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {publishNotes.length > 0 && (
            <p className="mt-2 text-xs text-accent">
              Heads up: this project has no {publishNotes.join(" or ")} yet.
              You can still publish — a styled placeholder will be shown.
            </p>
          )}
        </div>

        <label className="flex items-center gap-3 text-sm text-muted">
          <input
            type="checkbox"
            checked={featured}
            onChange={(event) => setFeatured(event.target.checked)}
            className="h-4 w-4 accent-[#f5b040]"
          />
          ★ Feature this project (shows first on your public site)
        </label>

        <div>
          <label
            htmlFor="progress"
            className="mb-1.5 block text-sm text-muted"
          >
            Progress (private): {progress}%
          </label>
          <input
            id="progress"
            type="range"
            min={0}
            max={100}
            step={5}
            value={progress}
            onChange={(event) => setProgress(Number(event.target.value))}
            className="w-full accent-[#f5b040]"
          />
        </div>
      </div>

      {/* Private notes */}
      <div>
        <label htmlFor="notes" className="mb-1.5 block text-sm text-muted">
          Private notes{" "}
          <span className="text-faint">(only you ever see these)</span>
        </label>
        <textarea
          id="notes"
          value={notes}
          rows={3}
          onChange={(event) => setNotes(event.target.value)}
          className={inputClass}
          placeholder="Ideas, to-dos, links, anything…"
        />
      </div>

      {error && (
        <p className="rounded-xl bg-danger/10 px-4 py-3 text-sm text-danger">
          {error}
        </p>
      )}

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={pending}
          className="rounded-full bg-accent px-7 py-2.5 text-sm font-semibold text-[#14100a] transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {pending
            ? "Saving…"
            : initial
              ? "Save changes"
              : "Create project"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/dashboard")}
          disabled={pending}
          className="rounded-full px-5 py-2.5 text-sm text-muted hover:bg-white/5"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
