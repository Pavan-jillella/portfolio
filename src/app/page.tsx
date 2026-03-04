import { HeroSection } from "@/components/sections/HeroSection";
import { VlogSection } from "@/components/sections/VlogSection";
import { BlogSection } from "@/components/sections/BlogSection";
import { ProjectsSection } from "@/components/sections/ProjectsSection";
import { PhilosophySection } from "@/components/sections/PhilosophySection";
import { Footer } from "@/components/sections/Footer";

export default function Home() {
  return (
    <>
      <HeroSection />
      <VlogSection />
      <BlogSection />
      <ProjectsSection />
      <PhilosophySection />
      <Footer />
    </>
  );
}
