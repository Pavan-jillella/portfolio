import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const headers: HeadersInit = { Accept: "application/vnd.github.v3+json" };
    if (process.env.GITHUB_TOKEN) {
      headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
    }

    const res = await fetch(
      "https://api.github.com/users/Pavan-jillella/repos?per_page=100&type=owner&sort=stars&direction=desc",
      { headers, next: { revalidate: 3600 } }
    );

    if (!res.ok) {
      return NextResponse.json([], { status: res.status });
    }

    const repos = await res.json();
    if (!Array.isArray(repos)) return NextResponse.json([]);

    const all = request.nextUrl.searchParams.get("all") === "true";

    if (all) {
      // Return all repos + language aggregation for dashboard
      const allRepos = repos.map((r: any) => ({
        id: r.id,
        name: r.name,
        description: r.description,
        stargazers_count: r.stargazers_count,
        forks_count: r.forks_count,
        language: r.language,
        html_url: r.html_url,
        topics: r.topics || [],
        updated_at: r.updated_at,
      }));

      const languageMap = new Map<string, number>();
      repos.forEach((r: any) => {
        const lang = r.language || "Other";
        languageMap.set(lang, (languageMap.get(lang) || 0) + 1);
      });
      const languages = Array.from(languageMap.entries())
        .map(([language, count]) => ({ language, count }))
        .sort((a, b) => b.count - a.count);

      const totalStars = repos.reduce((s: number, r: any) => s + (r.stargazers_count || 0), 0);
      const totalForks = repos.reduce((s: number, r: any) => s + (r.forks_count || 0), 0);

      return NextResponse.json({
        repos: allRepos,
        languages,
        stats: { totalRepos: repos.length, totalStars, totalForks },
      }, {
        headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=7200" },
      });
    }

    const topRepos = repos.slice(0, 6).map((r: any) => ({
      id: r.id,
      name: r.name,
      description: r.description,
      stargazers_count: r.stargazers_count,
      forks_count: r.forks_count,
      language: r.language,
      html_url: r.html_url,
      topics: r.topics || [],
    }));

    return NextResponse.json(topRepos, {
      headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=7200" },
    });
  } catch {
    return NextResponse.json([]);
  }
}
