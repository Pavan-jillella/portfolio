"use client";
import { useState } from "react";
import { CourseMaterial } from "@/types";
import { motion, AnimatePresence } from "framer-motion";

interface MaterialsListProps {
  materials: CourseMaterial[];
  onAdd: (material: Omit<CourseMaterial, "id" | "created_at">) => void;
  onDelete: (id: string) => void;
  courseId: string;
}

const typeIcons: Record<string, string> = {
  note: "N",
  link: "L",
  file: "F",
};

export function MaterialsList({ materials, onAdd, onDelete, courseId }: MaterialsListProps) {
  const [showAdd, setShowAdd] = useState(false);
  const [type, setType] = useState<"note" | "link" | "file">("note");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!title) return;
    onAdd({ course_id: courseId, title, type, content });
    setTitle("");
    setContent("");
    setShowAdd(false);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-display font-semibold text-sm text-white">Materials</h4>
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="text-sm font-body text-white/40 hover:text-white transition-colors"
        >
          {showAdd ? "Cancel" : "+ Add"}
        </button>
      </div>

      {showAdd && (
        <form onSubmit={handleAdd} className="glass-card rounded-xl p-4 mb-4 space-y-3">
          <div className="flex gap-2">
            {(["note", "link", "file"] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setType(t)}
                className={`px-3 py-1 rounded-lg text-xs font-body transition-all ${
                  type === t ? "glass-card text-blue-400" : "text-white/30 hover:text-white"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            placeholder="Title"
            className="w-full bg-white/4 border border-white/8 rounded-xl px-4 py-2 font-body text-sm text-white placeholder-white/20 focus:outline-none focus:border-blue-500/40 transition-all"
          />
          <input
            type="text"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={type === "link" ? "URL" : type === "note" ? "Note content" : "File name"}
            className="w-full bg-white/4 border border-white/8 rounded-xl px-4 py-2 font-body text-sm text-white placeholder-white/20 focus:outline-none focus:border-blue-500/40 transition-all"
          />
          <button type="submit" className="glass-card px-4 py-1.5 rounded-lg text-xs font-body text-white/60 hover:text-white transition-all">
            Add
          </button>
        </form>
      )}

      {materials.length === 0 ? (
        <p className="font-body text-xs text-white/20">No materials yet</p>
      ) : (
        <div className="space-y-2">
          <AnimatePresence>
            {materials.map((m) => (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="glass-card rounded-xl p-3 flex items-center gap-3 group"
              >
                <span className="w-6 h-6 rounded-md bg-white/4 flex items-center justify-center font-mono text-xs text-white/30 shrink-0">
                  {typeIcons[m.type]}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="font-body text-sm text-white/60 truncate">{m.title}</p>
                  {m.content && m.type === "link" ? (
                    <a href={m.content} target="_blank" rel="noopener noreferrer" className="font-mono text-xs text-blue-400 truncate block">
                      {m.content}
                    </a>
                  ) : m.content ? (
                    <p className="font-body text-xs text-white/20 truncate">{m.content}</p>
                  ) : null}
                </div>
                <button
                  onClick={() => onDelete(m.id)}
                  className="opacity-0 group-hover:opacity-100 text-white/20 hover:text-red-400 transition-all shrink-0"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
