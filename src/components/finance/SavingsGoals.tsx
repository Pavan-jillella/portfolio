"use client";
import { useState } from "react";
import { SavingsGoal } from "@/types";
import { formatCurrency, generateId } from "@/lib/finance-utils";
import { motion } from "framer-motion";

interface SavingsGoalsProps {
  goals: SavingsGoal[];
  onAddGoal: (goal: SavingsGoal) => void;
  onUpdateGoal: (id: string, amount: number) => void;
  onDeleteGoal: (id: string) => void;
}

export function SavingsGoals({ goals, onAddGoal, onUpdateGoal, onDeleteGoal }: SavingsGoalsProps) {
  const [showAdd, setShowAdd] = useState(false);
  const [name, setName] = useState("");
  const [target, setTarget] = useState("");
  const [deadline, setDeadline] = useState("");
  const [addAmounts, setAddAmounts] = useState<Record<string, string>>({});

  function handleAddGoal(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !target || parseFloat(target) <= 0) return;
    onAddGoal({
      id: generateId(),
      name,
      target_amount: parseFloat(target),
      current_amount: 0,
      deadline: deadline || null,
      created_at: new Date().toISOString(),
    });
    setName("");
    setTarget("");
    setDeadline("");
    setShowAdd(false);
  }

  function handleAddFunds(id: string) {
    const amount = parseFloat(addAmounts[id] || "0");
    if (amount <= 0) return;
    onUpdateGoal(id, amount);
    setAddAmounts((prev) => ({ ...prev, [id]: "" }));
  }

  return (
    <div className="space-y-5">
      {goals.length === 0 && !showAdd && (
        <div className="glass-card rounded-3xl p-8 text-center">
          <p className="font-body text-sm text-white/30">No savings goals yet</p>
          <p className="font-body text-xs text-white/15 mt-1">Create a goal to start tracking</p>
        </div>
      )}

      {goals.map((goal, i) => {
        const pct = goal.target_amount > 0 ? Math.min((goal.current_amount / goal.target_amount) * 100, 100) : 0;
        const radius = 40;
        const circumference = 2 * Math.PI * radius;
        const offset = circumference - (pct / 100) * circumference;

        return (
          <motion.div
            key={goal.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="glass-card rounded-2xl p-6 group"
          >
            <div className="flex items-start gap-6">
              {/* Progress ring */}
              <div className="shrink-0">
                <svg width="96" height="96" className="-rotate-90">
                  <circle cx="48" cy="48" r={radius} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="4" />
                  <motion.circle
                    cx="48" cy="48" r={radius} fill="none"
                    stroke={pct >= 100 ? "#10b981" : "#3b82f6"}
                    strokeWidth="4" strokeLinecap="round"
                    strokeDasharray={circumference}
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset: offset }}
                    transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                  />
                </svg>
                <p className="text-center -mt-[62px] font-mono text-sm text-white">{Math.round(pct)}%</p>
              </div>

              <div className="flex-1 mt-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-display font-semibold text-white">{goal.name}</h4>
                    <p className="font-mono text-sm text-white/30 mt-1">
                      {formatCurrency(goal.current_amount)} / {formatCurrency(goal.target_amount)}
                    </p>
                    {goal.deadline && (
                      <p className="font-mono text-xs text-white/15 mt-0.5">Deadline: {goal.deadline}</p>
                    )}
                  </div>
                  <button
                    onClick={() => onDeleteGoal(goal.id)}
                    className="opacity-0 group-hover:opacity-100 text-white/20 hover:text-red-400 transition-all"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Add funds */}
                <div className="flex items-center gap-2 mt-4">
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={addAmounts[goal.id] || ""}
                    onChange={(e) => setAddAmounts((prev) => ({ ...prev, [goal.id]: e.target.value }))}
                    placeholder="Amount"
                    className="w-28 bg-white/4 border border-white/8 rounded-xl px-3 py-2 font-mono text-xs text-white placeholder-white/20 focus:outline-none focus:border-blue-500/40 transition-all"
                  />
                  <button
                    onClick={() => handleAddFunds(goal.id)}
                    className="glass-card px-3 py-2 rounded-xl text-xs font-body text-white/60 hover:text-white transition-all"
                  >
                    + Add
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        );
      })}

      {/* Add goal form */}
      {showAdd ? (
        <form onSubmit={handleAddGoal} className="glass-card rounded-2xl p-6 space-y-4">
          <div>
            <label className="block font-mono text-xs text-white/40 uppercase tracking-widest mb-2">Goal Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full bg-white/4 border border-white/8 rounded-xl px-4 py-2.5 font-body text-sm text-white placeholder-white/20 focus:outline-none focus:border-blue-500/40 transition-all"
              placeholder="Emergency fund, vacation, etc."
            />
          </div>
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="block font-mono text-xs text-white/40 uppercase tracking-widest mb-2">Target</label>
              <input
                type="number"
                min="0"
                step="1"
                value={target}
                onChange={(e) => setTarget(e.target.value)}
                required
                className="w-full bg-white/4 border border-white/8 rounded-xl px-4 py-2.5 font-mono text-sm text-white placeholder-white/20 focus:outline-none focus:border-blue-500/40 transition-all"
                placeholder="10000"
              />
            </div>
            <div className="flex-1">
              <label className="block font-mono text-xs text-white/40 uppercase tracking-widest mb-2">Deadline</label>
              <input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full bg-white/4 border border-white/8 rounded-xl px-4 py-2.5 font-body text-sm text-white focus:outline-none focus:border-blue-500/40 transition-all"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <button type="submit" className="glass-card px-5 py-2.5 rounded-xl text-sm font-body text-white/60 hover:text-white transition-all hover:border-blue-500/30">
              Create Goal
            </button>
            <button type="button" onClick={() => setShowAdd(false)} className="px-5 py-2.5 text-sm font-body text-white/30 hover:text-white transition-colors">
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <button
          onClick={() => setShowAdd(true)}
          className="glass-card rounded-2xl p-4 w-full text-center text-sm font-body text-white/40 hover:text-white transition-all hover:border-blue-500/20"
        >
          + New Savings Goal
        </button>
      )}
    </div>
  );
}
