"use client";
import { useState, useRef, useEffect } from "react";
import { SubscriptionCatalogEntry } from "@/types";
import { SUBSCRIPTION_CATALOG } from "@/lib/constants";

interface SubscriptionSearchProps {
  onSelect: (entry: SubscriptionCatalogEntry) => void;
  onCustom: (name: string) => void;
}

export function SubscriptionSearch({ onSelect, onCustom }: SubscriptionSearchProps) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const results = query.trim().length > 0
    ? SUBSCRIPTION_CATALOG.filter((e) =>
        e.name.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 8)
    : [];

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleSelect(entry: SubscriptionCatalogEntry) {
    setQuery(entry.name);
    setIsOpen(false);
    onSelect(entry);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && results.length === 0 && query.trim()) {
      e.preventDefault();
      onCustom(query.trim());
      setIsOpen(false);
    }
  }

  return (
    <div ref={ref} className="relative">
      <label className="block font-mono text-xs text-white/40 uppercase tracking-widest mb-1">
        Service
      </label>
      <input
        type="text"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setIsOpen(true);
        }}
        onFocus={() => query.trim() && setIsOpen(true)}
        onKeyDown={handleKeyDown}
        placeholder="Search Netflix, Spotify..."
        className="w-full bg-white/4 border border-white/8 rounded-xl px-4 py-2.5 font-body text-sm text-white placeholder-white/20 focus:outline-none focus:border-blue-500/40 transition-all"
      />
      {isOpen && results.length > 0 && (
        <div className="absolute z-50 mt-1 w-full bg-[#0f1118] border border-white/10 rounded-xl shadow-2xl overflow-hidden max-h-64 overflow-y-auto">
          {results.map((entry) => (
            <button
              key={entry.id}
              onClick={() => handleSelect(entry)}
              className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-white/5 transition-colors text-left"
            >
              <img
                src={`https://logo.clearbit.com/${entry.domain}`}
                alt=""
                className="w-6 h-6 rounded-md bg-white/10"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
              <div className="flex-1 min-w-0">
                <p className="font-body text-sm text-white truncate">{entry.name}</p>
                <p className="font-mono text-[10px] text-white/30">{entry.category}</p>
              </div>
              {entry.default_amount && (
                <span className="font-mono text-xs text-white/40">
                  ${entry.default_amount}/{entry.default_frequency === "yearly" ? "yr" : "mo"}
                </span>
              )}
            </button>
          ))}
        </div>
      )}
      {isOpen && query.trim().length > 0 && results.length === 0 && (
        <div className="absolute z-50 mt-1 w-full bg-[#0f1118] border border-white/10 rounded-xl shadow-2xl px-4 py-3">
          <p className="font-body text-xs text-white/30">
            No match found. Press Enter to add &quot;{query.trim()}&quot; as custom.
          </p>
        </div>
      )}
    </div>
  );
}
