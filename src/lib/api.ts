export async function fetchGitHubRepos() {
  try {
    const headers: HeadersInit = { Accept: "application/vnd.github.v3+json" };
    if (process.env.GITHUB_TOKEN) {
      headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
    }

    const res = await fetch(
      "https://api.github.com/users/Pavan-jillella/repos?per_page=100&type=owner&sort=stars&direction=desc",
      { headers, next: { revalidate: 3600 } }
    );

    if (!res.ok) return [];
    const repos = await res.json();
    return Array.isArray(repos) ? repos.slice(0, 6) : [];
  } catch {
    return [];
  }
}

export async function fetchLeetCodeStats() {
  try {
    const username = process.env.LEETCODE_USERNAME || "Punisher_17";
    const res = await fetch(
      `https://alfa-leetcode-api.onrender.com/userProfile/${username}`,
      { next: { revalidate: 3600 } }
    );

    const empty = { solved: 0, easy: 0, medium: 0, hard: 0, totalQuestions: 0, totalEasy: 0, totalMedium: 0, totalHard: 0 };
    if (!res.ok) return empty;
    const data = await res.json();

    return {
      solved: data.totalSolved ?? 0,
      easy: data.easySolved ?? 0,
      medium: data.mediumSolved ?? 0,
      hard: data.hardSolved ?? 0,
      totalQuestions: data.totalQuestions ?? 0,
      totalEasy: data.totalEasy ?? 0,
      totalMedium: data.totalMedium ?? 0,
      totalHard: data.totalHard ?? 0,
    };
  } catch {
    return { solved: 0, easy: 0, medium: 0, hard: 0, totalQuestions: 0, totalEasy: 0, totalMedium: 0, totalHard: 0 };
  }
}
