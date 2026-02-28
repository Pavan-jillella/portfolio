"use client";
import { motion } from "framer-motion";

const TYPE_COLORS: Record<string, string> = {
  study: "bg-blue-400",
  blog: "bg-purple-400",
  code: "bg-emerald-400",
  project: "bg-amber-400",
  note: "bg-pink-400",
  course: "bg-cyan-400",
};

const TYPE_LABELS: Record<string, string> = {
  study: "Study",
  blog: "Blog",
  code: "Code",
  project: "Project",
  note: "Note",
  course: "Course",
};

interface ActivityCardProps {
  id: string;
  type: string;
  title: string;
  description: string;
  timestamp: string;
  index: number;
}

export function ActivityCard({ type, title, description, timestamp, index }: ActivityCardProps) {
  const dotColor = TYPE_COLORS[type] || "bg-white/30";
  const label = TYPE_LABELS[type] || type;
  const timeStr = new Date(timestamp).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="relative pl-8 pb-6"
    >
      {/* Timeline line */}
      <div className="absolute left-[7px] top-3 bottom-0 w-px bg-white/5" />

      {/* Timeline dot */}
      <div className={`absolute left-0 top-2 w-[15px] h-[15px] rounded-full ${dotColor} border-2 border-charcoal-950`} />

      {/* Card */}
      <div className="glass-card rounded-xl p-4">
        <div className="flex items-center gap-2 mb-1">
          <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-mono ${dotColor}/20 text-white/60`}>
            {label}
          </span>
          <span className="font-mono text-[10px] text-white/20">{timeStr}</span>
        </div>
        <h4 className="font-body text-sm text-white font-medium">{title}</h4>
        <p className="font-body text-xs text-white/40 mt-1 line-clamp-2">{description}</p>
      </div>
    </motion.div>
  );
}
