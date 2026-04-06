"use client";

import { cn } from "@/lib/utils";

interface DifficultyBadgeProps {
  difficulty: "easy" | "medium" | "hard";
  className?: string;
  size?: "sm" | "md";
}

const difficultyConfig = {
  easy: {
    label: "Easy",
    bg: "bg-emerald-500/20",
    border: "border-emerald-500/30",
    text: "text-emerald-400",
    dot: "bg-emerald-400",
  },
  medium: {
    label: "Medium",
    bg: "bg-amber-500/20",
    border: "border-amber-500/30",
    text: "text-amber-400",
    dot: "bg-amber-400",
  },
  hard: {
    label: "Hard",
    bg: "bg-red-500/20",
    border: "border-red-500/30",
    text: "text-red-400",
    dot: "bg-red-400",
  },
};

export function DifficultyBadge({ difficulty, className, size = "md" }: DifficultyBadgeProps) {
  const config = difficultyConfig[difficulty];
  
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border font-medium",
        config.bg,
        config.border,
        config.text,
        size === "sm" ? "px-2 py-0.5 text-xs" : "px-2.5 py-1 text-sm",
        className
      )}
    >
      <span className={cn("w-1.5 h-1.5 rounded-full", config.dot)} />
      {config.label}
    </span>
  );
}

export default DifficultyBadge;
