import AnimatedText from "./AnimatedText";
import Reveal from "./Reveal";
import type { Profile } from "@/lib/types";

/** Jack-style About: giant gradient heading + scroll-revealed paragraph. */
export default function About({
  profile,
  skills,
}: {
  profile: Profile;
  skills: string[];
}) {
  return (
    <section
      id="about"
      className="flex min-h-screen scroll-mt-24 flex-col items-center justify-center gap-10 px-5 py-20 sm:gap-14 sm:px-8 md:gap-16 md:px-10"
    >
      <Reveal>
        <h2
          className="hero-heading text-center font-black uppercase leading-none tracking-tight"
          style={{ fontSize: "clamp(3rem, 12vw, 160px)" }}
        >
          About me
        </h2>
      </Reveal>

      <AnimatedText
        text={profile.bio}
        className="max-w-[560px] text-center text-[clamp(1rem,2vw,1.35rem)] font-medium leading-relaxed text-[#D7E2EA]"
      />

      {skills.length > 0 && (
        <Reveal delay={100}>
          <ul className="flex max-w-2xl flex-wrap justify-center gap-2">
            {skills.map((skill) => (
              <li
                key={skill}
                className="rounded-full border border-[#D7E2EA]/20 px-3.5 py-1.5 text-sm uppercase tracking-wider text-[#D7E2EA]/70"
              >
                {skill}
              </li>
            ))}
          </ul>
        </Reveal>
      )}

      <Reveal delay={150}>
        <a
          href={`mailto:${profile.display_email}`}
          className="contact-btn inline-block rounded-full px-8 py-3 text-xs font-medium uppercase tracking-widest text-white sm:px-10 sm:py-3.5 sm:text-sm md:px-12 md:py-4 md:text-base"
        >
          Contact Me
        </a>
      </Reveal>
    </section>
  );
}
