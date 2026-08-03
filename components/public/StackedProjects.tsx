"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import type { PublicProject } from "@/lib/types";

/**
 * Sticky-stacking project cards (Jack style): each card is sticky and
 * scales down slightly as the next one scrolls over it.
 */
export default function StackedProjects({
  projects,
}: {
  projects: PublicProject[];
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  return (
    <div ref={containerRef}>
      {projects.map((project, index) => {
        const targetScale = 1 - (projects.length - 1 - index) * 0.03;
        return (
          <Card
            key={project.id}
            project={project}
            index={index}
            progress={scrollYProgress}
            range={[index / projects.length, 1]}
            targetScale={targetScale}
          />
        );
      })}
    </div>
  );
}

function Card({
  project,
  index,
  progress,
  range,
  targetScale,
}: {
  project: PublicProject;
  index: number;
  progress: ReturnType<typeof useScroll>["scrollYProgress"];
  range: [number, number];
  targetScale: number;
}) {
  const scale = useTransform(progress, range, [1, targetScale]);
  const number = String(index + 1).padStart(2, "0");

  return (
    <div className="flex h-[85vh] items-start justify-center">
      <motion.article
        style={{ scale, top: `calc(6rem + ${index * 28}px)` }}
        className="sticky w-full rounded-[40px] border-2 border-[#D7E2EA] bg-[#0C0C0C] p-4 sm:rounded-[50px] sm:p-6 md:rounded-[60px] md:p-8"
      >
        {/* Top row */}
        <div className="mb-4 flex flex-wrap items-center justify-between gap-4 sm:mb-6">
          <div className="flex items-center gap-4 sm:gap-6">
            <span
              className="hero-heading font-black leading-none"
              style={{ fontSize: "clamp(3rem, 10vw, 140px)" }}
            >
              {number}
            </span>
            <div>
              <p className="text-xs font-light uppercase tracking-widest text-[#D7E2EA]/60 sm:text-sm">
                {project.featured ? "Featured" : "Project"}
              </p>
              <h3
                className="font-medium uppercase text-[#D7E2EA]"
                style={{ fontSize: "clamp(1.1rem, 2.4vw, 2.1rem)" }}
              >
                {project.title}
              </h3>
            </div>
          </div>
          {project.demo_url && (
            <a
              href={project.demo_url}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border-2 border-[#D7E2EA] px-8 py-3 text-sm font-medium uppercase tracking-widest text-[#D7E2EA] transition-colors hover:bg-[#D7E2EA]/10 sm:px-10 sm:py-3.5 sm:text-base"
            >
              Live Project
            </a>
          )}
        </div>

        {/* Image + summary */}
        <div className="grid gap-3 md:grid-cols-[40%_1fr]">
          <div
            className="flex flex-col justify-between gap-3 rounded-[32px] bg-white/[0.04] p-6 sm:rounded-[40px] sm:p-8 md:rounded-[48px]"
            style={{ minHeight: "clamp(160px, 22vw, 340px)" }}
          >
            {project.summary && (
              <p
                className="font-light leading-relaxed text-[#D7E2EA]/80"
                style={{ fontSize: "clamp(0.9rem, 1.6vw, 1.25rem)" }}
              >
                {project.summary}
              </p>
            )}
            {project.tech_stack?.length > 0 && (
              <ul className="flex flex-wrap gap-2">
                {project.tech_stack.slice(0, 6).map((tag) => (
                  <li
                    key={tag}
                    className="rounded-full border border-[#D7E2EA]/25 px-3 py-1 text-xs uppercase tracking-wider text-[#D7E2EA]/70"
                  >
                    {tag}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div
            className="overflow-hidden rounded-[32px] sm:rounded-[40px] md:rounded-[48px]"
            style={{ height: "clamp(220px, 30vw, 420px)" }}
          >
            {project.cover_image_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={project.cover_image_url}
                alt={`${project.title} cover`}
                className="h-full w-full object-cover"
                loading="lazy"
              />
            ) : (
              <div
                className="flex h-full w-full items-center justify-center"
                style={{
                  background:
                    "radial-gradient(circle at 30% 30%, rgba(182,0,168,0.35), transparent 60%), radial-gradient(circle at 75% 75%, rgba(118,33,176,0.3), transparent 55%), #131313",
                }}
              >
                <span className="hero-heading text-7xl font-black">
                  {project.title.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
          </div>
        </div>
      </motion.article>
    </div>
  );
}
