"use client";
import { useState, useMemo } from "react";
import { CourseModule } from "@/types";
import { calculateModuleProgress } from "@/lib/education-utils";
import { motion, AnimatePresence } from "framer-motion";

interface CourseModuleListProps {
  modules: CourseModule[];
  courseId: string;
  onAdd: (module: Omit<CourseModule, "id" | "created_at">) => void;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export function CourseModuleList({ modules, courseId, onAdd, onToggle, onDelete }: CourseModuleListProps) {
  const [newTitle, setNewTitle] = useState("");
  const sorted = useMemo(() => [...modules].sort((a, b) => a.order - b.order), [modules]);
  const progress = useMemo(() => calculateModuleProgress(modules), [modules]);

  function handleAdd() {
    if (!newTitle.trim()) return;
    const nextOrder = modules.length > 0 ? Math.max(...modules.map((m) => m.order)) + 1 : 1;
    onAdd({ course_id: courseId, title: newTitle.trim(), order: nextOrder, completed: false });
    setNewTitle("");
  }

  return (
    <div className="glass-card rounded-2xl p-6">
      <h3 className="font-display font-semibold text-lg text-white mb-4">Modules</h3>

      {/* Progress bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-1.5">
          <span className="font-mono text-xs text-white/40">{progress}% complete</span>
          <span className="font-mono text-xs text-white/30">
            {modules.filter((m) => m.completed).length}/{modules.length}
          </span>
        </div>
        <div className="w-full h-2 rounded-full bg-white/[0.04] overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-blue-500"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* Module list */}
      {sorted.length === 0 && (
        <p className="font-body text-sm text-white/20 text-center py-4">No modules added yet.</p>
      )}
      <div className="flex flex-col gap-1 mb-4">
        <AnimatePresence mode="popLayout">
          {sorted.map((mod) => (
            <motion.div
              key={mod.id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="group flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-white/[0.03] transition-colors"
            >
              <input
                type="checkbox"
                checked={mod.completed}
                onChange={() => onToggle(mod.id)}
                className="w-4 h-4 rounded accent-blue-500 shrink-0"
              />
              <span
                className={`font-body text-sm flex-1 transition-colors ${
                  mod.completed ? "line-through text-white/30" : "text-white/70"
                }`}
              >
                {mod.title}
              </span>
              <button
                onClick={() => onDelete(mod.id)}
                className="opacity-0 group-hover:opacity-100 transition-opacity text-xs text-red-400/50 hover:text-red-400"
              >
                &times;
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Add module */}
      <input
        type="text"
        value={newTitle}
        onChange={(e) => setNewTitle(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleAdd()}
        placeholder="Add a module..."
        className="bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 font-body text-sm text-white placeholder-white/20 focus:outline-none focus:border-blue-500/40 transition-all w-full"
      />
    </div>
  );
}
