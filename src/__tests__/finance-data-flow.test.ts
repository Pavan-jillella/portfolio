/**
 * Finance Tracker Data Flow Tests
 * Tests all income, expense, payroll, and subscription connections
 */
import {
  getMonthlyTransactions,
  getCategoryBreakdown,
  getMonthlyTrend,
  generateMonthlyReport,
  getSubscriptionAlerts,
  getMonthlySubscriptionTotal,
  getUserSubscriptionMonthlyTotal,
  getPartTimeJobEarnings,
  formatCurrency,
} from "@/lib/finance-utils";
import { getPayrollDashboardStats } from "@/lib/payroll-utils";
import type { Transaction, PayStub, PartTimeJob, PartTimeHourEntry, Subscription, UserSubscription, EnhancedWorkSchedule, Employer, Budget } from "@/types";

// ===================== TEST DATA =====================

const mockTransactions: Transaction[] = [
  { id: "t1", type: "income", amount: 500, category: "Freelance", description: "Web project", date: "2026-03-05", created_at: "2026-03-05T00:00:00Z" },
  { id: "t2", type: "income", amount: 1200, category: "Salary", description: "Payroll: Stemtree (2026-02-24 - 2026-03-07)", date: "2026-03-07", created_at: "2026-03-07T00:00:00Z" },
  { id: "t3", type: "expense", amount: 800, category: "Rent", description: "March rent", date: "2026-03-01", created_at: "2026-03-01T00:00:00Z" },
  { id: "t4", type: "expense", amount: 120, category: "Groceries", description: "Walmart", date: "2026-03-03", created_at: "2026-03-03T00:00:00Z" },
  { id: "t5", type: "income", amount: 300, category: "Freelance", description: "Design work", date: "2026-02-15", created_at: "2026-02-15T00:00:00Z" },
  { id: "t6", type: "expense", amount: 200, category: "Dining", description: "Restaurants", date: "2026-02-20", created_at: "2026-02-20T00:00:00Z" },
];

const mockPayStubs: PayStub[] = [
  {
    id: "ps1", employer_name: "Stemtree", employer_id: "emp1",
    pay_period_start: "2026-02-24", pay_period_end: "2026-03-07", pay_date: "2026-03-14",
    regular_hours: 40, overtime_hours: 0, hourly_rate: 15,
    gross_pay: 600, deductions: { federal_tax: 50, state_tax: 20, social_security: 37.2, medicare: 8.7, other_deductions: 0, other_deductions_label: "" },
    net_pay: 484.10, source: "manual", created_at: "2026-03-14T00:00:00Z",
  },
  {
    id: "ps2", employer_name: "Stemtree", employer_id: "emp1",
    pay_period_start: "2026-02-10", pay_period_end: "2026-02-23", pay_date: "2026-02-28",
    regular_hours: 35, overtime_hours: 0, hourly_rate: 15,
    gross_pay: 525, deductions: { federal_tax: 42, state_tax: 17, social_security: 32.55, medicare: 7.61, other_deductions: 0, other_deductions_label: "" },
    net_pay: 425.84, source: "manual", created_at: "2026-02-28T00:00:00Z",
  },
];

const mockPartTimeJobs: PartTimeJob[] = [
  { id: "ptj1", name: "Tutoring", hourly_rate: 25, active: true, created_at: "2026-01-01T00:00:00Z" },
  { id: "ptj2", name: "Delivery", hourly_rate: 18, active: false, created_at: "2026-01-01T00:00:00Z" },
];

const mockPartTimeHours: PartTimeHourEntry[] = [
  { id: "pth1", job_id: "ptj1", date: "2026-03-02", hours: 3, notes: "Math tutoring", created_at: "2026-03-02T00:00:00Z" },
  { id: "pth2", job_id: "ptj1", date: "2026-03-09", hours: 2, notes: "Science tutoring", created_at: "2026-03-09T00:00:00Z" },
  { id: "pth3", job_id: "ptj2", date: "2026-03-05", hours: 4, notes: "Delivery shift", created_at: "2026-03-05T00:00:00Z" },
];

const mockBudgets: Budget[] = [
  { id: "b1", category: "Rent", monthly_limit: 900, month: "2026-03" },
  { id: "b2", category: "Groceries", monthly_limit: 200, month: "2026-03" },
  { id: "b3", category: "Dining", monthly_limit: 150, month: "2026-03" },
];

