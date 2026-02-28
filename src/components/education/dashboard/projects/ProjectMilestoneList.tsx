"use client";
import { useState, useMemo } from "react";
import { ProjectMilestone } from "@/types";
import { motion, AnimatePresence } from "framer-motion";

interface ProjectMilestoneListProps {
  milestones: ProjectMilestone[];
  projectId: string;
  onAdd: (milestone: Omit<ProjectMilestone, "id" | "created_at">) => void;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export function ProjectMilestoneList({ milestones, projectId, onAdd, onToggle, onDelete }: ProjectMilestoneListProps) {
  const [newTitle, setNewTitle] = useState("");
  const [newDueDate, setNewDueDate] = useState("");
  const sorted = useMemo(() => [...milestones].sort((a, b) => (a.completed === b.completed ? 0 : a.completed ? 1 : -1)), [milestones]);
  const completed = milestones.filter((m) => m.completed).length;
  const progress = milestones.length > 0 ? Math.round((completed / milestones.length) * 100) : 0;

  function handleAdd() {
    if (!newTitle.trim()) return;
    onAdd({ project_id: projectId, title: newTitle.trim(), due_date: newDueDate || null, completed: false });
    setNewTitle("");
    setNewDueDate("");
  }

  const now = new Date().toISOString().slice(0, 10);

  return (
    <div className="glass-card rounded-2xl p-6">
      <h3 className="font-display font-semibold text-lg text-white mb-4">Milestones</h3>

      <div className="mb-4">
        <div className="flex items-center justify-between mb-1.5">
          <span className="font-mono text-xs text-white/40">{progress}%</span>
          <span className="font-mono text-xs text-white/30">{completed}/{milestones.length}</span>
        </div>
        <div className="w-full h-2 rounded-full bg-white/[0.04] overflow-hidden">
          <motion.div className="h-full rounded-full bg-emerald-500" initial={{ width: 0 }} animate={{ width: `${progress}%` }} transition={{ duration: 0.8 }} />
        </div>
      </div>

      {sorted.length === 0 && <p className="font-body text-sm text-white/20 text-center py-4">No milestones yet.</p>}
      <div className="flex flex-col gap-1 mb-4">
        <AnimatePresence mode="popLayout">
          {sorted.map((m) => (
            <motion.div key={m.id} layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -20 }} className="group flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-white/[0.03] transition-colors">
              <input type="checkbox" checked={m.completed} onChange={() => onToggle(m.id)} className="w-4 h-4 rounded accent-emerald-500 shrink-0" />
              <span className={`font-body text-sm flex-1 ${m.completed ? "line-through text-white/30" : "text-white/70"}`}>{m.title}</span>
              {m.due_date && (
                <span className={`font-mono text-[10px] shrink-0 ${!m.completed && m.due_date < now ? "text-red-400" : "text-white/30"}`}>
                  {m.due_date}
                </span>
              )}
              <button onClick={() => onDelete(m.id)} className="opacity-0 group-hover:opacity-100 transition-opacity text-xs text-red-400/50 hover:text-red-400">&times;</button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="flex items-center gap-2">
        <input type="text" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleAdd()} placeholder="Add milestone..." className="bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 font-body text-sm text-white placeholder-white/20 focus:outline-none focus:border-blue-500/40 transition-all flex-1" />
        <input type="date" value={newDueDate} onChange={(e) => setNewDueDate(e.target.value)} className="bg-white/[0.04] border border-white/[0.08] rounded-xl px-3 py-2.5 font-body text-xs text-white/60 focus:outline-none focus:border-blue-500/40 transition-all w-36" />
      </div>
    </div>
  );
}
