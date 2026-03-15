import { useQuery } from "@tanstack/react-query";

interface CommitDay {
  date: string;
  count: number;
}

async function fetchGitHubEvents(username: string): Promise<CommitDay[]> {
  const res = await fetch(`/api/github/events?username=${encodeURIComponent(username)}`);
  if (!res.ok) throw new Error("Failed to fetch GitHub events");
  const json = await res.json();
  return json.commits || [];
}

export function useGitHubEvents(username: string) {
  return useQuery({
    queryKey: ["github-events", username],
    queryFn: () => fetchGitHubEvents(username),
    enabled: !!username,
    staleTime: 30 * 60 * 1000,
  });
}
