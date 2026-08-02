import { SOCIAL_KEYS, SOCIAL_LABELS } from "@/lib/defaults";
import type { Profile } from "@/lib/types";
import Reveal from "./Reveal";
import { SocialIcon } from "./SocialIcons";

export default function Contact({ profile }: { profile: Profile }) {
  const socials = SOCIAL_KEYS.filter((key) => profile.social_links[key]);

  return (
    <section id="contact" className="scroll-mt-24 border-t border-edge">
      <div className="mx-auto max-w-6xl px-5 py-24 text-center">
        <Reveal>
          <p className="text-sm font-medium uppercase tracking-widest text-accent">
            Contact
          </p>
          <h2 className="mt-2 text-3xl font-bold text-ink md:text-4xl">
            Let's build something
          </h2>
          <p className="mx-auto mt-4 max-w-md text-muted">
            Have an idea, a role, or just want to say hi? My inbox is open.
          </p>
        </Reveal>
        <Reveal delay={120}>
          <a
            href={`mailto:${profile.display_email}`}
            className="mt-9 inline-block rounded-full bg-accent px-8 py-3.5 text-sm font-semibold text-[#14100a] transition-transform hover:scale-[1.03]"
          >
            {profile.display_email}
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
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-edge text-muted transition-colors hover:border-accent/50 hover:text-accent"
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
