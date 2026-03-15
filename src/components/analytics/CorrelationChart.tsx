"use client";
import { useMemo } from "react";
import { Chart3DWrapper } from "@/components/ui/Chart3DWrapper";

interface CorrelationChartProps {
  sessions: { date?: string; created_at?: string; duration_minutes: number }[];
  commitDays: { date: string; count: number }[];
}

export function CorrelationChart({ sessions, commitDays }: CorrelationChartProps) {
  const weeklyData = useMemo(() => {
    const weeks = new Map<string, { studyHours: number; commits: number }>();

    sessions.forEach((s) => {
      const date = new Date(s.date || s.created_at || "");
      if (isNaN(date.getTime())) return;
      const weekStart = new Date(date);
      weekStart.setDate(weekStart.getDate() - weekStart.getDay());
      const key = weekStart.toISOString().split("T")[0];
      const entry = weeks.get(key) || { studyHours: 0, commits: 0 };
      entry.studyHours += (s.duration_minutes || 0) / 60;
      weeks.set(key, entry);
    });

    commitDays.forEach((c) => {
      const date = new Date(c.date);
      if (isNaN(date.getTime())) return;
      const weekStart = new Date(date);
      weekStart.setDate(weekStart.getDate() - weekStart.getDay());
      const key = weekStart.toISOString().split("T")[0];
      const entry = weeks.get(key) || { studyHours: 0, commits: 0 };
      entry.commits += c.count;
      weeks.set(key, entry);
    });

    return Array.from(weeks.entries())
      .map(([week, data]) => ({
        week,
        studyHours: Math.round(data.studyHours * 10) / 10,
        commits: data.commits,
      }))
      .sort((a, b) => a.week.localeCompare(b.week))
      .slice(-12);
  }, [sessions, commitDays]);

  const width = 400;
  const height = 250;
  const padding = 45;

  const maxStudy = Math.max(...weeklyData.map((d) => d.studyHours), 1);
  const maxCommits = Math.max(...weeklyData.map((d) => d.commits), 1);

  const hasData = weeklyData.length > 0 && (weeklyData.some((d) => d.studyHours > 0) || weeklyData.some((d) => d.commits > 0));

  return (
    <div className="glass-card rounded-2xl p-6">
      <h3 className="font-display font-semibold text-sm text-white mb-1">Study vs Commits</h3>
      <p className="font-body text-xs text-white/30 mb-4">Weekly correlation (last 12 weeks)</p>

      {!hasData ? (
        <p className="font-body text-sm text-white/20 text-center py-8">No data yet</p>
      ) : (
        <Chart3DWrapper tiltX={8} tiltY={-4}>
          <svg viewBox={`0 0 ${width} ${height}`} className="w-full">
            <defs>
              <filter id="corrGlow">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Grid lines */}
            {[0, 0.25, 0.5, 0.75, 1].map((frac) => {
              const y = padding + (height - 2 * padding) * (1 - frac);
              return (
                <line key={frac} x1={padding} x2={width - padding} y1={y} y2={y} className="stroke-white/5" />
              );
            })}

            {/* Left Y-axis labels (study hours) */}
            {[0, 0.5, 1].map((frac) => {
              const y = padding + (height - 2 * padding) * (1 - frac);
              return (
                <text key={`s${frac}`} x={padding - 8} y={y + 3} textAnchor="end" className="fill-blue-400/40 font-mono" fontSize={8}>
                  {Math.round(maxStudy * frac)}h
                </text>
              );
            })}

            {/* Right Y-axis labels (commits) */}
            {[0, 0.5, 1].map((frac) => {
              const y = padding + (height - 2 * padding) * (1 - frac);
              return (
                <text key={`c${frac}`} x={width - padding + 8} y={y + 3} textAnchor="start" className="fill-emerald-400/40 font-mono" fontSize={8}>
                  {Math.round(maxCommits * frac)}
                </text>
              );
            })}

            {/* Study hours bars */}
            {weeklyData.map((d, i) => {
              const x = padding + ((width - 2 * padding) / (weeklyData.length - 1 || 1)) * i;
              const barHeight = (height - 2 * padding) * (d.studyHours / maxStudy);
              const barWidth = 8;
              return (
                <rect
                  key={`study-${d.week}`}
                  x={x - barWidth - 1}
                  y={height - padding - barHeight}
                  width={barWidth}
                  height={barHeight}
                  rx={2}
                  className="fill-blue-400/30"
                />
              );
            })}

            {/* Commits bars */}
            {weeklyData.map((d, i) => {
              const x = padding + ((width - 2 * padding) / (weeklyData.length - 1 || 1)) * i;
              const barHeight = (height - 2 * padding) * (d.commits / maxCommits);
              const barWidth = 8;
              return (
                <rect
                  key={`commit-${d.week}`}
                  x={x + 1}
                  y={height - padding - barHeight}
                  width={barWidth}
                  height={barHeight}
                  rx={2}
                  className="fill-emerald-400/30"
                />
              );
            })}

            {/* X-axis labels */}
            {weeklyData.map((d, i) => {
              const x = padding + ((width - 2 * padding) / (weeklyData.length - 1 || 1)) * i;
              return (
                <text key={`x-${d.week}`} x={x} y={height - 8} textAnchor="middle" className="fill-white/15 font-mono" fontSize={7}>
                  W{i + 1}
                </text>
              );
            })}
          </svg>
        </Chart3DWrapper>
      )}

      {/* Legend */}
      <div className="flex items-center gap-4 mt-3">
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-sm bg-blue-400/50" />
          <span className="font-mono text-[10px] text-white/20">Study hours</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-sm bg-emerald-400/50" />
          <span className="font-mono text-[10px] text-white/20">Commits</span>
        </div>
      </div>
    </div>
  );
}
