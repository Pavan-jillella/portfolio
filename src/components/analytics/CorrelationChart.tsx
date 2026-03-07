"use client";
import { useMemo } from "react";
import { Chart3DWrapper } from "@/components/ui/Chart3DWrapper";

interface CorrelationChartProps {
  sessions: { date?: string; created_at?: string; duration_minutes: number }[];
  leetcodeSolved?: number;
}

export function CorrelationChart({ sessions, leetcodeSolved = 0 }: CorrelationChartProps) {
  const weeklyData = useMemo(() => {
    const weeks = new Map<string, number>();
    sessions.forEach((s) => {
      const date = new Date(s.date || s.created_at || "");
      if (isNaN(date.getTime())) return;
      const weekStart = new Date(date);
      weekStart.setDate(weekStart.getDate() - weekStart.getDay());
      const key = weekStart.toISOString().split("T")[0];
      weeks.set(key, (weeks.get(key) || 0) + (s.duration_minutes || 0));
    });

    return Array.from(weeks.entries())
      .map(([week, minutes]) => ({ week, hours: Math.round(minutes / 60 * 10) / 10 }))
      .sort((a, b) => a.week.localeCompare(b.week))
      .slice(-12);
  }, [sessions]);

  const width = 400;
  const height = 250;
  const padding = 40;

  const maxHours = Math.max(...weeklyData.map((d) => d.hours), 1);

  return (
    <div className="glass-card rounded-2xl p-6">
      <h3 className="font-display font-semibold text-sm text-white mb-1">Weekly Study Hours</h3>
      <p className="font-body text-xs text-white/30 mb-4">Last 12 weeks</p>

      {weeklyData.length === 0 ? (
        <p className="font-body text-sm text-white/20 text-center py-8">No study data yet</p>
      ) : (
        <Chart3DWrapper tiltX={8} tiltY={-4}>
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full">
          <defs>
            <filter id="correlationGlow">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          {[0, 0.25, 0.5, 0.75, 1].map((frac) => {
            const y = padding + (height - 2 * padding) * (1 - frac);
            const val = Math.round(maxHours * frac);
            return (
              <g key={frac}>
                <line x1={padding} x2={width - padding} y1={y} y2={y} className="stroke-white/5" />
                <text x={padding - 8} y={y + 3} textAnchor="end" className="fill-white/20 font-mono" fontSize={9}>
                  {val}h
                </text>
              </g>
            );
          })}

          {weeklyData.map((d, i) => {
            const x = padding + ((width - 2 * padding) / (weeklyData.length - 1 || 1)) * i;
            const y = padding + (height - 2 * padding) * (1 - d.hours / maxHours);
            return (
              <g key={d.week}>
                <circle cx={x} cy={y} r={4} className="fill-blue-400" style={{ filter: "drop-shadow(0 2px 3px rgba(0,0,0,0.4))" }} />
                <text x={x} y={height - 8} textAnchor="middle" className="fill-white/15 font-mono" fontSize={7}>
                  W{i + 1}
                </text>
              </g>
            );
          })}

          {weeklyData.length > 1 && (() => {
            const n = weeklyData.length;
            const xs = weeklyData.map((_, i) => i);
            const ys = weeklyData.map((d) => d.hours);
            const sumX = xs.reduce((a, b) => a + b, 0);
            const sumY = ys.reduce((a, b) => a + b, 0);
            const sumXY = xs.reduce((a, x, i) => a + x * ys[i], 0);
            const sumX2 = xs.reduce((a, x) => a + x * x, 0);
            const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX) || 0;
            const intercept = (sumY - slope * sumX) / n;

            const y1 = intercept;
            const y2 = slope * (n - 1) + intercept;

            const sx = padding;
            const sy = padding + (height - 2 * padding) * (1 - y1 / maxHours);
            const ex = width - padding;
            const ey = padding + (height - 2 * padding) * (1 - y2 / maxHours);

            return <line x1={sx} y1={sy} x2={ex} y2={ey} className="stroke-blue-400/30" strokeWidth={1.5} strokeDasharray="4 4" filter="url(#correlationGlow)" />;
          })()}
        </svg>
        </Chart3DWrapper>
      )}

      <div className="flex items-center gap-4 mt-3">
        <span className="font-mono text-[10px] text-white/20">Total LeetCode: {leetcodeSolved} solved</span>
      </div>
    </div>
  );
}
