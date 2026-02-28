"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useSearchIndex } from "@/hooks/useSearchIndex";
import { useRecentSearches } from "@/hooks/useRecentSearches";
import { SearchResultGroup } from "./SearchResultGroup";

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const { search } = useSearchIndex();
  const { searches: recentSearches, addSearch, clearSearches } = useRecentSearches();

  const results = query.trim() ? search(query) : [];

  // Group results by type
  const grouped = results.reduce<Record<string, typeof results>>((acc, r) => {
    if (!acc[r.type]) acc[r.type] = [];
    acc[r.type].push(r);
    return acc;
  }, {});

  const flatResults = Object.values(grouped).flat();

  const handleOpen = useCallback(() => {
    setOpen(true);
    setQuery("");
    setSelectedIndex(0);
  }, []);

  const handleClose = useCallback(() => {
    setOpen(false);
    setQuery("");
  }, []);

  const handleSelect = useCallback(
    (url: string) => {
      if (query.trim()) addSearch(query.trim());
      handleClose();
      router.push(url);
    },
    [query, addSearch, handleClose, router]
  );

  // Cmd+K listener
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (open) handleClose();
        else handleOpen();
      }
      if (e.key === "Escape" && open) {
        handleClose();
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, handleOpen, handleClose]);

  // Focus input on open
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  // Keyboard navigation
  function onInputKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => Math.min(prev + 1, flatResults.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === "Enter" && flatResults[selectedIndex]) {
      e.preventDefault();
      handleSelect(flatResults[selectedIndex].url || "/");
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm"
            onClick={handleClose}
          />

          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="fixed top-[20%] left-1/2 -translate-x-1/2 z-[101] w-[90vw] max-w-lg glass-card rounded-2xl overflow-hidden"
          >
            {/* Search input */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-white/5">
              <svg className="w-4 h-4 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setSelectedIndex(0);
                }}
                onKeyDown={onInputKeyDown}
                placeholder="Search notes, courses, projects, blog..."
                className="flex-1 bg-transparent text-white text-sm font-body placeholder-white/25 focus:outline-none"
              />
              <kbd className="hidden sm:inline-block px-1.5 py-0.5 rounded text-[10px] font-mono text-white/20 bg-white/5 border border-white/10">
                ESC
              </kbd>
            </div>

            {/* Results */}
            <div className="max-h-[50vh] overflow-y-auto p-2">
              {query.trim() && flatResults.length === 0 && (
                <p className="text-center font-body text-sm text-white/20 py-8">No results found</p>
              )}

              {query.trim() && flatResults.length > 0 && (() => {
                let runningIndex = 0;
                return Object.entries(grouped).map(([type, items]) => {
                  const startIdx = runningIndex;
                  runningIndex += items.length;
                  return (
                    <SearchResultGroup
                      key={type}
                      label={type}
                      count={items.length}
                      results={items}
                      selectedIndex={selectedIndex}
                      groupStartIndex={startIdx}
                      onSelect={handleSelect}
                    />
                  );
                });
              })()}

              {!query.trim() && recentSearches.length > 0 && (
                <div>
                  <div className="flex items-center justify-between px-3 mb-2">
                    <span className="font-mono text-[10px] text-white/20 uppercase tracking-wider">Recent</span>
                    <button
                      onClick={clearSearches}
                      className="font-mono text-[10px] text-white/15 hover:text-white/30 transition-colors"
                    >
                      Clear
                    </button>
                  </div>
                  {recentSearches.map((s) => (
                    <button
                      key={s}
                      onClick={() => setQuery(s)}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left hover:bg-white/4 transition-colors"
                    >
                      <svg className="w-3 h-3 text-white/15" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="font-body text-sm text-white/40">{s}</span>
                    </button>
                  ))}
                </div>
              )}

              {!query.trim() && recentSearches.length === 0 && (
                <p className="text-center font-body text-xs text-white/15 py-8">
                  Type to search across your dashboard
                </p>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center gap-4 px-4 py-2 border-t border-white/5">
              <span className="font-mono text-[10px] text-white/15">
                <kbd className="px-1 py-0.5 rounded bg-white/5 border border-white/10">↑↓</kbd> navigate
              </span>
              <span className="font-mono text-[10px] text-white/15">
                <kbd className="px-1 py-0.5 rounded bg-white/5 border border-white/10">↵</kbd> open
              </span>
              <span className="font-mono text-[10px] text-white/15">
                <kbd className="px-1 py-0.5 rounded bg-white/5 border border-white/10">esc</kbd> close
              </span>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
