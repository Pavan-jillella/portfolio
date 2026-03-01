"use client";
import { useState } from "react";
import { FadeIn } from "@/components/ui/FadeIn";

interface Project {
  id: string | number;
  name: string;
  description: string;
  stars: number;
  forks: number;
  language: string;
  url: string;
  topics?: string[];
}

export function ProjectFilters({ projects }: { projects: Project[] }) {
  const [activeLang, setActiveLang] = useState("All");
  const languages = ["All", ...Array.from(new Set(projects.map((p) => p.language).filter(Boolean)))];

  const filtered = activeLang === "All"
    ? projects
    : projects.filter((p) => p.language === activeLang);

  return (
    <>
      {/* Language filter chips */}
      <FadeIn>
        <div className="flex flex-wrap items-center gap-2 mb-8">
          {languages.map((lang) => (
            <button
              key={lang}
              onClick={() => setActiveLang(lang)}
              className={`px-3 py-1.5 rounded-full border font-mono text-xs transition-all duration-200 ${
                activeLang === lang
                  ? "border-blue-500/30 bg-blue-500/[0.12] text-blue-400"
                  : "border-white/8 bg-white/4 text-white/40 hover:border-white/15 hover:text-white/60"
              }`}
            >
              {lang}
              {lang !== "All" && (
                <span className="ml-1.5 text-[10px] opacity-60">
                  {projects.filter((p) => p.language === lang).length}
                </span>
              )}
            </button>
          ))}
        </div>
      </FadeIn>

      {/* Filtered projects grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filtered.map((project, i) => (
          <FadeIn key={project.id} delay={i * 0.05}>
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block glass-card rounded-2xl p-6 hover:bg-white/[0.02] hover:border-white/15 transition-all duration-300 group h-full"
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-display font-semibold text-white group-hover:text-blue-300 transition-colors">
                  {project.name}
                </h3>
                <span className="font-mono text-xs text-white/20 shrink-0 ml-3">{project.language}</span>
              </div>
              <p className="font-body text-sm text-white/40 mb-4 line-clamp-2">
                {project.description}
              </p>
              <div className="flex items-center gap-4">
                <span className="font-mono text-xs text-white/30">
                  ★ {project.stars}
                </span>
                <span className="font-mono text-xs text-white/30">
                  ⑂ {project.forks}
                </span>
              </div>
              {project.topics && project.topics.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {project.topics.slice(0, 4).map((topic: string) => (
                    <span
                      key={topic}
                      className="px-2 py-0.5 rounded-full border border-white/5 bg-white/[0.02] font-mono text-xs text-white/20"
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              )}
            </a>
          </FadeIn>
        ))}
      </div>
      {filtered.length === 0 && (
        <p className="text-center font-body text-sm text-white/20 py-12">No projects with this language</p>
      )}
    </>
  );
}
