import { SOCIAL_KEYS, SOCIAL_LABELS } from "@/lib/defaults";
import type { Profile } from "@/lib/types";
import Reveal from "./Reveal";
import { SocialIcon } from "./SocialIcons";

/** Jack-style contact: giant gradient heading + gradient pill. */
export default function Contact({ profile }: { profile: Profile }) {
  const socials = SOCIAL_KEYS.filter((key) => profile.social_links[key]);

  return (
    <section id="contact" className="scroll-mt-24">
      <div className="mx-auto max-w-6xl px-5 py-24 text-center md:py-32">
        <Reveal>
          <h2
            className="hero-heading font-black uppercase leading-none tracking-tight"
            style={{ fontSize: "clamp(3rem, 12vw, 160px)" }}
          >
            Contact
          </h2>
          <p className="mx-auto mt-6 max-w-md font-light uppercase tracking-wide text-[#D7E2EA]/70">
            Have an idea, a role, or just want to say hi? My inbox is open.
          </p>
        </Reveal>
        <Reveal delay={120}>
          <a
            href={`mailto:${profile.display_email}`}
            className="contact-btn mt-10 inline-block rounded-full px-8 py-3 text-xs font-medium uppercase tracking-widest text-white sm:px-10 sm:py-3.5 sm:text-sm md:px-12 md:py-4 md:text-base"
          >
            Contact Me
          </a>
        </Reveal>
        {socials.length > 0 && (
          <Reveal delay={200}>
            <ul className="mt-10 flex justify-center gap-3">
              {socials.map((key) => (
                <li key={key}>
                  <a
                    href={profile.social_links[key]}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={SOCIAL_LABELS[key]}
                    title={SOCIAL_LABELS[key]}
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-[#D7E2EA]/25 text-[#D7E2EA]/70 transition-colors hover:border-[#D7E2EA]/60 hover:text-[#D7E2EA]"
                  >
                    <SocialIcon name={key} />
                  </a>
                </li>
              ))}
            </ul>
          </Reveal>
        )}
      </div>
    </section>
  );
}
