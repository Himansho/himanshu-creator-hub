import type { Profile } from "@/lib/types";
import Avatar from "./Avatar";
import Reveal from "./Reveal";

export default function About({
  profile,
  skills,
}: {
  profile: Profile;
  skills: string[];
}) {
  return (
    <section id="about" className="scroll-mt-24 border-t border-edge">
      <div className="mx-auto grid max-w-6xl gap-12 px-5 py-24 md:grid-cols-[auto_1fr] md:gap-16">
        <Reveal className="mx-auto md:mx-0">
          <Avatar profile={profile} size="sm" />
        </Reveal>
        <div>
          <Reveal>
            <p className="text-sm font-medium uppercase tracking-widest text-accent">
              About
            </p>
            <h2 className="mt-2 text-3xl font-bold text-ink md:text-4xl">
              A little about me
            </h2>
            <p className="mt-5 max-w-2xl whitespace-pre-line leading-relaxed text-muted">
              {profile.bio}
            </p>
          </Reveal>
          {skills.length > 0 && (
            <Reveal delay={120}>
              <ul className="mt-8 flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <li
                    key={skill}
                    className="rounded-full border border-edge bg-surface px-3.5 py-1.5 text-sm text-muted"
                  >
                    {skill}
                  </li>
                ))}
              </ul>
            </Reveal>
          )}
        </div>
      </div>
    </section>
  );
}
