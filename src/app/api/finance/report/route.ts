import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import nodemailer from "nodemailer";
import * as Sentry from "@sentry/nextjs";

const reportSchema = z.object({
  email: z.string().email(),
  reportData: z.object({
    month: z.string(),
    income: z.number(),
    expenses: z.number(),
    savings: z.number(),
    savingsRate: z.number(),
    topCategories: z.array(z.object({ category: z.string(), total: z.number() })),
    recommendations: z.array(z.string()),
  }),
  expandedData: z.object({
    monthlyTrend: z.array(z.object({ month: z.string(), income: z.number(), expenses: z.number(), savings: z.number() })),
    budgetPerformance: z.array(z.object({ category: z.string(), budget: z.number(), spent: z.number(), status: z.string() })),
    topTransactions: z.array(z.object({ date: z.string(), description: z.string(), amount: z.number(), category: z.string() })),
    subscriptionsList: z.array(z.object({ name: z.string(), amount: z.number(), frequency: z.string() })),
    totalSubscriptions: z.number(),
    savingsTrend: z.array(z.object({ month: z.string(), savings: z.number() })),
    comparison: z.object({ expenseChange: z.number(), incomeChange: z.number(), lastMonthExpenses: z.number(), lastMonthIncome: z.number() }),
  }).optional(),
});

function fmt(amount: number): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount);
}

