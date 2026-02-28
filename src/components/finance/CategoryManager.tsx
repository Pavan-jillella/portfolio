"use client";
import { useState } from "react";
import { DEFAULT_EXPENSE_CATEGORIES, DEFAULT_INCOME_CATEGORIES, CATEGORY_COLORS } from "@/lib/constants";
import { motion, AnimatePresence } from "framer-motion";

interface CategoryManagerProps {
  customCategories: string[];
  onAdd: (category: string) => void;
  onDelete: (category: string) => void;
}

export function CategoryManager({ customCategories, onAdd, onDelete }: CategoryManagerProps) {
  const [newCategory, setNewCategory] = useState("");

  const allDefaults = Array.from(new Set([...DEFAULT_EXPENSE_CATEGORIES, ...DEFAULT_INCOME_CATEGORIES]));

  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = newCategory.trim();
    if (!trimmed) return;
    if (allDefaults.includes(trimmed) || customCategories.includes(trimmed)) return;
    onAdd(trimmed);
    setNewCategory("");
  }

  return (
    <div className="space-y-8">
      {/* Expense Categories */}
      <div>
        <h3 className="font-display font-semibold text-lg text-white mb-2">Expense Categories</h3>
        <p className="font-body text-xs text-white/30 mb-4">Default categories cannot be removed.</p>
        <div className="flex flex-wrap gap-2">
          {DEFAULT_EXPENSE_CATEGORIES.map((c) => (
            <span
              key={c}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/8 bg-white/4"
            >
              <span className={`w-2 h-2 rounded-full ${CATEGORY_COLORS[c] || "bg-gray-500"}`} />
              <span className="font-body text-xs text-white/50">{c}</span>
            </span>
          ))}
        </div>
      </div>

      {/* Income Categories */}
      <div>
        <h3 className="font-display font-semibold text-lg text-white mb-2">Income Categories</h3>
        <div className="flex flex-wrap gap-2">
          {DEFAULT_INCOME_CATEGORIES.map((c) => (
            <span
              key={c}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/8 bg-white/4"
            >
              <span className={`w-2 h-2 rounded-full ${CATEGORY_COLORS[c] || "bg-gray-500"}`} />
              <span className="font-body text-xs text-white/50">{c}</span>
            </span>
          ))}
        </div>
      </div>

      {/* Custom Categories */}
      <div>
        <h3 className="font-display font-semibold text-lg text-white mb-4">Custom Categories</h3>
        <AnimatePresence>
          {customCategories.length > 0 ? (
            <div className="flex flex-wrap gap-2 mb-4">
              {customCategories.map((c) => (
                <motion.span
                  key={c}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/8 bg-white/4 group"
                >
                  <span className="w-2 h-2 rounded-full bg-gray-500" />
                  <span className="font-body text-xs text-white/50">{c}</span>
                  <button
                    onClick={() => onDelete(c)}
                    className="ml-1 text-white/20 hover:text-red-400 transition-colors"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </motion.span>
              ))}
            </div>
          ) : (
            <p className="font-body text-xs text-white/20 mb-4">No custom categories added yet.</p>
          )}
        </AnimatePresence>

        <form onSubmit={handleAdd} className="flex gap-2">
          <input
            type="text"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            placeholder="New category name"
            className="bg-white/4 border border-white/8 rounded-xl px-4 py-2 font-body text-sm text-white placeholder-white/20 focus:outline-none focus:border-blue-500/40 transition-all flex-1"
          />
          <button
            type="submit"
            disabled={!newCategory.trim()}
            className="glass-card px-5 py-2 rounded-xl text-sm font-body text-white/60 hover:text-white transition-all hover:border-blue-500/30 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Add
          </button>
        </form>
      </div>
    </div>
  );
}
