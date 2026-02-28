import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();

    if (!url || typeof url !== "string") {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    // Validate it's a Google Sheets published CSV URL
    const isGoogleSheets =
      url.includes("docs.google.com/spreadsheets") ||
      url.includes("spreadsheets.google.com");

    if (!isGoogleSheets) {
      return NextResponse.json(
        { error: "URL must be a Google Sheets link" },
        { status: 400 }
      );
    }

    // Convert to CSV export URL if needed
    let csvUrl = url;
    if (!url.includes("/export?") && !url.includes("output=csv")) {
      // Convert share/edit URL to CSV export
      const match = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
      if (match) {
        csvUrl = `https://docs.google.com/spreadsheets/d/${match[1]}/export?format=csv`;
      }
    }

    const res = await fetch(csvUrl, {
      headers: { Accept: "text/csv" },
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: "Failed to fetch spreadsheet. Make sure it is published to the web." },
        { status: 400 }
      );
    }

    const csvText = await res.text();
    return NextResponse.json({ csv: csvText });
  } catch {
    return NextResponse.json(
      { error: "Failed to import spreadsheet" },
      { status: 500 }
    );
  }
}
