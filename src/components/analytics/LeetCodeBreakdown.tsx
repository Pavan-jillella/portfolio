"use client";
import { LeetCodeDashboardData } from "@/types";

interface LeetCodeBreakdownProps {
  data: LeetCodeDashboardData | undefined;
  isLoading: boolean;
}

export function LeetCodeBreakdown({ data, isLoading }: LeetCodeBreakdownProps) {
  if (isLoading) {
    return (
      <div className="glass-card rounded-2xl p-6 animate-pulse">
        <div className="h-4 bg-white/5 rounded w-32 mb-4" />
        <div className="h-32 bg-white/5 rounded" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="glass-card rounded-2xl p-6">
        <h3 className="font-display font-semibold text-sm text-white mb-4">LeetCode Progress</h3>
        <p className="font-body text-sm text-white/20 text-center py-8">
          Set your LeetCode username in Education Dashboard settings
        </p>
      </div>
    );
  }

  const categories = [
    { label: "Easy", solved: data.easy, total: data.totalEasy, color: "#10b981", bg: "bg-emerald-500/20" },
    { label: "Medium", solved: data.medium, total: data.totalMedium, color: "#f59e0b", bg: "bg-amber-500/20" },
    { label: "Hard", solved: data.hard, total: data.totalHard, color: "#ef4444", bg: "bg-red-500/20" },
  ];

  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const totalProgress = data.totalQuestions > 0 ? data.solved / data.totalQuestions : 0;

  return (
    <div className="glass-card rounded-2xl p-6">
      <h3 className="font-display font-semibold text-sm text-white mb-1">LeetCode Progress</h3>
      <p className="font-body text-xs text-white/30 mb-4">
        Rank #{data.ranking.toLocaleString()}
      </p>

      <div className="flex items-center gap-6">
        {/* Donut chart */}
        <div className="relative w-24 h-24 shrink-0">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r={radius} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
            <circle
              cx="50" cy="50" r={radius}
              fill="none"
              stroke="#3b82f6"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={circumference * (1 - totalProgress)}
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-mono text-lg text-white font-bold">{data.solved}</span>
            <span className="font-mono text-[8px] text-white/20">/ {data.totalQuestions}</span>
          </div>
        </div>

        {/* Difficulty bars */}
        <div className="flex-1 space-y-3">
          {categories.map((cat) => {
            const pct = cat.total > 0 ? (cat.solved / cat.total) * 100 : 0;
            return (
              <div key={cat.label}>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono text-[10px] text-white/40">{cat.label}</span>
                  <span className="font-mono text-[10px] text-white/30">
                    {cat.solved}/{cat.total}
                  </span>
                </div>
                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700 ease-out"
                    style={{ width: `${pct}%`, backgroundColor: cat.color }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
