"use client";
import { useState } from "react";
import { Subscription, SubscriptionFrequency } from "@/types";
import { SUBSCRIPTION_FREQUENCIES, DEFAULT_EXPENSE_CATEGORIES } from "@/lib/constants";
import { generateId, formatCurrency, getMonthlySubscriptionTotal } from "@/lib/finance-utils";
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

  const monthlyTotal = getMonthlySubscriptionTotal(subscriptions);
  const yearlyTotal = monthlyTotal * 12;

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
          <AnimatePresence>
            {subscriptions.map((sub, i) => (
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
