"use client";
import { useState, useMemo, useCallback, useEffect } from "react";
import dynamic from "next/dynamic";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useSupabaseRealtimeSync } from "@/hooks/useSupabaseRealtimeSync";
import { Transaction, Budget, SavingsGoal, Investment, NetWorthEntry, Subscription, UserSubscription, PayStub, PartTimeJob, PartTimeHourEntry, PayrollSettings, WorkSchedule, Employer, EnhancedWorkSchedule, EnhancedPayrollSettings, TaxConfig, IncomeGoal } from "@/types";
import {
  getCurrentMonth,
  getMonthlyTransactions,
  getCategoryBreakdown,
  getMonthlyTrend,
  getRecommendations,
  getSavingsTrend,
  calculateNetWorth,
  getSubscriptionAlerts,
  getMonthlySubscriptionTotal,
  getUserSubscriptionMonthlyTotal,
  getPartTimeJobEarnings,
  formatCurrency,
} from "@/lib/finance-utils";
import { DEFAULT_EXPENSE_CATEGORIES, DEFAULT_INCOME_CATEGORIES, DEFAULT_TAX_CONFIG } from "@/lib/constants";
import { MonthPicker } from "./MonthPicker";
import { MonthlySummaryCards } from "./MonthlySummaryCards";
import { TransactionForm } from "./TransactionForm";
import { TransactionTable } from "./TransactionTable";
import { TransactionFilters, FilterState } from "./TransactionFilters";
import { BudgetManager } from "./BudgetManager";
import { SavingsGoals } from "./SavingsGoals";
import { Recommendations } from "./Recommendations";
import { ExcelExport } from "./ExcelExport";
import { CategoryManager } from "./CategoryManager";
import { InvestmentTracker } from "./InvestmentTracker";
import { NetWorthCalculator } from "./NetWorthCalculator";
import { BudgetPlanner } from "./BudgetPlanner";
import { AIAnalysis } from "./AIAnalysis";
import { MonthlyReportEmail } from "./MonthlyReportEmail";
import { CurrencySettings } from "./CurrencySettings";
import { SubscriptionManager } from "./subscriptions/SubscriptionManager";
import { PayrollTracker } from "./PayrollTracker";
import { FadeIn } from "@/components/ui/FadeIn";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";
import { RealtimeStatus } from "@/components/ui/RealtimeStatus";
import { PrivateSection } from "@/components/ui/PrivateSection";

const PieChart = dynamic(() => import("./PieChart").then((m) => m.PieChart), {
  ssr: false,
  loading: () => <div className="glass-card rounded-2xl p-6 h-64 animate-pulse" />,
});

const MonthlyTrend = dynamic(() => import("./MonthlyTrend").then((m) => m.MonthlyTrend), {
  ssr: false,
  loading: () => <div className="glass-card rounded-2xl p-6 h-64 animate-pulse" />,
});

const SavingsTrendChart = dynamic(() => import("./SavingsTrendChart").then((m) => m.SavingsTrendChart), {
  ssr: false,
  loading: () => <div className="glass-card rounded-2xl p-6 h-48 animate-pulse" />,
});

const tabs = [
  { id: "overview", label: "Overview" },
  { id: "transactions", label: "Transactions" },
  { id: "budgets", label: "Budgets" },
  { id: "savings", label: "Savings" },
  { id: "investments", label: "Investments" },
  { id: "networth", label: "Net Worth" },
  { id: "subscriptions", label: "Subscriptions" },
  { id: "payroll", label: "Payroll" },
  { id: "analysis", label: "AI Analysis" },
  { id: "reports", label: "Reports" },
  { id: "categories", label: "Categories" },
];

