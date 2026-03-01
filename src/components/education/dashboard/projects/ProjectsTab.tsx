"use client";
import { useState, useMemo } from "react";
import { DashboardProject, ProjectStatus, ProjectMilestone, ProjectNote, ProjectFile } from "@/types";
import { PROJECT_STATUS_CONFIG } from "@/lib/constants";
import { ProjectCard } from "./ProjectCard";
import { ProjectForm } from "./ProjectForm";
import { ProjectDetail } from "./ProjectDetail";
import { ViewToggle, ViewMode } from "@/components/ui/ViewToggle";
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
  const [viewMode, setViewMode] = useState<ViewMode>("grid");

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

      {/* Status filter + view toggle */}
      <div className="flex items-center justify-between gap-4">
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
        <ViewToggle viewMode={viewMode} onChange={setViewMode} modes={["grid", "list", "table"]} />
      </div>

      {/* Project display */}
      {filtered.length === 0 ? (
        <p className="font-body text-sm text-white/20 text-center py-8">No projects yet.</p>
      ) : viewMode === "grid" ? (
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
      ) : viewMode === "list" ? (
        <div className="space-y-2">
          {filtered.map((project) => {
            const pm = milestones.filter((m) => m.project_id === project.id);
            const completedMs = pm.filter((m) => m.completed).length;
            const config = PROJECT_STATUS_CONFIG[project.status];
            return (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`glass-card rounded-2xl p-4 cursor-pointer transition-all hover:bg-white/[0.02] ${
                  selectedProjectId === project.id ? "border-blue-500/30" : ""
                }`}
                onClick={() => setSelectedProjectId(selectedProjectId === project.id ? null : project.id)}
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${config.bgColor}`} />
                    <span className="font-body text-sm text-white truncate">{project.name}</span>
                    <span className={`text-xs font-body ${config.color} shrink-0`}>{config.label}</span>
                  </div>
                  <div className="flex items-center gap-4 shrink-0">
                    {pm.length > 0 && (
                      <span className="font-mono text-xs text-white/30">{completedMs}/{pm.length} milestones</span>
                    )}
                    <span className="font-body text-xs text-white/20 truncate max-w-[200px]">{project.description || "—"}</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <div className="glass-card rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="px-4 py-3 font-mono text-[10px] text-white/30 uppercase tracking-wider">Name</th>
                  <th className="px-4 py-3 font-mono text-[10px] text-white/30 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 font-mono text-[10px] text-white/30 uppercase tracking-wider">Description</th>
                  <th className="px-4 py-3 font-mono text-[10px] text-white/30 uppercase tracking-wider text-right">Milestones</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((project) => {
                  const pm = milestones.filter((m) => m.project_id === project.id);
                  const completedMs = pm.filter((m) => m.completed).length;
                  const config = PROJECT_STATUS_CONFIG[project.status];
                  return (
                    <tr
                      key={project.id}
                      className={`border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors cursor-pointer ${
                        selectedProjectId === project.id ? "bg-blue-500/5" : ""
                      }`}
                      onClick={() => setSelectedProjectId(selectedProjectId === project.id ? null : project.id)}
                    >
                      <td className="px-4 py-2.5">
                        <span className="font-body text-xs text-white/70">{project.name}</span>
                      </td>
                      <td className="px-4 py-2.5">
                        <span className={`inline-flex items-center gap-1.5 text-xs font-body ${config.color}`}>
                          <span className={`w-2 h-2 rounded-full ${config.bgColor}`} />
                          {config.label}
                        </span>
                      </td>
                      <td className="px-4 py-2.5">
                        <span className="font-body text-xs text-white/30 truncate max-w-[250px] block">{project.description || "—"}</span>
                      </td>
                      <td className="px-4 py-2.5 text-right">
                        <span className="font-mono text-xs text-white/40">{pm.length > 0 ? `${completedMs}/${pm.length}` : "—"}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
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
