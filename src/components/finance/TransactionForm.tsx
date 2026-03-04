"use client";
import { useState } from "react";
import { Transaction, TransactionType } from "@/types";
import { DEFAULT_EXPENSE_CATEGORIES, DEFAULT_INCOME_CATEGORIES } from "@/lib/constants";
import { generateId } from "@/lib/finance-utils";

interface TransactionFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (tx: Transaction) => void;
  customCategories?: string[];
}

export function TransactionForm({ open, onClose, onSubmit, customCategories = [] }: TransactionFormProps) {
  const [type, setType] = useState<TransactionType>("expense");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Rent");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));

  if (!open) return null;

  const expenseCategories = [...DEFAULT_EXPENSE_CATEGORIES, ...customCategories.filter((c) => !DEFAULT_EXPENSE_CATEGORIES.includes(c))];
  const incomeCategories = [...DEFAULT_INCOME_CATEGORIES, ...customCategories.filter((c) => !DEFAULT_INCOME_CATEGORIES.includes(c))];
  const currentCategories = type === "expense" ? expenseCategories : incomeCategories;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = parseFloat(amount);
    if (!amount || isNaN(parsed) || parsed <= 0) return;

    onSubmit({
      id: generateId(),
      type,
      amount: parseFloat(amount),
      category,
      description,
      date,
      created_at: new Date().toISOString(),
    });

    setAmount("");
    setDescription("");
    setCategory(type === "expense" ? "Rent" : "Salary");
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="glass-card rounded-3xl p-8 w-full max-w-md relative z-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display font-semibold text-xl text-white">Add Transaction</h2>
          <button onClick={onClose} className="text-white/30 hover:text-white transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Type toggle */}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => { setType("expense"); setCategory("Rent"); }}
              className={`flex-1 py-2.5 rounded-xl text-sm font-body transition-all duration-200 ${
                type === "expense"
                  ? "glass-card border-red-500/30 text-red-400"
                  : "text-white/30 hover:text-white"
              }`}
            >
              Expense
            </button>
            <button
              type="button"
              onClick={() => { setType("income"); setCategory("Salary"); }}
              className={`flex-1 py-2.5 rounded-xl text-sm font-body transition-all duration-200 ${
                type === "income"
                  ? "glass-card border-green-500/30 text-green-400"
                  : "text-white/30 hover:text-white"
              }`}
            >
              Income
            </button>
          </div>

          {/* Amount */}
          <div>
            <label className="block font-mono text-xs text-white/40 uppercase tracking-widest mb-2">Amount</label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
              className="w-full bg-white/5 border border-white/10 text-white rounded-2xl px-5 py-3 font-mono text-lg placeholder-white/25 focus:outline-none focus:border-blue-500/50 transition-all"
              placeholder="0.00"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block font-mono text-xs text-white/40 uppercase tracking-widest mb-2">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-white/5 border border-white/10 text-white rounded-2xl px-5 py-3 font-body focus:outline-none focus:border-blue-500/50 transition-all appearance-none"
            >
              {currentCategories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Date */}
          <div>
            <label className="block font-mono text-xs text-white/40 uppercase tracking-widest mb-2">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-white/5 border border-white/10 text-white rounded-2xl px-5 py-3 font-body focus:outline-none focus:border-blue-500/50 transition-all"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block font-mono text-xs text-white/40 uppercase tracking-widest mb-2">Notes</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={200}
              className="w-full bg-white/5 border border-white/10 text-white rounded-2xl px-5 py-3 font-body placeholder-white/25 focus:outline-none focus:border-blue-500/50 transition-all"
              placeholder="What was this for?"
            />
          </div>

          <button
            type="submit"
            className="w-full glass-card px-6 py-3 rounded-2xl text-sm font-body font-medium text-white hover:text-blue-300 transition-all duration-300 hover:border-blue-500/30"
          >
            Add {type === "income" ? "income" : "expense"} →
          </button>
        </form>
      </div>
    </div>
  );
}
