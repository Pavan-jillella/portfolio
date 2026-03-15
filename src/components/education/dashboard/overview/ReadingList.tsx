"use client";
import { useState } from "react";
import { ReadingListItem, ReadingStatus } from "@/types";
import { ConfirmDelete } from "@/components/ui/ConfirmDelete";
import { generateId } from "@/lib/finance-utils";
import { motion, AnimatePresence } from "framer-motion";

interface ReadingListProps {
  items: ReadingListItem[];
  onAdd: (item: Omit<ReadingListItem, "id" | "created_at">) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, updates: Partial<ReadingListItem>) => void;
}

const STATUS_ORDER: ReadingStatus[] = ["planned", "reading", "completed"];

const STATUS_STYLES: Record<ReadingStatus, string> = {
  reading: "border-blue-500/30 bg-blue-500/[0.12] text-blue-400",
  completed: "border-emerald-500/30 bg-emerald-500/[0.12] text-emerald-400",
  planned: "border-white/10 bg-white/5 text-white/40",
};

const CATEGORY_SUGGESTIONS = [
  "Technology",
  "Productivity",
  "Finance",
  "Psychology",
  "Science",
  "Business",
  "Design",
];

export function ReadingList({ items, onAdd, onDelete, onUpdate }: ReadingListProps) {
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState<ReadingStatus>("planned");

  function cycleStatus(current: ReadingStatus): ReadingStatus {
    const idx = STATUS_ORDER.indexOf(current);
    return STATUS_ORDER[(idx + 1) % STATUS_ORDER.length];
  }

  function handleSave() {
    if (!title.trim() || !author.trim()) return;
    onAdd({
      title: title.trim(),
      author: author.trim(),
      category: category.trim() || "Uncategorized",
      status,
    });
    setTitle("");
    setAuthor("");
    setCategory("");
    setStatus("planned");
    setShowForm(false);
  }

  function handleCancel() {
    setTitle("");
    setAuthor("");
    setCategory("");
    setStatus("planned");
    setShowForm(false);
  }

  const inputClass =
    "bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 font-body text-sm text-white placeholder-white/20 focus:outline-none focus:border-blue-500/40 transition-all w-full";
  const selectClass =
    "bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 font-body text-sm text-white placeholder-white/20 focus:outline-none focus:border-blue-500/40 transition-all appearance-none w-full";

  return (
    <div className="glass-card rounded-2xl p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display font-semibold text-lg text-white">
          Reading List
          <span className="ml-2 font-mono text-xs text-white/30">({items.length})</span>
        </h3>
        <button
          onClick={() => setShowForm(!showForm)}
          className="glass-card px-3 py-1.5 rounded-xl text-sm font-body text-white/60 hover:text-white transition-all hover:border-blue-500/30"
        >
          +
        </button>
      </div>

      {/* Add form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="flex flex-col gap-3 mb-6 p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Book title"
                className={inputClass}
              />
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="Author"
                className={inputClass}
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <input
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="Category"
                    list="reading-category-suggestions"
                    className={inputClass}
                  />
                  <datalist id="reading-category-suggestions">
                    {CATEGORY_SUGGESTIONS.map((c) => (
                      <option key={c} value={c} />
                    ))}
                  </datalist>
                </div>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as ReadingStatus)}
                  className={selectClass}
                >
                  <option value="planned" className="bg-[#0a0c12]">Planned</option>
                  <option value="reading" className="bg-[#0a0c12]">Reading</option>
                  <option value="completed" className="bg-[#0a0c12]">Completed</option>
                </select>
              </div>
              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={handleSave}
                  disabled={!title.trim() || !author.trim()}
                  className="glass-card px-5 py-2.5 rounded-xl text-sm font-body text-white/60 hover:text-white transition-all hover:border-blue-500/30 disabled:opacity-30"
                >
                  Save
                </button>
                <button
                  onClick={handleCancel}
                  className="px-5 py-2.5 rounded-xl text-sm font-body text-white/30 hover:text-white/60 transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Empty state */}
      {items.length === 0 && !showForm && (
        <p className="font-body text-sm text-white/20 text-center py-8">
          No books in your reading list yet. Add one to get started.
        </p>
      )}

      {/* Items list */}
      <div className="flex flex-col gap-2">
        <AnimatePresence mode="popLayout">
          {items.map((item) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="group flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/[0.03] transition-colors"
            >
              <div className="flex-1 min-w-0">
                <p className="font-body text-sm text-white truncate">{item.title}</p>
                <p className="font-body text-xs text-white/30 truncate">{item.author}</p>
              </div>

              {/* Category badge */}
              {item.category && (
                <span className="px-2 py-0.5 rounded-full bg-white/5 border border-white/[0.06] font-mono text-[10px] text-white/30 shrink-0 hidden sm:inline-block">
                  {item.category}
                </span>
              )}

              {/* Status badge (clickable to cycle) */}
              <button
                onClick={() => onUpdate(item.id, { status: cycleStatus(item.status) })}
                className={`px-2.5 py-1 rounded-full border font-mono text-[10px] transition-all shrink-0 ${STATUS_STYLES[item.status]}`}
                title={`Click to change status (currently ${item.status})`}
              >
                {item.status}
              </button>

              {/* Delete */}
              <div className="sm:opacity-0 sm:group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity shrink-0">
                <ConfirmDelete onConfirm={() => onDelete(item.id)} />
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