function getMonthLabel(month: string): string {
  const [year, m] = month.split("-");
  const date = new Date(parseInt(year), parseInt(m) - 1);
  return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

function shortMonth(month: string): string {
  const [, m] = month.split("-");
  const names = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return names[parseInt(m) - 1] || month;
}

function esc(str: string): string {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

// Glassy card wrapper
const glass = `background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:16px;`;
const glassInner = `background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.04);border-radius:12px;`;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = reportSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: "Invalid report data" }, { status: 400 });
    }

    const { email, reportData, expandedData } = result.data;
    const monthLabel = getMonthLabel(reportData.month);
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;

    if (!smtpUser || !smtpPass) {
      const missing = [!smtpUser && "SMTP_USER", !smtpPass && "SMTP_PASS"].filter(Boolean).join(", ");
      console.error(`SMTP not configured. Missing: ${missing}`);
      return NextResponse.json({ error: `Email service not configured. Missing: ${missing}` }, { status: 503 });
    }

    // Derived values
    const total = reportData.income + reportData.expenses;
    const incPct = total > 0 ? Math.round((reportData.income / total) * 100) : 50;
    const expPct = 100 - incPct;
    const savRate = Math.round(reportData.savingsRate);
    const savClamped = Math.max(0, Math.min(100, savRate));
    const savColor = savRate >= 20 ? "#34d399" : savRate >= 0 ? "#fbbf24" : "#f87171";
    const catMax = Math.max(...reportData.topCategories.map((c) => c.total), 1);
    const catColors = ["#60a5fa", "#a78bfa", "#f472b6", "#fb923c", "#34d399", "#facc15", "#38bdf8", "#e879f9"];
    const expTotalForPie = reportData.topCategories.reduce((s, c) => s + c.total, 0) || 1;

    // ========== Build sections ==========

    // --- 1. Financial Summary Table ---
    const summarySection = `
    <tr><td style="padding:0 28px;">
      <table cellpadding="0" cellspacing="0" border="0" width="100%" style="${glass}">
        <tr><td style="padding:24px 24px 8px;">
          <p style="margin:0;font-size:11px;font-weight:600;color:rgba(255,255,255,0.4);text-transform:uppercase;letter-spacing:1.5px;">&#128202; Financial Snapshot</p>
        </td></tr>
        <tr><td style="padding:8px 24px 20px;">
          <table cellpadding="0" cellspacing="0" border="0" width="100%">
            <tr style="border-bottom:1px solid rgba(255,255,255,0.05);">
              <td style="padding:12px 0;color:rgba(255,255,255,0.4);font-size:13px;">Total Income</td>
              <td style="padding:12px 0;text-align:right;font-size:15px;font-weight:700;color:#34d399;">${fmt(reportData.income)}</td>
            </tr>
            <tr style="border-bottom:1px solid rgba(255,255,255,0.05);">
              <td style="padding:12px 0;color:rgba(255,255,255,0.4);font-size:13px;">Total Expenses</td>
              <td style="padding:12px 0;text-align:right;font-size:15px;font-weight:700;color:#f87171;">${fmt(reportData.expenses)}</td>
            </tr>
            <tr style="border-bottom:1px solid rgba(255,255,255,0.05);">
              <td style="padding:12px 0;color:rgba(255,255,255,0.4);font-size:13px;">Net Savings</td>
              <td style="padding:12px 0;text-align:right;font-size:15px;font-weight:700;color:${reportData.savings >= 0 ? '#60a5fa' : '#f87171'};">${fmt(reportData.savings)}</td>
            </tr>
            <tr style="border-bottom:1px solid rgba(255,255,255,0.05);">
              <td style="padding:12px 0;color:rgba(255,255,255,0.4);font-size:13px;">Savings Rate</td>
              <td style="padding:12px 0;text-align:right;font-size:15px;font-weight:700;color:${savColor};">${savRate}%</td>
            </tr>
            <tr>
              <td style="padding:12px 0;color:rgba(255,255,255,0.4);font-size:13px;">Biggest Expense</td>
              <td style="padding:12px 0;text-align:right;font-size:15px;font-weight:700;color:#e2e8f0;">${reportData.topCategories.length > 0 ? esc(reportData.topCategories[0].category) : "N/A"}</td>
            </tr>
          </table>
        </td></tr>
      </table>
    </td></tr>`;

    // --- 2. Expense Breakdown (Segmented Bar as Pie alternative) ---
    const pieSegments = reportData.topCategories.map((c, i) => {
      const pct = Math.max(Math.round((c.total / expTotalForPie) * 100), 1);
      return { category: c.category, pct, color: catColors[i % catColors.length], amount: c.total };
    });
    const pieBarCells = pieSegments.map((s) =>
      `<td style="width:${s.pct}%;height:32px;background:${s.color};border-right:2px solid #0a0f1e;"></td>`
    ).join("");
    const pieLegend = pieSegments.map((s) =>
      `<tr>
        <td style="padding:6px 8px;vertical-align:middle;width:12px;">
          <table cellpadding="0" cellspacing="0" border="0"><tr><td style="width:10px;height:10px;background:${s.color};border-radius:3px;"></td></tr></table>
        </td>
        <td style="padding:6px 4px;color:rgba(255,255,255,0.5);font-size:12px;">${esc(s.category)}</td>
        <td style="padding:6px 8px;text-align:right;color:rgba(255,255,255,0.7);font-size:12px;font-weight:600;">${s.pct}%</td>
        <td style="padding:6px 8px;text-align:right;color:rgba(255,255,255,0.4);font-size:11px;">${fmt(s.amount)}</td>
      </tr>`
    ).join("");

    const expenseBreakdown = `
    <tr><td style="padding:16px 28px 0;">
      <table cellpadding="0" cellspacing="0" border="0" width="100%" style="${glass}">
        <tr><td style="padding:24px 24px 8px;">
          <p style="margin:0;font-size:11px;font-weight:600;color:rgba(255,255,255,0.4);text-transform:uppercase;letter-spacing:1.5px;">&#128202; Spending Breakdown</p>
        </td></tr>
        <tr><td style="padding:8px 24px;">
          <table cellpadding="0" cellspacing="0" border="0" width="100%" style="border-radius:8px;overflow:hidden;">
            <tr>${pieBarCells}</tr>
          </table>
        </td></tr>
        <tr><td style="padding:12px 16px 20px;">
          <table cellpadding="0" cellspacing="0" border="0" width="100%">${pieLegend}</table>
        </td></tr>
      </table>
    </td></tr>`;

    // --- 3. Monthly Spending Trend (Bar Chart) ---
    let spendingTrendSection = "";
    if (expandedData?.monthlyTrend && expandedData.monthlyTrend.length > 0) {
      const trendMax = Math.max(...expandedData.monthlyTrend.map((t) => t.expenses), 1);
      const trendBars = expandedData.monthlyTrend.map((t) => {
        const h = Math.max(Math.round((t.expenses / trendMax) * 80), 4);
        return `<td style="vertical-align:bottom;text-align:center;padding:0 3px;width:${Math.floor(100 / expandedData.monthlyTrend.length)}%;">
          <p style="margin:0 0 4px;font-size:9px;color:rgba(255,255,255,0.4);">${fmt(t.expenses)}</p>
          <table cellpadding="0" cellspacing="0" border="0" width="100%"><tr><td style="height:${h}px;background:linear-gradient(180deg,rgba(248,113,113,0.8),rgba(248,113,113,0.3));border-radius:6px 6px 0 0;"></td></tr></table>
          <p style="margin:4px 0 0;font-size:10px;color:rgba(255,255,255,0.3);">${shortMonth(t.month)}</p>
        </td>`;
      }).join("");

      spendingTrendSection = `
      <tr><td style="padding:16px 28px 0;">
        <table cellpadding="0" cellspacing="0" border="0" width="100%" style="${glass}">
          <tr><td style="padding:24px 24px 8px;">
            <p style="margin:0;font-size:11px;font-weight:600;color:rgba(255,255,255,0.4);text-transform:uppercase;letter-spacing:1.5px;">&#128200; Monthly Spending Trend</p>
          </td></tr>
          <tr><td style="padding:12px 20px 20px;">
            <table cellpadding="0" cellspacing="0" border="0" width="100%"><tr>${trendBars}</tr></table>
          </td></tr>
        </table>
      </td></tr>`;
    }

    // --- 4. Income vs Expenses Comparison (Dual Bar) ---
    let incExpSection = "";
    if (expandedData?.monthlyTrend && expandedData.monthlyTrend.length > 0) {
      const dualMax = Math.max(...expandedData.monthlyTrend.flatMap((t) => [t.income, t.expenses]), 1);
      const dualBars = expandedData.monthlyTrend.map((t) => {
        const incH = Math.max(Math.round((t.income / dualMax) * 70), 4);
        const expH = Math.max(Math.round((t.expenses / dualMax) * 70), 4);
        return `<td style="vertical-align:bottom;text-align:center;padding:0 2px;width:${Math.floor(100 / expandedData.monthlyTrend.length)}%;">
          <table cellpadding="0" cellspacing="0" border="0" width="100%"><tr>
            <td style="vertical-align:bottom;width:48%;padding-right:1px;">
              <table cellpadding="0" cellspacing="0" border="0" width="100%"><tr><td style="height:${incH}px;background:linear-gradient(180deg,rgba(52,211,153,0.8),rgba(52,211,153,0.25));border-radius:4px 4px 0 0;"></td></tr></table>
            </td>
            <td style="vertical-align:bottom;width:48%;padding-left:1px;">
              <table cellpadding="0" cellspacing="0" border="0" width="100%"><tr><td style="height:${expH}px;background:linear-gradient(180deg,rgba(248,113,113,0.8),rgba(248,113,113,0.25));border-radius:4px 4px 0 0;"></td></tr></table>
            </td>
          </tr></table>
          <p style="margin:4px 0 0;font-size:10px;color:rgba(255,255,255,0.3);">${shortMonth(t.month)}</p>
        </td>`;
      }).join("");

      incExpSection = `
      <tr><td style="padding:16px 28px 0;">
        <table cellpadding="0" cellspacing="0" border="0" width="100%" style="${glass}">
          <tr><td style="padding:24px 24px 8px;">
            <table cellpadding="0" cellspacing="0" border="0" width="100%"><tr>
              <td><p style="margin:0;font-size:11px;font-weight:600;color:rgba(255,255,255,0.4);text-transform:uppercase;letter-spacing:1.5px;">&#128201; Income vs Expenses</p></td>
              <td style="text-align:right;">
                <span style="font-size:10px;color:rgba(52,211,153,0.7);">&#9632; Income</span>
                <span style="font-size:10px;color:rgba(248,113,113,0.7);margin-left:12px;">&#9632; Expenses</span>
              </td>
            </tr></table>
          </td></tr>
          <tr><td style="padding:12px 20px 20px;">
            <table cellpadding="0" cellspacing="0" border="0" width="100%"><tr>${dualBars}</tr></table>
          </td></tr>
        </table>
      </td></tr>`;
    }

    // --- 5. Top Expense Categories (Horizontal Bar) ---
    const topCatRows = reportData.topCategories.map((c, i) => {
      const pct = Math.round((c.total / catMax) * 100);
      const color = catColors[i % catColors.length];
      return `
      <tr>
        <td style="padding:8px 0;vertical-align:middle;width:28%;">
          <table cellpadding="0" cellspacing="0" border="0"><tr>
            <td style="width:10px;height:10px;background:${color};border-radius:3px;padding:0;"></td>
            <td style="padding-left:8px;color:rgba(255,255,255,0.6);font-size:12px;white-space:nowrap;">${esc(c.category)}</td>
          </tr></table>
        </td>
        <td style="padding:8px 12px;vertical-align:middle;width:50%;">
          <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background:rgba(255,255,255,0.03);border-radius:4px;"><tr>
            <td style="width:${pct}%;height:14px;background:linear-gradient(90deg,${color}cc,${color}55);border-radius:4px;"></td>
            <td style="width:${100 - pct}%;height:14px;"></td>
          </tr></table>
        </td>
        <td style="padding:8px 0;text-align:right;color:rgba(255,255,255,0.8);font-size:13px;font-weight:600;white-space:nowrap;">${fmt(c.total)}</td>
      </tr>`;
    }).join("");

    const topCategoriesSection = `
    <tr><td style="padding:16px 28px 0;">
      <table cellpadding="0" cellspacing="0" border="0" width="100%" style="${glass}">
        <tr><td style="padding:24px 24px 8px;">
          <p style="margin:0;font-size:11px;font-weight:600;color:rgba(255,255,255,0.4);text-transform:uppercase;letter-spacing:1.5px;">&#128269; Top Spending Categories</p>
        </td></tr>
        <tr><td style="padding:4px 24px 20px;">
          <table cellpadding="0" cellspacing="0" border="0" width="100%">${topCatRows}</table>
        </td></tr>
      </table>
    </td></tr>`;

    // --- 6. Savings Trend (Line-style stepped chart) ---
    let savingsTrendSection = "";
    if (expandedData?.savingsTrend && expandedData.savingsTrend.length > 0) {
      const savMax = Math.max(...expandedData.savingsTrend.map((s) => Math.abs(s.savings)), 1);
      const savBars = expandedData.savingsTrend.map((s) => {
        const h = Math.max(Math.round((Math.abs(s.savings) / savMax) * 60), 4);
        const isPositive = s.savings >= 0;
        const color = isPositive ? "rgba(96,165,250,0.7)" : "rgba(248,113,113,0.7)";
        return `<td style="vertical-align:bottom;text-align:center;padding:0 3px;width:${Math.floor(100 / expandedData.savingsTrend.length)}%;">
          <p style="margin:0 0 3px;font-size:9px;color:rgba(255,255,255,0.35);">${fmt(s.savings)}</p>
          <table cellpadding="0" cellspacing="0" border="0" width="100%"><tr><td style="height:${h}px;background:linear-gradient(180deg,${color},${color.replace("0.7", "0.2")});border-radius:6px 6px 0 0;"></td></tr></table>
          <p style="margin:3px 0 0;font-size:10px;color:rgba(255,255,255,0.3);">${shortMonth(s.month)}</p>
        </td>`;
      }).join("");

      savingsTrendSection = `
      <tr><td style="padding:16px 28px 0;">
        <table cellpadding="0" cellspacing="0" border="0" width="100%" style="${glass}">
          <tr><td style="padding:24px 24px 8px;">
            <p style="margin:0;font-size:11px;font-weight:600;color:rgba(255,255,255,0.4);text-transform:uppercase;letter-spacing:1.5px;">&#128176; Savings Trend</p>
          </td></tr>
          <tr><td style="padding:12px 20px 20px;">
            <table cellpadding="0" cellspacing="0" border="0" width="100%"><tr>${savBars}</tr></table>
          </td></tr>
        </table>
      </td></tr>`;
    }

    // --- 7. Subscriptions Table ---
    let subscriptionSection = "";
    if (expandedData?.subscriptionsList && expandedData.subscriptionsList.length > 0) {
      const subRows = expandedData.subscriptionsList.map((s) => `
        <tr>
          <td style="padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.04);color:rgba(255,255,255,0.6);font-size:13px;">${esc(s.name)}</td>
          <td style="padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.04);text-align:center;color:rgba(255,255,255,0.3);font-size:11px;">${s.frequency}</td>
          <td style="padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.04);text-align:right;color:rgba(255,255,255,0.7);font-size:13px;font-weight:600;">${fmt(s.amount)}</td>
        </tr>
      `).join("");

      subscriptionSection = `
      <tr><td style="padding:16px 28px 0;">
        <table cellpadding="0" cellspacing="0" border="0" width="100%" style="${glass}">
          <tr><td style="padding:24px 24px 8px;">
            <p style="margin:0;font-size:11px;font-weight:600;color:rgba(255,255,255,0.4);text-transform:uppercase;letter-spacing:1.5px;">&#128257; Recurring Subscriptions</p>
          </td></tr>
          <tr><td style="padding:4px 24px 8px;">
            <table cellpadding="0" cellspacing="0" border="0" width="100%">
              <tr>
                <td style="padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.08);color:rgba(255,255,255,0.25);font-size:10px;text-transform:uppercase;letter-spacing:1px;">Service</td>
                <td style="padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.08);text-align:center;color:rgba(255,255,255,0.25);font-size:10px;text-transform:uppercase;letter-spacing:1px;">Cycle</td>
                <td style="padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.08);text-align:right;color:rgba(255,255,255,0.25);font-size:10px;text-transform:uppercase;letter-spacing:1px;">Cost</td>
              </tr>
              ${subRows}
            </table>
          </td></tr>
          <tr><td style="padding:12px 24px 20px;">
            <table cellpadding="0" cellspacing="0" border="0" width="100%" style="${glassInner}">
              <tr><td style="padding:12px 16px;text-align:center;">
                <span style="color:rgba(255,255,255,0.4);font-size:12px;">Total Monthly: </span>
                <span style="color:#f87171;font-size:15px;font-weight:700;">${fmt(expandedData.totalSubscriptions)}</span>
              </td></tr>
            </table>
          </td></tr>
        </table>
      </td></tr>`;
    }

    // --- 8. AI Insights ---
    const compInsights: string[] = [];
    if (expandedData?.comparison) {
      const c = expandedData.comparison;
      if (c.expenseChange !== 0) {
        compInsights.push(`Your spending ${c.expenseChange > 0 ? "increased" : "decreased"} ${Math.abs(c.expenseChange)}% compared to last month.`);
      }
      if (c.incomeChange !== 0) {
        compInsights.push(`Your income ${c.incomeChange > 0 ? "grew" : "dropped"} ${Math.abs(c.incomeChange)}% vs last month.`);
      }
      if (expandedData.totalSubscriptions > 0 && reportData.expenses > 0) {
        const subPct = Math.round((expandedData.totalSubscriptions / reportData.expenses) * 100);
        compInsights.push(`Subscriptions account for ${subPct}% of your total expenses.`);
      }
    }
    const allInsights = [...compInsights, ...reportData.recommendations];
    const insightsRows = allInsights.length > 0
      ? allInsights.map((r) => `
        <tr><td style="padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.03);">
          <table cellpadding="0" cellspacing="0" border="0"><tr>
            <td style="width:28px;vertical-align:top;padding-top:1px;font-size:14px;">&#128161;</td>
            <td style="color:rgba(255,255,255,0.5);font-size:13px;line-height:1.6;">${esc(r)}</td>
          </tr></table>
        </td></tr>`).join("")
      : `<tr><td style="padding:12px 0;color:rgba(255,255,255,0.4);font-size:13px;">&#10024; Everything looks great! Keep up the good habits.</td></tr>`;

    const insightsSection = `
    <tr><td style="padding:16px 28px 0;">
      <table cellpadding="0" cellspacing="0" border="0" width="100%" style="${glass}">
        <tr><td style="padding:24px 24px 8px;">
          <p style="margin:0;font-size:11px;font-weight:600;color:rgba(255,255,255,0.4);text-transform:uppercase;letter-spacing:1.5px;">&#128161; AI Insights</p>
        </td></tr>
        <tr><td style="padding:4px 24px 20px;">
          <table cellpadding="0" cellspacing="0" border="0" width="100%">${insightsRows}</table>
        </td></tr>
      </table>
    </td></tr>`;

    // --- 9. Budget Performance ---
    let budgetSection = "";
    if (expandedData?.budgetPerformance && expandedData.budgetPerformance.length > 0) {
      const budgetRows = expandedData.budgetPerformance.map((b) => {
        const pctUsed = b.budget > 0 ? Math.min(Math.round((b.spent / b.budget) * 100), 100) : 0;
        const statusColor = b.status === "over" ? "#f87171" : b.status === "warning" ? "#fbbf24" : "#34d399";
        const statusLabel = b.status === "over" ? "Over Budget" : b.status === "warning" ? "Warning" : "Good";
        const barColor = b.status === "over" ? "rgba(248,113,113,0.6)" : b.status === "warning" ? "rgba(251,191,36,0.6)" : "rgba(52,211,153,0.6)";
        return `
        <tr>
          <td style="padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.04);color:rgba(255,255,255,0.6);font-size:12px;width:22%;">${esc(b.category)}</td>
          <td style="padding:10px 4px;border-bottom:1px solid rgba(255,255,255,0.04);width:36%;">
            <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background:rgba(255,255,255,0.03);border-radius:4px;"><tr>
              <td style="width:${pctUsed}%;height:10px;background:${barColor};border-radius:4px;"></td>
              <td style="width:${100 - pctUsed}%;height:10px;"></td>
            </tr></table>
          </td>
          <td style="padding:10px 4px;border-bottom:1px solid rgba(255,255,255,0.04);text-align:center;color:rgba(255,255,255,0.5);font-size:11px;">${fmt(b.spent)} / ${fmt(b.budget)}</td>
          <td style="padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.04);text-align:right;">
            <span style="font-size:10px;font-weight:600;color:${statusColor};padding:3px 8px;background:${statusColor}15;border-radius:8px;">${statusLabel}</span>
          </td>
        </tr>`;
      }).join("");

      budgetSection = `
      <tr><td style="padding:16px 28px 0;">
        <table cellpadding="0" cellspacing="0" border="0" width="100%" style="${glass}">
          <tr><td style="padding:24px 24px 8px;">
            <p style="margin:0;font-size:11px;font-weight:600;color:rgba(255,255,255,0.4);text-transform:uppercase;letter-spacing:1.5px;">&#127919; Budget Performance</p>
          </td></tr>
          <tr><td style="padding:4px 24px 20px;">
            <table cellpadding="0" cellspacing="0" border="0" width="100%">${budgetRows}</table>
          </td></tr>
        </table>
      </td></tr>`;
    }

    // --- 10. Top Transactions ---
    let topTxSection = "";
    if (expandedData?.topTransactions && expandedData.topTransactions.length > 0) {
      const txRows = expandedData.topTransactions.map((t) => {
        const d = new Date(t.date);
        const dateStr = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
        return `
        <tr>
          <td style="padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.04);color:rgba(255,255,255,0.3);font-size:11px;width:20%;">${dateStr}</td>
          <td style="padding:10px 4px;border-bottom:1px solid rgba(255,255,255,0.04);color:rgba(255,255,255,0.6);font-size:12px;">${esc(t.description)}</td>
          <td style="padding:10px 4px;border-bottom:1px solid rgba(255,255,255,0.04);text-align:center;">
            <span style="font-size:10px;color:rgba(255,255,255,0.3);background:rgba(255,255,255,0.04);padding:2px 8px;border-radius:6px;">${esc(t.category)}</span>
          </td>
          <td style="padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.04);text-align:right;color:rgba(255,255,255,0.8);font-size:13px;font-weight:600;">${fmt(t.amount)}</td>
        </tr>`;
      }).join("");

      topTxSection = `
      <tr><td style="padding:16px 28px 0;">
        <table cellpadding="0" cellspacing="0" border="0" width="100%" style="${glass}">
          <tr><td style="padding:24px 24px 8px;">
            <p style="margin:0;font-size:11px;font-weight:600;color:rgba(255,255,255,0.4);text-transform:uppercase;letter-spacing:1.5px;">&#128203; Largest Transactions</p>
          </td></tr>
          <tr><td style="padding:4px 24px 20px;">
            <table cellpadding="0" cellspacing="0" border="0" width="100%">${txRows}</table>
          </td></tr>
        </table>
      </td></tr>`;
    }

    // --- Income vs Expenses Split Bar ---
    const incExpBar = `
    <tr><td style="padding:16px 28px 0;">
      <table cellpadding="0" cellspacing="0" border="0" width="100%" style="${glass}">
        <tr><td style="padding:20px 24px;">
          <table cellpadding="0" cellspacing="0" border="0" width="100%"><tr>
            <td style="color:rgba(255,255,255,0.4);font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:1px;">Income vs Expenses</td>
            <td style="text-align:right;">
              <span style="color:rgba(52,211,153,0.6);font-size:10px;">&#9679; ${incPct}% income</span>
              <span style="color:rgba(248,113,113,0.6);font-size:10px;margin-left:8px;">&#9679; ${expPct}% expenses</span>
            </td>
          </tr></table>
          <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-top:10px;border-radius:8px;overflow:hidden;"><tr>
            <td style="width:${incPct}%;height:24px;background:linear-gradient(90deg,rgba(52,211,153,0.6),rgba(52,211,153,0.2));text-align:center;font-size:10px;font-weight:700;color:rgba(255,255,255,0.7);">${fmt(reportData.income)}</td>
            <td style="width:${expPct}%;height:24px;background:linear-gradient(90deg,rgba(248,113,113,0.3),rgba(248,113,113,0.6));text-align:center;font-size:10px;font-weight:700;color:rgba(255,255,255,0.7);">${fmt(reportData.expenses)}</td>
          </tr></table>
        </td></tr>
      </table>
    </td></tr>`;

    // --- Savings Rate Gauge ---
    const savingsGauge = `
    <tr><td style="padding:16px 28px 0;">
      <table cellpadding="0" cellspacing="0" border="0" width="100%" style="${glass}">
        <tr><td style="padding:20px 24px;">
          <table cellpadding="0" cellspacing="0" border="0" width="100%"><tr>
            <td><p style="margin:0;font-size:11px;font-weight:600;color:rgba(255,255,255,0.4);text-transform:uppercase;letter-spacing:1px;">Savings Rate</p></td>
            <td style="text-align:right;"><span style="font-size:26px;font-weight:800;color:${savColor};">${savRate}%</span></td>
          </tr></table>
          <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-top:10px;border-radius:6px;overflow:hidden;background:rgba(255,255,255,0.03);"><tr>
            <td style="width:${savClamped}%;height:10px;background:linear-gradient(90deg,${savColor}aa,${savColor}44);border-radius:6px;"></td>
            <td style="width:${100 - savClamped}%;height:10px;"></td>
          </tr></table>
          <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-top:4px;"><tr>
            <td style="font-size:9px;color:rgba(255,255,255,0.2);">0%</td>
            <td style="text-align:center;font-size:9px;color:rgba(255,255,255,0.25);">&#127919; 20% target</td>
            <td style="text-align:right;font-size:9px;color:rgba(255,255,255,0.2);">100%</td>
          </tr></table>
        </td></tr>
      </table>
    </td></tr>`;

    // --- Quick Stats ---
    const dailyAvg = fmt(Math.round(reportData.expenses / 30));
    const incExpRatio = reportData.expenses > 0 ? (reportData.income / reportData.expenses).toFixed(2) : "N/A";
    const quickStats = `
    <tr><td style="padding:16px 28px 0;">
      <table cellpadding="0" cellspacing="0" border="0" width="100%" style="${glass}">
        <tr><td style="padding:20px 24px;">
          <p style="margin:0 0 14px;font-size:11px;font-weight:600;color:rgba(255,255,255,0.4);text-transform:uppercase;letter-spacing:1.5px;">&#9889; Quick Stats</p>
          <table cellpadding="0" cellspacing="0" border="0" width="100%">
            <tr><td style="padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.04);color:rgba(255,255,255,0.4);font-size:12px;">Daily Avg Spend</td><td style="padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.04);text-align:right;color:rgba(255,255,255,0.7);font-size:13px;font-weight:600;">${dailyAvg}/day</td></tr>
            <tr><td style="padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.04);color:rgba(255,255,255,0.4);font-size:12px;">Income:Expense Ratio</td><td style="padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.04);text-align:right;color:rgba(255,255,255,0.7);font-size:13px;font-weight:600;">${incExpRatio}x</td></tr>
            <tr><td style="padding:8px 0;color:rgba(255,255,255,0.4);font-size:12px;">Transaction Categories</td><td style="padding:8px 0;text-align:right;color:rgba(255,255,255,0.7);font-size:13px;font-weight:600;">${reportData.topCategories.length}</td></tr>
          </table>
        </td></tr>
      </table>
    </td></tr>`;

    // ========== Assemble Full Email ==========
    const html = `<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#060a14;font-family:'Segoe UI',system-ui,-apple-system,sans-serif;-webkit-font-smoothing:antialiased;">
<table cellpadding="0" cellspacing="0" border="0" width="100%" style="background:#060a14;padding:32px 0;">
<tr><td align="center">
<table cellpadding="0" cellspacing="0" border="0" width="600" style="max-width:600px;background:rgba(15,23,42,0.9);border:1px solid rgba(255,255,255,0.05);border-radius:20px;overflow:hidden;">

  <!-- HEADER -->
  <tr><td style="background:linear-gradient(135deg,rgba(30,58,95,0.5) 0%,rgba(15,23,42,0.3) 100%);padding:48px 32px 40px;text-align:center;">
    <table cellpadding="0" cellspacing="0" border="0" width="100%"><tr><td align="center">
      <table cellpadding="0" cellspacing="0" border="0"><tr>
        <td style="width:56px;height:56px;background:linear-gradient(135deg,rgba(59,130,246,0.4),rgba(139,92,246,0.4));border:1px solid rgba(255,255,255,0.1);border-radius:16px;text-align:center;vertical-align:middle;font-size:28px;">&#128200;</td>
      </tr></table>
      <p style="margin:20px 0 0;font-size:28px;font-weight:700;color:rgba(255,255,255,0.9);letter-spacing:-0.5px;">Monthly Finance Report</p>
      <p style="margin:8px 0 0;font-size:14px;color:rgba(255,255,255,0.3);letter-spacing:0.5px;">${monthLabel}</p>
    </td></tr></table>
  </td></tr>

  <!-- Spacer -->
  <tr><td style="height:24px;"></td></tr>

  <!-- 1. Financial Summary -->
  ${summarySection}

  <!-- Income vs Expenses bar -->
  ${incExpBar}

  <!-- Savings gauge -->
  ${savingsGauge}

  <!-- 2. Expense Breakdown -->
  ${expenseBreakdown}

  <!-- 3. Monthly Spending Trend -->
  ${spendingTrendSection}

  <!-- 4. Income vs Expenses Dual Bar -->
  ${incExpSection}

  <!-- 5. Top Categories Horizontal -->
  ${topCategoriesSection}

  <!-- 6. Savings Trend -->
  ${savingsTrendSection}

  <!-- 7. Subscriptions -->
  ${subscriptionSection}

  <!-- 8. AI Insights -->
  ${insightsSection}

  <!-- 9. Budget Performance -->
  ${budgetSection}

  <!-- 10. Top Transactions -->
  ${topTxSection}

  <!-- Quick Stats -->
  ${quickStats}

  <!-- FOOTER -->
  <tr><td style="padding:32px 28px;">
    <table cellpadding="0" cellspacing="0" border="0" width="100%" style="border-top:1px solid rgba(255,255,255,0.05);padding-top:24px;">
      <tr><td style="text-align:center;">
        <p style="margin:0;font-size:11px;color:rgba(255,255,255,0.2);">Generated by Finance Tracker &#183; ${monthLabel}</p>
        <p style="margin:6px 0 0;font-size:10px;color:rgba(255,255,255,0.12);">Automatically generated from your tracked financial data.</p>
      </td></tr>
    </table>
  </td></tr>

</table>
</td></tr>
</table>
</body></html>`;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: smtpUser, pass: smtpPass },
    });

    await transporter.sendMail({
      from: `"Finance Tracker" <${smtpUser}>`,
      to: email,
      subject: `Monthly Finance Report — ${monthLabel}`,
      html,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    Sentry.captureException(error);
    const msg = error instanceof Error ? error.message : String(error);
    console.error("Report email error:", msg);
    return NextResponse.json({ error: `Failed to send report: ${msg}` }, { status: 500 });
  }
}
