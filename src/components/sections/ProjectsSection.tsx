import { FadeIn } from "@/components/ui/FadeIn";
import { ProjectCard } from "@/components/ui/ProjectCard";
import { PROJECTS } from "@/lib/data";
import Link from "next/link";

export function ProjectsSection() {
  return (
    <section id="projects" className="py-32 px-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <FadeIn className="mb-16 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
          <div>
            <span className="section-label block mb-4">Open source</span>
            <h2 className="font-display font-bold text-4xl md:text-5xl text-white tracking-tight">
              Things I&apos;ve built.
            </h2>
          </div>
          <Link
            href="/projects"
            className="font-body text-sm text-white/30 hover:text-blue-400 transition-colors shrink-0"
          >
            All projects →
          </Link>
        </FadeIn>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {PROJECTS.slice(0, 3).map((project, i) => (
            <ProjectCard key={project.id} project={project} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
