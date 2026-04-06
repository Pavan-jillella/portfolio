"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { DifficultyBadge, TopicTag } from "../shared";
import { RecommendedProblem } from "../data/useTodaysPlan";
import { ExternalLink, CheckCircle2, Circle, Bookmark, BookmarkCheck } from "lucide-react";
import { TrackedProblem } from "@/types";

interface TodayProblemsProps {
  problems: RecommendedProblem[];
  solvedProblems?: Record<string, TrackedProblem>;
  bookmarkedIds?: string[];
  onSolve?: (problem: RecommendedProblem) => void;
  onBookmark?: (problemId: string) => void;
  className?: string;
}

export function TodayProblems({ 
  problems, 
  solvedProblems = {},
  bookmarkedIds = [],
  onSolve, 
  onBookmark,
  className 
}: TodayProblemsProps) {
  const solvedCount = problems.filter(p => solvedProblems[p.id]?.solved).length;

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <span>📝</span>
          Today&apos;s Problems
        </h3>
        <span className="text-sm text-white/60">
          {solvedCount}/{problems.length} solved
        </span>
      </div>

      <div className="space-y-3">
        {problems.map((problem, index) => {
          const isSolved = solvedProblems[problem.id]?.solved;
          const isBookmarked = bookmarkedIds.includes(problem.id);

          return (
            <motion.div
              key={problem.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={cn(
                "relative p-4 rounded-xl border transition-all duration-200",
                "hover:border-white/20 hover:bg-white/5",
                isSolved
                  ? "bg-emerald-500/10 border-emerald-500/20"
                  : "bg-white/5 border-white/10"
              )}
            >
              <div className="flex items-start gap-4">
                {/* Solve toggle */}
                <button
                  onClick={() => onSolve?.(problem)}
                  className={cn(
                    "mt-1 transition-colors",
                    isSolved ? "text-emerald-400" : "text-white/30 hover:text-white/60"
                  )}
                >
                  {isSolved ? (
                    <CheckCircle2 className="w-6 h-6" />
                  ) : (
                    <Circle className="w-6 h-6" />
                  )}
                </button>

                {/* Problem info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <a
                        href={problem.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={cn(
                          "font-medium hover:underline flex items-center gap-2 group",
                          isSolved ? "text-emerald-400" : "text-white"
                        )}
                      >
                        {problem.number > 0 && (
                          <span className="text-white/40">#{problem.number}</span>
                        )}
                        {problem.title}
                        <ExternalLink className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </a>
                      <div className="flex items-center gap-2 mt-2">
                        <DifficultyBadge difficulty={problem.difficulty} size="sm" />
                        <TopicTag topicId={problem.topicId} size="sm" />
                        {problem.source === "curriculum" && (
                          <span className="px-1.5 py-0.5 rounded bg-violet-500/20 text-violet-400 text-xs">
                            Curriculum
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Bookmark button */}
                    <button
                      onClick={() => onBookmark?.(problem.id)}
                      className={cn(
                        "p-2 rounded-lg transition-colors",
                        isBookmarked
                          ? "text-amber-400 bg-amber-500/10"
                          : "text-white/30 hover:text-white/60 hover:bg-white/5"
                      )}
                    >
                      {isBookmarked ? (
                        <BookmarkCheck className="w-5 h-5" />
                      ) : (
                        <Bookmark className="w-5 h-5" />
                      )}
                    </button>
                  </div>

                  {/* XP indicator */}
                  {!isSolved && (
                    <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between">
                      <span className="text-xs text-white/40">
                        {problem.difficulty === "easy" && "+10 XP"}
                        {problem.difficulty === "medium" && "+25 XP"}
                        {problem.difficulty === "hard" && "+50 XP"}
                      </span>
                      <a
                        href={problem.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
                      >
                        Solve now
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}

        {problems.length === 0 && (
          <div className="p-8 text-center text-white/40 bg-white/5 rounded-xl border border-white/10">
            <p>No problems scheduled for today.</p>
            <p className="text-sm mt-1">Check back tomorrow or explore the Practice arena!</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default TodayProblems;
