"use client";
import { useState, useEffect } from "react";
import { DashboardProject, ProjectStatus } from "@/types";
import { PROJECT_STATUS_CONFIG } from "@/lib/constants";
import { motion, AnimatePresence } from "framer-motion";

interface ProjectFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (project: Omit<DashboardProject, "id" | "created_at" | "updated_at">) => void;
  editProject?: DashboardProject;
}

const statuses: ProjectStatus[] = ["planned", "in-progress", "completed", "on-hold"];

export function ProjectForm({ open, onClose, onSubmit, editProject }: ProjectFormProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<ProjectStatus>("planned");
  const [githubUrl, setGithubUrl] = useState("");

  useEffect(() => {
    if (editProject) {
      setName(editProject.name);
      setDescription(editProject.description);
      setStatus(editProject.status);
      setGithubUrl(editProject.github_url);
    } else {
      setName("");
      setDescription("");
      setStatus("planned");
      setGithubUrl("");
    }
  }, [editProject, open]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    onSubmit({ name: name.trim(), description, status, github_url: githubUrl });
    onClose();
  }

  const inputClass = "bg-white/5 border border-white/10 text-white rounded-xl px-4 py-2.5 font-body text-sm placeholder-white/25 focus:outline-none focus:border-blue-500/50 transition-all w-full";

  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <motion.div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
          <motion.div className="glass-card rounded-2xl p-6 w-full max-w-md relative z-10" initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}>
            <h3 className="font-display font-semibold text-lg text-white mb-6">{editProject ? "Edit Project" : "New Project"}</h3>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label className="font-body text-xs text-white/40 mb-1.5 block">Name</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} className={inputClass} placeholder="Project name" />
              </div>
              <div>
                <label className="font-body text-xs text-white/40 mb-1.5 block">Description</label>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} className={`${inputClass} resize-none h-20`} placeholder="Brief description" />
              </div>
              <div>
                <label className="font-body text-xs text-white/40 mb-1.5 block">Status</label>
                <select value={status} onChange={(e) => setStatus(e.target.value as ProjectStatus)} className={`${inputClass} appearance-none`}>
                  {statuses.map((s) => (<option key={s} value={s}>{PROJECT_STATUS_CONFIG[s].label}</option>))}
                </select>
              </div>
              <div>
                <label className="font-body text-xs text-white/40 mb-1.5 block">GitHub URL</label>
                <input type="url" value={githubUrl} onChange={(e) => setGithubUrl(e.target.value)} className={inputClass} placeholder="https://github.com/..." />
              </div>
              <div className="flex items-center gap-3 mt-2">
                <button type="button" onClick={onClose} className="glass-card px-5 py-2.5 rounded-xl text-sm font-body text-white/60 hover:text-white transition-all hover:border-blue-500/30">Cancel</button>
                <button type="submit" disabled={!name.trim()} className="glass-card px-5 py-2.5 rounded-xl text-sm font-body text-white/60 hover:text-white transition-all hover:border-blue-500/30 disabled:opacity-30 ml-auto">{editProject ? "Update" : "Create"}</button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
