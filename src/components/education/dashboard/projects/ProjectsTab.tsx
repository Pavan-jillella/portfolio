"use client";
import { useState, useMemo } from "react";
import { DashboardProject, ProjectStatus, ProjectMilestone, ProjectNote, ProjectFile } from "@/types";
import { PROJECT_STATUS_CONFIG } from "@/lib/constants";
import { ProjectCard } from "./ProjectCard";
import { ProjectForm } from "./ProjectForm";
import { ProjectDetail } from "./ProjectDetail";
import { motion } from "framer-motion";

const statusFilters: ("all" | ProjectStatus)[] = ["all", "planned", "in-progress", "completed", "on-hold"];

interface ProjectsTabProps {
  projects: DashboardProject[];
  milestones: ProjectMilestone[];
  projectNotes: ProjectNote[];
  projectFiles: ProjectFile[];
  onAddProject: (project: Omit<DashboardProject, "id" | "created_at" | "updated_at">) => void;
  onEditProject: (id: string, updates: Partial<DashboardProject>) => void;
  onDeleteProject: (id: string) => void;
  onAddMilestone: (milestone: Omit<ProjectMilestone, "id" | "created_at">) => void;
  onToggleMilestone: (id: string) => void;
  onDeleteMilestone: (id: string) => void;
  onSaveProjectNote: (note: Omit<ProjectNote, "id" | "created_at">) => void;
  onAddProjectFile: (file: Omit<ProjectFile, "id" | "created_at">) => void;
  onDeleteProjectFile: (id: string) => void;
}

export function ProjectsTab({
  projects,
  milestones,
  projectNotes,
  projectFiles,
  onAddProject,
  onEditProject,
  onDeleteProject,
  onAddMilestone,
  onToggleMilestone,
  onDeleteMilestone,
  onSaveProjectNote,
  onAddProjectFile,
  onDeleteProjectFile,
}: ProjectsTabProps) {
  const [statusFilter, setStatusFilter] = useState<"all" | ProjectStatus>("all");
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState<DashboardProject | null>(null);

  const filtered = useMemo(
    () => (statusFilter === "all" ? projects : projects.filter((p) => p.status === statusFilter)),
    [projects, statusFilter]
  );

  const selectedProject = projects.find((p) => p.id === selectedProjectId);
  const selectedMilestones = useMemo(
    () => milestones.filter((m) => m.project_id === selectedProjectId),
    [milestones, selectedProjectId]
  );
  const selectedNotes = useMemo(
    () => projectNotes.filter((n) => n.project_id === selectedProjectId),
    [projectNotes, selectedProjectId]
  );
  const selectedFiles = useMemo(
    () => projectFiles.filter((f) => f.project_id === selectedProjectId),
    [projectFiles, selectedProjectId]
  );

  const stats = useMemo(() => ({
    total: projects.length,
    active: projects.filter((p) => p.status === "in-progress").length,
    completed: projects.filter((p) => p.status === "completed").length,
  }), [projects]);

  function handleFormSubmit(data: Omit<DashboardProject, "id" | "created_at" | "updated_at">) {
    if (editingProject) {
      onEditProject(editingProject.id, { ...data, updated_at: new Date().toISOString() });
    } else {
      onAddProject(data);
    }
    setEditingProject(null);
  }

  function handleEditClick() {
    if (selectedProject) {
      setEditingProject(selectedProject);
      setShowForm(true);
    }
  }

  function handleDeleteClick() {
    if (selectedProjectId) {
      onDeleteProject(selectedProjectId);
      setSelectedProjectId(null);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="font-display font-semibold text-xl text-white">Projects</h2>
        <button
          onClick={() => { setEditingProject(null); setShowForm(true); }}
          className="glass-card px-5 py-2.5 rounded-xl text-sm font-body text-white/60 hover:text-white transition-all hover:border-blue-500/30"
        >
          + New Project
        </button>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total", value: stats.total },
          { label: "Active", value: stats.active },
          { label: "Completed", value: stats.completed },
        ].map((s, i) => (
          <motion.div
            key={s.label}
            className="glass-card rounded-2xl p-5"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <p className="font-body text-xs text-white/40 mb-1">{s.label}</p>
            <p className="font-display font-bold text-2xl text-white">{s.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Status filter */}
      <div className="flex flex-wrap gap-2">
        {statusFilters.map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`px-3 py-1.5 rounded-full text-xs font-body capitalize transition-all ${
              statusFilter === s ? "glass-card text-blue-400" : "text-white/40 hover:text-white"
            }`}
          >
            {s === "all" ? "All" : PROJECT_STATUS_CONFIG[s].label}
          </button>
        ))}
      </div>

      {/* Project grid */}
      {filtered.length === 0 ? (
        <p className="font-body text-sm text-white/20 text-center py-8">No projects yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((project) => {
            const pm = milestones.filter((m) => m.project_id === project.id);
            const completedMs = pm.filter((m) => m.completed).length;
            return (
              <ProjectCard
                key={project.id}
                project={project}
                milestoneCount={pm.length}
                completedMilestones={completedMs}
                isSelected={selectedProjectId === project.id}
                onClick={() => setSelectedProjectId(selectedProjectId === project.id ? null : project.id)}
              />
            );
          })}
        </div>
      )}

      {/* Selected project detail */}
      {selectedProject && (
        <ProjectDetail
          project={selectedProject}
          milestones={selectedMilestones}
          projectNotes={selectedNotes}
          projectFiles={selectedFiles}
          onEdit={handleEditClick}
          onDelete={handleDeleteClick}
          onAddMilestone={onAddMilestone}
          onToggleMilestone={onToggleMilestone}
          onDeleteMilestone={onDeleteMilestone}
          onSaveNote={onSaveProjectNote}
          onAddFile={onAddProjectFile}
          onDeleteFile={onDeleteProjectFile}
        />
      )}

      {/* Form modal */}
      <ProjectForm
        open={showForm}
        onClose={() => { setShowForm(false); setEditingProject(null); }}
        onSubmit={handleFormSubmit}
        editProject={editingProject || undefined}
      />
    </div>
  );
}
