"use client";
import { useMemo } from "react";
import { motion } from "framer-motion";
import { Habit, HabitLog } from "@/types";
import { getCategoryScores, getWeeklyScore, calculateLongestStreak } from "@/lib/habit-utils";
import { HABIT_CATEGORY_COLORS } from "@/lib/constants";
import { FadeIn } from "@/components/ui/FadeIn";

interface HabitAnalyticsTabProps {
  habits: Habit[];
  logs: HabitLog[];
}

export function HabitAnalyticsTab({ habits, logs }: HabitAnalyticsTabProps) {
  const categoryScores = useMemo(() => getCategoryScores(habits, logs), [habits, logs]);
  const weeklyScore = useMemo(() => getWeeklyScore(habits, logs), [habits, logs]);

  // Weekly scores for last 12 weeks
  const weeklyTrend = useMemo(() => {
    const weeks: { label: string; score: number }[] = [];
    const today = new Date();
    for (let i = 11; i >= 0; i--) {
      const weekEnd = new Date(today);
      weekEnd.setDate(weekEnd.getDate() - i * 7);
      const weekStart = new Date(weekEnd);
      weekStart.setDate(weekStart.getDate() - 6);

      const weekStartStr = weekStart.toISOString().slice(0, 10);
      const weekEndStr = weekEnd.toISOString().slice(0, 10);

      const activeHabits = habits.filter((h) => h.active);
      if (activeHabits.length === 0) {
        weeks.push({ label: weekStartStr.slice(5), score: 0 });
        continue;
      }

      const totalTarget = activeHabits.reduce((s, h) => s + h.frequency_per_week, 0);
      const totalCompleted = activeHabits.reduce((s, h) => {
        const count = logs.filter(
          (l) => l.habit_id === h.id && l.completed && l.date >= weekStartStr && l.date <= weekEndStr
        ).length;
        return s + Math.min(count, h.frequency_per_week);
      }, 0);

      weeks.push({
        label: weekStartStr.slice(5),
        score: totalTarget > 0 ? Math.round((totalCompleted / totalTarget) * 100) : 0,
      });
    }
    return weeks;
  }, [habits, logs]);

  // Completion rate over last 30 days (daily)
  const dailyRates = useMemo(() => {
    const rates: { date: string; rate: number }[] = [];
    const today = new Date();
    const activeHabits = habits.filter((h) => h.active);

    for (let i = 29; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().slice(0, 10);

      if (activeHabits.length === 0) {
        rates.push({ date: dateStr, rate: 0 });
        continue;
      }

      const completed = new Set(
        logs.filter((l) => l.date === dateStr && l.completed).map((l) => l.habit_id)
      );
      const rate = Math.round((completed.size / activeHabits.length) * 100);
      rates.push({ date: dateStr, rate });
    }
    return rates;
  }, [habits, logs]);

  // Best streak across all habits
  const bestStreak = useMemo(() => {
    if (habits.length === 0) return { habit: null, streak: 0 };
    let best = { habit: habits[0], streak: 0 };
    habits.forEach((h) => {
      const s = calculateLongestStreak(logs, h.id);
      if (s > best.streak) best = { habit: h, streak: s };
    });
    return best;
  }, [habits, logs]);

  // SVG dimensions for charts
  const chartW = 600;
  const chartH = 150;
  const barChartH = 200;

  // Daily completion area chart path
  const areaPath = useMemo(() => {
    if (dailyRates.length === 0) return "";
    const stepX = chartW / (dailyRates.length - 1);
    const points = dailyRates.map((d, i) => [i * stepX, chartH - (d.rate / 100) * chartH]);
    const linePath = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p[0]} ${p[1]}`).join(" ");
    return linePath;
  }, [dailyRates]);

  const areaFillPath = useMemo(() => {
    if (!areaPath) return "";
    return `${areaPath} L ${chartW} ${chartH} L 0 ${chartH} Z`;
  }, [areaPath]);

  if (habits.length === 0) {
    return (
      <FadeIn>
        <div className="glass-card rounded-2xl p-12 text-center">
          <p className="font-body text-sm text-white/40">Add habits to see analytics.</p>
        </div>
      </FadeIn>
    );
  }

  const maxWeeklyScore = Math.max(...weeklyTrend.map((w) => w.score), 1);

  return (
    <div className="space-y-6">
      {/* Summary row */}
      <FadeIn>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="glass-card rounded-xl p-3 text-center">
            <p className="font-mono text-[10px] text-white/30 uppercase tracking-widest">Weekly Score</p>
            <p className="font-mono text-sm text-blue-400">{weeklyScore}%</p>
          </div>
          <div className="glass-card rounded-xl p-3 text-center">
            <p className="font-mono text-[10px] text-white/30 uppercase tracking-widest">30d Average</p>
            <p className="font-mono text-sm text-emerald-400">
              {dailyRates.length > 0
                ? Math.round(dailyRates.reduce((s, d) => s + d.rate, 0) / dailyRates.length)
                : 0}%
            </p>
          </div>
          <div className="glass-card rounded-xl p-3 text-center">
            <p className="font-mono text-[10px] text-white/30 uppercase tracking-widest">Best Streak</p>
            <p className="font-mono text-sm text-orange-400">
              {bestStreak.streak}d {bestStreak.habit ? `(${bestStreak.habit.name})` : ""}
            </p>
          </div>
          <div className="glass-card rounded-xl p-3 text-center">
            <p className="font-mono text-[10px] text-white/30 uppercase tracking-widest">Total Logs</p>
            <p className="font-mono text-sm text-white">{logs.filter((l) => l.completed).length}</p>
          </div>
        </div>
      </FadeIn>

      {/* Daily completion rate chart */}
      <FadeIn delay={0.05}>
        <div className="glass-card rounded-2xl p-6">
          <p className="font-mono text-[10px] text-white/30 uppercase tracking-widest mb-4">
            Daily Completion Rate — Last 30 Days
          </p>
          <svg width="100%" viewBox={`0 0 ${chartW} ${chartH + 20}`} className="overflow-visible">
            {/* Grid lines */}
            {[0, 25, 50, 75, 100].map((pct) => {
              const y = chartH - (pct / 100) * chartH;
              return (
                <g key={pct}>
                  <line x1={0} y1={y} x2={chartW} y2={y} stroke="rgba(255,255,255,0.04)" />
                  <text x={-5} y={y + 3} textAnchor="end" style={{ fontSize: 8, fontFamily: "var(--font-mono)" }} className="fill-white/15">
                    {pct}
                  </text>
                </g>
              );
            })}
            {/* Area fill */}
            {areaFillPath && (
              <path d={areaFillPath} fill="url(#areaGradient)" />
            )}
            {/* Line */}
            {areaPath && (
              <path d={areaPath} fill="none" stroke="#10b981" strokeWidth={2} />
            )}
            <defs>
              <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </FadeIn>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly trend bar chart */}
        <FadeIn delay={0.1}>
          <div className="glass-card rounded-2xl p-6">
            <p className="font-mono text-[10px] text-white/30 uppercase tracking-widest mb-4">
              Weekly Score Trend
            </p>
            <svg width="100%" viewBox={`0 0 ${chartW} ${barChartH + 25}`}>
              {weeklyTrend.map((week, i) => {
                const barW = (chartW - 20) / weeklyTrend.length - 4;
                const barH = (week.score / 100) * barChartH;
                const x = i * ((chartW - 20) / weeklyTrend.length) + 10;
                const y = barChartH - barH;

                return (
                  <g key={i}>
                    <motion.rect
                      initial={{ height: 0, y: barChartH }}
                      animate={{ height: barH, y }}
                      transition={{ duration: 0.4, delay: i * 0.03 }}
                      x={x}
                      width={barW}
                      rx={3}
                      fill={week.score >= 70 ? "#10b981" : week.score >= 40 ? "#f59e0b" : "rgba(255,255,255,0.1)"}
                    />
                    <text
                      x={x + barW / 2}
                      y={barChartH + 15}
                      textAnchor="middle"
                      style={{ fontSize: 7, fontFamily: "var(--font-mono)" }}
                      className="fill-white/15"
                    >
                      {week.label}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </FadeIn>

        {/* Category performance */}
        <FadeIn delay={0.15}>
          <div className="glass-card rounded-2xl p-6">
            <p className="font-mono text-[10px] text-white/30 uppercase tracking-widest mb-4">
              Category Performance
            </p>
            <div className="space-y-4">
              {categoryScores.map((cs) => {
                if (cs.habits_count === 0) return null;
                const color = HABIT_CATEGORY_COLORS[cs.category];
                return (
                  <div key={cs.category}>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
                        <span className="font-body text-xs text-white/60">{cs.category}</span>
                        <span className="font-mono text-[9px] text-white/20">{cs.habits_count} habits</span>
                      </div>
                      <span className="font-mono text-xs" style={{ color }}>{cs.score}%</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${cs.score}%` }}
                        transition={{ duration: 0.6 }}
                        className="h-full rounded-full"
                        style={{ backgroundColor: color }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </FadeIn>
      </div>
    </div>
  );
}
