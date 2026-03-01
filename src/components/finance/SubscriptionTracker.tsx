"use client";
import { useState } from "react";
import { Subscription, SubscriptionFrequency } from "@/types";
import { SUBSCRIPTION_FREQUENCIES, DEFAULT_EXPENSE_CATEGORIES } from "@/lib/constants";
import { generateId, formatCurrency, getMonthlySubscriptionTotal } from "@/lib/finance-utils";
import { ViewToggle, ViewMode } from "@/components/ui/ViewToggle";
import { motion, AnimatePresence } from "framer-motion";

interface SubscriptionTrackerProps {
  subscriptions: Subscription[];
  onAdd: (sub: Subscription) => void;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export function SubscriptionTracker({ subscriptions, onAdd, onToggle, onDelete }: SubscriptionTrackerProps) {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [frequency, setFrequency] = useState<SubscriptionFrequency>("monthly");
  const [category, setCategory] = useState(DEFAULT_EXPENSE_CATEGORIES[4]); // Subscriptions
  const [nextDate, setNextDate] = useState("");
  const [reminderDays, setReminderDays] = useState("3");
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "inactive">("all");
  const [filterFrequency, setFilterFrequency] = useState("all");

  const monthlyTotal = getMonthlySubscriptionTotal(subscriptions);
  const yearlyTotal = monthlyTotal * 12;

  const frequencyOptions = Array.from(new Set(subscriptions.map((s) => s.frequency))).sort();

  const filteredSubs = subscriptions.filter((s) => {
    if (filterStatus === "active" && !s.active) return false;
    if (filterStatus === "inactive" && s.active) return false;
    if (filterFrequency !== "all" && s.frequency !== filterFrequency) return false;
    return true;
  });

  const now = new Date();
  const upcoming = subscriptions
    .filter((s) => s.active)
    .filter((s) => {
      const billing = new Date(s.next_billing_date);
      const diffDays = Math.ceil((billing.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      return diffDays >= 0 && diffDays <= 30;
    })
    .sort((a, b) => a.next_billing_date.localeCompare(b.next_billing_date));

  const alerts = subscriptions
    .filter((s) => s.active)
    .filter((s) => {
      const billing = new Date(s.next_billing_date);
      const diffDays = Math.ceil((billing.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      return diffDays >= 0 && diffDays <= s.reminder_days;
    });

  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !amount || !nextDate) return;
    onAdd({
      id: generateId(),
      name: name.trim(),
      amount: parseFloat(amount),
      currency: "USD",
      frequency,
      category,
      next_billing_date: nextDate,
      reminder_days: parseInt(reminderDays) || 3,
      active: true,
      created_at: new Date().toISOString(),
    });
    setName("");
    setAmount("");
    setNextDate("");
  }

  function getDaysUntil(dateStr: string): number {
    return Math.ceil((new Date(dateStr).getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  }

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-card rounded-2xl p-4 text-center">
          <p className="font-mono text-xs text-white/40 uppercase tracking-widest mb-1">Monthly Cost</p>
          <p className="font-mono text-xl text-white">{formatCurrency(monthlyTotal)}</p>
        </div>
        <div className="glass-card rounded-2xl p-4 text-center">
          <p className="font-mono text-xs text-white/40 uppercase tracking-widest mb-1">Yearly Cost</p>
          <p className="font-mono text-xl text-white/60">{formatCurrency(yearlyTotal)}</p>
        </div>
        <div className="glass-card rounded-2xl p-4 text-center">
          <p className="font-mono text-xs text-white/40 uppercase tracking-widest mb-1">Active</p>
          <p className="font-mono text-xl text-blue-400">{subscriptions.filter((s) => s.active).length}</p>
        </div>
      </div>

      {/* Alerts */}
      {alerts.length > 0 && (
        <div className="glass-card rounded-2xl p-5 border-yellow-500/20">
          <h4 className="font-display font-semibold text-sm text-yellow-400 mb-3">
            Upcoming Renewals
          </h4>
          <div className="space-y-2">
            {alerts.map((sub) => {
              const days = getDaysUntil(sub.next_billing_date);
              return (
                <div key={sub.id} className="flex items-center justify-between">
                  <span className="font-body text-sm text-white">{sub.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm text-white/60">{formatCurrency(sub.amount)}</span>
                    <span className={`font-mono text-xs px-2 py-0.5 rounded-full ${
                      days <= 1 ? "bg-red-500/20 text-red-400" :
                      days <= 3 ? "bg-yellow-500/20 text-yellow-400" :
                      "bg-blue-500/20 text-blue-400"
                    }`}>
                      {days === 0 ? "Today" : days === 1 ? "Tomorrow" : `${days}d`}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Upcoming Renewals Calendar */}
      {upcoming.length > 0 && (
        <div className="glass-card rounded-2xl p-5">
          <h4 className="font-display font-semibold text-sm text-white mb-3">Next 30 Days</h4>
          <div className="space-y-2">
            {upcoming.map((sub) => {
              const days = getDaysUntil(sub.next_billing_date);
              return (
                <div key={sub.id} className="flex items-center gap-3">
                  <span className="font-mono text-xs text-white/30 w-20">{sub.next_billing_date}</span>
                  <span className="font-body text-sm text-white flex-1">{sub.name}</span>
                  <span className="font-mono text-xs text-white/40 capitalize">{sub.frequency}</span>
                  <span className="font-mono text-sm text-white/60">{formatCurrency(sub.amount)}</span>
                  <span className="font-mono text-xs text-white/20">{days}d</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Subscription List */}
      {subscriptions.length === 0 ? (
        <div className="glass-card rounded-2xl p-8 text-center">
          <p className="font-body text-sm text-white/30">No subscriptions tracked yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {/* Header with view toggle */}
          <div className="flex items-center justify-between">
            <h3 className="font-display font-semibold text-lg text-white">
              Subscriptions
              <span className="ml-2 font-mono text-xs text-white/30">({filteredSubs.length})</span>
            </h3>
            <ViewToggle viewMode={viewMode} onChange={setViewMode} />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-2">
            {(["all", "active", "inactive"] as const).map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-3 py-1.5 rounded-full border font-mono text-xs transition-all capitalize ${
                  filterStatus === status
                    ? "border-blue-500/30 bg-blue-500/[0.12] text-blue-400"
                    : "border-white/8 bg-white/4 text-white/40 hover:border-white/15"
                }`}
              >
                {status}
              </button>
            ))}
            {frequencyOptions.length > 1 && (
              <>
                <span className="text-white/10">|</span>
                <button
                  onClick={() => setFilterFrequency("all")}
                  className={`px-3 py-1.5 rounded-full border font-mono text-xs transition-all ${
                    filterFrequency === "all"
                      ? "border-blue-500/30 bg-blue-500/[0.12] text-blue-400"
                      : "border-white/8 bg-white/4 text-white/40 hover:border-white/15"
                  }`}
                >
                  All freq
                </button>
                {frequencyOptions.map((freq) => (
                  <button
                    key={freq}
                    onClick={() => setFilterFrequency(freq)}
                    className={`px-3 py-1.5 rounded-full border font-mono text-xs transition-all capitalize ${
                      filterFrequency === freq
                        ? "border-blue-500/30 bg-blue-500/[0.12] text-blue-400"
                        : "border-white/8 bg-white/4 text-white/40 hover:border-white/15"
                    }`}
                  >
                    {freq}
                  </button>
                ))}
              </>
            )}
          </div>

          {/* List View */}
          {viewMode === "list" && (
            <AnimatePresence>
              {filteredSubs.map((sub, i) => (
                <motion.div
                  key={sub.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ delay: i * 0.03 }}
                  className={`glass-card rounded-2xl p-4 group ${!sub.active ? "opacity-50" : ""}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => onToggle(sub.id)}
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                          sub.active ? "border-emerald-500 bg-emerald-500/20" : "border-white/20"
                        }`}
                      >
                        {sub.active && (
                          <svg className="w-3 h-3 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </button>
                      <div>
                        <p className="font-body text-sm text-white">{sub.name}</p>
                        <p className="font-body text-xs text-white/30">
                          {sub.category} • {sub.frequency} • Next: {sub.next_billing_date}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-sm text-white">{formatCurrency(sub.amount)}</span>
                      <button
                        onClick={() => onDelete(sub.id)}
                        className="opacity-0 group-hover:opacity-100 text-white/20 hover:text-red-400 transition-all"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}

          {/* Grid View */}
          {viewMode === "grid" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredSubs.map((sub, i) => (
                <motion.div
                  key={sub.id}
                  className={`glass-card rounded-2xl p-5 flex flex-col justify-between group ${!sub.active ? "opacity-50" : ""}`}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03, duration: 0.3 }}
                >
                  <div>
                    <div className="flex items-start justify-between mb-3">
                      <span className="font-body text-sm text-white font-medium">{sub.name}</span>
                      <button
                        onClick={() => onToggle(sub.id)}
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all shrink-0 ${
                          sub.active ? "border-emerald-500 bg-emerald-500/20" : "border-white/20"
                        }`}
                      >
                        {sub.active && (
                          <svg className="w-3 h-3 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </button>
                    </div>
                    <p className="font-mono text-xl text-white mb-2">{formatCurrency(sub.amount)}</p>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-body text-xs text-white/30 capitalize">{sub.frequency}</span>
                      <span className="text-white/10">|</span>
                      <span className="font-body text-xs text-white/30">{sub.category}</span>
                    </div>
                    <p className="font-mono text-[10px] text-white/20 mt-2">Next: {sub.next_billing_date}</p>
                  </div>
                  <div className="flex items-center pt-3 border-t border-white/5 mt-3">
                    <button
                      onClick={() => onDelete(sub.id)}
                      className="px-2 py-1 rounded-lg text-[10px] font-body text-white/30 hover:text-red-400 hover:bg-white/5 transition-all ml-auto opacity-0 group-hover:opacity-100"
                    >
                      Delete
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Table View */}
          {viewMode === "table" && (
            <div className="glass-card rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-white/5">
                      <th className="px-4 py-3 font-mono text-[10px] text-white/30 uppercase tracking-wider">Status</th>
                      <th className="px-4 py-3 font-mono text-[10px] text-white/30 uppercase tracking-wider">Name</th>
                      <th className="px-4 py-3 font-mono text-[10px] text-white/30 uppercase tracking-wider text-right">Amount</th>
                      <th className="px-4 py-3 font-mono text-[10px] text-white/30 uppercase tracking-wider">Frequency</th>
                      <th className="px-4 py-3 font-mono text-[10px] text-white/30 uppercase tracking-wider">Category</th>
                      <th className="px-4 py-3 font-mono text-[10px] text-white/30 uppercase tracking-wider">Next Billing</th>
                      <th className="px-4 py-3 font-mono text-[10px] text-white/30 uppercase tracking-wider text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredSubs.map((sub) => (
                      <tr key={sub.id} className={`border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors ${!sub.active ? "opacity-50" : ""}`}>
                        <td className="px-4 py-2.5">
                          <button
                            onClick={() => onToggle(sub.id)}
                            className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${
                              sub.active ? "border-emerald-500 bg-emerald-500/20" : "border-white/20"
                            }`}
                          >
                            {sub.active && (
                              <svg className="w-2.5 h-2.5 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            )}
                          </button>
                        </td>
                        <td className="px-4 py-2.5">
                          <span className="font-body text-xs text-white/70">{sub.name}</span>
                        </td>
                        <td className="px-4 py-2.5 text-right">
                          <span className="font-mono text-xs text-white">{formatCurrency(sub.amount)}</span>
                        </td>
                        <td className="px-4 py-2.5">
                          <span className="font-body text-xs text-white/40 capitalize">{sub.frequency}</span>
                        </td>
                        <td className="px-4 py-2.5">
                          <span className="font-body text-xs text-white/40">{sub.category}</span>
                        </td>
                        <td className="px-4 py-2.5">
                          <span className="font-mono text-xs text-white/40">{sub.next_billing_date}</span>
                        </td>
                        <td className="px-4 py-2.5 text-right">
                          <button
                            onClick={() => onDelete(sub.id)}
                            className="px-1.5 py-0.5 rounded text-[10px] font-mono text-white/25 hover:text-red-400 transition-colors"
                          >
                            Del
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Add Subscription Form */}
      <form onSubmit={handleAdd} className="glass-card rounded-2xl p-5 space-y-4">
        <h4 className="font-display font-semibold text-sm text-white">Add Subscription</h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block font-mono text-xs text-white/40 uppercase tracking-widest mb-1">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Netflix"
              className="w-full bg-white/4 border border-white/8 rounded-xl px-4 py-2.5 font-body text-sm text-white placeholder-white/20 focus:outline-none focus:border-blue-500/40 transition-all"
            />
          </div>
          <div>
            <label className="block font-mono text-xs text-white/40 uppercase tracking-widest mb-1">Amount</label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="15.99"
              className="w-full bg-white/4 border border-white/8 rounded-xl px-4 py-2.5 font-mono text-sm text-white placeholder-white/20 focus:outline-none focus:border-blue-500/40 transition-all"
            />
          </div>
          <div>
            <label className="block font-mono text-xs text-white/40 uppercase tracking-widest mb-1">Frequency</label>
            <select
              value={frequency}
              onChange={(e) => setFrequency(e.target.value as SubscriptionFrequency)}
              className="w-full bg-white/4 border border-white/8 rounded-xl px-4 py-2.5 font-body text-sm text-white focus:outline-none focus:border-blue-500/40 transition-all appearance-none"
            >
              {SUBSCRIPTION_FREQUENCIES.map((f) => (
                <option key={f.value} value={f.value} className="bg-[#0a0c12]">{f.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block font-mono text-xs text-white/40 uppercase tracking-widest mb-1">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-white/4 border border-white/8 rounded-xl px-4 py-2.5 font-body text-sm text-white focus:outline-none focus:border-blue-500/40 transition-all appearance-none"
            >
              {DEFAULT_EXPENSE_CATEGORIES.map((c) => (
                <option key={c} value={c} className="bg-[#0a0c12]">{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block font-mono text-xs text-white/40 uppercase tracking-widest mb-1">Next Billing</label>
            <input
              type="date"
              value={nextDate}
              onChange={(e) => setNextDate(e.target.value)}
              className="w-full bg-white/4 border border-white/8 rounded-xl px-4 py-2.5 font-body text-sm text-white focus:outline-none focus:border-blue-500/40 transition-all"
            />
          </div>
          <div>
            <label className="block font-mono text-xs text-white/40 uppercase tracking-widest mb-1">Remind (days before)</label>
            <input
              type="number"
              min="0"
              max="30"
              value={reminderDays}
              onChange={(e) => setReminderDays(e.target.value)}
              className="w-full bg-white/4 border border-white/8 rounded-xl px-4 py-2.5 font-mono text-sm text-white placeholder-white/20 focus:outline-none focus:border-blue-500/40 transition-all"
            />
          </div>
        </div>
        <button
          type="submit"
          disabled={!name.trim() || !amount || !nextDate}
          className="glass-card px-5 py-2.5 rounded-xl text-sm font-body text-white/60 hover:text-white transition-all hover:border-blue-500/30 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          + Add Subscription
        </button>
      </form>
    </div>
  );
}
