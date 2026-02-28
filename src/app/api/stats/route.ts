import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const headers: HeadersInit = { Accept: "application/vnd.github.v3+json" };
    if (process.env.GITHUB_TOKEN) {
      headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
    }

    const [ghUserRes, ghReposRes] = await Promise.all([
      fetch("https://api.github.com/users/Pavan-jillella", { headers, next: { revalidate: 3600 } }).catch(() => null),
      fetch("https://api.github.com/users/Pavan-jillella/repos?per_page=100&type=owner", { headers, next: { revalidate: 3600 } }).catch(() => null),
    ]);

    let github = { repos: 0, stars: 0, followers: 0, contributions: 0 };
    if (ghUserRes?.ok && ghReposRes?.ok) {
      const user = await ghUserRes.json();
      const repos = await ghReposRes.json();
      const totalStars = Array.isArray(repos) ? repos.reduce((acc: number, r: any) => acc + (r.stargazers_count || 0), 0) : 0;
      github = { repos: user.public_repos || 0, stars: totalStars, followers: user.followers || 0, contributions: 0 };
    }

    let leetcode = { solved: 0, easy: 0, medium: 0, hard: 0 };
    try {
      const username = process.env.LEETCODE_USERNAME || "Punisher_17";
      const lcRes = await fetch(
        `https://alfa-leetcode-api.onrender.com/userProfile/${username}`,
        { next: { revalidate: 3600 } }
      );
      if (lcRes.ok) {
        const lcData = await lcRes.json();
        leetcode = {
          solved: lcData.totalSolved ?? 0,
          easy: lcData.easySolved ?? 0,
          medium: lcData.mediumSolved ?? 0,
          hard: lcData.hardSolved ?? 0,
        };
      }
    } catch {}

    return NextResponse.json({ github, leetcode });
  } catch {
    return NextResponse.json({
      github: { repos: 0, stars: 0, followers: 0, contributions: 0 },
      leetcode: { solved: 0, easy: 0, medium: 0, hard: 0 },
    });
  }
}
