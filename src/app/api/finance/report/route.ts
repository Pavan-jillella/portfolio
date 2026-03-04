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
});

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

function getMonthLabel(month: string): string {
  const [year, m] = month.split("-");
  const date = new Date(parseInt(year), parseInt(m) - 1);
  return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = reportSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: "Invalid report data" }, { status: 400 });
    }

    const { email, reportData } = result.data;
    const monthLabel = getMonthLabel(reportData.month);

    const smtpHost = process.env.SMTP_HOST;
    const smtpPort = process.env.SMTP_PORT;
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;

    if (!smtpHost || !smtpUser || !smtpPass) {
      console.log("Monthly report (SMTP not configured):", { email, month: reportData.month });
      return NextResponse.json({ success: true, message: "SMTP not configured. Report logged." });
    }

    const topCatRows = reportData.topCategories
      .map((c) => `<tr><td style="padding:8px 16px;border-bottom:1px solid #1e293b;color:#94a3b8;">${escapeHtml(c.category)}</td><td style="padding:8px 16px;border-bottom:1px solid #1e293b;color:#f1f5f9;text-align:right;">${formatCurrency(c.total)}</td></tr>`)
      .join("");

    const recsHtml = reportData.recommendations.length > 0
      ? reportData.recommendations.map((r) => `<li style="margin-bottom:8px;color:#94a3b8;">${escapeHtml(r)}</li>`).join("")
      : `<li style="color:#94a3b8;">No specific recommendations this month. Keep it up!</li>`;

    const html = `
      <div style="max-width:600px;margin:0 auto;background:#0f172a;color:#f1f5f9;font-family:system-ui,-apple-system,sans-serif;border-radius:16px;overflow:hidden;">
        <div style="background:linear-gradient(135deg,#1e3a5f,#0f172a);padding:32px;text-align:center;">
          <h1 style="margin:0;font-size:24px;color:#f1f5f9;">Monthly Finance Report</h1>
          <p style="margin:8px 0 0;color:#64748b;font-size:14px;">${monthLabel}</p>
        </div>
        <div style="padding:32px;">
          <div style="display:flex;gap:16px;margin-bottom:32px;">
            <div style="flex:1;background:#1e293b;border-radius:12px;padding:16px;text-align:center;">
              <p style="margin:0 0 4px;font-size:12px;color:#64748b;text-transform:uppercase;">Income</p>
              <p style="margin:0;font-size:20px;color:#34d399;font-weight:600;">${formatCurrency(reportData.income)}</p>
            </div>
            <div style="flex:1;background:#1e293b;border-radius:12px;padding:16px;text-align:center;">
              <p style="margin:0 0 4px;font-size:12px;color:#64748b;text-transform:uppercase;">Expenses</p>
              <p style="margin:0;font-size:20px;color:#f87171;font-weight:600;">${formatCurrency(reportData.expenses)}</p>
            </div>
            <div style="flex:1;background:#1e293b;border-radius:12px;padding:16px;text-align:center;">
              <p style="margin:0 0 4px;font-size:12px;color:#64748b;text-transform:uppercase;">Savings</p>
              <p style="margin:0;font-size:20px;color:#60a5fa;font-weight:600;">${formatCurrency(reportData.savings)}</p>
            </div>
          </div>
          <div style="background:#1e293b;border-radius:12px;padding:16px;margin-bottom:24px;">
            <p style="margin:0 0 4px;font-size:12px;color:#64748b;text-transform:uppercase;">Savings Rate</p>
            <p style="margin:0;font-size:24px;color:${reportData.savingsRate >= 20 ? '#34d399' : reportData.savingsRate >= 0 ? '#fbbf24' : '#f87171'};font-weight:600;">${Math.round(reportData.savingsRate)}%</p>
          </div>
          <h3 style="color:#f1f5f9;font-size:16px;margin:0 0 12px;">Top Spending Categories</h3>
          <table style="width:100%;border-collapse:collapse;margin-bottom:24px;">${topCatRows}</table>
          <h3 style="color:#f1f5f9;font-size:16px;margin:0 0 12px;">Insights & Recommendations</h3>
          <ul style="padding-left:20px;margin:0;">${recsHtml}</ul>
        </div>
        <div style="padding:16px 32px;background:#1e293b;text-align:center;">
          <p style="margin:0;font-size:12px;color:#475569;">Generated by your Finance Tracker</p>
        </div>
      </div>
    `;

    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: parseInt(smtpPort || "587"),
      secure: smtpPort === "465",
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
    return NextResponse.json({ error: "Failed to send report" }, { status: 500 });
  }
}
