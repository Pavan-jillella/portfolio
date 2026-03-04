import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const urlSchema = z.object({
  url: z.string().url().refine(
    (url) =>
      url.includes("script.google.com") ||
      url.includes("script.googleusercontent.com") ||
      url.includes("docs.google.com/spreadsheets") ||
      url.includes("spreadsheets.google.com"),
    "URL must be a Google Sheets or Apps Script Web App link"
  ),
});

// Simple in-memory rate limiter
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 10;
const RATE_WINDOW = 60 * 1000; // 1 minute

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW });
    return true;
  }
  if (entry.count >= RATE_LIMIT) return false;
  entry.count++;
  return true;
}

export async function POST(req: NextRequest) {
  try {
    // Rate limiting
    const ip = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "unknown";
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: "Too many requests. Please wait a moment and try again." },
        { status: 429 }
      );
    }

    const body = await req.json();

    // Zod validation
    const parsed = urlSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0]?.message || "Invalid URL" },
        { status: 400 }
      );
    }

    const { url } = parsed.data;

    // Check if it's a Google Apps Script Web App URL
    const isAppsScript = url.includes("script.google.com") || url.includes("script.googleusercontent.com");

    if (isAppsScript) {
      const res = await fetch(url, { redirect: "manual" });

      // Google Apps Script redirects to script.googleusercontent.com — allow only Google domains
      if (res.status >= 300 && res.status < 400) {
        const location = res.headers.get("location");
        if (
          location &&
          (location.includes("script.googleusercontent.com") || location.includes("script.google.com"))
        ) {
          const redirectRes = await fetch(location, { redirect: "manual" });
          if (!redirectRes.ok) {
            return NextResponse.json(
              { error: `Apps Script returned HTTP ${redirectRes.status}. Make sure you deployed as "Anyone" can access.` },
              { status: 400 }
            );
          }
          const data = await redirectRes.json();
          return NextResponse.json({ type: "apps-script", data });
        }
        return NextResponse.json(
          { error: "Unexpected redirect. Only Google Apps Script URLs are supported." },
          { status: 400 }
        );
      }

      if (!res.ok) {
        return NextResponse.json(
          { error: `Apps Script returned HTTP ${res.status}. Make sure you deployed as "Anyone" can access.` },
          { status: 400 }
        );
      }
      const data = await res.json();
      return NextResponse.json({ type: "apps-script", data });
    }

    // Google Sheets direct URL
    const idMatch = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
    if (!idMatch) {
      return NextResponse.json(
        { error: "Could not find spreadsheet ID in the URL" },
        { status: 400 }
      );
    }

    const spreadsheetId = idMatch[1];
    const gidMatch = url.match(/gid=(\d+)/);
    const gid = gidMatch ? gidMatch[1] : "0";

    let csvUrl: string;
    if (url.includes("/pub") && url.includes("output=csv")) {
      csvUrl = url;
    } else {
      csvUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/export?format=csv&gid=${gid}`;
    }

    const res = await fetch(csvUrl, {
      headers: { Accept: "text/csv" },
      redirect: "manual",
    });

    if (res.status >= 300 && res.status < 400) {
      return NextResponse.json(
        { error: 'Spreadsheet is not publicly accessible. Use the Apps Script Web App URL instead (recommended), or set the sheet to "Anyone with the link" → Viewer.' },
        { status: 400 }
      );
    }

    if (!res.ok) {
      return NextResponse.json(
        { error: `Failed to fetch spreadsheet (HTTP ${res.status}).` },
        { status: 400 }
      );
    }

    const csvText = await res.text();

    if (csvText.trim().startsWith("<!") || csvText.trim().startsWith("<html")) {
      return NextResponse.json(
        { error: 'Spreadsheet requires sign-in. Use the Apps Script Web App URL instead.' },
        { status: 400 }
      );
    }

    return NextResponse.json({ type: "csv", csv: csvText });
  } catch {
    return NextResponse.json(
      { error: "Failed to import data" },
      { status: 500 }
    );
  }
}
