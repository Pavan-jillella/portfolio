"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { DifficultyBadge, TopicTag } from "../shared";
import { RecommendedProblem } from "../data/useTodaysPlan";
import { 
  ExternalLink, CheckCircle2, Circle, Bookmark, BookmarkCheck,
  ChevronDown, ChevronUp, FileCode2, Lightbulb, Save
} from "lucide-react";
import { TrackedProblem } from "@/types";

interface TodayProblemsProps {
  problems: RecommendedProblem[];
  solvedProblems?: Record<string, TrackedProblem>;
  bookmarkedIds?: string[];
  onSolve?: (problem: RecommendedProblem) => void;
  onBookmark?: (problemId: string) => void;
  onSaveNotes?: (problemId: string, solution: string, explanation: string) => void;
  className?: string;
}

export function TodayProblems({ 
  problems, 
  solvedProblems = {},
  bookmarkedIds = [],
  onSolve, 
  onBookmark,
  onSaveNotes,
  className 
}: TodayProblemsProps) {
  const solvedCount = problems.filter(p => solvedProblems[p.id]?.solved).length;
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [editingSolution, setEditingSolution] = useState<Record<string, string>>({});
  const [editingExplanation, setEditingExplanation] = useState<Record<string, string>>({});

  const handleToggleExpand = (problemId: string) => {
    if (expandedId === problemId) {
      setExpandedId(null);
    } else {
      setExpandedId(problemId);
      // Initialize with existing values
      const solved = solvedProblems[problemId];
      if (solved) {
        setEditingSolution(prev => ({ ...prev, [problemId]: solved.solution || "" }));
        setEditingExplanation(prev => ({ ...prev, [problemId]: solved.explanation || "" }));
      }
    }
  };

  const handleSaveNotes = (problemId: string) => {
    onSaveNotes?.(
      problemId,
      editingSolution[problemId] || "",
      editingExplanation[problemId] || ""
    );
    setExpandedId(null);
  };

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <span>📝</span>
          Today&apos;s Problems
        </h3>
        <span className="text-sm text-muted-foreground">
          {solvedCount}/{problems.length} solved
        </span>
      </div>

      <div className="space-y-3">
        {problems.map((problem, index) => {
          const isSolved = solvedProblems[problem.id]?.solved;
          const isBookmarked = bookmarkedIds.includes(problem.id);
          const isExpanded = expandedId === problem.id;
          const solvedProblem = solvedProblems[problem.id];
          const hasSolution = solvedProblem?.solution || solvedProblem?.explanation;

          return (
            <motion.div
              key={problem.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={cn(
                "relative rounded-xl border transition-all duration-200",
                "hover:border-gold/30",
                isSolved
                  ? "bg-sage/10 border-sage/20"
                  : "bg-glass-white border-glass-border"
              )}
            >
              <div className="p-4">
                <div className="flex items-start gap-4">
                  {/* Solve toggle */}
                  <button type="button"
                    onClick={() => onSolve?.(problem)}
                    className={cn(
                      "mt-1 transition-colors",
                      isSolved ? "text-sage" : "text-muted-foreground hover:text-foreground"
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
                            isSolved ? "text-sage-dark" : "text-foreground"
                          )}
                        >
                          {problem.number > 0 && (
                            <span className="text-muted-foreground">#{problem.number}</span>
                          )}
                          {problem.title}
                          <ExternalLink className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </a>
                        <div className="flex items-center gap-2 mt-2">
                          <DifficultyBadge difficulty={problem.difficulty} size="sm" />
                          <TopicTag topicId={problem.topicId} size="sm" />
                          {problem.source === "curriculum" && (
                            <span className="px-1.5 py-0.5 rounded bg-gold/20 text-gold-dark text-xs">
                              Curriculum
                            </span>
                          )}
                          {hasSolution && (
                            <span className="px-1.5 py-0.5 rounded bg-sage/20 text-sage-dark text-xs flex items-center gap-1">
                              <FileCode2 className="w-3 h-3" />
                              Notes
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-1">
                        {/* Expand button for solved problems */}
                        {isSolved && (
                          <button
                            type="button"
                            onClick={() => handleToggleExpand(problem.id)}
                            className={cn(
                              "p-2 rounded-lg transition-colors",
                              isExpanded
                                ? "text-gold bg-gold/10"
                                : "text-muted-foreground hover:text-foreground hover:bg-glass-hover"
                            )}
                            title={isExpanded ? "Close notes" : "Add solution & explanation"}
                          >
                            {isExpanded ? (
                              <ChevronUp className="w-5 h-5" />
                            ) : (
                              <ChevronDown className="w-5 h-5" />
                            )}
                          </button>
                        )}

                        {/* Bookmark button */}
                        <button type="button"
                          onClick={() => onBookmark?.(problem.id)}
                          className={cn(
                            "p-2 rounded-lg transition-colors",
                            isBookmarked
                              ? "text-gold bg-gold/10"
                              : "text-muted-foreground hover:text-foreground hover:bg-glass-hover"
                          )}
                        >
                          {isBookmarked ? (
                            <BookmarkCheck className="w-5 h-5" />
                          ) : (
                            <Bookmark className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* XP indicator for unsolved */}
                    {!isSolved && (
                      <div className="mt-3 pt-3 border-t border-glass-border flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">
                          {problem.difficulty === "easy" && "+10 XP"}
                          {problem.difficulty === "medium" && "+25 XP"}
                          {problem.difficulty === "hard" && "+50 XP"}
                        </span>
                        <a
                          href={problem.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-gold hover:text-gold-dark flex items-center gap-1"
                        >
                          Solve now
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Solution & Explanation Section */}
              <AnimatePresence>
                {isExpanded && isSolved && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 pb-4 pt-2 border-t border-glass-border space-y-4">
                      {/* Solution Code */}
                      <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
                          <FileCode2 className="w-4 h-4 text-gold" />
                          Your Solution
                        </label>
                        <textarea
                          value={editingSolution[problem.id] || ""}
                          onChange={(e) => setEditingSolution(prev => ({ 
                            ...prev, 
                            [problem.id]: e.target.value 
                          }))}
                          placeholder="Paste your solution code here..."
                          className={cn(
                            "w-full h-32 p-3 rounded-lg text-sm font-mono",
                            "bg-charcoal-950 border border-glass-border",
                            "text-foreground placeholder:text-muted-foreground",
                            "focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold/50",
                            "resize-y"
                          )}
                        />
                      </div>

                      {/* Explanation */}
                      <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
                          <Lightbulb className="w-4 h-4 text-gold" />
                          Explanation & Approach
                        </label>
                        <textarea
                          value={editingExplanation[problem.id] || ""}
                          onChange={(e) => setEditingExplanation(prev => ({ 
                            ...prev, 
                            [problem.id]: e.target.value 
                          }))}
                          placeholder="Explain your approach, time/space complexity, key insights..."
                          className={cn(
                            "w-full h-24 p-3 rounded-lg text-sm",
                            "bg-charcoal-950 border border-glass-border",
                            "text-foreground placeholder:text-muted-foreground",
                            "focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold/50",
                            "resize-y"
                          )}
                        />
                      </div>

                      {/* Save button */}
                      <div className="flex justify-end">
                        <button
                          type="button"
                          onClick={() => handleSaveNotes(problem.id)}
                          className={cn(
                            "px-4 py-2 rounded-lg text-sm font-medium",
                            "bg-gold text-charcoal-950 hover:bg-gold-light",
                            "flex items-center gap-2 transition-colors"
                          )}
                        >
                          <Save className="w-4 h-4" />
                          Save Notes
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}

        {problems.length === 0 && (
          <div className="p-8 text-center text-muted-foreground bg-glass-white rounded-xl border border-glass-border">
            <p>No problems scheduled for today.</p>
            <p className="text-sm mt-1">Check back tomorrow or explore the Practice arena!</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default TodayProblems;