export function FinanceTrackerClient() {
  // Realtime-synced state
  const [transactions, setTransactions, txConnected] = useSupabaseRealtimeSync<Transaction>("pj-transactions", "transactions", []);
  const [budgets, setBudgets, budgetsConnected] = useSupabaseRealtimeSync<Budget>("pj-budgets", "budgets", []);
  const [savingsGoals, setSavingsGoals, savingsConnected] = useSupabaseRealtimeSync<SavingsGoal>("pj-savings-goals", "savings_goals", []);
  const [customCategories, setCustomCategories] = useLocalStorage<string[]>("pj-custom-categories", []);

  // Realtime-synced finance state
  const [investments, setInvestments, investConnected] = useSupabaseRealtimeSync<Investment>("pj-investments", "investments", []);
  const [netWorthEntries, setNetWorthEntries, nwConnected] = useSupabaseRealtimeSync<NetWorthEntry>("pj-net-worth", "net_worth_entries", []);
  const [subscriptions, setSubscriptions, subsConnected] = useSupabaseRealtimeSync<Subscription>("pj-subscriptions", "subscriptions", []);
  const [userSubscriptions, setUserSubscriptions, userSubsConnected] = useSupabaseRealtimeSync<UserSubscription>("pj-user-subscriptions", "user_subscriptions", []);
  // Realtime-synced payroll data
  const [payStubs, setPayStubs, payStubsConnected] = useSupabaseRealtimeSync<PayStub>("pj-pay-stubs", "pay_stubs", []);
  const [partTimeJobs, setPartTimeJobs, ptJobsConnected] = useSupabaseRealtimeSync<PartTimeJob>("pj-part-time-jobs", "part_time_jobs", []);
  const [partTimeHours, setPartTimeHours] = useSupabaseRealtimeSync<PartTimeHourEntry>("pj-part-time-hours", "part_time_hours", []);
  const [workSchedules, setWorkSchedules] = useSupabaseRealtimeSync<WorkSchedule>("pj-work-schedules", "work_schedules", []);
  const [employers, setEmployers] = useSupabaseRealtimeSync<Employer>("pj-employers", "employers", []);
  const [enhancedSchedules, setEnhancedSchedules] = useSupabaseRealtimeSync<EnhancedWorkSchedule>("pj-enhanced-schedules", "enhanced_work_schedules", []);

  // Settings remain in localStorage (config, not data)
  const [payrollSettings, setPayrollSettings] = useLocalStorage<PayrollSettings>("pj-payroll-settings", {
    pay_frequency: "biweekly",
    google_sheets_url: "",
    default_employer: "",
    schedule_name: "",
    hourly_rate: 0,
  });
  const [enhancedPayrollSettings, setEnhancedPayrollSettings] = useLocalStorage<EnhancedPayrollSettings>("pj-enhanced-payroll-settings", {
    pay_frequency: "biweekly",
    google_sheets_url: "",
    default_employer: "",
    schedule_name: "",
    hourly_rate: 0,
    tax_config: DEFAULT_TAX_CONFIG,
    employers: [],
    income_goals: [],
    auto_send_to_income: false,
    auto_sync_enabled: false,
    auto_sync_interval_minutes: 0,
    last_synced_at: null,
  });
  const [displayCurrency, setDisplayCurrency] = useLocalStorage<string>("pj-display-currency", "USD");

  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth());
  const [activeTab, setActiveTab] = useState("overview");
  const [showAddForm, setShowAddForm] = useState(false);
  const [filters, setFilters] = useState<FilterState>({ type: "all", category: "all", dateFrom: "", dateTo: "" });
  const isRealtimeConnected = txConnected || budgetsConnected || savingsConnected || investConnected || nwConnected || subsConnected || userSubsConnected || payStubsConnected || ptJobsConnected;

  const allCategories = useMemo(() => {
    return Array.from(new Set([...DEFAULT_EXPENSE_CATEGORIES, ...DEFAULT_INCOME_CATEGORIES, ...customCategories]));
  }, [customCategories]);

  const monthlyTx = useMemo(() => getMonthlyTransactions(transactions, selectedMonth), [transactions, selectedMonth]);
  const categoryBreakdown = useMemo(() => getCategoryBreakdown(monthlyTx), [monthlyTx]);
  const trend = useMemo(() => getMonthlyTrend(transactions), [transactions]);
  const savingsTrend = useMemo(() => getSavingsTrend(transactions), [transactions]);
  const recommendations = useMemo(() => getRecommendations(transactions, budgets, selectedMonth), [transactions, budgets, selectedMonth]);
  const { netWorth } = useMemo(() => calculateNetWorth(netWorthEntries), [netWorthEntries]);
  const subscriptionAlerts = useMemo(() => getSubscriptionAlerts(subscriptions), [subscriptions]);
  const monthlySubTotal = useMemo(() => getMonthlySubscriptionTotal(subscriptions), [subscriptions]);
  const userSubMonthlyTotal = useMemo(() => getUserSubscriptionMonthlyTotal(userSubscriptions), [userSubscriptions]);

  const txIncome = monthlyTx.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0);
  const txExpenses = monthlyTx.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0);
  const portfolioValue = investments.reduce((s, i) => s + i.current_value, 0);

  // Payroll income for selected month (net pay from pay stubs)
  const monthlyPayrollIncome = useMemo(() =>
    payStubs
      .filter((s) => s.pay_date.startsWith(selectedMonth))
      .reduce((sum, s) => sum + s.net_pay, 0),
    [payStubs, selectedMonth]
  );

  // Part-time earnings for selected month
  const monthlyPartTimeIncome = useMemo(() =>
    getPartTimeJobEarnings(partTimeJobs, partTimeHours, selectedMonth)
      .reduce((sum, e) => sum + e.earnings, 0),
    [partTimeJobs, partTimeHours, selectedMonth]
  );

  // Combined totals across all sources
  const income = txIncome + monthlyPayrollIncome + monthlyPartTimeIncome;
  const expenses = txExpenses + monthlySubTotal;

  // Enhanced trend: add payroll + part-time income and subscription expenses to each month
  const enhancedTrend = useMemo(() => {
    return trend.map((t) => {
      const payroll = payStubs
        .filter((s) => s.pay_date.startsWith(t.month))
        .reduce((sum, s) => sum + s.net_pay, 0);
      const partTime = getPartTimeJobEarnings(partTimeJobs, partTimeHours, t.month)
        .reduce((sum, e) => sum + e.earnings, 0);
      const totalInc = t.income + payroll + partTime;
      const totalExp = t.expenses + monthlySubTotal;
      return { month: t.month, income: totalInc, expenses: totalExp, net: totalInc - totalExp };
    });
  }, [trend, payStubs, partTimeJobs, partTimeHours, monthlySubTotal]);

  // Apply filters to ALL transactions (not just monthly) for Transactions tab
  const filteredTx = useMemo(() => {
    let result = [...transactions];
    if (filters.type !== "all") {
      result = result.filter((t) => t.type === filters.type);
    }
    if (filters.category !== "all") {
      result = result.filter((t) => t.category === filters.category);
    }
    if (filters.dateFrom) {
      result = result.filter((t) => t.date >= filters.dateFrom);
    }
    if (filters.dateTo) {
      result = result.filter((t) => t.date <= filters.dateTo);
    }
    return result;
  }, [transactions, filters]);

  // Transaction handlers
  function addTransaction(tx: Transaction) {
    setTransactions((prev) => [tx, ...prev]);
  }

  function deleteTransaction(id: string) {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  }

  const editTransaction = useCallback((id: string, updates: Partial<Transaction>) => {
    setTransactions((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updates } : t))
    );
  }, [setTransactions]);

  // Budget handlers
  function addBudget(budget: Budget) {
    setBudgets((prev) => [budget, ...prev]);
  }

  function deleteBudget(id: string) {
    setBudgets((prev) => prev.filter((b) => b.id !== id));
  }

  // Savings handlers
  function addSavingsGoal(goal: SavingsGoal) {
    setSavingsGoals((prev) => [goal, ...prev]);
  }

  function updateSavingsGoal(id: string, amount: number) {
    setSavingsGoals((prev) =>
      prev.map((g) => (g.id === id ? { ...g, current_amount: g.current_amount + amount } : g))
    );
  }

  function deleteSavingsGoal(id: string) {
    setSavingsGoals((prev) => prev.filter((g) => g.id !== id));
  }

  // Category handlers
  function addCustomCategory(cat: string) {
    setCustomCategories((prev) => [...prev, cat]);
  }

  function deleteCustomCategory(cat: string) {
    setCustomCategories((prev) => prev.filter((c) => c !== cat));
  }

  // Investment handlers
  function addInvestment(inv: Investment) {
    setInvestments((prev) => [inv, ...prev]);
  }

  const updateInvestment = useCallback((id: string, updates: Partial<Investment>) => {
    setInvestments((prev) =>
      prev.map((i) => (i.id === id ? { ...i, ...updates } : i))
    );
  }, [setInvestments]);

  function deleteInvestment(id: string) {
    setInvestments((prev) => prev.filter((i) => i.id !== id));
  }

  // Net Worth handlers
  function addNetWorthEntry(entry: NetWorthEntry) {
    setNetWorthEntries((prev) => [entry, ...prev]);
  }

  function deleteNetWorthEntry(id: string) {
    setNetWorthEntries((prev) => prev.filter((e) => e.id !== id));
  }

  // Subscription handlers
  function addSubscription(sub: Subscription) {
    setSubscriptions((prev) => [sub, ...prev]);
  }

  function toggleSubscription(id: string) {
    setSubscriptions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, active: !s.active } : s))
    );
  }

  function deleteSubscription(id: string) {
    setSubscriptions((prev) => prev.filter((s) => s.id !== id));
  }

  // Budget integration: auto-create expense transaction when adding subscription
  function addSubscriptionWithIntegration(sub: Subscription) {
    setSubscriptions((prev) => [sub, ...prev]);
    if (sub.active && sub.amount > 0) {
      const tx: Transaction = {
        id: crypto.randomUUID(),
        type: "expense",
        amount: sub.amount,
        category: sub.category,
        description: `Subscription: ${sub.name}`,
        date: sub.next_billing_date || new Date().toISOString().slice(0, 10),
        created_at: new Date().toISOString(),
      };
      setTransactions((prev) => [tx, ...prev]);
    }
  }

  // User Subscription handlers (normalized architecture)
  function addUserSubscription(sub: UserSubscription, serviceName: string) {
    setUserSubscriptions((prev) => [sub, ...prev]);
    if (sub.active && sub.price > 0) {
      const tx: Transaction = {
        id: crypto.randomUUID(),
        type: "expense",
        amount: sub.price,
        category: "Subscriptions",
        description: `Subscription: ${serviceName}`,
        date: sub.next_billing_date || new Date().toISOString().slice(0, 10),
        created_at: new Date().toISOString(),
      };
      setTransactions((prev) => [tx, ...prev]);
    }
  }

  function toggleUserSubscription(id: string) {
    setUserSubscriptions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, active: !s.active, updated_at: new Date().toISOString() } : s))
    );
  }

  function deleteUserSubscription(id: string) {
    setUserSubscriptions((prev) => prev.filter((s) => s.id !== id));
  }

  // Payroll handlers
  function addPayStub(stub: PayStub) {
    setPayStubs((prev) => [stub, ...prev]);
  }

  function editPayStub(id: string, stub: PayStub) {
    setPayStubs((prev) => prev.map((s) => (s.id === id ? stub : s)));
  }

  function deletePayStub(id: string) {
    setPayStubs((prev) => prev.filter((s) => s.id !== id));
  }

  function importPayStubs(stubs: PayStub[]) {
    setPayStubs((prev) => [...stubs, ...prev]);
  }

  function addPartTimeJob(job: PartTimeJob) {
    setPartTimeJobs((prev) => [job, ...prev]);
  }

  function deletePartTimeJob(id: string) {
    setPartTimeJobs((prev) => prev.filter((j) => j.id !== id));
  }

  function togglePartTimeJob(id: string) {
    setPartTimeJobs((prev) =>
      prev.map((j) => (j.id === id ? { ...j, active: !j.active } : j))
    );
  }

  function addPartTimeHours(entry: PartTimeHourEntry) {
    setPartTimeHours((prev) => [entry, ...prev]);
  }

  function deletePartTimeHours(id: string) {
    setPartTimeHours((prev) => prev.filter((h) => h.id !== id));
  }

  function addWorkSchedule(schedule: WorkSchedule) {
    setWorkSchedules((prev) => [schedule, ...prev]);
  }

  function deleteWorkSchedule(id: string) {
    setWorkSchedules((prev) => prev.filter((s) => s.id !== id));
  }

  // Employer handlers
  function addEmployer(emp: Employer) {
    setEmployers((prev) => [emp, ...prev]);
  }

  function updateEmployer(id: string, updates: Partial<Employer>) {
    setEmployers((prev) =>
      prev.map((e) => (e.id === id ? { ...e, ...updates } : e))
    );
  }

  function deleteEmployer(id: string) {
    setEmployers((prev) => prev.filter((e) => e.id !== id));
  }

  // Enhanced schedule handlers
  function addEnhancedSchedule(schedule: EnhancedWorkSchedule) {
    setEnhancedSchedules((prev) => [schedule, ...prev]);
  }

  function deleteEnhancedSchedule(id: string) {
    setEnhancedSchedules((prev) => prev.filter((s) => s.id !== id));
  }

  // Enhanced payroll settings handlers
  function updateEnhancedPayrollSettings(updates: Partial<EnhancedPayrollSettings>) {
    setEnhancedPayrollSettings((prev) => ({ ...prev, ...updates }));
  }

  // Manual sync: push all current data to Supabase
  const handleManualSync = useCallback(async (): Promise<{ synced: number; failed: string[] }> => {
    const tables: { table: string; data: { id: string }[] }[] = [
      { table: "transactions", data: transactions },
      { table: "budgets", data: budgets },
      { table: "savings_goals", data: savingsGoals },
      { table: "investments", data: investments },
      { table: "net_worth_entries", data: netWorthEntries },
      { table: "subscriptions", data: subscriptions },
      { table: "user_subscriptions", data: userSubscriptions },
      { table: "pay_stubs", data: payStubs },
      { table: "part_time_jobs", data: partTimeJobs },
      { table: "part_time_hours", data: partTimeHours },
      { table: "employers", data: employers },
      { table: "work_schedules", data: workSchedules },
      { table: "enhanced_work_schedules", data: enhancedSchedules },
    ];

    const toSync = tables.filter((t) => t.data.length > 0);
    const failed: string[] = [];

    const results = await Promise.allSettled(
      toSync.map(async (t) => {
        const res = await fetch("/api/sync", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ table: t.table, upsert: t.data }),
        });
        if (!res.ok) {
          const body = await res.json().catch(() => ({ error: res.statusText }));
          const msg = `${t.table}: ${body.error || res.status}`;
          console.error("[Sync]", msg);
          throw new Error(msg);
        }
      })
    );

    results.forEach((r, i) => {
      if (r.status === "rejected") failed.push(toSync[i].table);
    });

    return { synced: toSync.length - failed.length, failed };
  }, [transactions, budgets, savingsGoals, investments, netWorthEntries, subscriptions, userSubscriptions, payStubs, partTimeJobs, partTimeHours, employers, workSchedules, enhancedSchedules]);

  // Budget integration: when adding pay stub with auto_send_to_income
  function addPayStubWithIntegration(stub: PayStub) {
    setPayStubs((prev) => [stub, ...prev]);
    if (enhancedPayrollSettings.auto_send_to_income && stub.net_pay > 0) {
      const tx: Transaction = {
        id: crypto.randomUUID(),
        type: "income",
        amount: stub.net_pay,
        category: "Salary",
        description: `Payroll: ${stub.employer_name} (${stub.pay_period_start} - ${stub.pay_period_end})`,
        date: stub.pay_date || new Date().toISOString().slice(0, 10),
        created_at: new Date().toISOString(),
      };
      setTransactions((prev) => [tx, ...prev]);
    }
  }

  return (
    <PrivateSection sectionKey="financeTracker" label="Finance Tracker">
    <div className="space-y-8">
      {/* Header controls */}
      <FadeIn>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <MonthPicker selectedMonth={selectedMonth} onChange={setSelectedMonth} />
          <div className="flex items-center gap-3">
            <ExcelExport transactions={transactions} />
            <button
              onClick={() => setShowAddForm(true)}
              className="glass-card px-5 py-2 rounded-xl text-sm font-body text-white/60 hover:text-white transition-all hover:border-blue-500/30"
            >
              + Add Transaction
            </button>
          </div>
        </div>
      </FadeIn>

      {/* Tabs */}
      <FadeIn delay={0.05}>
        <div className="flex items-center gap-4">
          <div className="flex flex-wrap gap-2 flex-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-full text-sm font-body transition-all duration-200 ${
                  activeTab === tab.id
                    ? "glass-card text-blue-400"
                    : "text-white/40 hover:text-white"
                }`}
              >
                {tab.label}
                {tab.id === "subscriptions" && subscriptionAlerts.length > 0 && (
                  <span className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full bg-yellow-500/20 text-yellow-400 text-[10px] font-mono">
                    {subscriptionAlerts.length}
                  </span>
                )}
              </button>
            ))}
          </div>
          <RealtimeStatus isConnected={isRealtimeConnected} onSync={handleManualSync} />
        </div>
      </FadeIn>

      {/* Tab content */}
      {activeTab === "overview" && (
        <ErrorBoundary module="Overview">
          <div className="space-y-8">
            <MonthlySummaryCards income={income} expenses={expenses} budgets={budgets} spending={categoryBreakdown} selectedMonth={selectedMonth} />

          {/* Quick stats row */}
          <FadeIn delay={0.05}>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="glass-card rounded-xl p-3 text-center">
                <p className="font-mono text-[10px] text-white/30 uppercase tracking-widest">Net Worth</p>
                <p className={`font-mono text-sm ${netWorth >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                  {formatCurrency(netWorth)}
                </p>
              </div>
              <div className="glass-card rounded-xl p-3 text-center">
                <p className="font-mono text-[10px] text-white/30 uppercase tracking-widest">Portfolio</p>
                <p className="font-mono text-sm text-blue-400">{formatCurrency(portfolioValue)}</p>
              </div>
              <div className="glass-card rounded-xl p-3 text-center">
                <p className="font-mono text-[10px] text-white/30 uppercase tracking-widest">Payroll</p>
                <p className="font-mono text-sm text-emerald-400">{formatCurrency(monthlyPayrollIncome)}</p>
              </div>
              <div className="glass-card rounded-xl p-3 text-center">
                <p className="font-mono text-[10px] text-white/30 uppercase tracking-widest">Part-Time</p>
                <p className="font-mono text-sm text-emerald-400">{formatCurrency(monthlyPartTimeIncome)}</p>
              </div>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <FadeIn delay={0.1}>
              <PieChart data={categoryBreakdown} />
            </FadeIn>
            <FadeIn delay={0.15}>
              <MonthlyTrend trend={enhancedTrend} />
            </FadeIn>
          </div>
          <FadeIn delay={0.2}>
            <SavingsTrendChart data={savingsTrend} />
          </FadeIn>

          {/* Budget snapshot on overview */}
          {(() => {
            const monthBudgets = budgets.filter((b) => b.month === selectedMonth);
            if (monthBudgets.length === 0) return null;
            return (
              <FadeIn delay={0.22}>
                <div className="glass-card rounded-2xl p-5">
                  <h3 className="font-display font-semibold text-sm text-white mb-4">Budget Status</h3>
                  <div className="space-y-3">
                    {monthBudgets.map((budget) => {
                      const spent = categoryBreakdown.find((s) => s.category === budget.category)?.total || 0;
                      const pct = budget.monthly_limit > 0 ? Math.min((spent / budget.monthly_limit) * 100, 100) : 0;
                      const overBudget = spent > budget.monthly_limit;
                      return (
                        <div key={budget.id}>
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-body text-xs text-white/60">{budget.category}</span>
                            <span className={`font-mono text-xs ${overBudget ? "text-red-400" : "text-white/40"}`}>
                              {formatCurrency(spent)} / {formatCurrency(budget.monthly_limit)}
                            </span>
                          </div>
                          <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-500 ${
                                overBudget ? "bg-red-500" : pct >= 80 ? "bg-yellow-500" : "bg-blue-500"
                              }`}
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </FadeIn>
            );
          })()}

          {/* Subscription alerts on overview */}
          {subscriptionAlerts.length > 0 && (
            <FadeIn delay={0.22}>
              <div className="glass-card rounded-2xl p-5 border-yellow-500/20">
                <h3 className="font-display font-semibold text-sm text-yellow-400 mb-3">Upcoming Subscriptions</h3>
                <div className="space-y-2">
                  {subscriptionAlerts.slice(0, 3).map((sub) => (
                    <div key={sub.id} className="flex items-center justify-between">
                      <span className="font-body text-sm text-white">{sub.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs text-white/40">{sub.next_billing_date}</span>
                        <span className="font-mono text-sm text-white/60">{formatCurrency(sub.amount)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </FadeIn>
          )}

          {recommendations.length > 0 && (
            <FadeIn delay={0.25}>
              <h3 className="font-display font-semibold text-lg text-white mb-4">Insights</h3>
              <Recommendations recommendations={recommendations} />
            </FadeIn>
          )}
        </div>
        </ErrorBoundary>
      )}

      {activeTab === "transactions" && (
        <ErrorBoundary module="Transactions">
          <div>
          <TransactionFilters categories={allCategories} onFilterChange={setFilters} />
          <TransactionTable
            transactions={filteredTx}
            onDelete={deleteTransaction}
            onEdit={editTransaction}
            categories={allCategories}
          />
          </div>
        </ErrorBoundary>
      )}

      {activeTab === "budgets" && (
        <ErrorBoundary module="Budgets">
        <div className="space-y-8">
          <BudgetManager
            budgets={budgets}
            spending={categoryBreakdown}
            selectedMonth={selectedMonth}
            onAddBudget={addBudget}
            onDeleteBudget={deleteBudget}
          />
          <FadeIn delay={0.1}>
            <h3 className="font-display font-semibold text-lg text-white mb-4">Budget Planner</h3>
            <BudgetPlanner
              transactions={transactions}
              budgets={budgets}
              selectedMonth={selectedMonth}
            />
          </FadeIn>
        </div>
        </ErrorBoundary>
      )}

      {activeTab === "savings" && (
        <ErrorBoundary module="Savings">
          <SavingsGoals
          goals={savingsGoals}
          onAddGoal={addSavingsGoal}
          onUpdateGoal={updateSavingsGoal}
          onDeleteGoal={deleteSavingsGoal}
        />
        </ErrorBoundary>
      )}

      {activeTab === "investments" && (
        <FadeIn>
          <ErrorBoundary module="Investments">
            <InvestmentTracker
            investments={investments}
            onAdd={addInvestment}
            onUpdate={updateInvestment}
            onDelete={deleteInvestment}
          />
          </ErrorBoundary>
        </FadeIn>
      )}

      {activeTab === "networth" && (
        <FadeIn>
          <ErrorBoundary module="Net Worth">
            <NetWorthCalculator
            entries={netWorthEntries}
            onAdd={addNetWorthEntry}
            onDelete={deleteNetWorthEntry}
          />
          </ErrorBoundary>
        </FadeIn>
      )}

      {activeTab === "subscriptions" && (
        <FadeIn>
          <ErrorBoundary module="Subscriptions">
            <SubscriptionManager
            userSubscriptions={userSubscriptions}
            onAdd={addUserSubscription}
            onToggle={toggleUserSubscription}
            onDelete={deleteUserSubscription}
          />
          </ErrorBoundary>
        </FadeIn>
      )}

      {activeTab === "payroll" && (
        <FadeIn>
          <ErrorBoundary module="Payroll">
            <PayrollTracker
              payStubs={payStubs}
              partTimeJobs={partTimeJobs}
              partTimeHours={partTimeHours}
              workSchedules={workSchedules}
              settings={payrollSettings}
              employers={employers}
              enhancedSchedules={enhancedSchedules}
              enhancedSettings={enhancedPayrollSettings}
              onAddPayStub={addPayStubWithIntegration}
              onEditPayStub={editPayStub}
              onDeletePayStub={deletePayStub}
              onImportPayStubs={importPayStubs}
              onAddJob={addPartTimeJob}
              onDeleteJob={deletePartTimeJob}
              onToggleJob={togglePartTimeJob}
              onAddHours={addPartTimeHours}
              onDeleteHours={deletePartTimeHours}
              onAddSchedule={addWorkSchedule}
              onDeleteSchedule={deleteWorkSchedule}
              onUpdateSettings={setPayrollSettings}
              onAddEmployer={addEmployer}
              onUpdateEmployer={updateEmployer}
              onDeleteEmployer={deleteEmployer}
              onAddEnhancedSchedule={addEnhancedSchedule}
              onDeleteEnhancedSchedule={deleteEnhancedSchedule}
              onUpdateEnhancedSettings={updateEnhancedPayrollSettings}
            />
          </ErrorBoundary>
        </FadeIn>
      )}

      {activeTab === "analysis" && (
        <FadeIn>
          <ErrorBoundary module="AI Analysis">
            <AIAnalysis transactions={transactions} budgets={budgets} userSubscriptions={userSubscriptions} />
          </ErrorBoundary>
        </FadeIn>
      )}

      {activeTab === "reports" && (
        <FadeIn>
          <ErrorBoundary module="Reports">
            <div className="space-y-8">
            <MonthlyReportEmail
              transactions={transactions}
              budgets={budgets}
              selectedMonth={selectedMonth}
            />
            <div className="glass-card rounded-2xl p-5">
              <h4 className="font-display font-semibold text-sm text-white mb-3">Currency Settings</h4>
              <CurrencySettings
                displayCurrency={displayCurrency}
                onCurrencyChange={setDisplayCurrency}
              />
            </div>
            </div>
          </ErrorBoundary>
        </FadeIn>
      )}

      {activeTab === "categories" && (
        <FadeIn>
          <ErrorBoundary module="Categories">
            <CategoryManager
            customCategories={customCategories}
            onAdd={addCustomCategory}
            onDelete={deleteCustomCategory}
          />
          </ErrorBoundary>
        </FadeIn>
      )}

      {/* Transaction form modal */}
      <TransactionForm
        open={showAddForm}
        onClose={() => setShowAddForm(false)}
        onSubmit={addTransaction}
        customCategories={customCategories}
      />
    </div>
    </PrivateSection>
  );
}
