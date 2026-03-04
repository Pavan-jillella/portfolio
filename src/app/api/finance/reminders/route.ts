import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { createAdminClient } from "@/lib/supabase/admin";

interface SubscriptionRow {
  id: string;
  user_id: string;
  price: number;
  currency: string;
  billing_cycle: string;
  next_billing_date: string;
  reminder_days: number;
  active: boolean;
  service_name: string;
  plan_name: string | null;
}

interface UserEmail {
  id: string;
  email: string;
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function POST(req: NextRequest) {
  // Auth: verify CRON_SECRET bearer token
  const authHeader = req.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createAdminClient();
  if (!supabase) {
    return NextResponse.json({ error: "Database not configured" }, { status: 503 });
  }

  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = process.env.SMTP_PORT;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;

  if (!smtpHost || !smtpUser || !smtpPass) {
    return NextResponse.json({ error: "SMTP not configured" }, { status: 503 });
  }

  try {
    // Query all active user subscriptions with service/plan names via JOIN
    const { data: rawSubs, error: subError } = await supabase
      .from("user_subscriptions")
      .select("id, user_id, price, currency, billing_cycle, next_billing_date, reminder_days, active, subscription_services(name), subscription_plans(name)")
      .eq("active", true);

    if (subError || !rawSubs) {
      return NextResponse.json({ error: "Failed to fetch subscriptions" }, { status: 500 });
    }

    // Flatten joined data
    const subscriptions: SubscriptionRow[] = (rawSubs as Record<string, unknown>[]).map((row) => ({
      id: row.id as string,
      user_id: row.user_id as string,
      price: row.price as number,
      currency: row.currency as string,
      billing_cycle: row.billing_cycle as string,
      next_billing_date: row.next_billing_date as string,
      reminder_days: row.reminder_days as number,
      active: row.active as boolean,
      service_name: (row.subscription_services as { name: string } | null)?.name || "Unknown",
      plan_name: (row.subscription_plans as { name: string } | null)?.name || null,
    }));

    // Filter subscriptions due within reminder_days
    const now = new Date();
    const dueSubscriptions = (subscriptions as SubscriptionRow[]).filter((sub) => {
      const billing = new Date(sub.next_billing_date);
      const diffDays = Math.ceil((billing.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      return diffDays >= 0 && diffDays <= sub.reminder_days;
    });

    if (dueSubscriptions.length === 0) {
      return NextResponse.json({ sent: 0, errors: 0, message: "No upcoming reminders" });
    }

    // Group by user_id
    const byUser = new Map<string, SubscriptionRow[]>();
    dueSubscriptions.forEach((sub) => {
      const list = byUser.get(sub.user_id) || [];
      list.push(sub);
      byUser.set(sub.user_id, list);
    });

    // Fetch user emails via Supabase Auth Admin API
    const userIds = Array.from(byUser.keys());
    let userEmails: UserEmail[] = [];

    try {
      // Use auth.admin to list users (auth.users can't be queried via .from())
      const { data: authData, error: authError } = await supabase.auth.admin.listUsers();
      if (!authError && authData?.users) {
        userEmails = authData.users
          .filter((u) => userIds.includes(u.id) && u.email)
          .map((u) => ({ id: u.id, email: u.email! }));
      }
    } catch {
      // Fallback: try user_profiles table
      const { data: profiles } = await supabase
        .from("user_profiles")
        .select("id, email")
        .in("id", userIds);
      userEmails = (profiles as UserEmail[]) || [];
    }

    // If still no emails, try user_profiles as final fallback
    if (userEmails.length === 0) {
      const { data: profiles } = await supabase
        .from("user_profiles")
        .select("id, email")
        .in("id", userIds);
      userEmails = (profiles as UserEmail[]) || [];
    }

    const emailMap = new Map<string, string>();
    userEmails.forEach((u) => emailMap.set(u.id, u.email));

    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: parseInt(smtpPort || "587"),
      secure: smtpPort === "465",
      auth: { user: smtpUser, pass: smtpPass },
    });

    let sent = 0;
    let errors = 0;

    for (const [userId, subs] of Array.from(byUser.entries())) {
      const email = emailMap.get(userId);
      if (!email) {
        errors++;
        continue;
      }

      const subRows = subs
        .map((s) => {
          const billing = new Date(s.next_billing_date);
          const diffDays = Math.ceil((billing.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
          const dueLabel = diffDays === 0 ? "Today" : diffDays === 1 ? "Tomorrow" : `In ${diffDays} days`;
          const displayName = s.plan_name ? `${escapeHtml(s.service_name)} — ${escapeHtml(s.plan_name)}` : escapeHtml(s.service_name);
          return `<tr>
            <td style="padding:10px 16px;border-bottom:1px solid #1e293b;color:#f1f5f9;">${displayName}</td>
            <td style="padding:10px 16px;border-bottom:1px solid #1e293b;color:#60a5fa;text-align:right;">${formatCurrency(s.price)}</td>
            <td style="padding:10px 16px;border-bottom:1px solid #1e293b;color:#94a3b8;">${s.billing_cycle}</td>
            <td style="padding:10px 16px;border-bottom:1px solid #1e293b;color:#fbbf24;">${dueLabel}</td>
          </tr>`;
        })
        .join("");

      const totalDue = subs.reduce((sum, s) => sum + s.price, 0);

      const html = `
        <div style="max-width:600px;margin:0 auto;background:#0f172a;color:#f1f5f9;font-family:system-ui,-apple-system,sans-serif;border-radius:16px;overflow:hidden;">
          <div style="background:linear-gradient(135deg,#1e3a5f,#0f172a);padding:32px;text-align:center;">
            <h1 style="margin:0;font-size:24px;color:#f1f5f9;">Subscription Reminder</h1>
            <p style="margin:8px 0 0;color:#64748b;font-size:14px;">${subs.length} upcoming renewal${subs.length > 1 ? "s" : ""}</p>
          </div>
          <div style="padding:32px;">
            <div style="background:#1e293b;border-radius:12px;padding:16px;margin-bottom:24px;text-align:center;">
              <p style="margin:0 0 4px;font-size:12px;color:#64748b;text-transform:uppercase;">Total Due</p>
              <p style="margin:0;font-size:28px;color:#f87171;font-weight:600;">${formatCurrency(totalDue)}</p>
            </div>
            <table style="width:100%;border-collapse:collapse;">
              <thead>
                <tr>
                  <th style="padding:8px 16px;text-align:left;font-size:11px;color:#64748b;text-transform:uppercase;border-bottom:1px solid #1e293b;">Service</th>
                  <th style="padding:8px 16px;text-align:right;font-size:11px;color:#64748b;text-transform:uppercase;border-bottom:1px solid #1e293b;">Amount</th>
                  <th style="padding:8px 16px;text-align:left;font-size:11px;color:#64748b;text-transform:uppercase;border-bottom:1px solid #1e293b;">Frequency</th>
                  <th style="padding:8px 16px;text-align:left;font-size:11px;color:#64748b;text-transform:uppercase;border-bottom:1px solid #1e293b;">Due</th>
                </tr>
              </thead>
              <tbody>${subRows}</tbody>
            </table>
          </div>
          <div style="padding:16px 32px;background:#1e293b;text-align:center;">
            <p style="margin:0;font-size:12px;color:#475569;">Subscription Reminder from Finance Tracker</p>
          </div>
        </div>
      `;

      try {
        await transporter.sendMail({
          from: `"Finance Tracker" <${smtpUser}>`,
          to: email,
          subject: `Subscription Reminder: ${subs.length} upcoming renewal${subs.length > 1 ? "s" : ""} (${formatCurrency(totalDue)})`,
          html,
        });
        sent++;
      } catch {
        errors++;
      }
    }

    return NextResponse.json({ sent, errors });
  } catch (error) {
    console.error("Reminder API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
