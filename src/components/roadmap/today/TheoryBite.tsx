"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { TheoryBite as TheoryBiteType } from "../data/useTodaysPlan";
import { ExternalLink, BookOpen, Clock, CheckCircle2 } from "lucide-react";

interface TheoryBiteProps {
  theory: TheoryBiteType | null;
  isRead?: boolean;
  onMarkRead?: () => void;
  className?: string;
}

export function TheoryBite({ theory, isRead = false, onMarkRead, className }: TheoryBiteProps) {
  if (!theory) {
    return (
      <div className={cn(
        "p-6 rounded-xl bg-white/5 border border-white/10 text-center",
        className
      )}>
        <BookOpen className="w-8 h-8 text-white/20 mx-auto mb-2" />
        <p className="text-white/40 text-sm">No theory scheduled for today</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "relative overflow-hidden rounded-xl border transition-all",
        isRead
          ? "bg-violet-500/10 border-violet-500/20"
          : "bg-gradient-to-br from-violet-500/10 to-purple-500/10 border-violet-500/20",
        className
      )}
    >
      {/* Background accent */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-violet-500/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
      
      <div className="relative p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl">📖</span>
              <span className="text-xs uppercase tracking-wider text-violet-400 font-medium">
                Theory Bite
              </span>
              {isRead && (
                <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs">
                  <CheckCircle2 className="w-3 h-3" />
                  Read
                </span>
              )}
            </div>
            
            <h4 className="text-lg font-semibold text-white mb-1">
              {theory.title}
            </h4>
            
            <div className="flex items-center gap-3 text-sm text-white/50">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {theory.estimatedTime}
              </span>
              <span>•</span>
              <span>{theory.source}</span>
            </div>
          </div>

          {!isRead && (
            <button
              onClick={onMarkRead}
              className="p-2 rounded-lg bg-violet-500/20 hover:bg-violet-500/30 text-violet-400 transition-colors"
            >
              <CheckCircle2 className="w-5 h-5" />
            </button>
          )}
        </div>

        <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/10">
          <span className="text-xs text-amber-400">+5 XP for reading</span>
          <a
            href={theory.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-violet-500/20 hover:bg-violet-500/30 text-violet-400 text-sm font-medium transition-colors"
          >
            Read Article
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </motion.div>
  );
}

export default TheoryBite;
