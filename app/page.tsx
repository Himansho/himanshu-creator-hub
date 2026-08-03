import About from "@/components/public/About";
import Contact from "@/components/public/Contact";
import Footer from "@/components/public/Footer";
import Hero from "@/components/public/Hero";
import Nav from "@/components/public/Nav";
import Reveal from "@/components/public/Reveal";
import ScrollMarquee from "@/components/public/ScrollMarquee";
import Services from "@/components/public/Services";
import StackedProjects from "@/components/public/StackedProjects";
import {
  getPublicProfile,
  getPublishedProjects,
  skillsFromProjects,
} from "@/lib/data";

// Hourly background refresh as a safety net; publish/save actions call
// revalidatePath for instant updates (PRD §12 caching contract).
export const revalidate = 3600;

export default async function HomePage() {
  const [profile, projects] = await Promise.all([
    getPublicProfile(),
    getPublishedProjects(),
  ]);

  const marqueeImages = projects
    .map((project) => project.cover_image_url)
    .filter((url): url is string => Boolean(url));

  return (
    <div className="overflow-x-clip bg-[#0C0C0C]">
      <Nav />
      <main>
        <Hero profile={profile} />

        {/* Marquee appears once there are project images to show */}
        <ScrollMarquee images={marqueeImages} />

        <About profile={profile} skills={skillsFromProjects(projects)} />

        <Services />

        {/* Projects — dark sheet pulled over the white services sheet */}
        <section className="relative z-10 -mt-10 rounded-t-[40px] bg-[#0C0C0C] px-4 pb-10 pt-20 sm:-mt-12 sm:rounded-t-[50px] sm:px-6 md:-mt-14 md:rounded-t-[60px] md:px-8 md:pt-28">
          <Reveal>
            <h2
              className="hero-heading mb-10 text-center font-black uppercase leading-none tracking-tight md:mb-16"
              style={{ fontSize: "clamp(3rem, 12vw, 160px)" }}
            >
              Projects
            </h2>
          </Reveal>

          {projects.length === 0 ? (
            <Reveal delay={100}>
              <div className="mx-auto max-w-xl rounded-[40px] border-2 border-[#D7E2EA]/40 px-8 py-16 text-center">
                <span className="text-3xl" aria-hidden="true">
                  ✨
                </span>
                <h3 className="mt-3 text-xl font-medium uppercase tracking-wide text-[#D7E2EA]">
                  New projects coming soon
                </h3>
                <p className="mt-2 text-sm font-light text-[#D7E2EA]/60">
                  I&apos;m building right now — the first projects will land
                  here shortly.
                </p>
              </div>
            </Reveal>
          ) : (
            <StackedProjects projects={projects.slice(0, 6)} />
          )}
        </section>

        <Contact profile={profile} />
      </main>
      <Footer name={profile.full_name} />
    </div>
  );
}
