"use client";
import { useInfiniteQuery } from "@tanstack/react-query";

interface ActivityItem {
  id: string;
  type: string;
  title: string;
  description: string;
  timestamp: string;
  metadata?: Record<string, unknown>;
}

interface ActivityPage {
  items: ActivityItem[];
  nextCursor: string | null;
}

export function useActivityFeed(filter: string = "all") {
  return useInfiniteQuery<ActivityPage>({
    queryKey: ["activity-feed", filter],
    queryFn: async ({ pageParam }) => {
      const params = new URLSearchParams({ filter, limit: "20" });
      if (pageParam) params.set("cursor", pageParam as string);
      const res = await fetch(`/api/activity?${params}`);
      if (!res.ok) throw new Error("Failed to fetch activity");
      return res.json();
    },
    initialPageParam: "",
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    staleTime: 5 * 60 * 1000,
  });
}