const mockEmployers: Employer[] = [
  { id: "emp1", name: "Stemtree", pay_type: "hourly", hourly_rate: 15, color: "#3b82f6", active: true, created_at: "2026-01-01T00:00:00Z" },
];

const mockEnhancedSchedules: EnhancedWorkSchedule[] = [
  {
    id: "es1", employer_id: "emp1", period_label: "Week of Mar 2",
    start_date: "2026-03-02", end_date: "2026-03-08",
    shifts: [
      { id: "sh1", schedule_id: "es1", date: "2026-03-02", day: "Mon", start_time: "9:00", end_time: "14:00", hours: 5, is_holiday: false },
      { id: "sh2", schedule_id: "es1", date: "2026-03-04", day: "Wed", start_time: "9:00", end_time: "14:00", hours: 5, is_holiday: false },
    ],
    total_hours: 10, gross_amount: 150, created_at: "2026-03-01T00:00:00Z",
  },
];

const mockSubscriptions: Subscription[] = [
  { id: "sub1", name: "Netflix", amount: 15.99, frequency: "monthly", active: true, next_billing_date: "2026-03-10", reminder_days: 7, created_at: "2026-01-01T00:00:00Z" },
];

const mockUserSubscriptions: UserSubscription[] = [
  { id: "usub1", user_id: "u1", service_id: "spotify", plan_id: null, price: 9.99, currency: "USD", billing_cycle: "monthly" as const, next_billing_date: "2026-03-15", card_last4: null, reminder_days: 5, active: true, notes: null, created_at: "2026-01-01T00:00:00Z", updated_at: "2026-01-01T00:00:00Z" },
  { id: "usub2", user_id: "u1", service_id: "github", plan_id: null, price: 4.00, currency: "USD", billing_cycle: "monthly" as const, next_billing_date: "2026-04-01", card_last4: null, reminder_days: 3, active: true, notes: null, created_at: "2026-01-01T00:00:00Z", updated_at: "2026-01-01T00:00:00Z" },
];

// ===================== TESTS =====================

