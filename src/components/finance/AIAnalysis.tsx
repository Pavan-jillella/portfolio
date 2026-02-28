"use client";
import { useState } from "react";
import { Transaction, Budget, MonthlySpending } from "@/types";
import { formatCurrency, getCategoryBreakdown, getMonthlyTrend } from "@/lib/finance-utils";

interface AIAnalysisProps {
  transactions: Transaction[];
  budgets: Budget[];
}

export function AIAnalysis({ transactions, budgets }: AIAnalysisProps) {
  const [analysis, setAnalysis] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function analyzeSpending() {
    setLoading(true);
    setError("");
    setAnalysis("");

    // Build a summary of spending data
    const trend = getMonthlyTrend(transactions, 6);
    const latestMonth = trend[trend.length - 1];
    const breakdown = getCategoryBreakdown(transactions.filter((t) => t.date.startsWith(latestMonth?.month || "")));

    const summaryLines = [
      `Total transactions: ${transactions.length}`,
      "",
      "Last 6 months trend:",
      ...trend.map((t) =>
        `${t.month}: Income ${formatCurrency(t.income)}, Expenses ${formatCurrency(t.expenses)}, Net ${formatCurrency(t.net)}`
      ),
      "",
      "Current month category breakdown:",
      ...breakdown.map((b: MonthlySpending) => `${b.category}: ${formatCurrency(b.total)}`),
      "",
      `Active budgets: ${budgets.length}`,
      ...budgets.map((b) => `${b.category}: ${formatCurrency(b.monthly_limit)} limit (${b.month})`),
    ];

    const prompt = `Analyze this personal finance data and provide actionable insights. Focus on: spending patterns, savings opportunities, budget adherence, and any anomalies. Be specific and use the numbers provided.

${summaryLines.join("\n")}

Provide your analysis in these sections:
1. Spending Patterns - what trends do you see?
2. Savings Opportunities - where can they save?
3. Budget Health - are they within budget targets?
4. Predictions & Tips - what should they watch for next month?`;

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [{ role: "user", content: prompt }],
        }),
      });

      if (!res.ok) {
        if (res.status === 503) {
          setError("AI analysis requires an OpenAI API key. Add OPENAI_API_KEY to your .env.local file.");
        } else {
          setError("Failed to get analysis. Please try again.");
        }
        return;
      }

      const data = await res.json();
      setAnalysis(data.message?.content || "No analysis available.");
    } catch {
      setError("Failed to connect to AI service.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="glass-card rounded-2xl p-6 text-center">
        <h3 className="font-display font-semibold text-lg text-white mb-2">AI Spending Analysis</h3>
        <p className="font-body text-sm text-white/30 mb-6">
          Get AI-powered insights about your spending patterns, savings opportunities, and budget health.
        </p>
        <button
          onClick={analyzeSpending}
          disabled={loading || transactions.length === 0}
          className="glass-card px-6 py-3 rounded-xl text-sm font-body text-blue-400 hover:text-white transition-all hover:border-blue-500/30 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Analyzing...
            </span>
          ) : (
            "Analyze My Spending"
          )}
        </button>
        {transactions.length === 0 && (
          <p className="font-body text-xs text-white/20 mt-2">Add some transactions first</p>
        )}
      </div>

      {error && (
        <div className="glass-card rounded-2xl p-5 border-red-500/20">
          <p className="font-body text-sm text-red-400">{error}</p>
        </div>
      )}

      {analysis && (
        <div className="glass-card rounded-2xl p-6">
          <h4 className="font-display font-semibold text-sm text-white mb-4">Analysis Results</h4>
          <div className="font-body text-sm text-white/60 whitespace-pre-wrap leading-relaxed">
            {analysis}
          </div>
        </div>
      )}
    </div>
  );
}
