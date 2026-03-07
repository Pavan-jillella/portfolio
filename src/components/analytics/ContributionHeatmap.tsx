"use client";
import { useState, useMemo } from "react";
import { Chart3DWrapper } from "@/components/ui/Chart3DWrapper";

interface ContributionHeatmapProps {
  sessions: { date?: string; created_at?: string; duration_minutes: number }[];
}

export function ContributionHeatmap({ sessions }: ContributionHeatmapProps) {
  const [tooltip, setTooltip] = useState<{ x: number; y: number; text: string } | null>(null);

  const dayMap = useMemo(() => {
    const map = new Map<string, number>();
    sessions.forEach((s) => {
      const date = (s.date || s.created_at || "").split("T")[0];
      if (date) map.set(date, (map.get(date) || 0) + (s.duration_minutes || 0));
    });
    return map;
  }, [sessions]);

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

  function getColor(minutes: number): string {
    if (minutes === 0) return "fill-white/5";
    if (minutes < 30) return "fill-blue-900/50";
    if (minutes < 60) return "fill-blue-700/60";
    if (minutes < 120) return "fill-blue-500/70";
    return "fill-blue-400";
  }

  const cellSize = 12;
  const gap = 2;

  return (
    <div className="glass-card rounded-2xl p-6">
      <h3 className="font-display font-semibold text-sm text-white mb-4">Study Contribution Heatmap</h3>
      <div className="overflow-x-auto">
        <Chart3DWrapper tiltX={6} tiltY={-2}>
        <svg
          width={weeks.length * (cellSize + gap) + 30}
          height={7 * (cellSize + gap) + 20}
          className="block"
        >
          <defs>
            <filter id="heatmapCellShadow">
              <feDropShadow dx="1" dy="1" stdDeviation="1" floodColor="rgba(0,0,0,0.3)" />
            </filter>
          </defs>
          {["", "Mon", "", "Wed", "", "Fri", ""].map((label, i) => (
            <text
              key={i}
              x={0}
              y={i * (cellSize + gap) + cellSize + 10}
              className="fill-white/15 font-mono"
              fontSize={8}
            >
              {label}
            </text>
          ))}

          {weeks.map((week, wi) =>
            week.map((date, di) => {
              const minutes = dayMap.get(date) || 0;
              const dateObj = new Date(date);
              if (dateObj > today) return null;
              return (
                <rect
                  key={date}
                  x={wi * (cellSize + gap) + 28}
                  y={di * (cellSize + gap) + 4}
                  width={cellSize}
                  height={cellSize}
                  rx={2}
                  className={`${getColor(minutes)} transition-colors cursor-pointer hover:stroke-white/20 hover:stroke-1`}
                  style={minutes > 0 ? { filter: "url(#heatmapCellShadow)" } : undefined}
                  onMouseEnter={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    setTooltip({
                      x: rect.left + rect.width / 2,
                      y: rect.top - 8,
                      text: `${date}: ${minutes} min`,
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
        {["fill-white/5", "fill-blue-900/50", "fill-blue-700/60", "fill-blue-500/70", "fill-blue-400"].map((c, i) => (
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
