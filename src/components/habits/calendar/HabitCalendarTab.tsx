"use client";
import { useState, useMemo } from "react";
import { Habit, HabitLog } from "@/types";
import { getHabitHeatmapData } from "@/lib/habit-utils";
import { HABIT_CATEGORY_COLORS } from "@/lib/constants";
import { FadeIn } from "@/components/ui/FadeIn";

interface HabitCalendarTabProps {
  habits: Habit[];
  logs: HabitLog[];
}

export function HabitCalendarTab({ habits, logs }: HabitCalendarTabProps) {
  const [selectedHabit, setSelectedHabit] = useState<string | null>(null);

  const filteredLogs = useMemo(() => {
    if (!selectedHabit) return logs;
    return logs.filter((l) => l.habit_id === selectedHabit);
  }, [logs, selectedHabit]);

  const filteredHabits = useMemo(() => {
    if (!selectedHabit) return habits;
    return habits.filter((h) => h.id === selectedHabit);
  }, [habits, selectedHabit]);

  const heatmapData = useMemo(
    () => getHabitHeatmapData(filteredLogs, filteredHabits, 365),
    [filteredLogs, filteredHabits]
  );

  // SVG dimensions
  const cellSize = 12;
  const cellGap = 2;
  const cols = 53; // weeks
  const rows = 7;
  const labelWidth = 30;
  const topPadding = 20;
  const width = labelWidth + cols * (cellSize + cellGap);
  const height = topPadding + rows * (cellSize + cellGap) + 30;

  const dayLabels = ["", "Mon", "", "Wed", "", "Fri", ""];
  const monthLabels = useMemo(() => {
    const labels: { label: string; x: number }[] = [];
    let lastMonth = -1;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 364);

    for (let i = 0; i < 365; i++) {
      const d = new Date(startDate);
      d.setDate(d.getDate() + i);
      const month = d.getMonth();
      if (month !== lastMonth) {
        const weekIdx = Math.floor(i / 7);
        labels.push({
          label: d.toLocaleString("en", { month: "short" }),
          x: labelWidth + weekIdx * (cellSize + cellGap),
        });
        lastMonth = month;
      }
    }
    return labels;
  }, []);

  function getCellColor(completions: number, total: number): string {
    if (total === 0 || completions === 0) return "rgba(255,255,255,0.03)";
    const pct = completions / total;
    if (pct >= 0.8) return "rgba(16,185,129,0.7)"; // emerald
    if (pct >= 0.5) return "rgba(16,185,129,0.45)";
    if (pct >= 0.25) return "rgba(16,185,129,0.25)";
    return "rgba(16,185,129,0.12)";
  }

  const [tooltip, setTooltip] = useState<{ x: number; y: number; text: string } | null>(null);

  return (
    <div className="space-y-6">
      {/* Habit filter */}
      <FadeIn>
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setSelectedHabit(null)}
            className={`px-3 py-1.5 rounded-full text-xs font-body transition-all ${
              !selectedHabit ? "glass-card text-blue-400" : "text-white/40 hover:text-white"
            }`}
          >
            All Habits
          </button>
          {habits.map((h) => (
            <button
              key={h.id}
              onClick={() => setSelectedHabit(h.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-body transition-all ${
                selectedHabit === h.id ? "glass-card text-blue-400" : "text-white/40 hover:text-white"
              }`}
            >
              <span
                className="inline-block w-1.5 h-1.5 rounded-full mr-1"
                style={{ backgroundColor: HABIT_CATEGORY_COLORS[h.category] }}
              />
              {h.name}
            </button>
          ))}
        </div>
      </FadeIn>

      {/* Heatmap */}
      <FadeIn delay={0.05}>
        <div className="glass-card rounded-2xl p-6 overflow-x-auto">
          <p className="font-mono text-[10px] text-white/30 uppercase tracking-widest mb-4">
            Habit Completions — Last 365 Days
          </p>

          <svg width={width} height={height} className="block">
            {/* Month labels */}
            {monthLabels.map((m, i) => (
              <text
                key={i}
                x={m.x}
                y={12}
                className="fill-white/20"
                style={{ fontSize: 9, fontFamily: "var(--font-mono)" }}
              >
                {m.label}
              </text>
            ))}

            {/* Day labels */}
            {dayLabels.map((label, i) => (
              <text
                key={i}
                x={0}
                y={topPadding + i * (cellSize + cellGap) + cellSize - 2}
                className="fill-white/20"
                style={{ fontSize: 9, fontFamily: "var(--font-mono)" }}
              >
                {label}
              </text>
            ))}

            {/* Grid cells */}
            {heatmapData.map((day, i) => {
              const col = Math.floor(i / 7);
              const row = i % 7;
              const x = labelWidth + col * (cellSize + cellGap);
              const y = topPadding + row * (cellSize + cellGap);

              return (
                <rect
                  key={day.date}
                  x={x}
                  y={y}
                  width={cellSize}
                  height={cellSize}
                  rx={2}
                  fill={getCellColor(day.completions, day.total)}
                  className="cursor-pointer"
                  onMouseEnter={(e) => {
                    setTooltip({
                      x: x,
                      y: y - 18,
                      text: `${day.date}: ${day.completions}/${day.total}`,
                    });
                  }}
                  onMouseLeave={() => setTooltip(null)}
                />
              );
            })}

            {/* Tooltip */}
            {tooltip && (
              <g>
                <rect
                  x={tooltip.x - 5}
                  y={tooltip.y - 6}
                  width={tooltip.text.length * 5.5 + 10}
                  height={16}
                  rx={4}
                  fill="rgba(0,0,0,0.8)"
                />
                <text
                  x={tooltip.x}
                  y={tooltip.y + 6}
                  className="fill-white"
                  style={{ fontSize: 9, fontFamily: "var(--font-mono)" }}
                >
                  {tooltip.text}
                </text>
              </g>
            )}
          </svg>

          {/* Legend */}
          <div className="flex items-center gap-2 mt-4">
            <span className="font-mono text-[9px] text-white/20">Less</span>
            {[0.03, 0.12, 0.25, 0.45, 0.7].map((opacity, i) => (
              <div
                key={i}
                className="w-3 h-3 rounded-sm"
                style={{
                  backgroundColor: i === 0 ? `rgba(255,255,255,${opacity})` : `rgba(16,185,129,${opacity})`,
                }}
              />
            ))}
            <span className="font-mono text-[9px] text-white/20">More</span>
          </div>
        </div>
      </FadeIn>
    </div>
  );
}
