"use client";
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LeetCodeAcceptedSubmission } from "@/types";
import { ViewToggle, ViewMode } from "@/components/ui/ViewToggle";

interface SolvedQuestionsPanelProps {
  submissions: LeetCodeAcceptedSubmission[];
  totalCount: number;
  isLoading: boolean;
}

const PAGE_SIZE = 20;

export function SolvedQuestionsPanel({ submissions, totalCount, isLoading }: SolvedQuestionsPanelProps) {
  const [search, setSearch] = useState("");
  const [langFilter, setLangFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [viewMode, setViewMode] = useState<ViewMode>("list");

  // Deduplicate by titleSlug — keep most recent submission per problem
  const uniqueSubmissions = useMemo(() => {
    const seen = new Map<string, LeetCodeAcceptedSubmission>();
    for (const sub of submissions) {
      const existing = seen.get(sub.titleSlug);
      if (!existing || parseInt(sub.timestamp) > parseInt(existing.timestamp)) {
        seen.set(sub.titleSlug, sub);
      }
    }
    return Array.from(seen.values()).sort(
      (a, b) => parseInt(b.timestamp) - parseInt(a.timestamp)
    );
  }, [submissions]);

  // Extract unique languages
  const languages = useMemo(() => {
    const langSet = new Set(uniqueSubmissions.map((s) => s.lang));
    return Array.from(langSet).sort();
  }, [uniqueSubmissions]);

  // Filter and search
  const filtered = useMemo(() => {
    let result = uniqueSubmissions;
    if (langFilter !== "all") {
      result = result.filter((s) => s.lang === langFilter);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((s) => s.title.toLowerCase().includes(q));
    }
    return result;
  }, [uniqueSubmissions, langFilter, search]);

  // Paginate
  const paginated = filtered.slice(0, page * PAGE_SIZE);
  const hasMore = paginated.length < filtered.length;

  return (
    <motion.div
      className="glass-card rounded-2xl p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.35 }}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display font-semibold text-lg text-white">
          Solved Questions
          <span className="ml-2 font-mono text-xs text-white/30">
            {langFilter !== "all" || search
              ? `${filtered.length} of ${uniqueSubmissions.length}`
              : totalCount > 0
              ? totalCount
              : uniqueSubmissions.length}
          </span>
        </h3>
        <ViewToggle viewMode={viewMode} onChange={setViewMode} />
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <input
          type="text"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          placeholder="Search problems..."
          className="w-full bg-white/5 border border-white/10 text-white rounded-xl pl-10 pr-8 py-2.5 font-body text-sm placeholder-white/25 focus:outline-none focus:border-blue-500/50 transition-all"
        />
        {search && (
          <button
            onClick={() => {
              setSearch("");
              setPage(1);
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/20 hover:text-white/50 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Language filter chips */}
      {languages.length > 1 && (
        <div className="flex flex-wrap gap-2 mb-4">
          <button
            onClick={() => {
              setLangFilter("all");
              setPage(1);
            }}
            className={`px-3 py-1.5 rounded-full text-xs font-body transition-all ${
              langFilter === "all"
                ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                : "bg-white/4 text-white/30 border border-white/5 hover:bg-white/6 hover:text-white/50"
            }`}
          >
            All
          </button>
          {languages.map((lang) => (
            <button
              key={lang}
              onClick={() => {
                setLangFilter(lang);
                setPage(1);
              }}
              className={`px-3 py-1.5 rounded-full text-xs font-body transition-all ${
                langFilter === lang
                  ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                  : "bg-white/4 text-white/30 border border-white/5 hover:bg-white/6 hover:text-white/50"
              }`}
            >
              {lang}
            </button>
          ))}
        </div>
      )}

      {/* Loading state */}
      {isLoading && (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-10 rounded-xl bg-white/4 animate-pulse" />
          ))}
        </div>
      )}

      {/* Submission list */}
      {!isLoading && filtered.length > 0 && viewMode === "list" && (
        <div className="space-y-1">
          <AnimatePresence>
            {paginated.map((sub, i) => {
              const date = new Date(parseInt(sub.timestamp) * 1000);
              return (
                <motion.a
                  key={`${sub.titleSlug}-${sub.timestamp}`}
                  href={`https://leetcode.com/problems/${sub.titleSlug}/`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between py-2 px-3 rounded-xl hover:bg-white/5 transition-colors group"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i < PAGE_SIZE ? i * 0.02 : 0 }}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-2 h-2 rounded-full flex-shrink-0 bg-emerald-500" />
                    <span className="font-body text-sm text-white/70 group-hover:text-white truncate transition-colors">
                      {sub.title}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0 ml-3">
                    <span className="font-mono text-[10px] text-white/20 uppercase">{sub.lang}</span>
                    <span className="font-mono text-[10px] text-white/20">
                      {date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </span>
                  </div>
                </motion.a>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      {/* Grid view */}
      {!isLoading && filtered.length > 0 && viewMode === "grid" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {paginated.map((sub, i) => {
            const date = new Date(parseInt(sub.timestamp) * 1000);
            return (
              <motion.a
                key={`${sub.titleSlug}-${sub.timestamp}`}
                href={`https://leetcode.com/problems/${sub.titleSlug}/`}
                target="_blank"
                rel="noopener noreferrer"
                className="glass-card rounded-2xl p-5 block hover:bg-white/[0.02] hover:border-white/10 transition-all group"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i < PAGE_SIZE ? i * 0.03 : 0, duration: 0.3 }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="font-body text-sm text-white group-hover:text-blue-300 transition-colors truncate">
                    {sub.title}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded-full border border-white/8 bg-white/4 font-mono text-[10px] text-white/30 uppercase">
                    {sub.lang}
                  </span>
                  <span className="font-mono text-[10px] text-white/20">
                    {date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </span>
                </div>
              </motion.a>
            );
          })}
        </div>
      )}

      {/* Table view */}
      {!isLoading && filtered.length > 0 && viewMode === "table" && (
        <div className="glass-card rounded-2xl overflow-hidden -mx-6 -mb-6">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="px-4 py-3 font-mono text-[10px] text-white/30 uppercase tracking-wider">Title</th>
                  <th className="px-4 py-3 font-mono text-[10px] text-white/30 uppercase tracking-wider">Language</th>
                  <th className="px-4 py-3 font-mono text-[10px] text-white/30 uppercase tracking-wider text-right">Date</th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((sub) => {
                  const date = new Date(parseInt(sub.timestamp) * 1000);
                  return (
                    <tr key={`${sub.titleSlug}-${sub.timestamp}`} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors">
                      <td className="px-4 py-2.5">
                        <a href={`https://leetcode.com/problems/${sub.titleSlug}/`} target="_blank" rel="noopener noreferrer"
                           className="font-body text-xs text-white/70 hover:text-blue-300 transition-colors">
                          {sub.title}
                        </a>
                      </td>
                      <td className="px-4 py-2.5">
                        <span className="font-mono text-[10px] text-white/40 uppercase">{sub.lang}</span>
                      </td>
                      <td className="px-4 py-2.5 text-right">
                        <span className="font-mono text-xs text-white/30">
                          {date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Load more */}
      {!isLoading && hasMore && (
        <button
          onClick={() => setPage((p) => p + 1)}
          className="w-full py-3 mt-3 rounded-xl bg-white/4 text-white/30 font-body text-xs hover:bg-white/6 hover:text-white/50 transition-all"
        >
          Show more ({filtered.length - paginated.length} remaining)
        </button>
      )}

      {/* Empty state */}
      {!isLoading && filtered.length === 0 && (
        <p className="font-body text-sm text-white/20 text-center py-8">
          {search || langFilter !== "all"
            ? "No problems match your search."
            : "No accepted submissions found."}
        </p>
      )}
    </motion.div>
  );
}
