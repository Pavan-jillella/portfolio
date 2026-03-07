import {
  Transaction,
  MonthlySpending,
  MonthlySummary,
  SpendingRecommendation,
  Budget,
  MonthlyReport,
  Subscription,
  NetWorthEntry,
  PayStub,
  PartTimeJob,
  PartTimeHourEntry,
  ScheduleShift,
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
  budgets: Budget[],
  selectedMonth?: string
): SpendingRecommendation[] {
  const recommendations: SpendingRecommendation[] = [];
  const month = selectedMonth || getCurrentMonth();
  const [y, m] = month.split("-").map(Number);
  const lastMonth = new Date(y, m - 2, 1).toISOString().slice(0, 7);

  const currentSpending = getCategoryBreakdown(getMonthlyTransactions(transactions, month));
  const lastSpending = getCategoryBreakdown(getMonthlyTransactions(transactions, lastMonth));

  currentSpending.forEach((current) => {
    const last = lastSpending.find((l) => l.category === current.category);
    if (last && last.total > 0) {
      const percentChange = ((current.total - last.total) / last.total) * 100;
      if (percentChange > 20) {
        recommendations.push({
          category: current.category,
          message: `You spent ${Math.round(percentChange)}% more on ${current.category} compared to the previous month.`,
          severity: percentChange > 50 ? "danger" : "warning",
        });
      }
    }
  });

  budgets.forEach((budget) => {
    if (budget.month !== month) return;
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
  month: string,
  extraIncome: number = 0,
  extraExpenses: number = 0
): MonthlyReport {
  const monthTx = getMonthlyTransactions(transactions, month);
  const txIncome = monthTx.filter((t) => t.type === "income" && !t.description?.startsWith("Payroll:")).reduce((s, t) => s + t.amount, 0);
  const txExpenses = monthTx.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0);
  const income = txIncome + extraIncome;
  const expenses = txExpenses + extraExpenses;
  const savings = income - expenses;
  const savingsRate = income > 0 ? (savings / income) * 100 : 0;
  const breakdown = getCategoryBreakdown(monthTx);
  const topCategories = breakdown.slice(0, 5);

  const recs: string[] = [];
  const currentRecs = getRecommendations(transactions, budgets, month);
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

// New: Works with UserSubscription[] (normalized architecture)
export function getUserSubscriptionAlerts(subscriptions: { next_billing_date: string; reminder_days: number; active: boolean }[]): typeof subscriptions {
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

export function getUserSubscriptionMonthlyTotal(subscriptions: { price: number; billing_cycle: string; active: boolean }[]): number {
  return subscriptions
    .filter((s) => s.active)
    .reduce((total, s) => {
      if (s.billing_cycle === "monthly") return total + s.price;
      if (s.billing_cycle === "yearly") return total + s.price / 12;
      if (s.billing_cycle === "weekly") return total + s.price * 4.33;
      return total;
    }, 0);
}

// ===== Payroll Utils =====

export function getPayrollSummary(payStubs: PayStub[], year?: number | "all") {
  const filterYear = year ?? new Date().getFullYear();
  const ytdStubs = filterYear === "all"
    ? payStubs
    : payStubs.filter((s) => s.pay_date >= `${filterYear}-01-01` && s.pay_date <= `${filterYear}-12-31`);

  const totalGross = ytdStubs.reduce((s, p) => s + p.gross_pay, 0);
  const totalNet = ytdStubs.reduce((s, p) => s + p.net_pay, 0);
  const totalFederalTax = ytdStubs.reduce((s, p) => s + p.deductions.federal_tax, 0);
  const totalStateTax = ytdStubs.reduce((s, p) => s + p.deductions.state_tax, 0);
  const totalSocialSecurity = ytdStubs.reduce((s, p) => s + p.deductions.social_security, 0);
  const totalMedicare = ytdStubs.reduce((s, p) => s + p.deductions.medicare, 0);
  const totalOther = ytdStubs.reduce((s, p) => s + p.deductions.other_deductions, 0);
  const totalTax = totalFederalTax + totalStateTax + totalSocialSecurity + totalMedicare + totalOther;
  const avgNetPerPeriod = ytdStubs.length > 0 ? totalNet / ytdStubs.length : 0;

  return {
    totalGross,
    totalNet,
    totalTax,
    totalFederalTax,
    totalStateTax,
    totalSocialSecurity,
    totalMedicare,
    totalOther,
    avgNetPerPeriod,
    periodCount: ytdStubs.length,
  };
}

export function getPartTimeJobEarnings(
  jobs: PartTimeJob[],
  hours: PartTimeHourEntry[],
  month?: string
) {
  const filtered = month ? hours.filter((h) => h.date.startsWith(month)) : hours;
  return jobs.map((job) => {
    const jobHours = filtered.filter((h) => h.job_id === job.id);
    const totalHours = jobHours.reduce((s, h) => s + h.hours, 0);
    return {
      job,
      totalHours,
      earnings: totalHours * job.hourly_rate,
      entries: jobHours,
    };
  });
}

export function parseGoogleSheetsCSV(csvText: string): Partial<PayStub>[] {
  const lines = csvText.trim().split("\n");
  if (lines.length < 2) return [];

  const headers = lines[0].split(",").map((h) => h.trim().toLowerCase().replace(/\s+/g, "_"));
  const results: Partial<PayStub>[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    if (values.length < 2) continue;

    const row: Record<string, string> = {};
    headers.forEach((h, idx) => {
      row[h] = (values[idx] || "").trim();
    });

    const stub: Partial<PayStub> = {
      pay_period_start: row["pay_period_start"] || "",
      pay_period_end: row["pay_period_end"] || "",
      pay_date: row["pay_date"] || "",
      gross_pay: parseFloat(row["gross_pay"]) || 0,
      net_pay: parseFloat(row["net_pay"]) || 0,
      regular_hours: parseFloat(row["regular_hours"]) || 0,
      overtime_hours: parseFloat(row["overtime_hours"]) || 0,
      hourly_rate: parseFloat(row["hourly_rate"]) || 0,
      deductions: {
        federal_tax: parseFloat(row["federal_tax"]) || 0,
        state_tax: parseFloat(row["state_tax"]) || 0,
        social_security: parseFloat(row["social_security"]) || 0,
        medicare: parseFloat(row["medicare"]) || 0,
        other_deductions: parseFloat(row["other_deductions"]) || 0,
        other_deductions_label: row["other_deductions_label"] || "",
      },
      source: "google-sheets" as const,
    };
    results.push(stub);
  }
  return results;
}

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (inQuotes) {
      if (char === '"' && line[i + 1] === '"') {
        current += '"';
        i++;
      } else if (char === '"') {
        inQuotes = false;
      } else {
        current += char;
      }
    } else {
      if (char === '"') {
        inQuotes = true;
      } else if (char === ",") {
        result.push(current);
        current = "";
      } else {
        current += char;
      }
    }
  }
  result.push(current);
  return result;
}

// ===== Schedule Import Utils =====

const DAY_LABELS = ["M", "T", "W", "Th", "F", "Sat", "Sun"];
const DAY_NAMES = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export function calculateShiftHours(timeRange: string): { start: string; end: string; hours: number } {
  const trimmed = timeRange.trim();
  if (!trimmed || trimmed === " ") return { start: "", end: "", hours: 0 };

  // Support both "10-4" and "10 - 4" and "10AM - 4PM" formats
  const parts = trimmed.split(/\s*-\s*/).map((p) => p.trim());
  if (parts.length !== 2) return { start: "", end: "", hours: 0 };

  const [startStr, endStr] = parts;
  const startMinutes = parseTimeToMinutes(startStr);
  const endMinutes = parseTimeToMinutes(endStr);
  if (startMinutes < 0 || endMinutes < 0) return { start: startStr, end: endStr, hours: 0 };

  // Handle overnight shifts or PM assumption
  let adjustedEnd = endMinutes;
  if (adjustedEnd <= startMinutes) {
    adjustedEnd += 12 * 60;
  }

  const hours = parseFloat(((adjustedEnd - startMinutes) / 60).toFixed(2));
  return { start: startStr, end: endStr, hours: Math.max(hours, 0) };
}

export function parseTimeToMinutes(time: string): number {
  const trimmed = time.trim().toUpperCase();

  // "10:00", "4:30"
  const match24 = trimmed.match(/^(\d{1,2}):(\d{2})$/);
  if (match24) {
    return parseInt(match24[1]) * 60 + parseInt(match24[2]);
  }

  // "10AM", "4PM", "10 AM", "4 PM"
  const matchSimple = trimmed.match(/^(\d{1,2})\s*(AM|PM)$/);
  if (matchSimple) {
    let h = parseInt(matchSimple[1]);
    const period = matchSimple[2];
    if (period === "PM" && h !== 12) h += 12;
    if (period === "AM" && h === 12) h = 0;
    return h * 60;
  }

  // "10:30AM", "4:30PM", "10:30 AM", "4:30 PM"
  const matchFull = trimmed.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/);
  if (matchFull) {
    let h = parseInt(matchFull[1]);
    const m = parseInt(matchFull[2]);
    const period = matchFull[3];
    if (period === "PM" && h !== 12) h += 12;
    if (period === "AM" && h === 12) h = 0;
    return h * 60 + m;
  }

  // Plain number "10", "4"
  const matchPlain = trimmed.match(/^(\d{1,2})$/);
  if (matchPlain) {
    return parseInt(matchPlain[1]) * 60;
  }

  return -1;
}

