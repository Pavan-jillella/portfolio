"use client";
import { useState, useMemo } from "react";
import { Transaction, Budget, Subscription, UserSubscription, MonthlyReport } from "@/types";
import {
  generateMonthlyReport,
  formatCurrency,
  getMonthLabel,
  getMonthlyTransactions,
  getCategoryBreakdown,
  getMonthlyTrend,
} from "@/lib/finance-utils";

interface MonthlyReportEmailProps {
  transactions: Transaction[];
  budgets: Budget[];
  selectedMonth: string;
  payrollIncome?: number;
  partTimeIncome?: number;
  subscriptionExpenses?: number;
  subscriptions?: Subscription[];
  userSubscriptions?: UserSubscription[];
}

export function MonthlyReportEmail({
  transactions,
  budgets,
  selectedMonth,
  payrollIncome = 0,
  partTimeIncome = 0,
  subscriptionExpenses = 0,
  subscriptions = [],
  userSubscriptions = [],
}: MonthlyReportEmailProps) {
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const report: MonthlyReport = generateMonthlyReport(
    transactions,
    budgets,
    selectedMonth,
    payrollIncome + partTimeIncome,
    subscriptionExpenses
  );
  const monthLabel = getMonthLabel(selectedMonth);

  // Compute expanded data for the email
  const expandedData = useMemo(() => {
    // Monthly trend (last 6 months)
    const trend = getMonthlyTrend(transactions, 6);

    // Budget performance
    const monthTx = getMonthlyTransactions(transactions, selectedMonth);
    const catBreakdown = getCategoryBreakdown(monthTx);
    const budgetPerformance = budgets
      .filter((b) => b.month === selectedMonth)
      .map((b) => {
        const spent = catBreakdown.find((c) => c.category === b.category)?.total || 0;
        return {
          category: b.category,
          budget: b.monthly_limit,
          spent,
          status: spent > b.monthly_limit ? "over" : spent > b.monthly_limit * 0.9 ? "warning" : "good",
        };
      });

    // Top transactions (largest 5 expenses this month)
    const topTransactions = monthTx
      .filter((t) => t.type === "expense")
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5)
      .map((t) => ({ date: t.date, description: t.description, amount: t.amount, category: t.category }));

    // Active subscriptions list
    const activeSubs = [
      ...subscriptions.filter((s) => s.active).map((s) => ({ name: s.name, amount: s.amount, frequency: s.frequency })),
      ...userSubscriptions.filter((s) => s.active).map((s) => ({ name: s.service_id, amount: s.price, frequency: s.billing_cycle })),
    ].slice(0, 10);

    // Savings trend from monthly trend
    const savingsTrend = trend.map((t) => ({ month: t.month, savings: t.net }));

    // Month-over-month comparison
    const [y, m] = selectedMonth.split("-").map(Number);
    const lastMonth = new Date(y, m - 2, 1).toISOString().slice(0, 7);
    const lastMonthTx = getMonthlyTransactions(transactions, lastMonth);
    const lastMonthExpenses = lastMonthTx.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0);
    const lastMonthIncome = lastMonthTx.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0);
    const expenseChange = lastMonthExpenses > 0 ? Math.round(((report.expenses - lastMonthExpenses) / lastMonthExpenses) * 100) : 0;
    const incomeChange = lastMonthIncome > 0 ? Math.round(((report.income - lastMonthIncome) / lastMonthIncome) * 100) : 0;

    return {
      monthlyTrend: trend.map((t) => ({ month: t.month, income: t.income, expenses: t.expenses, savings: t.net })),
      budgetPerformance,
      topTransactions,
      subscriptionsList: activeSubs,
      totalSubscriptions: subscriptionExpenses,
      savingsTrend,
      comparison: { expenseChange, incomeChange, lastMonthExpenses, lastMonthIncome },
    };
  }, [transactions, budgets, selectedMonth, subscriptions, userSubscriptions, report.expenses, report.income, subscriptionExpenses]);

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;

    setSending(true);
    setStatus("idle");

    try {
      const res = await fetch("/api/finance/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          reportData: report,
          expandedData,
        }),
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
