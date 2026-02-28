import {
  Transaction,
  MonthlySpending,
  MonthlySummary,
  SpendingRecommendation,
  Budget,
  MonthlyReport,
  Subscription,
  NetWorthEntry,
} from "@/types";
import { SUPPORTED_CURRENCIES } from "@/lib/constants";

export function generateId(): string {
  return crypto.randomUUID();
}

export function getCurrentMonth(): string {
  return new Date().toISOString().slice(0, 7);
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function getMonthLabel(month: string): string {
  const [year, m] = month.split("-");
  const date = new Date(parseInt(year), parseInt(m) - 1);
  return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

export function getMonthlyTransactions(transactions: Transaction[], month: string): Transaction[] {
  return transactions.filter((t) => t.date.startsWith(month));
}

export function getCategoryBreakdown(transactions: Transaction[]): MonthlySpending[] {
  const map = new Map<string, number>();
  transactions
    .filter((t) => t.type === "expense")
    .forEach((t) => {
      map.set(t.category, (map.get(t.category) || 0) + t.amount);
    });
  return Array.from(map.entries())
    .map(([category, total]) => ({ category, total }))
    .sort((a, b) => b.total - a.total);
}

export function getMonthlyTrend(transactions: Transaction[], months: number = 6): MonthlySummary[] {
  const now = new Date();
  const summaries: MonthlySummary[] = [];
  for (let i = months - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const month = d.toISOString().slice(0, 7);
    const monthTx = getMonthlyTransactions(transactions, month);
    const income = monthTx.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0);
    const expenses = monthTx.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0);
    summaries.push({ month, income, expenses, net: income - expenses });
  }
  return summaries;
}

export function getRecommendations(
  transactions: Transaction[],
  budgets: Budget[]
): SpendingRecommendation[] {
  const recommendations: SpendingRecommendation[] = [];
  const currentMonth = getCurrentMonth();
  const lastMonth = new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1)
    .toISOString()
    .slice(0, 7);

  const currentSpending = getCategoryBreakdown(getMonthlyTransactions(transactions, currentMonth));
  const lastSpending = getCategoryBreakdown(getMonthlyTransactions(transactions, lastMonth));

  currentSpending.forEach((current) => {
    const last = lastSpending.find((l) => l.category === current.category);
    if (last && last.total > 0) {
      const percentChange = ((current.total - last.total) / last.total) * 100;
      if (percentChange > 20) {
        recommendations.push({
          category: current.category,
          message: `You spent ${Math.round(percentChange)}% more on ${current.category} this month compared to last month.`,
          severity: percentChange > 50 ? "danger" : "warning",
        });
      }
    }
  });

  budgets.forEach((budget) => {
    if (budget.month !== currentMonth) return;
    const spent = currentSpending.find((s) => s.category === budget.category);
    if (spent) {
      const pct = (spent.total / budget.monthly_limit) * 100;
      if (pct >= 100) {
        recommendations.push({
          category: budget.category,
          message: `Over budget on ${budget.category}: spent ${formatCurrency(spent.total)} of ${formatCurrency(budget.monthly_limit)} limit.`,
          severity: "danger",
        });
      } else if (pct >= 80) {
        recommendations.push({
          category: budget.category,
          message: `Approaching ${budget.category} budget: ${Math.round(pct)}% used.`,
          severity: "warning",
        });
      }
    }
  });

  return recommendations;
}

export function exportTransactionsCSV(transactions: Transaction[]): string {
  const headers = ["Date", "Type", "Category", "Amount", "Description"];
  const rows = transactions
    .sort((a, b) => b.date.localeCompare(a.date))
    .map((t) => [t.date, t.type, t.category, t.amount.toString(), `"${t.description}"`]);
  return [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
}

export function getSavingsTrend(transactions: Transaction[], months: number = 6): { month: string; savings: number }[] {
  const trend = getMonthlyTrend(transactions, months);
  return trend.map((t) => ({ month: t.month, savings: t.net }));
}

// ===== Currency Utils =====

export function formatCurrencyWithCode(amount: number, code: string): string {
  const currency = SUPPORTED_CURRENCIES.find((c) => c.code === code);
  const symbol = currency?.symbol || code;
  const formatted = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Math.abs(amount));
  return `${amount < 0 ? "-" : ""}${symbol}${formatted}`;
}

export function convertCurrency(
  amount: number,
  from: string,
  to: string,
  rates: Record<string, number>
): number {
  if (from === to) return amount;
  const fromRate = from === "USD" ? 1 : rates[from];
  const toRate = to === "USD" ? 1 : rates[to];
  if (!fromRate || !toRate) return amount;
  return (amount / fromRate) * toRate;
}

// ===== Net Worth Utils =====

export function calculateNetWorth(entries: NetWorthEntry[]): { assets: number; liabilities: number; netWorth: number } {
  const assets = entries.filter((e) => e.type === "asset").reduce((s, e) => s + e.value, 0);
  const liabilities = entries.filter((e) => e.type === "liability").reduce((s, e) => s + e.value, 0);
  return { assets, liabilities, netWorth: assets - liabilities };
}

// ===== Monthly Report Utils =====

export function generateMonthlyReport(
  transactions: Transaction[],
  budgets: Budget[],
  month: string
): MonthlyReport {
  const monthTx = getMonthlyTransactions(transactions, month);
  const income = monthTx.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0);
  const expenses = monthTx.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0);
  const savings = income - expenses;
  const savingsRate = income > 0 ? (savings / income) * 100 : 0;
  const breakdown = getCategoryBreakdown(monthTx);
  const topCategories = breakdown.slice(0, 5);

  const recs: string[] = [];
  const currentRecs = getRecommendations(transactions, budgets);
  currentRecs.forEach((r) => recs.push(r.message));

  if (savingsRate < 20 && income > 0) {
    recs.push(`Your savings rate is ${Math.round(savingsRate)}%. Aim for at least 20%.`);
  }

  return { month, income, expenses, savings, savingsRate, topCategories, recommendations: recs };
}

// ===== Subscription Utils =====

export function getSubscriptionAlerts(subscriptions: Subscription[]): Subscription[] {
  const now = new Date();
  return subscriptions
    .filter((s) => s.active)
    .filter((s) => {
      const billing = new Date(s.next_billing_date);
      const diffDays = Math.ceil((billing.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      return diffDays >= 0 && diffDays <= s.reminder_days;
    })
    .sort((a, b) => a.next_billing_date.localeCompare(b.next_billing_date));
}

export function getMonthlySubscriptionTotal(subscriptions: Subscription[]): number {
  return subscriptions
    .filter((s) => s.active)
    .reduce((total, s) => {
      if (s.frequency === "monthly") return total + s.amount;
      if (s.frequency === "yearly") return total + s.amount / 12;
      if (s.frequency === "weekly") return total + s.amount * 4.33;
      return total;
    }, 0);
}
