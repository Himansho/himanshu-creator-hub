import Magnet from "./Magnet";
import Avatar from "./Avatar";
import type { Profile } from "@/lib/types";

/**
 * Jack-style hero: nav, massive gradient headline, bottom bar with
 * tagline + gradient contact pill, magnetic avatar rising from the bottom.
 */
export default function Hero({ profile }: { profile: Profile }) {
  const firstName = profile.full_name.split(/\s+/)[0] ?? profile.full_name;

  return (
    <section className="relative flex h-screen flex-col overflow-x-clip">
      {/* Headline */}
      <div className="overflow-hidden">
        <h1
          className="hero-heading -mt-1 w-full whitespace-nowrap text-center font-black uppercase leading-none tracking-tight animate-fade-up"
          style={{
            fontSize: "clamp(3.5rem, 16vw, 17.5vw)",
            animationDelay: "150ms",
          }}
        >
          Hi, i&apos;m {firstName}
        </h1>
      </div>

      {/* Magnetic avatar */}
      <div className="pointer-events-auto absolute left-1/2 top-1/2 z-10 w-[280px] -translate-x-1/2 -translate-y-1/2 sm:top-auto sm:bottom-0 sm:w-[360px] sm:translate-y-0 md:w-[440px] lg:w-[520px]">
        <div className="animate-fade-up" style={{ animationDelay: "600ms" }}>
          <Magnet padding={150} strength={3}>
            <div className="flex justify-center">
              <Avatar profile={profile} size="lg" />
            </div>
          </Magnet>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="mt-auto flex items-end justify-between px-6 pb-7 sm:pb-8 md:px-10 md:pb-10">
        <p
          className="max-w-[160px] font-light uppercase leading-snug tracking-wide text-[#D7E2EA] animate-fade-up sm:max-w-[220px] md:max-w-[260px]"
          style={{
            fontSize: "clamp(0.75rem, 1.4vw, 1.5rem)",
            animationDelay: "350ms",
          }}
        >
          {profile.tagline}
        </p>
        <div className="animate-fade-up" style={{ animationDelay: "500ms" }}>
          <a
            href={`mailto:${profile.display_email}`}
            className="contact-btn inline-block rounded-full px-8 py-3 text-xs font-medium uppercase tracking-widest text-white sm:px-10 sm:py-3.5 sm:text-sm md:px-12 md:py-4 md:text-base"
          >
            Contact Me
          </a>
        </div>
      </div>
    </section>
  );
}
