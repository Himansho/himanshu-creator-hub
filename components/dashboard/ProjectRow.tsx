"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { deleteProject, setProjectStatus } from "@/lib/actions";
import type { Project } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import StatusBadge from "./StatusBadge";
import { useToast } from "./Toast";

export default function ProjectRow({ project }: { project: Project }) {
  const router = useRouter();
  const toast = useToast();
  const [pending, startTransition] = useTransition();
  const [confirming, setConfirming] = useState(false);

  const isPublished = project.status === "published";

  function togglePublish() {
    startTransition(async () => {
      const result = await setProjectStatus(
        project.id,
        isPublished ? "draft" : "published"
      );
      if (result.error) {
        toast(result.error, "error");
      } else {
        toast(
          isPublished
            ? `"${project.title}" is now hidden from your public site.`
            : `"${project.title}" is live on your public site! 🎉`
        );
        router.refresh();
      }
    });
  }

  function confirmDelete() {
    startTransition(async () => {
      const result = await deleteProject(project.id);
      if (result.error) {
        toast(result.error, "error");
      } else {
        toast(`"${project.title}" was deleted.`);
        router.refresh();
      }
      setConfirming(false);
    });
  }

  return (
    <div className="glass rounded-2xl p-5">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2.5">
            {project.featured && (
              <span className="text-accent" title="Featured" aria-label="Featured">
                ★
              </span>
            )}
            <h3 className="truncate text-base font-semibold text-ink">
              {project.title}
            </h3>
            <StatusBadge status={project.status} />
          </div>
          <p className="mt-1.5 text-xs text-faint">
            Updated {formatDate(project.updated_at)}
            {!isPublished && ` · ${project.progress}% done`}
          </p>
          {!isPublished && (
            <div
              className="mt-2 h-1 w-44 overflow-hidden rounded-full bg-white/10"
              role="progressbar"
              aria-valuenow={project.progress}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              <div
                className="h-full rounded-full bg-accent/70"
                style={{ width: `${project.progress}%` }}
              />
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {confirming ? (
            <>
              <span className="text-sm text-danger">Delete this project?</span>
              <button
                type="button"
                onClick={confirmDelete}
                disabled={pending}
                className="rounded-full bg-danger/15 px-4 py-1.5 text-sm font-medium text-danger transition-opacity hover:opacity-80 disabled:opacity-50"
              >
                {pending ? "Deleting…" : "Yes, delete"}
              </button>
              <button
                type="button"
                onClick={() => setConfirming(false)}
                disabled={pending}
                className="rounded-full px-4 py-1.5 text-sm text-muted hover:bg-white/5"
              >
                Cancel
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={togglePublish}
                disabled={pending}
                className={`rounded-full px-4 py-1.5 text-sm font-semibold transition-opacity hover:opacity-90 disabled:opacity-50 ${
                  isPublished
                    ? "border border-edge text-muted"
                    : "bg-accent text-[#14100a]"
                }`}
              >
                {pending
                  ? "Working…"
                  : isPublished
                    ? "Unpublish"
                    : "Publish"}
              </button>
              <Link
                href={`/dashboard/projects/${project.id}/edit`}
                className="rounded-full border border-edge px-4 py-1.5 text-sm text-muted transition-colors hover:text-ink"
              >
                Edit
              </Link>
              <Link
                href={`/dashboard/projects/${project.id}/preview`}
                className="rounded-full border border-edge px-4 py-1.5 text-sm text-muted transition-colors hover:text-ink"
              >
                Preview
              </Link>
              <button
                type="button"
                onClick={() => setConfirming(true)}
                className="rounded-full px-3 py-1.5 text-sm text-faint transition-colors hover:text-danger"
                aria-label={`Delete ${project.title}`}
              >
                Delete
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
