"use client";
import { useState } from "react";
import { CourseUpdate } from "@/types";
import { motion, AnimatePresence } from "framer-motion";

interface UpdatesLogProps {
  updates: CourseUpdate[];
  onAdd: (update: Omit<CourseUpdate, "id" | "created_at">) => void;
  courseId: string;
}

export function UpdatesLog({ updates, onAdd, courseId }: UpdatesLogProps) {
  const [showAdd, setShowAdd] = useState(false);
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [description, setDescription] = useState("");

  const sorted = [...updates].sort((a, b) => b.date.localeCompare(a.date));

  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!description) return;
    onAdd({ course_id: courseId, date, description });
    setDescription("");
    setDate(new Date().toISOString().slice(0, 10));
    setShowAdd(false);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-display font-semibold text-sm text-white">Learning Log</h4>
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="text-sm font-body text-white/40 hover:text-white transition-colors"
        >
          {showAdd ? "Cancel" : "+ Add"}
        </button>
      </div>

      {showAdd && (
        <form onSubmit={handleAdd} className="glass-card rounded-xl p-4 mb-4 space-y-3">
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full bg-white/4 border border-white/8 rounded-xl px-4 py-2 font-body text-sm text-white focus:outline-none focus:border-blue-500/40 transition-all"
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            rows={2}
            placeholder="What did you learn today?"
            className="w-full bg-white/4 border border-white/8 rounded-xl px-4 py-2 font-body text-sm text-white placeholder-white/20 focus:outline-none focus:border-blue-500/40 transition-all resize-none"
          />
          <button type="submit" className="glass-card px-4 py-1.5 rounded-lg text-xs font-body text-white/60 hover:text-white transition-all">
            Add Entry
          </button>
        </form>
      )}

      {sorted.length === 0 ? (
        <p className="font-body text-xs text-white/20">No updates yet</p>
      ) : (
        <div className="relative pl-6">
          {/* Timeline line */}
          <div className="absolute left-2 top-2 bottom-2 w-px bg-white/8" />

          <AnimatePresence>
            {sorted.map((update) => (
              <motion.div
                key={update.id}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative mb-4 last:mb-0"
              >
                {/* Dot */}
                <div className="absolute -left-[17px] top-1.5 w-2 h-2 rounded-full bg-blue-500" />
                <p className="font-mono text-xs text-white/20 mb-0.5">{update.date}</p>
                <p className="font-body text-sm text-white/50">{update.description}</p>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