export function parseScheduleSheet(csvText: string, name: string): ScheduleShift[] {
  const lines = csvText.trim().split("\n");
  if (lines.length < 2) return [];

  // Find the header row with day columns (M, T, W, Th, F, Sat, Sun)
  let headerRowIdx = -1;
  let dayColumns: number[] = [];

  for (let i = 0; i < Math.min(lines.length, 5); i++) {
    const cells = parseCSVLine(lines[i]).map((c) => c.trim());
    // Check if this row contains day headers
    const mIdx = cells.findIndex((c) => c === "M");
    if (mIdx >= 0) {
      headerRowIdx = i;
      // Map each day label to its column index
      dayColumns = DAY_LABELS.map((label) => {
        const idx = cells.findIndex((c) => c === label);
        return idx;
      });
      break;
    }
  }

  if (headerRowIdx < 0) return [];

  // Find the row matching the given name (case-insensitive partial match)
  const nameLower = name.toLowerCase();
  for (let i = headerRowIdx + 1; i < lines.length; i++) {
    const cells = parseCSVLine(lines[i]).map((c) => c.trim());
    if (cells.length === 0) continue;
    const rowName = cells[0].toLowerCase();
    if (rowName.includes(nameLower) || nameLower.includes(rowName)) {
      // Extract shifts
      const shifts: ScheduleShift[] = [];
      for (let d = 0; d < DAY_LABELS.length; d++) {
        const colIdx = dayColumns[d];
        const cellValue = colIdx >= 0 && colIdx < cells.length ? cells[colIdx] : "";
        const { start, end, hours } = calculateShiftHours(cellValue);
        shifts.push({
          day: DAY_NAMES[d],
          start_time: start,
          end_time: end,
          hours,
        });
      }
      return shifts;
    }
  }

  return [];
}
