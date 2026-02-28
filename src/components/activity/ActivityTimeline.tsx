"use client";
import { useState, useEffect, useRef } from "react";
import { useActivityFeed } from "@/hooks/queries/useActivityFeed";
import { FilterChips } from "./FilterChips";
import { ActivityCard } from "./ActivityCard";

export function ActivityTimeline() {
  const [filter, setFilter] = useState("all");
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useActivityFeed(filter);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = loadMoreRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const items = data?.pages.flatMap((page) => page.items) || [];

  return (
    <div className="space-y-6">
      <FilterChips active={filter} onChange={setFilter} />

      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="glass-card rounded-xl p-4 animate-pulse">
              <div className="h-3 w-16 bg-white/5 rounded mb-2" />
              <div className="h-4 w-48 bg-white/5 rounded mb-1" />
              <div className="h-3 w-64 bg-white/5 rounded" />
            </div>
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="glass-card rounded-2xl p-8 text-center">
          <p className="font-body text-sm text-white/20">No activity found for this filter.</p>
        </div>
      ) : (
        <div className="relative">
          {items.map((item, i) => (
            <ActivityCard
              key={item.id}
              id={item.id}
              type={item.type}
              title={item.title}
              description={item.description}
              timestamp={item.timestamp}
              index={i}
            />
          ))}

          <div ref={loadMoreRef} className="h-10" />

          {isFetchingNextPage && (
            <div className="text-center py-4">
              <div className="inline-block w-5 h-5 border-2 border-white/10 border-t-blue-400 rounded-full animate-spin" />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
