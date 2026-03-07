import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 3600;

const EMPTY_RESPONSE = {
  solved: 0, easy: 0, medium: 0, hard: 0,
  totalQuestions: 0, totalEasy: 0, totalMedium: 0, totalHard: 0,
  ranking: 0, contributionPoints: 0,
  recentSubmissions: [], submissionCalendar: {},
};

const EMPTY_SUBMISSIONS = { count: 0, submissions: [] };

export async function GET(request: NextRequest) {
  try {
    const username = request.nextUrl.searchParams.get("username");
    const type = request.nextUrl.searchParams.get("type");
    const limit = request.nextUrl.searchParams.get("limit") || "100";

    if (!username) {
      return NextResponse.json(type === "acSubmissions" ? EMPTY_SUBMISSIONS : EMPTY_RESPONSE);
    }

    // Branch: accepted submissions
    if (type === "acSubmissions") {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 15000);
      try {
        const res = await fetch(
          `https://alfa-leetcode-api.onrender.com/${username}/acSubmission?limit=${limit}`,
          { signal: controller.signal, next: { revalidate: 3600 } }
        );
        clearTimeout(timeout);
        if (!res.ok) {
          return NextResponse.json(EMPTY_SUBMISSIONS);
        }
        const data = await res.json();
        const items = data.submission ?? data.submissions ?? [];
        return NextResponse.json({
          count: data.count ?? items.length,
          submissions: items.map((s: Record<string, unknown>, index: number) => ({
            id: (s.id as string) ?? `${s.titleSlug}-${s.timestamp}-${index}`,
            title: (s.title as string) ?? "",
            titleSlug: (s.titleSlug as string) ?? "",
            timestamp: String(s.timestamp ?? "0"),
            statusDisplay: (s.statusDisplay as string) ?? "Accepted",
            lang: (s.lang as string) ?? "",
          })),
        }, {
          headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=7200" },
        });
      } catch {
        clearTimeout(timeout);
        return NextResponse.json(EMPTY_SUBMISSIONS);
      }
    }

    // Default: profile data
    const res = await fetch(
      `https://alfa-leetcode-api.onrender.com/userProfile/${username}`,
      { next: { revalidate: 3600 } }
    );

    if (!res.ok) {
      return NextResponse.json(EMPTY_RESPONSE);
    }

    const data = await res.json();

    return NextResponse.json({
      solved: data.totalSolved ?? 0,
      easy: data.easySolved ?? 0,
      medium: data.mediumSolved ?? 0,
      hard: data.hardSolved ?? 0,
      totalQuestions: data.totalQuestions ?? 0,
      totalEasy: data.totalEasy ?? 0,
      totalMedium: data.totalMedium ?? 0,
      totalHard: data.totalHard ?? 0,
      ranking: data.ranking ?? 0,
      contributionPoints: data.contributionPoint ?? 0,
      recentSubmissions: (data.recentSubmissions ?? []).slice(0, 10).map((s: Record<string, unknown>) => ({
        title: s.title,
        titleSlug: s.titleSlug,
        timestamp: s.timestamp,
        statusDisplay: s.statusDisplay,
        lang: s.lang,
      })),
      submissionCalendar: data.submissionCalendar ?? {},
    }, {
      headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=7200" },
    });
  } catch {
    return NextResponse.json(EMPTY_RESPONSE);
  }
}
