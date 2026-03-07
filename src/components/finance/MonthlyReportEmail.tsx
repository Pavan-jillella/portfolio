"use client";
import { useState } from "react";
import { Transaction, Budget, MonthlyReport } from "@/types";
import { generateMonthlyReport, formatCurrency, getMonthLabel } from "@/lib/finance-utils";

interface MonthlyReportEmailProps {
  transactions: Transaction[];
  budgets: Budget[];
  selectedMonth: string;
  payrollIncome?: number;
  partTimeIncome?: number;
  subscriptionExpenses?: number;
}

export function MonthlyReportEmail({ transactions, budgets, selectedMonth, payrollIncome = 0, partTimeIncome = 0, subscriptionExpenses = 0 }: MonthlyReportEmailProps) {
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const report: MonthlyReport = generateMonthlyReport(transactions, budgets, selectedMonth, payrollIncome + partTimeIncome, subscriptionExpenses);
  const monthLabel = getMonthLabel(selectedMonth);

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;

    setSending(true);
    setStatus("idle");

    try {
      const res = await fetch("/api/finance/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), reportData: report }),
      });

      const data = await res.json();
      if (res.ok) {
        setStatus("success");
        setMessage(data.message || "Report sent successfully!");
        setEmail("");
      } else {
        setStatus("error");
        setMessage(data.error || "Failed to send report.");
      }
    } catch {
      setStatus("error");
      setMessage("Failed to send report. Please try again.");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Report Preview */}
      <div className="glass-card rounded-2xl p-6">
        <h3 className="font-display font-semibold text-lg text-white mb-1">Monthly Report</h3>
        <p className="font-body text-sm text-white/30 mb-6">{monthLabel}</p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <div className="text-center">
            <p className="font-mono text-xs text-white/40 uppercase mb-1">Income</p>
            <p className="font-mono text-lg text-emerald-400">{formatCurrency(report.income)}</p>
          </div>
          <div className="text-center">
            <p className="font-mono text-xs text-white/40 uppercase mb-1">Expenses</p>
            <p className="font-mono text-lg text-red-400">{formatCurrency(report.expenses)}</p>
          </div>
          <div className="text-center">
            <p className="font-mono text-xs text-white/40 uppercase mb-1">Savings</p>
            <p className={`font-mono text-lg ${report.savings >= 0 ? "text-blue-400" : "text-red-400"}`}>
              {formatCurrency(report.savings)}
            </p>
          </div>
          <div className="text-center">
            <p className="font-mono text-xs text-white/40 uppercase mb-1">Savings Rate</p>
            <p className={`font-mono text-lg ${
              report.savingsRate >= 20 ? "text-emerald-400" : report.savingsRate >= 0 ? "text-yellow-400" : "text-red-400"
            }`}>
              {Math.round(report.savingsRate)}%
            </p>
          </div>
        </div>

        {report.topCategories.length > 0 && (
          <div className="mb-6">
            <h4 className="font-display font-semibold text-sm text-white mb-3">Top Spending</h4>
            <div className="space-y-2">
              {report.topCategories.map((c) => (
                <div key={c.category} className="flex justify-between">
                  <span className="font-body text-xs text-white/40">{c.category}</span>
                  <span className="font-mono text-xs text-white/60">{formatCurrency(c.total)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {report.recommendations.length > 0 && (
          <div>
            <h4 className="font-display font-semibold text-sm text-white mb-3">Insights</h4>
            <ul className="space-y-1">
              {report.recommendations.map((r, i) => (
                <li key={i} className="font-body text-xs text-white/40">• {r}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Email Form */}
      <form onSubmit={handleSend} className="glass-card rounded-2xl p-5">
        <h4 className="font-display font-semibold text-sm text-white mb-3">Send Report via Email</h4>
        <div className="flex gap-3">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            required
            className="flex-1 bg-white/4 border border-white/8 rounded-xl px-4 py-2.5 font-body text-sm text-white placeholder-white/20 focus:outline-none focus:border-blue-500/40 transition-all"
          />
          <button
            type="submit"
            disabled={sending || !email.trim()}
            className="glass-card px-5 py-2.5 rounded-xl text-sm font-body text-white/60 hover:text-white transition-all hover:border-blue-500/30 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            {sending ? "Sending..." : "Send Report"}
          </button>
        </div>
        {status === "success" && (
          <p className="font-body text-xs text-emerald-400 mt-2">{message}</p>
        )}
        {status === "error" && (
          <p className="font-body text-xs text-red-400 mt-2">{message}</p>
        )}
      </form>
    </div>
  );
}
