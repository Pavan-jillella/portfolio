"use client";
import { useMemo } from "react";

interface GrowthIndexCardProps {
  sessions: { date?: string; created_at?: string; duration_minutes: number }[];
  commitDays: { date: string; count: number }[];
  leetcodeSolved: number;
}

export function GrowthIndexCard({ sessions, commitDays, leetcodeSolved }: GrowthIndexCardProps) {
  const monthlyScores = useMemo(() => {
    const months = new Map<string, { study: number; commits: number }>();

    sessions.forEach((s) => {
      const date = s.date || s.created_at || "";
      const month = date.slice(0, 7);
      if (!month) return;
      const entry = months.get(month) || { study: 0, commits: 0 };
      entry.study += s.duration_minutes || 0;
      months.set(month, entry);
    });

    commitDays.forEach((c) => {
      const month = c.date.slice(0, 7);
      const entry = months.get(month) || { study: 0, commits: 0 };
      entry.commits += c.count;
      months.set(month, entry);
    });

    const sorted = Array.from(months.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .slice(-6);

    const maxStudy = Math.max(...sorted.map(([, v]) => v.study), 1);
    const maxCommits = Math.max(...sorted.map(([, v]) => v.commits), 1);

    return sorted.map(([month, data]) => ({
      month,
      score: Math.round(
        ((data.study / maxStudy) * 40 + (data.commits / maxCommits) * 40 + Math.min(leetcodeSolved / 100, 1) * 20)
      ),
    }));
  }, [sessions, commitDays, leetcodeSolved]);

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
          <p className="font-body text-xs text-white/30">Composite monthly score</p>
        </div>
        {monthlyScores.length > 0 && (
          <span className="font-mono text-2xl text-blue-400 font-bold">
            {monthlyScores[monthlyScores.length - 1].score}
          </span>
        )}
      </div>

      {monthlyScores.length > 1 ? (
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-16">
          <path d={path} fill="none" className="stroke-blue-400" strokeWidth={2} />
          {points.map((p, i) => (
            <circle key={i} cx={p.x} cy={p.y} r={2} className="fill-blue-400" />
          ))}
        </svg>
      ) : (
        <p className="font-body text-xs text-white/20 text-center py-4">Need more data</p>
      )}

      <div className="flex justify-between mt-2">
        {monthlyScores.map((d) => (
          <span key={d.month} className="font-mono text-[8px] text-white/15">{d.month.slice(5)}</span>
        ))}
      </div>
    </div>
  );
}
