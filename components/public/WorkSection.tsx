import Link from "next/link";
import type { PublicProject } from "@/lib/types";
import ProjectCard from "./ProjectCard";
import Reveal from "./Reveal";

export default function WorkSection({
  projects,
  showAllLink = false,
  heading = "Selected Work",
  subheading = "Things I've built and shipped.",
}: {
  projects: PublicProject[];
  showAllLink?: boolean;
  heading?: string;
  subheading?: string;
}) {
  return (
    <section id="work" className="mx-auto max-w-6xl scroll-mt-24 px-5 py-24">
      <Reveal>
        <p className="text-sm font-medium uppercase tracking-widest text-accent">
          Work
        </p>
        <h2 className="mt-2 text-3xl font-bold text-ink md:text-4xl">
          {heading}
        </h2>
        <p className="mt-3 max-w-xl text-muted">{subheading}</p>
      </Reveal>

      {projects.length === 0 ? (
        // Designed empty state (PRD F-3) — never an empty hole
        <Reveal delay={100}>
          <div className="glass mt-10 flex flex-col items-center gap-3 rounded-2xl px-8 py-16 text-center">
            <span className="text-3xl" aria-hidden="true">
              ✨
            </span>
            <h3 className="text-xl font-semibold text-ink">
              New projects coming soon
            </h3>
            <p className="max-w-md text-sm text-muted">
              I'm building right now. The first projects will land here
              shortly — check back soon.
            </p>
          </div>
        </Reveal>
      ) : (
        <>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project, index) => (
              <Reveal key={project.id} delay={(index % 3) * 90}>
                <ProjectCard project={project} />
              </Reveal>
            ))}
          </div>
          {showAllLink && (
            <Reveal delay={150}>
              <div className="mt-10 text-center">
                <Link
                  href="/work"
                  className="inline-block rounded-full border border-edge px-6 py-2.5 text-sm font-medium text-muted transition-colors hover:border-accent/50 hover:text-ink"
                >
                  View all projects →
                </Link>
              </div>
            </Reveal>
          )}
        </>
      )}
    </section>
  );
}
