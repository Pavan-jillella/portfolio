"use client";
import { useMemo } from "react";
import { Chart3DWrapper } from "@/components/ui/Chart3DWrapper";

interface GrowthIndexCardProps {
  sessions: { date?: string; created_at?: string; duration_minutes: number }[];
  commitDays: { date: string; count: number }[];
  leetcodeCalendar?: Record<string, number>;
}

export function GrowthIndexCard({ sessions, commitDays, leetcodeCalendar }: GrowthIndexCardProps) {
  const monthlyScores = useMemo(() => {
    const months = new Map<string, { study: number; commits: number; leetcode: number }>();

    sessions.forEach((s) => {
      const date = s.date || s.created_at || "";
      const month = date.slice(0, 7);
      if (!month) return;
      const entry = months.get(month) || { study: 0, commits: 0, leetcode: 0 };
      entry.study += s.duration_minutes || 0;
      months.set(month, entry);
    });

    commitDays.forEach((c) => {
      const month = c.date.slice(0, 7);
      const entry = months.get(month) || { study: 0, commits: 0, leetcode: 0 };
      entry.commits += c.count;
      months.set(month, entry);
    });

    if (leetcodeCalendar) {
      Object.entries(leetcodeCalendar).forEach(([timestamp, count]) => {
        const date = new Date(Number(timestamp) * 1000);
        const month = date.toISOString().slice(0, 7);
        const entry = months.get(month) || { study: 0, commits: 0, leetcode: 0 };
        entry.leetcode += count;
        months.set(month, entry);
      });
    }

    const sorted = Array.from(months.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .slice(-6);

    const maxStudy = Math.max(...sorted.map(([, v]) => v.study), 1);
    const maxCommits = Math.max(...sorted.map(([, v]) => v.commits), 1);
    const maxLeetcode = Math.max(...sorted.map(([, v]) => v.leetcode), 1);

    return sorted.map(([month, data]) => ({
      month,
      study: data.study,
      commits: data.commits,
      leetcode: data.leetcode,
      score: Math.round(
        (data.study / maxStudy) * 35 +
        (data.commits / maxCommits) * 35 +
        (data.leetcode / maxLeetcode) * 30
      ),
    }));
  }, [sessions, commitDays, leetcodeCalendar]);

  const width = 200;
  const height = 60;

  const points = monthlyScores.map((d, i) => ({
    x: (width / (monthlyScores.length - 1 || 1)) * i,
    y: height - (d.score / 100) * height,
  }));

  const path = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");

  return (
    <div className="glass-card rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-display font-semibold text-sm text-white">Growth Index</h3>
          <p className="font-body text-xs text-white/30">35% study + 35% commits + 30% LeetCode</p>
        </div>
        {monthlyScores.length > 0 && (
          <div className="text-right">
            <span className="font-mono text-2xl text-blue-400 font-bold">
              {monthlyScores[monthlyScores.length - 1].score}
            </span>
            {monthlyScores.length > 1 && (() => {
              const delta = monthlyScores[monthlyScores.length - 1].score - monthlyScores[monthlyScores.length - 2].score;
              return delta !== 0 ? (
                <span className={`block font-mono text-[10px] ${delta > 0 ? "text-emerald-400" : "text-red-400"}`}>
                  {delta > 0 ? "+" : ""}{delta} from last month
                </span>
              ) : null;
            })()}
          </div>
        )}
      </div>

      {monthlyScores.length > 1 ? (
        <Chart3DWrapper tiltX={6} tiltY={-2}>
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-16">
          <defs>
            <filter id="growthGlow">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <path d={path} fill="none" className="stroke-blue-400" strokeWidth={2} filter="url(#growthGlow)" />
          {points.map((p, i) => (
            <circle key={i} cx={p.x} cy={p.y} r={2} className="fill-blue-400" style={{ filter: "drop-shadow(0 2px 3px rgba(0,0,0,0.4))" }} />
          ))}
        </svg>
        </Chart3DWrapper>
      ) : (
        <p className="font-body text-xs text-white/20 text-center py-4">Need more data</p>
      )}

      <div className="flex justify-between mt-2">
        {monthlyScores.map((d) => (
          <span key={d.month} className="font-mono text-[8px] text-white/15">{d.month.slice(5)}</span>
        ))}
      </div>

      {monthlyScores.length > 0 && (
        <div className="grid grid-cols-3 gap-3 mt-4 pt-3 border-t border-white/5">
          <div className="text-center">
            <span className="font-mono text-xs text-blue-400">
              {Math.round(monthlyScores[monthlyScores.length - 1].study / 60)}h
            </span>
            <p className="font-mono text-[8px] text-white/20 mt-0.5">Study</p>
          </div>
          <div className="text-center">
            <span className="font-mono text-xs text-emerald-400">
              {monthlyScores[monthlyScores.length - 1].commits}
            </span>
            <p className="font-mono text-[8px] text-white/20 mt-0.5">Commits</p>
          </div>
          <div className="text-center">
            <span className="font-mono text-xs text-amber-400">
              {monthlyScores[monthlyScores.length - 1].leetcode}
            </span>
            <p className="font-mono text-[8px] text-white/20 mt-0.5">LC Subs</p>
          </div>
        </div>
      )}
    </div>
  );
}
