import type { Profile } from "@/lib/types";
import Avatar from "./Avatar";

export default function Hero({ profile }: { profile: Profile }) {
  return (
    <section className="relative flex min-h-[92vh] items-center overflow-hidden">
      {/* Ambient background glows */}
      <div
        className="absolute -left-32 top-24 h-96 w-96 rounded-full bg-accent/10 blur-3xl animate-float-slow"
        aria-hidden="true"
      />
      <div
        className="absolute -right-24 bottom-16 h-80 w-80 rounded-full blur-3xl animate-float"
        style={{ background: "rgba(94,158,214,0.10)" }}
        aria-hidden="true"
      />

      <div className="mx-auto grid w-full max-w-6xl items-center gap-14 px-5 pt-28 pb-16 md:grid-cols-[1.2fr_auto]">
        <div>
          <p
            className="inline-flex items-center gap-2 rounded-full bg-accent-soft px-4 py-1.5 text-sm font-medium text-accent animate-fade-up"
            style={{ animationDelay: "0ms" }}
          >
            ✦ {profile.headline}
          </p>
          <h1
            className="mt-6 text-5xl font-bold leading-[1.05] tracking-tight text-ink md:text-7xl animate-fade-up"
            style={{ animationDelay: "120ms" }}
          >
            {profile.full_name}
          </h1>
          <p
            className="mt-6 max-w-lg text-lg leading-relaxed text-muted md:text-xl animate-fade-up"
            style={{ animationDelay: "240ms" }}
          >
            {profile.tagline}
          </p>
          <div
            className="mt-10 flex flex-wrap gap-4 animate-fade-up"
            style={{ animationDelay: "360ms" }}
          >
            <a
              href="#work"
              className="rounded-full bg-accent px-7 py-3 text-sm font-semibold text-[#14100a] transition-transform hover:scale-[1.03]"
            >
              See my work
            </a>
            <a
              href="#contact"
              className="rounded-full border border-edge px-7 py-3 text-sm font-medium text-muted transition-colors hover:border-accent/50 hover:text-ink"
            >
              Get in touch
            </a>
          </div>
        </div>

        <div
          className="mx-auto animate-fade-up"
          style={{ animationDelay: "300ms" }}
        >
          <Avatar profile={profile} size="lg" />
        </div>
      </div>
    </section>
  );
}
