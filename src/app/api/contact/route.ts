import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import nodemailer from "nodemailer";
import { rateLimit } from "@/lib/rate-limit";
import * as Sentry from "@sentry/nextjs";
import {
  generateContactNotificationEmail,
  generateContactConfirmationEmail,
} from "@/lib/email-templates";

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

const contactSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email(),
  message: z.string().min(1).max(5000),
  honeypot: z.string().max(0).optional(),
  turnstileToken: z.string().optional(),
});

async function verifyTurnstile(token: string): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true; // Skip if not configured

  try {
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ secret, response: token }),
    });
    const data = await res.json();
    return data.success === true;
  } catch {
    return false;
  }
}

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    const { allowed } = rateLimit(ip, 3, 60000);
    if (!allowed) {
      return NextResponse.json({ error: "Too many requests. Try again in a minute." }, { status: 429 });
    }

    const body = await req.json();
    const result = contactSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: "Invalid form data" }, { status: 400 });
    }

    const { name, email, message, honeypot, turnstileToken } = result.data;

    if (honeypot) {
      return NextResponse.json({ success: true });
    }

    // Verify Turnstile if token provided and secret configured
    if (turnstileToken) {
      const valid = await verifyTurnstile(turnstileToken);
      if (!valid) {
        return NextResponse.json({ error: "CAPTCHA verification failed" }, { status: 400 });
      }
    }

    const smtpHost = process.env.SMTP_HOST;
    const smtpPort = process.env.SMTP_PORT;
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    const contactEmail = process.env.CONTACT_EMAIL;

    if (!smtpHost || !smtpUser || !smtpPass || !contactEmail) {
      const missing = [
        !smtpHost && "SMTP_HOST",
        !smtpUser && "SMTP_USER",
        !smtpPass && "SMTP_PASS",
        !contactEmail && "CONTACT_EMAIL",
      ].filter(Boolean).join(", ");
      console.error(`SMTP not configured. Missing: ${missing}`);
      return NextResponse.json(
        { error: `Email service not configured. Missing: ${missing}` },
        { status: 503 }
      );
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: smtpUser, pass: smtpPass },
    });

    // Generate beautiful HTML emails
    const notificationHtml = generateContactNotificationEmail({
      senderName: escapeHtml(name),
      senderEmail: escapeHtml(email),
      message: escapeHtml(message).replace(/\n/g, "<br>"),
    });

    const confirmationHtml = generateContactConfirmationEmail({
      senderName: escapeHtml(name),
    });

    // Send notification to you (Pavan)
    await transporter.sendMail({
      from: `"Portfolio Contact" <${smtpUser}>`,
      to: contactEmail,
      replyTo: email,
      subject: `📬 New message from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
      html: notificationHtml,
    });

    // Send confirmation to the sender
    await transporter.sendMail({
      from: `"Pavan Jillella" <${smtpUser}>`,
      to: email,
      subject: `Thanks for reaching out, ${name.split(' ')[0]}! 👋`,
      text: `Hi ${name.split(' ')[0]},\n\nThank you for reaching out! I've received your message and will get back to you within 24-48 hours.\n\nIn the meantime, feel free to explore my portfolio at https://pavanjillella.com\n\nBest regards,\nPavan Jillella\nData Analyst @ Morgan Stanley`,
      html: confirmationHtml,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    Sentry.captureException(error);
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
  }
}
