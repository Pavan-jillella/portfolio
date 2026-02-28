import { NextResponse } from "next/server";

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
      const username = process.env.LEETCODE_USERNAME || "pavanjillella";
      const lcRes = await fetch("https://leetcode.com/graphql", {
        method: "POST",
        headers: { "Content-Type": "application/json", Referer: "https://leetcode.com" },
        body: JSON.stringify({
          query: `query getUserProfile($username: String!) { matchedUser(username: $username) { submitStatsGlobal { acSubmissionNum { difficulty count } } } }`,
          variables: { username },
        }),
        next: { revalidate: 3600 },
      });
      if (lcRes.ok) {
        const lcData = await lcRes.json();
        const stats = lcData?.data?.matchedUser?.submitStatsGlobal?.acSubmissionNum;
        if (stats) {
          leetcode = {
            solved: stats.find((s: any) => s.difficulty === "All")?.count || 0,
            easy: stats.find((s: any) => s.difficulty === "Easy")?.count || 0,
            medium: stats.find((s: any) => s.difficulty === "Medium")?.count || 0,
            hard: stats.find((s: any) => s.difficulty === "Hard")?.count || 0,
          };
        }
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
