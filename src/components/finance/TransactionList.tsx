"use client";
import { Transaction } from "@/types";
import { formatCurrency } from "@/lib/finance-utils";
import { CATEGORY_TEXT_COLORS } from "@/lib/constants";
import { motion, AnimatePresence } from "framer-motion";

interface TransactionListProps {
  transactions: Transaction[];
  onDelete: (id: string) => void;
}

export function TransactionList({ transactions, onDelete }: TransactionListProps) {
  const sorted = [...transactions].sort((a, b) => b.date.localeCompare(a.date));

  if (sorted.length === 0) {
    return (
      <div className="glass-card rounded-3xl p-10 text-center">
        <p className="font-body text-sm text-white/30">No transactions this month</p>
        <p className="font-body text-xs text-white/15 mt-1">Click &quot;+ Add&quot; to get started</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <AnimatePresence>
        {sorted.map((tx) => (
          <motion.div
            key={tx.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="glass-card rounded-2xl p-4 flex items-center justify-between gap-4 group"
          >
            <div className="flex items-center gap-4 min-w-0">
              <span className="font-mono text-xs text-white/20 shrink-0 w-20">{tx.date}</span>
              <span
                className={`tag-badge px-2 py-0.5 rounded-full border border-white/8 bg-white/4 text-xs shrink-0 ${CATEGORY_TEXT_COLORS[tx.category]}`}
              >
                {tx.category}
              </span>
              <span className="font-body text-sm text-white/50 truncate">{tx.description || "—"}</span>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <span
                className={`font-mono text-sm font-medium ${
                  tx.type === "income" ? "text-green-400" : "text-red-400"
                }`}
              >
                {tx.type === "income" ? "+" : "-"}{formatCurrency(tx.amount)}
              </span>
              <button
                onClick={() => onDelete(tx.id)}
                className="opacity-0 group-hover:opacity-100 text-white/20 hover:text-red-400 transition-all"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
