import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 3600;

const EMPTY_RESPONSE = {
  solved: 0, easy: 0, medium: 0, hard: 0,
  totalQuestions: 0, totalEasy: 0, totalMedium: 0, totalHard: 0,
  ranking: 0, contributionPoints: 0,
  recentSubmissions: [], submissionCalendar: {},
};

export async function GET(request: NextRequest) {
  try {
    const username = request.nextUrl.searchParams.get("username");
    if (!username) {
      return NextResponse.json(EMPTY_RESPONSE);
    }

    const res = await fetch(
      `https://alfa-leetcode-api.onrender.com/userProfile/${username}`,
      { next: { revalidate: 3600 } }
    );

    if (!res.ok) {
      return NextResponse.json({
        solved: 0, easy: 0, medium: 0, hard: 0,
        totalQuestions: 0, totalEasy: 0, totalMedium: 0, totalHard: 0,
        ranking: 0, contributionPoints: 0,
        recentSubmissions: [], submissionCalendar: {},
      });
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
      recentSubmissions: (data.recentSubmissions ?? []).slice(0, 10).map((s: any) => ({
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
    return NextResponse.json({
      solved: 0, easy: 0, medium: 0, hard: 0,
      totalQuestions: 0, totalEasy: 0, totalMedium: 0, totalHard: 0,
      ranking: 0, contributionPoints: 0,
      recentSubmissions: [], submissionCalendar: {},
    });
  }
}
