"use client";
import { useLocalStorage } from "@/hooks/useLocalStorage";

export function useRecentSearches() {
  const [searches, setSearches] = useLocalStorage<string[]>("pj-recent-searches", []);

  function addSearch(query: string) {
    const trimmed = query.trim();
    if (!trimmed) return;
    setSearches((prev) => {
      const filtered = prev.filter((s) => s !== trimmed);
      return [trimmed, ...filtered].slice(0, 10);
    });
  }

  function clearSearches() {
    setSearches([]);
  }

  return { searches, addSearch, clearSearches };
}
