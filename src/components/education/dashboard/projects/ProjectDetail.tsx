"use client";
import { useState } from "react";
import dynamic from "next/dynamic";
import { DashboardProject, ProjectMilestone, ProjectNote, ProjectFile } from "@/types";
import { PROJECT_STATUS_CONFIG } from "@/lib/constants";
import { ProjectMilestoneList } from "./ProjectMilestoneList";
import { motion } from "framer-motion";

const TipTapEditor = dynamic(
  () => import("../notes/TipTapEditor").then((m) => ({ default: m.TipTapEditor })),
  { ssr: false, loading: () => <div className="h-[200px] bg-white/[0.02] rounded-xl animate-pulse" /> }
);

interface ProjectDetailProps {
  project: DashboardProject;
  milestones: ProjectMilestone[];
  projectNotes: ProjectNote[];
  projectFiles: ProjectFile[];
  onEdit: () => void;
  onDelete: () => void;
  onAddMilestone: (milestone: Omit<ProjectMilestone, "id" | "created_at">) => void;
  onToggleMilestone: (id: string) => void;
  onDeleteMilestone: (id: string) => void;
  onSaveNote: (note: Omit<ProjectNote, "id" | "created_at">) => void;
  onAddFile: (file: Omit<ProjectFile, "id" | "created_at">) => void;
  onDeleteFile: (id: string) => void;
}

export function ProjectDetail({
  project,
  milestones,
  projectNotes,
  projectFiles,
  onEdit,
  onDelete,
  onAddMilestone,
  onToggleMilestone,
  onDeleteMilestone,
  onSaveNote,
  onAddFile,
  onDeleteFile,
}: ProjectDetailProps) {
  const statusCfg = PROJECT_STATUS_CONFIG[project.status];
  const latestNote = projectNotes.length > 0
    ? [...projectNotes].sort((a, b) => b.updated_at.localeCompare(a.updated_at))[0]
    : null;
  const [noteContent, setNoteContent] = useState(latestNote?.content_html || "");

  function handleSaveNote() {
    onSaveNote({ project_id: project.id, content_html: noteContent, updated_at: new Date().toISOString() });
  }

  function handleFileSelect() {
    const input = document.createElement("input");
    input.type = "file";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      const url = URL.createObjectURL(file);
      onAddFile({
        project_id: project.id,
        file_name: file.name,
        file_url: url,
        file_type: file.type,
        file_size: file.size,
        storage_path: "",
      });
    };
    input.click();
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col gap-6"
    >
      {/* Header */}
      <div className="glass-card rounded-2xl p-6">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <h3 className="font-display font-bold text-xl text-white mb-2">{project.name}</h3>
            <span className={`text-xs px-2.5 py-1 rounded-full ${statusCfg.color} ${statusCfg.bgColor}`}>
              {statusCfg.label}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onEdit}
              className="glass-card px-4 py-2 rounded-xl text-xs font-body text-white/60 hover:text-white transition-all hover:border-blue-500/30"
            >
              Edit
            </button>
            <button
              onClick={onDelete}
              className="glass-card px-4 py-2 rounded-xl text-xs font-body text-red-400/60 hover:text-red-400 transition-all hover:border-red-500/30"
            >
              Delete
            </button>
          </div>
        </div>
        {project.description && (
          <p className="font-body text-sm text-white/40 mb-3">{project.description}</p>
        )}
        {project.github_url && (
          <a
            href={project.github_url}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-xs text-blue-400/60 hover:text-blue-400 transition-colors"
          >
            {project.github_url}
          </a>
        )}
      </div>

      {/* Milestones */}
      <ProjectMilestoneList
        milestones={milestones}
        projectId={project.id}
        onAdd={onAddMilestone}
        onToggle={onToggleMilestone}
        onDelete={onDeleteMilestone}
      />

      {/* Notes */}
      <div className="glass-card rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display font-semibold text-lg text-white">Notes</h3>
          <button
            onClick={handleSaveNote}
            className="glass-card px-4 py-2 rounded-xl text-xs font-body text-white/60 hover:text-white transition-all hover:border-blue-500/30"
          >
            Save
          </button>
        </div>
        <TipTapEditor content={noteContent} onChange={setNoteContent} placeholder="Project notes..." />
      </div>

      {/* Files */}
      <div className="glass-card rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display font-semibold text-lg text-white">Files</h3>
          <button
            onClick={handleFileSelect}
            className="glass-card px-4 py-2 rounded-xl text-xs font-body text-white/60 hover:text-white transition-all hover:border-blue-500/30"
          >
            + Add File
          </button>
        </div>
        {projectFiles.length === 0 ? (
          <p className="font-body text-sm text-white/20 text-center py-4">No files attached.</p>
        ) : (
          <div className="flex flex-col gap-2">
            {projectFiles.map((f) => (
              <div key={f.id} className="group flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-white/[0.03] transition-colors">
                <span className="font-mono text-[10px] text-white/30 bg-white/5 px-1.5 py-0.5 rounded uppercase">
                  {f.file_type.split("/").pop()}
                </span>
                <span className="font-body text-sm text-white/60 flex-1 truncate">{f.file_name}</span>
                <button
                  onClick={() => onDeleteFile(f.id)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity text-xs text-red-400/50 hover:text-red-400"
                >
                  &times;
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
