"use client";
import { useState, useMemo } from "react";
import { Chart3DWrapper } from "@/components/ui/Chart3DWrapper";

interface LeetCodeHeatmapProps {
  submissionCalendar: Record<string, number> | undefined;
  isLoading: boolean;
}

export function LeetCodeHeatmap({ submissionCalendar, isLoading }: LeetCodeHeatmapProps) {
  const [tooltip, setTooltip] = useState<{ x: number; y: number; text: string } | null>(null);

  const dayMap = useMemo(() => {
    if (!submissionCalendar) return new Map<string, number>();
    const map = new Map<string, number>();
    Object.entries(submissionCalendar).forEach(([timestamp, count]) => {
      const date = new Date(Number(timestamp) * 1000).toISOString().split("T")[0];
      map.set(date, count);
    });
    return map;
  }, [submissionCalendar]);

  if (isLoading) {
    return (
      <div className="glass-card rounded-2xl p-6 animate-pulse">
        <div className="h-4 bg-white/5 rounded w-40 mb-4" />
        <div className="h-24 bg-white/5 rounded" />
      </div>
    );
  }

  if (!submissionCalendar || dayMap.size === 0) {
    return (
      <div className="glass-card rounded-2xl p-6">
        <h3 className="font-display font-semibold text-sm text-white mb-4">LeetCode Activity</h3>
        <p className="font-body text-sm text-white/20 text-center py-8">No submission data available</p>
      </div>
    );
  }

  const today = new Date();
  const startDay = new Date(today);
  startDay.setDate(startDay.getDate() - 364);
  startDay.setDate(startDay.getDate() - startDay.getDay());

  const weeks: string[][] = [];
  const current = new Date(startDay);
  while (current <= today) {
    const week: string[] = [];
    for (let d = 0; d < 7; d++) {
      week.push(current.toISOString().split("T")[0]);
      current.setDate(current.getDate() + 1);
    }
    weeks.push(week);
  }

  function getColor(count: number): string {
    if (count === 0) return "fill-white/5";
    if (count <= 2) return "fill-emerald-900/50";
    if (count <= 5) return "fill-emerald-700/60";
    if (count <= 10) return "fill-emerald-500/70";
    return "fill-emerald-400";
  }

  const cellSize = 12;
  const gap = 2;
  const totalSubmissions = Array.from(dayMap.values()).reduce((a, b) => a + b, 0);

  return (
    <div className="glass-card rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display font-semibold text-sm text-white">LeetCode Activity</h3>
        <span className="font-mono text-[10px] text-white/20">{totalSubmissions} submissions</span>
      </div>

      <div className="overflow-x-auto">
        <Chart3DWrapper tiltX={6} tiltY={-2}>
          <svg
            width={weeks.length * (cellSize + gap) + 30}
            height={7 * (cellSize + gap) + 20}
            className="block"
          >
            {["", "Mon", "", "Wed", "", "Fri", ""].map((label, i) => (
              <text key={i} x={0} y={i * (cellSize + gap) + cellSize + 10} className="fill-white/15 font-mono" fontSize={8}>
                {label}
              </text>
            ))}

            {weeks.map((week, wi) =>
              week.map((date, di) => {
                const dateObj = new Date(date);
                if (dateObj > today) return null;
                const count = dayMap.get(date) || 0;
                return (
                  <rect
                    key={date}
                    x={wi * (cellSize + gap) + 28}
                    y={di * (cellSize + gap) + 4}
                    width={cellSize}
                    height={cellSize}
                    rx={2}
                    className={`${getColor(count)} transition-colors cursor-pointer hover:stroke-white/20 hover:stroke-1`}
                    onMouseEnter={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      setTooltip({
                        x: rect.left + rect.width / 2,
                        y: rect.top - 8,
                        text: `${date}: ${count} submission${count !== 1 ? "s" : ""}`,
                      });
                    }}
                    onMouseLeave={() => setTooltip(null)}
                  />
                );
              })
            )}
          </svg>
        </Chart3DWrapper>
      </div>

      <div className="flex items-center gap-1.5 mt-3">
        <span className="font-mono text-[10px] text-white/20">Less</span>
        {["fill-white/5", "fill-emerald-900/50", "fill-emerald-700/60", "fill-emerald-500/70", "fill-emerald-400"].map((c, i) => (
          <svg key={i} width={12} height={12}>
            <rect width={12} height={12} rx={2} className={c} />
          </svg>
        ))}
        <span className="font-mono text-[10px] text-white/20">More</span>
      </div>

      {tooltip && (
        <div
          className="fixed z-50 px-2 py-1 rounded bg-charcoal-900 border border-white/10 font-mono text-[10px] text-white/60 pointer-events-none -translate-x-1/2 -translate-y-full"
          style={{ left: tooltip.x, top: tooltip.y }}
        >
          {tooltip.text}
        </div>
      )}
    </div>
  );
}
