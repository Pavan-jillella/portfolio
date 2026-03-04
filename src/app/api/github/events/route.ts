import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const username = request.nextUrl.searchParams.get("username");
    if (!username) {
      return NextResponse.json({ commits: [] });
    }

    const headers: HeadersInit = { Accept: "application/vnd.github.v3+json" };
    if (process.env.GITHUB_TOKEN) {
      headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
    }

    const res = await fetch(
      `https://api.github.com/users/${encodeURIComponent(username)}/events?per_page=100`,
      { headers, next: { revalidate: 3600 } }
    );

    if (!res.ok) {
      return NextResponse.json({ commits: [] });
    }

    const events = await res.json();
    const commitMap = new Map<string, number>();

    events
      .filter((e: any) => e.type === "PushEvent")
      .forEach((e: any) => {
        const date = new Date(e.created_at).toISOString().split("T")[0];
        const count = e.payload?.commits?.length || 0;
        commitMap.set(date, (commitMap.get(date) || 0) + count);
      });

    const commits = Array.from(commitMap.entries())
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date));

    return NextResponse.json(
      { commits },
      { headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=7200" } }
    );
  } catch {
    return NextResponse.json({ commits: [] });
  }
}
