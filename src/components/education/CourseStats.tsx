"use client";
import { motion } from "framer-motion";

interface CourseStatsProps {
  stats: { total: number; completed: number; inProgress: number; totalHours: number };
}

export function CourseStats({ stats }: CourseStatsProps) {
  const items = [
    { label: "Total Courses", value: stats.total },
    { label: "Completed", value: stats.completed },
    { label: "In Progress", value: stats.inProgress },
    { label: "Total Hours", value: stats.totalHours },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      {items.map((item, i) => (
        <motion.div
          key={item.label}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
          className="glass-card rounded-2xl p-5 text-center"
        >
          <p className="font-mono text-xs text-white/30 uppercase tracking-widest mb-1">{item.label}</p>
          <p className="font-display font-bold text-2xl text-white">{item.value}</p>
        </motion.div>
      ))}
    </div>
  );
}
