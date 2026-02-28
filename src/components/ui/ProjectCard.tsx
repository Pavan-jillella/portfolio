"use client";
import { motion } from "framer-motion";
import { Project } from "@/types";

const langColors: Record<string, string> = {
  TypeScript: "#3178c6",
  JavaScript: "#f7df1e",
  Python: "#3572A5",
  Go: "#00ADD8",
  Rust: "#dea584",
  default: "#6e7681",
};

interface ProjectCardProps {
  project: Project;
  index: number;
}

export function ProjectCard({ project, index }: ProjectCardProps) {
  const color = langColors[project.language] || langColors.default;

  return (
    <motion.a
      href={project.url}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -6, transition: { duration: 0.25 } }}
      className="glass-card rounded-3xl p-7 flex flex-col gap-4 group cursor-pointer block"
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-display font-semibold text-base text-white group-hover:text-blue-300 transition-colors leading-snug">
          {project.name}
        </h3>
        <span className="text-white/20 group-hover:text-white/50 transition-colors text-lg shrink-0">↗</span>
      </div>

      <p className="font-body text-sm text-white/50 leading-relaxed flex-1">
        {project.description}
      </p>

      <div className="flex flex-wrap gap-2">
        {project.topics.slice(0, 3).map((topic) => (
          <span
            key={topic}
            className="tag-badge px-2.5 py-1 rounded-full border border-white/8 bg-white/4 text-white/40"
          >
            {topic}
          </span>
        ))}
      </div>

      <div className="flex items-center gap-5 pt-1 border-t border-white/5">
        <div className="flex items-center gap-2">
          <div
            className="w-2.5 h-2.5 rounded-full"
            style={{ backgroundColor: color }}
          />
          <span className="font-mono text-xs text-white/40">{project.language}</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-white/30 text-xs">⭐</span>
          <span className="font-mono text-xs text-white/40">{project.stars.toLocaleString()}</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-white/30 text-xs">🍴</span>
          <span className="font-mono text-xs text-white/40">{project.forks}</span>
        </div>
      </div>
    </motion.a>
  );
}