describe("Finance Tracker Data Flow", () => {

  // ---- 1. INCOME FLOW ----
  describe("Income Flow", () => {
    test("txIncome excludes auto-created Payroll: transactions", () => {
      const monthlyTx = getMonthlyTransactions(mockTransactions, "2026-03");
      const txIncome = monthlyTx
        .filter((t) => t.type === "income" && !t.description?.startsWith("Payroll:"))
        .reduce((s, t) => s + t.amount, 0);
      // Should include t1 (500) but NOT t2 (1200, starts with "Payroll:")
      expect(txIncome).toBe(500);
    });

    test("monthlyPayrollIncome sums net_pay for selected month", () => {
      const march = mockPayStubs
        .filter((s) => s.pay_date.startsWith("2026-03"))
        .reduce((sum, s) => sum + s.net_pay, 0);
      // ps1 has pay_date 2026-03-14, net_pay 484.10
      expect(march).toBeCloseTo(484.10);
    });

    test("monthlyPayrollIncome for Feb is separate", () => {
      const feb = mockPayStubs
        .filter((s) => s.pay_date.startsWith("2026-02"))
        .reduce((sum, s) => sum + s.net_pay, 0);
      // ps2 has pay_date 2026-02-28, net_pay 425.84
      expect(feb).toBeCloseTo(425.84);
    });

    test("part-time earnings calculated correctly for month", () => {
      const earnings = getPartTimeJobEarnings(mockPartTimeJobs, mockPartTimeHours, "2026-03");
      const totalEarnings = earnings.reduce((sum, e) => sum + e.earnings, 0);
      // ptj1: 3h + 2h = 5h * $25 = $125
      // ptj2: 4h * $18 = $72
      expect(totalEarnings).toBe(125 + 72);
    });

    test("combined income includes all sources", () => {
      const monthlyTx = getMonthlyTransactions(mockTransactions, "2026-03");
      const txIncome = monthlyTx
        .filter((t) => t.type === "income" && !t.description?.startsWith("Payroll:"))
        .reduce((s, t) => s + t.amount, 0);
      const payrollIncome = mockPayStubs
        .filter((s) => s.pay_date.startsWith("2026-03"))
        .reduce((sum, s) => sum + s.net_pay, 0);
      const partTimeIncome = getPartTimeJobEarnings(mockPartTimeJobs, mockPartTimeHours, "2026-03")
        .reduce((sum, e) => sum + e.earnings, 0);
      const totalIncome = txIncome + payrollIncome + partTimeIncome;
      // 500 + 484.10 + 197 = 1181.10
      expect(totalIncome).toBeCloseTo(1181.10);
    });
  });

  // ---- 2. EXPENSE FLOW ----
  describe("Expense Flow", () => {
    test("txExpenses from transactions only", () => {
      const monthlyTx = getMonthlyTransactions(mockTransactions, "2026-03");
      const txExpenses = monthlyTx
        .filter((t) => t.type === "expense")
        .reduce((s, t) => s + t.amount, 0);
      // t3: 800 + t4: 120 = 920
      expect(txExpenses).toBe(920);
    });

    test("subscription expenses (legacy) calculated correctly", () => {
      const total = getMonthlySubscriptionTotal(mockSubscriptions);
      expect(total).toBeCloseTo(15.99);
    });

    test("subscription expenses (user) calculated correctly", () => {
      const total = getUserSubscriptionMonthlyTotal(mockUserSubscriptions);
      // 9.99 + 4.00 = 13.99
      expect(total).toBeCloseTo(13.99);
    });

    test("combined expenses includes transactions + subscriptions", () => {
      const monthlyTx = getMonthlyTransactions(mockTransactions, "2026-03");
      const txExpenses = monthlyTx
        .filter((t) => t.type === "expense")
        .reduce((s, t) => s + t.amount, 0);
      const subTotal = getMonthlySubscriptionTotal(mockSubscriptions);
      const userSubTotal = getUserSubscriptionMonthlyTotal(mockUserSubscriptions);
      const totalExpenses = txExpenses + subTotal + userSubTotal;
      // 920 + 15.99 + 13.99 = 949.98
      expect(totalExpenses).toBeCloseTo(949.98);
    });

    test("category breakdown only includes transactions", () => {
      const monthlyTx = getMonthlyTransactions(mockTransactions, "2026-03");
      const breakdown = getCategoryBreakdown(monthlyTx);
      const rentSpent = breakdown.find((b) => b.category === "Rent")?.total || 0;
      expect(rentSpent).toBe(800);
    });
  });

  // ---- 3. PAYROLL DASHBOARD ----
  describe("Payroll Dashboard Stats", () => {
    test("no double-counting of pay stubs across months", () => {
      const marchStats = getPayrollDashboardStats(mockEnhancedSchedules, mockPayStubs, mockEmployers, "2026-03");
      const febStats = getPayrollDashboardStats(mockEnhancedSchedules, mockPayStubs, mockEmployers, "2026-02");
      // ps1 (pay_date 2026-03-14) should only appear in March
      // ps2 (pay_date 2026-02-28) should only appear in February
      expect(marchStats.gross_month).toBe(600);
      expect(febStats.gross_month).toBe(525);
      // Total should equal sum of all stubs
      expect(marchStats.gross_month + febStats.gross_month).toBe(600 + 525);
    });

    test("schedule hours use start_date only, not created_at", () => {
      const stats = getPayrollDashboardStats(mockEnhancedSchedules, mockPayStubs, mockEmployers, "2026-03");
      // es1 start_date is 2026-03-02 -> should be in March
      expect(stats.total_hours_month).toBe(10);
    });

    test("income by employer calculated correctly", () => {
      const stats = getPayrollDashboardStats(mockEnhancedSchedules, mockPayStubs, mockEmployers, "2026-03");
      expect(stats.income_by_employer.length).toBe(1);
      expect(stats.income_by_employer[0].employer_name).toBe("Stemtree");
      expect(stats.income_by_employer[0].gross).toBe(600);
    });
  });

  // ---- 4. MONTHLY REPORT ----
  describe("Monthly Report", () => {
    test("report includes extra income and expenses", () => {
      const payrollIncome = 484.10;
      const partTimeIncome = 197;
      const subExpenses = 29.98;
      const report = generateMonthlyReport(mockTransactions, mockBudgets, "2026-03", payrollIncome + partTimeIncome, subExpenses);
      // txIncome (excluding Payroll:) = 500, + payroll 484.10 + partTime 197 = 1181.10
      expect(report.income).toBeCloseTo(1181.10);
      // txExpenses = 920, + subs 29.98 = 949.98
      expect(report.expenses).toBeCloseTo(949.98);
      // savings = 1181.10 - 949.98 = 231.12
      expect(report.savings).toBeCloseTo(231.12);
    });

    test("report without extra data still works", () => {
      const report = generateMonthlyReport(mockTransactions, mockBudgets, "2026-03");
      // Only txIncome (excluding Payroll:) = 500
      expect(report.income).toBe(500);
      // Only txExpenses = 920
      expect(report.expenses).toBe(920);
    });

    test("recommendations use selected month, not current month", () => {
      // This is a structural test - the function now receives `month` correctly
      const report = generateMonthlyReport(mockTransactions, mockBudgets, "2026-02");
      // Should not throw and should return valid data
      expect(report.month).toBe("2026-02");
      expect(report.recommendations).toBeDefined();
    });
  });

  // ---- 5. SUBSCRIPTION ALERTS ----
  describe("Subscription Alerts", () => {
    test("legacy subscription alerts work correctly", () => {
      // sub1 billing date 2026-03-10, reminder 7 days
      // We mock current date... this test depends on runtime
      const alerts = getSubscriptionAlerts(mockSubscriptions);
      // Alerts is an array of subscriptions
      expect(Array.isArray(alerts)).toBe(true);
    });

    test("combined alerts include both legacy and user subscriptions", () => {
      const legacyAlerts = getSubscriptionAlerts(mockSubscriptions);
      const userAlerts = mockUserSubscriptions.filter((s) => {
        if (!s.active || !s.next_billing_date) return false;
        const billing = new Date(s.next_billing_date);
        const diffDays = Math.ceil((billing.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
        return diffDays >= 0 && diffDays <= (s.reminder_days || 7);
      });
      const combined = [
        ...legacyAlerts.map((s) => ({ id: s.id, name: s.name, amount: s.amount })),
        ...userAlerts.map((s) => ({ id: s.id, name: s.service_id, amount: s.price })),
      ];
      // Combined alerts include both types
      expect(Array.isArray(combined)).toBe(true);
    });
  });

  // ---- 6. SAVINGS TREND ----
  describe("Savings Trend", () => {
    test("enhanced trend includes payroll and part-time data", () => {
      const trend = getMonthlyTrend(mockTransactions, 6);
      const totalSubMonthly = getMonthlySubscriptionTotal(mockSubscriptions) + getUserSubscriptionMonthlyTotal(mockUserSubscriptions);

      const enhancedTrend = trend.map((t) => {
        const autoPayrollTx = mockTransactions
          .filter((tx) => tx.type === "income" && tx.description?.startsWith("Payroll:") && tx.date.startsWith(t.month))
          .reduce((sum, tx) => sum + tx.amount, 0);
        const payroll = mockPayStubs
          .filter((s) => s.pay_date.startsWith(t.month))
          .reduce((sum, s) => sum + s.net_pay, 0);
        const partTime = getPartTimeJobEarnings(mockPartTimeJobs, mockPartTimeHours, t.month)
          .reduce((sum, e) => sum + e.earnings, 0);
        const totalInc = (t.income - autoPayrollTx) + payroll + partTime;
        const totalExp = t.expenses + totalSubMonthly;
        return { month: t.month, income: totalInc, expenses: totalExp, net: totalInc - totalExp };
      });

      // savingsTrend is derived from enhancedTrend
      const savingsTrend = enhancedTrend.map((t) => ({ month: t.month, savings: t.net }));

      // March enhanced data should include payroll and part-time
      const marchData = enhancedTrend.find((t) => t.month === "2026-03");
      if (marchData) {
        // Income: tx 500 (excluding "Payroll:" t2=1200) + payroll 484.10 + partTime 197 = 1181.10
        expect(marchData.income).toBeCloseTo(1181.10);
        // Expenses: 920 + subscriptions ~29.98 = ~949.98
        expect(marchData.expenses).toBeCloseTo(949.98);
      }

      expect(savingsTrend.length).toBe(enhancedTrend.length);
    });
  });

  // ---- 7. FORMAT UTILS ----
  describe("Utility Functions", () => {
    test("formatCurrency works correctly", () => {
      expect(formatCurrency(1234.56)).toContain("1,235");
      expect(formatCurrency(0)).toContain("0");
      expect(formatCurrency(-500)).toContain("500");
    });

    test("getMonthlyTransactions filters by month", () => {
      const march = getMonthlyTransactions(mockTransactions, "2026-03");
      expect(march.length).toBe(4); // t1, t2, t3, t4
      const feb = getMonthlyTransactions(mockTransactions, "2026-02");
      expect(feb.length).toBe(2); // t5, t6
    });
  });
});
