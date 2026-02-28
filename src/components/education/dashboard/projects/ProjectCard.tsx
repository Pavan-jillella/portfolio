"use client";
import { DashboardProject, ProjectStatus } from "@/types";
import { PROJECT_STATUS_CONFIG } from "@/lib/constants";
import { motion } from "framer-motion";

interface ProjectCardProps {
  project: DashboardProject;
  milestoneCount: number;
  completedMilestones: number;
  isSelected: boolean;
  onClick: () => void;
}

export function ProjectCard({ project, milestoneCount, completedMilestones, isSelected, onClick }: ProjectCardProps) {
  const statusCfg = PROJECT_STATUS_CONFIG[project.status];
  const progress = milestoneCount > 0 ? Math.round((completedMilestones / milestoneCount) * 100) : 0;

  return (
    <motion.div
      onClick={onClick}
      className={`glass-card rounded-2xl p-5 cursor-pointer transition-all ${isSelected ? "border-blue-500/30" : "hover:border-white/10"}`}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <h4 className="font-display font-semibold text-sm text-white truncate">{project.name}</h4>
        <span className={`text-[10px] px-2 py-0.5 rounded-full shrink-0 ${statusCfg.color} ${statusCfg.bgColor}`}>{statusCfg.label}</span>
      </div>

      {project.description && (
        <p className="font-body text-xs text-white/40 line-clamp-2 mb-3">{project.description}</p>
      )}

      {milestoneCount > 0 && (
        <div className="mb-2">
          <div className="w-full h-1.5 rounded-full bg-white/[0.04] overflow-hidden">
            <div className="h-full rounded-full bg-emerald-500 transition-all duration-500" style={{ width: `${progress}%` }} />
          </div>
          <span className="font-mono text-[10px] text-white/30 mt-1 block">{completedMilestones}/{milestoneCount} milestones</span>
        </div>
      )}

      <div className="flex items-center gap-2">
        {project.github_url && (
          <svg className="w-3.5 h-3.5 text-white/20" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
          </svg>
        )}
        <span className="font-mono text-[10px] text-white/20 ml-auto">
          {new Date(project.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
        </span>
      </div>
    </motion.div>
  );
}
