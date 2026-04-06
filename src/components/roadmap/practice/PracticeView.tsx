"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { RoadmapProgressV2, TrackedProblem } from "@/types";
import { ROADMAP_PHASES } from "@/lib/roadmap-data";
import { TOPIC_LEETCODE_MAP } from "@/lib/roadmap-leetcode-problems";
import { DifficultyBadge, TopicTag } from "../shared";
import { 
  Search, Filter, ExternalLink, CheckCircle2, Circle, 
  Bookmark, BookmarkCheck, Swords, Target, Grid3X3, List 
} from "lucide-react";

interface PracticeViewProps {
  progress: RoadmapProgressV2;
  onSolveProblem?: (problem: TrackedProblem) => void;
  onBookmark?: (problemId: string) => void;
  className?: string;
}

type ViewMode = "grid" | "list";
type FilterDifficulty = "all" | "easy" | "medium" | "hard";
type FilterStatus = "all" | "solved" | "unsolved" | "bookmarked";

export function PracticeView({ progress, onSolveProblem, onBookmark, className }: PracticeViewProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [filterDifficulty, setFilterDifficulty] = useState<FilterDifficulty>("all");
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all");
  const [filterPhase, setFilterPhase] = useState<number | null>(null);

  // Collect all problems from all topics
  const allProblems = useMemo(() => {
    const problems: Array<{
      id: string;
      title: string;
      number: number;
      difficulty: "easy" | "medium" | "hard";
      url: string;
      topicId: string;
      phaseId: number;
    }> = [];

    ROADMAP_PHASES.forEach(phase => {
      phase.topics.forEach(topic => {
        const topicProblems = TOPIC_LEETCODE_MAP[topic.id] || [];
        topicProblems.forEach(p => {
          if (!problems.find(existing => existing.id === p.id)) {
            problems.push({
              ...p,
              topicId: topic.id,
              phaseId: phase.id,
            });
          }
        });
      });
    });

    return problems;
  }, []);

  // Filter problems
  const filteredProblems = useMemo(() => {
    return allProblems.filter(problem => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        if (!problem.title.toLowerCase().includes(query) && 
            !problem.number.toString().includes(query)) {
          return false;
        }
      }

      // Difficulty filter
      if (filterDifficulty !== "all" && problem.difficulty !== filterDifficulty) {
        return false;
      }

      // Phase filter
      if (filterPhase !== null && problem.phaseId !== filterPhase) {
        return false;
      }

      // Status filter
      const isSolved = progress.problemsSolved[problem.id]?.solved;
      const isBookmarked = progress.bookmarkedProblems.includes(problem.id);

      if (filterStatus === "solved" && !isSolved) return false;
      if (filterStatus === "unsolved" && isSolved) return false;
      if (filterStatus === "bookmarked" && !isBookmarked) return false;

      return true;
    });
  }, [allProblems, searchQuery, filterDifficulty, filterStatus, filterPhase, progress]);

  // Stats
  const totalSolved = Object.values(progress.problemsSolved).filter(p => p.solved).length;
  const totalBookmarked = progress.bookmarkedProblems.length;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={cn("space-y-6 pb-24 md:pb-8", className)}
    >
      {/* Header Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-center">
          <p className="text-2xl font-bold text-emerald-400">{totalSolved}</p>
          <p className="text-sm text-white/50">Solved</p>
        </div>
        <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-center">
          <p className="text-2xl font-bold text-white">{allProblems.length}</p>
          <p className="text-sm text-white/50">Total Problems</p>
        </div>
        <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-center">
          <p className="text-2xl font-bold text-amber-400">{totalBookmarked}</p>
          <p className="text-sm text-white/50">Bookmarked</p>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
          <input
            type="text"
            placeholder="Search problems by name or number..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-emerald-500/50"
          />
        </div>

        {/* Filter Row */}
        <div className="flex flex-wrap gap-3 items-center">
          {/* Difficulty Filter */}
          <div className="flex items-center gap-1 p-1 rounded-lg bg-white/5 border border-white/10">
            {(["all", "easy", "medium", "hard"] as FilterDifficulty[]).map(diff => (
              <button type="button"
                key={diff}
                onClick={() => setFilterDifficulty(diff)}
                className={cn(
                  "px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
                  filterDifficulty === diff
                    ? diff === "easy" ? "bg-emerald-500/20 text-emerald-400"
                    : diff === "medium" ? "bg-amber-500/20 text-amber-400"
                    : diff === "hard" ? "bg-red-500/20 text-red-400"
                    : "bg-white/10 text-white"
                    : "text-white/50 hover:text-white/80"
                )}
              >
                {diff === "all" ? "All" : diff.charAt(0).toUpperCase() + diff.slice(1)}
              </button>
            ))}
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1 p-1 rounded-lg bg-white/5 border border-white/10">
            {(["all", "unsolved", "solved", "bookmarked"] as FilterStatus[]).map(status => (
              <button type="button"
                key={status}
                onClick={() => setFilterStatus(status)}
                className={cn(
                  "px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
                  filterStatus === status
                    ? "bg-white/10 text-white"
                    : "text-white/50 hover:text-white/80"
                )}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>

          {/* Phase Filter */}
          <select
            value={filterPhase ?? ""}
            onChange={(e) => setFilterPhase(e.target.value ? Number(e.target.value) : null)}
            className="px-3 py-2 rounded-lg bg-charcoal-800 border border-white/10 text-white text-sm focus:outline-none focus:border-emerald-500/50 cursor-pointer"
          >
            <option value="" className="bg-charcoal-800">All Phases</option>
            {ROADMAP_PHASES.map(phase => (
              <option key={phase.id} value={phase.id} className="bg-charcoal-800">
                Phase {phase.id}: {phase.title}
              </option>
            ))}
          </select>

          {/* View Toggle */}
          <div className="ml-auto flex items-center gap-1 p-1 rounded-lg bg-white/5 border border-white/10">
            <button type="button"
              onClick={() => setViewMode("list")}
              className={cn(
                "p-2 rounded-md transition-colors",
                viewMode === "list" ? "bg-white/10 text-white" : "text-white/50 hover:text-white/80"
              )}
            >
              <List className="w-4 h-4" />
            </button>
            <button type="button"
              onClick={() => setViewMode("grid")}
              className={cn(
                "p-2 rounded-md transition-colors",
                viewMode === "grid" ? "bg-white/10 text-white" : "text-white/50 hover:text-white/80"
              )}
            >
              <Grid3X3 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <p className="text-sm text-white/50">
        Showing {filteredProblems.length} of {allProblems.length} problems
      </p>

      {/* Problem List */}
      <div className={cn(
        viewMode === "grid" 
          ? "grid sm:grid-cols-2 lg:grid-cols-3 gap-4" 
          : "space-y-3"
      )}>
        {filteredProblems.map((problem, index) => {
          const isSolved = progress.problemsSolved[problem.id]?.solved;
          const isBookmarked = progress.bookmarkedProblems.includes(problem.id);

          return (
            <motion.div
              key={problem.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(index * 0.02, 0.5) }}
              className={cn(
                "p-4 rounded-xl border transition-all",
                "hover:border-white/20 hover:bg-white/5",
                isSolved
                  ? "bg-emerald-500/5 border-emerald-500/20"
                  : "bg-white/5 border-white/10"
              )}
            >
              <div className="flex items-start gap-3">
                {/* Solve toggle */}
                <button type="button"
                  onClick={() => {
                    if (!isSolved && onSolveProblem) {
                      onSolveProblem({
                        id: problem.id,
                        leetcodeNumber: problem.number,
                        title: problem.title,
                        difficulty: problem.difficulty,
                        url: problem.url,
                        topicId: problem.topicId,
                        phaseId: problem.phaseId,
                        tags: [],
                        solved: true,
                        solvedAt: new Date().toISOString(),
                        masteryLevel: 1,
                        attempts: 1,
                        bookmarked: isBookmarked,
                      });
                    }
                  }}
                  className={cn(
                    "mt-0.5 transition-colors",
                    isSolved ? "text-emerald-400" : "text-white/30 hover:text-white/60"
                  )}
                >
                  {isSolved ? (
                    <CheckCircle2 className="w-5 h-5" />
                  ) : (
                    <Circle className="w-5 h-5" />
                  )}
                </button>

                {/* Problem info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <a
                      href={problem.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={cn(
                        "font-medium hover:underline flex items-center gap-2 group",
                        isSolved ? "text-emerald-400" : "text-white"
                      )}
                    >
                      <span className="text-white/40">#{problem.number}</span>
                      <span className="truncate">{problem.title}</span>
                      <ExternalLink className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 flex-shrink-0" />
                    </a>

                    <button type="button"
                      onClick={() => onBookmark?.(problem.id)}
                      className={cn(
                        "p-1.5 rounded-lg transition-colors flex-shrink-0",
                        isBookmarked
                          ? "text-amber-400 bg-amber-500/10"
                          : "text-white/30 hover:text-white/60 hover:bg-white/5"
                      )}
                    >
                      {isBookmarked ? (
                        <BookmarkCheck className="w-4 h-4" />
                      ) : (
                        <Bookmark className="w-4 h-4" />
                      )}
                    </button>
                  </div>

                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                    <DifficultyBadge difficulty={problem.difficulty} size="sm" />
                    <TopicTag topicId={problem.topicId} phaseId={problem.phaseId} size="sm" />
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}

        {filteredProblems.length === 0 && (
          <div className="col-span-full p-12 text-center text-white/40 bg-white/5 rounded-xl border border-white/10">
            <Swords className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg">No problems found</p>
            <p className="text-sm mt-1">Try adjusting your filters</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default PracticeView;
