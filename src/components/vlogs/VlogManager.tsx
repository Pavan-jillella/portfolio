"use client";
import { useState } from "react";
import { Vlog } from "@/types";
import { motion, AnimatePresence } from "framer-motion";

const inputClass =
  "w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-3 font-body text-sm placeholder-white/25 focus:outline-none focus:border-blue-500/50 transition-all";

const selectClass =
  "w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-3 font-body text-sm focus:outline-none focus:border-blue-500/50 transition-all appearance-none";

const CATEGORIES = ["Technology", "Education", "Finance", "Lifestyle", "Other"];

interface VlogManagerProps {
  vlogs: Vlog[];
  onAdd: (vlog: Vlog) => void;
  onEdit: (id: string, updates: Partial<Vlog>) => void;
  onDelete: (id: string) => void;
}

export function VlogManager({ vlogs, onAdd, onEdit, onDelete }: VlogManagerProps) {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [category, setCategory] = useState("Technology");
  const [duration, setDuration] = useState("");
  const [description, setDescription] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  function extractYoutubeId(url: string): string {
    // Handle various YouTube URL formats
    const patterns = [
      /(?:youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})/,
      /(?:youtu\.be\/)([a-zA-Z0-9_-]{11})/,
      /(?:youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
      /(?:youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/,
    ];
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) return match[1];
    }
    // If it's already just an ID
    if (/^[a-zA-Z0-9_-]{11}$/.test(url)) return url;
    return url;
  }

  function resetForm() {
    setTitle("");
    setYoutubeUrl("");
    setCategory("Technology");
    setDuration("");
    setDescription("");
    setEditingId(null);
    setShowForm(false);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const youtubeId = extractYoutubeId(youtubeUrl);

    if (editingId) {
      onEdit(editingId, {
        title,
        youtubeId,
        category,
        duration,
        description,
      });
    } else {
      onAdd({
        id: Date.now().toString(),
        title,
        youtubeId,
        category,
        duration,
        publishedAt: new Date().toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        }),
        description,
      });
    }
    resetForm();
  }

  function startEdit(vlog: Vlog) {
    setTitle(vlog.title);
    setYoutubeUrl(vlog.youtubeId);
    setCategory(vlog.category);
    setDuration(vlog.duration);
    setDescription(vlog.description);
    setEditingId(vlog.id);
    setShowForm(true);
  }

  return (
    <div className="mb-10">
      {/* Add button */}
      {!showForm && (
        <button
          onClick={() => setShowForm(true)}
          className="glass-card px-5 py-2.5 rounded-xl text-sm font-body text-white/60 hover:text-white transition-all hover:border-blue-500/30"
        >
          + Add Vlog
        </button>
      )}

      {/* Form */}
      <AnimatePresence>
        {showForm && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={handleSubmit}
            className="glass-card rounded-2xl p-6 space-y-4 overflow-hidden"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-display font-semibold text-white text-sm">
                {editingId ? "Edit Vlog" : "Add New Vlog"}
              </h3>
              <button
                type="button"
                onClick={resetForm}
                className="text-white/30 hover:text-white/60 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div>
              <label className="block font-mono text-[10px] text-white/30 uppercase tracking-wider mb-1.5">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="My Awesome Vlog"
                className={inputClass}
                required
              />
            </div>

            <div>
              <label className="block font-mono text-[10px] text-white/30 uppercase tracking-wider mb-1.5">YouTube URL or Video ID</label>
              <input
                type="text"
                value={youtubeUrl}
                onChange={(e) => setYoutubeUrl(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=... or video ID"
                className={inputClass}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-mono text-[10px] text-white/30 uppercase tracking-wider mb-1.5">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className={selectClass}
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block font-mono text-[10px] text-white/30 uppercase tracking-wider mb-1.5">Duration</label>
                <input
                  type="text"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  placeholder="12:34"
                  className={inputClass}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block font-mono text-[10px] text-white/30 uppercase tracking-wider mb-1.5">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What's this vlog about?"
                rows={3}
                className={`${inputClass} resize-none`}
                required
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-body font-medium hover:bg-blue-500 transition-colors"
              >
                {editingId ? "Save Changes" : "Add Vlog"}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="px-6 py-2.5 rounded-xl text-white/40 text-sm font-body hover:text-white/60 transition-colors"
              >
                Cancel
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Manage existing vlogs */}
      {vlogs.length > 0 && !showForm && (
        <div className="mt-4 space-y-2">
          {vlogs.map((vlog) => (
            <div
              key={vlog.id}
              className="glass-card rounded-xl px-4 py-3 flex items-center justify-between"
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <img
                  src={`https://img.youtube.com/vi/${vlog.youtubeId}/default.jpg`}
                  alt=""
                  className="w-16 h-10 rounded object-cover flex-shrink-0"
                />
                <div className="min-w-0">
                  <p className="font-body text-sm text-white truncate">{vlog.title}</p>
                  <p className="font-mono text-[10px] text-white/30">{vlog.category} · {vlog.duration}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0 ml-3">
                <button
                  onClick={() => startEdit(vlog)}
                  className="px-3 py-1.5 rounded-lg text-xs font-body text-white/40 hover:text-blue-400 hover:bg-white/4 transition-all"
                >
                  Edit
                </button>
                {deleteConfirm === vlog.id ? (
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => { onDelete(vlog.id); setDeleteConfirm(null); }}
                      className="px-3 py-1.5 rounded-lg text-xs font-body text-red-400 hover:bg-red-500/10 transition-all"
                    >
                      Confirm
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(null)}
                      className="px-2 py-1.5 rounded-lg text-xs font-body text-white/30 hover:text-white/50 transition-all"
                    >
                      No
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setDeleteConfirm(vlog.id)}
                    className="px-3 py-1.5 rounded-lg text-xs font-body text-white/40 hover:text-red-400 hover:bg-white/4 transition-all"
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
