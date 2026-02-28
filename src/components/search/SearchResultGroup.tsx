"use client";
import { SearchResult } from "./SearchResult";

interface SearchResultGroupProps {
  label: string;
  count: number;
  results: { id: string; type: string; title: string; description: string; url?: string }[];
  selectedIndex: number;
  groupStartIndex: number;
  onSelect: (url: string) => void;
}

export function SearchResultGroup({
  label,
  count,
  results,
  selectedIndex,
  groupStartIndex,
  onSelect,
}: SearchResultGroupProps) {
  return (
    <div className="mb-3">
      <div className="flex items-center justify-between px-3 mb-1">
        <span className="font-mono text-[10px] text-white/20 uppercase tracking-wider">{label}</span>
        <span className="font-mono text-[10px] text-white/15">{count}</span>
      </div>
      {results.map((r, i) => (
        <SearchResult
          key={r.id}
          type={r.type}
          title={r.title}
          description={r.description}
          isSelected={selectedIndex === groupStartIndex + i}
          onClick={() => onSelect(r.url || "/")}
        />
      ))}
    </div>
  );
}
