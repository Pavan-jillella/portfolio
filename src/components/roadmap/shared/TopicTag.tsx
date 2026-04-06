"use client";

import { cn } from "@/lib/utils";
import { ROADMAP_PHASES } from "@/lib/roadmap-data";

interface TopicTagProps {
  topicId?: string;
  label?: string;
  phaseId?: number;
  className?: string;
  size?: "sm" | "md";
}

const phaseColors: Record<number, { bg: string; border: string; text: string }> = {
  1: { bg: "bg-emerald-500/15", border: "border-emerald-500/30", text: "text-emerald-400" },
  2: { bg: "bg-blue-500/15", border: "border-blue-500/30", text: "text-blue-400" },
  3: { bg: "bg-violet-500/15", border: "border-violet-500/30", text: "text-violet-400" },
  4: { bg: "bg-fuchsia-500/15", border: "border-fuchsia-500/30", text: "text-fuchsia-400" },
  5: { bg: "bg-orange-500/15", border: "border-orange-500/30", text: "text-orange-400" },
  6: { bg: "bg-amber-500/15", border: "border-amber-500/30", text: "text-amber-400" },
  7: { bg: "bg-rose-500/15", border: "border-rose-500/30", text: "text-rose-400" },
  8: { bg: "bg-cyan-500/15", border: "border-cyan-500/30", text: "text-cyan-400" },
};

function getPhaseFromTopicId(topicId: string): number {
  const prefix = topicId.split("-")[0];
  const phaseNum = parseInt(prefix.replace("p", ""));
  return isNaN(phaseNum) ? 1 : phaseNum;
}

export function TopicTag({ topicId, label, phaseId, className, size = "md" }: TopicTagProps) {
  const phase = phaseId ?? (topicId ? getPhaseFromTopicId(topicId) : 1);
  const colors = phaseColors[phase] || phaseColors[1];
  
  // Get label from topic ID if not provided
  let displayLabel = label;
  if (!displayLabel && topicId) {
    for (const p of ROADMAP_PHASES) {
      const topic = p.topics.find(t => t.id === topicId);
      if (topic) {
        displayLabel = topic.label.split("(")[0].trim();
        break;
      }
    }
  }
  displayLabel = displayLabel || topicId || "Topic";

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border font-medium",
        colors.bg,
        colors.border,
        colors.text,
        size === "sm" ? "px-1.5 py-0.5 text-xs" : "px-2 py-1 text-sm",
        className
      )}
    >
      {displayLabel}
    </span>
  );
}

export default TopicTag;
