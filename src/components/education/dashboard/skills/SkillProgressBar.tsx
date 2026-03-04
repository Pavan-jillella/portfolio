"use client";
import { motion } from "framer-motion";

interface SkillProgressBarProps {
  current: number;
  max: number;
  color: string;
}

export function SkillProgressBar({ current, max, color }: SkillProgressBarProps) {
  const pct = max > 0 ? Math.min((current / max) * 100, 100) : 0;

  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-2 rounded-full bg-white/5 overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </div>
      <span className="font-mono text-[10px] text-white/30 w-10 text-right">
        {current}/{max}
      </span>
    </div>
  );
}
