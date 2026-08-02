import About from "@/components/public/About";
import Contact from "@/components/public/Contact";
import Footer from "@/components/public/Footer";
import Hero from "@/components/public/Hero";
import Nav from "@/components/public/Nav";
import WorkSection from "@/components/public/WorkSection";
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

  return (
    <>
      <Nav />
      <main>
        <Hero profile={profile} />
        <WorkSection
          projects={projects.slice(0, 6)}
          showAllLink={projects.length > 0}
        />
        <About profile={profile} skills={skillsFromProjects(projects)} />
        <Contact profile={profile} />
      </main>
      <Footer name={profile.full_name} />
    </>
  );
}
