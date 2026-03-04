import { useQuery } from "@tanstack/react-query";
import { LeetCodeDashboardData } from "@/types";

async function fetchLeetCodeData(username: string): Promise<LeetCodeDashboardData> {
  const res = await fetch(`/api/leetcode?username=${encodeURIComponent(username)}`);
  if (!res.ok) throw new Error("Failed to fetch LeetCode data");
  const json = await res.json();
  return {
    solved: json.solved ?? 0,
    easy: json.easy ?? 0,
    medium: json.medium ?? 0,
    hard: json.hard ?? 0,
    totalQuestions: json.totalQuestions ?? 0,
    totalEasy: json.totalEasy ?? 0,
    totalMedium: json.totalMedium ?? 0,
    totalHard: json.totalHard ?? 0,
    ranking: json.ranking ?? 0,
    contributionPoints: json.contributionPoints ?? 0,
    recentSubmissions: json.recentSubmissions ?? [],
    submissionCalendar: json.submissionCalendar ?? {},
  };
}

export function useLeetCodeData(username: string) {
  return useQuery({
    queryKey: ["leetcode-stats", username],
    queryFn: () => fetchLeetCodeData(username),
    enabled: !!username,
    staleTime: 30 * 60 * 1000,
  });
}
