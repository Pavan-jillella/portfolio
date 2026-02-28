"use client";
import { useState } from "react";
import { Course, CoursePlatform, CourseCategory, CourseStatus } from "@/types";
import { COURSE_PLATFORMS, COURSE_CATEGORIES } from "@/lib/constants";

interface CourseFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (course: Omit<Course, "id" | "created_at">) => void;
}

export function CourseForm({ open, onClose, onSubmit }: CourseFormProps) {
  const [name, setName] = useState("");
  const [platform, setPlatform] = useState<CoursePlatform>("Udemy");
  const [url, setUrl] = useState("");
  const [category, setCategory] = useState<CourseCategory>("Python");
  const [status, setStatus] = useState<CourseStatus>("planned");
  const [progress, setProgress] = useState(0);
  const [totalHours, setTotalHours] = useState("");

  if (!open) return null;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name) return;
    onSubmit({
      name,
      platform,
      url,
      category,
      status,
      progress: status === "completed" ? 100 : progress,
      total_hours: parseFloat(totalHours) || 0,
    });
    setName("");
    setUrl("");
    setProgress(0);
    setTotalHours("");
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="glass-card rounded-3xl p-8 w-full max-w-md relative z-10 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display font-semibold text-xl text-white">Add Course</h2>
          <button onClick={onClose} className="text-white/30 hover:text-white transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block font-mono text-xs text-white/40 uppercase tracking-widest mb-2">Course Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full bg-white/5 border border-white/10 text-white rounded-2xl px-5 py-3 font-body placeholder-white/25 focus:outline-none focus:border-blue-500/50 transition-all"
              placeholder="e.g., Python for Data Science"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-mono text-xs text-white/40 uppercase tracking-widest mb-2">Platform</label>
              <select
                value={platform}
                onChange={(e) => setPlatform(e.target.value as CoursePlatform)}
                className="w-full bg-white/5 border border-white/10 text-white rounded-2xl px-5 py-3 font-body focus:outline-none focus:border-blue-500/50 transition-all appearance-none"
              >
                {COURSE_PLATFORMS.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-mono text-xs text-white/40 uppercase tracking-widest mb-2">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as CourseCategory)}
                className="w-full bg-white/5 border border-white/10 text-white rounded-2xl px-5 py-3 font-body focus:outline-none focus:border-blue-500/50 transition-all appearance-none"
              >
                {COURSE_CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block font-mono text-xs text-white/40 uppercase tracking-widest mb-2">URL</label>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full bg-white/5 border border-white/10 text-white rounded-2xl px-5 py-3 font-body placeholder-white/25 focus:outline-none focus:border-blue-500/50 transition-all"
              placeholder="https://..."
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-mono text-xs text-white/40 uppercase tracking-widest mb-2">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as CourseStatus)}
                className="w-full bg-white/5 border border-white/10 text-white rounded-2xl px-5 py-3 font-body focus:outline-none focus:border-blue-500/50 transition-all appearance-none"
              >
                <option value="planned">Planned</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            <div>
              <label className="block font-mono text-xs text-white/40 uppercase tracking-widest mb-2">Hours</label>
              <input
                type="number"
                min="0"
                step="0.5"
                value={totalHours}
                onChange={(e) => setTotalHours(e.target.value)}
                className="w-full bg-white/5 border border-white/10 text-white rounded-2xl px-5 py-3 font-mono placeholder-white/25 focus:outline-none focus:border-blue-500/50 transition-all"
                placeholder="0"
              />
            </div>
          </div>

          {status !== "completed" && (
            <div>
              <label className="block font-mono text-xs text-white/40 uppercase tracking-widest mb-2">
                Progress — {progress}%
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={progress}
                onChange={(e) => setProgress(parseInt(e.target.value))}
                className="w-full accent-blue-500"
              />
            </div>
          )}

          <button
            type="submit"
            className="w-full glass-card px-6 py-3 rounded-2xl text-sm font-body font-medium text-white hover:text-blue-300 transition-all duration-300 hover:border-blue-500/30"
          >
            Add course →
          </button>
        </form>
      </div>
    </div>
  );
}
