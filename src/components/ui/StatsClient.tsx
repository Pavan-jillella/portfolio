"use client";
import { AnimatedCounter } from "./AnimatedCounter";

interface StatsData {
  github: { repos: number; stars: number; followers: number; contributions: number };
  leetcode: { solved: number; easy: number; medium: number; hard: number; totalQuestions: number; totalEasy: number; totalMedium: number; totalHard: number };
}

export function StatsClient({ data }: { data: StatsData }) {
  const githubItems = [
    { label: "GitHub Repos", value: data.github.repos, suffix: "" },
    { label: "Total Stars", value: data.github.stars, suffix: "+" },
    { label: "Followers", value: data.github.followers, suffix: "" },
    { label: "Contributions", value: data.github.contributions, suffix: "+" },
  ];

  const leetcodeItems = [
    { label: "LeetCode Solved", value: data.leetcode.solved, total: data.leetcode.totalQuestions, barColor: "bg-blue-500" },
    { label: "Easy", value: data.leetcode.easy, total: data.leetcode.totalEasy, barColor: "bg-emerald-500" },
    { label: "Medium", value: data.leetcode.medium, total: data.leetcode.totalMedium, barColor: "bg-amber-500" },
    { label: "Hard", value: data.leetcode.hard, total: data.leetcode.totalHard, barColor: "bg-red-500" },
  ];

  return (
    <div className="space-y-5">
      {/* GitHub stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
        {githubItems.map((item) => (
          <div key={item.label} className="glass-card rounded-3xl p-7 flex flex-col gap-3">
            <div className="font-display font-bold text-3xl md:text-4xl text-white">
              <AnimatedCounter target={item.value} suffix={item.suffix} />
            </div>
            <div className="font-mono text-xs text-white/30 uppercase tracking-widest">
              {item.label}
            </div>
          </div>
        ))}
      </div>

      {/* LeetCode stats with progress bars */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
        {leetcodeItems.map((item) => {
          const pct = item.total > 0 ? (item.value / item.total) * 100 : 0;
          return (
            <div key={item.label} className="glass-card rounded-3xl p-7 flex flex-col gap-3">
              <div className="font-display font-bold text-3xl md:text-4xl text-white">
                <AnimatedCounter target={item.value} />
                {item.total > 0 && (
                  <span className="text-base text-white/20 font-normal ml-1">/ {item.total}</span>
                )}
              </div>
              {item.total > 0 && (
                <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${item.barColor} transition-all duration-1000`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              )}
              <div className="font-mono text-xs text-white/30 uppercase tracking-widest">
                {item.label}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
