"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Habit, HabitChain, HabitCategory, HabitDifficulty, LifeIndexDomain } from "@/types";
import { HABIT_CATEGORIES, HABIT_CATEGORY_COLORS, HABIT_DIFFICULTY_LABELS } from "@/lib/constants";

interface HabitFormProps {
  habit: Habit | null;
  chains: HabitChain[];
  onSave: (habit: Habit) => void;
  onCancel: () => void;
}

export function HabitForm({ habit, chains, onSave, onCancel }: HabitFormProps) {
  const [name, setName] = useState(habit?.name || "");
  const [description, setDescription] = useState(habit?.description || "");
  const [category, setCategory] = useState<HabitCategory>(habit?.category || "Personal");
  const [difficulty, setDifficulty] = useState<HabitDifficulty>(habit?.difficulty || "medium");
  const [frequencyPerWeek, setFrequencyPerWeek] = useState(habit?.frequency_per_week || 7);
  const [chainId, setChainId] = useState<string | null>(habit?.chain_id || null);
  const [lifeIndexDomain, setLifeIndexDomain] = useState<LifeIndexDomain | null>(habit?.life_index_domain || null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;

    const now = new Date().toISOString();
    const saved: Habit = {
      id: habit?.id || crypto.randomUUID(),
      name: name.trim(),
      description: description.trim(),
      category,
      difficulty,
      frequency_per_week: frequencyPerWeek,
      chain_id: chainId,
      life_index_domain: lifeIndexDomain,
      icon: habit?.icon || "",
      color: habit?.color || HABIT_CATEGORY_COLORS[category],
      active: habit?.active ?? true,
      created_at: habit?.created_at || now,
      updated_at: now,
    };
    onSave(saved);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card rounded-2xl p-6"
    >
      <h3 className="font-display text-lg font-semibold text-white mb-4">
        {habit ? "Edit Habit" : "New Habit"}
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <div>
          <label className="font-mono text-[10px] text-white/30 uppercase tracking-widest block mb-1">
            Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Exercise, Read, Meditate..."
            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm font-body text-white placeholder:text-white/20 focus:outline-none focus:border-blue-500/30"
            autoFocus
          />
        </div>

        {/* Description */}
        <div>
          <label className="font-mono text-[10px] text-white/30 uppercase tracking-widest block mb-1">
            Description (optional)
          </label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Brief description..."
            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm font-body text-white placeholder:text-white/20 focus:outline-none focus:border-blue-500/30"
          />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {/* Category */}
          <div>
            <label className="font-mono text-[10px] text-white/30 uppercase tracking-widest block mb-1">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as HabitCategory)}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm font-body text-white focus:outline-none focus:border-blue-500/30"
            >
              {HABIT_CATEGORIES.map((c) => (
                <option key={c} value={c} className="bg-gray-900">
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Difficulty */}
          <div>
            <label className="font-mono text-[10px] text-white/30 uppercase tracking-widest block mb-1">
              Difficulty
            </label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value as HabitDifficulty)}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm font-body text-white focus:outline-none focus:border-blue-500/30"
            >
              {(["easy", "medium", "hard"] as const).map((d) => (
                <option key={d} value={d} className="bg-gray-900">
                  {HABIT_DIFFICULTY_LABELS[d]}
                </option>
              ))}
            </select>
          </div>

          {/* Frequency */}
          <div>
            <label className="font-mono text-[10px] text-white/30 uppercase tracking-widest block mb-1">
              Times / Week
            </label>
            <select
              value={frequencyPerWeek}
              onChange={(e) => setFrequencyPerWeek(Number(e.target.value))}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm font-body text-white focus:outline-none focus:border-blue-500/30"
            >
              {[1, 2, 3, 4, 5, 6, 7].map((n) => (
                <option key={n} value={n} className="bg-gray-900">
                  {n}x
                </option>
              ))}
            </select>
          </div>

          {/* Life Index Domain */}
          <div>
            <label className="font-mono text-[10px] text-white/30 uppercase tracking-widest block mb-1">
              Life Index
            </label>
            <select
              value={lifeIndexDomain || ""}
              onChange={(e) => setLifeIndexDomain((e.target.value || null) as LifeIndexDomain | null)}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm font-body text-white focus:outline-none focus:border-blue-500/30"
            >
              <option value="" className="bg-gray-900">None</option>
              <option value="growth" className="bg-gray-900">Personal Growth</option>
              <option value="learning" className="bg-gray-900">Learning</option>
              <option value="technical" className="bg-gray-900">Technical</option>
              <option value="finance" className="bg-gray-900">Finance</option>
            </select>
          </div>
        </div>

        {/* Chain */}
        {chains.length > 0 && (
          <div>
            <label className="font-mono text-[10px] text-white/30 uppercase tracking-widest block mb-1">
              Routine (optional)
            </label>
            <select
              value={chainId || ""}
              onChange={(e) => setChainId(e.target.value || null)}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm font-body text-white focus:outline-none focus:border-blue-500/30"
            >
              <option value="" className="bg-gray-900">No routine</option>
              {chains.map((c) => (
                <option key={c.id} value={c.id} className="bg-gray-900">
                  {c.name} ({c.time_of_day})
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={!name.trim()}
            className="px-5 py-2 rounded-xl text-sm font-body bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          >
            {habit ? "Update" : "Create"} Habit
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-5 py-2 rounded-xl text-sm font-body text-white/40 hover:text-white transition-all"
          >
            Cancel
          </button>
        </div>
      </form>
    </motion.div>
  );
}
