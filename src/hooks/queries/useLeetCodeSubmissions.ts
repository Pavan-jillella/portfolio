import { useQuery } from "@tanstack/react-query";
import { LeetCodeAcceptedSubmissionsResponse } from "@/types";

async function fetchAcceptedSubmissions(
  username: string,
  limit: number
): Promise<LeetCodeAcceptedSubmissionsResponse> {
  const res = await fetch(
    `/api/leetcode?username=${encodeURIComponent(username)}&type=acSubmissions&limit=${limit}`
  );
  if (!res.ok) throw new Error("Failed to fetch accepted submissions");
  const json = await res.json();
  return {
    count: json.count ?? 0,
    submissions: json.submissions ?? [],
  };
}

export function useLeetCodeSubmissions(username: string, limit = 100) {
  return useQuery({
    queryKey: ["leetcode-submissions", username, limit],
    queryFn: () => fetchAcceptedSubmissions(username, limit),
    enabled: !!username,
    staleTime: 30 * 60 * 1000,
  });
}
