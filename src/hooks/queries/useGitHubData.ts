import { useQuery } from "@tanstack/react-query";
import { GitHubRepo, GitHubLanguageBreakdown } from "@/types";
import { GITHUB_LANGUAGE_COLORS } from "@/lib/constants";

interface GitHubData {
  repos: GitHubRepo[];
  stats: { totalRepos: number; totalStars: number; totalForks: number };
  languages: GitHubLanguageBreakdown[];
}

async function fetchGitHubData(username: string): Promise<GitHubData> {
  const res = await fetch(`/api/github?all=true&username=${encodeURIComponent(username)}`);
  if (!res.ok) throw new Error("Failed to fetch GitHub data");
  const json = await res.json();

  const repos: GitHubRepo[] = json.repos || [];
  const stats = json.stats || {
    totalRepos: repos.length,
    totalStars: repos.reduce((s: number, r: GitHubRepo) => s + r.stargazers_count, 0),
    totalForks: repos.reduce((s: number, r: GitHubRepo) => s + r.forks_count, 0),
  };

  const langMap = new Map<string, number>();
  repos.forEach((r) => {
    if (r.language) langMap.set(r.language, (langMap.get(r.language) || 0) + 1);
  });
  const languages: GitHubLanguageBreakdown[] = Array.from(langMap.entries())
    .map(([language, count]) => ({
      language,
      count,
      color: GITHUB_LANGUAGE_COLORS[language] || GITHUB_LANGUAGE_COLORS.Other,
    }))
    .sort((a, b) => b.count - a.count);

  return { repos, stats, languages };
}

export function useGitHubData(username: string) {
  return useQuery({
    queryKey: ["github-repos", username],
    queryFn: () => fetchGitHubData(username),
    enabled: !!username,
    staleTime: 30 * 60 * 1000,
  });
}
