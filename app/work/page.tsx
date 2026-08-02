import type { Metadata } from "next";
import Footer from "@/components/public/Footer";
import Nav from "@/components/public/Nav";
import WorkSection from "@/components/public/WorkSection";
import { getPublicProfile, getPublishedProjects } from "@/lib/data";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Work",
  description: "All published projects — apps, tools, and experiments.",
};

export default async function WorkPage() {
  const [profile, projects] = await Promise.all([
    getPublicProfile(),
    getPublishedProjects(),
  ]);

  return (
    <>
      <Nav />
      <main className="pt-16">
        <WorkSection
          projects={projects}
          heading="All Projects"
          subheading="Everything I've published — newest first, favorites on top."
        />
      </main>
      <Footer name={profile.full_name} />
    </>
  );
}
