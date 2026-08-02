import Image from "next/image";
import type { PublicProject } from "@/lib/types";

const MAX_VISIBLE_TAGS = 4;

export default function ProjectCard({ project }: { project: PublicProject }) {
  const tags = project.tech_stack ?? [];
  const hiddenTagCount = tags.length - MAX_VISIBLE_TAGS;

  return (
    <article className="group glass flex h-full flex-col overflow-hidden rounded-2xl transition-transform duration-300 hover:-translate-y-1.5">
      {/* Cover */}
      <div className="relative aspect-[1200/630] overflow-hidden bg-elevate">
        {project.cover_image_url ? (
          <Image
            src={project.cover_image_url}
            alt={`${project.title} cover`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
            unoptimized={project.cover_image_url
              .toLowerCase()
              .includes(".gif")}
          />
        ) : (
          <div
            className="flex h-full w-full items-center justify-center"
            style={{
              background:
                "radial-gradient(circle at 30% 30%, rgba(245,176,64,0.22), transparent 60%), radial-gradient(circle at 75% 75%, rgba(94,158,214,0.16), transparent 55%)",
            }}
          >
            <span className="text-5xl font-bold text-white/15">
              {project.title.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
        {project.featured && (
          <span className="absolute left-3 top-3 rounded-full bg-accent-soft px-2.5 py-1 text-xs font-medium text-accent backdrop-blur">
            ★ Featured
          </span>
        )}
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col gap-3 p-5">
        <h3 className="text-lg font-semibold text-ink">{project.title}</h3>
        {project.summary && (
          <p className="text-sm leading-relaxed text-muted">
            {project.summary}
          </p>
        )}
        {tags.length > 0 && (
          <ul className="flex flex-wrap gap-1.5">
            {tags.slice(0, MAX_VISIBLE_TAGS).map((tag) => (
              <li
                key={tag}
                className="rounded-full border border-edge px-2.5 py-0.5 text-xs text-muted"
              >
                {tag}
              </li>
            ))}
            {hiddenTagCount > 0 && (
              <li className="rounded-full border border-edge px-2.5 py-0.5 text-xs text-faint">
                +{hiddenTagCount}
              </li>
            )}
          </ul>
        )}
        {(project.demo_url || project.repo_url) && (
          <div className="mt-auto flex gap-4 pt-2 text-sm font-medium">
            {project.demo_url && (
              <a
                href={project.demo_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent transition-opacity hover:opacity-80"
              >
                Live Demo ↗
              </a>
            )}
            {project.repo_url && (
              <a
                href={project.repo_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted transition-colors hover:text-ink"
              >
                View Code ↗
              </a>
            )}
          </div>
        )}
      </div>
    </article>
  );
}
