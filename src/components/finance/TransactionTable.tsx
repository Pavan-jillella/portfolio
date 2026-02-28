"use client";
import { useState } from "react";
import { Transaction } from "@/types";
import { CATEGORY_COLORS, CATEGORY_TEXT_COLORS } from "@/lib/constants";
import { formatCurrency } from "@/lib/finance-utils";
import { motion, AnimatePresence } from "framer-motion";

interface TransactionTableProps {
  transactions: Transaction[];
  onDelete: (id: string) => void;
  onEdit: (id: string, updates: Partial<Transaction>) => void;
  categories: string[];
}

type SortKey = "date" | "type" | "category" | "amount" | "description";
type SortDir = "asc" | "desc";

export function TransactionTable({ transactions, onDelete, onEdit, categories }: TransactionTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>("date");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<Transaction>>({});

  function handleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDir(key === "date" ? "desc" : "asc");
    }
  }

  const sorted = [...transactions].sort((a, b) => {
    const dir = sortDir === "asc" ? 1 : -1;
    if (sortKey === "amount") return (a.amount - b.amount) * dir;
    if (sortKey === "date") return a.date.localeCompare(b.date) * dir;
    if (sortKey === "type") return a.type.localeCompare(b.type) * dir;
    if (sortKey === "category") return a.category.localeCompare(b.category) * dir;
    return (a.description || "").localeCompare(b.description || "") * dir;
  });

  function startEdit(tx: Transaction) {
    setEditingId(tx.id);
    setEditData({ amount: tx.amount, category: tx.category, description: tx.description, date: tx.date, type: tx.type });
  }

  function saveEdit() {
    if (editingId && editData) {
      onEdit(editingId, editData);
      setEditingId(null);
      setEditData({});
    }
  }

  function cancelEdit() {
    setEditingId(null);
    setEditData({});
  }

  const sortIcon = (key: SortKey) => {
    if (sortKey !== key) return "  ";
    return sortDir === "asc" ? " ↑" : " ↓";
  };

  if (transactions.length === 0) {
    return (
      <div className="glass-card rounded-2xl p-8 text-center">
        <p className="font-body text-sm text-white/20">No transactions match these filters</p>
      </div>
    );
  }

  return (
    <div className="glass-card rounded-2xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/8">
              {([
                { key: "date" as SortKey, label: "Date" },
                { key: "type" as SortKey, label: "Type" },
                { key: "category" as SortKey, label: "Category" },
                { key: "amount" as SortKey, label: "Amount" },
                { key: "description" as SortKey, label: "Notes" },
              ]).map(({ key, label }) => (
                <th
                  key={key}
                  onClick={() => handleSort(key)}
                  className="px-4 py-3 text-left font-mono text-xs text-white/40 uppercase tracking-widest cursor-pointer hover:text-white/60 transition-colors select-none"
                >
                  {label}{sortIcon(key)}
                </th>
              ))}
              <th className="px-4 py-3 text-right font-mono text-xs text-white/40 uppercase tracking-widest">Actions</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {sorted.map((tx) => {
                const isEditing = editingId === tx.id;
                return (
                  <motion.tr
                    key={tx.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="border-b border-white/4 hover:bg-white/2 transition-colors group"
                  >
                    <td className="px-4 py-3">
                      {isEditing ? (
                        <input
                          type="date"
                          value={editData.date || ""}
                          onChange={(e) => setEditData({ ...editData, date: e.target.value })}
                          className="bg-white/4 border border-white/8 rounded-lg px-2 py-1 text-xs font-body text-white focus:outline-none focus:border-blue-500/40 w-full"
                        />
                      ) : (
                        <span className="font-mono text-xs text-white/40">{tx.date}</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {isEditing ? (
                        <select
                          value={editData.type || "expense"}
                          onChange={(e) => setEditData({ ...editData, type: e.target.value as "income" | "expense" })}
                          className="bg-white/4 border border-white/8 rounded-lg px-2 py-1 text-xs font-body text-white focus:outline-none focus:border-blue-500/40"
                        >
                          <option value="expense" className="bg-[#0a0c12]">Expense</option>
                          <option value="income" className="bg-[#0a0c12]">Income</option>
                        </select>
                      ) : (
                        <span className={`text-xs font-body ${tx.type === "income" ? "text-emerald-400" : "text-red-400"}`}>
                          {tx.type === "income" ? "Income" : "Expense"}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {isEditing ? (
                        <select
                          value={editData.category || ""}
                          onChange={(e) => setEditData({ ...editData, category: e.target.value })}
                          className="bg-white/4 border border-white/8 rounded-lg px-2 py-1 text-xs font-body text-white focus:outline-none focus:border-blue-500/40"
                        >
                          {categories.map((c) => (
                            <option key={c} value={c} className="bg-[#0a0c12]">{c}</option>
                          ))}
                        </select>
                      ) : (
                        <span className={`inline-flex items-center gap-1.5`}>
                          <span className={`w-2 h-2 rounded-full ${CATEGORY_COLORS[tx.category] || "bg-gray-500"}`} />
                          <span className={`text-xs font-body ${CATEGORY_TEXT_COLORS[tx.category] || "text-gray-400"}`}>
                            {tx.category}
                          </span>
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {isEditing ? (
                        <input
                          type="number"
                          step="0.01"
                          min="0.01"
                          value={editData.amount || ""}
                          onChange={(e) => setEditData({ ...editData, amount: parseFloat(e.target.value) || 0 })}
                          className="bg-white/4 border border-white/8 rounded-lg px-2 py-1 text-xs font-mono text-white focus:outline-none focus:border-blue-500/40 w-24"
                        />
                      ) : (
                        <span className={`font-mono text-sm ${tx.type === "income" ? "text-emerald-400" : "text-red-400"}`}>
                          {tx.type === "income" ? "+" : "-"}{formatCurrency(tx.amount)}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {isEditing ? (
                        <input
                          type="text"
                          value={editData.description || ""}
                          onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                          className="bg-white/4 border border-white/8 rounded-lg px-2 py-1 text-xs font-body text-white focus:outline-none focus:border-blue-500/40 w-full"
                          maxLength={200}
                        />
                      ) : (
                        <span className="font-body text-xs text-white/40 truncate max-w-[200px] block">
                          {tx.description || "—"}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {isEditing ? (
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={saveEdit}
                            className="text-xs font-body text-emerald-400 hover:text-emerald-300 transition-colors"
                          >
                            Save
                          </button>
                          <button
                            onClick={cancelEdit}
                            className="text-xs font-body text-white/30 hover:text-white transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => startEdit(tx)}
                            className="text-xs font-body text-white/30 hover:text-blue-400 transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => onDelete(tx.id)}
                            className="text-xs font-body text-white/30 hover:text-red-400 transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </td>
                  </motion.tr>
                );
              })}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
    </div>
  );
}
